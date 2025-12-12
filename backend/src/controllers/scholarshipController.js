const vertexAI = require('../services/vertexAI');
const User = require('../models/User');
const Resume = require('../models/Resume');
const Scholarship = require('../models/Scholarship');

// In-memory cache for recommendations (30 minutes TTL)
const recommendationCache = new Map();
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes in milliseconds

// Clean expired cache entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of recommendationCache.entries()) {
    if (now - value.timestamp > CACHE_TTL) {
      recommendationCache.delete(key);
    }
  }
}, 5 * 60 * 1000);

/**
 * GET /api/scholarships - Get all scholarships with filters
 */
exports.getAllScholarships = async (req, res) => {
  try {
    const {
      category,
      domain,
      trending,
      limit = 100,
      page = 1,
      excludeCategory,  // New parameter to exclude a category
      sortBy = 'deadline'  // Default sort by deadline
    } = req.query;

    // Build filter
    const filter = { active: true };

    // Priority: excludeCategory takes precedence over category
    if (excludeCategory) {
      // Support excluding a category (e.g., exclude 'Internship' when fetching scholarships)
      filter.category = { $ne: excludeCategory };
    } else if (category && category !== 'all') {
      filter.category = category;
    }

    if (domain && domain !== 'all') {
      filter.domain = domain;
    }

    if (trending === 'true') {
      filter.trending = true;
    }

    // Calculate pagination
    const skip = (page - 1) * parseInt(limit);

    // Build sort object
    let sortObject = {};
    switch (sortBy) {
      case 'deadline':
        sortObject = { trending: -1, deadline: 1, createdAt: -1 };
        break;
      case 'amount':
        // Amount is a string, so we'll sort by trending first, then createdAt
        // Ideally, amount should be a number in the DB
        sortObject = { trending: -1, createdAt: -1 };
        break;
      case 'trending':
        sortObject = { trending: -1, createdAt: -1 };
        break;
      case 'recent':
        sortObject = { createdAt: -1 };
        break;
      default:
        sortObject = { trending: -1, deadline: 1, createdAt: -1 };
    }

    console.log('📊 Scholarship Query:', {
      filter: JSON.stringify(filter),
      sortBy,
      sortObject,
      page: parseInt(page),
      limit: parseInt(limit),
      skip
    });

    // Get scholarships
    const scholarships = await Scholarship.find(filter)
      .sort(sortObject)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count
    const total = await Scholarship.countDocuments(filter);

    res.json({
      success: true,
      data: scholarships,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Error fetching scholarships:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch scholarships'
    });
  }
};

/**
 * POST /api/scholarships/personalized - Get AI-powered personalized recommendations
 */
exports.getPersonalizedRecommendations = async (req, res) => {
  try {
    const { uid } = req.user;

    console.log(`🎯 Generating personalized recommendations for user: ${uid}`);

    // Check cache first
    const cacheKey = `scholarship_rec_${uid}`;
    const cached = recommendationCache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
      console.log(`✅ Returning cached recommendations for user: ${uid}`);
      return res.json({
        success: true,
        data: cached.data,
        meta: {
          ...cached.meta,
          fromCache: true,
          cacheAge: Math.round((Date.now() - cached.timestamp) / 1000) + ' seconds'
        }
      });
    }

    console.time('Total Recommendation Time');

    // 1. Get user profile
    console.time('Fetch User Profile');
    const user = await User.findOne({ firebaseUid: uid }).lean();
    console.timeEnd('Fetch User Profile');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found. Please complete your profile first.'
      });
    }

    // 2. Get user's latest resume (if available)
    console.time('Fetch Resume');
    const latestResume = await Resume.findOne({
      userId: uid,
      isActive: true,
      status: 'completed'
    })
    .sort({ createdAt: -1 })
    .select('atsAnalysis extractedText createdAt')
    .lean();
    console.timeEnd('Fetch Resume');

    // 3. Get relevant scholarships with smart filtering (OPTIMIZED)
    console.time('Fetch Scholarships');

    // Build smart filter based on user profile
    const scholarshipFilter = { active: true };

    // Pre-filter by domain if user has specified education/domain
    if (user.profile?.domain) {
      scholarshipFilter.$or = [
        { domain: user.profile.domain },
        { domain: 'General' },
        { domain: { $exists: false } }
      ];
    }

    // Pre-filter by category if we can infer from profile
    if (user.profile?.education) {
      const eduLower = user.profile.education.toLowerCase();
      if (eduLower.includes('undergraduate') || eduLower.includes('ug') || eduLower.includes('bachelor')) {
        scholarshipFilter.$or = scholarshipFilter.$or || [];
        if (scholarshipFilter.$or.length === 0) {
          scholarshipFilter.$or = [
            { category: 'UG' },
            { category: 'Merit-based' },
            { category: { $exists: false } }
          ];
        }
      } else if (eduLower.includes('postgraduate') || eduLower.includes('pg') || eduLower.includes('master')) {
        scholarshipFilter.$or = scholarshipFilter.$or || [];
        if (scholarshipFilter.$or.length === 0) {
          scholarshipFilter.$or = [
            { category: 'PG' },
            { category: 'Research' },
            { category: 'Merit-based' },
            { category: { $exists: false } }
          ];
        }
      }
    }

    // Fetch only top 30 most relevant scholarships (OPTIMIZED FROM FETCHING ALL)
    const allScholarships = await Scholarship.find(scholarshipFilter)
      .sort({ trending: -1, deadline: 1, createdAt: -1 }) // Prioritize trending and urgent
      .limit(30) // MAJOR OPTIMIZATION: Only get 30 instead of all
      .lean();

    console.timeEnd('Fetch Scholarships');
    console.log(`📊 Pre-filtered to ${allScholarships.length} scholarships (from filter: ${JSON.stringify(scholarshipFilter)})`);

    if (allScholarships.length === 0) {
      return res.json({
        success: true,
        data: [],
        meta: {
          message: 'No scholarships available at the moment. Check back soon!',
          totalMatches: 0
        }
      });
    }

    // 4. Build AI prompt for personalized matching (OPTIMIZED)
    console.time('Build AI Prompt');
    const prompt = buildMatchingPrompt(user, latestResume, allScholarships);
    console.timeEnd('Build AI Prompt');

    console.log('🤖 Sending request to Vertex AI...');
    console.time('AI Processing');

    // 5. Call Vertex AI for matching with optimized config
    const aiResponse = await vertexAI.generateContent(
      prompt,
      3, // retries
      {
        maxOutputTokens: 4096, // Reduced from default to speed up
        temperature: 0.1 // Lower temperature for more consistent/faster responses
      }
    );

    console.timeEnd('AI Processing');

    // 6. Parse AI response
    let matches = [];
    try {
      // Remove markdown code blocks if present
      let cleanedResponse = aiResponse.trim();

      // Remove ```json and ``` markers
      cleanedResponse = cleanedResponse.replace(/^```json\s*/i, '').replace(/```\s*$/g, '');
      cleanedResponse = cleanedResponse.replace(/^```\s*/g, '').replace(/```\s*$/g, '');

      // Extract JSON array (greedy match to get complete array)
      const jsonMatch = cleanedResponse.match(/\[[\s\S]*\]/);

      let jsonToParse = jsonMatch ? jsonMatch[0] : cleanedResponse;

      // Try to fix common JSON issues
      // 1. Fix incomplete strings by finding the last complete object
      const lastCompleteMatch = jsonToParse.lastIndexOf('}');
      if (lastCompleteMatch > 0 && !jsonToParse.endsWith(']')) {
        // JSON might be truncated, try to salvage what we can
        jsonToParse = jsonToParse.substring(0, lastCompleteMatch + 1) + ']';
      }

      // 2. Remove trailing commas before closing brackets
      jsonToParse = jsonToParse.replace(/,(\s*[\]}])/g, '$1');

      // Try parsing
      matches = JSON.parse(jsonToParse);

      // Validate that we got an array
      if (!Array.isArray(matches)) {
        throw new Error('AI response is not a JSON array');
      }

      console.log(`✅ Successfully parsed ${matches.length} scholarship matches`);

    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      console.error('AI Response (first 2000 chars):', aiResponse.substring(0, 2000));

      // Try one more time with a more aggressive extraction
      try {
        // Split by objects and try to parse each one
        const objects = [];
        let depth = 0;
        let currentObj = '';

        for (let i = 0; i < aiResponse.length; i++) {
          const char = aiResponse[i];

          if (char === '{') {
            depth++;
            currentObj += char;
          } else if (char === '}') {
            currentObj += char;
            depth--;

            if (depth === 0 && currentObj.includes('scholarshipId')) {
              try {
                const parsed = JSON.parse(currentObj);
                if (parsed.scholarshipId) {
                  objects.push(parsed);
                }
              } catch (e) {
                // Skip invalid objects
              }
              currentObj = '';
            }
          } else if (depth > 0) {
            currentObj += char;
          }
        }

        if (objects.length > 0) {
          matches = objects;
          console.log(`⚠️ Used fallback parsing, recovered ${matches.length} matches`);
        } else {
          throw new Error('Could not extract any valid scholarship objects');
        }
      } catch (fallbackError) {
        console.error('Fallback parsing also failed:', fallbackError);
        return res.status(500).json({
          success: false,
          error: 'Failed to generate recommendations. Please try again.',
          details: process.env.NODE_ENV === 'development' ? aiResponse.substring(0, 500) : undefined
        });
      }
    }

    // 7. Enrich matches with full scholarship data
    const recommendations = matches
      .map(match => {
        const scholarship = allScholarships.find(
          s => s._id.toString() === match.scholarshipId
        );

        if (!scholarship) {
          console.warn(`Scholarship ${match.scholarshipId} not found`);
          return null;
        }

        return {
          ...scholarship,
          _id: scholarship._id,
          aiRecommendation: {
            matchScore: match.matchScore || 0,
            matchReason: match.matchReason || 'Good match based on your profile',
            eligibilityStatus: match.eligibilityStatus || 'CheckDetails',
            actionSteps: match.actionSteps || [],
            priority: match.priority || 'Medium'
          }
        };
      })
      .filter(Boolean) // Remove nulls
      .sort((a, b) => b.aiRecommendation.matchScore - a.aiRecommendation.matchScore); // Sort by score

    // 8. Log activity
    if (user) {
      await User.findOneAndUpdate(
        { firebaseUid: uid },
        {
          $push: {
            activityLog: {
              $each: [{
                action: 'personalized_scholarships_viewed',
                details: {
                  count: recommendations.length,
                  hasResume: !!latestResume,
                  topMatch: recommendations[0]?.aiRecommendation?.matchScore || 0
                },
                timestamp: new Date()
              }],
              $slice: -100 // Keep only last 100 activities
            }
          }
        }
      );
    }

    console.log(`✅ Generated ${recommendations.length} personalized recommendations`);
    console.timeEnd('Total Recommendation Time');

    // Prepare response data
    const responseData = {
      totalMatches: recommendations.length,
      basedOnResume: !!latestResume,
      resumeAnalyzedOn: latestResume?.createdAt,
      generatedAt: new Date(),
      userProfile: {
        hasSkills: (user.skills?.length || 0) > 0,
        hasCareerGoal: !!user.profile?.careerGoal,
        hasEducation: !!user.profile?.education
      },
      scholarshipsAnalyzed: allScholarships.length,
      fromCache: false
    };

    // Cache the results for future requests (OPTIMIZATION)
    recommendationCache.set(cacheKey, {
      data: recommendations,
      meta: responseData,
      timestamp: Date.now()
    });

    console.log(`💾 Cached recommendations for user: ${uid} (TTL: ${CACHE_TTL / 1000}s)`);

    res.json({
      success: true,
      data: recommendations,
      meta: responseData
    });

  } catch (error) {
    console.error('❌ Error in personalized recommendations:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate personalized recommendations',
      message: error.message
    });
  }
};

/**
 * Build AI matching prompt (OPTIMIZED - Shorter & More Focused)
 */
function buildMatchingPrompt(user, resume, scholarships) {
  // Simplified user profile (only essential info)
  const profile = {
    education: user.profile?.education || 'Not specified',
    skills: user.skills?.slice(0, 10).map(s => s.name).join(', ') || 'Not specified',
    careerGoal: user.profile?.careerGoal || 'Not specified',
    domain: user.profile?.domain || 'General'
  };

  // Simplified resume (only key points)
  const resumeInfo = resume ? {
    score: resume.atsAnalysis?.overallScore || 'N/A',
    topSkills: resume.atsAnalysis?.keywordAnalysis?.found?.slice(0, 8).join(', ') || 'N/A',
    strengths: resume.atsAnalysis?.strengths?.slice(0, 3).join(', ') || 'N/A'
  } : null;

  // Simplified scholarships (only essential fields)
  const simplifiedScholarships = scholarships.map((s, i) => ({
    id: s._id,
    title: s.title,
    provider: s.provider,
    amount: s.amount,
    category: s.category,
    domain: s.domain,
    eligibility: s.eligibility.substring(0, 100), // Truncate long eligibility
    deadline: new Date(s.deadline).toLocaleDateString('en-IN')
  }));

  // OPTIMIZED PROMPT - Much shorter!
  let prompt = `You are a scholarship advisor. Match scholarships to student.

STUDENT:
Education: ${profile.education}
Skills: ${profile.skills}
Goal: ${profile.careerGoal}
Domain: ${profile.domain}`;

  if (resumeInfo) {
    prompt += `
ATS Score: ${resumeInfo.score}/100
Top Skills: ${resumeInfo.topSkills}`;
  }

  prompt += `

SCHOLARSHIPS (${simplifiedScholarships.length}):
${JSON.stringify(simplifiedScholarships, null, 0)}

TASK: Return top 8 matches as JSON array. ULTRA-SHORT strings!

FORMAT:
[{"scholarshipId":"id","matchScore":85,"matchReason":"CSE + Python match","eligibilityStatus":"Eligible","actionSteps":["Apply","Get docs"],"priority":"High"}]

RULES:
- matchScore 0-100, recommend if >=60
- matchReason MAX 50 chars
- eligibilityStatus: Eligible|MayBeEligible|CheckDetails
- priority: High|Medium|Low
- actionSteps: MAX 2, each MAX 30 chars
- NO markdown, NO explanations
- Use exact scholarshipId from list`;

  return prompt;
}

/**
 * GET /api/scholarships/:id - Get single scholarship
 */
exports.getScholarshipById = async (req, res) => {
  try {
    const { id } = req.params;

    const scholarship = await Scholarship.findById(id);

    if (!scholarship) {
      return res.status(404).json({
        success: false,
        error: 'Scholarship not found'
      });
    }

    res.json({
      success: true,
      data: scholarship
    });

  } catch (error) {
    console.error('Error fetching scholarship:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch scholarship'
    });
  }
};

/**
 * GET /api/scholarships/trending - Get trending scholarships
 */
exports.getTrendingScholarships = async (req, res) => {
  try {
    const scholarships = await Scholarship.find({
      active: true,
      trending: true
    })
      .sort({ createdAt: -1 })
      .limit(6);

    res.json({
      success: true,
      data: scholarships
    });

  } catch (error) {
    console.error('Error fetching trending scholarships:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch trending scholarships'
    });
  }
};

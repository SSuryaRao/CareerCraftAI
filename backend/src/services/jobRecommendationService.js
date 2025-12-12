const vertexAI = require('./vertexAI');
const Job = require('../models/Job');
const Resume = require('../models/Resume');
const User = require('../models/User');

// In-memory cache for job recommendations (30 minutes TTL)
const jobRecommendationCache = new Map();
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

// Clean expired cache entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of jobRecommendationCache.entries()) {
    if (now - value.timestamp > CACHE_TTL) {
      jobRecommendationCache.delete(key);
    }
  }
}, 5 * 60 * 1000);

/**
 * Job Recommendation Service
 * Uses Vertex AI (Gemini) to provide intelligent job recommendations
 */
class JobRecommendationService {
  /**
   * Get personalized job recommendations for a user
   * @param {string} firebaseUid - Firebase User ID
   * @param {Object} options - Options (limit, includeReasons)
   * @returns {Promise<Array>} Recommended jobs with match scores
   */
  async getRecommendations(firebaseUid, options = {}) {
    try {
      const {
        limit = 10,
        includeReasons = true,
        minMatchScore = 50
      } = options;

      // Check cache first (OPTIMIZATION)
      const cacheKey = `job_rec_${firebaseUid}_${limit}_${minMatchScore}`;
      const cached = jobRecommendationCache.get(cacheKey);
      if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
        console.log(`✅ Returning cached job recommendations for user: ${firebaseUid}`);
        return {
          success: true,
          recommendations: cached.recommendations,
          total: cached.total,
          fromCache: true,
          cacheAge: Math.round((Date.now() - cached.timestamp) / 1000) + 's'
        };
      }

      console.time('Total Job Recommendation Time');

      // 1. Get user profile and resume data
      console.time('Fetch User Data');
      const userData = await this.getUserData(firebaseUid);
      console.timeEnd('Fetch User Data');

      if (!userData.hasProfile) {
        return {
          success: false,
          message: 'Please complete your profile and upload a resume to get personalized recommendations',
          recommendations: []
        };
      }

      // 2. Get available jobs (active, recent) - OPTIMIZED with smarter filtering
      console.time('Fetch Jobs');
      const jobFilter = {
        isActive: true,
        postedAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // Reduced to 30 days for fresher jobs
      };

      // Pre-filter by user preferences if available
      if (userData.user?.preferences?.jobType?.length > 0) {
        jobFilter.jobType = { $in: userData.user.preferences.jobType };
      }

      const availableJobs = await Job.find(jobFilter)
      .sort({ featured: -1, postedAt: -1 }) // Prioritize featured jobs
      .limit(12) // Increased from 8 to 12 for better variety
      .select('title company description tags jobType experienceLevel location salary applicationUrl postedAt featured') // Select only needed fields
      .lean();

      console.timeEnd('Fetch Jobs');
      console.log(`📊 Fetched ${availableJobs.length} jobs for matching`);

      if (availableJobs.length === 0) {
        return {
          success: true,
          message: 'No jobs available at the moment',
          recommendations: []
        };
      }

      // 3. Use Vertex AI to match jobs
      console.time('AI Matching');
      const recommendations = await this.matchJobsWithAI(userData, availableJobs, {
        limit,
        includeReasons,
        minMatchScore
      });
      console.timeEnd('AI Matching');

      console.log(`✅ Generated ${recommendations.length} job recommendations`);
      console.timeEnd('Total Job Recommendation Time');

      // Cache the results (OPTIMIZATION)
      jobRecommendationCache.set(cacheKey, {
        recommendations,
        total: recommendations.length,
        timestamp: Date.now()
      });

      console.log(`💾 Cached job recommendations for user: ${firebaseUid} (TTL: ${CACHE_TTL / 1000}s)`);

      return {
        success: true,
        recommendations,
        total: recommendations.length,
        fromCache: false
      };

    } catch (error) {
      console.error('Error in getRecommendations:', error);
      throw error;
    }
  }

  /**
   * Get user data (profile + resume)
   * @param {string} firebaseUid - Firebase UID
   * @returns {Promise<Object>}
   */
  async getUserData(firebaseUid) {
    try {
      // Get user profile by Firebase UID
      const user = await User.findByFirebaseUid(firebaseUid);

      if (!user) {
        return { hasProfile: false };
      }

      // Get latest resume using MongoDB _id
      const resume = await Resume.findOne({ userId: user._id })
        .sort({ createdAt: -1 })
        .lean();

      return {
        hasProfile: true,
        user: {
          name: user.name || 'User',
          email: user.email,
          preferences: {
            jobType: user.preferences?.jobTypes || [],
            locations: user.preferences?.preferredLocations || [],
            remoteWork: user.preferences?.remotePreference !== 'office-based',
            salaryExpectation: user.preferences?.salaryRange || null
          }
        },
        resume: resume ? {
          skills: resume.skills || [],
          experience: resume.experience || [],
          education: resume.education || [],
          summary: resume.summary || '',
          yearsOfExperience: this.calculateYearsOfExperience(resume.experience)
        } : null
      };
    } catch (error) {
      console.error('Error fetching user data:', error);
      return { hasProfile: false };
    }
  }

  /**
   * Calculate years of experience from experience array
   * @param {Array} experience
   * @returns {number}
   */
  calculateYearsOfExperience(experience) {
    if (!experience || experience.length === 0) return 0;

    let totalMonths = 0;
    experience.forEach(exp => {
      if (exp.startDate) {
        const start = new Date(exp.startDate);
        const end = exp.current ? new Date() : (exp.endDate ? new Date(exp.endDate) : new Date());
        const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
        totalMonths += months;
      }
    });

    return Math.round(totalMonths / 12 * 10) / 10; // Round to 1 decimal
  }

  /**
   * Match jobs using Vertex AI
   * @param {Object} userData
   * @param {Array} jobs
   * @param {Object} options
   * @returns {Promise<Array>}
   */
  async matchJobsWithAI(userData, jobs, options = {}) {
    try {
      const { limit, includeReasons, minMatchScore } = options;

      // Build AI prompt
      const prompt = this.buildRecommendationPrompt(userData, jobs);

      // Call Vertex AI with increased max tokens
      console.log('🤖 Calling Vertex AI for job recommendations...');
      const aiResponse = await vertexAI.generateContent(
        prompt,
        3, // retries
        {
          maxOutputTokens: 8192, // Increased from default to allow longer responses
          temperature: 0.2 // Lower temperature for more consistent JSON formatting
        }
      );

      // Parse AI response
      const recommendations = this.parseAIRecommendations(aiResponse, jobs);

      // Filter by minimum match score
      const filtered = recommendations.filter(rec => rec.matchScore >= minMatchScore);

      // Sort by match score (descending)
      const sorted = filtered.sort((a, b) => b.matchScore - a.matchScore);

      // Limit results
      const limited = sorted.slice(0, limit);

      console.log(`✅ Generated ${limited.length} job recommendations`);

      // If AI returned 0 recommendations, fallback to basic matching
      if (limited.length === 0) {
        console.log('⚠️  AI returned 0 recommendations, falling back to basic matching');
        return this.basicJobMatching(userData, jobs, options);
      }

      return limited;

    } catch (error) {
      console.error('Error in matchJobsWithAI:', error);

      // Fallback: Basic keyword matching
      console.log('⚠️ Falling back to basic keyword matching');
      return this.basicJobMatching(userData, jobs, options);
    }
  }

  /**
   * Build AI prompt for job recommendation
   * @param {Object} userData
   * @param {Array} jobs
   * @returns {string}
   */
  buildRecommendationPrompt(userData, jobs) {
    const { user, resume } = userData;

    // Simplified jobs data (OPTIMIZED - only essential fields)
    const simplifiedJobs = jobs.map(job => ({
      id: job._id.toString(),
      title: job.title,
      company: job.company,
      desc: job.description?.substring(0, 120), // Reduced to 120 chars
      tags: job.tags?.slice(0, 4) || [], // Max 4 tags
      type: job.jobType,
      level: job.experienceLevel,
      loc: job.location
    }));

    // OPTIMIZED PROMPT - Much shorter!
    return `Career advisor: Match jobs to user.

USER:
Experience: ${resume?.yearsOfExperience || 0}y
Skills: ${resume?.skills?.slice(0, 10).join(', ') || 'Not specified'}
Recent: ${resume?.experience?.slice(0, 2).map(exp => `${exp.title} at ${exp.company}`).join('; ') || 'N/A'}
Degree: ${resume?.education?.[0]?.degree || 'N/A'}
Pref: ${user.preferences.jobType?.join(', ') || 'Any'}, ${user.preferences.remoteWork ? 'Remote' : 'Office'}

JOBS (${simplifiedJobs.length}):
${JSON.stringify(simplifiedJobs, null, 0)}

Return top ${Math.min(jobs.length, 8)} matches as JSON. ULTRA-SHORT strings!

FORMAT:
[{"jobId":"id","matchScore":80,"reason":"React+Node match","skillGaps":["AWS"],"careerFit":"Good growth","strengths":["Skills match"]}]

RULES:
- matchScore 0-100, recommend if >=50
- reason MAX 45 chars
- careerFit MAX 40 chars
- Max 2 skillGaps, 2 strengths
- NO markdown, NO extras`;
  }

  /**
   * Parse AI recommendations response
   * @param {string} aiResponse
   * @param {Array} jobs
   * @returns {Array}
   */
  parseAIRecommendations(aiResponse, jobs) {
    try {
      // Extract JSON from response (handle markdown code blocks)
      let jsonText = aiResponse.trim();

      // Remove markdown code blocks if present
      if (jsonText.startsWith('```json')) {
        jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      } else if (jsonText.startsWith('```')) {
        jsonText = jsonText.replace(/```\n?/g, '');
      }

      // Handle truncated JSON - try to recover partial data
      let recommendations;
      try {
        recommendations = JSON.parse(jsonText);
        console.log('✅ Successfully parsed complete JSON response');
      } catch (parseError) {
        console.log('⚠️ JSON parse failed, attempting to recover partial data...');
        console.log(`   Error: ${parseError.message}`);
        console.log(`   Response length: ${jsonText.length} characters`);

        // Try to fix truncated JSON by finding the last complete object
        const lastCompleteObject = this.findLastCompleteObject(jsonText);
        if (lastCompleteObject) {
          try {
            recommendations = JSON.parse(lastCompleteObject);
            console.log(`✅ Recovered ${recommendations.length} recommendations from partial JSON`);
          } catch (recoveryError) {
            console.error('❌ Recovery also failed:', recoveryError.message);
            throw parseError; // Throw original error
          }
        } else {
          console.error('❌ Could not find any complete objects in response');
          throw parseError;
        }
      }

      if (!Array.isArray(recommendations)) {
        throw new Error('AI response is not an array');
      }

      console.log(`📊 Parsed ${recommendations.length} recommendations from AI`);

      // Enrich recommendations with full job data
      return recommendations.map(rec => {
        const job = jobs.find(j => j._id.toString() === rec.jobId);
        if (!job) return null;

        return {
          ...job,
          matchScore: rec.matchScore,
          matchReason: rec.reason || 'AI-powered recommendation based on your profile',
          skillGaps: rec.skillGaps || [],
          careerFit: rec.careerFit || '',
          strengths: rec.strengths || []
        };
      }).filter(Boolean); // Remove nulls

    } catch (error) {
      console.error('Error parsing AI recommendations:', error);
      console.log('AI Response (first 1000 chars):', aiResponse.substring(0, 1000));
      throw new Error('Failed to parse AI recommendations');
    }
  }

  /**
   * Attempt to recover partial JSON from truncated response
   * @param {string} jsonText
   * @returns {string|null}
   */
  findLastCompleteObject(jsonText) {
    try {
      // Find the position of the last complete object in the array
      let depth = 0;
      let lastCompletePos = -1;
      let inString = false;
      let escapeNext = false;

      for (let i = 0; i < jsonText.length; i++) {
        const char = jsonText[i];

        if (escapeNext) {
          escapeNext = false;
          continue;
        }

        if (char === '\\') {
          escapeNext = true;
          continue;
        }

        if (char === '"' && !escapeNext) {
          inString = !inString;
          continue;
        }

        if (inString) continue;

        if (char === '{') depth++;
        if (char === '}') {
          depth--;
          if (depth === 1) { // We're back inside the main array
            lastCompletePos = i;
          }
        }
      }

      if (lastCompletePos > 0) {
        // Extract everything up to the last complete object and close the array
        let recovered = jsonText.substring(0, lastCompletePos + 1);

        // Make sure we close the array properly
        if (!recovered.trim().endsWith(']')) {
          recovered += '\n]';
        }

        return recovered;
      }

      return null;
    } catch (error) {
      console.error('Error recovering partial JSON:', error);
      return null;
    }
  }

  /**
   * Basic keyword-based job matching (fallback)
   * @param {Object} userData
   * @param {Array} jobs
   * @param {Object} options
   * @returns {Array}
   */
  basicJobMatching(userData, jobs, options = {}) {
    const { limit = 10 } = options;
    const { resume, user } = userData;

    if (!resume || !resume.skills) {
      return jobs.slice(0, limit).map(job => ({
        ...job,
        matchScore: 50,
        matchReason: 'Basic recommendation based on recent postings',
        skillGaps: [],
        careerFit: 'Complete your profile for better recommendations'
      }));
    }

    const userSkills = resume.skills.map(s => s.toLowerCase());

    // Calculate match scores
    const scoredJobs = jobs.map(job => {
      const jobTags = (job.tags || []).map(t => t.toLowerCase());
      const titleWords = job.title.toLowerCase().split(' ');

      // Count skill matches
      const skillMatches = userSkills.filter(skill =>
        jobTags.some(tag => tag.includes(skill) || skill.includes(tag)) ||
        titleWords.some(word => word.includes(skill) || skill.includes(word))
      );

      const matchScore = Math.min(100, 50 + (skillMatches.length * 10));

      return {
        ...job,
        matchScore,
        matchReason: `${skillMatches.length} of your skills match this role: ${skillMatches.slice(0, 3).join(', ')}`,
        skillGaps: [],
        careerFit: 'Good match based on your skills'
      };
    });

    // Sort and limit
    return scoredJobs
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, limit);
  }
}

module.exports = new JobRecommendationService();

const { VertexAI } = require('@google-cloud/vertexai');
const CareerAssessment = require('../models/CareerAssessment');

// Initialize Vertex AI
const vertexAI = new VertexAI({
  project: process.env.GOOGLE_CLOUD_PROJECT_ID || 'careercraftai-475216',
  location: 'us-central1'
});

const generativeModel = vertexAI.getGenerativeModel({
  model: 'gemini-1.5-flash'
});

// Question mapping for interpretation
const questionMapping = {
  1: { question: "Activities that excite you", type: "multi-choice", options: [
    "Analyzing data and finding patterns",
    "Building websites and applications",
    "Protecting systems from threats",
    "Working with cloud infrastructure",
    "Creating mobile apps",
    "Developing AI/ML models"
  ]},
  2: { question: "Mathematical and statistical skills", type: "rating", options: ["Beginner", "Basic", "Intermediate", "Advanced", "Expert"]},
  3: { question: "Preferred work environment", type: "single-choice", options: [
    "Analytical - Working with data and insights",
    "Creative - Designing and building user experiences",
    "Security-focused - Protecting and securing systems",
    "Infrastructure - Managing scalable systems",
    "User-focused - Creating mobile experiences",
    "Research-oriented - Exploring AI and algorithms"
  ]},
  4: { question: "Programming languages familiar with", type: "multi-choice", options: [
    "Python",
    "JavaScript/TypeScript",
    "Java/C++",
    "SQL",
    "Swift/Kotlin",
    "R/MATLAB"
  ]},
  5: { question: "Technology interests", type: "single-choice", options: [
    "Extracting insights from data",
    "Creating interactive web experiences",
    "Ethical hacking and security",
    "Scalable cloud solutions",
    "Mobile-first development",
    "Artificial intelligence and automation"
  ]},
  6: { question: "Problem-solving and logic skills", type: "rating", options: ["Beginner", "Basic", "Intermediate", "Advanced", "Expert"]},
  7: { question: "Educational background", type: "single-choice", options: [
    "Mathematics/Statistics",
    "Computer Science/Engineering",
    "Information Security",
    "IT/Cloud Computing",
    "Mobile Development",
    "Data Science/AI",
    "Other/Self-taught"
  ]},
  8: { question: "Tools/technologies interested in learning", type: "multi-choice", options: [
    "Pandas, NumPy, Tableau",
    "React, Node.js, databases",
    "Penetration testing, firewalls",
    "AWS, Docker, Kubernetes",
    "React Native, Flutter",
    "TensorFlow, PyTorch, NLP"
  ]}
};

// Domain mapping
const domainMapping = {
  'Data Science': {
    roles: ['Data Scientist', 'Data Analyst', 'ML Engineer', 'Data Engineer'],
    keywords: ['data', 'analysis', 'statistics', 'python', 'sql', 'pandas', 'mathematical']
  },
  'Web Development': {
    roles: ['Frontend Developer', 'Backend Developer', 'Full-Stack Developer', 'UI/UX Designer'],
    keywords: ['web', 'javascript', 'react', 'node', 'creative', 'user experience']
  },
  'Cybersecurity': {
    roles: ['Security Analyst', 'Penetration Tester', 'Security Engineer', 'Incident Response Specialist'],
    keywords: ['security', 'protecting', 'hacking', 'threats', 'firewall', 'ethical']
  },
  'Cloud Computing': {
    roles: ['Cloud Architect', 'DevOps Engineer', 'Cloud Security Engineer', 'Site Reliability Engineer'],
    keywords: ['cloud', 'infrastructure', 'aws', 'docker', 'kubernetes', 'scalable']
  },
  'Mobile Development': {
    roles: ['iOS Developer', 'Android Developer', 'Mobile App Developer', 'Cross-Platform Developer'],
    keywords: ['mobile', 'swift', 'kotlin', 'flutter', 'react native', 'user-focused']
  },
  'AI/ML': {
    roles: ['ML Engineer', 'AI Researcher', 'NLP Engineer', 'Computer Vision Engineer'],
    keywords: ['ai', 'machine learning', 'tensorflow', 'pytorch', 'nlp', 'research']
  }
};

// Convert answers to readable text
function formatAnswersForAI(answers) {
  let formattedText = "User Assessment Responses:\n\n";

  Object.keys(answers).forEach(questionId => {
    const qId = parseInt(questionId);
    const questionData = questionMapping[qId];
    const answer = answers[questionId];

    if (!questionData) return;

    formattedText += `Q${qId}: ${questionData.question}\n`;

    if (questionData.type === 'multi-choice' && Array.isArray(answer)) {
      formattedText += `Answer: ${answer.map(idx => questionData.options[idx]).join(', ')}\n\n`;
    } else if (questionData.type === 'single-choice') {
      formattedText += `Answer: ${questionData.options[answer]}\n\n`;
    } else if (questionData.type === 'rating') {
      formattedText += `Answer: ${questionData.options[answer]}\n\n`;
    }
  });

  return formattedText;
}

// Calculate domain scores based on answers
function calculateDomainScores(answers) {
  const scores = {
    'Data Science': 0,
    'Web Development': 0,
    'Cybersecurity': 0,
    'Cloud Computing': 0,
    'Mobile Development': 0,
    'AI/ML': 0
  };

  // Question 1: Activities
  if (Array.isArray(answers[1])) {
    const activities = answers[1];
    if (activities.includes(0)) scores['Data Science'] += 20;
    if (activities.includes(1)) scores['Web Development'] += 20;
    if (activities.includes(2)) scores['Cybersecurity'] += 20;
    if (activities.includes(3)) scores['Cloud Computing'] += 20;
    if (activities.includes(4)) scores['Mobile Development'] += 20;
    if (activities.includes(5)) scores['AI/ML'] += 20;
  }

  // Question 2: Math skills (important for Data Science and AI/ML)
  const mathSkill = answers[2] || 0;
  scores['Data Science'] += mathSkill * 3;
  scores['AI/ML'] += mathSkill * 3;

  // Question 3: Work environment
  const workEnv = answers[3];
  if (workEnv === 0) scores['Data Science'] += 15;
  if (workEnv === 1) scores['Web Development'] += 15;
  if (workEnv === 2) scores['Cybersecurity'] += 15;
  if (workEnv === 3) scores['Cloud Computing'] += 15;
  if (workEnv === 4) scores['Mobile Development'] += 15;
  if (workEnv === 5) scores['AI/ML'] += 15;

  // Question 4: Programming languages
  if (Array.isArray(answers[4])) {
    const langs = answers[4];
    if (langs.includes(0)) { // Python
      scores['Data Science'] += 10;
      scores['AI/ML'] += 10;
    }
    if (langs.includes(1)) { // JavaScript
      scores['Web Development'] += 10;
      scores['Mobile Development'] += 5;
    }
    if (langs.includes(2)) { // Java/C++
      scores['Cybersecurity'] += 5;
      scores['Cloud Computing'] += 5;
    }
    if (langs.includes(3)) { // SQL
      scores['Data Science'] += 8;
      scores['Web Development'] += 5;
    }
    if (langs.includes(4)) { // Swift/Kotlin
      scores['Mobile Development'] += 10;
    }
    if (langs.includes(5)) { // R/MATLAB
      scores['Data Science'] += 10;
      scores['AI/ML'] += 8;
    }
  }

  // Question 5: Technology interests
  const techInterest = answers[5];
  if (techInterest === 0) scores['Data Science'] += 15;
  if (techInterest === 1) scores['Web Development'] += 15;
  if (techInterest === 2) scores['Cybersecurity'] += 15;
  if (techInterest === 3) scores['Cloud Computing'] += 15;
  if (techInterest === 4) scores['Mobile Development'] += 15;
  if (techInterest === 5) scores['AI/ML'] += 15;

  // Question 6: Problem-solving skills
  const problemSolving = answers[6] || 0;
  scores['Data Science'] += problemSolving * 2;
  scores['Cybersecurity'] += problemSolving * 2;
  scores['AI/ML'] += problemSolving * 2;

  // Question 7: Educational background
  const education = answers[7];
  if (education === 0) scores['Data Science'] += 12;
  if (education === 1) scores['Web Development'] += 10;
  if (education === 2) scores['Cybersecurity'] += 12;
  if (education === 3) scores['Cloud Computing'] += 12;
  if (education === 4) scores['Mobile Development'] += 12;
  if (education === 5) scores['AI/ML'] += 12;

  // Question 8: Tools interest
  if (Array.isArray(answers[8])) {
    const tools = answers[8];
    if (tools.includes(0)) scores['Data Science'] += 12;
    if (tools.includes(1)) scores['Web Development'] += 12;
    if (tools.includes(2)) scores['Cybersecurity'] += 12;
    if (tools.includes(3)) scores['Cloud Computing'] += 12;
    if (tools.includes(4)) scores['Mobile Development'] += 12;
    if (tools.includes(5)) scores['AI/ML'] += 12;
  }

  // Normalize scores to 0-100
  const maxScore = Math.max(...Object.values(scores));
  if (maxScore > 0) {
    Object.keys(scores).forEach(domain => {
      scores[domain] = Math.round((scores[domain] / maxScore) * 100);
    });
  }

  return scores;
}

// Generate AI-powered career recommendations
exports.getCareerRecommendations = async (req, res) => {
  try {
    const { userId, answers } = req.body;

    if (!answers || Object.keys(answers).length === 0) {
      return res.status(400).json({ error: 'No answers provided' });
    }

    // Calculate domain scores
    const domainScores = calculateDomainScores(answers);

    // Sort domains by score
    const sortedDomains = Object.entries(domainScores)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3); // Top 3 recommendations

    // Format answers for AI
    const formattedAnswers = formatAnswersForAI(answers);

    // Generate AI reasoning for each recommendation
    const recommendations = await Promise.all(
      sortedDomains.map(async ([domain, confidence]) => {
        const prompt = `${formattedAnswers}

Based on the user's assessment responses above, they have been matched with the career domain: "${domain}" with a confidence score of ${confidence}%.

Provide a personalized 2-3 sentence explanation for why this domain is a good fit for them. Be specific and reference their interests, skills, and preferences from their responses. Make it encouraging and actionable.

Format: Just provide the reasoning text, nothing else.`;

        try {
          const result = await generativeModel.generateContent(prompt);
          const response = result.response;
          const reasoning = response.candidates[0].content.parts[0].text.trim();

          return {
            domain,
            confidence,
            roles: domainMapping[domain].roles,
            reasoning
          };
        } catch (error) {
          console.error(`Error generating reasoning for ${domain}:`, error);
          // Fallback reasoning
          return {
            domain,
            confidence,
            roles: domainMapping[domain].roles,
            reasoning: `Your responses indicate strong alignment with ${domain}. This field matches your interests and skills well.`
          };
        }
      })
    );

    // Save to database
    if (userId) {
      const assessment = new CareerAssessment({
        userId,
        answers: new Map(Object.entries(answers)),
        recommendations
      });
      await assessment.save();
    }

    res.json({ recommendations });

  } catch (error) {
    console.error('Error in career recommendations:', error);
    res.status(500).json({
      error: 'Failed to generate recommendations',
      details: error.message
    });
  }
};

// Get user's assessment history
exports.getAssessmentHistory = async (req, res) => {
  try {
    const { userId } = req.params;

    const assessments = await CareerAssessment.find({ userId })
      .sort({ completedAt: -1 })
      .limit(10);

    res.json({ assessments });

  } catch (error) {
    console.error('Error fetching assessment history:', error);
    res.status(500).json({
      error: 'Failed to fetch assessment history',
      details: error.message
    });
  }
};

// Get latest assessment
exports.getLatestAssessment = async (req, res) => {
  try {
    const { userId } = req.params;

    const assessment = await CareerAssessment.findOne({ userId })
      .sort({ completedAt: -1 });

    if (!assessment) {
      return res.status(404).json({ error: 'No assessment found' });
    }

    res.json({ assessment });

  } catch (error) {
    console.error('Error fetching latest assessment:', error);
    res.status(500).json({
      error: 'Failed to fetch latest assessment',
      details: error.message
    });
  }
};

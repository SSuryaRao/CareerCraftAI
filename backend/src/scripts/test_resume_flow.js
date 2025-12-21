require('dotenv').config();
const fineTunedAI = require('../services/fineTunedAI');

/**
 * End-to-End Resume Analysis Flow Test
 * Simulates the exact flow from resumeController.js
 */
async function testResumeFlow() {
  console.log('=== END-TO-END RESUME ANALYSIS FLOW TEST ===\n');

  // Step 1: Check service configuration
  console.log('📊 Step 1: Checking service status...');
  const status = fineTunedAI.getStatus();
  console.log(JSON.stringify(status, null, 2));

  if (!fineTunedAI.isReady()) {
    console.error('❌ Service not ready! Check your environment variables.');
    return;
  }
  console.log('✅ Service ready!\n');

  // Step 2: Simulate extracted resume text
  console.log('📄 Step 2: Preparing sample resume text...');
  const sampleResumeText = `
JOHN DOE
Full Stack Developer
Email: john.doe@example.com | Phone: +91-9876543210 | LinkedIn: linkedin.com/in/johndoe

PROFESSIONAL SUMMARY
Results-driven Full Stack Developer with 4+ years of experience building scalable web applications.
Proficient in React, Node.js, Python, and cloud technologies. Proven track record of delivering
high-quality solutions in fast-paced environments.

TECHNICAL SKILLS
Frontend: React.js, Next.js, TypeScript, JavaScript, HTML5, CSS3, Tailwind CSS, Redux
Backend: Node.js, Express.js, Python, Django, REST APIs, GraphQL
Databases: MongoDB, PostgreSQL, MySQL, Redis
Cloud & DevOps: AWS (EC2, S3, Lambda), Docker, Kubernetes, CI/CD, GitHub Actions
Tools: Git, JIRA, VS Code, Postman, Jest, Webpack

PROFESSIONAL EXPERIENCE

Senior Full Stack Developer | Tech Solutions Pvt Ltd | Mumbai, India | Jan 2022 - Present
• Led a team of 5 developers in building a SaaS platform serving 10,000+ users
• Architected microservices infrastructure reducing API response time by 60%
• Implemented automated testing achieving 85% code coverage
• Migrated legacy monolith to containerized services using Docker and Kubernetes
• Collaborated with product team to deliver 15+ features in agile sprints

Full Stack Developer | StartupCo | Bangalore, India | Jun 2020 - Dec 2021
• Developed RESTful APIs using Node.js and Express serving 50,000+ requests/day
• Built responsive React dashboards improving user engagement by 40%
• Optimized database queries reducing load time from 3s to 500ms
• Integrated third-party payment gateways (Razorpay, Stripe)
• Mentored 2 junior developers in modern JavaScript and React best practices

Junior Developer | IT Services Ltd | Pune, India | Jul 2019 - May 2020
• Created dynamic web applications using JavaScript, HTML, and CSS
• Fixed 100+ bugs and implemented new features for client projects
• Participated in code reviews and followed agile development practices
• Learned React and Node.js through internal training programs

EDUCATION
Bachelor of Technology in Computer Science Engineering
Mumbai University | 2015 - 2019 | CGPA: 8.5/10

CERTIFICATIONS
• AWS Certified Developer Associate (2023)
• MongoDB Certified Developer (2022)
• React Advanced Patterns Course - Frontend Masters (2021)

PROJECTS
E-Commerce Platform (Personal Project)
• Built a full-stack e-commerce application using MERN stack
• Integrated Razorpay for payments and Firebase for authentication
• Deployed on AWS with auto-scaling and load balancing
• Tech Stack: React, Node.js, MongoDB, AWS, Docker

Real-Time Chat Application
• Developed WebSocket-based chat app using Socket.io
• Implemented JWT authentication and message encryption
• Tech Stack: React, Node.js, Socket.io, Redis

ACHIEVEMENTS
• Won "Best Innovation Award" at Tech Solutions Pvt Ltd (2023)
• Published 5 technical articles on Medium with 10K+ views
• Active contributor to open-source projects on GitHub

LANGUAGES
• English (Fluent)
• Hindi (Native)
  `.trim();

  console.log(`✅ Resume text prepared (${sampleResumeText.length} characters)\n`);

  // Step 3: Simulate the exact flow from resumeController.js
  console.log('🤖 Step 3: Running AI analysis (same flow as controller)...\n');

  const structuredData = null; // Simulating no Document AI data

  try {
    const startTime = Date.now();

    // This is the EXACT prompt from resumeController.js (line 344-422)
    const prompt = `You are an expert ATS (Applicant Tracking System) resume analyzer specializing in the Indian job market. Analyze this resume and provide actionable feedback.

RESUME TEXT:
${sampleResumeText.substring(0, 15000)}

Analyze the resume thoroughly and return your analysis as VALID JSON ONLY (no markdown, no code blocks, no extra text).

Your response must match this exact JSON structure:

{
  "overallScore": <number 0-100>,
  "scores": {
    "keywords": <number 0-100>,
    "formatting": <number 0-100>,
    "experience": <number 0-100>,
    "skills": <number 0-100>
  },
  "suggestions": [
    {
      "section": "<section name>",
      "issue": "<what's wrong>",
      "improvement": "<how to fix it>",
      "beforeAfter": {
        "before": "<example of current text>",
        "after": "<example of improved text>"
      },
      "priority": "critical|high|medium|low"
    }
  ],
  "keywordAnalysis": {
    "found": ["<relevant keywords found in resume>"],
    "missing": ["<important keywords missing>"],
    "suggested": ["<keywords to add for better ATS score>"],
    "density": <number 0-100>
  },
  "strengths": ["<what the resume does well>"],
  "weaknesses": ["<areas needing improvement>"]
}

CRITICAL RULES:
- Return ONLY the JSON object, no markdown formatting
- Ensure all JSON strings are properly quoted and escaped
- All arrays must be properly formatted
- No trailing commas
- Provide specific, actionable feedback`;

    // Use the EXACT method call from resumeController.js (line 429-433)
    console.log('🎯 Calling fineTunedAI.generateContent()...\n');
    const responseText = await fineTunedAI.generateContent(
      prompt,
      3, // 3 retries
      { maxOutputTokens: 16384, temperature: 0.3 }
    );

    const duration = Date.now() - startTime;

    console.log(`\n✅ AI Response received in ${duration}ms\n`);
    console.log('📝 Response length:', responseText.length, 'characters');
    console.log('📝 Response preview:', responseText.substring(0, 300) + '...\n');

    // Step 4: Parse JSON (same as controller)
    console.log('🔍 Step 4: Parsing JSON response...');

    let jsonResponse = responseText.trim();

    // Extract JSON if wrapped in markdown (same logic as controller)
    if (jsonResponse.includes('```json')) {
      const jsonMatch = jsonResponse.match(/```json\s*\n([\s\S]*?)\n\s*```/);
      jsonResponse = jsonMatch ? jsonMatch[1].trim() : jsonResponse;
    } else if (jsonResponse.includes('```')) {
      const jsonMatch = jsonResponse.match(/```\s*\n([\s\S]*?)\n\s*```/);
      jsonResponse = jsonMatch ? jsonMatch[1].trim() : jsonResponse;
    }

    jsonResponse = jsonResponse.replace(/^```json\s*/g, '').replace(/^```\s*/g, '').replace(/\s*```$/g, '');

    const analysis = JSON.parse(jsonResponse);
    console.log('✅ JSON parsed successfully!\n');

    // Step 5: Display results
    console.log('=== ANALYSIS RESULTS ===\n');
    console.log('📊 Overall Score:', analysis.overallScore);
    console.log('\n🎯 Individual Scores:');
    console.log('  - Keywords:', analysis.scores.keywords);
    console.log('  - Formatting:', analysis.scores.formatting);
    console.log('  - Experience:', analysis.scores.experience);
    console.log('  - Skills:', analysis.scores.skills);

    console.log('\n💡 Suggestions:', analysis.suggestions.length);
    if (analysis.suggestions.length > 0) {
      console.log('\nTop 3 Suggestions:');
      analysis.suggestions.slice(0, 3).forEach((s, i) => {
        console.log(`  ${i + 1}. [${s.priority?.toUpperCase() || 'MEDIUM'}] ${s.section}: ${s.issue}`);
      });
    }

    console.log('\n🔑 Keyword Analysis:');
    console.log('  - Found:', analysis.keywordAnalysis.found.length, 'keywords');
    console.log('  - Missing:', analysis.keywordAnalysis.missing.length, 'keywords');
    console.log('  - Density:', analysis.keywordAnalysis.density);

    console.log('\n💪 Strengths:', analysis.strengths.length);
    console.log('⚠️  Weaknesses:', analysis.weaknesses.length);

    console.log('\n' + '='.repeat(60));
    console.log('✅ END-TO-END TEST SUCCESSFUL!');
    console.log('='.repeat(60));
    console.log('\n🎉 The fine-tuned model is working perfectly for resume analysis!');
    console.log(`⏱️  Total processing time: ${duration}ms (~${(duration / 1000).toFixed(1)}s)`);

  } catch (error) {
    console.error('\n❌ TEST FAILED:\n');
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    }
    console.error('\nStack:', error.stack);
  }
}

// Run the test
console.log('Starting end-to-end resume analysis flow test...\n');
testResumeFlow().catch(console.error);

require('dotenv').config();
const fineTunedAI = require('../services/fineTunedAI');
const vertexAI = require('../services/vertexAI');

/**
 * Model Comparison Test
 * Compares fine-tuned model vs base Vertex AI model
 */
async function compareModels() {
  console.log('=== MODEL COMPARISON TEST ===\n');
  console.log('Comparing Fine-Tuned Model vs Base Vertex AI Model\n');
  console.log('='.repeat(80) + '\n');

  // Sample resume text
  const sampleResumeText = `
JOHN DOE
Full Stack Developer
Email: john.doe@example.com | Phone: +91-9876543210

PROFESSIONAL SUMMARY
Results-driven Full Stack Developer with 4+ years of experience building scalable web applications.
Proficient in React, Node.js, Python, and cloud technologies.

TECHNICAL SKILLS
Frontend: React.js, Next.js, TypeScript, JavaScript, HTML5, CSS3, Tailwind CSS
Backend: Node.js, Express.js, Python, Django, REST APIs
Databases: MongoDB, PostgreSQL, MySQL, Redis
Cloud: AWS (EC2, S3, Lambda), Docker, Kubernetes, CI/CD

PROFESSIONAL EXPERIENCE

Senior Full Stack Developer | Tech Solutions Pvt Ltd | Mumbai | Jan 2022 - Present
• Led a team of 5 developers in building a SaaS platform serving 10,000+ users
• Architected microservices infrastructure reducing API response time by 60%
• Implemented automated testing achieving 85% code coverage
• Migrated legacy monolith to containerized services using Docker and Kubernetes

Full Stack Developer | StartupCo | Bangalore | Jun 2020 - Dec 2021
• Developed RESTful APIs using Node.js and Express serving 50,000+ requests/day
• Built responsive React dashboards improving user engagement by 40%
• Optimized database queries reducing load time from 3s to 500ms
• Integrated third-party payment gateways (Razorpay, Stripe)

EDUCATION
Bachelor of Technology in Computer Science Engineering
Mumbai University | 2015 - 2019 | CGPA: 8.5/10

CERTIFICATIONS
• AWS Certified Developer Associate (2023)
• MongoDB Certified Developer (2022)

PROJECTS
E-Commerce Platform - Built full-stack e-commerce using MERN stack
Real-Time Chat App - Developed WebSocket chat using Socket.io
  `.trim();

  // Prompt (same as resumeController.js)
  const prompt = `You are an expert ATS (Applicant Tracking System) resume analyzer specializing in the Indian job market. Analyze this resume and provide actionable feedback.

RESUME TEXT:
${sampleResumeText}

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
      "priority": "critical|high|medium|low"
    }
  ],
  "keywordAnalysis": {
    "found": ["<relevant keywords found>"],
    "missing": ["<important keywords missing>"],
    "suggested": ["<keywords to add>"],
    "density": <number 0-100>
  },
  "strengths": ["<what the resume does well>"],
  "weaknesses": ["<areas needing improvement>"]
}

CRITICAL RULES:
- Return ONLY the JSON object, no markdown formatting
- Provide specific, actionable feedback`;

  const results = {
    fineTuned: null,
    base: null
  };

  // Test 1: Fine-Tuned Model
  console.log('🎯 TEST 1: FINE-TUNED MODEL');
  console.log('─'.repeat(80));

  if (fineTunedAI.isReady()) {
    try {
      console.log('📊 Model: career-advisor-resume-analyzer-v1 (Fine-Tuned)');
      console.log('🔗 Endpoint:', fineTunedAI.endpointId);
      console.log('⏱️  Starting analysis...\n');

      const startTime1 = Date.now();
      const response1 = await fineTunedAI.generateContent(
        prompt,
        3,
        { maxOutputTokens: 16384, temperature: 0.3 }
      );
      const duration1 = Date.now() - startTime1;

      // Parse response
      let jsonResponse1 = response1.trim()
        .replace(/```json\s*/g, '')
        .replace(/```\s*/g, '')
        .replace(/^[^{]*/, '');

      const analysis1 = JSON.parse(jsonResponse1);

      results.fineTuned = {
        duration: duration1,
        responseLength: response1.length,
        analysis: analysis1,
        success: true
      };

      console.log(`✅ Success in ${duration1}ms (${(duration1 / 1000).toFixed(2)}s)`);
      console.log(`📏 Response: ${response1.length} characters`);
      console.log(`📊 Score: ${analysis1.overallScore}/100`);
      console.log(`💡 Suggestions: ${analysis1.suggestions.length}`);
      console.log(`🔑 Keywords Found: ${analysis1.keywordAnalysis.found.length}`);

    } catch (error) {
      results.fineTuned = { success: false, error: error.message };
      console.error(`❌ Failed: ${error.message}`);
    }
  } else {
    console.log('⚠️  Fine-tuned model not configured');
    results.fineTuned = { success: false, error: 'Not configured' };
  }

  console.log('\n' + '='.repeat(80) + '\n');

  // Test 2: Base Vertex AI Model
  console.log('🤖 TEST 2: BASE VERTEX AI MODEL');
  console.log('─'.repeat(80));

  if (vertexAI.isReady()) {
    try {
      console.log('📊 Model: gemini-2.5-flash (Base Model)');
      console.log('⏱️  Starting analysis...\n');

      const startTime2 = Date.now();
      const response2 = await vertexAI.generateContent(
        prompt,
        3,
        { maxOutputTokens: 16384, temperature: 0.3 }
      );
      const duration2 = Date.now() - startTime2;

      // Parse response
      let jsonResponse2 = response2.trim()
        .replace(/```json\s*/g, '')
        .replace(/```\s*/g, '')
        .replace(/^[^{]*/, '');

      const analysis2 = JSON.parse(jsonResponse2);

      results.base = {
        duration: duration2,
        responseLength: response2.length,
        analysis: analysis2,
        success: true
      };

      console.log(`✅ Success in ${duration2}ms (${(duration2 / 1000).toFixed(2)}s)`);
      console.log(`📏 Response: ${response2.length} characters`);
      console.log(`📊 Score: ${analysis2.overallScore}/100`);
      console.log(`💡 Suggestions: ${analysis2.suggestions.length}`);
      console.log(`🔑 Keywords Found: ${analysis2.keywordAnalysis.found.length}`);

    } catch (error) {
      results.base = { success: false, error: error.message };
      console.error(`❌ Failed: ${error.message}`);
    }
  } else {
    console.log('⚠️  Base model not configured');
    results.base = { success: false, error: 'Not configured' };
  }

  console.log('\n' + '='.repeat(80) + '\n');

  // Comparison Summary
  console.log('📊 COMPARISON SUMMARY');
  console.log('='.repeat(80) + '\n');

  if (results.fineTuned?.success && results.base?.success) {
    const timeDiff = results.fineTuned.duration - results.base.duration;
    const timePercent = ((timeDiff / results.base.duration) * 100).toFixed(1);

    console.log('⏱️  RESPONSE TIME:');
    console.log(`   Fine-Tuned: ${(results.fineTuned.duration / 1000).toFixed(2)}s`);
    console.log(`   Base Model: ${(results.base.duration / 1000).toFixed(2)}s`);

    if (timeDiff > 0) {
      console.log(`   → Fine-tuned is ${timePercent}% SLOWER (${(Math.abs(timeDiff) / 1000).toFixed(2)}s slower)`);
    } else {
      console.log(`   → Fine-tuned is ${Math.abs(timePercent)}% FASTER (${(Math.abs(timeDiff) / 1000).toFixed(2)}s faster)`);
    }

    console.log('\n📏 RESPONSE LENGTH:');
    console.log(`   Fine-Tuned: ${results.fineTuned.responseLength} chars`);
    console.log(`   Base Model: ${results.base.responseLength} chars`);

    console.log('\n📊 OVERALL SCORES:');
    console.log(`   Fine-Tuned: ${results.fineTuned.analysis.overallScore}/100`);
    console.log(`   Base Model: ${results.base.analysis.overallScore}/100`);
    console.log(`   Difference: ${results.fineTuned.analysis.overallScore - results.base.analysis.overallScore} points`);

    console.log('\n💡 SUGGESTIONS COUNT:');
    console.log(`   Fine-Tuned: ${results.fineTuned.analysis.suggestions.length}`);
    console.log(`   Base Model: ${results.base.analysis.suggestions.length}`);

    console.log('\n🔑 KEYWORDS FOUND:');
    console.log(`   Fine-Tuned: ${results.fineTuned.analysis.keywordAnalysis.found.length}`);
    console.log(`   Base Model: ${results.base.analysis.keywordAnalysis.found.length}`);

    console.log('\n🎯 QUALITY COMPARISON:');
    console.log('   Fine-Tuned Strengths:');
    console.log('   - Trained on 2,483 resume examples');
    console.log('   - Specialized for ATS analysis');
    console.log('   - Consistent JSON structure');
    console.log('   - Priority-based suggestions');

    console.log('\n   Base Model Strengths:');
    console.log('   - General-purpose reasoning');
    console.log('   - Broader knowledge base');
    console.log('   - Latest Gemini capabilities');

    console.log('\n' + '='.repeat(80));

    // Winner
    const winner = timeDiff < 0 ? '🏆 FINE-TUNED MODEL WINS (FASTER)' :
                   timeDiff > 0 ? '🏆 BASE MODEL WINS (FASTER)' :
                   '🤝 TIE (SAME SPEED)';

    console.log(`\n${winner}`);
    console.log('='.repeat(80));

  } else {
    console.log('⚠️  Cannot compare - one or both models failed\n');

    if (results.fineTuned?.success === false) {
      console.log(`Fine-Tuned Error: ${results.fineTuned.error}`);
    }
    if (results.base?.success === false) {
      console.log(`Base Model Error: ${results.base.error}`);
    }
  }

  console.log('\n✅ Comparison test complete!\n');
}

// Run comparison
console.log('Starting model comparison test...\n');
compareModels().catch(console.error);

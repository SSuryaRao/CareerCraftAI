require('dotenv').config();
const fineTunedAI = require('../services/fineTunedAI');

async function testUpdatedService() {
  console.log('=== TESTING UPDATED FINE-TUNED SERVICE ===\n');

  // Check service status
  console.log('📊 Service Status:');
  const status = fineTunedAI.getStatus();
  console.log(JSON.stringify(status, null, 2));
  console.log();

  if (!fineTunedAI.isReady()) {
    console.error('❌ Service is not ready!');
    return;
  }

  console.log('✅ Service is ready!\n');

  // Test resume analysis with a sample resume
  const sampleResume = `
John Doe
Software Engineer
Email: john.doe@email.com | Phone: (555) 123-4567

SUMMARY
Results-driven software engineer with 5+ years of experience in full-stack web development.
Proficient in JavaScript, React, Node.js, and cloud technologies.

EXPERIENCE
Senior Software Engineer | Tech Company Inc. | 2020 - Present
- Developed scalable web applications using React and Node.js
- Implemented CI/CD pipelines using GitHub Actions
- Mentored junior developers and led code reviews

Software Engineer | Startup Co. | 2018 - 2020
- Built REST APIs using Express.js and MongoDB
- Optimized database queries improving performance by 40%
- Collaborated with cross-functional teams in Agile environment

EDUCATION
Bachelor of Science in Computer Science | University Name | 2018
GPA: 3.8/4.0

SKILLS
Programming: JavaScript, TypeScript, Python, Java
Frontend: React, Vue.js, HTML5, CSS3, Tailwind
Backend: Node.js, Express.js, Django, REST APIs
Databases: MongoDB, PostgreSQL, Redis
Tools: Git, Docker, AWS, CI/CD
  `;

  try {
    console.log('🎯 Testing Resume Analysis...\n');
    console.log('Sample Resume Preview:');
    console.log(sampleResume.substring(0, 300) + '...\n');

    const startTime = Date.now();
    const result = await fineTunedAI.analyzeResume(sampleResume);
    const duration = Date.now() - startTime;

    console.log('\n✅ ANALYSIS COMPLETE!\n');
    console.log(`⏱️  Duration: ${duration}ms\n`);
    console.log('📊 Results:');
    console.log(JSON.stringify(result, null, 2));

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

testUpdatedService().catch(console.error);

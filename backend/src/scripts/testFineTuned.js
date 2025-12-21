/**
 * Simple test of fine-tuned model
 */

require('dotenv').config();
const fineTunedAI = require('../services/fineTunedAI');

const SAMPLE_RESUME = `
SENIOR SOFTWARE ENGINEER

Summary
Experienced software engineer with 8+ years in full-stack development.

Experience
Senior Software Engineer - Tech Corp Inc.
Jan 2020 - Present
• Lead development of microservices architecture
• Reduced API response time by 60%

Skills
JavaScript, Node.js, React, AWS, Docker
`;

async function test() {
  console.log('🧪 Testing Fine-Tuned Model\n');

  if (!fineTunedAI.isReady()) {
    console.error('❌ Fine-tuned model not ready');
    return;
  }

  const prompt = `Analyze this resume for ATS compatibility and provide detailed feedback.

RESUME TEXT:
${SAMPLE_RESUME}

Provide your analysis in JSON format with overall score (0-100), individual scores for keywords/formatting/experience/skills, improvement suggestions with priority levels, keyword analysis with found/missing/suggested keywords, and lists of strengths and weaknesses.`;

  try {
    console.log('📤 Sending request to fine-tuned model...\n');

    const response = await fineTunedAI.generateContent(prompt, 1);

    console.log('\n✅ Raw Response:');
    console.log('='.repeat(80));
    console.log(response);
    console.log('='.repeat(80));

    // Try to parse as JSON
    try {
      const cleaned = response.trim()
        .replace(/```json\s*/g, '')
        .replace(/```\s*/g, '');

      const json = JSON.parse(cleaned);
      console.log('\n✅ Successfully parsed JSON:');
      console.log(JSON.stringify(json, null, 2));
    } catch (parseError) {
      console.error('\n❌ Failed to parse JSON:', parseError.message);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
  }
}

test();

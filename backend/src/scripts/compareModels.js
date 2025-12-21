/**
 * Compare Base Model vs Fine-Tuned Model Performance
 *
 * This script tests both the base Gemini model and the fine-tuned model
 * on the same resume to compare their performance
 *
 * Usage:
 *   node src/scripts/compareModels.js
 *   node src/scripts/compareModels.js "path/to/resume.txt"
 */

require('dotenv').config();
const fs = require('fs').promises;
const path = require('path');
const vertexAI = require('../services/vertexAI');
const fineTunedAI = require('../services/fineTunedAI');

// Sample resume for testing
const SAMPLE_RESUME = `
SENIOR SOFTWARE ENGINEER

Summary
Experienced software engineer with 8+ years in full-stack development, cloud architecture, and team leadership.
Proven track record of delivering scalable applications and mentoring junior developers.

Experience

Senior Software Engineer
Tech Corp Inc. - San Francisco, CA
Jan 2020 - Present
• Lead development of microservices architecture serving 5M+ users
• Reduced API response time by 60% through optimization
• Mentor team of 5 junior developers
• Technologies: Node.js, React, AWS, Docker, Kubernetes

Software Engineer
StartupXYZ - New York, NY
Jun 2016 - Dec 2019
• Developed customer-facing web applications
• Implemented CI/CD pipeline reducing deployment time by 40%
• Collaborated with product team on feature planning

Education
Bachelor of Science in Computer Science
University of California, Berkeley
2012 - 2016

Skills
JavaScript, TypeScript, Python, Node.js, React, Vue.js, AWS, Docker, Kubernetes,
MongoDB, PostgreSQL, Redis, Git, Agile, Scrum
`;

/**
 * Analyze resume with base model
 */
async function analyzeWithBaseModel(resumeText) {
  console.log('\n🤖 Analyzing with BASE MODEL (Gemini)...\n');

  const prompt = `Analyze this resume for ATS compatibility and provide detailed feedback.

RESUME TEXT:
${resumeText}

Provide your analysis in JSON format with overall score (0-100), individual scores for keywords/formatting/experience/skills, improvement suggestions with priority levels, keyword analysis with found/missing/suggested keywords, and lists of strengths and weaknesses.`;

  const startTime = Date.now();

  try {
    const responseText = await vertexAI.generateContent(
      prompt,
      2,
      { maxOutputTokens: 8192, temperature: 0.3 }
    );

    const elapsedTime = Date.now() - startTime;

    // Parse JSON response
    let jsonResponse = responseText.trim()
      .replace(/```json\s*/g, '')
      .replace(/```\s*/g, '')
      .replace(/^[^{]*/, '');

    const analysis = JSON.parse(jsonResponse);

    return {
      analysis: {
        ...analysis,
        modelType: 'base',
        modelName: vertexAI.modelName
      },
      responseTime: elapsedTime,
      responseLength: responseText.length
    };

  } catch (error) {
    console.error('❌ Base model analysis failed:', error.message);
    return {
      error: error.message,
      responseTime: Date.now() - startTime
    };
  }
}

/**
 * Analyze resume with fine-tuned model
 */
async function analyzeWithFineTunedModel(resumeText) {
  console.log('\n🎯 Analyzing with FINE-TUNED MODEL...\n');

  const startTime = Date.now();

  try {
    const analysis = await fineTunedAI.analyzeResume(resumeText, 2);
    const elapsedTime = Date.now() - startTime;

    return {
      analysis,
      responseTime: elapsedTime,
      responseLength: JSON.stringify(analysis).length
    };

  } catch (error) {
    console.error('❌ Fine-tuned model analysis failed:', error.message);
    return {
      error: error.message,
      responseTime: Date.now() - startTime
    };
  }
}

/**
 * Print comparison results
 */
function printComparison(baseResult, fineTunedResult) {
  console.log('\n' + '='.repeat(80));
  console.log('📊 MODEL COMPARISON RESULTS');
  console.log('='.repeat(80));

  // Response times
  console.log('\n⏱️  RESPONSE TIMES:');
  console.log(`   Base Model:       ${baseResult.responseTime}ms`);
  console.log(`   Fine-Tuned Model: ${fineTunedResult.responseTime}ms`);
  const speedup = ((baseResult.responseTime / fineTunedResult.responseTime - 1) * 100).toFixed(1);
  if (fineTunedResult.responseTime < baseResult.responseTime) {
    console.log(`   ✅ Fine-tuned is ${Math.abs(speedup)}% faster`);
  } else {
    console.log(`   ⚠️  Base model is ${Math.abs(speedup)}% faster`);
  }

  // Overall scores
  if (!baseResult.error && !fineTunedResult.error) {
    console.log('\n📈 OVERALL SCORES:');
    console.log(`   Base Model:       ${baseResult.analysis.overallScore}/100`);
    console.log(`   Fine-Tuned Model: ${fineTunedResult.analysis.overallScore}/100`);
    console.log(`   Score Difference: ${Math.abs(baseResult.analysis.overallScore - fineTunedResult.analysis.overallScore)} points`);

    // Individual scores
    console.log('\n📊 INDIVIDUAL SCORES:');
    console.log('                      Base   |  Fine-Tuned');
    console.log('   Keywords:         ', baseResult.analysis.scores?.keywords || 0, '  |  ', fineTunedResult.analysis.scores?.keywords || 0);
    console.log('   Formatting:       ', baseResult.analysis.scores?.formatting || 0, '  |  ', fineTunedResult.analysis.scores?.formatting || 0);
    console.log('   Experience:       ', baseResult.analysis.scores?.experience || 0, '  |  ', fineTunedResult.analysis.scores?.experience || 0);
    console.log('   Skills:           ', baseResult.analysis.scores?.skills || 0, '  |  ', fineTunedResult.analysis.scores?.skills || 0);

    // Suggestions count
    console.log('\n💡 SUGGESTIONS:');
    console.log(`   Base Model:       ${baseResult.analysis.suggestions?.length || 0} suggestions`);
    console.log(`   Fine-Tuned Model: ${fineTunedResult.analysis.suggestions?.length || 0} suggestions`);

    // Keywords analysis
    console.log('\n🔍 KEYWORD ANALYSIS:');
    console.log(`   Base - Found:     ${baseResult.analysis.keywordAnalysis?.found?.length || 0} keywords`);
    console.log(`   Fine-Tuned Found: ${fineTunedResult.analysis.keywordAnalysis?.found?.length || 0} keywords`);
    console.log(`   Base - Missing:   ${baseResult.analysis.keywordAnalysis?.missing?.length || 0} keywords`);
    console.log(`   Fine-Tuned Miss:  ${fineTunedResult.analysis.keywordAnalysis?.missing?.length || 0} keywords`);

    // Strengths & Weaknesses
    console.log('\n💪 STRENGTHS & WEAKNESSES:');
    console.log(`   Base - Strengths: ${baseResult.analysis.strengths?.length || 0} items`);
    console.log(`   Fine-Tuned Str:   ${fineTunedResult.analysis.strengths?.length || 0} items`);
    console.log(`   Base - Weakness:  ${baseResult.analysis.weaknesses?.length || 0} items`);
    console.log(`   Fine-Tuned Weak:  ${fineTunedResult.analysis.weaknesses?.length || 0} items`);
  }

  console.log('\n' + '='.repeat(80));
}

/**
 * Save detailed results to file
 */
async function saveDetailedResults(baseResult, fineTunedResult, outputPath) {
  const results = {
    timestamp: new Date().toISOString(),
    comparison: {
      responseTime: {
        base: baseResult.responseTime,
        fineTuned: fineTunedResult.responseTime,
        speedupPercent: ((baseResult.responseTime / fineTunedResult.responseTime - 1) * 100).toFixed(2)
      },
      overallScore: {
        base: baseResult.analysis?.overallScore || 0,
        fineTuned: fineTunedResult.analysis?.overallScore || 0,
        difference: Math.abs((baseResult.analysis?.overallScore || 0) - (fineTunedResult.analysis?.overallScore || 0))
      }
    },
    baseModelResult: baseResult,
    fineTunedModelResult: fineTunedResult
  };

  await fs.writeFile(outputPath, JSON.stringify(results, null, 2), 'utf-8');
  console.log(`\n💾 Detailed results saved to: ${outputPath}\n`);
}

/**
 * Main execution
 */
async function main() {
  console.log('🔬 MODEL COMPARISON TEST\n');
  console.log('='.repeat(80));

  // Check if both services are ready
  console.log('\n🔍 Checking service status...\n');
  console.log('Base Model Status:', vertexAI.getStatus());
  console.log('Fine-Tuned Model Status:', fineTunedAI.getStatus());

  if (!vertexAI.isReady()) {
    console.error('\n❌ Base model service is not ready!');
    process.exit(1);
  }

  if (!fineTunedAI.isReady()) {
    console.error('\n❌ Fine-tuned model service is not ready!');
    console.error('Make sure you have set the FINE_TUNED_MODEL_ID and FINE_TUNED_ENDPOINT in .env');
    process.exit(1);
  }

  // Get resume text
  let resumeText = SAMPLE_RESUME;

  const args = process.argv.slice(2);
  if (args.length > 0) {
    const resumePath = args[0];
    console.log(`\n📄 Loading resume from: ${resumePath}`);
    try {
      resumeText = await fs.readFile(resumePath, 'utf-8');
    } catch (error) {
      console.error(`❌ Failed to load resume: ${error.message}`);
      console.log('Using default sample resume instead...');
    }
  } else {
    console.log('\n📄 Using default sample resume');
  }

  console.log(`📊 Resume length: ${resumeText.length} characters\n`);

  // Run both analyses
  const baseResult = await analyzeWithBaseModel(resumeText);
  const fineTunedResult = await analyzeWithFineTunedModel(resumeText);

  // Print comparison
  printComparison(baseResult, fineTunedResult);

  // Save detailed results
  const outputPath = path.join(__dirname, '../../comparison-results.json');
  await saveDetailedResults(baseResult, fineTunedResult, outputPath);

  console.log('✅ Comparison complete!\n');
}

// Run the script
main().catch(error => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});

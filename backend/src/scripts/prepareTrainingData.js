/**
 * Training Data Preparation Script for Vertex AI Fine-Tuning
 *
 * This script extracts resume analysis data from MongoDB and formats it
 * for Vertex AI Gemini model fine-tuning.
 *
 * Usage: node src/scripts/prepareTrainingData.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs').promises;
const path = require('path');
const Resume = require('../models/Resume');

// Configuration
const OUTPUT_DIR = path.join(__dirname, '../../training-data');
const MIN_SCORE_THRESHOLD = 50; // Only include quality analyses
const MIN_TEXT_LENGTH = 100; // Minimum resume text length
const TARGET_SAMPLES = 1000; // Target number of training samples

/**
 * Connect to MongoDB
 */
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}

/**
 * Extract training data from database
 */
async function extractTrainingData() {
  console.log('\n📊 Extracting training data from database...\n');

  const resumes = await Resume.find({
    status: 'completed',
    isActive: true,
    'atsAnalysis.overallScore': { $exists: true, $gte: MIN_SCORE_THRESHOLD },
    textLength: { $gte: MIN_TEXT_LENGTH }
  })
  .select('extractedText atsAnalysis improvement metadata')
  .limit(TARGET_SAMPLES)
  .lean();

  console.log(`📋 Found ${resumes.length} completed resume analyses`);

  if (resumes.length < 50) {
    console.warn('⚠️  Warning: Less than 50 samples found. Fine-tuning works best with 100+ samples.');
    console.warn('⚠️  Consider collecting more resume analyses before fine-tuning.');
  }

  return resumes;
}

/**
 * Format data for Vertex AI fine-tuning
 * Gemini expects JSONL format with specific structure
 */
function formatForVertexAI(resumes) {
  console.log('\n🔧 Formatting data for Vertex AI...\n');

  const trainingExamples = [];

  resumes.forEach((resume, index) => {
    const { extractedText, atsAnalysis } = resume;

    // Skip if missing essential data
    if (!extractedText || !atsAnalysis || !atsAnalysis.suggestions) {
      console.log(`⚠️  Skipping resume ${index + 1}: Missing essential data`);
      return;
    }

    // Truncate text to prevent token overflow (max ~6000 chars for input)
    const truncatedText = extractedText.substring(0, 6000);

    // Create structured training example
    const trainingExample = {
      // Input: Resume text with task instruction
      text_input: `Analyze this resume for ATS compatibility and provide detailed feedback.

RESUME TEXT:
${truncatedText}

Provide your analysis in JSON format with overall score (0-100), individual scores for keywords/formatting/experience/skills, improvement suggestions with priority levels, keyword analysis with found/missing/suggested keywords, and lists of strengths and weaknesses.`,

      // Output: The analysis result (what we want the model to learn)
      output: JSON.stringify({
        overallScore: atsAnalysis.overallScore,
        scores: atsAnalysis.scores,
        suggestions: atsAnalysis.suggestions.slice(0, 12), // Top 12 suggestions
        keywordAnalysis: {
          found: atsAnalysis.keywordAnalysis?.found?.slice(0, 20) || [],
          missing: atsAnalysis.keywordAnalysis?.missing?.slice(0, 15) || [],
          suggested: atsAnalysis.keywordAnalysis?.suggested?.slice(0, 15) || [],
          density: atsAnalysis.keywordAnalysis?.density || 0
        },
        strengths: atsAnalysis.strengths?.slice(0, 8) || [],
        weaknesses: atsAnalysis.weaknesses?.slice(0, 8) || []
      }, null, 2)
    };

    trainingExamples.push(trainingExample);
  });

  console.log(`✅ Formatted ${trainingExamples.length} training examples`);
  return trainingExamples;
}

/**
 * Format data for improved resume generation fine-tuning
 */
function formatImprovedResumeData(resumes) {
  console.log('\n🔧 Formatting improved resume data...\n');

  const improvedExamples = [];

  resumes.forEach((resume, index) => {
    const { extractedText, atsAnalysis, improvement } = resume;

    // Only include resumes that were improved
    if (!improvement || !improvement.improvedScore) {
      return;
    }

    const truncatedText = extractedText.substring(0, 6000);

    const improvedExample = {
      text_input: `Improve this resume by applying the following suggestions:

ORIGINAL RESUME:
${truncatedText}

SUGGESTIONS TO APPLY:
${JSON.stringify(atsAnalysis.suggestions.slice(0, 10), null, 2)}

KEYWORDS TO ADD:
${atsAnalysis.keywordAnalysis?.suggested?.slice(0, 15).join(', ') || 'None'}

Rewrite the resume to incorporate these improvements and return structured JSON with name, contact info, summary, experience, education, skills, projects, and certifications.`,

      output: JSON.stringify({
        improved: true,
        originalScore: improvement.originalScore,
        improvedScore: improvement.improvedScore,
        scoreIncrease: improvement.scoreIncrease,
        message: "Resume improved successfully with enhanced formatting, stronger action verbs, quantified achievements, and optimized keywords for ATS compatibility."
      }, null, 2)
    };

    improvedExamples.push(improvedExample);
  });

  console.log(`✅ Formatted ${improvedExamples.length} improvement examples`);
  return improvedExamples;
}

/**
 * Split data into training and validation sets
 */
function splitTrainValidation(examples, validationRatio = 0.1) {
  const shuffled = [...examples].sort(() => Math.random() - 0.5);
  const validationSize = Math.floor(shuffled.length * validationRatio);

  const validation = shuffled.slice(0, validationSize);
  const training = shuffled.slice(validationSize);

  console.log(`\n📊 Data split:`);
  console.log(`   Training set: ${training.length} examples`);
  console.log(`   Validation set: ${validation.length} examples`);

  return { training, validation };
}

/**
 * Save data to JSONL format (required by Vertex AI)
 */
async function saveToJSONL(data, filename) {
  const filePath = path.join(OUTPUT_DIR, filename);

  // Convert each example to JSONL format
  const jsonlContent = data.map(example => JSON.stringify(example)).join('\n');

  await fs.writeFile(filePath, jsonlContent, 'utf-8');
  console.log(`✅ Saved ${data.length} examples to ${filename}`);

  return filePath;
}

/**
 * Generate statistics about the training data
 */
async function generateStatistics(trainingData, validationData) {
  const allData = [...trainingData, ...validationData];

  const stats = {
    totalExamples: allData.length,
    trainingExamples: trainingData.length,
    validationExamples: validationData.length,
    scoreDistribution: {
      '90-100': 0,
      '80-89': 0,
      '70-79': 0,
      '60-69': 0,
      '50-59': 0
    },
    avgInputLength: 0,
    avgOutputLength: 0,
    generatedAt: new Date().toISOString()
  };

  let totalInputLength = 0;
  let totalOutputLength = 0;

  allData.forEach(example => {
    totalInputLength += example.text_input.length;
    totalOutputLength += example.output.length;

    // Extract score from output
    try {
      const output = JSON.parse(example.output);
      const score = output.overallScore;

      if (score >= 90) stats.scoreDistribution['90-100']++;
      else if (score >= 80) stats.scoreDistribution['80-89']++;
      else if (score >= 70) stats.scoreDistribution['70-79']++;
      else if (score >= 60) stats.scoreDistribution['60-69']++;
      else if (score >= 50) stats.scoreDistribution['50-59']++;
    } catch (e) {
      // Skip if can't parse
    }
  });

  stats.avgInputLength = Math.round(totalInputLength / allData.length);
  stats.avgOutputLength = Math.round(totalOutputLength / allData.length);

  // Save statistics
  const statsPath = path.join(OUTPUT_DIR, 'training-statistics.json');
  await fs.writeFile(statsPath, JSON.stringify(stats, null, 2), 'utf-8');

  console.log('\n📈 Training Data Statistics:');
  console.log(`   Total examples: ${stats.totalExamples}`);
  console.log(`   Training: ${stats.trainingExamples} | Validation: ${stats.validationExamples}`);
  console.log(`   Avg input length: ${stats.avgInputLength} chars`);
  console.log(`   Avg output length: ${stats.avgOutputLength} chars`);
  console.log(`   Score distribution:`, stats.scoreDistribution);
  console.log(`   Stats saved to: training-statistics.json`);

  return stats;
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Starting Training Data Preparation for Vertex AI Fine-Tuning\n');
  console.log('=' .repeat(70));

  try {
    // Create output directory
    await fs.mkdir(OUTPUT_DIR, { recursive: true });
    console.log(`✅ Output directory: ${OUTPUT_DIR}\n`);

    // Connect to database
    await connectDB();

    // Extract data
    const resumes = await extractTrainingData();

    if (resumes.length === 0) {
      console.error('❌ No training data found. Please analyze some resumes first.');
      process.exit(1);
    }

    // Format for resume analysis task
    const analysisExamples = formatForVertexAI(resumes);

    // Format for resume improvement task
    const improvementExamples = formatImprovedResumeData(resumes);

    // Combine all examples
    const allExamples = [...analysisExamples, ...improvementExamples];

    if (allExamples.length < 20) {
      console.warn('\n⚠️  WARNING: Very few training examples!');
      console.warn('⚠️  Fine-tuning requires at least 50-100 examples for good results.');
      console.warn('⚠️  Current count:', allExamples.length);
      console.warn('\n   Consider:');
      console.warn('   1. Analyzing more resumes through your application');
      console.warn('   2. Using the generateSyntheticData.js script to create sample data');
      console.warn('   3. Proceeding anyway for testing (quality may be limited)\n');
    }

    // Split into training and validation
    const { training, validation } = splitTrainValidation(allExamples);

    // Save to JSONL files
    console.log('\n💾 Saving training data files...\n');

    const trainingFile = await saveToJSONL(training, 'training-data.jsonl');
    const validationFile = await saveToJSONL(validation, 'validation-data.jsonl');

    // Generate statistics
    await generateStatistics(training, validation);

    // Create a sample file for inspection
    const sampleData = training.slice(0, 3);
    await fs.writeFile(
      path.join(OUTPUT_DIR, 'sample-data.json'),
      JSON.stringify(sampleData, null, 2),
      'utf-8'
    );
    console.log('✅ Saved sample data for inspection: sample-data.json\n');

    // Generate upload instructions
    const instructions = `
📋 NEXT STEPS: Upload Data to Google Cloud Storage
=====================================================

1. Create a GCS bucket for training data:

   gsutil mb -p ${process.env.GOOGLE_CLOUD_PROJECT_ID} -l ${process.env.VERTEX_AI_LOCATION || 'us-central1'} gs://career-advisor-training-data/

2. Upload training data to GCS:

   gsutil cp ${trainingFile} gs://career-advisor-training-data/resume-analysis/training-data.jsonl
   gsutil cp ${validationFile} gs://career-advisor-training-data/resume-analysis/validation-data.jsonl

3. Verify upload:

   gsutil ls gs://career-advisor-training-data/resume-analysis/

4. Run the fine-tuning job:

   node src/scripts/createFineTuningJob.js

Files generated:
- Training data: ${trainingFile}
- Validation data: ${validationFile}
- Statistics: ${path.join(OUTPUT_DIR, 'training-statistics.json')}
- Sample: ${path.join(OUTPUT_DIR, 'sample-data.json')}

Total training examples: ${training.length}
Total validation examples: ${validation.length}
`;

    await fs.writeFile(path.join(OUTPUT_DIR, 'INSTRUCTIONS.txt'), instructions, 'utf-8');

    console.log(instructions);
    console.log('\n✅ Training data preparation complete!');
    console.log('=' .repeat(70) + '\n');

  } catch (error) {
    console.error('\n❌ Error preparing training data:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  }
}

// Run the script
main();

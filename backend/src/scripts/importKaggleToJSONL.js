/**
 * Import Kaggle Resume Dataset Directly to JSONL (No MongoDB)
 *
 * This script processes Kaggle resume CSV and creates training data JSONL files
 * directly without using MongoDB. Much faster and saves database quota.
 *
 * Usage:
 *   node src/scripts/importKaggleToJSONL.js path/to/Resume.csv
 *   node src/scripts/importKaggleToJSONL.js path/to/Resume.csv --limit=500
 *   node src/scripts/importKaggleToJSONL.js path/to/Resume.csv --skip=100
 */

require('dotenv').config();
const fs = require('fs').promises;
const path = require('path');
const csv = require('csv-parser');
const { Readable } = require('stream');

// Import Vertex AI service
const vertexAI = require('../services/vertexAI');

// Configuration
const OUTPUT_DIR = path.join(__dirname, '../../training-data');
const BATCH_SIZE = 10; // Process 10 at a time
const DELAY_BETWEEN_BATCHES = 2000; // 2 seconds delay
const CHECKPOINT_INTERVAL = 50; // Save checkpoint every 50 resumes

/**
 * Parse CSV file
 */
async function parseCSV(filePath) {
  console.log(`\n📂 Reading CSV file: ${filePath}\n`);

  const results = [];
  const fileContent = await fs.readFile(filePath, 'utf-8');

  return new Promise((resolve, reject) => {
    const stream = Readable.from(fileContent);

    stream
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        console.log(`✅ Parsed ${results.length} rows from CSV\n`);
        resolve(results);
      })
      .on('error', reject);
  });
}

/**
 * Extract resume data from CSV row
 */
function extractResumeData(row, index) {
  const resumeColumns = ['Resume', 'Resume_str', 'resume', 'resume_text', 'ResumeText', 'text'];
  const categoryColumns = ['Category', 'category', 'job_category', 'JobCategory', 'Role'];
  const idColumns = ['ID', 'id', 'resume_id', 'ResumeID'];

  let resumeText = null;
  let category = null;
  let resumeId = null;

  for (const col of resumeColumns) {
    if (row[col]) {
      resumeText = row[col];
      break;
    }
  }

  for (const col of categoryColumns) {
    if (row[col]) {
      category = row[col];
      break;
    }
  }

  for (const col of idColumns) {
    if (row[col]) {
      resumeId = row[col];
      break;
    }
  }

  if (!resumeId) {
    resumeId = `resume_${index + 1}`;
  }

  return {
    id: resumeId,
    text: resumeText,
    category: category || 'General',
    rawRow: row
  };
}

/**
 * Analyze resume with AI
 */
async function analyzeResumeWithAI(resumeText) {
  const prompt = `You are an expert ATS (Applicant Tracking System) resume analyzer. Analyze this resume and provide actionable feedback.

RESUME TEXT:
${resumeText.substring(0, 10000)}

Analyze the resume thoroughly and return your analysis as VALID JSON ONLY (no markdown, no code blocks).

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
    "found": ["<keywords>"],
    "missing": ["<keywords>"],
    "suggested": ["<keywords>"],
    "density": <number 0-100>
  },
  "strengths": ["<strengths>"],
  "weaknesses": ["<weaknesses>"]
}

Return ONLY the JSON object, no markdown formatting.`;

  try {
    const responseText = await vertexAI.generateContent(
      prompt,
      2, // 2 retries
      { maxOutputTokens: 8192, temperature: 0.3 }
    );

    // Clean response
    let jsonResponse = responseText.trim()
      .replace(/```json\s*/g, '')
      .replace(/```\s*/g, '')
      .replace(/^[^{]*/, '');

    const analysis = JSON.parse(jsonResponse);

    return {
      overallScore: Math.min(100, Math.max(0, analysis.overallScore || 0)),
      scores: {
        keywords: Math.min(100, Math.max(0, analysis.scores?.keywords || 0)),
        formatting: Math.min(100, Math.max(0, analysis.scores?.formatting || 0)),
        experience: Math.min(100, Math.max(0, analysis.scores?.experience || 0)),
        skills: Math.min(100, Math.max(0, analysis.scores?.skills || 0))
      },
      suggestions: analysis.suggestions || [],
      keywordAnalysis: {
        found: analysis.keywordAnalysis?.found || [],
        missing: analysis.keywordAnalysis?.missing || [],
        suggested: analysis.keywordAnalysis?.suggested || [],
        density: Math.min(100, Math.max(0, analysis.keywordAnalysis?.density || 0))
      },
      strengths: analysis.strengths || [],
      weaknesses: analysis.weaknesses || []
    };

  } catch (error) {
    console.warn(`   ⚠️  AI analysis failed: ${error.message}`);

    // Fallback analysis
    return {
      overallScore: 65,
      scores: { keywords: 60, formatting: 70, experience: 65, skills: 65 },
      suggestions: [{
        section: 'General',
        issue: 'Analysis error occurred',
        improvement: 'Manual review recommended',
        priority: 'medium'
      }],
      keywordAnalysis: { found: [], missing: [], suggested: [], density: 50 },
      strengths: ['Imported from dataset'],
      weaknesses: ['Automated analysis incomplete']
    };
  }
}

/**
 * Create training example in Vertex AI format
 */
function createTrainingExample(resumeData, analysis) {
  const truncatedText = resumeData.text.substring(0, 6000);

  return {
    text_input: `Analyze this resume for ATS compatibility and provide detailed feedback.

RESUME TEXT:
${truncatedText}

Provide your analysis in JSON format with overall score (0-100), individual scores for keywords/formatting/experience/skills, improvement suggestions with priority levels, keyword analysis with found/missing/suggested keywords, and lists of strengths and weaknesses.`,

    output: JSON.stringify({
      overallScore: analysis.overallScore,
      scores: analysis.scores,
      suggestions: analysis.suggestions.slice(0, 12),
      keywordAnalysis: {
        found: analysis.keywordAnalysis?.found?.slice(0, 20) || [],
        missing: analysis.keywordAnalysis?.missing?.slice(0, 15) || [],
        suggested: analysis.keywordAnalysis?.suggested?.slice(0, 15) || [],
        density: analysis.keywordAnalysis?.density || 0
      },
      strengths: analysis.strengths?.slice(0, 8) || [],
      weaknesses: analysis.weaknesses?.slice(0, 8) || []
    }, null, 2)
  };
}

/**
 * Save checkpoint
 */
async function saveCheckpoint(processedCount, totalCount, outputFile) {
  const checkpointPath = path.join(OUTPUT_DIR, 'import-checkpoint.json');
  await fs.writeFile(checkpointPath, JSON.stringify({
    processedCount,
    totalCount,
    outputFile,
    timestamp: new Date().toISOString(),
    percentage: ((processedCount / totalCount) * 100).toFixed(2)
  }, null, 2));
}

/**
 * Load checkpoint if exists
 */
async function loadCheckpoint() {
  const checkpointPath = path.join(OUTPUT_DIR, 'import-checkpoint.json');
  try {
    const data = await fs.readFile(checkpointPath, 'utf-8');
    const checkpoint = JSON.parse(data);
    console.log(`📌 Found checkpoint: ${checkpoint.processedCount}/${checkpoint.totalCount} (${checkpoint.percentage}%)`);
    return checkpoint;
  } catch (error) {
    return null;
  }
}

/**
 * Process single resume
 */
async function processResume(resumeData, index, total) {
  try {
    console.log(`[${index + 1}/${total}] Processing: ${resumeData.id} (${resumeData.category})`);

    // Validate
    if (!resumeData.text || resumeData.text.length < 100) {
      console.log(`   ⏭️  Skipped: Text too short`);
      return { success: false, reason: 'text_too_short' };
    }

    // Analyze with AI
    console.log(`   🤖 Analyzing...`);
    const analysis = await analyzeResumeWithAI(resumeData.text);
    console.log(`   ✅ Score: ${analysis.overallScore}/100`);

    // Create training example
    const trainingExample = createTrainingExample(resumeData, analysis);

    return {
      success: true,
      example: trainingExample,
      score: analysis.overallScore,
      category: resumeData.category
    };

  } catch (error) {
    console.error(`   ❌ Error: ${error.message}`);
    return { success: false, reason: error.message };
  }
}

/**
 * Process batch
 */
async function processBatch(resumes, startIndex, total, outputStream) {
  const results = {
    successful: 0,
    failed: 0,
    skipped: 0,
    scores: []
  };

  for (let i = 0; i < resumes.length; i++) {
    const result = await processResume(resumes[i], startIndex + i, total);

    if (result.success) {
      // Write to JSONL file immediately
      outputStream.write(JSON.stringify(result.example) + '\n');
      results.successful++;
      results.scores.push(result.score);
    } else if (result.reason === 'text_too_short') {
      results.skipped++;
    } else {
      results.failed++;
    }
  }

  return results;
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Kaggle Resume Dataset → JSONL Converter (Fast Mode)\n');
  console.log('=' .repeat(70));

  // Parse arguments
  const args = process.argv.slice(2);
  const csvPath = args[0];

  if (!csvPath) {
    console.error('\n❌ Error: No CSV file specified\n');
    console.log('Usage:');
    console.log('  node src/scripts/importKaggleToJSONL.js path/to/Resume.csv');
    console.log('  node src/scripts/importKaggleToJSONL.js path/to/Resume.csv --limit=500');
    console.log('  node src/scripts/importKaggleToJSONL.js path/to/Resume.csv --skip=100\n');
    process.exit(1);
  }

  const limitArg = args.find(arg => arg.startsWith('--limit='));
  const skipArg = args.find(arg => arg.startsWith('--skip='));

  const limit = limitArg ? parseInt(limitArg.split('=')[1]) : null;
  const skip = skipArg ? parseInt(skipArg.split('=')[1]) : 0;

  console.log(`\n📁 CSV File: ${csvPath}`);
  if (limit) console.log(`🔢 Limit: ${limit} resumes`);
  if (skip) console.log(`⏭️  Skip: ${skip} resumes`);
  console.log('');

  try {
    // Create output directory
    await fs.mkdir(OUTPUT_DIR, { recursive: true });

    // Check for checkpoint
    const checkpoint = await loadCheckpoint();
    let resumeToSkip = skip;

    if (checkpoint && !skip && !limit) {
      console.log('❓ Resume from checkpoint? (Will skip first ' + checkpoint.processedCount + ' resumes)');
      console.log('   Starting fresh...\n');
    }

    // Parse CSV
    const rows = await parseCSV(csvPath);

    if (rows.length === 0) {
      console.error('❌ No data found in CSV file');
      process.exit(1);
    }

    // Extract resume data
    console.log('🔍 Extracting resume data...\n');
    let resumeData = rows.map((row, index) => extractResumeData(row, index));

    // Apply skip
    if (resumeToSkip > 0) {
      resumeData = resumeData.slice(resumeToSkip);
      console.log(`⏭️  Skipped first ${resumeToSkip} resumes\n`);
    }

    // Apply limit
    if (limit && limit < resumeData.length) {
      resumeData = resumeData.slice(0, limit);
      console.log(`🔢 Limited to ${limit} resumes\n`);
    }

    // Filter valid resumes
    const validResumes = resumeData.filter(r => r.text && r.text.length >= 100);
    console.log(`✅ Found ${validResumes.length} valid resumes (>= 100 chars)\n`);

    if (validResumes.length === 0) {
      console.error('❌ No valid resumes to process');
      process.exit(1);
    }

    // Create output file
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
    const outputFile = path.join(OUTPUT_DIR, `kaggle-training-${timestamp}.jsonl`);
    const outputStream = require('fs').createWriteStream(outputFile, { flags: 'a' });

    console.log(`💾 Output file: ${outputFile}\n`);
    console.log('🔄 Processing resumes...\n');
    console.log('=' .repeat(70) + '\n');

    // Process in batches
    const totalResults = {
      successful: 0,
      failed: 0,
      skipped: 0,
      allScores: []
    };

    const startTime = Date.now();

    for (let i = 0; i < validResumes.length; i += BATCH_SIZE) {
      const batch = validResumes.slice(i, Math.min(i + BATCH_SIZE, validResumes.length));
      const batchNum = Math.floor(i / BATCH_SIZE) + 1;
      const totalBatches = Math.ceil(validResumes.length / BATCH_SIZE);

      console.log(`📦 Batch ${batchNum}/${totalBatches} (${batch.length} resumes)`);
      console.log('-'.repeat(70));

      const batchResults = await processBatch(batch, i + resumeToSkip, validResumes.length, outputStream);

      totalResults.successful += batchResults.successful;
      totalResults.failed += batchResults.failed;
      totalResults.skipped += batchResults.skipped;
      totalResults.allScores.push(...batchResults.scores);

      console.log(`   Batch: ${batchResults.successful} ✅ | ${batchResults.skipped} ⏭️  | ${batchResults.failed} ❌\n`);

      // Save checkpoint
      if ((i + BATCH_SIZE) % CHECKPOINT_INTERVAL === 0 || i + BATCH_SIZE >= validResumes.length) {
        await saveCheckpoint(totalResults.successful, validResumes.length, outputFile);
      }

      // Progress
      const processed = totalResults.successful + totalResults.failed + totalResults.skipped;
      const percentage = ((processed / validResumes.length) * 100).toFixed(1);
      const elapsed = ((Date.now() - startTime) / 1000 / 60).toFixed(1);
      const remaining = ((validResumes.length - processed) * (Date.now() - startTime) / processed / 1000 / 60).toFixed(1);

      console.log(`📊 Progress: ${processed}/${validResumes.length} (${percentage}%) | Time: ${elapsed}m | ETA: ${remaining}m\n`);

      // Delay between batches
      if (i + BATCH_SIZE < validResumes.length) {
        console.log(`⏳ Waiting ${DELAY_BETWEEN_BATCHES / 1000}s...\n`);
        await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_BATCHES));
      }
    }

    // Close output stream
    outputStream.end();

    // Final statistics
    console.log('=' .repeat(70));
    console.log('\n✅ CONVERSION COMPLETE!\n');
    console.log('📊 Results:');
    console.log(`   Successful: ${totalResults.successful} ✅`);
    console.log(`   Skipped: ${totalResults.skipped} ⏭️`);
    console.log(`   Failed: ${totalResults.failed} ❌\n`);

    if (totalResults.allScores.length > 0) {
      const avgScore = (totalResults.allScores.reduce((a, b) => a + b, 0) / totalResults.allScores.length).toFixed(1);
      const minScore = Math.min(...totalResults.allScores);
      const maxScore = Math.max(...totalResults.allScores);

      console.log('📈 Score Statistics:');
      console.log(`   Average: ${avgScore}/100`);
      console.log(`   Range: ${minScore}-${maxScore}\n`);
    }

    const totalTime = ((Date.now() - startTime) / 1000 / 60).toFixed(1);
    console.log(`⏱️  Total Time: ${totalTime} minutes`);
    console.log(`⚡ Speed: ${(totalResults.successful / (totalTime || 1)).toFixed(1)} resumes/min\n`);

    console.log(`💾 Output saved to: ${outputFile}\n`);

    // Split into training/validation
    console.log('✂️  Splitting into training/validation sets...\n');

    const allExamples = require('fs').readFileSync(outputFile, 'utf-8')
      .split('\n')
      .filter(line => line.trim())
      .map(line => JSON.parse(line));

    // Shuffle
    const shuffled = allExamples.sort(() => Math.random() - 0.5);
    const validationSize = Math.floor(shuffled.length * 0.1);

    const validation = shuffled.slice(0, validationSize);
    const training = shuffled.slice(validationSize);

    // Save split files
    const trainingFile = path.join(OUTPUT_DIR, 'training-data.jsonl');
    const validationFile = path.join(OUTPUT_DIR, 'validation-data.jsonl');

    await fs.writeFile(trainingFile, training.map(e => JSON.stringify(e)).join('\n'), 'utf-8');
    await fs.writeFile(validationFile, validation.map(e => JSON.stringify(e)).join('\n'), 'utf-8');

    console.log(`✅ Training data: ${trainingFile} (${training.length} examples)`);
    console.log(`✅ Validation data: ${validationFile} (${validation.length} examples)\n`);

    // Generate statistics
    const stats = {
      totalExamples: allExamples.length,
      trainingExamples: training.length,
      validationExamples: validation.length,
      avgScore: avgScore,
      scoreRange: { min: minScore, max: maxScore },
      processingTime: totalTime,
      speedPerMinute: (totalResults.successful / (totalTime || 1)).toFixed(1),
      timestamp: new Date().toISOString()
    };

    await fs.writeFile(
      path.join(OUTPUT_DIR, 'kaggle-import-stats.json'),
      JSON.stringify(stats, null, 2),
      'utf-8'
    );

    console.log('📋 Next Steps:');
    console.log('   1. Upload to GCS:');
    console.log(`      gsutil cp ${trainingFile} gs://career-advisor-training-data/resume-analysis/`);
    console.log(`      gsutil cp ${validationFile} gs://career-advisor-training-data/resume-analysis/`);
    console.log('   2. Start fine-tuning:');
    console.log('      node src/scripts/createFineTuningJob.js\n');

    console.log('=' .repeat(70) + '\n');

  } catch (error) {
    console.error('\n❌ Conversion failed:', error);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run the script
main();

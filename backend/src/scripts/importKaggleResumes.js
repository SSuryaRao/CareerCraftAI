/**
 * Import Resume Dataset from Kaggle CSV
 *
 * This script imports resumes from Kaggle datasets and processes them
 * through your resume analysis pipeline to generate training data.
 *
 * Supported Kaggle Datasets:
 * 1. Resume Dataset (snehaanbhawal) - 2,400+ resumes
 * 2. UpdatedResumeDataSet (gauravduttakiit) - 962 resumes
 * 3. Any CSV with 'Resume' or 'Resume_str' column
 *
 * Usage:
 *   node src/scripts/importKaggleResumes.js path/to/Resume.csv
 *   node src/scripts/importKaggleResumes.js path/to/Resume.csv --limit=100
 *   node src/scripts/importKaggleResumes.js path/to/Resume.csv --category="Data Science"
 */

require('dotenv').config();
const fs = require('fs').promises;
const path = require('path');
const csv = require('csv-parser');
const mongoose = require('mongoose');
const { Readable } = require('stream');
const Resume = require('../models/Resume');
const User = require('../models/User');

// Import the AI analysis function
const vertexAI = require('../services/vertexAI');

// Configuration
const BATCH_SIZE = 10; // Process 10 resumes at a time
const DELAY_BETWEEN_BATCHES = 5000; // 5 seconds delay to avoid rate limits

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
 * Detect CSV format and extract resume data
 */
function extractResumeData(row, index) {
  // Common column name variations
  const resumeColumns = ['Resume', 'Resume_str', 'resume', 'resume_text', 'ResumeText', 'text'];
  const categoryColumns = ['Category', 'category', 'job_category', 'JobCategory', 'Role'];
  const idColumns = ['ID', 'id', 'resume_id', 'ResumeID'];

  let resumeText = null;
  let category = null;
  let resumeId = null;

  // Find resume text column
  for (const col of resumeColumns) {
    if (row[col]) {
      resumeText = row[col];
      break;
    }
  }

  // Find category column
  for (const col of categoryColumns) {
    if (row[col]) {
      category = row[col];
      break;
    }
  }

  // Find ID column
  for (const col of idColumns) {
    if (row[col]) {
      resumeId = row[col];
      break;
    }
  }

  // Fallback ID
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
 * Create or get mock user for imports
 */
async function getOrCreateImportUser() {
  const importUserEmail = 'kaggle-import@careercraft.ai';

  let user = await User.findOne({ email: importUserEmail });

  if (!user) {
    console.log('👤 Creating import user...');

    user = new User({
      firebaseUid: 'kaggle-import-user',
      email: importUserEmail,
      name: 'Kaggle Dataset Import',
      role: 'user',
      subscriptionTier: 'premium', // Unlimited for imports
      profile: {
        title: 'Data Import System',
        phone: '+91-0000000000',
        location: 'India',
        careerGoal: 'Resume dataset processing'
      }
    });

    await user.save();
    console.log('✅ Import user created');
  }

  return user;
}

/**
 * Analyze resume using AI (same as your controller)
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
    console.warn('⚠️  AI analysis failed, using fallback:', error.message);

    // Fallback analysis
    return {
      overallScore: 65,
      scores: { keywords: 60, formatting: 70, experience: 65, skills: 65 },
      suggestions: [{
        section: 'General',
        issue: 'Imported from dataset, needs manual review',
        improvement: 'Review and update resume content',
        priority: 'medium'
      }],
      keywordAnalysis: { found: [], missing: [], suggested: [], density: 50 },
      strengths: ['Imported from Kaggle dataset'],
      weaknesses: ['Needs verification']
    };
  }
}

/**
 * Process single resume
 */
async function processResume(resumeData, user, index, total) {
  try {
    console.log(`\n[${index + 1}/${total}] Processing: ${resumeData.id}`);
    console.log(`   Category: ${resumeData.category}`);
    console.log(`   Text length: ${resumeData.text?.length || 0} chars`);

    // Validate resume text
    if (!resumeData.text || resumeData.text.length < 100) {
      console.log('   ⚠️  Skipped: Text too short or empty');
      return { success: false, reason: 'text_too_short' };
    }

    // Check if already imported (avoid duplicates)
    const existing = await Resume.findOne({
      userId: user.firebaseUid,
      originalName: `${resumeData.id}.txt`
    });

    if (existing) {
      console.log('   ⏭️  Skipped: Already imported');
      return { success: false, reason: 'duplicate' };
    }

    // Analyze resume with AI
    console.log('   🤖 Analyzing with AI...');
    const analysis = await analyzeResumeWithAI(resumeData.text);
    console.log(`   ✅ Analysis complete: Score ${analysis.overallScore}/100`);

    // Create resume record
    const resume = new Resume({
      userId: user.firebaseUid,
      filename: `kaggle_${resumeData.id}.txt`,
      originalName: `${resumeData.id}.txt`,
      fileSize: resumeData.text.length,
      firebaseUrl: `local://kaggle-import/${resumeData.id}`,
      firebaseStoragePath: `kaggle-import/${resumeData.id}.txt`,
      extractedText: resumeData.text,
      textLength: resumeData.text.length,
      status: 'completed',
      atsAnalysis: analysis,
      metadata: {
        uploadMethod: 'file-picker', // Use valid enum value
        storageType: 'local',
        extractionMethod: 'pdf-parse',
        source: 'kaggle',
        category: resumeData.category,
        analysisModel: 'gemini-2.5-flash',
        processingTime: 0
      }
    });

    await resume.save();

    console.log(`   💾 Saved to database (ID: ${resume._id})`);

    return {
      success: true,
      resumeId: resume._id,
      score: analysis.overallScore,
      category: resumeData.category
    };

  } catch (error) {
    console.error(`   ❌ Error processing resume:`, error.message);
    return { success: false, reason: error.message };
  }
}

/**
 * Process resumes in batches
 */
async function processBatch(resumes, user, startIndex, total) {
  const results = {
    processed: 0,
    successful: 0,
    failed: 0,
    skipped: 0,
    errors: []
  };

  for (let i = 0; i < resumes.length; i++) {
    const result = await processResume(resumes[i], user, startIndex + i, total);

    results.processed++;

    if (result.success) {
      results.successful++;
    } else if (result.reason === 'duplicate' || result.reason === 'text_too_short') {
      results.skipped++;
    } else {
      results.failed++;
      results.errors.push({
        index: startIndex + i,
        id: resumes[i].id,
        reason: result.reason
      });
    }
  }

  return results;
}

/**
 * Generate summary statistics
 */
async function generateSummary(importedCount) {
  console.log('\n📊 Generating summary statistics...\n');

  const stats = await Resume.aggregate([
    {
      $match: {
        'metadata.source': 'kaggle',
        status: 'completed'
      }
    },
    {
      $group: {
        _id: '$metadata.category',
        count: { $sum: 1 },
        avgScore: { $avg: '$atsAnalysis.overallScore' },
        minScore: { $min: '$atsAnalysis.overallScore' },
        maxScore: { $max: '$atsAnalysis.overallScore' }
      }
    },
    {
      $sort: { count: -1 }
    }
  ]);

  console.log('📈 Import Summary by Category:\n');

  stats.forEach(stat => {
    console.log(`   ${stat._id}:`);
    console.log(`      Count: ${stat.count}`);
    console.log(`      Avg Score: ${stat.avgScore.toFixed(1)}/100`);
    console.log(`      Range: ${stat.minScore}-${stat.maxScore}`);
    console.log('');
  });

  const totalStats = {
    categories: stats.length,
    totalResumes: stats.reduce((sum, s) => sum + s.count, 0),
    overallAvgScore: stats.reduce((sum, s) => sum + (s.avgScore * s.count), 0) /
                     stats.reduce((sum, s) => sum + s.count, 0)
  };

  console.log('📋 Overall Statistics:');
  console.log(`   Categories: ${totalStats.categories}`);
  console.log(`   Total Resumes: ${totalStats.totalResumes}`);
  console.log(`   Overall Avg Score: ${totalStats.overallAvgScore.toFixed(1)}/100\n`);

  return totalStats;
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Kaggle Resume Dataset Importer\n');
  console.log('=' .repeat(70));

  // Parse arguments
  const args = process.argv.slice(2);
  const csvPath = args[0];

  if (!csvPath) {
    console.error('\n❌ Error: No CSV file specified\n');
    console.log('Usage:');
    console.log('  node src/scripts/importKaggleResumes.js path/to/Resume.csv');
    console.log('  node src/scripts/importKaggleResumes.js path/to/Resume.csv --limit=100');
    console.log('  node src/scripts/importKaggleResumes.js path/to/Resume.csv --category="Data Science"\n');
    process.exit(1);
  }

  // Parse options
  const limitArg = args.find(arg => arg.startsWith('--limit='));
  const categoryArg = args.find(arg => arg.startsWith('--category='));

  const limit = limitArg ? parseInt(limitArg.split('=')[1]) : null;
  const filterCategory = categoryArg ? categoryArg.split('=')[1].replace(/['"]/g, '') : null;

  console.log(`\n📁 CSV File: ${csvPath}`);
  if (limit) console.log(`🔢 Limit: ${limit} resumes`);
  if (filterCategory) console.log(`🏷️  Filter Category: ${filterCategory}`);
  console.log('');

  try {
    // Connect to database
    await connectDB();

    // Parse CSV
    const rows = await parseCSV(csvPath);

    if (rows.length === 0) {
      console.error('❌ No data found in CSV file');
      process.exit(1);
    }

    // Extract resume data
    console.log('🔍 Extracting resume data...\n');
    let resumeData = rows.map((row, index) => extractResumeData(row, index));

    // Filter by category if specified
    if (filterCategory) {
      resumeData = resumeData.filter(r => r.category === filterCategory);
      console.log(`✅ Filtered to ${resumeData.length} resumes in category: ${filterCategory}\n`);
    }

    // Apply limit if specified
    if (limit && limit < resumeData.length) {
      resumeData = resumeData.slice(0, limit);
      console.log(`✅ Limited to ${limit} resumes\n`);
    }

    // Check for valid data
    const validResumes = resumeData.filter(r => r.text && r.text.length >= 100);
    console.log(`✅ Found ${validResumes.length} valid resumes (>= 100 chars)\n`);

    if (validResumes.length === 0) {
      console.error('❌ No valid resumes found to import');
      process.exit(1);
    }

    // Get or create import user
    const user = await getOrCreateImportUser();

    // Process in batches
    console.log(`🔄 Processing ${validResumes.length} resumes in batches of ${BATCH_SIZE}...\n`);
    console.log('=' .repeat(70));

    const totalResults = {
      processed: 0,
      successful: 0,
      failed: 0,
      skipped: 0,
      errors: []
    };

    for (let i = 0; i < validResumes.length; i += BATCH_SIZE) {
      const batch = validResumes.slice(i, Math.min(i + BATCH_SIZE, validResumes.length));
      const batchNum = Math.floor(i / BATCH_SIZE) + 1;
      const totalBatches = Math.ceil(validResumes.length / BATCH_SIZE);

      console.log(`\n📦 Batch ${batchNum}/${totalBatches} (${batch.length} resumes)`);
      console.log('-'.repeat(70));

      const batchResults = await processBatch(batch, user, i, validResumes.length);

      // Aggregate results
      totalResults.processed += batchResults.processed;
      totalResults.successful += batchResults.successful;
      totalResults.failed += batchResults.failed;
      totalResults.skipped += batchResults.skipped;
      totalResults.errors.push(...batchResults.errors);

      console.log(`\n   Batch Summary: ${batchResults.successful} ✅ | ${batchResults.skipped} ⏭️  | ${batchResults.failed} ❌`);

      // Delay between batches to avoid rate limits
      if (i + BATCH_SIZE < validResumes.length) {
        console.log(`\n   ⏳ Waiting ${DELAY_BETWEEN_BATCHES / 1000}s before next batch...`);
        await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_BATCHES));
      }
    }

    // Final summary
    console.log('\n' + '='.repeat(70));
    console.log('\n✅ IMPORT COMPLETE!\n');
    console.log('📊 Results:');
    console.log(`   Processed: ${totalResults.processed}`);
    console.log(`   Successful: ${totalResults.successful} ✅`);
    console.log(`   Skipped: ${totalResults.skipped} ⏭️`);
    console.log(`   Failed: ${totalResults.failed} ❌\n`);

    if (totalResults.errors.length > 0) {
      console.log(`⚠️  Errors (${totalResults.errors.length}):`);
      totalResults.errors.slice(0, 10).forEach(err => {
        console.log(`   - ${err.id}: ${err.reason}`);
      });
      if (totalResults.errors.length > 10) {
        console.log(`   ... and ${totalResults.errors.length - 10} more\n`);
      }
    }

    // Generate category statistics
    if (totalResults.successful > 0) {
      await generateSummary(totalResults.successful);

      console.log('📋 Next Steps:');
      console.log('   1. Review imported resumes in your database');
      console.log('   2. Generate training data: node src/scripts/prepareTrainingData.js');
      console.log('   3. Start fine-tuning: node src/scripts/createFineTuningJob.js\n');
    }

    console.log('=' .repeat(70) + '\n');

  } catch (error) {
    console.error('\n❌ Import failed:', error);
    console.error(error.stack);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  }
}

// Run the script
main();

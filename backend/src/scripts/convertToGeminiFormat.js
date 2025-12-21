/**
 * Convert Training Data to Gemini Format
 *
 * Converts existing JSONL files from {text_input, output} format
 * to Gemini's required {messages: [{role, content}]} format
 *
 * Usage:
 *   node src/scripts/convertToGeminiFormat.js
 */

const fs = require('fs');
const path = require('path');

// Configuration
const TRAINING_DATA_DIR = path.join(__dirname, '../../training-data');
const INPUT_FILES = [
  'training-data.jsonl',
  'validation-data.jsonl'
];

/**
 * Convert a single training example to Gemini format
 * Gemini expects: { contents: [{ role, parts: [{ text }] }] }
 */
function convertToGeminiFormat(oldFormat) {
  return {
    contents: [
      {
        role: "user",
        parts: [{ text: oldFormat.text_input }]
      },
      {
        role: "model",
        parts: [{ text: oldFormat.output }]
      }
    ]
  };
}

/**
 * Process a single file
 */
function processFile(filename) {
  const inputPath = path.join(TRAINING_DATA_DIR, filename);
  const outputPath = path.join(TRAINING_DATA_DIR, filename.replace('.jsonl', '-gemini.jsonl'));

  console.log(`\n📂 Processing: ${filename}`);
  console.log(`   Input:  ${inputPath}`);
  console.log(`   Output: ${outputPath}`);

  // Read file
  const fileContent = fs.readFileSync(inputPath, 'utf-8');
  const lines = fileContent.trim().split('\n');

  console.log(`   Found ${lines.length} examples`);

  // Convert each line
  const convertedLines = [];
  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < lines.length; i++) {
    try {
      const oldFormat = JSON.parse(lines[i]);
      const newFormat = convertToGeminiFormat(oldFormat);
      convertedLines.push(JSON.stringify(newFormat));
      successCount++;

      // Progress indicator
      if ((i + 1) % 100 === 0) {
        process.stdout.write(`\r   Progress: ${i + 1}/${lines.length} (${((i + 1) / lines.length * 100).toFixed(1)}%)`);
      }
    } catch (error) {
      console.error(`\n   ❌ Error on line ${i + 1}: ${error.message}`);
      errorCount++;
    }
  }

  console.log(`\r   Progress: ${lines.length}/${lines.length} (100.0%)      `);

  // Write to output file
  fs.writeFileSync(outputPath, convertedLines.join('\n'), 'utf-8');

  console.log(`   ✅ Converted: ${successCount} examples`);
  if (errorCount > 0) {
    console.log(`   ⚠️  Errors: ${errorCount} examples`);
  }
  console.log(`   💾 Saved to: ${outputPath}`);

  return { successCount, errorCount };
}

/**
 * Main execution
 */
function main() {
  console.log('🔄 Converting Training Data to Gemini Format\n');
  console.log('=' .repeat(70));

  const startTime = Date.now();
  const totalStats = { successCount: 0, errorCount: 0 };

  // Process each file
  for (const filename of INPUT_FILES) {
    const filePath = path.join(TRAINING_DATA_DIR, filename);

    if (!fs.existsSync(filePath)) {
      console.log(`\n⏭️  Skipping ${filename} (not found)`);
      continue;
    }

    const stats = processFile(filename);
    totalStats.successCount += stats.successCount;
    totalStats.errorCount += stats.errorCount;
  }

  const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(2);

  console.log('\n' + '=' .repeat(70));
  console.log('\n✅ CONVERSION COMPLETE!\n');
  console.log('📊 Summary:');
  console.log(`   Total Converted: ${totalStats.successCount} examples`);
  console.log(`   Total Errors: ${totalStats.errorCount} examples`);
  console.log(`   Time Elapsed: ${elapsedTime} seconds\n`);

  console.log('📋 Next Steps:');
  console.log('   1. Upload to GCS:');
  console.log('      gsutil cp backend/training-data/training-data-gemini.jsonl gs://career-advisor-training-data/resume-analysis/training-data.jsonl');
  console.log('      gsutil cp backend/training-data/validation-data-gemini.jsonl gs://career-advisor-training-data/resume-analysis/validation-data.jsonl');
  console.log('   2. Create fine-tuning job:');
  console.log('      python backend/src/scripts/createTuningJob.py\n');
  console.log('=' .repeat(70) + '\n');
}

// Run the script
main();

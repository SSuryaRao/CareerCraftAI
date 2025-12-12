/**
 * Deploy Fine-Tuned Model
 *
 * This script helps deploy the fine-tuned model and update the application
 * to use it for resume analysis.
 *
 * Usage: node src/scripts/deployFineTunedModel.js
 */

require('dotenv').config();
const fs = require('fs').promises;
const path = require('path');

const PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT_ID;
const LOCATION = process.env.VERTEX_AI_LOCATION || 'us-central1';

/**
 * Load tuned model details
 */
async function loadModelDetails() {
  try {
    const detailsPath = path.join(__dirname, '../../training-data/tuned-model-details.json');
    const details = JSON.parse(await fs.readFile(detailsPath, 'utf-8'));

    console.log('📂 Loaded model details:');
    console.log(`   Model Name: ${details.tunedModel}`);
    console.log(`   Display Name: ${details.displayName}`);
    console.log(`   Completed: ${details.completedAt}\n`);

    return details;
  } catch (error) {
    console.error('❌ Could not load model details.');
    console.error('   Make sure fine-tuning job completed successfully.');
    console.error('   Run: node src/scripts/monitorFineTuningJob.js\n');
    throw error;
  }
}

/**
 * Update .env file with fine-tuned model
 */
async function updateEnvFile(modelName) {
  console.log('📝 Updating .env file...\n');

  try {
    const envPath = path.join(__dirname, '../../.env');
    let envContent = await fs.readFile(envPath, 'utf-8');

    // Check if VERTEX_AI_FINETUNED_MODEL already exists
    if (envContent.includes('VERTEX_AI_FINETUNED_MODEL=')) {
      // Update existing entry
      envContent = envContent.replace(
        /VERTEX_AI_FINETUNED_MODEL=.*/,
        `VERTEX_AI_FINETUNED_MODEL=${modelName}`
      );
      console.log('✅ Updated existing VERTEX_AI_FINETUNED_MODEL entry');
    } else {
      // Add new entry
      envContent += `\n# Fine-Tuned Model Configuration\nVERTEX_AI_FINETUNED_MODEL=${modelName}\n`;
      console.log('✅ Added VERTEX_AI_FINETUNED_MODEL to .env');
    }

    // Backup original .env
    await fs.writeFile(envPath + '.backup', envContent, 'utf-8');
    await fs.writeFile(envPath, envContent, 'utf-8');

    console.log('   Backup saved to: .env.backup\n');

  } catch (error) {
    console.error('❌ Error updating .env file:', error.message);
    throw error;
  }
}

/**
 * Test the fine-tuned model
 */
async function testFineTunedModel() {
  console.log('🧪 Testing fine-tuned model...\n');

  try {
    // Reload environment variables
    require('dotenv').config({ override: true });

    // Import the fine-tuned service
    const fineTunedService = require('../services/fineTunedVertexAI');

    if (!fineTunedService.isReady()) {
      throw new Error('Fine-tuned service not configured properly');
    }

    if (!fineTunedService.hasFineTunedModel()) {
      throw new Error('Fine-tuned model not loaded');
    }

    console.log('✅ Fine-tuned service initialized successfully\n');

    // Test with a sample resume
    const testResume = `
John Doe
Email: john.doe@email.com
Phone: +91-9876543210

PROFESSIONAL SUMMARY
Software Engineer with 3 years of experience in React and Node.js.

WORK EXPERIENCE
Software Engineer | Tech Company
June 2021 - Present
- Developed web applications
- Worked with team members

EDUCATION
B.Tech in Computer Science
XYZ College | 2017-2021

SKILLS
JavaScript, React, Node.js, MongoDB
    `.trim();

    console.log('📄 Test Resume:');
    console.log(testResume.substring(0, 200) + '...\n');

    console.log('🤖 Generating analysis with fine-tuned model...\n');

    const prompt = `Analyze this resume briefly and provide an ATS score (0-100):

${testResume}

Return only the score as a number.`;

    const result = await fineTunedService.generateContent(prompt, 2, {
      maxOutputTokens: 100,
      temperature: 0.3
    });

    console.log('✅ Test Result:', result.trim());
    console.log('\n✅ Fine-tuned model is working correctly!\n');

    return true;

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('\nTroubleshooting:');
    console.error('   1. Verify the model name is correct');
    console.error('   2. Check service account permissions');
    console.error('   3. Restart the application to reload .env\n');
    return false;
  }
}

/**
 * Update service configuration
 */
async function updateServiceConfig() {
  console.log('🔧 Updating service configuration...\n');

  const instructions = `
To use the fine-tuned model in your application:

1. Update resumeController.js to use fineTunedVertexAI:

   const vertexAI = require('../services/fineTunedVertexAI');

2. The service will automatically use the fine-tuned model if available,
   and fallback to the base model if not.

3. Check model status in your application:

   const modelInfo = vertexAI.getModelInfo();
   console.log('Using fine-tuned:', modelInfo.usingFineTuned);

4. Monitor model performance and compare with base model:
   - Track ATS score accuracy
   - Measure response time
   - Monitor API costs

5. You can switch between models dynamically:

   vertexAI.useBaseModel();      // Use base Gemini model
   vertexAI.setFineTunedModel(name); // Use fine-tuned model
`;

  console.log(instructions);

  const configPath = path.join(__dirname, '../../training-data/deployment-config.txt');
  await fs.writeFile(configPath, instructions, 'utf-8');

  console.log('💾 Configuration guide saved to: training-data/deployment-config.txt\n');
}

/**
 * Generate performance comparison script
 */
async function generateComparisonScript() {
  const script = `/**
 * Compare Base Model vs Fine-Tuned Model Performance
 */

const baseModel = require('./services/vertexAI');
const fineTunedModel = require('./services/fineTunedVertexAI');

async function compareModels(resumeText) {
  console.log('🔄 Comparing base vs fine-tuned models...\\n');

  const prompt = \`Analyze this resume and provide ATS score: \${resumeText}\`;

  // Test base model
  console.time('Base Model');
  fineTunedModel.useBaseModel();
  const baseResult = await fineTunedModel.generateContent(prompt, 1);
  console.timeEnd('Base Model');

  // Test fine-tuned model
  console.time('Fine-Tuned Model');
  fineTunedModel.setFineTunedModel(process.env.VERTEX_AI_FINETUNED_MODEL);
  const fineTunedResult = await fineTunedModel.generateContent(prompt, 1);
  console.timeEnd('Fine-Tuned Model');

  console.log('\\nResults:');
  console.log('Base Model:', baseResult.substring(0, 200));
  console.log('\\nFine-Tuned Model:', fineTunedResult.substring(0, 200));
}

module.exports = { compareModels };
`;

  const scriptPath = path.join(__dirname, '../../training-data/compareModels.js');
  await fs.writeFile(scriptPath, script, 'utf-8');

  console.log('📊 Comparison script generated: training-data/compareModels.js\n');
}

/**
 * Main deployment flow
 */
async function main() {
  console.log('🚀 Fine-Tuned Model Deployment\n');
  console.log('='.repeat(70) + '\n');

  try {
    // Step 1: Load model details
    const modelDetails = await loadModelDetails();
    const modelName = modelDetails.tunedModel;

    // Step 2: Update .env file
    await updateEnvFile(modelName);

    // Step 3: Update service configuration guide
    await updateServiceConfig();

    // Step 4: Generate comparison script
    await generateComparisonScript();

    // Step 5: Test the model
    console.log('='.repeat(70));
    const testSuccess = await testFineTunedModel();

    // Summary
    console.log('='.repeat(70));
    console.log('\n✅ Deployment Complete!\n');

    if (testSuccess) {
      console.log('✅ Fine-tuned model is ready to use');
      console.log('✅ .env file updated');
      console.log('✅ Configuration guide created\n');

      console.log('📋 Next Steps:');
      console.log('   1. Restart your application: npm run dev');
      console.log('   2. Analyze a resume to test the fine-tuned model');
      console.log('   3. Monitor performance vs base model');
      console.log('   4. Adjust temperature/tokens if needed\n');

      console.log('💡 Fine-Tuning Benefits:');
      console.log('   ✓ Better understanding of Indian job market');
      console.log('   ✓ More consistent ATS scoring');
      console.log('   ✓ Improved keyword extraction');
      console.log('   ✓ Reduced prompt engineering needs\n');

    } else {
      console.log('⚠️  Deployment completed but testing failed');
      console.log('   Please review the errors above and retry\n');
    }

    console.log('='.repeat(70) + '\n');

  } catch (error) {
    console.error('\n❌ Deployment failed:', error.message);
    console.error('\nPlease fix the errors and try again.\n');
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { deployFineTunedModel: main };

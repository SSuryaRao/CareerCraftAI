/**
 * Create Vertex AI Fine-Tuning Job
 *
 * This script creates a supervised fine-tuning job for Gemini model
 * using the prepared training data.
 *
 * Usage: node src/scripts/createFineTuningJob.js
 *
 * Prerequisites:
 * 1. Training data uploaded to GCS
 * 2. Vertex AI API enabled
 * 3. Service account with proper permissions
 */

require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { google } = require('googleapis');
const path = require('path');
const fs = require('fs').promises;

// Configuration
const PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT_ID || process.env.VERTEX_AI_PROJECT;
const LOCATION = process.env.VERTEX_AI_LOCATION || 'us-central1';
const BASE_MODEL = 'gemini-1.5-flash-002'; // Base model for fine-tuning
const TUNED_MODEL_DISPLAY_NAME = 'career-advisor-resume-analyzer-v1';

// GCS paths (update these with your actual bucket)
const GCS_BUCKET = process.env.GCS_TRAINING_BUCKET || 'career-advisor-training-data';
const TRAINING_DATA_PATH = `gs://${GCS_BUCKET}/resume-analysis/training-data.jsonl`;
const VALIDATION_DATA_PATH = `gs://${GCS_BUCKET}/resume-analysis/validation-data.jsonl`;

// Training configuration
const TRAINING_CONFIG = {
  epochs: 4, // Number of training epochs (2-10 recommended)
  learningRateMultiplier: 1.0, // Learning rate (0.5-2.0)
  adapterSize: 4, // Adapter size for LoRA (1, 4, 8, 16)
  batchSize: 4, // Training batch size
};

/**
 * Initialize Google Cloud clients
 */
function initializeClients() {
  const auth = new google.auth.GoogleAuth({
    keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    scopes: ['https://www.googleapis.com/auth/cloud-platform'],
  });

  const aiplatform = google.aiplatform({
    version: 'v1beta1',
    auth: auth,
  });

  return { aiplatform, auth };
}

/**
 * Create fine-tuning job using Vertex AI API
 */
async function createFineTuningJob() {
  console.log('🚀 Creating Vertex AI Fine-Tuning Job\n');
  console.log('=' .repeat(70));

  try {
    const { aiplatform, auth } = initializeClients();

    console.log(`📋 Configuration:`);
    console.log(`   Project ID: ${PROJECT_ID}`);
    console.log(`   Location: ${LOCATION}`);
    console.log(`   Base Model: ${BASE_MODEL}`);
    console.log(`   Tuned Model Name: ${TUNED_MODEL_DISPLAY_NAME}`);
    console.log(`   Training Data: ${TRAINING_DATA_PATH}`);
    console.log(`   Validation Data: ${VALIDATION_DATA_PATH}`);
    console.log(`   Epochs: ${TRAINING_CONFIG.epochs}`);
    console.log(`   Learning Rate: ${TRAINING_CONFIG.learningRateMultiplier}`);
    console.log(`   Adapter Size: ${TRAINING_CONFIG.adapterSize}\n`);

    // Verify GCS paths exist (optional but recommended)
    console.log('🔍 Verifying GCS files...');
    await verifyGCSFiles();

    // Create the tuning job
    console.log('\n📤 Submitting fine-tuning job to Vertex AI...\n');

    const parent = `projects/${PROJECT_ID}/locations/${LOCATION}`;

    // Construct the request
    const request = {
      parent: parent,
      requestBody: {
        displayName: TUNED_MODEL_DISPLAY_NAME,
        baseModel: BASE_MODEL,
        tunedModelDisplayName: TUNED_MODEL_DISPLAY_NAME,
        tuningTask: {
          hyperparameters: {
            epochCount: TRAINING_CONFIG.epochs,
            learningRateMultiplier: TRAINING_CONFIG.learningRateMultiplier,
            adapterSize: TRAINING_CONFIG.adapterSize,
          },
          trainingData: {
            inputUri: TRAINING_DATA_PATH,
          },
          validationData: {
            inputUri: VALIDATION_DATA_PATH,
          },
        },
        labels: {
          environment: process.env.NODE_ENV || 'development',
          purpose: 'resume-analysis',
          version: 'v1',
        },
      },
    };

    console.log('Request payload:', JSON.stringify(request, null, 2));

    // Submit the job
    const response = await aiplatform.projects.locations.tuningJobs.create(request);

    const job = response.data;
    const jobName = job.name;

    console.log('✅ Fine-tuning job created successfully!\n');
    console.log(`📊 Job Details:`);
    console.log(`   Name: ${jobName}`);
    console.log(`   Display Name: ${job.displayName}`);
    console.log(`   State: ${job.state}`);
    console.log(`   Create Time: ${job.createTime}\n`);

    // Save job details
    const jobDetails = {
      jobName,
      displayName: job.displayName,
      baseModel: BASE_MODEL,
      state: job.state,
      createdAt: job.createTime,
      trainingDataPath: TRAINING_DATA_PATH,
      validationDataPath: VALIDATION_DATA_PATH,
      config: TRAINING_CONFIG,
      monitorCommand: `node src/scripts/monitorFineTuningJob.js ${jobName}`,
    };

    const outputPath = path.join(__dirname, '../../training-data/tuning-job-details.json');
    await fs.writeFile(outputPath, JSON.stringify(jobDetails, null, 2), 'utf-8');
    console.log(`💾 Job details saved to: tuning-job-details.json\n`);

    // Print monitoring instructions
    console.log('📈 Next Steps:\n');
    console.log('1. Monitor the job progress:');
    console.log(`   node src/scripts/monitorFineTuningJob.js\n`);
    console.log('2. Check job status in Cloud Console:');
    console.log(`   https://console.cloud.google.com/vertex-ai/locations/${LOCATION}/tuning-jobs/${jobName.split('/').pop()}?project=${PROJECT_ID}\n`);
    console.log('3. Once complete, the fine-tuned model will be available for deployment\n');
    console.log('⏱️  Estimated time: 30-120 minutes depending on data size\n');
    console.log('=' .repeat(70));

    return jobName;

  } catch (error) {
    console.error('\n❌ Error creating fine-tuning job:', error);

    if (error.response) {
      console.error('\nAPI Response:', JSON.stringify(error.response.data, null, 2));
    }

    if (error.message.includes('Permission denied')) {
      console.error('\n💡 Tip: Ensure your service account has the following roles:');
      console.error('   - Vertex AI User');
      console.error('   - Storage Object Viewer (for GCS bucket)');
      console.error('   - AI Platform Admin (for model management)\n');
    }

    if (error.message.includes('not found')) {
      console.error('\n💡 Tip: Make sure you have:');
      console.error('   1. Uploaded training data to GCS');
      console.error('   2. Enabled Vertex AI API');
      console.error('   3. Set correct PROJECT_ID and LOCATION\n');
    }

    throw error;
  }
}

/**
 * Verify GCS files exist (using gsutil or storage API)
 */
async function verifyGCSFiles() {
  const { Storage } = require('@google-cloud/storage');
  const storage = new Storage({
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    projectId: PROJECT_ID,
  });

  try {
    // Extract bucket and file path
    const trainingFile = TRAINING_DATA_PATH.replace('gs://', '').split('/');
    const bucket = trainingFile.shift();
    const trainingPath = trainingFile.join('/');

    const validationFile = VALIDATION_DATA_PATH.replace('gs://', '').split('/');
    validationFile.shift();
    const validationPath = validationFile.join('/');

    // Check training file
    const [trainingExists] = await storage.bucket(bucket).file(trainingPath).exists();
    if (trainingExists) {
      console.log(`   ✅ Training data found: ${TRAINING_DATA_PATH}`);
    } else {
      console.warn(`   ⚠️  Training data NOT found: ${TRAINING_DATA_PATH}`);
      console.warn(`   Please upload using: gsutil cp training-data/training-data.jsonl ${TRAINING_DATA_PATH}`);
    }

    // Check validation file
    const [validationExists] = await storage.bucket(bucket).file(validationPath).exists();
    if (validationExists) {
      console.log(`   ✅ Validation data found: ${VALIDATION_DATA_PATH}`);
    } else {
      console.warn(`   ⚠️  Validation data NOT found: ${VALIDATION_DATA_PATH}`);
      console.warn(`   Please upload using: gsutil cp training-data/validation-data.jsonl ${VALIDATION_DATA_PATH}`);
    }

    if (!trainingExists || !validationExists) {
      throw new Error('Required training files not found in GCS. Please upload them first.');
    }

  } catch (error) {
    if (error.code === 404) {
      console.error('\n❌ GCS bucket or files not found.');
      console.error(`   Create bucket: gsutil mb -p ${PROJECT_ID} -l ${LOCATION} gs://${GCS_BUCKET}/`);
      console.error(`   Upload files: gsutil cp training-data/*.jsonl gs://${GCS_BUCKET}/resume-analysis/\n`);
    }
    throw error;
  }
}

/**
 * Alternative: Create using gcloud CLI
 */
async function generateGcloudCommand() {
  const command = `gcloud ai models tuning-jobs create \\
  --region=${LOCATION} \\
  --display-name=${TUNED_MODEL_DISPLAY_NAME} \\
  --base-model=${BASE_MODEL} \\
  --training-data=${TRAINING_DATA_PATH} \\
  --validation-data=${VALIDATION_DATA_PATH} \\
  --tuning-config-epochs=${TRAINING_CONFIG.epochs} \\
  --tuning-config-learning-rate=${TRAINING_CONFIG.learningRateMultiplier} \\
  --tuning-config-adapter-size=${TRAINING_CONFIG.adapterSize} \\
  --project=${PROJECT_ID}`;

  console.log('\n📋 Alternative: gcloud command\n');
  console.log(command);

  const commandFile = path.join(__dirname, '../../training-data/gcloud-command.sh');
  await fs.writeFile(commandFile, command, 'utf-8');
  console.log(`\n💾 Command saved to: gcloud-command.sh`);
}

/**
 * Main execution
 */
async function main() {
  try {
    // Validate environment variables
    if (!PROJECT_ID) {
      throw new Error('Missing GOOGLE_CLOUD_PROJECT_ID or VERTEX_AI_PROJECT in .env');
    }

    if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      throw new Error('Missing GOOGLE_APPLICATION_CREDENTIALS in .env');
    }

    // Create fine-tuning job
    const jobName = await createFineTuningJob();

    // Generate gcloud command alternative
    await generateGcloudCommand();

    console.log('\n✅ Fine-tuning job creation complete!');
    console.log(`\n💡 Job Name: ${jobName}\n`);

  } catch (error) {
    console.error('\n❌ Failed to create fine-tuning job');
    console.error('Error:', error.message);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { createFineTuningJob };

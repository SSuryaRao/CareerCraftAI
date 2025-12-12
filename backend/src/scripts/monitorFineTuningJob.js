/**
 * Monitor Vertex AI Fine-Tuning Job
 *
 * This script monitors the progress of a fine-tuning job and displays
 * real-time updates on training metrics.
 *
 * Usage: node src/scripts/monitorFineTuningJob.js [jobName]
 */

require('dotenv').config();
const { google } = require('googleapis');
const fs = require('fs').promises;
const path = require('path');

const PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT_ID || process.env.VERTEX_AI_PROJECT;
const LOCATION = process.env.VERTEX_AI_LOCATION || 'us-central1';
const POLL_INTERVAL = 30000; // Poll every 30 seconds

/**
 * Initialize Google Cloud clients
 */
function initializeClients() {
  const auth = new google.auth.GoogleAuth({
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    scopes: ['https://www.googleapis.com/auth/cloud-platform'],
  });

  const aiplatform = google.aiplatform({
    version: 'v1beta1',
    auth: auth,
  });

  return aiplatform;
}

/**
 * Get job name from file or argument
 */
async function getJobName() {
  let jobName = process.argv[2];

  if (!jobName) {
    // Try to load from saved file
    try {
      const detailsPath = path.join(__dirname, '../../training-data/tuning-job-details.json');
      const details = JSON.parse(await fs.readFile(detailsPath, 'utf-8'));
      jobName = details.jobName;
      console.log(`📂 Loaded job name from: tuning-job-details.json`);
    } catch (error) {
      console.error('❌ No job name provided and no saved job details found.');
      console.error('Usage: node src/scripts/monitorFineTuningJob.js [jobName]');
      process.exit(1);
    }
  }

  return jobName;
}

/**
 * Get job details from Vertex AI
 */
async function getJobDetails(aiplatform, jobName) {
  try {
    const response = await aiplatform.projects.locations.tuningJobs.get({
      name: jobName,
    });

    return response.data;
  } catch (error) {
    console.error('❌ Error fetching job details:', error.message);
    throw error;
  }
}

/**
 * Display job status
 */
function displayJobStatus(job) {
  const state = job.state || 'UNKNOWN';
  const startTime = job.startTime ? new Date(job.startTime).toLocaleString() : 'Not started';
  const updateTime = job.updateTime ? new Date(job.updateTime).toLocaleString() : 'N/A';

  console.log('\n' + '='.repeat(70));
  console.log(`📊 Fine-Tuning Job Status`);
  console.log('='.repeat(70));
  console.log(`Name: ${job.name}`);
  console.log(`Display Name: ${job.displayName || 'N/A'}`);
  console.log(`State: ${getStateEmoji(state)} ${state}`);
  console.log(`Started: ${startTime}`);
  console.log(`Last Updated: ${updateTime}`);

  // Display base model and tuned model
  if (job.baseModel) {
    console.log(`Base Model: ${job.baseModel}`);
  }

  if (job.tunedModel) {
    console.log(`Tuned Model: ${job.tunedModel}`);
  }

  // Display error if any
  if (job.error) {
    console.log(`\n❌ Error: ${job.error.message}`);
    if (job.error.details) {
      console.log('Details:', JSON.stringify(job.error.details, null, 2));
    }
  }

  // Display tuning statistics if available
  if (job.tuningDataStats) {
    console.log(`\n📈 Training Data Statistics:`);
    console.log(`   Training examples: ${job.tuningDataStats.trainingDatasetSize || 'N/A'}`);
    console.log(`   Validation examples: ${job.tuningDataStats.validationDatasetSize || 'N/A'}`);
  }

  // Display training metrics if available
  if (job.tunedModelDisplayName) {
    console.log(`\n✅ Tuned Model Name: ${job.tunedModelDisplayName}`);
  }

  console.log('='.repeat(70) + '\n');
}

/**
 * Get emoji for state
 */
function getStateEmoji(state) {
  const emojis = {
    'JOB_STATE_PENDING': '⏳',
    'JOB_STATE_RUNNING': '🏃',
    'JOB_STATE_SUCCEEDED': '✅',
    'JOB_STATE_FAILED': '❌',
    'JOB_STATE_CANCELLED': '🚫',
    'JOB_STATE_CANCELLING': '⏸️',
  };
  return emojis[state] || '❓';
}

/**
 * Monitor job continuously
 */
async function monitorJob(aiplatform, jobName, continuous = true) {
  console.log(`\n🔍 Monitoring job: ${jobName}`);
  console.log(`⏱️  Polling every ${POLL_INTERVAL / 1000} seconds...\n`);

  let iteration = 0;

  while (true) {
    iteration++;

    try {
      const job = await getJobDetails(aiplatform, jobName);

      console.clear(); // Clear console for cleaner output
      console.log(`Iteration #${iteration} - ${new Date().toLocaleTimeString()}`);
      displayJobStatus(job);

      const state = job.state;

      // Check if job is terminal
      if (state === 'JOB_STATE_SUCCEEDED') {
        console.log('🎉 Fine-tuning completed successfully!\n');
        console.log('📋 Next steps:');
        console.log('   1. Deploy the tuned model:');
        console.log('      node src/scripts/deployFineTunedModel.js\n');
        console.log('   2. Update your vertexAI service to use the tuned model\n');

        // Save tuned model details
        const modelDetails = {
          tunedModel: job.tunedModel,
          displayName: job.tunedModelDisplayName,
          completedAt: new Date().toISOString(),
          state: state,
        };

        const outputPath = path.join(__dirname, '../../training-data/tuned-model-details.json');
        await fs.writeFile(outputPath, JSON.stringify(modelDetails, null, 2), 'utf-8');
        console.log(`   💾 Model details saved to: tuned-model-details.json\n`);

        break;
      }

      if (state === 'JOB_STATE_FAILED') {
        console.log('❌ Fine-tuning job failed.\n');
        console.log('Please check the error details above and:');
        console.log('   1. Verify training data format');
        console.log('   2. Check GCS file permissions');
        console.log('   3. Review job configuration\n');
        break;
      }

      if (state === 'JOB_STATE_CANCELLED') {
        console.log('🚫 Fine-tuning job was cancelled.\n');
        break;
      }

      if (!continuous) {
        break;
      }

      // Wait before next poll
      if (state === 'JOB_STATE_RUNNING' || state === 'JOB_STATE_PENDING') {
        console.log(`⏳ Waiting ${POLL_INTERVAL / 1000} seconds before next check...`);
        await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL));
      }

    } catch (error) {
      console.error(`\n❌ Error monitoring job: ${error.message}`);
      break;
    }
  }
}

/**
 * List all tuning jobs
 */
async function listAllJobs(aiplatform) {
  console.log('📋 Listing all fine-tuning jobs...\n');

  try {
    const parent = `projects/${PROJECT_ID}/locations/${LOCATION}`;
    const response = await aiplatform.projects.locations.tuningJobs.list({
      parent: parent,
      pageSize: 20,
    });

    const jobs = response.data.tuningJobs || [];

    if (jobs.length === 0) {
      console.log('No tuning jobs found.');
      return;
    }

    console.log(`Found ${jobs.length} job(s):\n`);

    jobs.forEach((job, index) => {
      console.log(`${index + 1}. ${job.displayName || 'Unnamed'}`);
      console.log(`   Name: ${job.name}`);
      console.log(`   State: ${getStateEmoji(job.state)} ${job.state}`);
      console.log(`   Created: ${new Date(job.createTime).toLocaleString()}`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ Error listing jobs:', error.message);
  }
}

/**
 * Main execution
 */
async function main() {
  try {
    const aiplatform = initializeClients();

    // Check if user wants to list all jobs
    if (process.argv[2] === '--list' || process.argv[2] === '-l') {
      await listAllJobs(aiplatform);
      return;
    }

    // Get job name and monitor
    const jobName = await getJobName();
    await monitorJob(aiplatform, jobName, true);

  } catch (error) {
    console.error('\n❌ Monitoring failed:', error.message);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { monitorJob, listAllJobs };

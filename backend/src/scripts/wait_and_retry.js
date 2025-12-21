/**
 * Wait for IAM Propagation and Retry Endpoint Test
 * Automatically retries every 30 seconds until success or max attempts
 */

const { GoogleAuth } = require('google-auth-library');
const axios = require('axios');

const PROJECT_NUMBER = '1030709276859';
const LOCATION = 'us-central1';
const ENDPOINT_ID = '6655325191230455808';
const MAX_ATTEMPTS = 15; // 15 attempts = 7.5 minutes
const RETRY_INTERVAL = 30000; // 30 seconds

async function testEndpoint() {
  const auth = new GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/cloud-platform'],
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
  });

  const client = await auth.getClient();
  const token = await client.getAccessToken();

  const endpointUrl = `https://${LOCATION}-aiplatform.googleapis.com/v1/projects/${PROJECT_NUMBER}/locations/${LOCATION}/endpoints/${ENDPOINT_ID}:predict`;

  const payload = {
    instances: [{
      contents: [{
        role: 'user',
        parts: [{ text: 'Test: Say "Fine-tuned model is working!" if you can respond.' }]
      }]
    }]
  };

  const response = await axios.post(endpointUrl, payload, {
    headers: {
      'Authorization': `Bearer ${token.token}`,
      'Content-Type': 'application/json'
    },
    validateStatus: () => true,
    transformResponse: (data) => data
  });

  return {
    status: response.status,
    data: response.data
  };
}

async function waitAndRetry() {
  console.log('⏳ Waiting for IAM Permission Propagation');
  console.log('='.repeat(80));
  console.log(`Endpoint: ${ENDPOINT_ID}`);
  console.log(`Max Attempts: ${MAX_ATTEMPTS}`);
  console.log(`Retry Interval: ${RETRY_INTERVAL/1000} seconds`);
  console.log('='.repeat(80));

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    console.log(`\n[${new Date().toLocaleTimeString()}] Attempt ${attempt}/${MAX_ATTEMPTS}...`);

    try {
      const result = await testEndpoint();

      if (result.status === 200) {
        console.log('\n' + '='.repeat(80));
        console.log('✅ SUCCESS! ENDPOINT IS ACCESSIBLE!');
        console.log('='.repeat(80));
        console.log('\nResponse:', result.data.substring(0, 500));

        try {
          const parsed = JSON.parse(result.data);
          if (parsed.predictions) {
            console.log('\n🎉 FINE-TUNED MODEL IS WORKING!');
            console.log('\nPredictions:', JSON.stringify(parsed.predictions, null, 2).substring(0, 300));
          }
        } catch (e) {
          // ignore parse error
        }

        console.log('\n✅ IAM propagation complete!');
        console.log('\nNext step: Update fineTunedAI.js to use this endpoint');
        return true;

      } else if (result.status === 403) {
        console.log(`   Status: 403 Forbidden - Still waiting for IAM...`);

        if (attempt < MAX_ATTEMPTS) {
          console.log(`   Retrying in ${RETRY_INTERVAL/1000} seconds...`);
          await new Promise(resolve => setTimeout(resolve, RETRY_INTERVAL));
        }

      } else {
        console.log(`   Unexpected status: ${result.status}`);
        console.log(`   Response:`, result.data.substring(0, 200));

        if (attempt < MAX_ATTEMPTS) {
          await new Promise(resolve => setTimeout(resolve, RETRY_INTERVAL));
        }
      }

    } catch (error) {
      console.log(`   Error: ${error.message}`);

      if (attempt < MAX_ATTEMPTS) {
        await new Promise(resolve => setTimeout(resolve, RETRY_INTERVAL));
      }
    }
  }

  console.log('\n' + '='.repeat(80));
  console.log('⏰ Reached maximum retry attempts');
  console.log('\nPossible reasons:');
  console.log('1. IAM propagation is taking longer than usual (can take up to 80 minutes in rare cases)');
  console.log('2. There may be an issue with the endpoint configuration');
  console.log('3. Additional permissions may be needed');
  console.log('\nRecommendations:');
  console.log('- Wait another 5-10 minutes and run this script again');
  console.log('- Check Google Cloud Console for any IAM or endpoint issues');
  console.log('- Contact Google Cloud Support if issue persists');
  console.log('='.repeat(80));

  return false;
}

// Run
console.log('\n🚀 Starting IAM Propagation Test...\n');
waitAndRetry().then(success => {
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error('\n💥 Fatal error:', error);
  process.exit(1);
});

/**
 * Try with Project NUMBER instead of Project ID in endpoint URL
 */

const { GoogleAuth } = require('google-auth-library');
const axios = require('axios');

const PROJECT_NUMBER = '1030709276859'; // Use NUMBER not ID
const LOCATION = 'us-central1';
const ENDPOINT_ID = '6655325191230455808';

async function testWithProjectNumber() {
  console.log('🔍 Testing Endpoint with PROJECT NUMBER\n');

  try {
    const auth = new GoogleAuth({
      scopes: ['https://www.googleapis.com/auth/cloud-platform'],
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
    });

    const client = await auth.getClient();
    const token = await client.getAccessToken();

    // Use project NUMBER
    const endpointUrl = `https://${LOCATION}-aiplatform.googleapis.com/v1/projects/${PROJECT_NUMBER}/locations/${LOCATION}/endpoints/${ENDPOINT_ID}:predict`;

    console.log('Endpoint URL:', endpointUrl);

    const payload = {
      instances: [{
        contents: [{
          role: 'user',
          parts: [{ text: 'Say "working" if you can respond' }]
        }]
      }]
    };

    console.log('\n📤 Sending request...\n');

    const response = await axios.post(endpointUrl, payload, {
      headers: {
        'Authorization': `Bearer ${token.token}`,
        'Content-Type': 'application/json'
      },
      validateStatus: () => true,
      transformResponse: (data) => data
    });

    console.log(`HTTP Status: ${response.status} ${response.statusText}`);
    console.log(`Response Time: ${Date.now()}`);
    console.log('\nRaw Response:');
    console.log(response.data);

    if (response.status === 200) {
      console.log('\n✅ SUCCESS WITH PROJECT NUMBER!');
      try {
        const parsed = JSON.parse(response.data);
        console.log('\nParsed:', JSON.stringify(parsed, null, 2));
      } catch (e) {
        // ignore
      }
    } else if (response.status === 403) {
      console.log('\n⏳ Still 403 - Waiting for IAM propagation...');
      console.log('This can take up to 7 minutes for Google Cloud IAM.');
    }

  } catch (error) {
    console.error('Error:', error.message);
  }
}

testWithProjectNumber();

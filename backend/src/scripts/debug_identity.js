const { GoogleAuth } = require('google-auth-library');
const axios = require('axios');
const path = require('path');

async function debugIdentity() {
  console.log('=== AUTHENTICATION IDENTITY DEBUGGER ===\n');

  // 1. Explicitly load credentials from the service account file
  const keyFilePath = path.resolve(__dirname, '../../credentials/gcp-service-account.json');
  console.log(`📁 Loading credentials from: ${keyFilePath}\n`);

  const auth = new GoogleAuth({
    keyFilename: keyFilePath,
    scopes: ['https://www.googleapis.com/auth/cloud-platform'],
  });

  try {
    // 2. Print the Identity
    console.log('🔍 Getting credentials information...');
    const client = await auth.getClient();
    const projectId = await auth.getProjectId();

    console.log(`Project ID: ${projectId}`);

    // Get the service account email from the credentials
    const credentials = require(keyFilePath);
    console.log(`Service Account Email: ${credentials.client_email}`);
    console.log(`Service Account ID: ${credentials.client_id}\n`);

    // 3. Print Token Details
    console.log('🔑 Generating access token...');
    const accessToken = await client.getAccessToken();
    console.log(`Access Token (first 10 chars): ${accessToken.token.substring(0, 10)}...`);
    console.log(`Token Type: ${accessToken.token ? 'Bearer' : 'Unknown'}\n`);

    // 4. Test the Endpoint
    const endpoint = '6655325191230455808';
    const location = 'us-central1';
    const url = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/endpoints/${endpoint}:predict`;

    console.log(`📡 Testing endpoint: ${endpoint}`);
    console.log(`URL: ${url}\n`);

    // 5. Log the Payload
    const payload = {
      instances: [
        {
          content: "I have a degree in computer science and 2 years of experience in web development. What career paths should I consider?"
        }
      ]
    };

    console.log('📦 Request Payload:');
    console.log(JSON.stringify(payload, null, 2));
    console.log();

    // Make the request
    console.log('🚀 Sending request...\n');
    const response = await axios.post(url, payload, {
      headers: {
        'Authorization': `Bearer ${accessToken.token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('✅ SUCCESS!');
    console.log('Response Status:', response.status);
    console.log('Response Data:');
    console.log(JSON.stringify(response.data, null, 2));

  } catch (error) {
    console.error('❌ ERROR DETAILS:\n');

    if (error.response) {
      console.error('Status Code:', error.response.status);
      console.error('Status Text:', error.response.statusText);
      console.error('Response Headers:', JSON.stringify(error.response.headers, null, 2));
      console.error('Response Data:', JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      console.error('No response received');
      console.error('Request:', error.request);
    } else {
      console.error('Error Message:', error.message);
    }

    console.error('\n📋 Full Error Stack:');
    console.error(error.stack);
  }
}

console.log('Starting authentication identity debug...\n');
debugIdentity().catch(console.error);

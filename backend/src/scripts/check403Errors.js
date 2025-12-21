/**
 * Check the 403 error messages to understand what's needed
 */

const { GoogleAuth } = require('google-auth-library');
const axios = require('axios');

const PROJECT_NUMBER = '1030709276859';
const LOCATION = 'us-central1';

async function check403Errors() {
  const auth = new GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/cloud-platform'],
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
  });

  const client = await auth.getClient();
  const token = await client.getAccessToken();

  const endpoints = [
    {
      name: 'Endpoint Predict API',
      url: `https://${LOCATION}-aiplatform.googleapis.com/v1/projects/${PROJECT_NUMBER}/locations/${LOCATION}/endpoints/6655325191230455808:predict`,
      body: { instances: [{ contents: [{ role: 'user', parts: [{ text: 'Test' }] }] }] }
    },
    {
      name: 'Publishers API',
      url: `https://${LOCATION}-aiplatform.googleapis.com/v1/projects/${PROJECT_NUMBER}/locations/${LOCATION}/publishers/google/models/gemini-1.5-flash:generateContent`,
      body: { contents: [{ role: 'user', parts: [{ text: 'Test' }] }] }
    }
  ];

  for (const endpoint of endpoints) {
    console.log('\n' + '='.repeat(80));
    console.log(endpoint.name);
    console.log('='.repeat(80));
    console.log('URL:', endpoint.url);

    try {
      const response = await axios.post(endpoint.url, endpoint.body, {
        headers: {
          'Authorization': `Bearer ${token.token}`,
          'Content-Type': 'application/json'
        },
        validateStatus: () => true,
        transformResponse: (data) => data
      });

      console.log(`\nStatus: ${response.status}`);

      if (response.data) {
        try {
          const parsed = JSON.parse(response.data);
          console.log('\nError Details:');
          console.log(JSON.stringify(parsed, null, 2));
        } catch (e) {
          console.log('Raw response:', response.data);
        }
      }

    } catch (error) {
      console.log('Error:', error.message);
    }
  }
}

check403Errors();

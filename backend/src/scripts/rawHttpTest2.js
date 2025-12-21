/**
 * Raw HTTP Test - Try with Project Number instead of Project ID
 */

const { GoogleAuth } = require('google-auth-library');
const axios = require('axios');

const PROJECT_NUMBER = '1030709276859'; // Project NUMBER not ID
const LOCATION = 'us-central1';
const MODEL_ID = '5515333943366254592';

async function testWithProjectNumber() {
  console.log('🔍 Testing with PROJECT NUMBER (not ID)\n');

  try {
    const auth = new GoogleAuth({
      scopes: ['https://www.googleapis.com/auth/cloud-platform'],
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
    });

    const client = await auth.getClient();
    const token = await client.getAccessToken();

    // Try with project NUMBER
    const endpoint = `https://${LOCATION}-aiplatform.googleapis.com/v1/projects/${PROJECT_NUMBER}/locations/${LOCATION}/models/${MODEL_ID}:generateContent`;

    console.log('Endpoint:', endpoint);

    const requestBody = {
      contents: [{
        role: 'user',
        parts: [{ text: 'Say "success" if working' }]
      }]
    };

    console.log('\n📤 Sending request...\n');

    const response = await axios.post(endpoint, requestBody, {
      headers: {
        'Authorization': `Bearer ${token.token}`,
        'Content-Type': 'application/json'
      },
      validateStatus: () => true,
      transformResponse: (data) => data
    });

    console.log('HTTP Status:', response.status, response.statusText);
    console.log('Content-Type:', response.headers['content-type']);
    console.log('Body Length:', response.data ? response.data.length : 0);
    console.log('\nRaw Body:');
    console.log(response.data);

    if (response.status === 200 && response.data) {
      try {
        const parsed = JSON.parse(response.data);
        console.log('\n✅ SUCCESS! Parsed response:');
        console.log(JSON.stringify(parsed, null, 2));

        if (parsed.candidates?.[0]?.content?.parts?.[0]?.text) {
          console.log('\n🎉 MODEL OUTPUT:');
          console.log(parsed.candidates[0].content.parts[0].text);
          console.log('\n✅ FINE-TUNED MODEL WORKS!');
          console.log('Use project NUMBER (1030709276859) not ID (careercraftai-475216)');
        }
      } catch (e) {
        console.log('Parse error:', e.message);
      }
    } else {
      console.log(`\n❌ Still failed with status ${response.status}`);
    }

  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    }
  }
}

testWithProjectNumber();

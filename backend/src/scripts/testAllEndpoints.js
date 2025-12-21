/**
 * Test ALL possible API endpoints for tuned Gemini model
 */

const { GoogleAuth } = require('google-auth-library');
const axios = require('axios');

const PROJECT_ID = 'careercraftai-475216';
const PROJECT_NUMBER = '1030709276859';
const LOCATION = 'us-central1';
const MODEL_ID = '5515333943366254592';
const MODEL_NAME = 'career-advisor-resume-analyzer-v1';

async function testAllEndpoints() {
  console.log('🔍 Testing ALL Possible Endpoints\n');

  const auth = new GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/cloud-platform'],
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
  });

  const client = await auth.getClient();
  const token = await client.getAccessToken();

  const requestBody = {
    contents: [{
      role: 'user',
      parts: [{ text: 'Test' }]
    }]
  };

  // All possible endpoint formats to try
  const endpoints = [
    // Standard Vertex AI format
    {
      name: 'Vertex AI - Project ID',
      url: `https://${LOCATION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/models/${MODEL_ID}:generateContent`
    },
    {
      name: 'Vertex AI - Project Number',
      url: `https://${LOCATION}-aiplatform.googleapis.com/v1/projects/${PROJECT_NUMBER}/locations/${LOCATION}/models/${MODEL_ID}:generateContent`
    },
    // Beta API
    {
      name: 'Vertex AI Beta - Project Number',
      url: `https://${LOCATION}-aiplatform.googleapis.com/v1beta1/projects/${PROJECT_NUMBER}/locations/${LOCATION}/models/${MODEL_ID}:generateContent`
    },
    // Publishers endpoint (for base models)
    {
      name: 'Publishers - Gemini with model ID',
      url: `https://${LOCATION}-aiplatform.googleapis.com/v1/projects/${PROJECT_NUMBER}/locations/${LOCATION}/publishers/google/models/gemini-1.5-flash-${MODEL_ID}:generateContent`
    },
    // Endpoints (for deployed models)
    {
      name: 'Endpoint - Checkpoint 4',
      url: `https://${LOCATION}-aiplatform.googleapis.com/v1/projects/${PROJECT_NUMBER}/locations/${LOCATION}/endpoints/6655325191230455808:predict`,
      body: { instances: [requestBody] } // Different format for predict
    },
    // Generative Language API (Google AI)
    {
      name: 'Generative Language API - Tuned Model',
      url: `https://generativelanguage.googleapis.com/v1beta/tunedModels/${MODEL_NAME}:generateContent`,
      skipAuth: true // Uses API key instead
    },
    // Direct model resource
    {
      name: 'Direct Model Resource',
      url: `https://${LOCATION}-aiplatform.googleapis.com/v1/projects/${PROJECT_NUMBER}/locations/${LOCATION}/models/${MODEL_ID}:predict`,
      body: { instances: [requestBody] }
    }
  ];

  for (const endpoint of endpoints) {
    console.log('\n' + '='.repeat(80));
    console.log(`Testing: ${endpoint.name}`);
    console.log(`URL: ${endpoint.url}`);
    console.log('-'.repeat(80));

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json'
        },
        validateStatus: () => true,
        transformResponse: (data) => data,
        timeout: 10000
      };

      if (!endpoint.skipAuth) {
        config.headers['Authorization'] = `Bearer ${token.token}`;
      }

      const body = endpoint.body || requestBody;

      const response = await axios.post(endpoint.url, body, config);

      console.log(`Status: ${response.status} ${response.statusText}`);
      console.log(`Content-Type: ${response.headers['content-type']}`);
      console.log(`Body Length: ${response.data ? response.data.length : 0} chars`);

      if (response.status === 200) {
        console.log('✅ SUCCESS!');
        console.log('Response:', response.data.substring(0, 500));

        try {
          const parsed = JSON.parse(response.data);
          if (parsed.candidates?.[0]?.content?.parts?.[0]?.text ||
              parsed.predictions?.[0]) {
            console.log('\n🎉 MODEL RESPONDED!');
            console.log('THIS ENDPOINT WORKS!');
            return { endpoint, response: parsed };
          }
        } catch (e) {
          console.log('Valid response but not expected format');
        }
      } else if (response.status === 404) {
        console.log('❌ 404 Not Found');
      } else if (response.status === 403) {
        console.log('❌ 403 Forbidden');
      } else {
        console.log(`⚠️  Status ${response.status}`);
        if (response.data && response.data.length < 1000) {
          console.log('Response:', response.data);
        }
      }

    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
  }

  console.log('\n' + '='.repeat(80));
  console.log('❌ No working endpoint found');
  console.log('\nConclusion: Fine-tuned Gemini models may not be accessible via');
  console.log('standard API endpoints. They may require Google AI Studio API or');
  console.log('special preview access.');
  console.log('='.repeat(80));
}

testAllEndpoints().catch(console.error);

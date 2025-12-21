/**
 * Test Fine-Tuned Model via Endpoint
 */

require('dotenv').config();
const { PredictionServiceClient } = require('@google-cloud/aiplatform').v1;

const PROJECT_NUMBER = '1030709276859';
const LOCATION = 'us-central1';
const ENDPOINT_ID = '6655325191230455808';

async function testEndpoint() {
  console.log('🧪 Testing Fine-Tuned Model Endpoint\n');
  console.log('='.repeat(80));
  console.log(`Project Number: ${PROJECT_NUMBER}`);
  console.log(`Location: ${LOCATION}`);
  console.log(`Endpoint ID: ${ENDPOINT_ID}`);
  console.log('='.repeat(80) + '\n');

  try {
    const credentials = process.env.GOOGLE_APPLICATION_CREDENTIALS;

    const clientOptions = {
      apiEndpoint: `${LOCATION}-aiplatform.googleapis.com`,
    };

    if (credentials) {
      clientOptions.keyFilename = credentials;
    }

    const client = new PredictionServiceClient(clientOptions);

    const endpoint = `projects/${PROJECT_NUMBER}/locations/${LOCATION}/endpoints/${ENDPOINT_ID}`;

    console.log(`📍 Endpoint: ${endpoint}\n`);

    // Test prompt
    const prompt = "Test: Analyze this resume.";

    // Prepare the request in Gemini format
    const instance = {
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }]
        }
      ]
    };

    const parameters = {
      temperature: 0.3,
      maxOutputTokens: 100,
      topK: 40,
      topP: 0.95
    };

    const request = {
      endpoint,
      instances: [instance],
      parameters
    };

    console.log('📤 Sending prediction request...\n');

    const [response] = await client.predict(request);

    console.log('✅ Success! Endpoint responded!\n');
    console.log('Response:', JSON.stringify(response, null, 2));

    if (response.predictions && response.predictions.length > 0) {
      console.log('\n🎉 Fine-tuned model is working!');
      console.log('Use this endpoint for all predictions.');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('\nFull error:', error);
  }
}

testEndpoint();

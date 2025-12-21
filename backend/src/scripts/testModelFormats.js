/**
 * Test different request formats for the tuned model
 */

require('dotenv').config();
const { VertexAI } = require('@google-cloud/vertexai');

const PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT_ID;
const LOCATION = 'us-central1';
const MODEL_PATH = 'projects/1030709276859/locations/us-central1/models/5515333943366254592@1';

async function testFormat(modelPath, requestFormat, description) {
  console.log('\n' + '='.repeat(80));
  console.log(`Testing: ${description}`);
  console.log(`Model: ${modelPath}`);
  console.log('-'.repeat(80));

  try {
    const credentials = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    const client = new VertexAI({
      project: PROJECT_ID,
      location: LOCATION,
      googleAuthOptions: credentials ? { keyFilename: credentials } : undefined
    });

    const model = client.getGenerativeModel({
      model: modelPath,
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 500,
      }
    });

    console.log('Sending request with format:', JSON.stringify(requestFormat, null, 2));

    const result = await model.generateContent(requestFormat);

    console.log('\nSUCCESS!');
    console.log('Response:', JSON.stringify(result.response, null, 2).substring(0, 500));

    if (result.response?.candidates?.[0]?.content?.parts?.[0]?.text) {
      console.log('\nText:', result.response.candidates[0].content.parts[0].text.substring(0, 200));
      return true;
    }

  } catch (error) {
    console.log('FAILED:', error.message);
  }

  return false;
}

async function main() {
  console.log('Testing Fine-Tuned Model with Different Request Formats\n');

  const testCases = [
    {
      model: MODEL_PATH,
      format: {
        contents: [{
          role: 'user',
          parts: [{ text: 'Say hello in 5 words' }]
        }]
      },
      description: 'Standard format with contents array'
    },
    {
      model: MODEL_PATH,
      format: 'Say hello in 5 words',
      description: 'Simple string prompt'
    },
    {
      model: MODEL_PATH.replace('@1', ''),
      format: {
        contents: [{
          role: 'user',
          parts: [{ text: 'Say hello in 5 words' }]
        }]
      },
      description: 'Without @1 version suffix'
    }
  ];

  for (const test of testCases) {
    const success = await testFormat(test.model, test.format, test.description);
    if (success) {
      console.log('\n' + '='.repeat(80));
      console.log('FOUND WORKING FORMAT!');
      console.log(`Model: ${test.model}`);
      console.log(`Format: ${test.description}`);
      console.log('='.repeat(80));
      return;
    }
  }

  console.log('\n' + '='.repeat(80));
  console.log('None of the formats worked');
  console.log('The model may need additional deployment or permissions');
  console.log('='.repeat(80));
}

main().catch(console.error);

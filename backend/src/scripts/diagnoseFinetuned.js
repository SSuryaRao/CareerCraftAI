/**
 * Diagnose Fine-Tuned Model Access Issues
 */

require('dotenv').config();
const { VertexAI } = require('@google-cloud/vertexai');

const PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT_ID;
const PROJECT_NUMBER = process.env.GOOGLE_CLOUD_PROJECT_NUMBER || '1030709276859';
const LOCATION = 'us-central1';
const MODEL_ID = '5515333943366254592';

async function testModelAccess() {
  console.log('🔍 Diagnosing Fine-Tuned Model Access\n');
  console.log('='.repeat(80));
  console.log(`Project ID: ${PROJECT_ID}`);
  console.log(`Project Number: ${PROJECT_NUMBER}`);
  console.log(`Location: ${LOCATION}`);
  console.log(`Model ID: ${MODEL_ID}`);
  console.log('='.repeat(80) + '\n');

  const credentials = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  const client = new VertexAI({
    project: PROJECT_ID,
    location: LOCATION,
    googleAuthOptions: credentials ? { keyFilename: credentials } : undefined
  });

  const testCases = [
    {
      name: 'Full path with @1',
      model: `projects/${PROJECT_NUMBER}/locations/${LOCATION}/models/${MODEL_ID}@1`
    },
    {
      name: 'Full path without version',
      model: `projects/${PROJECT_NUMBER}/locations/${LOCATION}/models/${MODEL_ID}`
    },
    {
      name: 'Model ID with @1',
      model: `${MODEL_ID}@1`
    },
    {
      name: 'Model ID only',
      model: MODEL_ID
    },
    {
      name: 'tunedModels prefix',
      model: `tunedModels/${MODEL_ID}@1`
    }
  ];

  const prompt = "Test prompt: Hello, world!";

  for (const testCase of testCases) {
    console.log(`\n${'='.repeat(80)}`);
    console.log(`Testing: ${testCase.name}`);
    console.log(`Model: ${testCase.model}`);
    console.log('-'.repeat(80));

    try {
      const model = client.getGenerativeModel({
        model: testCase.model,
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 100,
        }
      });

      console.log('✅ Model initialized');

      const request = {
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
      };

      console.log('📤 Sending request...');
      const result = await model.generateContent(request);

      console.log('✅ Request successful!');
      console.log('Response:', result.response?.candidates?.[0]?.content?.parts?.[0]?.text?.substring(0, 100));

      console.log('\n🎉 SUCCESS! This model path works!');
      console.log(`✅ Use this: ${testCase.model}`);
      return testCase.model;

    } catch (error) {
      console.log('❌ Failed:', error.message);
      if (error.message.includes('404')) {
        console.log('   → Model not found with this path');
      } else if (error.message.includes('403')) {
        console.log('   → Permission denied');
      } else if (error.message.includes('400')) {
        console.log('   → Bad request / Invalid model format');
      } else if (error.message.includes('Unexpected end of JSON input')) {
        console.log('   → Empty response from API (model might not be deployed)');
      }
    }
  }

  console.log('\n' + '='.repeat(80));
  console.log('❌ None of the model paths worked');
  console.log('\nPossible issues:');
  console.log('1. Model needs to be explicitly deployed to an endpoint');
  console.log('2. IAM permissions missing for accessing tuned models');
  console.log('3. Model is not yet available for inference');
  console.log('\nNext steps:');
  console.log('- Check Google Cloud Console for model deployment status');
  console.log('- Verify IAM roles include "Vertex AI User"');
  console.log('- Try accessing via gcloud CLI to verify permissions');
}

testModelAccess().catch(console.error);

/**
 * Test using version alias and different model references
 */

require('dotenv').config();
const { VertexAI } = require('@google-cloud/vertexai');

const PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT_ID;
const PROJECT_NUMBER = '1030709276859';
const LOCATION = 'us-central1';
const MODEL_ID = '5515333943366254592';

async function testModel(modelPath, description) {
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

    const model = client.preview.getGenerativeModel({
      model: modelPath,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 100,
      }
    });

    console.log('Sending simple test...');

    const result = await model.generateContent("Say 'Hello World' in exactly 2 words");

    if (result.response?.candidates?.[0]?.content?.parts?.[0]?.text) {
      const text = result.response.candidates[0].content.parts[0].text;
      console.log('\nSUCCESS!');
      console.log('Response:', text);
      return true;
    } else {
      console.log('No text in response');
      console.log('Response:', JSON.stringify(result.response, null, 2).substring(0, 300));
    }

  } catch (error) {
    console.log('FAILED:', error.message);
  }

  return false;
}

async function main() {
  console.log('Testing Tuned Model with Different References\n');

  const tests = [
    {
      path: `projects/${PROJECT_NUMBER}/locations/${LOCATION}/models/${MODEL_ID}@default`,
      desc: 'With @default alias'
    },
    {
      path: `projects/${PROJECT_NUMBER}/locations/${LOCATION}/models/${MODEL_ID}`,
      desc: 'Without version (should use default)'
    },
    {
      path: `tunedModels/career-advisor-resume-analyzer-v1`,
      desc: 'Using display name'
    },
    {
      path: `gemini-2.5-flash-${MODEL_ID}`,
      desc: 'Base model with ID suffix'
    }
  ];

  for (const test of tests) {
    try {
      const success = await testModel(test.path, test.desc);
      if (success) {
        console.log('\n' + '='.repeat(80));
        console.log('FOUND WORKING MODEL PATH!');
        console.log(`Use: ${test.path}`);
        console.log('='.repeat(80));
        return;
      }
    } catch (error) {
      console.log('Test error:', error.message);
    }
  }

  console.log('\n' + '='.repeat(80));
  console.log('None worked. The issue may be with Gemini tuned model access in Vertex AI.');
  console.log('Gemini tuned models may require different API access method.');
  console.log('='.repeat(80));
}

main().catch(console.error);

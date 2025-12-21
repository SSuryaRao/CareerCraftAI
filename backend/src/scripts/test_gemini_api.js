const { GoogleAuth } = require('google-auth-library');
const axios = require('axios');
const path = require('path');

async function testGeminiAPI() {
  console.log('=== TESTING GEMINI GENERATIVE AI API ===\n');

  const keyFilePath = path.resolve(__dirname, '../../credentials/gcp-service-account.json');
  console.log(`📁 Loading credentials from: ${keyFilePath}\n`);

  const auth = new GoogleAuth({
    keyFilename: keyFilePath,
    scopes: ['https://www.googleapis.com/auth/cloud-platform'],
  });

  try {
    const client = await auth.getClient();
    const projectId = await auth.getProjectId();
    const accessToken = await client.getAccessToken();

    console.log(`Project: ${projectId}`);
    console.log(`Token: ${accessToken.token.substring(0, 10)}...\n`);

    // CORRECT Gemini API endpoint format
    const model = 'gemini-1.5-flash-002';
    const location = 'us-central1';
    const url = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/${model}:generateContent`;

    console.log(`📡 Testing Gemini Model: ${model}`);
    console.log(`URL: ${url}\n`);

    // Gemini API request format
    const payload = {
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: 'I have a degree in computer science and 2 years of experience in web development. What career paths should I consider?'
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
      }
    };

    console.log('📦 Request Payload:');
    console.log(JSON.stringify(payload, null, 2));
    console.log();

    console.log('🚀 Sending request to Gemini API...\n');
    const response = await axios.post(url, payload, {
      headers: {
        'Authorization': `Bearer ${accessToken.token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('✅ SUCCESS!');
    console.log('Response Status:', response.status);
    console.log('\n📄 Gemini Response:');
    console.log(JSON.stringify(response.data, null, 2));

    // Extract and display the text response
    if (response.data.candidates && response.data.candidates[0]) {
      console.log('\n💬 Generated Text:');
      const text = response.data.candidates[0].content.parts[0].text;
      console.log(text);
    }

  } catch (error) {
    console.error('❌ ERROR:\n');

    if (error.response) {
      console.error('Status:', error.response.status, error.response.statusText);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('Message:', error.message);
      console.error('Stack:', error.stack);
    }
  }
}

testGeminiAPI().catch(console.error);

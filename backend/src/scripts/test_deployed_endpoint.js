const { GoogleAuth } = require('google-auth-library');
const axios = require('axios');
const path = require('path');

async function testDeployedEndpoint() {
  console.log('=== TESTING DEPLOYED ENDPOINT ===\n');

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

    // Endpoint details from gcloud describe
    const endpointId = '6655325191230455808';
    const location = 'us-central1';

    // Try different API endpoints
    const endpoints = [
      {
        name: 'generateContent',
        url: `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/endpoints/${endpointId}:generateContent`,
      },
      {
        name: 'rawPredict',
        url: `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/endpoints/${endpointId}:rawPredict`,
      },
      {
        name: 'serverStreamingPredict',
        url: `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/endpoints/${endpointId}:serverStreamingPredict`,
      },
    ];

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
    console.log('\n' + '='.repeat(60) + '\n');

    for (const endpoint of endpoints) {
      console.log(`\n🧪 Testing: ${endpoint.name}`);
      console.log(`URL: ${endpoint.url}\n`);

      try {
        const response = await axios.post(endpoint.url, payload, {
          headers: {
            'Authorization': `Bearer ${accessToken.token}`,
            'Content-Type': 'application/json',
          },
        });

        console.log(`✅ SUCCESS with ${endpoint.name}!`);
        console.log('Response Status:', response.status);
        console.log('\n📄 Response:');
        console.log(JSON.stringify(response.data, null, 2));

        // Extract and display the text response
        if (response.data.candidates && response.data.candidates[0]) {
          console.log('\n💬 Generated Career Advice:');
          const text = response.data.candidates[0].content.parts[0].text;
          console.log(text);
        }

        console.log('\n' + '✅'.repeat(30));
        break; // Success, no need to try other endpoints

      } catch (error) {
        console.log(`❌ Failed with ${endpoint.name}`);
        if (error.response) {
          console.log(`   Status: ${error.response.status} ${error.response.statusText}`);
          console.log(`   Error: ${JSON.stringify(error.response.data)}`);
        } else {
          console.log(`   Error: ${error.message}`);
        }
      }
    }

  } catch (error) {
    console.error('\n❌ FATAL ERROR:\n');
    console.error('Message:', error.message);
    console.error('Stack:', error.stack);
  }
}

testDeployedEndpoint().catch(console.error);

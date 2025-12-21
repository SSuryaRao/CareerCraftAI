/**
 * Raw HTTP Test for Fine-Tuned Model
 * Bypasses Vertex AI SDK to see actual API response
 */

const { GoogleAuth } = require('google-auth-library');
const axios = require('axios');

// Configuration
const PROJECT_ID = 'careercraftai-475216';
const LOCATION = 'us-central1';
const MODEL_ID = '5515333943366254592';

async function testRawHttp() {
  console.log('🔍 RAW HTTP API TEST');
  console.log('='.repeat(80));
  console.log(`Project: ${PROJECT_ID}`);
  console.log(`Location: ${LOCATION}`);
  console.log(`Model ID: ${MODEL_ID}`);
  console.log('='.repeat(80));

  try {
    // Step 1: Get authentication token
    console.log('\n1️⃣  Getting authentication token...');
    const auth = new GoogleAuth({
      scopes: ['https://www.googleapis.com/auth/cloud-platform'],
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
    });

    const client = await auth.getClient();
    const token = await client.getAccessToken();

    if (!token.token) {
      throw new Error('Failed to get access token');
    }

    console.log(`   ✅ Token obtained: ${token.token.substring(0, 20)}...`);

    // Step 2: Construct the API endpoint
    const endpoint = `https://${LOCATION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/models/${MODEL_ID}:generateContent`;

    console.log('\n2️⃣  API Endpoint:');
    console.log(`   ${endpoint}`);

    // Step 3: Prepare request body
    const requestBody = {
      contents: [{
        role: 'user',
        parts: [{ text: 'Hello! Say "working" if you can respond.' }]
      }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 100
      }
    };

    console.log('\n3️⃣  Request Body:');
    console.log(JSON.stringify(requestBody, null, 2));

    // Step 4: Make raw HTTP request
    console.log('\n4️⃣  Sending HTTP POST request...');
    console.log('   (This may take 2-10 seconds)');

    const startTime = Date.now();

    const response = await axios.post(endpoint, requestBody, {
      headers: {
        'Authorization': `Bearer ${token.token}`,
        'Content-Type': 'application/json'
      },
      validateStatus: () => true, // Don't throw on any status code
      transformResponse: (data) => data // Get raw response, don't auto-parse JSON
    });

    const elapsed = Date.now() - startTime;

    // Step 5: Print raw response
    console.log('\n5️⃣  RAW HTTP RESPONSE:');
    console.log('='.repeat(80));
    console.log(`HTTP Status Code: ${response.status} ${response.statusText}`);
    console.log(`Response Time: ${elapsed}ms`);
    console.log('\nResponse Headers:');
    console.log(JSON.stringify(response.headers, null, 2));

    console.log('\n📄 RAW RESPONSE BODY (as text):');
    console.log('-'.repeat(80));
    console.log(typeof response.data);
    console.log(response.data);
    console.log('-'.repeat(80));

    console.log(`\nBody Length: ${response.data ? response.data.length : 0} characters`);

    // Step 6: Analyze the response
    console.log('\n6️⃣  ANALYSIS:');
    console.log('='.repeat(80));

    if (response.status === 200) {
      console.log('✅ HTTP 200 OK - API accepted the request');

      if (!response.data || response.data.length === 0) {
        console.log('❌ BUT: Response body is EMPTY');
        console.log('   → This is the root cause of "Unexpected end of JSON input"');
        console.log('   → The SDK tries to parse empty string as JSON and fails');
      } else {
        try {
          const parsed = JSON.parse(response.data);
          console.log('✅ Response is valid JSON');
          console.log('\nParsed Response:');
          console.log(JSON.stringify(parsed, null, 2));

          if (parsed.candidates && parsed.candidates[0]?.content?.parts?.[0]?.text) {
            console.log('\n🎉 SUCCESS! Model responded:');
            console.log(parsed.candidates[0].content.parts[0].text);
          }
        } catch (parseError) {
          console.log('❌ Response is NOT valid JSON');
          console.log(`   Parse error: ${parseError.message}`);
        }
      }
    } else if (response.status === 403) {
      console.log('❌ HTTP 403 FORBIDDEN - Permission denied');
      console.log('   → Check IAM permissions for this model');
    } else if (response.status === 404) {
      console.log('❌ HTTP 404 NOT FOUND - Model not found');
      console.log('   → Model may not be accessible via this endpoint');
    } else if (response.status === 400) {
      console.log('❌ HTTP 400 BAD REQUEST - Invalid request format');
    } else if (response.status >= 500) {
      console.log('❌ HTTP 5xx SERVER ERROR - Google API is having issues');
    } else {
      console.log(`⚠️  Unexpected status code: ${response.status}`);
    }

    console.log('='.repeat(80));

  } catch (error) {
    console.error('\n💥 ERROR OCCURRED:');
    console.error('='.repeat(80));
    console.error('Error Type:', error.constructor.name);
    console.error('Error Message:', error.message);

    if (error.response) {
      console.error('\nHTTP Response Details:');
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);
      console.error('Data:', error.response.data);
    }

    if (error.code) {
      console.error('Error Code:', error.code);
    }

    console.error('\nFull Error Stack:');
    console.error(error.stack);
    console.error('='.repeat(80));
  }
}

// Run the test
console.log('\n🚀 Starting Raw HTTP Test...\n');
testRawHttp().then(() => {
  console.log('\n✅ Test Complete\n');
}).catch(err => {
  console.error('\n💥 Test Failed:', err);
  process.exit(1);
});

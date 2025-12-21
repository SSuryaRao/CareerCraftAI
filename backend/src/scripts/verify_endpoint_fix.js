/**
 * Verify Endpoint Fix - Test Fine-Tuned Model via Endpoint Predict API
 * After granting aiplatform.user permission
 */

const { GoogleAuth } = require('google-auth-library');
const axios = require('axios');

const PROJECT_ID = 'careercraftai-475216';
const LOCATION = 'us-central1';
const ENDPOINT_ID = '6655325191230455808';

async function verifyEndpointFix() {
  console.log('🔧 VERIFYING ENDPOINT FIX');
  console.log('='.repeat(80));
  console.log(`Project: ${PROJECT_ID}`);
  console.log(`Location: ${LOCATION}`);
  console.log(`Endpoint: ${ENDPOINT_ID}`);
  console.log('='.repeat(80));

  try {
    // Step 1: Authenticate
    console.log('\n1️⃣  Authenticating...');
    const auth = new GoogleAuth({
      scopes: ['https://www.googleapis.com/auth/cloud-platform'],
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
    });

    const client = await auth.getClient();
    const token = await client.getAccessToken();
    console.log(`   ✅ Token obtained`);

    // Step 2: Construct endpoint URL
    const endpointUrl = `https://${LOCATION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/endpoints/${ENDPOINT_ID}:predict`;

    console.log('\n2️⃣  Endpoint URL:');
    console.log(`   ${endpointUrl}`);

    // Step 3: Try different payload formats
    const payloadFormats = [
      {
        name: 'Standard Gemini Format',
        payload: {
          instances: [{
            contents: [{
              role: 'user',
              parts: [{ text: 'Hello! Please say "Fine-tuned model working!" if you can respond.' }]
            }]
          }]
        }
      },
      {
        name: 'Simple Content Format',
        payload: {
          instances: [{
            content: 'Hello! Please say "Fine-tuned model working!" if you can respond.'
          }]
        }
      },
      {
        name: 'Prompt Format',
        payload: {
          instances: [{
            prompt: 'Hello! Please say "Fine-tuned model working!" if you can respond.'
          }]
        }
      },
      {
        name: 'Direct Text Format',
        payload: {
          instances: ['Hello! Please say "Fine-tuned model working!" if you can respond.']
        }
      }
    ];

    for (const format of payloadFormats) {
      console.log('\n' + '='.repeat(80));
      console.log(`Testing: ${format.name}`);
      console.log('-'.repeat(80));
      console.log('Payload:', JSON.stringify(format.payload, null, 2));

      try {
        const startTime = Date.now();

        const response = await axios.post(endpointUrl, format.payload, {
          headers: {
            'Authorization': `Bearer ${token.token}`,
            'Content-Type': 'application/json'
          },
          validateStatus: () => true,
          transformResponse: (data) => data
        });

        const elapsed = Date.now() - startTime;

        console.log(`\nHTTP Status: ${response.status} ${response.statusText}`);
        console.log(`Response Time: ${elapsed}ms`);
        console.log(`Content-Type: ${response.headers['content-type']}`);
        console.log(`Body Length: ${response.data ? response.data.length : 0} chars`);

        console.log('\n📄 Raw Response Body:');
        console.log('-'.repeat(80));
        console.log(response.data);
        console.log('-'.repeat(80));

        if (response.status === 200) {
          console.log('\n✅ SUCCESS! HTTP 200 OK');

          try {
            const parsed = JSON.parse(response.data);
            console.log('\n📊 Parsed Response:');
            console.log(JSON.stringify(parsed, null, 2));

            // Check for predictions
            if (parsed.predictions && parsed.predictions.length > 0) {
              console.log('\n🎉 FINE-TUNED MODEL IS WORKING!');
              console.log('Predictions:', parsed.predictions);

              console.log('\n✅ SOLUTION FOUND:');
              console.log(`   Format: ${format.name}`);
              console.log(`   Endpoint: ${endpointUrl}`);
              console.log(`   Payload Structure:`, JSON.stringify(format.payload, null, 2));

              return {
                success: true,
                format: format.name,
                endpoint: endpointUrl,
                payload: format.payload,
                response: parsed
              };
            }

          } catch (parseError) {
            console.log('⚠️  Response is not JSON:', parseError.message);
          }

        } else if (response.status === 403) {
          console.log('\n❌ Still 403 Forbidden');
          console.log('   Permission may not have propagated yet. Wait 1-2 minutes and retry.');
        } else if (response.status === 400) {
          console.log('\n❌ 400 Bad Request - Wrong payload format');
          console.log('   Trying next format...');
        }

      } catch (error) {
        console.log(`\n❌ Request Error: ${error.message}`);
      }
    }

    console.log('\n' + '='.repeat(80));
    console.log('❌ None of the formats worked');
    console.log('\nPossible issues:');
    console.log('1. IAM permission may take 1-2 minutes to propagate');
    console.log('2. Endpoint may require different payload format');
    console.log('3. Model deployment may have issues');
    console.log('='.repeat(80));

    return { success: false };

  } catch (error) {
    console.error('\n💥 Fatal Error:');
    console.error(error);
    return { success: false, error };
  }
}

// Run the verification
console.log('\n🚀 Starting Endpoint Verification...\n');

verifyEndpointFix().then(result => {
  console.log('\n📋 FINAL RESULT:');
  console.log('='.repeat(80));

  if (result.success) {
    console.log('✅ FINE-TUNED MODEL IS ACCESSIBLE!');
    console.log('\nNext Step: Update fineTunedAI.js to use this endpoint format');
  } else {
    console.log('❌ Endpoint still not accessible');
    console.log('Wait 1-2 minutes for IAM propagation, then run this script again');
  }

  console.log('='.repeat(80));
  console.log('\n✅ Verification Complete\n');

}).catch(err => {
  console.error('Verification failed:', err);
  process.exit(1);
});

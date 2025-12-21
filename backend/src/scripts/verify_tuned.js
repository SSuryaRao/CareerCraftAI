/**
 * Verification script as suggested
 * Testing fine-tuned model access with exact recommended format
 */

const { VertexAI } = require('@google-cloud/vertexai');

// HARDCODED SPECS
const PROJECT_ID = 'careercraftai-475216';
const LOCATION = 'us-central1';
const TUNED_MODEL_ID = '5515333943366254592';

async function test() {
  console.log("1. Initializing Vertex AI...");
  console.log(`   Project: ${PROJECT_ID}`);
  console.log(`   Location: ${LOCATION}`);
  console.log(`   Model ID: ${TUNED_MODEL_ID}\n`);

  const vertex_ai = new VertexAI({
    project: PROJECT_ID,
    location: LOCATION,
    googleAuthOptions: process.env.GOOGLE_APPLICATION_CREDENTIALS
      ? { keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS }
      : undefined
  });

  console.log("2. Connecting to Tuned Model directly (bypassing Endpoint ID)...");

  // Test both with and without @1 version suffix
  const modelPaths = [
    `projects/${PROJECT_ID}/locations/${LOCATION}/models/${TUNED_MODEL_ID}`,
    `projects/${PROJECT_ID}/locations/${LOCATION}/models/${TUNED_MODEL_ID}@1`,
    `projects/1030709276859/locations/${LOCATION}/models/${TUNED_MODEL_ID}`, // with project number
    `projects/1030709276859/locations/${LOCATION}/models/${TUNED_MODEL_ID}@1`
  ];

  for (const modelPath of modelPaths) {
    console.log(`\n${'='.repeat(80)}`);
    console.log(`Testing: ${modelPath}`);
    console.log('-'.repeat(80));

    try {
      const generativeModel = vertex_ai.getGenerativeModel({
        model: modelPath,
      });

      console.log("3. Sending request...");
      const request = {
        contents: [{ role: 'user', parts: [{ text: 'Hello, are you working?' }] }],
      };

      // Try non-streaming first (easier to debug)
      const result = await generativeModel.generateContent(request);

      console.log("\n✅ SUCCESS! Response received:");
      console.log(JSON.stringify(result.response, null, 2));

      if (result.response?.candidates?.[0]?.content?.parts?.[0]?.text) {
        console.log("\n🎉 ACTUAL TEXT OUTPUT:");
        console.log(result.response.candidates[0].content.parts[0].text);
        console.log("\n✅ THIS MODEL PATH WORKS! Use it in your .env");
        console.log(`   FINE_TUNED_MODEL_PATH=${modelPath}`);
        return true;
      } else {
        console.log("\n⚠️  Response received but no text content");
      }

    } catch (error) {
      console.log("\n❌ FAILED:");
      console.log(`   Error: ${error.message}`);

      if (error.message.includes('Unexpected end of JSON input')) {
        console.log("   → This is the empty response issue (API returns nothing)");
      } else if (error.message.includes('404')) {
        console.log("   → Model not found at this path");
      } else if (error.message.includes('403')) {
        console.log("   → Permission denied");
      }
    }
  }

  console.log(`\n${'='.repeat(80)}`);
  console.log("❌ None of the model paths worked");
  console.log("\nThis confirms the API is returning empty responses.");
  console.log("Next: Try the curl command to test direct HTTP access");
  return false;
}

// Add curl command template
function printCurlCommand() {
  console.log('\n' + '='.repeat(80));
  console.log('CURL TEST COMMAND:');
  console.log('='.repeat(80));
  console.log('Run this in PowerShell to test direct API access:\n');
  console.log('$token = (gcloud auth print-access-token)');
  console.log('$headers = @{');
  console.log('    "Authorization" = "Bearer $token"');
  console.log('    "Content-Type" = "application/json"');
  console.log('}');
  console.log('$body = @{');
  console.log('    "contents" = @(');
  console.log('        @{');
  console.log('            "role" = "user"');
  console.log('            "parts" = @(@{ "text" = "Hello, test" })');
  console.log('        }');
  console.log('    )');
  console.log('} | ConvertTo-Json -Depth 10\n');
  console.log('Invoke-RestMethod -Method Post `');
  console.log('  -Uri "https://us-central1-aiplatform.googleapis.com/v1/projects/1030709276859/locations/us-central1/models/5515333943366254592:generateContent" `');
  console.log('  -Headers $headers `');
  console.log('  -Body $body');
  console.log('\n' + '='.repeat(80));
}

test().then(success => {
  if (!success) {
    printCurlCommand();
  }
}).catch(console.error);

/**
 * fix_tuned_connection.js
 * Forces connection via Model Resource Name to bypass JSON parsing errors
 */
const { VertexAI } = require('@google-cloud/vertexai');

// 1. Setup your specific configuration
const PROJECT_ID = 'careercraftai-475216';
const LOCATION = 'us-central1';
const TUNED_MODEL_ID = '5515333943366254592'; // The Model ID from your logs

async function testConnection() {
  console.log("🚀 Initializing Vertex AI Connection...");

  const vertex_ai = new VertexAI({
    project: PROJECT_ID,
    location: LOCATION
  });

  // CRITICAL FIX: Construct the full resource path manually
  // Do NOT use the Endpoint ID (6655...). Use the Model ID with the full path.
  const fineTunedModelName = `projects/${PROJECT_ID}/locations/${LOCATION}/models/${TUNED_MODEL_ID}`;

  console.log(`📡 Connecting to: ${fineTunedModelName}`);

  const generativeModel = vertex_ai.getGenerativeModel({
    model: fineTunedModelName,
  });

  const request = {
    contents: [{
      role: 'user',
      parts: [{ text: 'Hello! Please introduce yourself.' }]
    }]
  };

  try {
    console.log("⏳ Sending request (this usually takes 2-5 seconds)...");

    // Disable streaming for the test to see the raw response clearly
    const resp = await generativeModel.generateContent(request);

    console.log("\n✅ SUCCESS! received response:");
    console.log("---------------------------------------------------");
    console.log(resp.response.candidates[0].content.parts[0].text);
    console.log("---------------------------------------------------");

    console.log("\n🎉 YOUR FINE-TUNED MODEL WORKS!");
    console.log("\nTo use it in your app:");
    console.log("1. Update .env: USE_FINE_TUNED_MODEL=true");
    console.log("2. Update .env: FINE_TUNED_MODEL_PATH=" + fineTunedModelName);
    console.log("3. Restart backend: npm run dev");

  } catch (error) {
    console.error("\n❌ ERROR DETAILS:");
    console.error("Error message:", error.message);
    console.error("\nFull error:", error);

    if (error.message.includes('Unexpected end of JSON input')) {
      console.log("\n⚠️  Still getting empty response error.");
      console.log("This confirms it's a Google API issue, not configuration.");
    }
  }
}

testConnection();

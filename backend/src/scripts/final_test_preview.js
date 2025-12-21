/**
 * Final test using preview API
 */
const { VertexAI } = require('@google-cloud/vertexai');

const PROJECT_ID = 'careercraftai-475216';
const LOCATION = 'us-central1';
const MODEL_ID = '5515333943366254592';

async function testPreviewAPI() {
  console.log("Testing with preview API methods...\n");

  const vertex_ai = new VertexAI({
    project: PROJECT_ID,
    location: LOCATION
  });

  const modelPath = `projects/${PROJECT_ID}/locations/${LOCATION}/models/${MODEL_ID}`;

  console.log("1. Testing standard API...");
  try {
    const model = vertex_ai.getGenerativeModel({ model: modelPath });
    const result = await model.generateContent("Say hi");
    console.log("✅ Standard API works!");
    console.log(result.response.candidates[0].content.parts[0].text);
    return true;
  } catch (e) {
    console.log("❌ Standard API failed:", e.message);
  }

  console.log("\n2. Testing preview API...");
  try {
    if (vertex_ai.preview) {
      const model = vertex_ai.preview.getGenerativeModel({ model: modelPath });
      const result = await model.generateContent("Say hi");
      console.log("✅ Preview API works!");
      console.log(result.response.candidates[0].content.parts[0].text);
      return true;
    } else {
      console.log("⚠️  No preview API available in this SDK version");
    }
  } catch (e) {
    console.log("❌ Preview API failed:", e.message);
  }

  console.log("\n3. Testing with streaming disabled...");
  try {
    const model = vertex_ai.getGenerativeModel({
      model: modelPath,
      generationConfig: { candidateCount: 1 }
    });
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: "Say hi" }] }]
    });
    console.log("✅ Non-streaming works!");
    console.log(result.response.candidates[0].content.parts[0].text);
    return true;
  } catch (e) {
    console.log("❌ Non-streaming failed:", e.message);
  }

  console.log("\n📊 ALL METHODS FAILED");
  console.log("This definitively confirms the API is not serving the tuned model.");
  return false;
}

testPreviewAPI().catch(console.error);

/**
 * Quick Test - Resume Builder vs Analyzer
 * Tests the specific conflict that was fixed
 */

const { SessionsClient } = require('@google-cloud/dialogflow-cx');
require('dotenv').config();

async function quickTest() {
  const projectId = process.env.DIALOGFLOW_PROJECT_ID;
  const location = process.env.DIALOGFLOW_LOCATION || 'us-central1';
  const agentId = process.env.DIALOGFLOW_AGENT_ID;
  const credentials = process.env.GOOGLE_APPLICATION_CREDENTIALS;

  const sessionsClient = new SessionsClient({
    keyFilename: credentials,
    apiEndpoint: `${location}-dialogflow.googleapis.com`
  });

  const sessionId = `quick-test-${Date.now()}`;

  console.log('\n🧪 Quick Test: Resume Builder vs Analyzer\n');
  console.log('='.repeat(80) + '\n');

  const testQueries = [
    { query: 'resume builder', expected: 'resume.builder.create' },
    { query: 'build resume', expected: 'resume.builder.create' },
    { query: 'create resume', expected: 'resume.builder.create' },
    { query: 'make resume', expected: 'resume.builder.create' },
    { query: 'analyze resume', expected: 'resume.analyze' },
    { query: 'check ats score', expected: 'resume.analyze' },
    { query: 'upload resume', expected: 'resume.analyze' }
  ];

  let passed = 0;
  let failed = 0;

  for (const test of testQueries) {
    const sessionPath = sessionsClient.projectLocationAgentSessionPath(
      projectId, location, agentId, sessionId
    );

    const request = {
      session: sessionPath,
      queryInput: {
        text: { text: test.query },
        languageCode: 'en',
      },
    };

    const [response] = await sessionsClient.detectIntent(request);
    const detectedIntent = response.queryResult.intent?.displayName || 'No Match';
    const confidence = response.queryResult.intentDetectionConfidence || 0;

    const isMatch = detectedIntent === test.expected;
    const status = isMatch ? '✅' : '❌';
    const confEmoji = confidence >= 0.7 ? '🟢' : confidence >= 0.4 ? '🟡' : '🔴';

    console.log(`${status} "${test.query}"`);
    console.log(`   Expected: ${test.expected}`);
    console.log(`   Detected: ${detectedIntent} ${confEmoji} (${(confidence * 100).toFixed(1)}%)`);

    if (isMatch) {
      passed++;
      console.log(`   ✓ CORRECT!\n`);
    } else {
      failed++;
      console.log(`   ✗ WRONG!\n`);
    }

    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('='.repeat(80));
  console.log(`\n📊 Results: ${passed}/${testQueries.length} passed\n`);

  if (failed === 0) {
    console.log('🎉 SUCCESS! All tests passed! The conflict is FIXED!\n');
  } else {
    console.log(`⚠️  ${failed} test(s) failed. The issue may need more time or manual configuration.\n`);
  }
}

quickTest().catch(console.error);

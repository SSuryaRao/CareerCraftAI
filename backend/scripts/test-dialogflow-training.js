/**
 * Test Dialogflow CX Training
 *
 * This script verifies that all intents are properly trained and responding correctly
 * Run: node scripts/test-dialogflow-training.js
 */

const { SessionsClient, IntentsClient } = require('@google-cloud/dialogflow-cx');
require('dotenv').config();

class DialogflowTrainingTester {
  constructor() {
    this.projectId = process.env.DIALOGFLOW_PROJECT_ID;
    this.location = process.env.DIALOGFLOW_LOCATION || 'us-central1';
    this.agentId = process.env.DIALOGFLOW_AGENT_ID;
    this.credentials = process.env.GOOGLE_APPLICATION_CREDENTIALS;

    this.sessionsClient = new SessionsClient({
      keyFilename: this.credentials,
      apiEndpoint: `${this.location}-dialogflow.googleapis.com`
    });

    this.intentsClient = new IntentsClient({
      keyFilename: this.credentials,
      apiEndpoint: `${this.location}-dialogflow.googleapis.com`
    });

    this.agentPath = `projects/${this.projectId}/locations/${this.location}/agents/${this.agentId}`;
    this.sessionId = `test-session-${Date.now()}`;
  }

  /**
   * List all intents in the agent
   */
  async listAllIntents() {
    try {
      console.log('\n📋 Checking all intents in the agent...\n');

      const [intents] = await this.intentsClient.listIntents({
        parent: this.agentPath,
        languageCode: 'en'
      });

      console.log(`✅ Found ${intents.length} total intents:\n`);

      const expectedIntents = [
        'resume.builder.create',
        'resume.builder.autofill',
        'resume.builder.templates',
        'resume.builder.ai_summary',
        'resume.difference',
        'resume.analyze',
        'interview.practice',
        'roadmap.view',
        'roadmap.create',
        'job.search',
        'mentor.connect',
        'scholarship.search',
        'profile.view',
        'profile.update',
        'subscription.info',
        'features.list',
        'navigation.about',
        'navigation.contact',
        'skills.manage',
        'onboarding.start',
        'resources.guides',
        'feedback.submit',
        'Default Welcome Intent',
        'help.general',
        'feedback.positive',
        'goodbye'
      ];

      let foundCount = 0;
      let missingIntents = [];

      expectedIntents.forEach(expectedIntent => {
        const found = intents.find(intent => intent.displayName === expectedIntent);
        if (found) {
          console.log(`   ✓ ${expectedIntent}`);
          foundCount++;
        } else {
          console.log(`   ✗ ${expectedIntent} - MISSING!`);
          missingIntents.push(expectedIntent);
        }
      });

      console.log(`\n📊 Intent Status: ${foundCount}/${expectedIntents.length} expected intents found`);

      if (missingIntents.length > 0) {
        console.log(`\n⚠️  Missing Intents: ${missingIntents.join(', ')}`);
        return false;
      }

      return true;
    } catch (error) {
      console.error('❌ Error listing intents:', error.message);
      return false;
    }
  }

  /**
   * Test a single query
   */
  async testQuery(query, expectedIntent) {
    try {
      const sessionPath = this.sessionsClient.projectLocationAgentSessionPath(
        this.projectId,
        this.location,
        this.agentId,
        this.sessionId
      );

      const request = {
        session: sessionPath,
        queryInput: {
          text: {
            text: query,
          },
          languageCode: 'en',
        },
      };

      const [response] = await this.sessionsClient.detectIntent(request);
      const queryResult = response.queryResult;
      const detectedIntent = queryResult.intent?.displayName || 'No Match';
      const confidence = queryResult.intentDetectionConfidence || 0;
      const responseText = queryResult.responseMessages
        .filter(msg => msg.text)
        .map(msg => msg.text.text[0])
        .join(' ');

      const isMatch = expectedIntent ? detectedIntent === expectedIntent : true;
      const status = isMatch ? '✅' : '❌';
      const confidenceColor = confidence >= 0.7 ? '🟢' : confidence >= 0.4 ? '🟡' : '🔴';

      console.log(`${status} Query: "${query}"`);
      console.log(`   Intent: ${detectedIntent} ${confidenceColor} (${(confidence * 100).toFixed(1)}%)`);
      if (expectedIntent && !isMatch) {
        console.log(`   Expected: ${expectedIntent}`);
      }
      console.log(`   Response: ${responseText.substring(0, 100)}${responseText.length > 100 ? '...' : ''}`);
      console.log();

      return { query, detectedIntent, expectedIntent, confidence, responseText, isMatch };
    } catch (error) {
      console.error(`❌ Error testing query "${query}":`, error.message);
      return { query, error: error.message, isMatch: false };
    }
  }

  /**
   * Run comprehensive tests
   */
  async runTests() {
    console.log('\n🚀 Dialogflow CX Training Verification\n');
    console.log('=' .repeat(80));
    console.log(`📍 Project: ${this.projectId}`);
    console.log(`📍 Location: ${this.location}`);
    console.log(`📍 Agent ID: ${this.agentId}\n`);

    // Step 1: Check all intents exist
    console.log('=' .repeat(80));
    const intentsOk = await this.listAllIntents();

    if (!intentsOk) {
      console.log('\n❌ Some intents are missing. Please run the training script again.');
      return;
    }

    // Step 2: Test sample queries
    console.log('\n' + '='.repeat(80));
    console.log('\n🧪 Testing Sample Queries...\n');
    console.log('='.repeat(80) + '\n');

    const testCases = [
      // Resume Builder Tests
      { query: 'build a resume', expected: 'resume.builder.create' },
      { query: 'create professional resume', expected: 'resume.builder.create' },
      { query: 'I want to make a resume', expected: 'resume.builder.create' },
      { query: 'show me resume templates', expected: 'resume.builder.templates' },
      { query: 'autofill my resume from profile', expected: 'resume.builder.autofill' },
      { query: 'generate professional summary with AI', expected: 'resume.builder.ai_summary' },
      { query: 'what is the difference between analyzer and builder', expected: 'resume.difference' },

      // Resume Analyzer Tests
      { query: 'analyze my resume', expected: 'resume.analyze' },
      { query: 'check my resume ats score', expected: 'resume.analyze' },

      // Mock Interview Tests
      { query: 'practice interview', expected: 'interview.practice' },
      { query: 'mock interview preparation', expected: 'interview.practice' },

      // Career Roadmap Tests
      { query: 'show my career roadmap', expected: 'roadmap.view' },
      { query: 'create a learning path', expected: 'roadmap.create' },

      // Job Search Tests
      { query: 'find jobs for me', expected: 'job.search' },
      { query: 'search for remote jobs', expected: 'job.search' },

      // AI Mentor Tests
      { query: 'talk to a mentor', expected: 'mentor.connect' },
      { query: 'I need career advice', expected: 'mentor.connect' },

      // Scholarship Tests
      { query: 'find scholarships', expected: 'scholarship.search' },

      // Profile Tests
      { query: 'view my profile', expected: 'profile.view' },
      { query: 'update my profile', expected: 'profile.update' },

      // Subscription Tests
      { query: 'what are the pricing plans', expected: 'subscription.info' },
      { query: 'how much does it cost', expected: 'subscription.info' },

      // Navigation Tests
      { query: 'about careercraft', expected: 'navigation.about' },
      { query: 'contact support', expected: 'navigation.contact' },

      // Skills Tests
      { query: 'manage my skills', expected: 'skills.manage' },

      // Resources Tests
      { query: 'show me career guides', expected: 'resources.guides' },

      // Feedback Tests
      { query: 'submit feedback', expected: 'feedback.submit' },

      // Features List Tests
      { query: 'what can you do', expected: 'features.list' },
      { query: 'show all features', expected: 'features.list' },

      // General Tests
      { query: 'hello', expected: 'Default Welcome Intent' },
      { query: 'help me', expected: 'help.general' },
      { query: 'thank you', expected: 'feedback.positive' },
      { query: 'goodbye', expected: 'goodbye' }
    ];

    let passedTests = 0;
    let failedTests = 0;
    const results = [];

    for (const testCase of testCases) {
      const result = await this.testQuery(testCase.query, testCase.expected);
      results.push(result);

      if (result.isMatch) {
        passedTests++;
      } else {
        failedTests++;
      }

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Summary
    console.log('='.repeat(80));
    console.log('\n📊 Test Results Summary\n');
    console.log('='.repeat(80) + '\n');
    console.log(`✅ Passed: ${passedTests}/${testCases.length}`);
    console.log(`❌ Failed: ${failedTests}/${testCases.length}`);
    console.log(`📈 Success Rate: ${((passedTests / testCases.length) * 100).toFixed(1)}%\n`);

    if (failedTests > 0) {
      console.log('⚠️  Failed Tests:');
      results.filter(r => !r.isMatch).forEach(r => {
        console.log(`   • "${r.query}" → Expected: ${r.expectedIntent}, Got: ${r.detectedIntent}`);
      });
      console.log();
    }

    // Confidence Analysis
    const avgConfidence = results.reduce((sum, r) => sum + (r.confidence || 0), 0) / results.length;
    const highConfidence = results.filter(r => r.confidence >= 0.7).length;
    const mediumConfidence = results.filter(r => r.confidence >= 0.4 && r.confidence < 0.7).length;
    const lowConfidence = results.filter(r => r.confidence < 0.4).length;

    console.log('📊 Confidence Analysis:\n');
    console.log(`   Average Confidence: ${(avgConfidence * 100).toFixed(1)}%`);
    console.log(`   🟢 High Confidence (≥70%): ${highConfidence}`);
    console.log(`   🟡 Medium Confidence (40-70%): ${mediumConfidence}`);
    console.log(`   🔴 Low Confidence (<40%): ${lowConfidence}\n`);

    console.log('='.repeat(80));

    if (passedTests === testCases.length && avgConfidence >= 0.7) {
      console.log('\n🎉 SUCCESS! Your Dialogflow agent is properly trained and working great!\n');
    } else if (passedTests >= testCases.length * 0.8) {
      console.log('\n✅ GOOD! Most tests passed. Some fine-tuning may be needed.\n');
    } else {
      console.log('\n⚠️  WARNING! Multiple tests failed. Consider retraining the agent.\n');
    }

    console.log('💡 Tips:');
    console.log('   • Wait 1-2 minutes after training for changes to take effect');
    console.log('   • If confidence is low, add more training phrases');
    console.log('   • Test in the Dialogflow Console for visual feedback\n');
  }
}

// Run the tests
if (require.main === module) {
  const tester = new DialogflowTrainingTester();
  tester.runTests().catch(console.error);
}

module.exports = DialogflowTrainingTester;

/**
 * Improve Resume Builder Intent Training
 *
 * This script adds MORE SPECIFIC training phrases to distinguish
 * "resume builder" from "resume analyzer"
 *
 * Run: node scripts/improve-resume-builder-training.js
 */

const { IntentsClient } = require('@google-cloud/dialogflow-cx');
require('dotenv').config();

class ResumeBuilderTrainingImprover {
  constructor() {
    this.projectId = process.env.DIALOGFLOW_PROJECT_ID;
    this.location = process.env.DIALOGFLOW_LOCATION || 'us-central1';
    this.agentId = process.env.DIALOGFLOW_AGENT_ID;
    this.credentials = process.env.GOOGLE_APPLICATION_CREDENTIALS;

    this.intentsClient = new IntentsClient({
      keyFilename: this.credentials,
      apiEndpoint: `${this.location}-dialogflow.googleapis.com`
    });

    this.agentPath = `projects/${this.projectId}/locations/${this.location}/agents/${this.agentId}`;
  }

  /**
   * Get improved training phrases for each intent
   */
  getImprovedTrainingPhrases() {
    return {
      'resume.builder.create': [
        // Use "builder" keyword explicitly
        'resume builder',
        'open resume builder',
        'go to resume builder',
        'use resume builder',
        'access resume builder',

        // Use "build" and "create" with clear context
        'build new resume',
        'build fresh resume',
        'build professional resume',
        'create new resume',
        'create fresh resume',
        'create professional resume',
        'make new resume',
        'make fresh resume',

        // Use "from scratch" to distinguish from analyze
        'build resume from scratch',
        'create resume from scratch',
        'make resume from scratch',
        'start new resume',

        // Template-related (clearly builder, not analyzer)
        'build resume with template',
        'create resume using template',

        // Explicit workflow phrases
        'I want to build a resume',
        'I want to create a new resume',
        'help me build resume',
        'help me create resume',
        'I need to build resume',
        'I need to create resume'
      ],

      'resume.builder.templates': [
        'resume templates',
        'show resume templates',
        'view resume templates',
        'see resume templates',
        'what templates',
        'available templates',
        'template options',
        'choose template',
        'select template',
        'resume designs',
        'resume formats',
        'template gallery'
      ],

      'resume.builder.autofill': [
        'autofill resume',
        'auto fill resume',
        'fill resume automatically',
        'populate resume from profile',
        'import profile to resume',
        'use my profile data',
        'load profile data',
        'prefill resume'
      ],

      'resume.builder.ai_summary': [
        'generate summary',
        'generate professional summary',
        'ai summary',
        'ai professional summary',
        'write summary with ai',
        'create summary with ai',
        'ai write summary',
        'ai help with summary'
      ],

      'resume.difference': [
        'difference between builder and analyzer',
        'difference between analyzer and builder',
        'builder vs analyzer',
        'analyzer vs builder',
        'what is builder',
        'what is analyzer',
        'should I use builder or analyzer',
        'builder or analyzer'
      ],

      'resume.analyze': [
        // Make these VERY specific to analysis
        'analyze existing resume',
        'analyze my current resume',
        'check existing resume',
        'check my current resume',
        'scan existing resume',
        'review existing resume',
        'improve existing resume',
        'optimize existing resume',

        // ATS-specific (clearly analyzer)
        'ats score',
        'ats check',
        'ats analysis',
        'ats optimization',
        'resume ats',

        // Upload-related (clearly analyzer, not builder)
        'upload resume',
        'upload my resume',
        'analyze uploaded resume',

        // Feedback-related
        'resume feedback',
        'resume suggestions',
        'resume improvements',
        'resume tips'
      ]
    };
  }

  /**
   * Update intent with improved training phrases
   */
  async updateIntent(intentName, trainingPhrases) {
    try {
      // Get existing intent
      const [intents] = await this.intentsClient.listIntents({
        parent: this.agentPath,
        languageCode: 'en'
      });

      const intent = intents.find(i => i.displayName === intentName);
      if (!intent) {
        console.log(`   ❌ Intent not found: ${intentName}`);
        return false;
      }

      // Combine existing and new training phrases (remove duplicates)
      const existingPhrases = intent.trainingPhrases?.map(tp => tp.parts[0].text) || [];
      const allPhrases = [...new Set([...existingPhrases, ...trainingPhrases])];

      const formattedPhrases = allPhrases.map(phrase => ({
        parts: [{ text: phrase }],
        repeatCount: 1
      }));

      // Update intent
      const updateRequest = {
        intent: {
          name: intent.name,
          displayName: intent.displayName,
          trainingPhrases: formattedPhrases,
          priority: 500000
        },
        updateMask: {
          paths: ['training_phrases']
        },
        languageCode: 'en'
      };

      await this.intentsClient.updateIntent(updateRequest);
      console.log(`   ✅ ${intentName}: ${formattedPhrases.length} total phrases (added ${trainingPhrases.length} new)`);
      return true;

    } catch (error) {
      console.error(`   ❌ Error updating ${intentName}:`, error.message);
      return false;
    }
  }

  /**
   * Main improvement function
   */
  async improve() {
    console.log('\n🚀 Improving Resume Builder Intent Training\n');
    console.log('=' .repeat(80));
    console.log(`📍 Project: ${this.projectId}`);
    console.log(`📍 Location: ${this.location}`);
    console.log(`📍 Agent ID: ${this.agentId}\n`);

    try {
      console.log('=' .repeat(80));
      console.log('\n📝 Adding Improved Training Phrases...\n');

      const improvedPhrases = this.getImprovedTrainingPhrases();
      let updated = 0;

      for (const [intentName, phrases] of Object.entries(improvedPhrases)) {
        const success = await this.updateIntent(intentName, phrases);
        if (success) updated++;
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      console.log(`\n   📊 Updated ${updated}/${Object.keys(improvedPhrases).length} intents`);

      console.log('\n' + '='.repeat(80));
      console.log('\n✅ Training Improvement Complete!\n');
      console.log('📝 What Changed:');
      console.log('   ✓ Added explicit "builder" keyword phrases');
      console.log('   ✓ Added "from scratch" context phrases');
      console.log('   ✓ Made analyzer phrases more specific (existing/current/upload)');
      console.log('   ✓ Added clear template-related phrases');
      console.log('   ✓ Added disamb iguating phrases\n');

      console.log('⏳ Next Steps:');
      console.log('   1. Wait 1-2 minutes for retraining');
      console.log('   2. Run test: node scripts/test-dialogflow-training.js');
      console.log('   3. Test queries:');
      console.log('      - "resume builder"');
      console.log('      - "build new resume"');
      console.log('      - "create resume from scratch"');
      console.log('      - "show resume templates"\n');

    } catch (error) {
      console.error('\n❌ Improvement failed:', error.message);
      process.exit(1);
    }
  }
}

// Run the improver
if (require.main === module) {
  const improver = new ResumeBuilderTrainingImprover();
  improver.improve().catch(console.error);
}

module.exports = ResumeBuilderTrainingImprover;

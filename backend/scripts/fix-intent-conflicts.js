/**
 * Fix Intent Conflicts - Remove Overlapping Training Phrases
 *
 * This script removes generic phrases from resume.analyze that conflict
 * with resume.builder intents, keeping only ANALYSIS-SPECIFIC phrases
 *
 * Run: node scripts/fix-intent-conflicts.js
 */

const { IntentsClient } = require('@google-cloud/dialogflow-cx');
require('dotenv').config();

class IntentConflictFixer {
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
   * Get ONLY analysis-specific training phrases (no generic resume phrases)
   */
  getAnalysisOnlyPhrases() {
    return [
      // VERY SPECIFIC - Analysis/Upload/Score related
      'analyze my resume',
      'analyze resume',
      'check my resume',
      'review my resume',
      'scan my resume',
      'analyze my cv',
      'check my cv',
      'review my cv',

      // ATS-specific (ONLY for analyzer)
      'ats score',
      'check ats score',
      'check my ats score',
      'what is my ats score',
      'ats analysis',
      'ats check',
      'ats compatibility',
      'resume ats score',

      // Upload-specific (ONLY for analyzer)
      'upload resume',
      'upload my resume',
      'upload resume for analysis',
      'scan uploaded resume',

      // Feedback/Improvement-specific
      'resume feedback',
      'get resume feedback',
      'resume suggestions',
      'resume tips',
      'improve my resume',
      'optimize my resume',
      'resume improvements',

      // Analysis-specific
      'resume analysis',
      'cv analysis',
      'resume review',
      'resume checker',
      'resume scanner',
      'check resume quality',
      'evaluate my resume',
      'grade my resume'
    ];
  }

  /**
   * Get comprehensive builder phrases
   */
  getBuilderPhrases() {
    return [
      // PRIMARY KEYWORDS - "builder"
      'resume builder',
      'cv builder',
      'open resume builder',
      'go to resume builder',
      'use resume builder',
      'access resume builder',
      'launch resume builder',
      'start resume builder',
      'show resume builder',
      'take me to resume builder',

      // BUILD/CREATE with NEW/FRESH context
      'build resume',
      'build new resume',
      'build fresh resume',
      'build a resume',
      'build my resume',
      'build professional resume',
      'create resume',
      'create new resume',
      'create fresh resume',
      'create a resume',
      'create my resume',
      'create professional resume',
      'make resume',
      'make new resume',
      'make a resume',
      'make my resume',

      // FROM SCRATCH context
      'build resume from scratch',
      'create resume from scratch',
      'make resume from scratch',
      'start new resume',
      'start fresh resume',

      // WANT/NEED context
      'I want to build resume',
      'I want to create resume',
      'I want to make resume',
      'I need to build resume',
      'I need to create resume',
      'I need to make resume',
      'help me build resume',
      'help me create resume',

      // DESIGN/WRITE context
      'design resume',
      'design my resume',
      'write resume',
      'write new resume',

      // TEMPLATE context (clearly builder)
      'build resume with template',
      'create resume with template',
      'use resume template'
    ];
  }

  /**
   * Update an intent with specific phrases only
   */
  async updateIntent(intentName, trainingPhrases) {
    try {
      const [intents] = await this.intentsClient.listIntents({
        parent: this.agentPath,
        languageCode: 'en'
      });

      const intent = intents.find(i => i.displayName === intentName);
      if (!intent) {
        console.log(`   ❌ Intent not found: ${intentName}`);
        return false;
      }

      const formattedPhrases = trainingPhrases.map(phrase => ({
        parts: [{ text: phrase }],
        repeatCount: 1
      }));

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
      console.log(`   ✅ ${intentName}: ${formattedPhrases.length} phrases (removed conflicts)`);
      return true;

    } catch (error) {
      console.error(`   ❌ Error updating ${intentName}:`, error.message);
      return false;
    }
  }

  /**
   * Main fix function
   */
  async fix() {
    console.log('\n🔧 Fixing Intent Conflicts\n');
    console.log('=' .repeat(80));
    console.log(`📍 Project: ${this.projectId}`);
    console.log(`📍 Location: ${this.location}`);
    console.log(`📍 Agent ID: ${this.agentId}\n`);

    try {
      console.log('=' .repeat(80));
      console.log('\n📝 Strategy:\n');
      console.log('   1. Clean resume.analyze - ONLY analysis/upload/ATS phrases');
      console.log('   2. Enhance resume.builder.create - ALL build/create/make phrases');
      console.log('   3. This removes overlap and creates clear distinction\n');

      console.log('=' .repeat(80));
      console.log('\n🔧 Updating Intents...\n');

      // Update resume.analyze with ONLY analysis-specific phrases
      const analysisPhrases = this.getAnalysisOnlyPhrases();
      await this.updateIntent('resume.analyze', analysisPhrases);
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update resume.builder.create with comprehensive builder phrases
      const builderPhrases = this.getBuilderPhrases();
      await this.updateIntent('resume.builder.create', builderPhrases);

      console.log('\n' + '='.repeat(80));
      console.log('\n✅ Conflict Fix Complete!\n');
      console.log('📝 What Changed:\n');
      console.log(`   resume.analyze: ${analysisPhrases.length} SPECIFIC phrases (analysis/ATS/upload only)`);
      console.log(`   resume.builder.create: ${builderPhrases.length} phrases (all build/create variations)\n`);

      console.log('🎯 Clear Separation:\n');
      console.log('   ✓ "resume builder" → resume.builder.create');
      console.log('   ✓ "build resume" → resume.builder.create');
      console.log('   ✓ "create resume" → resume.builder.create');
      console.log('   ✓ "analyze resume" → resume.analyze');
      console.log('   ✓ "ats score" → resume.analyze');
      console.log('   ✓ "upload resume" → resume.analyze\n');

      console.log('⏳ Next Steps:');
      console.log('   1. Wait 1-2 minutes for retraining');
      console.log('   2. Test: "resume builder" should now work!');
      console.log('   3. Test: "analyze resume" should still work');
      console.log('   4. Run: node scripts/test-dialogflow-training.js\n');

    } catch (error) {
      console.error('\n❌ Fix failed:', error.message);
      process.exit(1);
    }
  }
}

// Run the fixer
if (require.main === module) {
  const fixer = new IntentConflictFixer();
  fixer.fix().catch(console.error);
}

module.exports = IntentConflictFixer;

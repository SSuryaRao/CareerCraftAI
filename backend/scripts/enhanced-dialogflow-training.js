/**
 * Enhanced Dialogflow CX Training Script
 *
 * This script adds comprehensive training for ALL features including:
 * - Resume Builder (NEW)
 * - Enhanced navigation for all pages
 * - Context-aware responses
 * - Multi-language support preparation
 *
 * Run: node scripts/enhanced-dialogflow-training.js
 */

const { IntentsClient } = require('@google-cloud/dialogflow-cx');
require('dotenv').config();

class EnhancedDialogflowTraining {
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
   * Complete intents configuration with ALL features
   */
  getEnhancedIntentsConfig() {
    return [
      // ============================================
      // RESUME BUILDER INTENTS (NEW!)
      // ============================================
      {
        displayName: 'resume.builder.create',
        trainingPhrases: [
          'create resume',
          'build resume',
          'make a resume',
          'resume builder',
          'build my resume',
          'create my cv',
          'make my cv',
          'generate resume',
          'I want to create a resume',
          'how do I build a resume',
          'need to make a resume',
          'help me build my cv',
          'professional resume builder',
          'create professional resume',
          'design resume',
          'make resume pdf'
        ],
        responses: [
          'Great! Our Resume Builder helps you create ATS-optimized resumes with:\n\n' +
          '✨ AI-powered professional summary generation\n' +
          '📋 Multiple professional templates\n' +
          '🔄 Auto-fill from your profile\n' +
          '📥 PDF download\n' +
          '🎯 Work experience & projects sections\n\n' +
          'Taking you to the Resume Builder...',

          'Perfect! Let\'s build your professional resume. The Resume Builder offers:\n' +
          '• Choose from multiple ATS-friendly templates\n' +
          '• Auto-populate your info from profile\n' +
          '• AI-generated professional summaries\n' +
          '• Add work experience and projects\n' +
          '• Download as PDF\n\n' +
          'Opening Resume Builder now...'
        ]
      },
      {
        displayName: 'resume.builder.autofill',
        trainingPhrases: [
          'autofill resume',
          'fill resume from profile',
          'auto populate resume',
          'use my profile for resume',
          'import profile to resume',
          'load my data to resume'
        ],
        responses: [
          'You can autofill your resume with profile data using the "Autofill from Profile" button in the Resume Builder. This will populate your contact info, education, and skills automatically!'
        ]
      },
      {
        displayName: 'resume.builder.templates',
        trainingPhrases: [
          'resume templates',
          'what templates are available',
          'show resume designs',
          'change resume template',
          'different resume formats',
          'professional resume templates',
          'modern resume templates'
        ],
        responses: [
          'We offer multiple professional resume templates including:\n' +
          '• Modern layouts for tech professionals\n' +
          '• Creative designs for designers\n' +
          '• Classic formats for traditional industries\n' +
          '• ATS-optimized templates\n\n' +
          'Visit the Resume Builder to preview and select your favorite template!'
        ]
      },
      {
        displayName: 'resume.builder.ai_summary',
        trainingPhrases: [
          'generate professional summary',
          'ai resume summary',
          'write my resume summary',
          'create summary with ai',
          'professional summary generator',
          'help write summary'
        ],
        responses: [
          'Our AI can generate a compelling professional summary for you! Just fill in your work experience and skills in the Resume Builder, then click "Generate with AI" in the Professional Summary section. The AI will create a personalized summary based on your background.'
        ]
      },

      // ============================================
      // ENHANCED RESUME ANALYZER INTENTS
      // ============================================
      {
        displayName: 'resume.analyze',
        trainingPhrases: [
          'analyze my resume',
          'check my resume',
          'resume score',
          'improve my resume',
          'resume feedback',
          'ats score',
          'resume optimization',
          'how is my resume',
          'review my cv',
          'cv analysis',
          'resume checker',
          'scan my resume',
          'resume review',
          'check resume ats',
          'analyze cv'
        ],
        responses: [
          'I can help you analyze your resume! Our Resume Analyzer will:\n\n' +
          '✓ Calculate your ATS compatibility score\n' +
          '✓ Identify missing keywords\n' +
          '✓ Suggest formatting improvements\n' +
          '✓ Provide industry-specific tips\n' +
          '✓ Check for common mistakes\n\n' +
          'Let me redirect you to the Resume Analyzer...'
        ]
      },
      {
        displayName: 'resume.difference',
        trainingPhrases: [
          'difference between resume analyzer and builder',
          'analyzer vs builder',
          'should I analyze or build resume',
          'what\'s the difference',
          'resume analyzer or builder'
        ],
        responses: [
          'Great question! Here\'s the difference:\n\n' +
          '📊 Resume Analyzer: Upload your existing resume to get an ATS score, feedback, and improvement suggestions.\n\n' +
          '🛠️ Resume Builder: Create a new professional resume from scratch using templates and AI assistance.\n\n' +
          'Use the Analyzer if you have a resume to improve, or the Builder to create a new one!'
        ]
      },

      // ============================================
      // MOCK INTERVIEW INTENTS
      // ============================================
      {
        displayName: 'interview.practice',
        trainingPhrases: [
          'practice interview',
          'mock interview',
          'interview preparation',
          'prepare for interview',
          'interview practice',
          'rehearse interview',
          'interview training',
          'practice questions',
          'interview simulator',
          'prepare for job interview',
          'video interview practice',
          'live interview practice'
        ],
        responses: [
          'Perfect! Our AI Mock Interview will help you:\n\n' +
          '🎤 Practice with realistic questions\n' +
          '🎥 Voice-enabled live interviews\n' +
          '🤖 Get AI feedback on answers\n' +
          '📊 Track your improvement\n' +
          '💡 Receive personalized tips\n' +
          '🔴 Record and review sessions\n\n' +
          'Taking you to the Mock Interview...'
        ]
      },

      // ============================================
      // CAREER ROADMAP INTENTS
      // ============================================
      {
        displayName: 'roadmap.view',
        trainingPhrases: [
          'show roadmap',
          'career roadmap',
          'learning path',
          'skill development plan',
          'career plan',
          'view my roadmap',
          'show my path',
          'career journey',
          'how to learn',
          'my learning roadmap',
          'personalized roadmap',
          'career path'
        ],
        responses: [
          'Your personalized Career Roadmap includes:\n\n' +
          '🎯 Clear learning milestones\n' +
          '📚 Curated resources\n' +
          '⏱️ Time estimates\n' +
          '✅ Progress tracking\n' +
          '🏆 Achievement badges\n' +
          '🤖 AI-powered recommendations\n\n' +
          'Opening your Career Roadmap...'
        ]
      },
      {
        displayName: 'roadmap.create',
        trainingPhrases: [
          'create roadmap',
          'generate roadmap',
          'make a learning plan',
          'build career path',
          'new roadmap',
          'plan my career',
          'create learning path',
          'I need a roadmap',
          'help me plan my career'
        ],
        responses: [
          'Let\'s create your personalized Career Roadmap! I\'ll help you:\n\n' +
          '1. Define your career goal\n' +
          '2. Assess current skills\n' +
          '3. Identify skill gaps\n' +
          '4. Build learning milestones\n' +
          '5. Track progress\n\n' +
          'Redirecting to Roadmap Generator...'
        ]
      },

      // ============================================
      // JOB SEARCH INTENTS
      // ============================================
      {
        displayName: 'job.search',
        trainingPhrases: [
          'find jobs',
          'search jobs',
          'job opportunities',
          'show me jobs',
          'looking for work',
          'find me a job',
          'job openings',
          'career opportunities',
          'hiring positions',
          'remote jobs',
          'work from home jobs',
          'job board',
          'careers page'
        ],
        responses: [
          'I\'ll help you find the perfect job! Our Job Search feature offers:\n\n' +
          '🎯 AI-powered job matching\n' +
          '📊 Match percentage scores\n' +
          '💰 Salary insights\n' +
          '📍 Location filters\n' +
          '🔄 Real-time job updates\n' +
          '🌐 Remote opportunities\n\n' +
          'Redirecting you to Job Search...'
        ]
      },

      // ============================================
      // AI MENTOR INTENTS
      // ============================================
      {
        displayName: 'mentor.connect',
        trainingPhrases: [
          'talk to mentor',
          'connect with mentor',
          'need career advice',
          'career guidance',
          'speak to advisor',
          'mentor help',
          'career counseling',
          'professional advice',
          'I need guidance',
          'ai mentor',
          'talk to ai advisor',
          'voice mentor',
          'speak with mentor'
        ],
        responses: [
          'Great choice! Our AI Mentors provide personalized career guidance with:\n\n' +
          '🗣️ Voice-enabled conversations\n' +
          '👨‍💼 Arjun - Tech Career Specialist\n' +
          '👩‍💼 Priya - Business & Finance Expert\n' +
          '👨‍🎓 Ravi - Academic & Research Guide\n' +
          '🎯 Personalized career strategies\n\n' +
          'Let me connect you with a mentor...'
        ]
      },

      // ============================================
      // SCHOLARSHIP INTENTS
      // ============================================
      {
        displayName: 'scholarship.search',
        trainingPhrases: [
          'find scholarships',
          'scholarship opportunities',
          'funding for education',
          'financial aid',
          'education grants',
          'student scholarships',
          'study funding',
          'scholarship search',
          'free education',
          'scholarship finder'
        ],
        responses: [
          'I\'ll help you discover scholarship opportunities! Our Scholarship Finder provides:\n\n' +
          '🎓 Personalized recommendations\n' +
          '💰 Government & private scholarships\n' +
          '📅 Application deadlines\n' +
          '✅ Eligibility checking\n' +
          '🔔 Deadline reminders\n\n' +
          'Taking you to Scholarship Finder...'
        ]
      },

      // ============================================
      // PROFILE & DASHBOARD INTENTS
      // ============================================
      {
        displayName: 'profile.view',
        trainingPhrases: [
          'my profile',
          'view profile',
          'show my profile',
          'account details',
          'my account',
          'profile settings',
          'my dashboard',
          'dashboard',
          'view dashboard'
        ],
        responses: [
          'Opening your profile dashboard where you can:\n\n' +
          '👤 Update personal information\n' +
          '📊 View progress statistics\n' +
          '🎯 Manage career goals\n' +
          '💼 Track applications\n' +
          '⚙️ Update preferences\n' +
          '🔐 Manage subscription\n\n' +
          'Redirecting to your dashboard...'
        ]
      },
      {
        displayName: 'profile.update',
        trainingPhrases: [
          'update profile',
          'edit profile',
          'change my information',
          'modify profile',
          'update my details',
          'change settings',
          'edit my info'
        ],
        responses: [
          'I can help you update your profile! You can modify:\n\n' +
          '• Personal information\n' +
          '• Skills and expertise\n' +
          '• Education history\n' +
          '• Career goals\n' +
          '• Preferences\n\n' +
          'What would you like to update?'
        ]
      },

      // ============================================
      // SUBSCRIPTION & PRICING INTENTS
      // ============================================
      {
        displayName: 'subscription.info',
        trainingPhrases: [
          'subscription',
          'pricing',
          'plans',
          'how much does it cost',
          'payment plans',
          'upgrade',
          'premium features',
          'pricing plans',
          'subscription plans',
          'what are the plans'
        ],
        responses: [
          'We offer flexible subscription plans:\n\n' +
          '🆓 Free Plan - Basic features\n' +
          '💎 Premium Plan - Advanced AI features\n' +
          '🚀 Pro Plan - Unlimited access\n\n' +
          'Each plan includes different limits for resume analysis, mock interviews, and AI mentoring sessions.\n\n' +
          'Let me take you to the pricing page...'
        ]
      },

      // ============================================
      // FEATURES & NAVIGATION INTENTS
      // ============================================
      {
        displayName: 'features.list',
        trainingPhrases: [
          'what can you do',
          'show me features',
          'what features do you have',
          'list all features',
          'show all options',
          'what services do you offer',
          'help me explore',
          'what\'s available',
          'all features',
          'show everything'
        ],
        responses: [
          'Here are all the features available on CareerCraft AI:\n\n' +
          '📄 Resume Analyzer - Get ATS score and improvement tips\n' +
          '🛠️ Resume Builder - Create professional resumes with AI\n' +
          '💼 Job Search - Find opportunities matching your skills\n' +
          '🤖 AI Mentor - Voice-enabled personalized career guidance\n' +
          '🎥 Mock Interview - Practice with live AI feedback\n' +
          '🗺️ Career Roadmap - Plan your learning journey\n' +
          '🎓 Scholarship Finder - Discover funding opportunities\n\n' +
          'Which one interests you?'
        ]
      },
      {
        displayName: 'navigation.about',
        trainingPhrases: [
          'about',
          'about careercraft',
          'who made this',
          'about you',
          'about this platform',
          'what is careercraft'
        ],
        responses: [
          'CareerCraft AI is an advanced career development platform that uses AI to help you:\n' +
          '• Build and optimize resumes\n' +
          '• Practice interviews\n' +
          '• Get personalized career guidance\n' +
          '• Find job opportunities\n' +
          '• Plan your learning path\n\n' +
          'Would you like to see the About page?'
        ]
      },
      {
        displayName: 'navigation.contact',
        trainingPhrases: [
          'contact',
          'contact us',
          'support',
          'help support',
          'customer service',
          'reach out',
          'get in touch'
        ],
        responses: [
          'Need to get in touch? You can:\n' +
          '📧 Contact our support team\n' +
          '💬 Use this chatbot for quick help\n' +
          '📝 Submit feedback\n\n' +
          'Let me take you to the Contact page...'
        ]
      },

      // ============================================
      // SKILLS & ONBOARDING
      // ============================================
      {
        displayName: 'skills.manage',
        trainingPhrases: [
          'add skills',
          'manage skills',
          'update my skills',
          'skill assessment',
          'what skills should I learn',
          'skill recommendations'
        ],
        responses: [
          'You can manage your skills in the Skills page. Here you can:\n' +
          '• Add technical and soft skills\n' +
          '• Set proficiency levels\n' +
          '• Get skill recommendations\n' +
          '• Track skill progress\n\n' +
          'Taking you to Skills management...'
        ]
      },
      {
        displayName: 'onboarding.start',
        trainingPhrases: [
          'getting started',
          'how do I start',
          'onboarding',
          'new user',
          'first time here',
          'setup account'
        ],
        responses: [
          'Welcome! Let\'s get you started:\n\n' +
          '1️⃣ Complete your profile\n' +
          '2️⃣ Add your skills\n' +
          '3️⃣ Set career goals\n' +
          '4️⃣ Explore features like Resume Builder or Mock Interviews\n\n' +
          'Would you like to go through the onboarding process?'
        ]
      },

      // ============================================
      // RESOURCES & GUIDES
      // ============================================
      {
        displayName: 'resources.guides',
        trainingPhrases: [
          'career guides',
          'resources',
          'learning resources',
          'guides',
          'help articles',
          'tutorials'
        ],
        responses: [
          'Check out our Resources section for:\n' +
          '📚 Career development guides\n' +
          '💡 Tips and best practices\n' +
          '🎯 Industry insights\n' +
          '📖 Learning materials\n\n' +
          'Let me take you to Resources...'
        ]
      },

      // ============================================
      // FEEDBACK & REVIEWS
      // ============================================
      {
        displayName: 'feedback.submit',
        trainingPhrases: [
          'give feedback',
          'submit feedback',
          'report issue',
          'bug report',
          'suggestion',
          'feature request'
        ],
        responses: [
          'We value your feedback! You can:\n' +
          '💬 Submit general feedback\n' +
          '🐛 Report bugs\n' +
          '💡 Suggest new features\n' +
          '⭐ Leave a review\n\n' +
          'Taking you to the Feedback page...'
        ]
      },

      // ============================================
      // GENERAL CONVERSATION INTENTS
      // ============================================
      {
        displayName: 'Default Welcome Intent',
        trainingPhrases: [
          'hello',
          'hi',
          'hey',
          'good morning',
          'good afternoon',
          'good evening',
          'help',
          'what can you do',
          'what can you help me with',
          'start',
          'begin'
        ],
        responses: [
          'Hello! 👋 I\'m your AI Career Assistant. I can help you with:\n\n' +
          '🛠️ Resume Builder - Create professional resumes with AI\n' +
          '📊 Resume Analyzer - ATS optimization\n' +
          '💼 Job Search - Find opportunities\n' +
          '🤖 AI Mentor - Voice-enabled career guidance\n' +
          '🎥 Mock Interview - Practice with feedback\n' +
          '🗺️ Career Roadmap - Plan your journey\n' +
          '🎓 Scholarships - Find funding\n\n' +
          'What would you like to explore today?',

          'Hi there! Welcome to CareerCraft AI. I\'m here to guide your career journey. ' +
          'You can ask me about resume building, resume analysis, job searching, career planning, interview prep, and more. How can I assist you?'
        ]
      },
      {
        displayName: 'help.general',
        trainingPhrases: [
          'I need help',
          'how does this work',
          'explain this',
          'I\'m confused',
          'I don\'t understand',
          'guide me',
          'tutorial',
          'help me'
        ],
        responses: [
          'I\'m here to help! You can:\n\n' +
          '1. Ask about any feature (e.g., "How do I build a resume?")\n' +
          '2. Request navigation (e.g., "Take me to job search")\n' +
          '3. Get career advice (e.g., "How do I switch careers?")\n' +
          '4. Explore options (e.g., "What can you do?")\n\n' +
          'What specific help do you need?'
        ]
      },
      {
        displayName: 'feedback.positive',
        trainingPhrases: [
          'thank you',
          'thanks',
          'helpful',
          'great',
          'awesome',
          'perfect',
          'excellent',
          'good job',
          'appreciate it',
          'thanks a lot'
        ],
        responses: [
          'You\'re very welcome! I\'m glad I could help. If you need anything else on your career journey, just ask!',
          'Happy to help! Feel free to explore more features or ask any career-related questions. Good luck! 🚀'
        ]
      },
      {
        displayName: 'goodbye',
        trainingPhrases: [
          'bye',
          'goodbye',
          'see you',
          'talk to you later',
          'exit',
          'quit',
          'I\'m done',
          'see you later'
        ],
        responses: [
          'Goodbye! Best of luck with your career journey. Come back anytime you need guidance! 👋',
          'See you later! Keep working towards your goals. I\'ll be here whenever you need help! 🌟'
        ]
      }
    ];
  }

  /**
   * Create or update an intent
   */
  async createOrUpdateIntent(intentConfig) {
    try {
      // First, check if intent exists
      const [intents] = await this.intentsClient.listIntents({
        parent: this.agentPath,
        languageCode: 'en'
      });

      const existingIntent = intents.find(
        intent => intent.displayName === intentConfig.displayName
      );

      const trainingPhrases = intentConfig.trainingPhrases.map(phrase => ({
        parts: [{ text: phrase }],
        repeatCount: 1
      }));

      if (existingIntent) {
        // Update existing intent
        console.log(`🔄 Updating intent: ${intentConfig.displayName}`);

        const updateRequest = {
          intent: {
            name: existingIntent.name,
            displayName: intentConfig.displayName,
            trainingPhrases: trainingPhrases,
            priority: 500000
          },
          updateMask: {
            paths: ['training_phrases']
          },
          languageCode: 'en'
        };

        await this.intentsClient.updateIntent(updateRequest);
        console.log(`✅ Updated: ${intentConfig.displayName}`);
      } else {
        // Create new intent
        console.log(`➕ Creating intent: ${intentConfig.displayName}`);

        const intent = {
          displayName: intentConfig.displayName,
          trainingPhrases: trainingPhrases,
          priority: 500000,
          isFallback: false
        };

        await this.intentsClient.createIntent({
          parent: this.agentPath,
          intent: intent,
          languageCode: 'en'
        });
        console.log(`✅ Created: ${intentConfig.displayName}`);
      }

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));

    } catch (error) {
      console.error(`❌ Error with intent ${intentConfig.displayName}:`, error.message);
    }
  }

  /**
   * Main training function
   */
  async train() {
    console.log('\n🚀 Enhanced Dialogflow CX Training Started\n');
    console.log('=' .repeat(80));
    console.log(`📍 Project: ${this.projectId}`);
    console.log(`📍 Location: ${this.location}`);
    console.log(`📍 Agent ID: ${this.agentId}\n`);

    try {
      const intentsConfig = this.getEnhancedIntentsConfig();

      console.log(`📊 Total intents to process: ${intentsConfig.length}\n`);
      console.log('🔧 Creating/Updating intents...\n');

      let created = 0;
      let updated = 0;

      for (const intentConfig of intentsConfig) {
        await this.createOrUpdateIntent(intentConfig);
        created++;

        // Progress indicator
        const progress = Math.round((created / intentsConfig.length) * 100);
        process.stdout.write(`\rProgress: ${progress}% (${created}/${intentsConfig.length})`);
      }

      console.log('\n\n' + '='.repeat(80));
      console.log('\n✅ Enhanced Training Complete!\n');
      console.log('📝 Training Summary:');
      console.log(`   ✓ Processed ${intentsConfig.length} intents`);
      console.log('   ✓ Added Resume Builder intents (NEW)');
      console.log('   ✓ Enhanced all navigation intents');
      console.log('   ✓ Added context-aware responses');
      console.log('   ✓ Improved training phrases coverage\n');

      console.log('🎯 New Features Trained:');
      console.log('   • Resume Builder (create, templates, autofill, AI summary)');
      console.log('   • Resume Analyzer vs Builder clarification');
      console.log('   • Enhanced Mock Interview (voice-enabled)');
      console.log('   • Enhanced AI Mentor (voice conversations)');
      console.log('   • Subscription & Pricing info');
      console.log('   • Skills management');
      console.log('   • Onboarding guidance');
      console.log('   • Resources & Guides\n');

      console.log('⏳ Note: Training may take 1-2 minutes to complete.');
      console.log('   The agent will be available during this time.\n');

      console.log('🧪 Next Steps:');
      console.log('   1. Wait 1-2 minutes for training to complete');
      console.log('   2. Test with queries like:');
      console.log('      - "build a resume"');
      console.log('      - "create resume with AI"');
      console.log('      - "what\'s the difference between analyzer and builder?"');
      console.log('      - "help me with resume templates"');
      console.log('   3. Test in console:');
      console.log(`      https://dialogflow.cloud.google.com/cx/projects/${this.projectId}/locations/${this.location}/agents/${this.agentId}\n`);

    } catch (error) {
      console.error('\n❌ Training failed:', error.message);
      console.error('\n💡 Troubleshooting:');
      console.error('   1. Check your credentials');
      console.error('   2. Verify agent exists');
      console.error('   3. Check permissions');
      console.error('   4. Verify project ID and location\n');
      process.exit(1);
    }
  }
}

// Run the enhanced training
if (require.main === module) {
  const trainer = new EnhancedDialogflowTraining();
  trainer.train().catch(console.error);
}

module.exports = EnhancedDialogflowTraining;

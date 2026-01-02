/**
 * Gemini Live Service
 * Uses Google AI (Generative Language API) for browser-compatible WebSocket
 */

class GeminiLiveService {
  constructor() {
    // For POC: Use Google AI API key (browser-compatible)
    // For production: Use Vertex AI with backend proxy
    this.apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;
    // Use gemini-2.0-flash-exp for Live API (supports BidiGenerateContent)
    this.model = 'gemini-2.0-flash-exp';
    this.isConfigured = false;

    this.initialize();
  }

  initialize() {
    try {
      if (!this.apiKey) {
        console.warn('⚠️ Gemini Live Service not configured. Missing GEMINI_API_KEY');
        console.warn('📝 Get an API key from https://aistudio.google.com/apikey');
        this.isConfigured = false;
        return;
      }

      console.log('✅ Gemini Live Service initialized');
      console.log(`📍 Model: ${this.model}`);
      this.isConfigured = true;

    } catch (error) {
      console.error('❌ Failed to initialize Gemini Live Service:', error.message);
      this.isConfigured = false;
    }
  }

  /**
   * Get WebSocket URL for Gemini Live API (Google AI endpoint)
   */
  getWebSocketUrl() {
    // Google AI endpoint - supports API key authentication
    // IMPORTANT: Use v1alpha for Live API (BidiGenerateContent)
    return `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent`;
  }

  /**
   * Get API key for authentication
   */
  getApiKey() {
    return this.apiKey;
  }

  /**
   * Get configuration for live interview session
   */
  getSessionConfig(options = {}) {
    const {
      voiceName = 'Puck',
      domain = 'general',
      level = 'junior',
      interviewerStyle = 'friendly' // friendly, formal, challenging
    } = options;

    // Style-specific instructions
    const styleInstructions = {
      friendly: 'Be warm, encouraging, and supportive. Use casual language and make the candidate feel comfortable.',
      formal: 'Be professional and structured. Use formal language while remaining approachable.',
      challenging: 'Be thorough and push for deeper answers. Ask follow-up questions that challenge assumptions.'
    };

    // Domain-specific sample questions
    const domainQuestions = {
      'software-engineering': [
        'Tell me about a challenging bug you debugged recently',
        'How do you approach code reviews?',
        'Describe your experience with system design',
        'How do you handle technical debt?'
      ],
      'web-development': [
        'What\'s your approach to responsive design?',
        'How do you optimize website performance?',
        'Tell me about your experience with modern frameworks',
        'How do you handle cross-browser compatibility?'
      ],
      'data-science': [
        'Walk me through your data cleaning process',
        'How do you choose between different ML models?',
        'Tell me about a project where data told an unexpected story',
        'How do you communicate findings to non-technical stakeholders?'
      ],
      'general': [
        'Tell me about yourself and your background',
        'What interests you about this field?',
        'Describe a challenging project you worked on',
        'Where do you see yourself in 5 years?'
      ]
    };

    const questions = domainQuestions[domain] || domainQuestions['general'];

    // Enhanced system prompt for natural conversation
    const enhancedPrompt = `You are a friendly, professional interviewer conducting a mock interview. Your goal is to have a natural, flowing conversation that feels like a real interview.

## Your Personality & Style
${styleInstructions[interviewerStyle] || styleInstructions.friendly}

## Conversation Style - BE HUMAN
- Pause 1-2 seconds before responding to seem thoughtful (say "Hmm..." or "Let me think...")
- Occasionally use natural filler words like "well", "you know", "actually" - but sparingly
- Speak naturally with brief acknowledgments: "I see", "Right", "Interesting", "Got it", "Mm-hmm"
- Use smooth transitions: "That's great, let me ask you about..." or "Building on that..."
- Keep responses concise - aim for 10-20 seconds of speech per turn
- Vary your sentence structure and avoid robotic patterns
- Show genuine interest with reactions: "Oh, that's clever!" or "I hadn't thought of it that way"

## Handling Interruptions - BE FLEXIBLE
- If the candidate interrupts, acknowledge it naturally: "Oh, go ahead" or "Sure, what's on your mind?"
- If you get cut off, smoothly continue: "As I was saying..." or just continue naturally
- Don't be rigid about turn-taking - real conversations have natural overlaps
- If the candidate seems stuck, offer encouragement: "Take your time, no rush"

## Handling Silence - BE SUPPORTIVE
- If the candidate is silent for a moment, that's okay - give them time to think
- After 5-10 seconds of silence, offer gentle encouragement: "Take your time" or "No pressure"
- After 15-20 seconds, you might rephrase the question or offer a hint
- Never make them feel bad for pausing to think

## Interview Flow
- Start with a warm, brief introduction (5-10 seconds max)
- Ask ONE question at a time
- Listen actively and ask relevant follow-up questions based on their answers
- Provide brief, encouraging feedback: "That's a solid approach" or "Good thinking there"
- Don't repeat their answer back verbatim - just acknowledge and move forward
- Track the conversation flow and don't repeat questions you've already asked

## Sample Questions for ${domain}
Use these as inspiration, adapt based on the conversation:
${questions.map((q, i) => `${i + 1}. ${q}`).join('\n')}

## Feedback Style
- Be honest but constructive
- Focus on specific strengths: "I liked how you mentioned X"
- Offer gentle suggestions: "You might also consider..."
- Keep feedback brief during the interview, save detailed feedback for the end

## Interview Context
- Domain: ${domain}
- Experience Level: ${level}
- Difficulty: Adjust questions appropriately for ${level} level
- Duration: This is a focused 10-15 minute interview

## Pacing & Timing
- Around question 3-4 (roughly 8 minutes in): "We're making good progress!"
- Around question 5-6 (roughly 12 minutes in): "Let me ask you one more question before we wrap up"
- When wrapping up: Summarize 2-3 key strengths you noticed and one area for growth

## Starting the Interview
Begin with a natural, warm greeting like: "Hey there! Thanks for joining me today. I'm excited to chat with you about ${domain}. Before we dive in, how are you feeling? Ready to go?"

## Ending the Interview
When time is up or the interview naturally concludes:
1. Thank them warmly
2. Mention 2-3 specific things they did well
3. Offer one constructive suggestion
4. End on an encouraging note

Remember: Be human, be warm, be natural. This should feel like a conversation with a friendly colleague, not a robotic Q&A session. Occasionally make small talk or react genuinely to their answers.`;

    return {
      setup: {
        model: `models/${this.model}`,
        generationConfig: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: {
                voiceName: voiceName
              }
            }
          }
        },
        systemInstruction: {
          parts: [{ text: enhancedPrompt }]
        }
      }
    };
  }

  /**
   * Get connection details for frontend
   */
  async getConnectionDetails(options = {}) {
    if (!this.isConfigured) {
      throw new Error('Gemini Live Service is not configured. Set GEMINI_API_KEY in .env');
    }

    return {
      websocketUrl: this.getWebSocketUrl(),
      apiKey: this.getApiKey(),
      model: `models/${this.model}`,
      config: this.getSessionConfig(options),
      audioConfig: {
        inputSampleRate: 16000,
        outputSampleRate: 24000,
        inputFormat: 'pcm16',
        outputFormat: 'pcm16'
      }
    };
  }

  isReady() {
    return this.isConfigured;
  }

  getStatus() {
    return {
      configured: this.isConfigured,
      model: this.model,
      websocketUrl: this.getWebSocketUrl(),
      hasApiKey: !!this.apiKey
    };
  }
}

module.exports = new GeminiLiveService();

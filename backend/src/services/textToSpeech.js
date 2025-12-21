/**
 * Google Cloud Text-to-Speech Service
 *
 * Converts AI mentor text responses to natural-sounding speech
 * Supports multiple languages and Indian accents
 */

const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const util = require('util');

class TextToSpeechService {
  constructor() {
    this.client = null;
    this.isConfigured = false;
    this.initialize();
  }

  /**
   * Initialize Text-to-Speech client
   */
  initialize() {
    try {
      const credentials = process.env.GOOGLE_APPLICATION_CREDENTIALS;

      if (!credentials) {
        console.warn('⚠️ Text-to-Speech not configured: Missing GOOGLE_APPLICATION_CREDENTIALS');
        this.isConfigured = false;
        return;
      }

      this.client = new textToSpeech.TextToSpeechClient({
        keyFilename: credentials
      });

      console.log('✅ Text-to-Speech service initialized');
      this.isConfigured = true;

    } catch (error) {
      console.error('❌ Failed to initialize Text-to-Speech:', error.message);
      this.isConfigured = false;
    }
  }

  /**
   * Get voice configuration for language
   * FIXED: Only include Google Cloud supported languages + fallback logic
   */
  getVoiceConfig(language = 'en-IN', voiceGender = 'FEMALE') {
    const voiceConfigs = {
      'en-IN': {
        languageCode: 'en-IN',
        name: 'en-IN-Neural2-A', // Indian English Female (Neural2 - best quality)
        ssmlGender: 'FEMALE'
      },
      'en-IN-male': {
        languageCode: 'en-IN',
        name: 'en-IN-Neural2-B', // Indian English Male
        ssmlGender: 'MALE'
      },
      'hi-IN': {
        languageCode: 'hi-IN',
        name: 'hi-IN-Neural2-A', // Hindi Female (Neural2)
        ssmlGender: 'FEMALE'
      },
      'hi-IN-male': {
        languageCode: 'hi-IN',
        name: 'hi-IN-Neural2-B', // Hindi Male
        ssmlGender: 'MALE'
      },
      'ta-IN': {
        languageCode: 'ta-IN',
        name: 'ta-IN-Wavenet-A', // Tamil Female (WaveNet)
        ssmlGender: 'FEMALE'
      },
      'ta-IN-male': {
        languageCode: 'ta-IN',
        name: 'ta-IN-Wavenet-B', // Tamil Male
        ssmlGender: 'MALE'
      },
      'te-IN': {
        languageCode: 'te-IN',
        name: 'te-IN-Standard-A', // Telugu Female
        ssmlGender: 'FEMALE'
      },
      'bn-IN': {
        languageCode: 'bn-IN',
        name: 'bn-IN-Standard-A', // Bengali Female
        ssmlGender: 'FEMALE'
      },
      'mr-IN': {
        languageCode: 'mr-IN',
        name: 'mr-IN-Wavenet-A', // Marathi Female
        ssmlGender: 'FEMALE'
      },
      'gu-IN': {
        languageCode: 'gu-IN',
        name: 'gu-IN-Standard-A', // Gujarati Female
        ssmlGender: 'FEMALE'
      },
      'kn-IN': {
        languageCode: 'kn-IN',
        name: 'kn-IN-Wavenet-A', // Kannada Female
        ssmlGender: 'FEMALE'
      },
      'ml-IN': {
        languageCode: 'ml-IN',
        name: 'ml-IN-Wavenet-A', // Malayalam Female
        ssmlGender: 'FEMALE'
      }
      // NOTE: Odia (or-IN) is NOT supported by Google Cloud TTS
      // Removed to prevent 500 errors
    };

    // Try to get specific voice with gender
    const key = voiceGender === 'MALE' ? `${language}-male` : language;
    const voiceConfig = voiceConfigs[key] || voiceConfigs[language];

    // Fallback to English if language not supported
    if (!voiceConfig) {
      console.warn(`⚠️ Language ${language} not supported for TTS, falling back to English`);
      return voiceConfigs['en-IN'];
    }

    return voiceConfig;
  }

  /**
   * Convert text to speech
   *
   * @param {string} text - Text to convert
   * @param {string} language - Language code (en-IN, hi-IN, etc.)
   * @param {string} voiceGender - MALE or FEMALE
   * @param {number} speakingRate - Speed (0.25 to 4.0, default 1.0)
   * @param {number} pitch - Pitch (-20.0 to 20.0, default 0)
   * @returns {Promise<Buffer>} Audio buffer (MP3 format)
   */
  async textToSpeech(text, language = 'en-IN', voiceGender = 'FEMALE', speakingRate = 1.0, pitch = 0.0) {
    if (!this.isConfigured) {
      throw new Error('Text-to-Speech service not configured');
    }

    if (!text || text.trim().length === 0) {
      throw new Error('Text is required');
    }

    // Google TTS has a 5000 BYTE limit (not character limit)
    // For multi-byte languages like Hindi, this is critical
    const maxBytes = 4500; // Use 4500 to leave margin for safety
    let processedText = text;

    // Check byte length using Buffer
    const byteLength = Buffer.byteLength(text, 'utf8');

    if (byteLength > maxBytes) {
      console.warn(`⚠️ Text exceeds ${maxBytes} bytes (${byteLength} bytes). Truncating...`);

      // Smart truncation: try to break at sentence boundaries
      processedText = this.truncateToByteLimit(text, maxBytes);
    }

    const finalByteLength = Buffer.byteLength(processedText, 'utf8');

    console.log(`🔊 Converting text to speech:`);
    console.log(`   Language: ${language}`);
    console.log(`   Voice: ${voiceGender}`);
    console.log(`   Length: ${processedText.length} chars (${finalByteLength} bytes)`);

    try {
      const voiceConfig = this.getVoiceConfig(language, voiceGender);

      // Construct request
      const request = {
        input: { text: processedText },
        voice: {
          languageCode: voiceConfig.languageCode,
          name: voiceConfig.name,
          ssmlGender: voiceConfig.ssmlGender
        },
        audioConfig: {
          audioEncoding: 'MP3',
          speakingRate: Math.max(0.25, Math.min(4.0, speakingRate)),
          pitch: Math.max(-20.0, Math.min(20.0, pitch)),
          effectsProfileId: ['headphone-class-device'], // Optimize for headphones
        }
      };

      // Call Text-to-Speech API
      const [response] = await this.client.synthesizeSpeech(request);

      console.log(`✅ Speech generated: ${response.audioContent.length} bytes`);

      return response.audioContent;

    } catch (error) {
      console.error('❌ Text-to-Speech error:', error.message);
      throw new Error(`Failed to generate speech: ${error.message}`);
    }
  }

  /**
   * Truncate text to fit within byte limit, trying to break at sentence boundaries
   *
   * @param {string} text - Text to truncate
   * @param {number} maxBytes - Maximum byte length
   * @returns {string} Truncated text
   */
  truncateToByteLimit(text, maxBytes) {
    // First, check if we need to truncate
    if (Buffer.byteLength(text, 'utf8') <= maxBytes) {
      return text;
    }

    // Try to find sentence boundaries (., ।, ?, !, etc.)
    const sentenceEndings = /[.।?!\n]/g;
    let bestText = '';
    let lastValidText = '';

    // Split into sentences
    const sentences = text.split(sentenceEndings);

    for (let i = 0; i < sentences.length; i++) {
      const candidate = sentences.slice(0, i + 1).join('. ');
      const candidateBytes = Buffer.byteLength(candidate, 'utf8');

      if (candidateBytes <= maxBytes) {
        lastValidText = candidate;
      } else {
        break;
      }
    }

    // If we found valid sentences, use them
    if (lastValidText) {
      return lastValidText;
    }

    // Otherwise, truncate character by character (for very long single sentences)
    let truncated = text;
    while (Buffer.byteLength(truncated, 'utf8') > maxBytes) {
      truncated = truncated.substring(0, truncated.length - 10); // Remove 10 chars at a time
    }

    return truncated + '...';
  }

  /**
   * Convert text to speech and return base64
   * FIXED: Ensure clean base64 encoding without whitespace
   */
  async textToSpeechBase64(text, language = 'en-IN', voiceGender = 'FEMALE', speakingRate = 1.0, pitch = 0.0) {
    const audioBuffer = await this.textToSpeech(text, language, voiceGender, speakingRate, pitch);

    // Convert to base64 and ensure it's clean (no newlines, spaces, or special chars)
    const base64Audio = audioBuffer.toString('base64').replace(/[\r\n\s]/g, '');

    console.log(`✅ Base64 audio generated: ${base64Audio.length} characters (first 50: ${base64Audio.substring(0, 50)}...)`);

    return base64Audio;
  }

  /**
   * Get list of available voices
   */
  async listVoices(languageCode = null) {
    if (!this.isConfigured) {
      throw new Error('Text-to-Speech service not configured');
    }

    try {
      const [result] = await this.client.listVoices({});

      let voices = result.voices;

      // Filter by language if specified
      if (languageCode) {
        voices = voices.filter(voice =>
          voice.languageCodes.some(code => code.startsWith(languageCode))
        );
      }

      return voices.map(voice => ({
        name: voice.name,
        languageCodes: voice.languageCodes,
        gender: voice.ssmlGender,
        naturalSampleRateHertz: voice.naturalSampleRateHertz
      }));

    } catch (error) {
      console.error('❌ Error listing voices:', error.message);
      throw error;
    }
  }

  /**
   * Get available Indian language voices
   * FIXED: Only include Google Cloud supported languages
   */
  getIndianVoices() {
    return [
      { code: 'en-IN', name: 'English (India)', voices: ['Neural2-A (Female)', 'Neural2-B (Male)'], ttsSupported: true },
      { code: 'hi-IN', name: 'हिंदी (Hindi)', voices: ['Neural2-A (Female)', 'Neural2-B (Male)'], ttsSupported: true },
      { code: 'ta-IN', name: 'தமிழ் (Tamil)', voices: ['Wavenet-A (Female)', 'Wavenet-B (Male)'], ttsSupported: true },
      { code: 'te-IN', name: 'తెలుగు (Telugu)', voices: ['Standard-A (Female)', 'Standard-B (Male)'], ttsSupported: true },
      { code: 'bn-IN', name: 'বাংলা (Bengali)', voices: ['Standard-A (Female)', 'Standard-B (Male)'], ttsSupported: true },
      { code: 'mr-IN', name: 'मराठी (Marathi)', voices: ['Wavenet-A (Female)', 'Wavenet-B (Male)'], ttsSupported: true },
      { code: 'gu-IN', name: 'ગુજરાતી (Gujarati)', voices: ['Standard-A (Female)', 'Standard-B (Male)'], ttsSupported: true },
      { code: 'kn-IN', name: 'ಕನ್ನಡ (Kannada)', voices: ['Wavenet-A (Female)'], ttsSupported: true },
      { code: 'ml-IN', name: 'മലയാളം (Malayalam)', voices: ['Wavenet-A (Female)'], ttsSupported: true }
      // Odia (or-IN) removed - NOT supported by Google Cloud Text-to-Speech
    ];
  }

  /**
   * Check if service is ready
   */
  isReady() {
    return this.isConfigured;
  }

  /**
   * Get service status
   */
  getStatus() {
    return {
      configured: this.isConfigured,
      clientInitialized: this.client !== null,
      supportedLanguages: this.getIndianVoices().map(v => v.code)
    };
  }
}

// Export singleton instance
module.exports = new TextToSpeechService();

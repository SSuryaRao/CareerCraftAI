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
      },
      'or-IN': {
        languageCode: 'or-IN',
        name: 'or-IN-Standard-A', // Odia Female (Note: Check Google Cloud for availability)
        ssmlGender: 'FEMALE'
      }
    };

    // Try to get specific voice with gender
    const key = voiceGender === 'MALE' ? `${language}-male` : language;
    return voiceConfigs[key] || voiceConfigs['en-IN'];
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

    // Limit text length (TTS has limits)
    const maxLength = 5000;
    const truncatedText = text.length > maxLength
      ? text.substring(0, maxLength) + '...'
      : text;

    console.log(`🔊 Converting text to speech:`);
    console.log(`   Language: ${language}`);
    console.log(`   Voice: ${voiceGender}`);
    console.log(`   Length: ${truncatedText.length} chars`);

    try {
      const voiceConfig = this.getVoiceConfig(language, voiceGender);

      // Construct request
      const request = {
        input: { text: truncatedText },
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
   * Convert text to speech and return base64
   */
  async textToSpeechBase64(text, language = 'en-IN', voiceGender = 'FEMALE', speakingRate = 1.0, pitch = 0.0) {
    const audioBuffer = await this.textToSpeech(text, language, voiceGender, speakingRate, pitch);
    return audioBuffer.toString('base64');
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
   */
  getIndianVoices() {
    return [
      { code: 'en-IN', name: 'English (India)', voices: ['Neural2-A (Female)', 'Neural2-B (Male)'] },
      { code: 'hi-IN', name: 'हिंदी (Hindi)', voices: ['Neural2-A (Female)', 'Neural2-B (Male)'] },
      { code: 'ta-IN', name: 'தமிழ் (Tamil)', voices: ['Wavenet-A (Female)', 'Wavenet-B (Male)'] },
      { code: 'te-IN', name: 'తెలుగు (Telugu)', voices: ['Standard-A (Female)', 'Standard-B (Male)'] },
      { code: 'bn-IN', name: 'বাংলা (Bengali)', voices: ['Standard-A (Female)', 'Standard-B (Male)'] },
      { code: 'mr-IN', name: 'मराठी (Marathi)', voices: ['Wavenet-A (Female)', 'Wavenet-B (Male)'] },
      { code: 'gu-IN', name: 'ગુજરાતી (Gujarati)', voices: ['Standard-A (Female)', 'Standard-B (Male)'] },
      { code: 'kn-IN', name: 'ಕನ್ನಡ (Kannada)', voices: ['Wavenet-A (Female)'] },
      { code: 'ml-IN', name: 'മലയാളം (Malayalam)', voices: ['Wavenet-A (Female)'] },
      { code: 'or-IN', name: 'ଓଡ଼ିଆ (Odia)', voices: ['Standard-A (Female)'] }
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

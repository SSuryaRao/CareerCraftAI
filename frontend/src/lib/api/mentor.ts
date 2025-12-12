/**
 * AI Mentor API Client
 * Provides voice-enabled mentor interaction capabilities
 */

import { apiClient } from '../api';

export interface TextToSpeechParams {
  text: string;
  language?: string;
  voiceGender?: 'MALE' | 'FEMALE';
  speakingRate?: number;
  pitch?: number;
}

export interface SpeechToTextParams {
  audio: string; // Base64 encoded audio
  language?: string;
  encoding?: string;
  sampleRate?: number;
}

export interface MentorMessageParams {
  message: string;
  mentorPersona: {
    id: string;
    name: string;
    specialty?: string;
  };
  language?: string;
}

/**
 * AI Mentor API methods
 */
export const mentorApi = {
  /**
   * Send message to AI mentor
   */
  async sendMessage(params: MentorMessageParams) {
    return apiClient.sendMentorMessage(
      params.message,
      params.mentorPersona,
      params.language || 'English'
    );
  },

  /**
   * Get conversation history
   */
  async getConversations() {
    return apiClient.getMentorConversations();
  },

  /**
   * Get conversation history with specific mentor
   */
  async getConversationHistory(mentorId: string) {
    return apiClient.getMentorConversationHistory(mentorId);
  },

  /**
   * Get progress analysis
   */
  async getProgressAnalysis() {
    return apiClient.getMentorProgressAnalysis();
  },

  /**
   * Generate learning path
   */
  async generateLearningPath(targetRole?: string, timeframe = '3 months') {
    return apiClient.generateLearningPath(targetRole, timeframe);
  },

  /**
   * Get career guidance
   */
  async getCareerGuidance(situation: string) {
    return apiClient.getCareerGuidance(situation);
  },

  /**
   * Convert text to speech
   */
  async textToSpeech(params: TextToSpeechParams) {
    return apiClient.textToSpeech(params);
  },

  /**
   * Convert speech to text
   */
  async speechToText(params: SpeechToTextParams) {
    return apiClient.speechToText(params);
  }
};

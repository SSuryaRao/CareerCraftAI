const { GoogleAuth } = require('google-auth-library');
const axios = require('axios');
const path = require('path');

/**
 * Fine-Tuned Vertex AI Service for Resume Analysis
 * Uses the fine-tuned Gemini model deployed on a Vertex AI endpoint
 */
class FineTunedAIService {
  constructor() {
    this.auth = null;
    this.projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
    this.location = process.env.VERTEX_AI_LOCATION || 'us-central1';

    // Deployed endpoint ID (from gcloud ai endpoints list)
    this.endpointId = process.env.FINE_TUNED_ENDPOINT_ID || '6655325191230455808';

    // Model configuration
    this.modelId = process.env.FINE_TUNED_MODEL_ID || '5515333943366254592';
    this.projectNumber = process.env.GOOGLE_CLOUD_PROJECT_NUMBER || '1030709276859';

    this.isConfigured = false;

    this.initialize();
  }

  initialize() {
    try {
      // Check if required environment variables are set
      if (!this.projectId) {
        console.warn('⚠️ Fine-Tuned AI not configured. Missing GOOGLE_CLOUD_PROJECT_ID');
        this.isConfigured = false;
        return;
      }

      // Initialize Google Auth client
      const credentials = process.env.GOOGLE_APPLICATION_CREDENTIALS;

      if (credentials) {
        const keyFilePath = path.resolve(credentials);
        this.auth = new GoogleAuth({
          keyFilename: keyFilePath,
          scopes: ['https://www.googleapis.com/auth/cloud-platform'],
        });
      } else {
        // Use default credentials (ADC)
        this.auth = new GoogleAuth({
          scopes: ['https://www.googleapis.com/auth/cloud-platform'],
        });
      }

      console.log('✅ Fine-Tuned AI initialized successfully');
      console.log(`📍 Project: ${this.projectId}, Location: ${this.location}`);
      console.log(`🎯 Endpoint ID: ${this.endpointId}`);
      console.log(`🤖 Model ID: ${this.modelId}`);
      this.isConfigured = true;

    } catch (error) {
      console.error('❌ Failed to initialize Fine-Tuned AI:', error.message);
      this.isConfigured = false;
    }
  }

  /**
   * Get authenticated access token
   * @returns {Promise<string>} Access token
   */
  async getAccessToken() {
    const client = await this.auth.getClient();
    const accessToken = await client.getAccessToken();
    return accessToken.token;
  }

  /**
   * Make a request to the deployed endpoint
   * @param {Object} payload - Request payload with contents and generationConfig
   * @returns {Promise<Object>} API response
   */
  async callEndpoint(payload) {
    const accessToken = await this.getAccessToken();

    // Correct endpoint URL format for deployed Gemini models
    const url = `https://${this.location}-aiplatform.googleapis.com/v1/projects/${this.projectId}/locations/${this.location}/endpoints/${this.endpointId}:generateContent`;

    const response = await axios.post(url, payload, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  }

  /**
   * Analyze resume using fine-tuned model
   * Uses the exact prompt format the model was trained on
   * @param {string} resumeText - The resume text to analyze
   * @param {number} maxRetries - Maximum number of retry attempts
   * @returns {Promise<object>} Resume analysis result
   */
  async analyzeResume(resumeText, maxRetries = 3) {
    if (!this.isConfigured) {
      throw new Error('Fine-Tuned AI is not configured. Please set up environment variables.');
    }

    // Use the EXACT prompt format from training data for best results
    const prompt = `Analyze this resume for ATS compatibility and provide detailed feedback.

RESUME TEXT:
${resumeText.substring(0, 6000)}

Provide your analysis in JSON format with overall score (0-100), individual scores for keywords/formatting/experience/skills, improvement suggestions with priority levels, keyword analysis with found/missing/suggested keywords, and lists of strengths and weaknesses.`;

    console.log('📋 Using fine-tuned model optimized prompt format');

    let lastError;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`🎯 Fine-tuned model analysis attempt ${attempt}/${maxRetries}...`);

        const payload = {
          contents: [
            {
              role: 'user',
              parts: [{ text: prompt }]
            }
          ],
          generationConfig: {
            temperature: 0.3, // Lower temperature for more consistent resume analysis
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192,
          }
        };

        const response = await this.callEndpoint(payload);

        if (!response || !response.candidates || response.candidates.length === 0) {
          throw new Error('No candidates in response');
        }

        const candidate = response.candidates[0];

        // Check finish reason
        if (candidate.finishReason === 'SAFETY' || candidate.finishReason === 'RECITATION') {
          console.warn('⚠️ Content blocked by safety filter:', candidate.finishReason);
          throw new Error(`Content blocked: ${candidate.finishReason}`);
        }

        if (!candidate.content || !candidate.content.parts || candidate.content.parts.length === 0) {
          throw new Error('No content parts in response');
        }

        const fullText = candidate.content.parts.map(part => part.text || '').join('');

        console.log(`✅ Fine-tuned analysis successful on attempt ${attempt}`);
        console.log(`📊 Generated ${fullText.length} characters`);
        console.log(`📝 Raw response preview: ${fullText.substring(0, 200)}...`);

        // Parse JSON response
        let jsonResponse = fullText.trim()
          .replace(/```json\s*/g, '')
          .replace(/```\s*/g, '')
          .replace(/^[^{]*/, '');

        // Log the cleaned JSON for debugging
        if (jsonResponse.length < 500) {
          console.log('📋 Cleaned JSON:', jsonResponse);
        }

        const analysis = JSON.parse(jsonResponse);

        // Validate and normalize the response
        return {
          overallScore: Math.min(100, Math.max(0, analysis.overallScore || 0)),
          scores: {
            keywords: Math.min(100, Math.max(0, analysis.scores?.keywords || 0)),
            formatting: Math.min(100, Math.max(0, analysis.scores?.formatting || 0)),
            experience: Math.min(100, Math.max(0, analysis.scores?.experience || 0)),
            skills: Math.min(100, Math.max(0, analysis.scores?.skills || 0))
          },
          suggestions: analysis.suggestions || [],
          keywordAnalysis: {
            found: analysis.keywordAnalysis?.found || [],
            missing: analysis.keywordAnalysis?.missing || [],
            suggested: analysis.keywordAnalysis?.suggested || [],
            density: Math.min(100, Math.max(0, analysis.keywordAnalysis?.density || 0))
          },
          strengths: analysis.strengths || [],
          weaknesses: analysis.weaknesses || [],
          modelType: 'fine-tuned',
          modelId: this.modelId
        };

      } catch (error) {
        lastError = error;
        console.error(`❌ Fine-tuned analysis attempt ${attempt}/${maxRetries} failed:`, error.message);

        // Log detailed error info for debugging
        if (error.response) {
          console.error(`   Status: ${error.response.status}`);
          console.error(`   Data:`, error.response.data);
        }

        // Check if it's a retryable error
        const isRetryable =
          error.message?.includes('503') ||
          error.message?.includes('500') ||
          error.message?.includes('overloaded') ||
          error.message?.includes('temporarily') ||
          error.message?.includes('quota') ||
          error.message?.includes('rate limit') ||
          error.response?.status === 503 ||
          error.response?.status === 500;

        if (isRetryable && attempt < maxRetries) {
          const waitTime = Math.min(attempt * 2000, 10000);
          console.log(`⏳ Waiting ${waitTime}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          continue;
        }

        if (attempt === maxRetries) {
          break;
        }
      }
    }

    console.error('❌ All fine-tuned analysis retry attempts failed');
    throw lastError || new Error('Fine-tuned analysis failed after all retries');
  }

  /**
   * Generate content using fine-tuned model (generic method)
   * @param {string} prompt - The prompt text
   * @param {number} maxRetries - Maximum number of retry attempts
   * @param {Object} config - Optional generation config (temperature, maxOutputTokens, etc.)
   * @returns {Promise<string>} Generated content
   */
  async generateContent(prompt, maxRetries = 3, config = {}) {
    if (!this.isConfigured) {
      throw new Error('Fine-Tuned AI is not configured');
    }

    // Merge default config with provided config
    const generationConfig = {
      temperature: 0.7,
      maxOutputTokens: 2048,
      topK: 40,
      topP: 0.95,
      ...config
    };

    let lastError;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const payload = {
          contents: [
            {
              role: 'user',
              parts: [{ text: prompt }]
            }
          ],
          generationConfig
        };

        const response = await this.callEndpoint(payload);

        if (!response || !response.candidates || response.candidates.length === 0) {
          throw new Error('No candidates in response');
        }

        const candidate = response.candidates[0];
        const fullText = candidate.content.parts.map(part => part.text || '').join('');

        return fullText;

      } catch (error) {
        lastError = error;

        if (attempt < maxRetries) {
          const waitTime = Math.min(attempt * 2000, 10000);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          continue;
        }
      }
    }

    throw lastError || new Error('Content generation failed');
  }

  /**
   * Check if Fine-Tuned AI is configured and ready
   * @returns {boolean}
   */
  isReady() {
    return this.isConfigured;
  }

  /**
   * Get service status
   * @returns {Object}
   */
  getStatus() {
    return {
      configured: this.isConfigured,
      projectId: this.projectId,
      projectNumber: this.projectNumber,
      location: this.location,
      endpointId: this.endpointId,
      modelId: this.modelId,
      authInitialized: this.auth !== null
    };
  }
}

// Export singleton instance
module.exports = new FineTunedAIService();

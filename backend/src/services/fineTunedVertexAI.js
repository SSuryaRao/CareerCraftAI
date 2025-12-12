/**
 * Fine-Tuned Vertex AI Service
 *
 * This service manages fine-tuned Gemini models for resume analysis.
 * It provides methods to use custom-trained models instead of base models.
 */

const { VertexAI } = require('@google-cloud/vertexai');

class FineTunedVertexAIService {
  constructor() {
    this.client = null;
    this.model = null;
    this.fineTunedModel = null;
    this.projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
    this.location = process.env.VERTEX_AI_LOCATION || 'us-central1';

    // Fine-tuned model name (will be set after training completes)
    // Format: projects/{project}/locations/{location}/models/{model_id}
    this.fineTunedModelName = process.env.VERTEX_AI_FINETUNED_MODEL || null;

    // Fallback to base model if fine-tuned model not available
    this.baseModelName = process.env.VERTEX_AI_MODEL || 'gemini-1.5-flash';

    this.isConfigured = false;
    this.useFineTunedModel = false;

    this.initialize();
  }

  initialize() {
    try {
      if (!this.projectId) {
        console.warn('⚠️ Vertex AI not configured. Missing GOOGLE_CLOUD_PROJECT_ID');
        this.isConfigured = false;
        return;
      }

      // Initialize Vertex AI client
      const credentials = process.env.GOOGLE_APPLICATION_CREDENTIALS;

      if (credentials) {
        this.client = new VertexAI({
          project: this.projectId,
          location: this.location,
          googleAuthOptions: {
            keyFilename: credentials
          }
        });
      } else {
        this.client = new VertexAI({
          project: this.projectId,
          location: this.location
        });
      }

      // Try to load fine-tuned model if available
      if (this.fineTunedModelName) {
        try {
          console.log(`🎯 Loading fine-tuned model: ${this.fineTunedModelName}`);

          this.fineTunedModel = this.client.getGenerativeModel({
            model: this.fineTunedModelName,
            generationConfig: {
              temperature: 0.4, // Lower temperature for fine-tuned models
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 8192,
            },
            safetySettings: this.getSafetySettings(),
          });

          this.useFineTunedModel = true;
          console.log('✅ Fine-tuned model loaded successfully');

        } catch (fineTunedError) {
          console.warn('⚠️ Could not load fine-tuned model, falling back to base model');
          console.warn('Error:', fineTunedError.message);
          this.useFineTunedModel = false;
        }
      }

      // Load base model as fallback
      this.model = this.client.getGenerativeModel({
        model: this.baseModelName,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
        },
        safetySettings: this.getSafetySettings(),
      });

      console.log(`✅ Vertex AI initialized`);
      console.log(`📍 Project: ${this.projectId}, Location: ${this.location}`);
      console.log(`🤖 Using: ${this.useFineTunedModel ? 'Fine-tuned model' : 'Base model (' + this.baseModelName + ')'}`);

      this.isConfigured = true;

    } catch (error) {
      console.error('❌ Failed to initialize Vertex AI:', error.message);
      this.isConfigured = false;
    }
  }

  /**
   * Get safety settings
   */
  getSafetySettings() {
    return [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
    ];
  }

  /**
   * Generate content using fine-tuned model (or base model as fallback)
   */
  async generateContent(prompt, maxRetries = 3, customConfig = null, useStreaming = false) {
    if (!this.isConfigured) {
      throw new Error('Vertex AI is not configured');
    }

    // Choose model: fine-tuned if available, otherwise base
    const modelToUse = this.useFineTunedModel ? this.fineTunedModel : this.model;
    const modelType = this.useFineTunedModel ? 'fine-tuned' : 'base';

    console.log(`🤖 Using ${modelType} model for generation...`);

    let lastError;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`🔄 Attempt ${attempt}/${maxRetries}...`);

        const request = {
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
        };

        // Apply custom config if provided
        let model = modelToUse;
        if (customConfig) {
          const mergedConfig = {
            ...modelToUse.generationConfig,
            ...customConfig
          };

          console.log(`🔧 Custom config: maxTokens=${mergedConfig.maxOutputTokens}, temp=${mergedConfig.temperature}`);

          model = this.client.getGenerativeModel({
            model: this.useFineTunedModel ? this.fineTunedModelName : this.baseModelName,
            generationConfig: mergedConfig,
            safetySettings: this.getSafetySettings()
          });
        }

        // Non-streaming mode (more reliable)
        if (!useStreaming) {
          const result = await model.generateContent(request);
          const response = result.response;

          if (!response || !response.candidates || response.candidates.length === 0) {
            throw new Error('No candidates in response');
          }

          const candidate = response.candidates[0];

          if (candidate.finishReason === 'SAFETY' || candidate.finishReason === 'RECITATION') {
            console.warn('⚠️ Content blocked:', candidate.finishReason);
            throw new Error(`Content blocked: ${candidate.finishReason}`);
          }

          if (!candidate.content || !candidate.content.parts || candidate.content.parts.length === 0) {
            throw new Error('No content parts in response');
          }

          const fullText = candidate.content.parts.map(part => part.text || '').join('');

          console.log(`✅ Generation successful (${fullText.length} chars)`);
          console.log(`📊 Model used: ${modelType}`);

          return fullText;
        }

        // Streaming mode
        const streamingResult = await model.generateContentStream(request);
        let fullText = '';

        for await (const item of streamingResult.stream) {
          if (item.candidates && item.candidates[0]) {
            const candidate = item.candidates[0];
            if (candidate.content && candidate.content.parts) {
              for (const part of candidate.content.parts) {
                if (part.text) {
                  fullText += part.text;
                }
              }
            }
          }
        }

        if (!fullText || fullText.length === 0) {
          throw new Error('Empty response from AI');
        }

        console.log(`✅ Streaming generation successful (${fullText.length} chars)`);
        return fullText;

      } catch (error) {
        lastError = error;
        console.error(`❌ Attempt ${attempt} failed:`, error.message);

        const isRetryable =
          error.message?.includes('503') ||
          error.message?.includes('overloaded') ||
          error.message?.includes('temporarily') ||
          error.message?.includes('quota');

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

    console.error('❌ All retry attempts failed');
    throw lastError || new Error('AI generation failed');
  }

  /**
   * Switch to fine-tuned model
   */
  setFineTunedModel(modelName) {
    console.log(`🔄 Switching to fine-tuned model: ${modelName}`);

    try {
      this.fineTunedModelName = modelName;
      this.fineTunedModel = this.client.getGenerativeModel({
        model: modelName,
        generationConfig: {
          temperature: 0.4,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
        },
        safetySettings: this.getSafetySettings(),
      });

      this.useFineTunedModel = true;
      console.log('✅ Fine-tuned model activated');

      return true;
    } catch (error) {
      console.error('❌ Failed to load fine-tuned model:', error.message);
      return false;
    }
  }

  /**
   * Switch back to base model
   */
  useBaseModel() {
    console.log('🔄 Switching back to base model');
    this.useFineTunedModel = false;
  }

  /**
   * Get current model info
   */
  getModelInfo() {
    return {
      configured: this.isConfigured,
      usingFineTuned: this.useFineTunedModel,
      fineTunedModelName: this.fineTunedModelName,
      baseModelName: this.baseModelName,
      projectId: this.projectId,
      location: this.location
    };
  }

  /**
   * Check if fine-tuned model is available
   */
  hasFineTunedModel() {
    return this.useFineTunedModel && this.fineTunedModel !== null;
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
      usingFineTunedModel: this.useFineTunedModel,
      fineTunedModel: this.fineTunedModelName,
      baseModel: this.baseModelName,
      projectId: this.projectId,
      location: this.location,
      clientInitialized: this.client !== null,
      modelInitialized: this.model !== null
    };
  }
}

// Export singleton instance
module.exports = new FineTunedVertexAIService();

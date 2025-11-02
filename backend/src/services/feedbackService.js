const { GoogleGenerativeAI } = require('@google/generative-ai');

class FeedbackService {
  constructor() {
    this.genAI = null;
    if (process.env.GEMINI_API_KEY) {
      this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    }
  }

  /**
   * Analyze sentiment of feedback message using Gemini AI
   * @param {string} message - Feedback message to analyze
   * @returns {Promise<Object>} Sentiment analysis result
   */
  async analyzeSentiment(message) {
    if (!this.genAI) {
      console.warn('Gemini API not configured, skipping sentiment analysis');
      return {
        score: 0,
        magnitude: 0,
        label: 'neutral'
      };
    }

    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });

      const prompt = `Analyze the sentiment of the following feedback message.
      Provide a JSON response with:
      - score: a number between -1 (very negative) and 1 (very positive)
      - magnitude: a number between 0 and 10 indicating emotional intensity
      - label: one of "positive", "negative", "neutral", or "mixed"

      Feedback: "${message}"

      Respond ONLY with valid JSON, no additional text.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const sentiment = JSON.parse(jsonMatch[0]);
        return {
          score: Math.max(-1, Math.min(1, sentiment.score || 0)),
          magnitude: Math.max(0, Math.min(10, sentiment.magnitude || 0)),
          label: ['positive', 'negative', 'neutral', 'mixed'].includes(sentiment.label)
            ? sentiment.label
            : 'neutral'
        };
      }

      throw new Error('Failed to parse sentiment analysis response');
    } catch (error) {
      console.error('Sentiment analysis error:', error.message);
      // Return neutral sentiment on error
      return {
        score: 0,
        magnitude: 0,
        label: 'neutral'
      };
    }
  }

  /**
   * Auto-suggest priority based on feedback type and sentiment
   * @param {string} type - Feedback type
   * @param {Object} sentiment - Sentiment analysis result
   * @returns {string} Suggested priority
   */
  suggestPriority(type, sentiment) {
    // Critical bugs always high priority
    if (type === 'bug' && sentiment.score < -0.5) {
      return 'critical';
    }

    // Bugs are generally high priority
    if (type === 'bug') {
      return 'high';
    }

    // Complaints with strong negative sentiment
    if (type === 'complaint' && sentiment.score < -0.3) {
      return 'high';
    }

    // Feature requests based on sentiment
    if (type === 'feature_request') {
      return sentiment.score > 0.3 ? 'medium' : 'low';
    }

    // Default based on sentiment
    if (sentiment.score < -0.5) return 'high';
    if (sentiment.score > 0.5) return 'low';
    return 'medium';
  }

  /**
   * Generate feedback summary statistics
   * @param {Object} stats - Raw stats from database
   * @returns {Object} Formatted statistics
   */
  formatStats(stats) {
    const total = stats.total || 0;

    return {
      total,
      byStatus: {
        pending: stats.byStatus?.pending || 0,
        reviewing: stats.byStatus?.reviewing || 0,
        'in-progress': stats.byStatus?.['in-progress'] || 0,
        resolved: stats.byStatus?.resolved || 0,
        archived: stats.byStatus?.archived || 0
      },
      byType: {
        bug: stats.byType?.bug || 0,
        feature_request: stats.byType?.feature_request || 0,
        general: stats.byType?.general || 0,
        improvement: stats.byType?.improvement || 0,
        complaint: stats.byType?.complaint || 0
      },
      byPriority: {
        low: stats.byPriority?.low || 0,
        medium: stats.byPriority?.medium || 0,
        high: stats.byPriority?.high || 0,
        critical: stats.byPriority?.critical || 0
      },
      avgRating: Math.round((stats.avgRating || 0) * 10) / 10,
      sentiment: {
        positive: stats.sentiment?.positive || 0,
        neutral: stats.sentiment?.neutral || 0,
        negative: stats.sentiment?.negative || 0,
        mixed: stats.sentiment?.mixed || 0
      },
      resolutionRate: total > 0
        ? Math.round(((stats.byStatus?.resolved || 0) / total) * 100)
        : 0,
      responseRate: total > 0
        ? Math.round((((stats.byStatus?.resolved || 0) + (stats.byStatus?.['in-progress'] || 0)) / total) * 100)
        : 0
    };
  }

  /**
   * Validate file attachment
   * @param {Object} file - Multer file object
   * @returns {Object} Validation result
   */
  validateAttachment(file) {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = [
      'image/png',
      'image/jpeg',
      'image/jpg',
      'image/gif',
      'application/pdf',
      'text/plain',
      'text/log'
    ];

    if (file.size > maxSize) {
      return {
        valid: false,
        error: 'File size exceeds 5MB limit'
      };
    }

    if (!allowedTypes.includes(file.mimetype)) {
      return {
        valid: false,
        error: 'File type not allowed. Allowed: PNG, JPG, GIF, PDF, TXT, LOG'
      };
    }

    return { valid: true };
  }

  /**
   * Send email notification for new feedback
   * @param {Object} feedback - Feedback document
   */
  async sendFeedbackNotification(feedback) {
    try {
      const emailService = require('./emailService');

      // Send confirmation to user if email provided
      if (feedback.email) {
        await emailService.sendFeedbackSubmissionConfirmation(feedback.email, feedback);
      }

      // Send notification to admin
      await emailService.sendFeedbackAdminNotification(feedback);

      return true;
    } catch (error) {
      console.error('Failed to send feedback notification:', error.message);
      // Don't throw - email failures shouldn't block the feedback submission
      return false;
    }
  }

  /**
   * Send email notification when admin responds
   * @param {Object} feedback - Feedback document
   * @param {string} userEmail - User email address
   */
  async sendResponseNotification(feedback, userEmail) {
    try {
      const emailService = require('./emailService');

      if (!userEmail) {
        console.log('No email provided, skipping response notification');
        return false;
      }

      // Get the latest response
      const latestResponse = feedback.responses[feedback.responses.length - 1];

      await emailService.sendFeedbackResponseNotification(userEmail, feedback, latestResponse);

      return true;
    } catch (error) {
      console.error('Failed to send response notification:', error.message);
      return false;
    }
  }
}

module.exports = new FeedbackService();

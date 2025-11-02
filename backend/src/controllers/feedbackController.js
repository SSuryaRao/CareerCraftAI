const Feedback = require('../models/Feedback');
const User = require('../models/User');
const feedbackService = require('../services/feedbackService');
const { Storage } = require('@google-cloud/storage');
const path = require('path');

// Initialize Google Cloud Storage (if credentials are available)
let storage = null;
let bucket = null;

try {
  if (process.env.GOOGLE_CLOUD_PROJECT_ID && process.env.GCS_BUCKET_NAME) {
    storage = new Storage({
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
    });
    bucket = storage.bucket(process.env.GCS_BUCKET_NAME);
  }
} catch (error) {
  console.warn('Google Cloud Storage not configured, file uploads will be saved locally');
}

class FeedbackController {
  /**
   * Submit new feedback (public or authenticated)
   * POST /api/feedback/submit
   */
  async submitFeedback(req, res) {
    try {
      const {
        type,
        category,
        subject,
        message,
        email,
        rating,
        pageUrl,
        isAnonymous
      } = req.body;

      // Validation
      if (!type || !category || !subject || !message) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields',
          message: 'Type, category, subject, and message are required'
        });
      }

      // If anonymous, email is required
      if ((isAnonymous || !req.user) && !email) {
        return res.status(400).json({
          success: false,
          error: 'Email required',
          message: 'Email is required for anonymous feedback'
        });
      }

      // Prepare feedback data
      const feedbackData = {
        type,
        category,
        subject,
        message,
        rating: rating || null,
        pageUrl: pageUrl || null,
        userAgent: req.headers['user-agent'] || null,
        isAnonymous: isAnonymous || !req.user,
        email: isAnonymous ? email : (req.user?.email || email)
      };

      // Add user reference if authenticated and not anonymous
      if (req.user && !isAnonymous) {
        feedbackData.userId = req.user.uid;

        // Find user in database to get MongoDB ID
        const user = await User.findOne({ firebaseUid: req.user.uid });
        if (user) {
          feedbackData.userId = user._id;
        }
      }

      // Analyze sentiment
      const sentiment = await feedbackService.analyzeSentiment(message);
      feedbackData.sentiment = sentiment;

      // Auto-suggest priority
      feedbackData.priority = feedbackService.suggestPriority(type, sentiment);

      // Handle file attachments if any
      const attachments = [];
      if (req.files && req.files.length > 0) {
        for (const file of req.files) {
          // Validate file
          const validation = feedbackService.validateAttachment(file);
          if (!validation.valid) {
            return res.status(400).json({
              success: false,
              error: 'Invalid file',
              message: validation.error
            });
          }

          // Upload to cloud storage or save locally
          let fileUrl = '';
          if (bucket) {
            const filename = `feedback/${Date.now()}-${file.originalname}`;
            const blob = bucket.file(filename);
            const blobStream = blob.createWriteStream({
              resumable: false,
              metadata: {
                contentType: file.mimetype
              }
            });

            await new Promise((resolve, reject) => {
              blobStream.on('error', reject);
              blobStream.on('finish', () => {
                fileUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;
                resolve();
              });
              blobStream.end(file.buffer);
            });
          } else {
            // Save locally
            fileUrl = `/uploads/feedback/${file.filename}`;
          }

          attachments.push({
            filename: file.originalname,
            url: fileUrl,
            mimetype: file.mimetype,
            size: file.size
          });
        }
      }

      feedbackData.attachments = attachments;

      // Create feedback
      const feedback = await Feedback.create(feedbackData);

      // Send notification to admin
      await feedbackService.sendFeedbackNotification(feedback);

      res.status(201).json({
        success: true,
        message: 'Feedback submitted successfully',
        data: {
          id: feedback._id,
          subject: feedback.subject,
          type: feedback.type,
          status: feedback.status,
          createdAt: feedback.createdAt
        }
      });
    } catch (error) {
      console.error('Error submitting feedback:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to submit feedback',
        message: error.message
      });
    }
  }

  /**
   * Get user's own feedback
   * GET /api/feedback/user
   */
  async getUserFeedback(req, res) {
    try {
      const { page = 1, limit = 10, status, type } = req.query;

      // Find user in database
      const user = await User.findOne({ firebaseUid: req.user.uid });
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      // Build query
      const query = { userId: user._id };
      if (status) query.status = status;
      if (type) query.type = type;

      // Get feedback with pagination
      const feedback = await Feedback.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

      const total = await Feedback.countDocuments(query);

      res.status(200).json({
        success: true,
        data: {
          feedback,
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / limit),
            totalItems: total,
            hasNext: page < Math.ceil(total / limit),
            hasPrev: page > 1
          }
        }
      });
    } catch (error) {
      console.error('Error getting user feedback:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve feedback',
        message: error.message
      });
    }
  }

  /**
   * Get single feedback by ID
   * GET /api/feedback/:id
   */
  async getFeedbackById(req, res) {
    try {
      const { id } = req.params;

      const feedback = await Feedback.findById(id);
      if (!feedback) {
        return res.status(404).json({
          success: false,
          error: 'Feedback not found'
        });
      }

      // Check authorization (user's own feedback or admin)
      if (req.user) {
        const user = await User.findOne({ firebaseUid: req.user.uid });
        const isOwner = user && feedback.userId && feedback.userId.toString() === user._id.toString();
        const isAdmin = user && user.isAdmin;

        if (!isOwner && !isAdmin) {
          return res.status(403).json({
            success: false,
            error: 'Unauthorized',
            message: 'You can only view your own feedback'
          });
        }
      }

      res.status(200).json({
        success: true,
        data: feedback
      });
    } catch (error) {
      console.error('Error getting feedback:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve feedback',
        message: error.message
      });
    }
  }

  /**
   * Get all feedback (admin only)
   * GET /api/feedback/admin/all
   */
  async getAllFeedback(req, res) {
    try {
      const {
        page = 1,
        limit = 20,
        status,
        type,
        priority,
        search
      } = req.query;

      // Build query
      const query = {};
      if (status) query.status = status;
      if (type) query.type = type;
      if (priority) query.priority = priority;
      if (search) {
        query.$or = [
          { subject: { $regex: search, $options: 'i' } },
          { message: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ];
      }

      // Get feedback with pagination
      const feedback = await Feedback.find(query)
        .populate('userId', 'name email picture')
        .populate('respondedBy', 'name email')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

      const total = await Feedback.countDocuments(query);

      res.status(200).json({
        success: true,
        data: {
          feedback,
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / limit),
            totalItems: total,
            hasNext: page < Math.ceil(total / limit),
            hasPrev: page > 1
          }
        }
      });
    } catch (error) {
      console.error('Error getting all feedback:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve feedback',
        message: error.message
      });
    }
  }

  /**
   * Update feedback status/response (admin only)
   * PUT /api/feedback/admin/:id
   */
  async updateFeedback(req, res) {
    try {
      const { id } = req.params;
      const { status, priority, adminNotes, adminResponse } = req.body;

      const feedback = await Feedback.findById(id);
      if (!feedback) {
        return res.status(404).json({
          success: false,
          error: 'Feedback not found'
        });
      }

      // Get admin user
      const admin = await User.findOne({ firebaseUid: req.user.uid });

      // Update fields
      if (status) {
        feedback.status = status;
        if (status === 'resolved') {
          feedback.resolvedAt = new Date();
        }
      }
      if (priority) feedback.priority = priority;
      if (adminNotes !== undefined) feedback.adminNotes = adminNotes;
      if (adminResponse !== undefined) {
        feedback.adminResponse = adminResponse;
        feedback.respondedBy = admin._id;
        feedback.respondedAt = new Date();

        // Send notification to user
        if (feedback.email) {
          await feedbackService.sendResponseNotification(feedback, feedback.email);
        }
      }

      await feedback.save();

      res.status(200).json({
        success: true,
        message: 'Feedback updated successfully',
        data: feedback
      });
    } catch (error) {
      console.error('Error updating feedback:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update feedback',
        message: error.message
      });
    }
  }

  /**
   * Delete feedback (admin only)
   * DELETE /api/feedback/admin/:id
   */
  async deleteFeedback(req, res) {
    try {
      const { id } = req.params;

      const feedback = await Feedback.findByIdAndDelete(id);
      if (!feedback) {
        return res.status(404).json({
          success: false,
          error: 'Feedback not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Feedback deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting feedback:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete feedback',
        message: error.message
      });
    }
  }

  /**
   * Get feedback statistics (admin only)
   * GET /api/feedback/stats
   */
  async getStats(req, res) {
    try {
      const rawStats = await Feedback.getStats();
      const stats = feedbackService.formatStats(rawStats);

      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error getting feedback stats:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve statistics',
        message: error.message
      });
    }
  }
}

module.exports = new FeedbackController();

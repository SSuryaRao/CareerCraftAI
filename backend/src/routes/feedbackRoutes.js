const express = require('express');
const feedbackController = require('../controllers/feedbackController');
const { authenticateUser, optionalAuth } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/adminMiddleware');
const multer = require('multer');
const rateLimit = require('express-rate-limit');

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 3
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'image/png',
      'image/jpeg',
      'image/jpg',
      'image/gif',
      'application/pdf',
      'text/plain'
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Allowed: PNG, JPG, GIF, PDF, TXT'), false);
    }
  }
});

// Rate limiter for feedback submission (5 per hour per IP)
const submitLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: {
    success: false,
    error: 'Too many feedback submissions',
    message: 'Please wait before submitting more feedback'
  }
});

// Public/Optional Auth Routes
router.post(
  '/submit',
  submitLimiter,
  optionalAuth,
  upload.array('attachments', 3),
  feedbackController.submitFeedback
);

// Admin Routes (must come before /:id to avoid conflicts)
router.get('/stats', authenticateUser, requireAdmin, feedbackController.getStats);
router.get('/admin/all', authenticateUser, requireAdmin, feedbackController.getAllFeedback);
router.put('/admin/:id', authenticateUser, requireAdmin, feedbackController.updateFeedback);
router.delete('/admin/:id', authenticateUser, requireAdmin, feedbackController.deleteFeedback);

// Authenticated User Routes
router.get('/user', authenticateUser, feedbackController.getUserFeedback);
router.get('/:id', optionalAuth, feedbackController.getFeedbackById);

module.exports = router;

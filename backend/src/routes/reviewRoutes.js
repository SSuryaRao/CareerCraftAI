const express = require('express');
const reviewController = require('../controllers/reviewController');
const { authenticateUser, optionalAuth } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/adminMiddleware');
const rateLimit = require('express-rate-limit');

const router = express.Router();

// Rate limiter for review submission (1 per day per user)
const submitLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 3, // Allow 3 submission attempts per day (for retries)
  message: {
    success: false,
    error: 'Too many review submissions',
    message: 'Please wait before submitting another review'
  },
  keyGenerator: (req) => {
    return req.user?.uid || req.ip;
  }
});

// Public Routes
router.get('/approved', reviewController.getApprovedReviews);
router.get('/featured', reviewController.getFeaturedReviews);
router.get('/stats', reviewController.getStats);
router.get('/:id', reviewController.getReviewById);

// Authenticated User Routes
router.post('/submit', authenticateUser, submitLimiter, reviewController.submitReview);
router.get('/user/my-review', authenticateUser, reviewController.getUserReview);
router.put('/:id/helpful', authenticateUser, reviewController.markHelpful);

// Admin Routes
router.get('/admin/all', authenticateUser, requireAdmin, reviewController.getAllReviews);
router.put('/admin/:id/approve', authenticateUser, requireAdmin, reviewController.approveReview);
router.put('/admin/:id/reject', authenticateUser, requireAdmin, reviewController.rejectReview);
router.put('/admin/:id/feature', authenticateUser, requireAdmin, reviewController.toggleFeatured);
router.put('/admin/:id/respond', authenticateUser, requireAdmin, reviewController.respondToReview);
router.delete('/admin/:id', authenticateUser, requireAdmin, reviewController.deleteReview);

module.exports = router;

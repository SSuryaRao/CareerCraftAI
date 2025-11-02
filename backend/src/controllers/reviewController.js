const Review = require('../models/Review');
const User = require('../models/User');
const reviewService = require('../services/reviewService');

class ReviewController {
  /**
   * Submit new review (authenticated users only)
   * POST /api/reviews/submit
   */
  async submitReview(req, res) {
    try {
      const {
        rating,
        title,
        review,
        userRole,
        aspectRatings,
        platform
      } = req.body;

      // Validation
      if (!rating || !title || !review) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields',
          message: 'Rating, title, and review are required'
        });
      }

      if (rating < 1 || rating > 5) {
        return res.status(400).json({
          success: false,
          error: 'Invalid rating',
          message: 'Rating must be between 1 and 5'
        });
      }

      // Find user in database
      const user = await User.findOne({ firebaseUid: req.user.uid });
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      // Check for existing review
      const existingReview = await Review.findOne({ userId: user._id });

      // Check eligibility
      const eligibility = reviewService.checkEligibility(user, existingReview);
      if (!eligibility.eligible) {
        return res.status(403).json({
          success: false,
          error: 'Not eligible',
          message: eligibility.reason,
          ...(eligibility.canEditAt && { canEditAt: eligibility.canEditAt })
        });
      }

      // Prepare review data
      const reviewData = {
        userId: user._id,
        userName: user.name,
        userPicture: user.picture,
        userRole: userRole || 'User',
        rating,
        title,
        review,
        platform: platform || 'web',
        isVerifiedUser: reviewService.isVerifiedUser(user),
        aspectRatings: aspectRatings || {}
      };

      let reviewDoc;

      if (existingReview) {
        // Update existing review
        Object.assign(existingReview, reviewData);
        existingReview.status = 'pending'; // Reset to pending on edit
        existingReview.approvedAt = null;
        existingReview.isFeatured = false;
        reviewDoc = await existingReview.save();
      } else {
        // Create new review
        reviewDoc = await Review.create(reviewData);
      }

      // Send notification to admin
      await reviewService.sendNewReviewNotification(reviewDoc);

      res.status(existingReview ? 200 : 201).json({
        success: true,
        message: existingReview ? 'Review updated successfully' : 'Review submitted successfully',
        data: {
          id: reviewDoc._id,
          title: reviewDoc.title,
          rating: reviewDoc.rating,
          status: reviewDoc.status,
          createdAt: reviewDoc.createdAt
        }
      });
    } catch (error) {
      console.error('Error submitting review:', error);

      // Handle duplicate user review (should be caught by eligibility check)
      if (error.code === 11000) {
        return res.status(409).json({
          success: false,
          error: 'Duplicate review',
          message: 'You have already submitted a review'
        });
      }

      res.status(500).json({
        success: false,
        error: 'Failed to submit review',
        message: error.message
      });
    }
  }

  /**
   * Get user's own review
   * GET /api/reviews/user
   */
  async getUserReview(req, res) {
    try {
      // Find user in database
      const user = await User.findOne({ firebaseUid: req.user.uid });
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      const review = await Review.findOne({ userId: user._id });

      res.status(200).json({
        success: true,
        data: review || null
      });
    } catch (error) {
      console.error('Error getting user review:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve review',
        message: error.message
      });
    }
  }

  /**
   * Get all approved reviews (public)
   * GET /api/reviews/approved
   */
  async getApprovedReviews(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        sort = '-createdAt',
        minRating = 1
      } = req.query;

      const reviews = await Review.getApprovedReviews({
        page: parseInt(page),
        limit: parseInt(limit),
        sort,
        minRating: parseInt(minRating)
      });

      const total = await Review.countDocuments({
        status: 'approved',
        rating: { $gte: parseInt(minRating) }
      });

      res.status(200).json({
        success: true,
        data: {
          reviews,
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
      console.error('Error getting approved reviews:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve reviews',
        message: error.message
      });
    }
  }

  /**
   * Get featured reviews (public)
   * GET /api/reviews/featured
   */
  async getFeaturedReviews(req, res) {
    try {
      const { limit = 5 } = req.query;

      const reviews = await Review.getFeaturedReviews(parseInt(limit));

      res.status(200).json({
        success: true,
        data: reviews
      });
    } catch (error) {
      console.error('Error getting featured reviews:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve featured reviews',
        message: error.message
      });
    }
  }

  /**
   * Get single review by ID
   * GET /api/reviews/:id
   */
  async getReviewById(req, res) {
    try {
      const { id } = req.params;

      const review = await Review.findById(id);
      if (!review) {
        return res.status(404).json({
          success: false,
          error: 'Review not found'
        });
      }

      res.status(200).json({
        success: true,
        data: review
      });
    } catch (error) {
      console.error('Error getting review:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve review',
        message: error.message
      });
    }
  }

  /**
   * Mark review as helpful (authenticated users)
   * PUT /api/reviews/:id/helpful
   */
  async markHelpful(req, res) {
    try {
      const { id } = req.params;

      const review = await Review.findById(id);
      if (!review) {
        return res.status(404).json({
          success: false,
          error: 'Review not found'
        });
      }

      // Find user in database
      const user = await User.findOne({ firebaseUid: req.user.uid });
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      await review.markHelpful(user._id);

      res.status(200).json({
        success: true,
        message: 'Helpful status updated',
        data: {
          helpfulCount: review.helpfulCount,
          isHelpful: review.helpfulBy.includes(user._id)
        }
      });
    } catch (error) {
      console.error('Error marking review as helpful:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update helpful status',
        message: error.message
      });
    }
  }

  /**
   * Get all reviews (admin only)
   * GET /api/reviews/admin/all
   */
  async getAllReviews(req, res) {
    try {
      const {
        page = 1,
        limit = 20,
        status,
        minRating,
        search,
        sort = '-createdAt'
      } = req.query;

      // Build query
      const query = {};
      if (status) query.status = status;
      if (minRating) query.rating = { $gte: parseInt(minRating) };
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { review: { $regex: search, $options: 'i' } },
          { userName: { $regex: search, $options: 'i' } }
        ];
      }

      // Get reviews with pagination
      const reviews = await Review.find(query)
        .populate('userId', 'name email picture subscription')
        .populate('respondedBy', 'name email')
        .populate('approvedBy', 'name email')
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

      const total = await Review.countDocuments(query);

      res.status(200).json({
        success: true,
        data: {
          reviews,
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
      console.error('Error getting all reviews:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve reviews',
        message: error.message
      });
    }
  }

  /**
   * Approve review (admin only)
   * PUT /api/reviews/admin/:id/approve
   */
  async approveReview(req, res) {
    try {
      const { id } = req.params;

      const review = await Review.findById(id).populate('userId', 'email');
      if (!review) {
        return res.status(404).json({
          success: false,
          error: 'Review not found'
        });
      }

      // Get admin user
      const admin = await User.findOne({ firebaseUid: req.user.uid });

      await review.approve(admin._id);

      // Send notification to user
      if (review.userId && review.userId.email) {
        await reviewService.sendApprovalNotification(review, review.userId.email);
      }

      res.status(200).json({
        success: true,
        message: 'Review approved successfully',
        data: review
      });
    } catch (error) {
      console.error('Error approving review:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to approve review',
        message: error.message
      });
    }
  }

  /**
   * Reject review (admin only)
   * PUT /api/reviews/admin/:id/reject
   */
  async rejectReview(req, res) {
    try {
      const { id } = req.params;
      const { reason } = req.body;

      const review = await Review.findById(id).populate('userId', 'email');
      if (!review) {
        return res.status(404).json({
          success: false,
          error: 'Review not found'
        });
      }

      // Get admin user
      const admin = await User.findOne({ firebaseUid: req.user.uid });

      // Add rejection reason to admin notes
      if (reason) {
        review.adminNotes = reason;
      }

      await review.reject(admin._id);

      // Send notification to user
      if (review.userId && review.userId.email) {
        await reviewService.sendRejectionNotification(review, review.userId.email, reason);
      }

      res.status(200).json({
        success: true,
        message: 'Review rejected successfully',
        data: review
      });
    } catch (error) {
      console.error('Error rejecting review:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to reject review',
        message: error.message
      });
    }
  }

  /**
   * Toggle featured status (admin only)
   * PUT /api/reviews/admin/:id/feature
   */
  async toggleFeatured(req, res) {
    try {
      const { id } = req.params;

      const review = await Review.findById(id);
      if (!review) {
        return res.status(404).json({
          success: false,
          error: 'Review not found'
        });
      }

      await review.toggleFeatured();

      res.status(200).json({
        success: true,
        message: `Review ${review.isFeatured ? 'featured' : 'unfeatured'} successfully`,
        data: { isFeatured: review.isFeatured }
      });
    } catch (error) {
      console.error('Error toggling featured status:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to toggle featured status',
        message: error.message
      });
    }
  }

  /**
   * Add team response (admin only)
   * PUT /api/reviews/admin/:id/respond
   */
  async respondToReview(req, res) {
    try {
      const { id } = req.params;
      const { response } = req.body;

      if (!response) {
        return res.status(400).json({
          success: false,
          error: 'Response required',
          message: 'Team response is required'
        });
      }

      const review = await Review.findById(id).populate('userId', 'email');
      if (!review) {
        return res.status(404).json({
          success: false,
          error: 'Review not found'
        });
      }

      // Get admin user
      const admin = await User.findOne({ firebaseUid: req.user.uid });

      await review.addTeamResponse(response, admin._id);

      // Send notification to user
      if (review.userId && review.userId.email) {
        await reviewService.sendResponseNotification(review, review.userId.email);
      }

      res.status(200).json({
        success: true,
        message: 'Team response added successfully',
        data: review
      });
    } catch (error) {
      console.error('Error responding to review:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to add response',
        message: error.message
      });
    }
  }

  /**
   * Delete review (admin only)
   * DELETE /api/reviews/admin/:id
   */
  async deleteReview(req, res) {
    try {
      const { id } = req.params;

      const review = await Review.findByIdAndDelete(id);
      if (!review) {
        return res.status(404).json({
          success: false,
          error: 'Review not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Review deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting review:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete review',
        message: error.message
      });
    }
  }

  /**
   * Get review statistics
   * GET /api/reviews/stats
   */
  async getStats(req, res) {
    try {
      const rawStats = await Review.getStats();
      const stats = reviewService.formatStats(rawStats);

      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error getting review stats:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve statistics',
        message: error.message
      });
    }
  }
}

module.exports = new ReviewController();

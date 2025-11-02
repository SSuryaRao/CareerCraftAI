class ReviewService {
  /**
   * Check if user is eligible to submit a review
   * @param {Object} user - User document
   * @param {Object} existingReview - Existing review if any
   * @returns {Object} Eligibility result
   */
  checkEligibility(user, existingReview) {
    // Check account age (at least 7 days old)
    const accountAge = Date.now() - new Date(user.createdAt).getTime();
    const minAge = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

    if (accountAge < minAge) {
      return {
        eligible: false,
        reason: 'Account must be at least 7 days old to submit a review'
      };
    }

    // If editing existing review, check if 30 days have passed
    if (existingReview) {
      const lastEditAge = Date.now() - new Date(existingReview.updatedAt).getTime();
      const minEditAge = 30 * 24 * 60 * 60 * 1000; // 30 days

      if (lastEditAge < minEditAge && existingReview.status === 'approved') {
        return {
          eligible: false,
          reason: 'You can only edit your review once every 30 days',
          canEditAt: new Date(new Date(existingReview.updatedAt).getTime() + minEditAge)
        };
      }
    }

    return { eligible: true };
  }

  /**
   * Calculate overall statistics for reviews
   * @param {Object} stats - Raw stats from database
   * @returns {Object} Formatted statistics
   */
  formatStats(stats) {
    const total = stats.total || 0;
    const approved = stats.approved || 0;

    return {
      total,
      approved,
      pending: stats.pending || 0,
      rejected: stats.rejected || 0,
      avgRating: stats.avgRating || 0,
      ratingDistribution: {
        '5star': stats.ratingDistribution?.['5star'] || 0,
        '4star': stats.ratingDistribution?.['4star'] || 0,
        '3star': stats.ratingDistribution?.['3star'] || 0,
        '2star': stats.ratingDistribution?.['2star'] || 0,
        '1star': stats.ratingDistribution?.['1star'] || 0
      },
      aspectRatings: {
        features: Math.round((stats.aspectRatings?.features || 0) * 10) / 10,
        support: Math.round((stats.aspectRatings?.support || 0) * 10) / 10,
        easeOfUse: Math.round((stats.aspectRatings?.easeOfUse || 0) * 10) / 10,
        valueForMoney: Math.round((stats.aspectRatings?.valueForMoney || 0) * 10) / 10
      },
      recommendationRate: stats.recommendationRate || 0,
      approvalRate: total > 0 ? Math.round((approved / total) * 100) : 0
    };
  }

  /**
   * Calculate percentage of positive reviews (4-5 stars)
   * @param {Object} ratingDistribution - Rating distribution object
   * @returns {number} Percentage of positive reviews
   */
  calculatePositiveRate(ratingDistribution) {
    const total = Object.values(ratingDistribution).reduce((sum, count) => sum + count, 0);
    if (total === 0) return 0;

    const positive = (ratingDistribution['5star'] || 0) + (ratingDistribution['4star'] || 0);
    return Math.round((positive / total) * 100);
  }

  /**
   * Send email notification for new review submission
   * @param {Object} review - Review document
   */
  async sendNewReviewNotification(review) {
    try {
      // We don't send email on submission since reviews require approval
      console.log(`📧 New review submitted: ${review.title} by ${review.userName} (${review.rating}★)`);
      return true;
    } catch (error) {
      console.error('Failed to send new review notification:', error.message);
      return false;
    }
  }

  /**
   * Send email notification when review is approved
   * @param {Object} review - Review document
   * @param {string} userEmail - User email address
   */
  async sendApprovalNotification(review, userEmail) {
    try {
      const emailService = require('./emailService');

      if (!userEmail) {
        console.log('No email provided for approval notification');
        return false;
      }

      await emailService.sendReviewApprovalNotification(userEmail, review);

      return true;
    } catch (error) {
      console.error('Failed to send approval notification:', error.message);
      return false;
    }
  }

  /**
   * Send email notification when review is rejected
   * @param {Object} review - Review document
   * @param {string} userEmail - User email address
   * @param {string} reason - Rejection reason
   */
  async sendRejectionNotification(review, userEmail, reason) {
    try {
      const emailService = require('./emailService');

      if (!userEmail) {
        console.log('No email provided for rejection notification');
        return false;
      }

      await emailService.sendReviewRejectionNotification(userEmail, review, reason);

      return true;
    } catch (error) {
      console.error('Failed to send rejection notification:', error.message);
      return false;
    }
  }

  /**
   * Send email notification when admin responds to review
   * @param {Object} review - Review document
   * @param {string} userEmail - User email address
   */
  async sendResponseNotification(review, userEmail) {
    try {
      const emailService = require('./emailService');

      if (!userEmail || !review.teamResponse) {
        console.log('No email or team response provided');
        return false;
      }

      await emailService.sendReviewResponseNotification(userEmail, review, review.teamResponse);

      return true;
    } catch (error) {
      console.error('Failed to send response notification:', error.message);
      return false;
    }
  }

  /**
   * Format review for public display (remove sensitive data)
   * @param {Object} review - Review document
   * @returns {Object} Sanitized review
   */
  sanitizeForPublic(review) {
    const sanitized = review.toJSON ? review.toJSON() : { ...review };

    // Remove sensitive fields
    delete sanitized.helpfulBy;
    delete sanitized.adminNotes;
    delete sanitized.userId;

    return sanitized;
  }

  /**
   * Determine if user is verified (has active subscription)
   * @param {Object} user - User document
   * @returns {boolean} Whether user is verified
   */
  isVerifiedUser(user) {
    if (!user.subscription) return false;

    const paidPlans = ['student', 'premium', 'pro', 'enterprise'];
    return paidPlans.includes(user.subscription.plan) &&
           user.subscription.status === 'active';
  }
}

module.exports = new ReviewService();

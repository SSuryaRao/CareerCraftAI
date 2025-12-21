const express = require('express');
const router = express.Router();
const roadmapController = require('../controllers/roadmapController');
const roadmapRecommender = require('../services/roadmapRecommender');
const { authenticateUser } = require('../middleware/authMiddleware');
const { checkUsageLimit, incrementUsage } = require('../middleware/usageLimits');

router.post('/generate',
  authenticateUser,
  checkUsageLimit('roadmapGeneration'),
  roadmapController.generateRoadmap,
  incrementUsage
);

// Get personalized roadmap recommendations based on user's resume
// Supports caching - only regenerates when needed or when forceRegenerate=true
router.get('/personalized',
  authenticateUser,
  async (req, res, next) => {
    try {
      const userId = req.user.uid; // From auth middleware
      const forceRegenerate = req.query.forceRegenerate === 'true';

      console.log('🎯 Fetching personalized roadmap for user:', userId);
      if (forceRegenerate) {
        console.log('🔄 Force regenerate requested');
      }

      const recommendations = await roadmapRecommender.getPersonalizedRoadmap(userId, forceRegenerate);

      if (!recommendations) {
        console.log('ℹ️ No resume found, sending hasResume=false response');
        return res.status(200).json({
          success: true,
          hasResume: false,
          message: 'Upload a resume to get personalized roadmap recommendations',
          data: null
        });
      }

      console.log('✅ Recommendations ready:', recommendations.recommendedDomain);
      console.log(`📊 Source: ${recommendations.isCached ? 'Cached' : 'Newly Generated'} | Model: ${recommendations.modelUsed || 'unknown'}`);
      console.log('📤 Sending response to client...');

      // Only increment usage if recommendations were newly generated (not cached)
      if (!recommendations.isCached) {
        try {
          await checkUsageLimit('roadmapGeneration')(req, res, async () => {
            await incrementUsage(req, res, () => {});
          });
        } catch (usageError) {
          // If usage limit is exceeded, still return cached data if available
          console.warn('⚠️ Usage limit check failed but returning data anyway:', usageError.message);
        }
      }

      return res.status(200).json({
        success: true,
        hasResume: true,
        message: recommendations.isCached
          ? 'Roadmap recommendations retrieved from cache'
          : 'Personalized roadmap recommendations generated',
        data: recommendations,
        cached: recommendations.isCached || false,
        modelUsed: recommendations.modelUsed || 'unknown'
      });

    } catch (error) {
      console.error('❌ Personalized roadmap error:', error);
      console.error('Stack:', error.stack);

      return res.status(500).json({
        success: false,
        message: 'Failed to generate personalized recommendations',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }
);

module.exports = router;
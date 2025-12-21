const express = require('express');
const router = express.Router();
const careerAssessmentController = require('../controllers/careerAssessmentController');

// POST /api/career-assessment/recommendations - Get AI-powered career recommendations
router.post('/recommendations', careerAssessmentController.getCareerRecommendations);

// GET /api/career-assessment/history/:userId - Get assessment history for a user
router.get('/history/:userId', careerAssessmentController.getAssessmentHistory);

// GET /api/career-assessment/latest/:userId - Get latest assessment for a user
router.get('/latest/:userId', careerAssessmentController.getLatestAssessment);

module.exports = router;

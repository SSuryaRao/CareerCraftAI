const express = require('express');
const router = express.Router();
const mentorController = require('../controllers/mentorController');
const { authenticateUser } = require('../middleware/authMiddleware');
const { checkUsageLimit, incrementUsage } = require('../middleware/usageLimits');

// All routes require authentication
router.use(authenticateUser);

/**
 * @route   POST /api/mentor/message
 * @desc    Send a message to AI mentor and get response
 * @access  Private
 */
router.post('/message',
  checkUsageLimit('aiMentorMessages'),
  mentorController.sendMessage,
  incrementUsage
);

/**
 * @route   GET /api/mentor/conversations
 * @desc    Get all active conversations for the user
 * @access  Private
 */
router.get('/conversations', mentorController.getUserConversations);

/**
 * @route   GET /api/mentor/conversation/:mentorId
 * @desc    Get conversation history with a specific mentor
 * @access  Private
 */
router.get('/conversation/:mentorId', mentorController.getConversationHistory);

/**
 * @route   GET /api/mentor/progress
 * @desc    Get personalized progress analysis
 * @access  Private
 */
router.get('/progress', mentorController.getProgressAnalysis);

/**
 * @route   POST /api/mentor/learning-path
 * @desc    Generate personalized learning path
 * @access  Private
 */
router.post('/learning-path',
  checkUsageLimit('learningPaths'),
  mentorController.generateLearningPath,
  incrementUsage
);

/**
 * @route   POST /api/mentor/career-guidance
 * @desc    Get career guidance for specific situation
 * @access  Private
 */
router.post('/career-guidance', mentorController.getCareerGuidance);

/**
 * @route   POST /api/mentor/text-to-speech
 * @desc    Convert text to speech audio
 * @access  Private
 */
router.post('/text-to-speech', mentorController.textToSpeech);

/**
 * @route   POST /api/mentor/speech-to-text
 * @desc    Convert audio to text transcription
 * @access  Private
 */
router.post('/speech-to-text', mentorController.speechToText);

module.exports = router;

const express = require('express');
const router = express.Router();
const geminiLiveService = require('../services/geminiLiveService');

/**
 * GET /api/live-interview/status
 * Check if Gemini Live API is configured and ready
 */
router.get('/status', (req, res) => {
  try {
    const status = geminiLiveService.getStatus();
    res.json({
      success: true,
      ...status
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/live-interview/connection
 * Get WebSocket connection details and access token
 * Body: { domain?, level?, voiceName?, interviewerStyle? }
 */
router.post('/connection', async (req, res) => {
  try {
    if (!geminiLiveService.isReady()) {
      return res.status(503).json({
        success: false,
        error: 'Gemini Live Service is not configured'
      });
    }

    const { domain, level, voiceName, interviewerStyle } = req.body;

    const connectionDetails = await geminiLiveService.getConnectionDetails({
      domain: domain || 'general',
      level: level || 'junior',
      voiceName: voiceName || 'Puck',
      interviewerStyle: interviewerStyle || 'friendly'
    });

    res.json({
      success: true,
      ...connectionDetails
    });

  } catch (error) {
    console.error('❌ Error getting connection details:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/live-interview/voices
 * Get available voice options
 */
router.get('/voices', (req, res) => {
  const voices = [
    { name: 'Kore', style: 'Firm', description: 'Professional and authoritative' },
    { name: 'Puck', style: 'Upbeat', description: 'Friendly and enthusiastic' },
    { name: 'Charon', style: 'Informative', description: 'Clear and educational' },
    { name: 'Aoede', style: 'Breezy', description: 'Casual and relaxed' },
    { name: 'Fenrir', style: 'Excitable', description: 'Energetic and encouraging' },
    { name: 'Orus', style: 'Firm', description: 'Confident and steady' },
    { name: 'Zephyr', style: 'Bright', description: 'Light and approachable' }
  ];

  res.json({
    success: true,
    voices
  });
});

module.exports = router;

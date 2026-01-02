const express = require('express');
const router = express.Router();
const { AccessToken, RoomServiceClient, AgentDispatchClient } = require('livekit-server-sdk');
const { authenticateUser } = require('../middleware/authMiddleware');

// LiveKit credentials from environment
const LIVEKIT_API_KEY = process.env.LIVEKIT_API_KEY;
const LIVEKIT_API_SECRET = process.env.LIVEKIT_API_SECRET;
const LIVEKIT_URL = process.env.LIVEKIT_URL;

// Get HTTP URL for API calls
const getHttpUrl = () => {
  if (!LIVEKIT_URL) return null;
  return LIVEKIT_URL.replace('wss://', 'https://');
};

// Create RoomServiceClient for room management
const getRoomServiceClient = () => {
  const httpUrl = getHttpUrl();
  if (!httpUrl || !LIVEKIT_API_KEY || !LIVEKIT_API_SECRET) {
    return null;
  }
  return new RoomServiceClient(httpUrl, LIVEKIT_API_KEY, LIVEKIT_API_SECRET);
};

// Create AgentDispatchClient for explicit agent dispatch
const getAgentDispatchClient = () => {
  const httpUrl = getHttpUrl();
  if (!httpUrl || !LIVEKIT_API_KEY || !LIVEKIT_API_SECRET) {
    return null;
  }
  return new AgentDispatchClient(httpUrl, LIVEKIT_API_KEY, LIVEKIT_API_SECRET);
};

/**
 * Generate a LiveKit access token for joining an interview room
 * POST /api/livekit/token
 */
router.post('/token', authenticateUser, async (req, res) => {
  try {
    const { domain, domainName, level, voice, style } = req.body;
    const userId = req.user?.uid || `user-${Date.now()}`;

    // Validate LiveKit configuration
    if (!LIVEKIT_API_KEY || !LIVEKIT_API_SECRET) {
      return res.status(500).json({
        success: false,
        error: 'LiveKit is not configured on the server',
      });
    }

    // Create a unique room name for this interview session
    const roomName = `interview-${userId}-${Date.now()}`;

    // Room metadata contains interview configuration for the agent
    const roomMetadata = JSON.stringify({
      domain: domain || 'general',
      domainName: domainName || 'Technical',
      level: level || 'intermediate',
      voice: voice || 'Puck',
      style: style || 'friendly',
      userId: userId,
      startedAt: new Date().toISOString(),
    });

    // Explicitly dispatch the interview agent to this room
    const agentDispatch = getAgentDispatchClient();
    if (agentDispatch) {
      try {
        // Dispatch creates the room automatically if it doesn't exist
        const dispatch = await agentDispatch.createDispatch(
          roomName,
          'interview-agent',  // Must match agentName in the agent worker
          {
            metadata: roomMetadata,  // Pass interview config to agent
          }
        );
        console.log(`✅ Dispatched interview-agent to room: ${roomName}`);
        console.log(`   Dispatch ID: ${dispatch.agentName}`);
      } catch (dispatchError) {
        console.error(`❌ Agent dispatch failed: ${dispatchError.message}`);
        // Continue anyway - user can still join, agent might connect later
      }
    } else {
      console.warn('⚠️ AgentDispatchClient not available');
    }

    // Create access token
    const token = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
      identity: userId,
      name: req.user?.name || 'Candidate',
      metadata: JSON.stringify({ role: 'candidate' }),
    });

    // Grant permissions
    token.addGrant({
      room: roomName,
      roomJoin: true,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
    });

    // Generate the JWT token
    const jwt = await token.toJwt();

    res.json({
      success: true,
      token: jwt,
      roomName: roomName,
      roomMetadata: roomMetadata,
      url: LIVEKIT_URL,
    });
  } catch (error) {
    console.error('Error generating LiveKit token:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate access token',
    });
  }
});

/**
 * Check if LiveKit is configured
 * GET /api/livekit/status
 */
router.get('/status', (req, res) => {
  const configured = !!(LIVEKIT_API_KEY && LIVEKIT_API_SECRET && LIVEKIT_URL);

  res.json({
    success: true,
    configured: configured,
    url: configured ? LIVEKIT_URL : null,
  });
});

module.exports = router;

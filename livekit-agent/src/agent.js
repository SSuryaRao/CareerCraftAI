import {
  WorkerOptions,
  cli,
  defineAgent,
  voice,
} from '@livekit/agents';
import * as google from '@livekit/agents-plugin-google';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

// Import domain-specific prompts
import { buildSystemInstructions, getDomainPrompt } from './prompts/domainPrompts.js';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Global error handlers to prevent crashes from pidusage race conditions on Windows
// This handles the "No matching pid found" error that occurs when processes terminate
// before their stats can be read
process.on('uncaughtException', (error) => {
  if (error.code === 'ENOENT' && error.message?.includes('No matching pid found')) {
    console.warn('⚠️ Ignoring pidusage race condition (process already terminated)');
    return; // Don't crash for this known Windows issue
  }
  console.error('❌ Uncaught exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  if (reason?.code === 'ENOENT' && reason?.message?.includes('No matching pid found')) {
    console.warn('⚠️ Ignoring pidusage race condition (process already terminated)');
    return; // Don't crash for this known Windows issue
  }
  console.error('❌ Unhandled rejection at:', promise, 'reason:', reason);
});

console.log('🔧 LiveKit Agent starting...');
console.log(`   LIVEKIT_URL: ${process.env.LIVEKIT_URL ? '✅ Set' : '❌ Missing'}`);
console.log(`   LIVEKIT_API_KEY: ${process.env.LIVEKIT_API_KEY ? '✅ Set' : '❌ Missing'}`);
console.log(`   GOOGLE_API_KEY: ${process.env.GOOGLE_API_KEY ? '✅ Set' : '❌ Missing'}`);

// Interview configuration based on room metadata
function getInterviewConfig(metadata) {
  try {
    return JSON.parse(metadata || '{}');
  } catch {
    return {};
  }
}

// Voice options mapping
const VOICE_MAP = {
  'Puck': 'Puck',
  'Charon': 'Charon',
  'Kore': 'Kore',
  'Fenrir': 'Fenrir',
  'Aoede': 'Aoede',
};

// Define the interview agent
export default defineAgent({
  entry: async (ctx) => {
    console.log('🎤 Job received! Starting interview agent...');

    // Get interview configuration from room metadata
    const config = getInterviewConfig(ctx.room.metadata);
    const voiceName = VOICE_MAP[config.voice] || 'Puck';

    // Build domain-specific instructions
    const instructions = buildSystemInstructions({
      domain: config.domain || 'general',
      domainName: config.domainName || 'Technical',
      level: config.level || 'Mid-Level',
      style: config.style || 'friendly'
    });

    // Check if we have a domain-specific prompt
    const domainPrompt = getDomainPrompt(config.domain);

    console.log('🎤 Interview configuration:');
    console.log(`   Domain: ${config.domainName || 'General'} (${config.domain || 'general'})`);
    console.log(`   Domain-specific prompt: ${domainPrompt ? '✅ Loaded' : '⚠️ Using generic'}`);
    console.log(`   Level: ${config.level || 'Mid-Level'}`);
    console.log(`   Voice: ${voiceName}`);
    console.log(`   Style: ${config.style || 'friendly'}`);

    // Connect to the room first
    await ctx.connect();
    console.log('✅ Agent connected to room');

    try {
      // Create the Gemini Live realtime model (note: beta namespace)
      const model = new google.beta.realtime.RealtimeModel({
        model: 'gemini-2.0-flash-exp',
        voice: voiceName,
        instructions: instructions,
      });
      console.log('✅ Gemini RealtimeModel created');

      // Create a voice agent (required by AgentSession)
      const agent = new voice.Agent({
        instructions: instructions,
      });

      // Create agent session with the realtime model
      const session = new voice.AgentSession({
        llm: model,
      });

      // Start the session
      await session.start({
        agent: agent,
        room: ctx.room,
      });

      console.log('✅ Voice session started');

      // Let the agent start naturally based on instructions
      // Don't call generateReply - let Gemini handle the conversation flow
    } catch (error) {
      console.error('❌ Error in agent entry:', error);
      throw error;
    }
  },
});

// Run the agent worker with explicit agent name for dispatch
cli.runApp(
  new WorkerOptions({
    agent: fileURLToPath(import.meta.url),
    agentName: 'interview-agent',  // Enable explicit dispatch
  })
);

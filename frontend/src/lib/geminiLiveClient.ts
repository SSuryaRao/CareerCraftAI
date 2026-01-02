/**
 * Gemini Live API WebSocket Client
 * Handles real-time bidirectional audio communication with Gemini
 */

export interface GeminiLiveConfig {
  websocketUrl: string;
  apiKey: string;
  model: string;
  config: {
    setup: {
      model: string;
      generationConfig: {
        responseModalities: string[];
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: string;
            };
          };
        };
      };
      systemInstruction: {
        parts: { text: string }[];
      };
    };
  };
}

export interface GeminiLiveCallbacks {
  onOpen?: () => void;
  onClose?: (event: CloseEvent) => void;
  onError?: (error: Event) => void;
  onAudio?: (base64Audio: string) => void;
  onText?: (text: string) => void;
  onInterrupted?: () => void;
  onSetupComplete?: () => void;
  onTurnComplete?: () => void;
}

type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'setup_complete';

export class GeminiLiveClient {
  private ws: WebSocket | null = null;
  private config: GeminiLiveConfig | null = null;
  private callbacks: GeminiLiveCallbacks = {};
  private state: ConnectionState = 'disconnected';
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 3;

  /**
   * Connect to Gemini Live API
   */
  async connect(config: GeminiLiveConfig, callbacks: GeminiLiveCallbacks): Promise<void> {
    if (this.state !== 'disconnected') {
      console.warn('Already connected or connecting');
      return;
    }

    this.config = config;
    this.callbacks = callbacks;
    this.state = 'connecting';

    return new Promise((resolve, reject) => {
      try {
        // Add API key to URL for Google AI endpoint
        const url = `${config.websocketUrl}?key=${config.apiKey}`;

        console.log('🔌 Connecting to Gemini Live API...');
        console.log('📍 URL:', config.websocketUrl);
        this.ws = new WebSocket(url);

        this.ws.onopen = () => {
          console.log('✅ WebSocket connected');
          this.state = 'connected';
          this.reconnectAttempts = 0;

          // Send setup message immediately
          this.sendSetup();

          if (this.callbacks.onOpen) {
            this.callbacks.onOpen();
          }
          resolve();
        };

        this.ws.onclose = (event) => {
          console.log('🔌 WebSocket closed:', event.code, event.reason);
          this.state = 'disconnected';

          if (this.callbacks.onClose) {
            this.callbacks.onClose(event);
          }
        };

        this.ws.onerror = (error) => {
          console.error('❌ WebSocket error:', error);

          if (this.callbacks.onError) {
            this.callbacks.onError(error);
          }

          if (this.state === 'connecting') {
            reject(error);
          }
        };

        this.ws.onmessage = async (event) => {
          // Handle both binary (Blob) and text (JSON) messages
          if (event.data instanceof Blob) {
            // Binary data - convert Blob to text first
            const text = await event.data.text();
            this.handleMessage(text);
          } else {
            this.handleMessage(event.data);
          }
        };

      } catch (error) {
        this.state = 'disconnected';
        reject(error);
      }
    });
  }

  /**
   * Send setup configuration
   */
  private sendSetup(): void {
    if (!this.ws || !this.config) return;

    const setupMessage = this.config.config;
    console.log('📤 Sending setup message');
    this.ws.send(JSON.stringify(setupMessage));
  }

  /**
   * Handle incoming WebSocket messages
   */
  private handleMessage(data: string): void {
    try {
      const message = JSON.parse(data);

      // Setup complete
      if (message.setupComplete) {
        console.log('✅ Setup complete');
        this.state = 'setup_complete';
        if (this.callbacks.onSetupComplete) {
          this.callbacks.onSetupComplete();
        }
        return;
      }

      // Server content (audio/text response)
      if (message.serverContent) {
        const content = message.serverContent;

        // Check for interruption
        if (content.interrupted) {
          console.log('⚡ Response interrupted');
          if (this.callbacks.onInterrupted) {
            this.callbacks.onInterrupted();
          }
          return;
        }

        // Check for turn complete
        if (content.turnComplete) {
          console.log('✅ Turn complete');
          if (this.callbacks.onTurnComplete) {
            this.callbacks.onTurnComplete();
          }
          return;
        }

        // Process model turn content
        if (content.modelTurn?.parts) {
          for (const part of content.modelTurn.parts) {
            // Audio data
            if (part.inlineData) {
              const audioData = part.inlineData.data;
              console.log(`🎵 Received audio data: ${audioData.length} chars`);
              if (this.callbacks.onAudio) {
                this.callbacks.onAudio(audioData);
              }
            }
            // Text data
            if (part.text) {
              console.log(`💬 Received text: ${part.text.substring(0, 50)}...`);
              if (this.callbacks.onText) {
                this.callbacks.onText(part.text);
              }
            }
          }
        }
        return;
      }

      // Tool call (not used in POC but logged)
      if (message.toolCall) {
        console.log('🔧 Tool call received:', message.toolCall);
        return;
      }

      // Go away message (server disconnecting)
      if (message.goAway) {
        console.warn('⚠️ Server disconnecting:', message.goAway);
        return;
      }

      console.log('📥 Unknown message type:', message);

    } catch (error) {
      console.error('Failed to parse message:', error);
    }
  }

  /**
   * Send audio data to Gemini
   */
  sendAudio(base64Audio: string): void {
    if (!this.ws || this.state !== 'setup_complete') {
      console.warn('Cannot send audio: not ready');
      return;
    }

    const message = {
      realtimeInput: {
        audio: {
          data: base64Audio,
          mimeType: 'audio/pcm;rate=16000'
        }
      }
    };

    this.ws.send(JSON.stringify(message));
  }

  /**
   * Send text input to Gemini
   */
  sendText(text: string): void {
    if (!this.ws || this.state !== 'setup_complete') {
      console.warn('Cannot send text: not ready');
      return;
    }

    const message = {
      clientContent: {
        turns: [{
          role: 'user',
          parts: [{ text }]
        }],
        turnComplete: true
      }
    };

    this.ws.send(JSON.stringify(message));
  }

  /**
   * Signal end of audio stream (user stopped talking)
   */
  sendAudioEnd(): void {
    if (!this.ws || this.state !== 'setup_complete') return;

    const message = {
      realtimeInput: {
        audioStreamEnd: true
      }
    };

    this.ws.send(JSON.stringify(message));
  }

  /**
   * Disconnect from Gemini Live API
   */
  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.state = 'disconnected';
    this.config = null;
    console.log('🔌 Disconnected from Gemini Live API');
  }

  /**
   * Get current connection state
   */
  getState(): ConnectionState {
    return this.state;
  }

  /**
   * Check if ready to send/receive
   */
  isReady(): boolean {
    return this.state === 'setup_complete';
  }
}

/**
 * Fetch connection details from backend
 */
export async function getConnectionDetails(options: {
  domain?: string;
  level?: string;
  voiceName?: string;
  interviewerStyle?: string;
} = {}): Promise<GeminiLiveConfig> {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  const response = await fetch(`${API_BASE_URL}/api/live-interview/connection`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(options),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to get connection details');
  }

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error || 'Failed to get connection details');
  }

  return data;
}

/**
 * Check Gemini Live API status
 */
export async function checkLiveApiStatus(): Promise<{ configured: boolean; error?: string }> {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  try {
    const response = await fetch(`${API_BASE_URL}/api/live-interview/status`);
    const data = await response.json();

    return {
      configured: data.success && data.configured,
      error: data.error
    };
  } catch (error) {
    return {
      configured: false,
      error: 'Failed to connect to backend'
    };
  }
}

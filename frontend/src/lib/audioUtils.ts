/**
 * Production-Ready Audio utilities for Gemini Live API
 * Based on Google's official live-api-web-console implementation
 * https://github.com/google-gemini/live-api-web-console
 */

// Audio configuration for Gemini Live API
export const AUDIO_CONFIG = {
  INPUT_SAMPLE_RATE: 16000,   // 16kHz for input (to Gemini)
  OUTPUT_SAMPLE_RATE: 24000,  // 24kHz for output (from Gemini)
  CHANNELS: 1,                 // Mono
  BIT_DEPTH: 16,              // 16-bit PCM
  CHUNK_SIZE: 4096,           // Bytes per chunk for input
  // VAD settings (will be calibrated)
  VAD_THRESHOLD: 0.015,       // Default minimum RMS threshold for speech
  VAD_SILENCE_DURATION: 600,  // ms of silence before considering speech ended
  VAD_SPEECH_DURATION: 80,    // ms of speech before considering speech started
  // Calibration settings
  CALIBRATION_DURATION: 1500, // ms to calibrate ambient noise
  CALIBRATION_MULTIPLIER: 2.0, // Threshold = ambient * multiplier
  // Ducking settings
  DUCK_VOLUME: 0.15,          // Volume when ducked (0-1)
  DUCK_FADE_DURATION: 50,     // ms to fade to ducked volume
  // Silence detection
  SILENCE_PROMPT_DELAY: 15000, // ms before prompting on silence
};

// AudioWorklet processor code as a string
const audioWorkletProcessorCode = `
class AudioCaptureProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.bufferSize = 2048;
    this.buffer = new Float32Array(this.bufferSize);
    this.bufferIndex = 0;
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0];
    if (!input || !input[0]) return true;

    const inputChannel = input[0];

    for (let i = 0; i < inputChannel.length; i++) {
      this.buffer[this.bufferIndex++] = inputChannel[i];

      if (this.bufferIndex >= this.bufferSize) {
        // Calculate RMS for VAD
        let sum = 0;
        for (let j = 0; j < this.bufferSize; j++) {
          sum += this.buffer[j] * this.buffer[j];
        }
        const rms = Math.sqrt(sum / this.bufferSize);

        // Send buffer and RMS to main thread
        this.port.postMessage({
          audioData: this.buffer.slice(),
          rms: rms,
          timestamp: currentTime
        });

        this.bufferIndex = 0;
      }
    }

    return true;
  }
}

registerProcessor('audio-capture-processor', AudioCaptureProcessor);
`;

export interface VADState {
  isSpeaking: boolean;
  speechStartTime: number | null;
  silenceStartTime: number | null;
  currentRMS: number;
  calibratedThreshold: number;
  isCalibrated: boolean;
}

export interface AudioRecorderCallbacks {
  onAudioData: (base64Audio: string) => void;
  onVADChange?: (isSpeaking: boolean) => void;
  onAudioLevel?: (level: number) => void;
  onCalibrationComplete?: (threshold: number) => void;
  onSilenceDetected?: (duration: number) => void;
}

export interface RecordingChunk {
  data: string; // base64
  timestamp: number;
  source: 'user' | 'ai';
}

/**
 * Enhanced AudioRecorder with Adaptive VAD and Recording
 */
export class AudioRecorder {
  private stream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private workletNode: AudioWorkletNode | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private callbacks: AudioRecorderCallbacks | null = null;
  private isRecording = false;
  private isMuted = false;

  // VAD state with calibration
  private vadState: VADState = {
    isSpeaking: false,
    speechStartTime: null,
    silenceStartTime: null,
    currentRMS: 0,
    calibratedThreshold: AUDIO_CONFIG.VAD_THRESHOLD,
    isCalibrated: false
  };

  // Calibration
  private calibrationSamples: number[] = [];
  private calibrationStartTime: number | null = null;
  private isCalibrating = false;

  // Recording
  private recordedChunks: RecordingChunk[] = [];
  private isRecordingSession = false;

  // Silence detection
  private lastSpeechTime: number = Date.now();
  private silenceCheckInterval: NodeJS.Timeout | null = null;

  // Fallback to ScriptProcessor
  private processor: ScriptProcessorNode | null = null;
  private useWorklet = true;

  /**
   * Start recording with optional calibration
   */
  async start(callbacks: AudioRecorderCallbacks, options: { calibrate?: boolean; record?: boolean } = {}): Promise<void> {
    if (this.isRecording) {
      console.warn('Already recording');
      return;
    }

    const { calibrate = true, record = false } = options;

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: { ideal: AUDIO_CONFIG.INPUT_SAMPLE_RATE },
          channelCount: AUDIO_CONFIG.CHANNELS,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      this.audioContext = new AudioContext({
        sampleRate: AUDIO_CONFIG.INPUT_SAMPLE_RATE,
      });

      this.source = this.audioContext.createMediaStreamSource(this.stream);
      this.callbacks = callbacks;
      this.isRecordingSession = record;

      if (record) {
        this.recordedChunks = [];
      }

      // Try AudioWorklet, fallback to ScriptProcessor
      try {
        await this.setupAudioWorklet();
      } catch (workletError) {
        console.warn('AudioWorklet not supported, falling back to ScriptProcessor');
        this.useWorklet = false;
        this.setupScriptProcessor();
      }

      this.isRecording = true;
      this.lastSpeechTime = Date.now();

      // Start calibration if requested
      if (calibrate) {
        this.startCalibration();
      }

      // Start silence detection
      this.startSilenceDetection();

      console.log('🎤 Audio recording started');

    } catch (error) {
      console.error('Failed to start recording:', error);
      throw error;
    }
  }

  /**
   * Start ambient noise calibration
   */
  private startCalibration(): void {
    this.isCalibrating = true;
    this.calibrationSamples = [];
    this.calibrationStartTime = Date.now();
    console.log('🎚️ Starting ambient noise calibration...');
  }

  /**
   * Process calibration sample
   */
  private processCalibration(rms: number): void {
    if (!this.isCalibrating || !this.calibrationStartTime) return;

    this.calibrationSamples.push(rms);

    const elapsed = Date.now() - this.calibrationStartTime;
    if (elapsed >= AUDIO_CONFIG.CALIBRATION_DURATION) {
      // Calculate average ambient noise
      const avgNoise = this.calibrationSamples.reduce((a, b) => a + b, 0) / this.calibrationSamples.length;

      // Set threshold above ambient noise
      this.vadState.calibratedThreshold = Math.max(
        AUDIO_CONFIG.VAD_THRESHOLD,
        avgNoise * AUDIO_CONFIG.CALIBRATION_MULTIPLIER
      );
      this.vadState.isCalibrated = true;
      this.isCalibrating = false;

      console.log(`🎚️ Calibration complete. Ambient: ${avgNoise.toFixed(4)}, Threshold: ${this.vadState.calibratedThreshold.toFixed(4)}`);
      this.callbacks?.onCalibrationComplete?.(this.vadState.calibratedThreshold);
    }
  }

  /**
   * Start silence detection timer
   */
  private startSilenceDetection(): void {
    this.silenceCheckInterval = setInterval(() => {
      if (!this.vadState.isSpeaking && !this.isMuted) {
        const silenceDuration = Date.now() - this.lastSpeechTime;
        if (silenceDuration >= AUDIO_CONFIG.SILENCE_PROMPT_DELAY) {
          this.callbacks?.onSilenceDetected?.(silenceDuration);
        }
      }
    }, 5000);
  }

  private async setupAudioWorklet(): Promise<void> {
    if (!this.audioContext || !this.source) return;

    const blob = new Blob([audioWorkletProcessorCode], { type: 'application/javascript' });
    const workletUrl = URL.createObjectURL(blob);

    await this.audioContext.audioWorklet.addModule(workletUrl);
    URL.revokeObjectURL(workletUrl);

    this.workletNode = new AudioWorkletNode(this.audioContext, 'audio-capture-processor');

    this.workletNode.port.onmessage = (event) => {
      if (!this.isRecording || this.isMuted) return;
      const { audioData, rms } = event.data;
      this.processAudioData(audioData, rms);
    };

    this.source.connect(this.workletNode);
  }

  private setupScriptProcessor(): void {
    if (!this.audioContext || !this.source) return;

    this.processor = this.audioContext.createScriptProcessor(
      AUDIO_CONFIG.CHUNK_SIZE / 2,
      AUDIO_CONFIG.CHANNELS,
      AUDIO_CONFIG.CHANNELS
    );

    this.processor.onaudioprocess = (event) => {
      if (!this.isRecording || this.isMuted) return;

      const inputData = event.inputBuffer.getChannelData(0);
      let sum = 0;
      for (let i = 0; i < inputData.length; i++) {
        sum += inputData[i] * inputData[i];
      }
      const rms = Math.sqrt(sum / inputData.length);
      this.processAudioData(inputData, rms);
    };

    this.source.connect(this.processor);
    this.processor.connect(this.audioContext.destination);
  }

  private processAudioData(audioData: Float32Array, rms: number): void {
    const now = Date.now();
    this.vadState.currentRMS = rms;

    // Process calibration if active
    if (this.isCalibrating) {
      this.processCalibration(rms);
    }

    // Notify audio level - use exponential scaling for better visual feedback
    if (this.callbacks?.onAudioLevel) {
      const normalizedLevel = Math.min(1, Math.pow(rms * 5, 0.7));
      this.callbacks.onAudioLevel(normalizedLevel);
    }

    // VAD logic with calibrated threshold
    const threshold = this.vadState.calibratedThreshold;
    const isAboveThreshold = rms > threshold;

    if (isAboveThreshold) {
      this.vadState.silenceStartTime = null;
      this.lastSpeechTime = now;

      if (!this.vadState.isSpeaking) {
        if (!this.vadState.speechStartTime) {
          this.vadState.speechStartTime = now;
        } else if (now - this.vadState.speechStartTime >= AUDIO_CONFIG.VAD_SPEECH_DURATION) {
          this.vadState.isSpeaking = true;
          this.callbacks?.onVADChange?.(true);
        }
      }
    } else {
      this.vadState.speechStartTime = null;

      if (this.vadState.isSpeaking) {
        if (!this.vadState.silenceStartTime) {
          this.vadState.silenceStartTime = now;
        } else if (now - this.vadState.silenceStartTime >= AUDIO_CONFIG.VAD_SILENCE_DURATION) {
          this.vadState.isSpeaking = false;
          this.callbacks?.onVADChange?.(false);
        }
      }
    }

    // Convert and send audio data
    const pcm16 = this.float32ToPCM16(audioData);
    const base64 = this.arrayBufferToBase64(pcm16.buffer);

    // Record if enabled
    if (this.isRecordingSession) {
      this.recordedChunks.push({
        data: base64,
        timestamp: now,
        source: 'user'
      });
    }

    this.callbacks?.onAudioData(base64);
  }

  addAIAudioToRecording(base64Audio: string): void {
    if (this.isRecordingSession) {
      this.recordedChunks.push({
        data: base64Audio,
        timestamp: Date.now(),
        source: 'ai'
      });
    }
  }

  getRecordedChunks(): RecordingChunk[] {
    return [...this.recordedChunks];
  }

  clearRecording(): void {
    this.recordedChunks = [];
  }

  setMuted(muted: boolean): void {
    this.isMuted = muted;
    if (muted) {
      this.vadState.isSpeaking = false;
      this.callbacks?.onVADChange?.(false);
      this.callbacks?.onAudioLevel?.(0);
    }
  }

  getIsMuted(): boolean {
    return this.isMuted;
  }

  getVADState(): VADState {
    return { ...this.vadState };
  }

  isCalibrationComplete(): boolean {
    return this.vadState.isCalibrated;
  }

  stop(): void {
    this.isRecording = false;

    if (this.silenceCheckInterval) {
      clearInterval(this.silenceCheckInterval);
      this.silenceCheckInterval = null;
    }

    if (this.workletNode) {
      this.workletNode.disconnect();
      this.workletNode = null;
    }

    if (this.processor) {
      this.processor.disconnect();
      this.processor = null;
    }

    if (this.source) {
      this.source.disconnect();
      this.source = null;
    }

    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }

    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }

    this.callbacks = null;
    this.vadState = {
      isSpeaking: false,
      speechStartTime: null,
      silenceStartTime: null,
      currentRMS: 0,
      calibratedThreshold: AUDIO_CONFIG.VAD_THRESHOLD,
      isCalibrated: false
    };

    console.log('🎤 Audio recording stopped');
  }

  getIsRecording(): boolean {
    return this.isRecording;
  }

  private float32ToPCM16(float32Array: Float32Array): Int16Array {
    const pcm16 = new Int16Array(float32Array.length);
    for (let i = 0; i < float32Array.length; i++) {
      const s = Math.max(-1, Math.min(1, float32Array[i]));
      pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }
    return pcm16;
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }
}

/**
 * Production-ready AudioPlayer based on Google's official implementation
 * Uses precise scheduling for seamless audio playback without artifacts
 * Reference: https://github.com/google-gemini/live-api-web-console
 */
export class AudioPlayer {
  private context: AudioContext;
  private gainNode: GainNode;

  // Audio streaming state
  private audioQueue: Float32Array[] = [];
  private isPlaying = false;
  private isStreamComplete = false;
  private scheduledTime = 0;
  private checkInterval: number | null = null;
  private endOfQueueAudioSource: AudioBufferSourceNode | null = null;

  // Configuration (from Google's implementation)
  private readonly sampleRate = 24000; // Gemini outputs 24kHz
  private readonly bufferSize = 7680; // ~320ms at 24kHz
  private readonly initialBufferTime = 0.1; // 100ms initial buffer
  private readonly scheduleAheadTime = 0.2; // 200ms schedule ahead

  // Callbacks
  private onPlaybackStart: (() => void) | null = null;
  private onPlaybackEnd: (() => void) | null = null;
  private onAudioChunk: ((base64: string) => void) | null = null;

  // Ducking state
  private isDucked = false;

  // Network quality tracking
  private latencyHistory: number[] = [];
  private lastPacketTime = 0;

  // First chunk handling to filter Gemini's startup beep
  private isFirstChunkOfTurn = true;
  private chunksToSkip = 1; // Skip first N chunks of each turn

  constructor() {
    this.context = new AudioContext({ sampleRate: this.sampleRate });
    this.gainNode = this.context.createGain();
    this.gainNode.gain.value = 0; // Start silent, will fade in
    this.gainNode.connect(this.context.destination);
  }

  /**
   * Process PCM16 chunk from base64 to Float32Array
   */
  private processPCM16Chunk(base64: string): Float32Array | null {
    try {
      const binary = atob(base64);
      if (binary.length < 2) return null;

      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }

      const dataView = new DataView(bytes.buffer);
      const float32Array = new Float32Array(Math.floor(bytes.length / 2));

      for (let i = 0; i < float32Array.length; i++) {
        const int16 = dataView.getInt16(i * 2, true); // little-endian
        float32Array[i] = int16 / 32768;
      }

      return float32Array;
    } catch (e) {
      console.error('Error processing audio chunk:', e);
      return null;
    }
  }

  /**
   * Add audio chunk to playback queue
   * Based on Google's addPCM16 implementation
   */
  addToQueue(base64Audio: string): void {
    // Track for recording
    this.onAudioChunk?.(base64Audio);

    // Track network quality
    const now = Date.now();
    if (this.lastPacketTime > 0) {
      const latency = now - this.lastPacketTime;
      this.latencyHistory.push(latency);
      if (this.latencyHistory.length > 20) {
        this.latencyHistory.shift();
      }
    }
    this.lastPacketTime = now;

    // Ensure context is running
    if (this.context.state === 'suspended') {
      this.context.resume();
    }

    // Detect new turn: if stream was marked complete and new audio arrives
    if (this.isStreamComplete) {
      console.log('🔄 New turn starting, resetting audio state');
      this.isFirstChunkOfTurn = true;
      this.chunksToSkip = 1;
    }

    this.isStreamComplete = false;

    // Skip first chunk(s) of each turn - Gemini often sends a startup beep
    if (this.chunksToSkip > 0) {
      this.chunksToSkip--;
      console.log(`🔇 Skipping startup chunk (${this.chunksToSkip} more to skip)`);
      return;
    }

    const processingBuffer = this.processPCM16Chunk(base64Audio);
    if (!processingBuffer) return;

    // Apply fade-in to first chunk of turn to prevent click
    let audioData = processingBuffer;
    if (this.isFirstChunkOfTurn) {
      audioData = this.applyFadeIn(processingBuffer);
      this.isFirstChunkOfTurn = false;
    }

    // Split into fixed-size buffers for consistent playback
    let offset = 0;
    while (offset < audioData.length) {
      const remaining = audioData.length - offset;
      const chunkSize = Math.min(this.bufferSize, remaining);
      const buffer = audioData.slice(offset, offset + chunkSize);
      this.audioQueue.push(buffer);
      offset += chunkSize;
    }

    console.log(`🔊 Audio queued (${audioData.length} samples, queue: ${this.audioQueue.length})`);

    // Start playback if not already playing
    if (!this.isPlaying) {
      this.isPlaying = true;
      this.scheduledTime = this.context.currentTime + this.initialBufferTime;
      // Smooth fade-in over 50ms to prevent click
      this.gainNode.gain.setValueAtTime(0, this.context.currentTime);
      this.gainNode.gain.linearRampToValueAtTime(1, this.context.currentTime + 0.05);
      this.onPlaybackStart?.();
      this.scheduleNextBuffer();
    }
  }

  /**
   * Apply fade-in to audio data to prevent startup click
   */
  private applyFadeIn(data: Float32Array): Float32Array {
    const result = new Float32Array(data.length);
    // Zero out first 500 samples (~21ms) where the beep often is
    const zeroSamples = Math.min(500, data.length);
    // Then fade in over next 1000 samples (~42ms)
    const fadeLength = Math.min(1000, data.length - zeroSamples);

    for (let i = 0; i < data.length; i++) {
      if (i < zeroSamples) {
        result[i] = 0;
      } else if (i < zeroSamples + fadeLength) {
        const t = (i - zeroSamples) / fadeLength;
        // Smooth cosine fade
        const fade = 0.5 * (1 - Math.cos(Math.PI * t));
        result[i] = data[i] * fade;
      } else {
        result[i] = data[i];
      }
    }
    return result;
  }

  /**
   * Create AudioBuffer from Float32Array
   */
  private createAudioBuffer(audioData: Float32Array): AudioBuffer {
    const audioBuffer = this.context.createBuffer(1, audioData.length, this.sampleRate);
    audioBuffer.getChannelData(0).set(audioData);
    return audioBuffer;
  }

  /**
   * Schedule audio buffers for seamless playback
   * Based on Google's scheduleNextBuffer implementation
   */
  private scheduleNextBuffer(): void {
    // Schedule buffers ahead of time for seamless playback
    while (
      this.audioQueue.length > 0 &&
      this.scheduledTime < this.context.currentTime + this.scheduleAheadTime
    ) {
      const audioData = this.audioQueue.shift()!;
      const audioBuffer = this.createAudioBuffer(audioData);
      const source = this.context.createBufferSource();

      // Track end of queue for completion callback
      if (this.audioQueue.length === 0) {
        if (this.endOfQueueAudioSource) {
          this.endOfQueueAudioSource.onended = null;
        }
        this.endOfQueueAudioSource = source;
        source.onended = () => {
          if (!this.audioQueue.length && this.endOfQueueAudioSource === source) {
            this.endOfQueueAudioSource = null;
            if (this.isStreamComplete) {
              this.isPlaying = false;
              // Reset first chunk flags for next turn
              this.isFirstChunkOfTurn = true;
              this.chunksToSkip = 1;
              this.onPlaybackEnd?.();
            }
          }
        };
      }

      source.buffer = audioBuffer;
      source.connect(this.gainNode);

      // Schedule with precise timing
      const startTime = Math.max(this.scheduledTime, this.context.currentTime);
      source.start(startTime);
      this.scheduledTime = startTime + audioBuffer.duration;
    }

    // Handle queue state
    if (this.audioQueue.length === 0) {
      if (this.isStreamComplete) {
        this.isPlaying = false;
        if (this.checkInterval) {
          clearInterval(this.checkInterval);
          this.checkInterval = null;
        }
      } else {
        // Poll for more audio
        if (!this.checkInterval) {
          this.checkInterval = window.setInterval(() => {
            if (this.audioQueue.length > 0) {
              this.scheduleNextBuffer();
            }
          }, 100);
        }
      }
    } else {
      // Schedule next check before current buffer ends
      const nextCheckTime = (this.scheduledTime - this.context.currentTime) * 1000;
      setTimeout(() => this.scheduleNextBuffer(), Math.max(0, nextCheckTime - 50));
    }
  }

  /**
   * Mark turn as complete (no more audio expected)
   */
  markTurnComplete(): void {
    this.isStreamComplete = true;
  }

  /**
   * Duck audio (reduce volume) for interruption
   */
  duck(): void {
    if (this.isDucked) return;
    this.isDucked = true;
    const now = this.context.currentTime;
    this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, now);
    this.gainNode.gain.linearRampToValueAtTime(
      AUDIO_CONFIG.DUCK_VOLUME,
      now + AUDIO_CONFIG.DUCK_FADE_DURATION / 1000
    );
  }

  /**
   * Unduck audio (restore volume)
   */
  unduck(): void {
    if (!this.isDucked) return;
    this.isDucked = false;
    const now = this.context.currentTime;
    this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, now);
    this.gainNode.gain.linearRampToValueAtTime(1.0, now + AUDIO_CONFIG.DUCK_FADE_DURATION / 1000);
  }

  /**
   * Interrupt playback with smooth fade-out
   */
  interrupt(): void {
    this.stop();
  }

  /**
   * Stop playback completely with fade-out
   * Based on Google's stop implementation
   */
  stop(): void {
    this.isPlaying = false;
    this.isStreamComplete = true;
    this.audioQueue = [];
    this.scheduledTime = this.context.currentTime;

    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }

    // Reset first chunk flags for next turn
    this.isFirstChunkOfTurn = true;
    this.chunksToSkip = 1;

    // Smooth fade-out to prevent clicks
    this.gainNode.gain.linearRampToValueAtTime(0, this.context.currentTime + 0.1);

    // Recreate gain node after fade
    setTimeout(() => {
      this.gainNode.disconnect();
      this.gainNode = this.context.createGain();
      this.gainNode.gain.value = 0; // Start silent for next playback
      this.gainNode.connect(this.context.destination);
      this.onPlaybackEnd?.();
    }, 150);

    this.latencyHistory = [];
    console.log('🔊 Audio playback stopped');
  }

  /**
   * Resume audio context if suspended
   */
  async resume(): Promise<void> {
    if (this.context.state === 'suspended') {
      await this.context.resume();
    }
    this.isStreamComplete = false;
    this.isFirstChunkOfTurn = true;
    this.chunksToSkip = 1;
    this.scheduledTime = this.context.currentTime + this.initialBufferTime;
    // Keep gain at 0, will fade in when playback starts
    this.gainNode.gain.setValueAtTime(0, this.context.currentTime);
  }

  // Callback setters
  setOnPlaybackStart(callback: () => void): void {
    this.onPlaybackStart = callback;
  }

  setOnPlaybackEnd(callback: () => void): void {
    this.onPlaybackEnd = callback;
  }

  setOnAudioChunk(callback: (base64: string) => void): void {
    this.onAudioChunk = callback;
  }

  // State getters
  getIsPlaying(): boolean {
    return this.isPlaying;
  }

  getIsDucked(): boolean {
    return this.isDucked;
  }

  getQueueLength(): number {
    return this.audioQueue.length;
  }

  /**
   * Get network quality (0-1)
   */
  getNetworkQuality(): number {
    if (this.latencyHistory.length < 5) return 1;

    const avgLatency = this.latencyHistory.reduce((a, b) => a + b, 0) / this.latencyHistory.length;
    const variance = this.latencyHistory.reduce((sum, l) => sum + Math.pow(l - avgLatency, 2), 0) / this.latencyHistory.length;
    const jitter = Math.sqrt(variance);

    return Math.max(0, 1 - (jitter / 200));
  }
}

/**
 * Sound effects manager
 */
export class SoundEffects {
  private audioContext: AudioContext | null = null;
  private sounds: Map<string, AudioBuffer> = new Map();

  async init(): Promise<void> {
    this.audioContext = new AudioContext();

    // Generate simple tones for different events
    await this.generateTone('connect', 880, 0.15, 'sine');
    await this.generateTone('disconnect', 440, 0.2, 'sine');
    await this.generateTone('mute', 330, 0.1, 'triangle');
    await this.generateTone('unmute', 550, 0.1, 'triangle');
    await this.generateTone('error', 220, 0.3, 'sawtooth');
    await this.generateTone('notification', 660, 0.12, 'sine');
  }

  private async generateTone(
    name: string,
    frequency: number,
    duration: number,
    type: OscillatorType
  ): Promise<void> {
    if (!this.audioContext) return;

    const sampleRate = this.audioContext.sampleRate;
    const numSamples = Math.floor(sampleRate * duration);
    const buffer = this.audioContext.createBuffer(1, numSamples, sampleRate);
    const channel = buffer.getChannelData(0);

    for (let i = 0; i < numSamples; i++) {
      const t = i / sampleRate;
      let sample = 0;

      switch (type) {
        case 'sine':
          sample = Math.sin(2 * Math.PI * frequency * t);
          break;
        case 'triangle':
          sample = 2 * Math.abs(2 * (t * frequency - Math.floor(t * frequency + 0.5))) - 1;
          break;
        case 'sawtooth':
          sample = 2 * (t * frequency - Math.floor(t * frequency + 0.5));
          break;
        default:
          sample = Math.sin(2 * Math.PI * frequency * t);
      }

      // Apply envelope (fade in/out)
      const fadeLength = numSamples * 0.1;
      let envelope = 1;
      if (i < fadeLength) {
        envelope = i / fadeLength;
      } else if (i > numSamples - fadeLength) {
        envelope = (numSamples - i) / fadeLength;
      }

      channel[i] = sample * envelope * 0.3;
    }

    this.sounds.set(name, buffer);
  }

  play(soundName: string): void {
    if (!this.audioContext) return;

    const buffer = this.sounds.get(soundName);
    if (!buffer) return;

    const source = this.audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(this.audioContext.destination);
    source.start();
  }

  async resume(): Promise<void> {
    if (this.audioContext?.state === 'suspended') {
      await this.audioContext.resume();
    }
  }
}

/**
 * Mic test utility
 */
export class MicTest {
  private recorder: AudioRecorder | null = null;
  private levels: number[] = [];
  private testDuration = 3000;
  private onLevel: ((level: number) => void) | null = null;
  private onComplete: ((result: MicTestResult) => void) | null = null;

  async start(
    onLevel: (level: number) => void,
    onComplete: (result: MicTestResult) => void
  ): Promise<void> {
    this.onLevel = onLevel;
    this.onComplete = onComplete;
    this.levels = [];

    this.recorder = new AudioRecorder();

    await this.recorder.start({
      onAudioData: () => {},
      onAudioLevel: (level) => {
        this.levels.push(level);
        this.onLevel?.(level);
      }
    }, { calibrate: false });

    setTimeout(() => {
      this.stop();
    }, this.testDuration);
  }

  stop(): void {
    if (this.recorder) {
      this.recorder.stop();
      this.recorder = null;
    }

    const avgLevel = this.levels.length > 0
      ? this.levels.reduce((a, b) => a + b, 0) / this.levels.length
      : 0;
    const maxLevel = this.levels.length > 0 ? Math.max(...this.levels) : 0;
    const hasAudio = maxLevel > 0.05;
    const isLoudEnough = avgLevel > 0.02;

    const result: MicTestResult = {
      success: hasAudio && isLoudEnough,
      avgLevel,
      maxLevel,
      message: !hasAudio
        ? 'No audio detected. Check your microphone connection.'
        : !isLoudEnough
        ? 'Audio level is low. Move closer to the microphone or increase input volume.'
        : 'Microphone is working well!'
    };

    this.onComplete?.(result);
  }
}

export interface MicTestResult {
  success: boolean;
  avgLevel: number;
  maxLevel: number;
  message: string;
}

/**
 * Check if browser supports required audio APIs
 */
export function checkAudioSupport(): { supported: boolean; message: string } {
  if (!navigator.mediaDevices?.getUserMedia) {
    return {
      supported: false,
      message: 'Your browser does not support microphone access. Please use Chrome, Firefox, or Edge.',
    };
  }

  if (!window.AudioContext && !(window as any).webkitAudioContext) {
    return {
      supported: false,
      message: 'Your browser does not support Web Audio API. Please use a modern browser.',
    };
  }

  return {
    supported: true,
    message: 'Audio is supported',
  };
}

/**
 * Create downloadable audio file from recorded chunks
 */
export function createAudioDownload(chunks: RecordingChunk[], filename: string = 'interview-recording'): void {
  const userChunks = chunks.filter(c => c.source === 'user');
  const aiChunks = chunks.filter(c => c.source === 'ai');

  const createWavBlob = (base64Chunks: string[], sampleRate: number): Blob => {
    const pcmDataArrays = base64Chunks.map(b64 => {
      const binary = atob(b64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      return new Int16Array(bytes.buffer);
    });

    const totalLength = pcmDataArrays.reduce((sum, arr) => sum + arr.length, 0);
    const combined = new Int16Array(totalLength);
    let offset = 0;
    for (const arr of pcmDataArrays) {
      combined.set(arr, offset);
      offset += arr.length;
    }

    const wavHeader = new ArrayBuffer(44);
    const view = new DataView(wavHeader);

    view.setUint32(0, 0x52494646, false); // "RIFF"
    view.setUint32(4, 36 + combined.byteLength, true);
    view.setUint32(8, 0x57415645, false); // "WAVE"
    view.setUint32(12, 0x666d7420, false); // "fmt "
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    view.setUint32(36, 0x64617461, false); // "data"
    view.setUint32(40, combined.byteLength, true);

    return new Blob([wavHeader, combined], { type: 'audio/wav' });
  };

  if (userChunks.length > 0) {
    const userBlob = createWavBlob(userChunks.map(c => c.data), AUDIO_CONFIG.INPUT_SAMPLE_RATE);
    const userUrl = URL.createObjectURL(userBlob);
    const a = document.createElement('a');
    a.href = userUrl;
    a.download = `${filename}-user.wav`;
    a.click();
    URL.revokeObjectURL(userUrl);
  }

  if (aiChunks.length > 0) {
    const aiBlob = createWavBlob(aiChunks.map(c => c.data), AUDIO_CONFIG.OUTPUT_SAMPLE_RATE);
    const aiUrl = URL.createObjectURL(aiBlob);
    const a = document.createElement('a');
    a.href = aiUrl;
    a.download = `${filename}-ai.wav`;
    a.click();
    URL.revokeObjectURL(aiUrl);
  }
}

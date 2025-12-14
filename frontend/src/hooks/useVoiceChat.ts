import { useState, useCallback, useRef } from 'react';
import { mentorApi } from '@/lib/api/mentor';
import { useMediaRecorder } from './useMediaRecorder';

export interface UseVoiceChatProps {
  language?: string;
  voiceGender?: 'MALE' | 'FEMALE';
  speakingRate?: number;
  pitch?: number;
  onTranscriptionComplete?: (text: string, confidence: number) => void;
  onSpeechError?: (error: Error) => void;
  maxRecordingTime?: number;
}

export interface UseVoiceChatReturn {
  // Speech-to-Text
  isRecording: boolean;
  isPaused: boolean;
  recordingTime: number;
  remainingTime: number;
  isApproachingLimit: boolean;
  isTranscribing: boolean;
  transcriptionText: string | null;
  transcriptionConfidence: number | null;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  pauseRecording: () => void;
  resumeRecording: () => void;
  resetRecording: () => void;
  hasPermission: boolean;
  permissionError: string | null;

  // Text-to-Speech
  isSpeaking: boolean;
  isGeneratingSpeech: boolean;
  currentAudioUrl: string | null;
  speak: (text: string) => Promise<void>;
  stopSpeaking: () => void;
  pauseSpeaking: () => void;
  resumeSpeaking: () => void;

  // Configuration
  language: string;
  voiceGender: 'MALE' | 'FEMALE';
  setLanguage: (lang: string) => void;
  setVoiceGender: (gender: 'MALE' | 'FEMALE') => void;
  setSpeakingRate: (rate: number) => void;
  setPitch: (pitch: number) => void;
}

export const useVoiceChat = ({
  language: initialLanguage = 'en-IN',
  voiceGender: initialVoiceGender = 'FEMALE',
  speakingRate: initialSpeakingRate = 1.0,
  pitch: initialPitch = 0.0,
  onTranscriptionComplete,
  onSpeechError,
  maxRecordingTime = 60 // Default: 1 minute for voice messages
}: UseVoiceChatProps = {}): UseVoiceChatReturn => {
  // Configuration state
  const [language, setLanguage] = useState(initialLanguage);
  const [voiceGender, setVoiceGender] = useState(initialVoiceGender);
  const [speakingRate, setSpeakingRate] = useState(initialSpeakingRate);
  const [pitch, setPitch] = useState(initialPitch);

  // Speech-to-Text state
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcriptionText, setTranscriptionText] = useState<string | null>(null);
  const [transcriptionConfidence, setTranscriptionConfidence] = useState<number | null>(null);

  // Text-to-Speech state
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isGeneratingSpeech, setIsGeneratingSpeech] = useState(false);
  const [currentAudioUrl, setCurrentAudioUrl] = useState<string | null>(null);

  // Audio element ref for playback
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize media recorder
  const mediaRecorder = useMediaRecorder({
    recordingType: 'audio',
    maxRecordingTime,
    onRecordingComplete: handleRecordingComplete,
    onError: (error) => {
      console.error('Recording error:', error);
      if (onSpeechError) {
        onSpeechError(error);
      }
    }
  });

  /**
   * Handle recording completion - transcribe audio
   */
  async function handleRecordingComplete(audioBlob: Blob) {
    if (!audioBlob) {
      console.error('No audio blob received');
      return;
    }

    console.log('🎤 Audio recording complete, transcribing...');
    setIsTranscribing(true);
    setTranscriptionText(null);
    setTranscriptionConfidence(null);

    try {
      // Convert blob to base64
      const base64Audio = await blobToBase64(audioBlob);

      // Call Speech-to-Text API
      const response = await mentorApi.speechToText({
        audio: base64Audio,
        language,
        encoding: 'WEBM_OPUS',
        sampleRate: 48000
      });

      // Extract data from API response
      if (!response.success || !response.data) {
        throw new Error('Failed to transcribe audio');
      }

      const { text, confidence } = response.data;

      console.log('✅ Transcription complete:', text);

      setTranscriptionText(text);
      setTranscriptionConfidence(confidence);

      if (onTranscriptionComplete) {
        onTranscriptionComplete(text, confidence);
      }
    } catch (error) {
      console.error('❌ Transcription error:', error);
      const err = error instanceof Error ? error : new Error('Transcription failed');

      if (onSpeechError) {
        onSpeechError(err);
      }
    } finally {
      setIsTranscribing(false);
    }
  }

  /**
   * Convert blob to base64 string
   */
  function blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          // Remove data:audio/webm;base64, prefix
          const base64 = reader.result.split(',')[1];
          resolve(base64);
        } else {
          reject(new Error('Failed to convert blob to base64'));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  /**
   * Generate speech from text and play it
   */
  const speak = useCallback(async (text: string) => {
    if (!text || text.trim().length === 0) {
      console.warn('Cannot speak empty text');
      return;
    }

    console.log('🔊 Generating speech for:', text.substring(0, 50) + '...');
    setIsGeneratingSpeech(true);

    try {
      // Stop any currently playing audio
      stopSpeaking();

      // Call Text-to-Speech API
      const response = await mentorApi.textToSpeech({
        text,
        language,
        voiceGender,
        speakingRate,
        pitch
      });

      // Extract data from API response
      if (!response.success || !response.data || !response.data.audio) {
        throw new Error('Failed to generate speech audio');
      }

      console.log('✅ Speech generated, playing audio...');

      // Convert base64 to blob URL
      const audioBlob = base64ToBlob(response.data.audio, 'audio/mp3');
      const audioUrl = URL.createObjectURL(audioBlob);

      setCurrentAudioUrl(audioUrl);

      // Create and play audio
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onplay = () => {
        console.log('▶️ Audio playback started');
        setIsSpeaking(true);
      };

      audio.onended = () => {
        console.log('⏹️ Audio playback ended');
        setIsSpeaking(false);
      };

      audio.onerror = (error) => {
        console.error('❌ Audio playback error:', error);
        setIsSpeaking(false);

        if (onSpeechError) {
          onSpeechError(new Error('Audio playback failed'));
        }
      };

      await audio.play();
    } catch (error) {
      console.error('❌ Text-to-Speech error:', error);
      const err = error instanceof Error ? error : new Error('Text-to-Speech failed');

      if (onSpeechError) {
        onSpeechError(err);
      }
    } finally {
      setIsGeneratingSpeech(false);
    }
  }, [language, voiceGender, speakingRate, pitch, onSpeechError]);

  /**
   * Convert base64 to blob
   * FIXED: Better error handling and base64 cleanup
   */
  function base64ToBlob(base64: string | undefined | null, mimeType: string): Blob {
    try {
      // Validate input
      if (!base64 || typeof base64 !== 'string') {
        throw new Error('Invalid base64 input: received ' + typeof base64);
      }

      // Clean the base64 string (remove whitespace and newlines)
      const cleanBase64 = base64.replace(/[\r\n\s]/g, '');

      // Validate cleaned base64
      if (cleanBase64.length === 0) {
        throw new Error('Base64 string is empty after cleaning');
      }

      // Decode base64 to binary string
      const byteCharacters = atob(cleanBase64);
      const byteNumbers = new Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      return new Blob([byteArray], { type: mimeType });
    } catch (error) {
      console.error('❌ Error converting base64 to blob:', error);
      throw new Error('Failed to decode audio data. Invalid base64 format.');
    }
  }

  /**
   * Stop audio playback
   */
  const stopSpeaking = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }

    if (currentAudioUrl) {
      URL.revokeObjectURL(currentAudioUrl);
      setCurrentAudioUrl(null);
    }

    setIsSpeaking(false);
  }, [currentAudioUrl]);

  /**
   * Pause audio playback
   */
  const pauseSpeaking = useCallback(() => {
    if (audioRef.current && isSpeaking) {
      audioRef.current.pause();
      setIsSpeaking(false);
    }
  }, [isSpeaking]);

  /**
   * Resume audio playback
   */
  const resumeSpeaking = useCallback(() => {
    if (audioRef.current && !isSpeaking) {
      audioRef.current.play().then(() => {
        setIsSpeaking(true);
      }).catch((error) => {
        console.error('Error resuming audio:', error);
        if (onSpeechError) {
          onSpeechError(new Error('Failed to resume audio'));
        }
      });
    }
  }, [isSpeaking, onSpeechError]);

  return {
    // Speech-to-Text
    isRecording: mediaRecorder.isRecording,
    isPaused: mediaRecorder.isPaused,
    recordingTime: mediaRecorder.recordingTime,
    remainingTime: mediaRecorder.remainingTime,
    isApproachingLimit: mediaRecorder.isApproachingLimit,
    isTranscribing,
    transcriptionText,
    transcriptionConfidence,
    startRecording: mediaRecorder.startRecording,
    stopRecording: mediaRecorder.stopRecording,
    pauseRecording: mediaRecorder.pauseRecording,
    resumeRecording: mediaRecorder.resumeRecording,
    resetRecording: mediaRecorder.resetRecording,
    hasPermission: mediaRecorder.hasPermission,
    permissionError: mediaRecorder.permissionError,

    // Text-to-Speech
    isSpeaking,
    isGeneratingSpeech,
    currentAudioUrl,
    speak,
    stopSpeaking,
    pauseSpeaking,
    resumeSpeaking,

    // Configuration
    language,
    voiceGender,
    setLanguage,
    setVoiceGender,
    setSpeakingRate,
    setPitch
  };
};

import { useState, useRef, useCallback } from 'react';

export type RecordingType = 'audio' | 'video';

export interface UseMediaRecorderProps {
  recordingType?: RecordingType;
  maxRecordingTime?: number; // Maximum recording time in seconds (default: 300 = 5 minutes)
  onRecordingComplete?: (audioBlob: Blob, videoBlob: Blob | null) => void;
  onMaxTimeReached?: () => void;
  onError?: (error: Error) => void;
}

export interface UseMediaRecorderReturn {
  isRecording: boolean;
  isPaused: boolean;
  recordingTime: number;
  maxRecordingTime: number;
  remainingTime: number;
  isApproachingLimit: boolean;
  audioBlob: Blob | null;
  videoBlob: Blob | null;
  audioUrl: string | null;
  videoUrl: string | null;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  pauseRecording: () => void;
  resumeRecording: () => void;
  resetRecording: () => void;
  hasPermission: boolean;
  permissionError: string | null;
}

export const useMediaRecorder = ({
  recordingType = 'audio',
  maxRecordingTime = 300, // Default: 5 minutes
  onRecordingComplete,
  onMaxTimeReached,
  onError
}: UseMediaRecorderProps = {}): UseMediaRecorderReturn => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const videoChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = useCallback(async () => {
    try {
      // Request permissions
      const constraints: MediaStreamConstraints = {
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 48000
        }
      };

      if (recordingType === 'video') {
        constraints.video = {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        };
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      setHasPermission(true);
      setPermissionError(null);

      // Create MediaRecorder
      const mimeType = recordingType === 'video'
        ? 'video/webm;codecs=vp9,opus'
        : 'audio/webm;codecs=opus';

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported(mimeType) ? mimeType : undefined
      });

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      videoChunksRef.current = [];

      // Handle data available
      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          if (recordingType === 'video') {
            videoChunksRef.current.push(event.data);
          } else {
            audioChunksRef.current.push(event.data);
          }
        }
      };

      // Handle stop
      mediaRecorder.onstop = () => {
        let audioBlob: Blob | null = null;
        let videoBlob: Blob | null = null;

        if (recordingType === 'video' && videoChunksRef.current.length > 0) {
          videoBlob = new Blob(videoChunksRef.current, { type: 'video/webm' });
          setVideoBlob(videoBlob);
          setVideoUrl(URL.createObjectURL(videoBlob));

          // Extract audio from video
          audioBlob = new Blob(videoChunksRef.current, { type: 'audio/webm' });
          setAudioBlob(audioBlob);
          setAudioUrl(URL.createObjectURL(audioBlob));
        } else if (audioChunksRef.current.length > 0) {
          audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          setAudioBlob(audioBlob);
          setAudioUrl(URL.createObjectURL(audioBlob));
        }

        // Stop all tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }

        // Call completion callback
        if (onRecordingComplete && audioBlob) {
          onRecordingComplete(audioBlob, videoBlob);
        }

        setIsRecording(false);
        setIsPaused(false);

        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      };

      // Start recording
      mediaRecorder.start(100); // Collect data every 100ms
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer with max time check
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          const newTime = prev + 1;

          // Auto-stop when max time reached
          if (newTime >= maxRecordingTime) {
            console.log(`Max recording time (${maxRecordingTime}s) reached - auto-stopping`);
            stopRecording();

            if (onMaxTimeReached) {
              onMaxTimeReached();
            }

            return maxRecordingTime;
          }

          return newTime;
        });
      }, 1000);

    } catch (error) {
      const err = error as Error;
      console.error('Error starting recording:', err);
      setPermissionError(err.message);
      setHasPermission(false);

      if (onError) {
        onError(err);
      }
    }
  }, [recordingType, onRecordingComplete, onError]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
  }, [isRecording]);

  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording && !isPaused) {
      mediaRecorderRef.current.pause();
      setIsPaused(true);

      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [isRecording, isPaused]);

  const resumeRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording && isPaused) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);

      // Resume timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
  }, [isRecording, isPaused]);

  const resetRecording = useCallback(() => {
    // Clean up previous recordings
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }

    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
      setVideoUrl(null);
    }

    setAudioBlob(null);
    setVideoBlob(null);
    setRecordingTime(0);
    setIsRecording(false);
    setIsPaused(false);

    audioChunksRef.current = [];
    videoChunksRef.current = [];

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  }, [audioUrl, videoUrl]);

  // Calculate derived values
  const remainingTime = Math.max(0, maxRecordingTime - recordingTime);
  const isApproachingLimit = remainingTime <= 30 && remainingTime > 0 && isRecording;

  return {
    isRecording,
    isPaused,
    recordingTime,
    maxRecordingTime,
    remainingTime,
    isApproachingLimit,
    audioBlob,
    videoBlob,
    audioUrl,
    videoUrl,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    resetRecording,
    hasPermission,
    permissionError
  };
};

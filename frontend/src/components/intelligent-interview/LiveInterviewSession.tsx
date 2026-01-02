'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  SelectRoot as Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  Mic,
  MicOff,
  PhoneOff,
  Volume2,
  VolumeX,
  AlertCircle,
  Loader2,
  Radio,
  Clock,
  Bot,
  Waves,
  Settings,
  Download,
  Wifi,
  WifiOff,
  MessageSquare,
  CheckCircle,
  XCircle,
  RefreshCw,
  Subtitles,
  Gauge
} from 'lucide-react'
import {
  AudioRecorder,
  AudioPlayer,
  SoundEffects,
  MicTest,
  checkAudioSupport,
  createAudioDownload,
  type AudioRecorderCallbacks,
  type MicTestResult,
  type RecordingChunk
} from '@/lib/audioUtils'
import {
  GeminiLiveClient,
  getConnectionDetails,
  checkLiveApiStatus,
  GeminiLiveConfig
} from '@/lib/geminiLiveClient'

interface LiveInterviewSessionProps {
  domainId: string
  domainName: string
  level: string
  onEnd: (summary?: InterviewSummary) => void
}

interface InterviewSummary {
  duration: number
  questionCount: number
  transcript: TranscriptEntry[]
  feedback?: string
}

interface TranscriptEntry {
  speaker: 'user' | 'ai'
  text: string
  timestamp: number
}

interface VoiceOption {
  id: string
  name: string
  description: string
}

type ConnectionStatus = 'idle' | 'mic_test' | 'checking' | 'connecting' | 'connected' | 'reconnecting' | 'error'
type InterviewState = 'idle' | 'calibrating' | 'listening' | 'user_speaking' | 'ai_speaking' | 'thinking'

const VOICE_OPTIONS: VoiceOption[] = [
  { id: 'Puck', name: 'Puck', description: 'Friendly and warm' },
  { id: 'Charon', name: 'Charon', description: 'Deep and professional' },
  { id: 'Kore', name: 'Kore', description: 'Clear and articulate' },
  { id: 'Fenrir', name: 'Fenrir', description: 'Confident and bold' },
  { id: 'Aoede', name: 'Aoede', description: 'Soft and calm' },
]

const INTERVIEWER_STYLES = [
  { id: 'friendly', name: 'Friendly', description: 'Warm and encouraging' },
  { id: 'formal', name: 'Professional', description: 'Structured and formal' },
  { id: 'challenging', name: 'Challenging', description: 'Thorough, pushes for depth' },
]

// Audio level visualization component
function AudioLevelIndicator({ level, isActive, color = 'green' }: { level: number; isActive: boolean; color?: 'green' | 'blue' }) {
  const bars = 5
  const colorClass = color === 'green' ? 'bg-green-500' : 'bg-blue-500'
  const inactiveClass = 'bg-gray-300 dark:bg-slate-600'

  return (
    <div className="flex items-center gap-0.5 h-6">
      {Array.from({ length: bars }).map((_, i) => {
        // More sensitive thresholds for better visual feedback
        const threshold = (i + 1) / bars * 0.6 // Scale thresholds down
        // Show bars based on level, even if not "actively speaking" yet
        const showLevel = level > 0.02 // Minimum level to show any activity
        const isLit = showLevel && level >= threshold
        return (
          <motion.div
            key={i}
            className={`w-1.5 rounded-full ${isLit ? colorClass : inactiveClass}`}
            animate={{
              height: isLit ? `${10 + i * 4}px` : '6px',
              opacity: isLit ? 1 : 0.3
            }}
            transition={{ duration: 0.05 }}
          />
        )
      })}
    </div>
  )
}

// Waveform visualization component
function WaveformVisualizer({ isActive, color = 'green' }: { isActive: boolean; color?: 'green' | 'blue' }) {
  const colorClass = color === 'green' ? 'bg-green-500' : 'bg-blue-500'

  return (
    <div className="flex items-center gap-1 h-8">
      {Array.from({ length: 7 }).map((_, i) => (
        <motion.div
          key={i}
          className={`w-1 rounded-full ${isActive ? colorClass : 'bg-gray-300 dark:bg-slate-600'}`}
          animate={isActive ? {
            height: ['8px', `${16 + Math.random() * 16}px`, '8px'],
          } : { height: '8px' }}
          transition={{
            duration: 0.3 + Math.random() * 0.2,
            repeat: isActive ? Infinity : 0,
            delay: i * 0.05
          }}
        />
      ))}
    </div>
  )
}

// Network quality indicator
function NetworkQualityIndicator({ quality }: { quality: number }) {
  const bars = 4
  const getColor = (q: number) => {
    if (q > 0.7) return 'bg-green-500'
    if (q > 0.4) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <div className="flex items-end gap-0.5 h-4" title={`Network quality: ${Math.round(quality * 100)}%`}>
      {Array.from({ length: bars }).map((_, i) => {
        const threshold = (i + 1) / bars
        const isLit = quality >= threshold * 0.9
        return (
          <div
            key={i}
            className={`w-1 rounded-sm transition-colors ${isLit ? getColor(quality) : 'bg-gray-300 dark:bg-slate-600'}`}
            style={{ height: `${6 + i * 3}px` }}
          />
        )
      })}
    </div>
  )
}

// Mic test component
function MicTestView({
  onComplete,
  onSkip
}: {
  onComplete: (result: MicTestResult) => void
  onSkip: () => void
}) {
  const [isRunning, setIsRunning] = useState(false)
  const [level, setLevel] = useState(0)
  const [result, setResult] = useState<MicTestResult | null>(null)
  const micTestRef = useRef<MicTest | null>(null)

  const startTest = async () => {
    setIsRunning(true)
    setResult(null)
    micTestRef.current = new MicTest()

    await micTestRef.current.start(
      (l) => setLevel(l),
      (r) => {
        setResult(r)
        setIsRunning(false)
      }
    )
  }

  return (
    <Card className="p-8 text-center">
      <h3 className="text-xl font-bold mb-4">Microphone Test</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Let's make sure your microphone is working properly before we start.
      </p>

      {!isRunning && !result && (
        <div className="space-y-4">
          <Button onClick={startTest} className="bg-green-600 hover:bg-green-700">
            <Mic className="w-4 h-4 mr-2" />
            Test Microphone
          </Button>
          <div>
            <Button variant="ghost" onClick={onSkip} className="text-gray-500">
              Skip test
            </Button>
          </div>
        </div>
      )}

      {isRunning && (
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="w-32 h-32 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <motion.div
                animate={{ scale: [1, 1 + level * 0.5, 1] }}
                transition={{ duration: 0.2 }}
                className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center"
              >
                <Mic className="w-10 h-10 text-white" />
              </motion.div>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Speak into your microphone...
          </p>
          <div className="flex justify-center">
            <AudioLevelIndicator level={level} isActive={level > 0.02} color="green" />
          </div>
        </div>
      )}

      {result && (
        <div className="space-y-4">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
            result.success ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
          }`}>
            {result.success ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <XCircle className="w-5 h-5" />
            )}
            {result.message}
          </div>
          <div className="flex justify-center gap-4">
            {result.success ? (
              <Button onClick={() => onComplete(result)} className="bg-green-600 hover:bg-green-700">
                Continue to Interview
              </Button>
            ) : (
              <>
                <Button onClick={startTest} variant="outline">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
                <Button onClick={() => onComplete(result)} variant="ghost">
                  Continue Anyway
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </Card>
  )
}

// Settings panel component
function SettingsPanel({
  voice,
  setVoice,
  interviewerStyle,
  setInterviewerStyle,
  showCaptions,
  setShowCaptions,
  enableRecording,
  setEnableRecording
}: {
  voice: string
  setVoice: (v: string) => void
  interviewerStyle: string
  setInterviewerStyle: (s: string) => void
  showCaptions: boolean
  setShowCaptions: (s: boolean) => void
  enableRecording: boolean
  setEnableRecording: (r: boolean) => void
}) {
  return (
    <Card className="p-4 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Settings className="w-5 h-5 text-gray-500" />
        <h3 className="font-semibold">Interview Settings</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Voice Selection */}
        <div className="space-y-2">
          <Label>Interviewer Voice</Label>
          <Select value={voice} onValueChange={setVoice}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {VOICE_OPTIONS.map(v => (
                <SelectItem key={v.id} value={v.id}>
                  <div>
                    <div className="font-medium">{v.name}</div>
                    <div className="text-xs text-gray-500">{v.description}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Interviewer Style */}
        <div className="space-y-2">
          <Label>Interview Style</Label>
          <Select value={interviewerStyle} onValueChange={setInterviewerStyle}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {INTERVIEWER_STYLES.map(s => (
                <SelectItem key={s.id} value={s.id}>
                  <div>
                    <div className="font-medium">{s.name}</div>
                    <div className="text-xs text-gray-500">{s.description}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Captions Toggle */}
        <div className="flex items-center justify-between">
          <Label className="flex items-center gap-2">
            <Subtitles className="w-4 h-4" />
            Show Captions
          </Label>
          <Switch checked={showCaptions} onCheckedChange={setShowCaptions} />
        </div>

        {/* Recording Toggle */}
        <div className="flex items-center justify-between">
          <Label className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Record Session
          </Label>
          <Switch checked={enableRecording} onCheckedChange={setEnableRecording} />
        </div>
      </div>
    </Card>
  )
}

export function LiveInterviewSession({
  domainId,
  domainName,
  level,
  onEnd
}: LiveInterviewSessionProps) {
  // Connection state
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('idle')
  const [interviewState, setInterviewState] = useState<InterviewState>('idle')
  const [error, setError] = useState<string | null>(null)
  const [statusMessage, setStatusMessage] = useState<string>('Preparing interview...')

  // Settings
  const [voice, setVoice] = useState('Puck')
  const [interviewerStyle, setInterviewerStyle] = useState('friendly')
  const [showCaptions, setShowCaptions] = useState(true)
  const [enableRecording, setEnableRecording] = useState(false)
  const [showSettings, setShowSettings] = useState(true)

  // Audio state
  const [isMicMuted, setIsMicMuted] = useState(false)
  const [isAudioSupported, setIsAudioSupported] = useState(true)
  const [audioSupportMessage, setAudioSupportMessage] = useState('')
  const [userAudioLevel, setUserAudioLevel] = useState(0)
  const [isUserSpeaking, setIsUserSpeaking] = useState(false)
  const [isAiSpeaking, setIsAiSpeaking] = useState(false)
  const [networkQuality, setNetworkQuality] = useState(1)
  const [isCalibrating, setIsCalibrating] = useState(false)

  // Transcript and progress
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([])
  const [currentCaption, setCurrentCaption] = useState('')
  const [questionCount, setQuestionCount] = useState(0)

  // Timer
  const [elapsedTime, setElapsedTime] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Refs
  const recorderRef = useRef<AudioRecorder | null>(null)
  const playerRef = useRef<AudioPlayer | null>(null)
  const clientRef = useRef<GeminiLiveClient | null>(null)
  const soundsRef = useRef<SoundEffects | null>(null)
  const isConnectedRef = useRef(false)
  const reconnectAttemptsRef = useRef(0)
  const maxReconnectAttempts = 3
  const isAiSpeakingRef = useRef(false) // Ref to track AI speaking state for audio callback
  const lastAiSpeakingTimeRef = useRef(0) // Track when AI stopped speaking for echo prevention

  // Check audio support on mount
  useEffect(() => {
    const support = checkAudioSupport()
    setIsAudioSupported(support.supported)
    setAudioSupportMessage(support.message)

    // Initialize sound effects
    soundsRef.current = new SoundEffects()
    soundsRef.current.init()

    return () => {
      cleanup()
    }
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (connectionStatus !== 'connected') return

      // M = toggle mute
      if (e.key === 'm' || e.key === 'M') {
        e.preventDefault()
        handleToggleMute()
      }

      // Escape = end interview
      if (e.key === 'Escape') {
        e.preventDefault()
        handleEndInterview()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [connectionStatus, isMicMuted])

  // Timer effect
  useEffect(() => {
    if (connectionStatus === 'connected') {
      timerRef.current = setInterval(() => {
        setElapsedTime(prev => prev + 1)
      }, 1000)
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [connectionStatus])

  // Network quality update
  useEffect(() => {
    if (connectionStatus !== 'connected') return

    const interval = setInterval(() => {
      if (playerRef.current) {
        setNetworkQuality(playerRef.current.getNetworkQuality())
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [connectionStatus])

  const cleanup = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    if (recorderRef.current) recorderRef.current.stop()
    if (playerRef.current) playerRef.current.stop()
    if (clientRef.current) clientRef.current.disconnect()
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Handle user speaking with audio ducking
  const handleUserSpeakingChange = useCallback((speaking: boolean) => {
    setIsUserSpeaking(speaking)

    if (speaking) {
      // Duck AI audio instead of interrupting
      if (isAiSpeaking && playerRef.current) {
        playerRef.current.duck()
      }
      setInterviewState('user_speaking')
      setStatusMessage('You\'re speaking...')
    } else {
      // Unduck AI audio
      if (playerRef.current?.getIsDucked()) {
        playerRef.current.unduck()
      }
      if (!isAiSpeaking) {
        setInterviewState('thinking')
        setStatusMessage('Processing...')
      }
    }
  }, [isAiSpeaking])

  // Sync isAiSpeaking state to ref
  useEffect(() => {
    isAiSpeakingRef.current = isAiSpeaking
    if (!isAiSpeaking) {
      // Track when AI stopped speaking for echo prevention
      lastAiSpeakingTimeRef.current = Date.now()
    }
  }, [isAiSpeaking])

  // Handle incoming audio
  const handleAudioReceived = useCallback((base64Audio: string) => {
    if (playerRef.current) {
      if (!isAiSpeaking) {
        setIsAiSpeaking(true)
        setInterviewState('ai_speaking')
        setStatusMessage('AI is responding...')
        soundsRef.current?.play('notification')
      }
      playerRef.current.addToQueue(base64Audio)

      // Add to recording if enabled
      if (enableRecording && recorderRef.current) {
        recorderRef.current.addAIAudioToRecording(base64Audio)
      }
    }
  }, [isAiSpeaking, enableRecording])

  // Handle text for captions
  const handleTextReceived = useCallback((text: string) => {
    setCurrentCaption(text)

    // Add to transcript
    setTranscript(prev => [...prev, {
      speaker: 'ai',
      text,
      timestamp: Date.now()
    }])

    // Count questions (rough heuristic)
    if (text.includes('?')) {
      setQuestionCount(prev => prev + 1)
    }
  }, [])

  // Handle silence detection
  const handleSilenceDetected = useCallback((duration: number) => {
    if (duration >= 15000 && clientRef.current?.isReady()) {
      // Send a gentle prompt to the AI
      clientRef.current.sendText('[User has been silent for a while. Offer gentle encouragement.]')
    }
  }, [])

  // Handle calibration complete
  const handleCalibrationComplete = useCallback((threshold: number) => {
    setIsCalibrating(false)
    setInterviewState('listening')
    setStatusMessage('Listening... speak naturally')
    console.log(`🎚️ Calibrated threshold: ${threshold}`)
  }, [])

  // Start recording with VAD
  const startContinuousRecording = useCallback(async () => {
    if (!recorderRef.current || !clientRef.current?.isReady()) return

    try {
      setIsCalibrating(true)
      setInterviewState('calibrating')
      setStatusMessage('Calibrating microphone...')

      const callbacks: AudioRecorderCallbacks = {
        onAudioData: (base64Audio) => {
          // Don't send audio while AI is speaking to prevent echo/feedback loops
          // Wait briefly after AI stops speaking to let any echo dissipate
          const timeSinceAiStopped = Date.now() - lastAiSpeakingTimeRef.current
          const echoCooldown = 150 // ms to wait after AI stops speaking

          if (isAiSpeakingRef.current) {
            // AI is speaking, don't send audio to prevent feedback
            return
          }

          if (timeSinceAiStopped < echoCooldown && lastAiSpeakingTimeRef.current > 0) {
            // Recently stopped speaking, skip to prevent echo
            return
          }

          if (clientRef.current?.isReady()) {
            clientRef.current.sendAudio(base64Audio)
          }
        },
        onVADChange: handleUserSpeakingChange,
        onAudioLevel: setUserAudioLevel,
        onCalibrationComplete: handleCalibrationComplete,
        onSilenceDetected: handleSilenceDetected
      }

      await recorderRef.current.start(callbacks, {
        calibrate: true,
        record: enableRecording
      })
    } catch (err) {
      console.error('Failed to start recording:', err)
      setError('Failed to access microphone')
    }
  }, [handleUserSpeakingChange, handleCalibrationComplete, handleSilenceDetected, enableRecording])

  // Connect to Gemini Live API
  const handleConnect = async () => {
    if (isConnectedRef.current) return

    setError(null)
    setShowSettings(false)
    setConnectionStatus('checking')
    setStatusMessage('Checking API status...')

    try {
      const status = await checkLiveApiStatus()
      if (!status.configured) {
        throw new Error(status.error || 'Live Interview is not configured')
      }

      setConnectionStatus('connecting')
      setStatusMessage('Connecting to AI interviewer...')

      const config: GeminiLiveConfig = await getConnectionDetails({
        domain: domainId,
        level: level,
        voiceName: voice,
        interviewerStyle: interviewerStyle
      })

      // Initialize audio components
      recorderRef.current = new AudioRecorder()
      playerRef.current = new AudioPlayer()

      // Set up AI audio recording callback
      if (enableRecording) {
        playerRef.current.setOnAudioChunk((base64) => {
          recorderRef.current?.addAIAudioToRecording(base64)
        })
      }

      clientRef.current = new GeminiLiveClient()

      await clientRef.current.connect(config, {
        onOpen: () => {
          console.log('WebSocket opened')
        },
        onSetupComplete: async () => {
          isConnectedRef.current = true
          reconnectAttemptsRef.current = 0
          setConnectionStatus('connected')
          setStatusMessage('Connected! AI will start the interview...')
          await playerRef.current?.resume()
          await soundsRef.current?.resume()
          soundsRef.current?.play('connect')

          // Send a trigger to get the AI to start the interview
          // Gemini Live API needs some input to begin responding
          setTimeout(() => {
            if (clientRef.current?.isReady()) {
              console.log('📤 Sending initial trigger to start interview')
              clientRef.current.sendText('Start the interview now.')
            }
          }, 200)

          setTimeout(() => {
            startContinuousRecording()
          }, 500)
        },
        onAudio: handleAudioReceived,
        onText: handleTextReceived,
        onTurnComplete: () => {
          console.log('✅ AI turn complete')
          // Mark turn complete so audio player can apply fade-out to last chunk
          playerRef.current?.markTurnComplete()
        },
        onInterrupted: () => {
          console.log('⚡ Gemini acknowledged interruption')
          setIsAiSpeaking(false)
          playerRef.current?.interrupt()
          setInterviewState('listening')
          setStatusMessage('Listening...')
        },
        onClose: (event) => {
          isConnectedRef.current = false

          // Attempt reconnection
          if (reconnectAttemptsRef.current < maxReconnectAttempts && !event.wasClean) {
            reconnectAttemptsRef.current++
            setConnectionStatus('reconnecting')
            setStatusMessage(`Reconnecting... (attempt ${reconnectAttemptsRef.current}/${maxReconnectAttempts})`)
            setTimeout(() => handleConnect(), 2000)
          } else {
            setConnectionStatus('idle')
            setInterviewState('idle')
            setIsAiSpeaking(false)
            setIsUserSpeaking(false)
            setStatusMessage(`Disconnected: ${event.reason || 'Connection closed'}`)
            soundsRef.current?.play('disconnect')
            recorderRef.current?.stop()
          }
        },
        onError: () => {
          setError('Connection error occurred')
          setConnectionStatus('error')
          soundsRef.current?.play('error')
        }
      })

      // Set up audio player callbacks
      if (playerRef.current) {
        playerRef.current.setOnPlaybackStart(() => {
          setIsAiSpeaking(true)
          setInterviewState('ai_speaking')
          setStatusMessage('AI is speaking...')
        })

        playerRef.current.setOnPlaybackEnd(() => {
          setIsAiSpeaking(false)
          setCurrentCaption('')
          if (clientRef.current?.isReady()) {
            setInterviewState('listening')
            setStatusMessage('Your turn - speak naturally')
          }
        })
      }

    } catch (err) {
      console.error('Connection error:', err)
      setError(err instanceof Error ? err.message : 'Failed to connect')
      setConnectionStatus('error')
      setStatusMessage('Connection failed')
      soundsRef.current?.play('error')
    }
  }

  // Handle mic test complete
  const handleMicTestComplete = (result: MicTestResult) => {
    setConnectionStatus('idle')
    if (result.success) {
      handleConnect()
    }
  }

  // Handle end interview
  const handleEndInterview = () => {
    if (connectionStatus !== 'connected') {
      onEnd()
      return
    }

    const confirmed = confirm('Are you sure you want to end this interview?')
    if (!confirmed) return

    // Generate summary
    const summary: InterviewSummary = {
      duration: elapsedTime,
      questionCount: questionCount,
      transcript: transcript
    }

    // Download recording if enabled
    if (enableRecording && recorderRef.current) {
      const chunks = recorderRef.current.getRecordedChunks()
      if (chunks.length > 0) {
        createAudioDownload(chunks, `interview-${Date.now()}`)
      }
    }

    cleanup()
    soundsRef.current?.play('disconnect')
    onEnd(summary)
  }

  // Toggle mute
  const handleToggleMute = () => {
    if (!recorderRef.current) return

    const newMutedState = !isMicMuted
    setIsMicMuted(newMutedState)
    recorderRef.current.setMuted(newMutedState)

    if (newMutedState) {
      setStatusMessage('Microphone muted')
      setUserAudioLevel(0)
      soundsRef.current?.play('mute')
    } else {
      setStatusMessage('Microphone unmuted - listening...')
      soundsRef.current?.play('unmute')
    }
  }

  // Start mic test
  const handleStartMicTest = () => {
    setConnectionStatus('mic_test')
  }

  // Get status color
  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'bg-green-500'
      case 'connecting':
      case 'checking':
      case 'reconnecting': return 'bg-yellow-500'
      case 'error': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getAvatarStyle = (isActive: boolean, color: 'green' | 'blue') => {
    if (!isActive) return 'bg-gray-200 dark:bg-slate-700'
    return color === 'green'
      ? 'bg-gradient-to-r from-green-500 to-emerald-600'
      : 'bg-gradient-to-r from-blue-500 to-indigo-600'
  }

  // Mic test screen
  if (connectionStatus === 'mic_test') {
    return (
      <div className="max-w-2xl mx-auto">
        <MicTestView
          onComplete={handleMicTestComplete}
          onSkip={() => {
            setConnectionStatus('idle')
            handleConnect()
          }}
        />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl">
                <Radio className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Live Interview
              </h2>
              <Badge className={`${getStatusColor()} text-white border-0`}>
                {connectionStatus === 'connected' ? 'Live' : connectionStatus}
              </Badge>
              {connectionStatus === 'connected' && (
                <NetworkQualityIndicator quality={networkQuality} />
              )}
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              {domainName} - {level} Level
              {questionCount > 0 && ` • ${questionCount} questions`}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Clock className="w-5 h-5" />
              <span className="font-mono text-lg">{formatTime(elapsedTime)}</span>
            </div>
            {connectionStatus === 'connected' && enableRecording && (
              <Badge variant="outline" className="border-red-500 text-red-500">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse" />
                Recording
              </Badge>
            )}
          </div>
        </div>
      </motion.div>

      {/* Settings Panel (before starting) */}
      {showSettings && connectionStatus === 'idle' && (
        <SettingsPanel
          voice={voice}
          setVoice={setVoice}
          interviewerStyle={interviewerStyle}
          setInterviewerStyle={setInterviewerStyle}
          showCaptions={showCaptions}
          setShowCaptions={setShowCaptions}
          enableRecording={enableRecording}
          setEnableRecording={setEnableRecording}
        />
      )}

      {/* Audio Support Warning */}
      {!isAudioSupported && (
        <Card className="p-4 mb-6 bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800">
          <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
            <AlertCircle className="w-5 h-5" />
            <span>{audioSupportMessage}</span>
          </div>
        </Card>
      )}

      {/* Error Display */}
      {error && (
        <Card className="p-4 mb-6 bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800">
          <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
            <Button variant="ghost" size="sm" onClick={() => setError(null)} className="ml-auto">
              Dismiss
            </Button>
          </div>
        </Card>
      )}

      {/* Main Interview Area */}
      <Card className="p-8 mb-6 bg-white dark:bg-slate-800/80 border-0 shadow-xl">
        {/* Status Message */}
        <div className="text-center mb-8">
          <AnimatePresence mode="wait">
            <motion.p
              key={statusMessage}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="text-lg text-gray-700 dark:text-gray-300"
            >
              {statusMessage}
            </motion.p>
          </AnimatePresence>

          {/* Calibration indicator */}
          {isCalibrating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 flex justify-center items-center gap-2 text-blue-600"
            >
              <Gauge className="w-4 h-4 animate-pulse" />
              <span className="text-sm">Calibrating ambient noise...</span>
            </motion.div>
          )}

          {/* Thinking indicator */}
          {interviewState === 'thinking' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 flex justify-center items-center gap-2 text-yellow-600"
            >
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">AI is thinking...</span>
            </motion.div>
          )}
        </div>

        {/* Visual Indicators */}
        <div className="flex justify-center gap-16 mb-8">
          {/* AI Avatar */}
          <div className="flex flex-col items-center gap-3">
            <motion.div
              animate={isAiSpeaking ? { scale: [1, 1.05, 1] } : {}}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className={`p-6 rounded-full transition-all duration-300 ${getAvatarStyle(isAiSpeaking, 'blue')}`}
            >
              <Bot className={`w-12 h-12 ${isAiSpeaking ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`} />
            </motion.div>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">AI Interviewer</span>
            <div className="h-8">
              {isAiSpeaking ? (
                <WaveformVisualizer isActive={true} color="blue" />
              ) : (
                <div className="flex items-center gap-1 text-gray-400">
                  <Volume2 className="w-4 h-4" />
                  <span className="text-xs">Ready</span>
                </div>
              )}
            </div>
          </div>

          {/* Connection indicator */}
          <div className="flex flex-col items-center justify-center">
            <motion.div
              animate={connectionStatus === 'connected' ? { opacity: [0.5, 1, 0.5] } : {}}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              {connectionStatus === 'connected' ? (
                <Wifi className="w-6 h-6 text-green-500" />
              ) : connectionStatus === 'reconnecting' ? (
                <RefreshCw className="w-6 h-6 text-yellow-500 animate-spin" />
              ) : (
                <WifiOff className="w-6 h-6 text-gray-400" />
              )}
            </motion.div>
            <span className="text-xs text-gray-500 mt-1">
              {connectionStatus === 'connected' ? 'Live' : connectionStatus === 'reconnecting' ? 'Reconnecting...' : 'Offline'}
            </span>
          </div>

          {/* User Avatar */}
          <div className="flex flex-col items-center gap-3">
            <motion.div
              animate={isUserSpeaking && !isMicMuted ? { scale: [1, 1.05, 1] } : {}}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className={`p-6 rounded-full transition-all duration-300 ${
                isMicMuted ? 'bg-red-100 dark:bg-red-900/30' : getAvatarStyle(isUserSpeaking, 'green')
              }`}
            >
              {isMicMuted ? (
                <MicOff className="w-12 h-12 text-red-500" />
              ) : (
                <Mic className={`w-12 h-12 ${isUserSpeaking ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`} />
              )}
            </motion.div>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">You</span>
            <div className="h-8">
              {!isMicMuted && connectionStatus === 'connected' ? (
                <AudioLevelIndicator level={userAudioLevel} isActive={isUserSpeaking} color="green" />
              ) : isMicMuted ? (
                <div className="flex items-center gap-1 text-red-500">
                  <VolumeX className="w-4 h-4" />
                  <span className="text-xs">Muted</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-gray-400">
                  <Mic className="w-4 h-4" />
                  <span className="text-xs">Ready</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Live Captions */}
        {showCaptions && currentCaption && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-gray-100 dark:bg-slate-700 rounded-lg"
          >
            <div className="flex items-start gap-2">
              <MessageSquare className="w-4 h-4 mt-1 text-blue-500 flex-shrink-0" />
              <p className="text-gray-700 dark:text-gray-300 italic">{currentCaption}</p>
            </div>
          </motion.div>
        )}

        {/* Controls */}
        <div className="flex justify-center gap-4">
          {connectionStatus === 'idle' ? (
            <div className="flex gap-4">
              <Button
                onClick={handleStartMicTest}
                disabled={!isAudioSupported}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg"
              >
                <Radio className="w-5 h-5 mr-2" />
                Start Interview
              </Button>
            </div>
          ) : connectionStatus === 'checking' || connectionStatus === 'connecting' || connectionStatus === 'reconnecting' ? (
            <Button disabled className="px-8 py-6 text-lg">
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              {connectionStatus === 'reconnecting' ? 'Reconnecting...' : 'Connecting...'}
            </Button>
          ) : connectionStatus === 'connected' ? (
            <>
              <Button
                onClick={handleToggleMute}
                className={isMicMuted ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-gray-600 hover:bg-gray-700 text-white'}
                title="Press M to toggle"
              >
                {isMicMuted ? (
                  <>
                    <MicOff className="w-4 h-4 mr-2" />
                    Unmute (M)
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4 mr-2" />
                    Mute (M)
                  </>
                )}
              </Button>

              <Button
                onClick={handleEndInterview}
                variant="outline"
                className="border-red-500 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                title="Press Esc to end"
              >
                <PhoneOff className="w-4 h-4 mr-2" />
                End (Esc)
              </Button>

              {enableRecording && (
                <Button
                  onClick={() => {
                    if (recorderRef.current) {
                      const chunks = recorderRef.current.getRecordedChunks()
                      if (chunks.length > 0) {
                        createAudioDownload(chunks, `interview-${Date.now()}`)
                      }
                    }
                  }}
                  variant="outline"
                  className="border-gray-500"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              )}
            </>
          ) : connectionStatus === 'error' ? (
            <Button onClick={handleConnect} className="bg-green-600 hover:bg-green-700 text-white">
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry Connection
            </Button>
          ) : null}
        </div>
      </Card>

      {/* Tips */}
      <Card className="p-6 bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
        <h3 className="text-sm font-semibold text-green-800 dark:text-green-300 mb-3">Tips for a Natural Interview</h3>
        <ul className="space-y-2 text-sm text-green-700 dark:text-green-400">
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
            Speak naturally - the AI automatically detects when you start and stop
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
            You can interrupt anytime - just start speaking (AI volume will lower)
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
            Use headphones for the best experience (prevents echo)
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
            Keyboard shortcuts: <kbd className="px-1.5 py-0.5 bg-green-200 dark:bg-green-800 rounded text-xs">M</kbd> = Mute, <kbd className="px-1.5 py-0.5 bg-green-200 dark:bg-green-800 rounded text-xs">Esc</kbd> = End
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
            Session limit: 15 minutes
          </li>
        </ul>
      </Card>
    </div>
  )
}

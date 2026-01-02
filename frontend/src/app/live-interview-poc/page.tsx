'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  Volume2,
  VolumeX,
  AlertCircle,
  CheckCircle,
  Loader2,
  Radio
} from 'lucide-react'
import { AudioRecorder, AudioPlayer, checkAudioSupport } from '@/lib/audioUtils'
import {
  GeminiLiveClient,
  getConnectionDetails,
  checkLiveApiStatus,
  GeminiLiveConfig
} from '@/lib/geminiLiveClient'

type ConnectionStatus = 'idle' | 'checking' | 'connecting' | 'connected' | 'error'
type InterviewState = 'idle' | 'listening' | 'processing' | 'speaking'

export default function LiveInterviewPOC() {
  // Connection state
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('idle')
  const [interviewState, setInterviewState] = useState<InterviewState>('idle')
  const [error, setError] = useState<string | null>(null)
  const [statusMessage, setStatusMessage] = useState<string>('Ready to start')

  // Audio state
  const [isMicEnabled, setIsMicEnabled] = useState(false)
  const [isAudioSupported, setIsAudioSupported] = useState(true)
  const [audioSupportMessage, setAudioSupportMessage] = useState('')

  // Transcript
  const [transcript, setTranscript] = useState<Array<{ role: 'user' | 'ai'; text: string }>>([])

  // Refs for audio and WebSocket
  const recorderRef = useRef<AudioRecorder | null>(null)
  const playerRef = useRef<AudioPlayer | null>(null)
  const clientRef = useRef<GeminiLiveClient | null>(null)

  // Check audio support on mount
  useEffect(() => {
    const support = checkAudioSupport()
    setIsAudioSupported(support.supported)
    setAudioSupportMessage(support.message)

    // Initialize audio components
    recorderRef.current = new AudioRecorder()
    playerRef.current = new AudioPlayer()

    return () => {
      // Cleanup
      if (recorderRef.current) {
        recorderRef.current.stop()
      }
      if (playerRef.current) {
        playerRef.current.stop()
      }
      if (clientRef.current) {
        clientRef.current.disconnect()
      }
    }
  }, [])

  // Handle incoming audio from Gemini
  const handleAudioReceived = useCallback((base64Audio: string) => {
    if (playerRef.current) {
      setInterviewState('speaking')
      setStatusMessage('AI is speaking...')
      playerRef.current.addToQueue(base64Audio)
    }
  }, [])

  // Handle text transcription from Gemini (if available)
  const handleTextReceived = useCallback((text: string) => {
    setTranscript(prev => {
      const last = prev[prev.length - 1]
      if (last && last.role === 'ai') {
        // Append to existing AI message
        return [...prev.slice(0, -1), { role: 'ai', text: last.text + text }]
      }
      return [...prev, { role: 'ai', text }]
    })
  }, [])

  // Handle turn complete - AI finished speaking, start listening again
  const handleTurnComplete = useCallback(() => {
    setInterviewState('listening')
    setStatusMessage('Listening... speak naturally')
  }, [])

  // Start continuous recording (called after setup complete)
  const startContinuousRecording = useCallback(async () => {
    if (!recorderRef.current || !clientRef.current?.isReady()) return

    try {
      await recorderRef.current.start((base64Audio) => {
        // Only send audio when connected and ready
        if (clientRef.current?.isReady()) {
          clientRef.current.sendAudio(base64Audio)
        }
      })
      setIsMicEnabled(true)
      setInterviewState('listening')
      setStatusMessage('Listening... speak naturally')
      console.log('🎤 Continuous recording started')
    } catch (err) {
      console.error('Failed to start recording:', err)
      setError('Failed to access microphone')
    }
  }, [])

  // Connect to Gemini Live API
  const handleConnect = async () => {
    setError(null)
    setConnectionStatus('checking')
    setStatusMessage('Checking API status...')

    try {
      // Check if API is configured
      const status = await checkLiveApiStatus()
      if (!status.configured) {
        throw new Error(status.error || 'Gemini Live API is not configured on the backend')
      }

      setConnectionStatus('connecting')
      setStatusMessage('Getting connection details...')

      // Get connection details
      const config: GeminiLiveConfig = await getConnectionDetails({
        domain: 'software-engineering',
        level: 'Junior',
        voiceName: 'Puck' // Upbeat, friendly voice
      })

      setStatusMessage('Connecting to Gemini Live...')

      // Initialize client
      clientRef.current = new GeminiLiveClient()

      // Connect with callbacks
      await clientRef.current.connect(config, {
        onOpen: () => {
          console.log('WebSocket opened')
        },
        onSetupComplete: async () => {
          setConnectionStatus('connected')
          setStatusMessage('Connected! Starting interview...')

          // Resume audio context (required for some browsers)
          await playerRef.current?.resume()

          // Start continuous recording immediately after setup
          // Small delay to ensure everything is ready
          setTimeout(() => {
            startContinuousRecording()
          }, 500)
        },
        onAudio: handleAudioReceived,
        onText: handleTextReceived,
        onTurnComplete: handleTurnComplete,
        onInterrupted: () => {
          // User interrupted AI - this is fine, keep listening
          setInterviewState('listening')
          setStatusMessage('Listening...')
        },
        onClose: (event) => {
          setConnectionStatus('idle')
          setInterviewState('idle')
          setStatusMessage(`Disconnected: ${event.reason || 'Connection closed'}`)
          setIsMicEnabled(false)
          recorderRef.current?.stop()
        },
        onError: (error) => {
          setError('WebSocket error occurred')
          setConnectionStatus('error')
        }
      })

      // Set up audio player callback - when AI finishes speaking
      if (playerRef.current) {
        playerRef.current.setOnPlaybackEnd(() => {
          if (clientRef.current?.isReady()) {
            setInterviewState('listening')
            setStatusMessage('Listening... speak naturally')
          }
        })
      }

    } catch (err) {
      console.error('Connection error:', err)
      setError(err instanceof Error ? err.message : 'Failed to connect')
      setConnectionStatus('error')
      setStatusMessage('Connection failed')
    }
  }

  // Disconnect
  const handleDisconnect = () => {
    if (recorderRef.current) {
      recorderRef.current.stop()
    }
    if (playerRef.current) {
      playerRef.current.stop()
    }
    if (clientRef.current) {
      clientRef.current.disconnect()
    }

    setConnectionStatus('idle')
    setInterviewState('idle')
    setIsMicEnabled(false)
    setStatusMessage('Disconnected')
    setTranscript([])
  }

  // Toggle mute (for manual control if needed)
  const handleToggleMute = async () => {
    if (!clientRef.current?.isReady()) {
      setError('Not connected to Gemini')
      return
    }

    if (isMicEnabled) {
      // Mute - stop recording
      recorderRef.current?.stop()
      setIsMicEnabled(false)
      setStatusMessage('Microphone muted')
    } else {
      // Unmute - start recording again
      await startContinuousRecording()
    }
  }

  // Get status color
  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'bg-green-500'
      case 'connecting':
      case 'checking': return 'bg-yellow-500'
      case 'error': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  // Get interview state indicator
  const getStateIndicator = () => {
    switch (interviewState) {
      case 'listening':
        return (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="flex items-center gap-2 text-green-500"
          >
            <Mic className="w-5 h-5" />
            <span>Listening</span>
          </motion.div>
        )
      case 'processing':
        return (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            className="flex items-center gap-2 text-yellow-500"
          >
            <Loader2 className="w-5 h-5" />
            <span>Processing</span>
          </motion.div>
        )
      case 'speaking':
        return (
          <motion.div
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ repeat: Infinity, duration: 0.5 }}
            className="flex items-center gap-2 text-blue-500"
          >
            <Volume2 className="w-5 h-5" />
            <span>AI Speaking</span>
          </motion.div>
        )
      default:
        return (
          <div className="flex items-center gap-2 text-gray-500">
            <Radio className="w-5 h-5" />
            <span>Idle</span>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            Live Interview POC
          </h1>
          <p className="text-gray-400">
            Test Gemini Live API - Real-time voice conversation
          </p>
          <Badge className="mt-4 bg-yellow-500/20 text-yellow-400 border-yellow-500/50">
            Proof of Concept
          </Badge>
        </motion.div>

        {/* Audio Support Warning */}
        {!isAudioSupported && (
          <Card className="p-4 mb-6 bg-red-500/20 border-red-500/50">
            <div className="flex items-center gap-3 text-red-400">
              <AlertCircle className="w-5 h-5" />
              <span>{audioSupportMessage}</span>
            </div>
          </Card>
        )}

        {/* Error Display */}
        {error && (
          <Card className="p-4 mb-6 bg-red-500/20 border-red-500/50">
            <div className="flex items-center gap-3 text-red-400">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setError(null)}
                className="ml-auto text-red-400 hover:text-red-300"
              >
                Dismiss
              </Button>
            </div>
          </Card>
        )}

        {/* Status Card */}
        <Card className="p-6 mb-6 bg-slate-800/50 border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${getStatusColor()}`} />
              <span className="text-white font-medium">
                {connectionStatus === 'idle' && 'Not Connected'}
                {connectionStatus === 'checking' && 'Checking API...'}
                {connectionStatus === 'connecting' && 'Connecting...'}
                {connectionStatus === 'connected' && 'Connected'}
                {connectionStatus === 'error' && 'Error'}
              </span>
            </div>
            {getStateIndicator()}
          </div>

          <p className="text-gray-400 text-sm mb-4">{statusMessage}</p>

          {/* Connection Controls */}
          <div className="flex gap-4">
            {connectionStatus !== 'connected' ? (
              <Button
                onClick={handleConnect}
                disabled={connectionStatus === 'connecting' || connectionStatus === 'checking' || !isAudioSupported}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg"
              >
                {connectionStatus === 'connecting' || connectionStatus === 'checking' ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Phone className="w-5 h-5 mr-2" />
                    Start Interview
                  </>
                )}
              </Button>
            ) : (
              <>
                <Button
                  onClick={handleToggleMute}
                  className={isMicEnabled
                    ? 'bg-gray-600 hover:bg-gray-700 text-white'
                    : 'bg-yellow-600 hover:bg-yellow-700 text-white'
                  }
                >
                  {isMicEnabled ? (
                    <>
                      <VolumeX className="w-4 h-4 mr-2" />
                      Mute Mic
                    </>
                  ) : (
                    <>
                      <Mic className="w-4 h-4 mr-2" />
                      Unmute Mic
                    </>
                  )}
                </Button>

                <Button
                  onClick={handleDisconnect}
                  variant="outline"
                  className="border-red-500 text-red-400 hover:bg-red-500/20"
                >
                  <PhoneOff className="w-4 h-4 mr-2" />
                  End Interview
                </Button>
              </>
            )}
          </div>
        </Card>

        {/* Audio Visualization */}
        {connectionStatus === 'connected' && (
          <Card className="p-6 mb-6 bg-slate-800/50 border-slate-700">
            <h3 className="text-white font-medium mb-4">Audio Status</h3>
            <div className="flex justify-center gap-8">
              {/* Microphone Status */}
              <div className="flex flex-col items-center gap-2">
                <motion.div
                  animate={isMicEnabled ? {
                    scale: [1, 1.2, 1],
                    boxShadow: ['0 0 0 0 rgba(34, 197, 94, 0.4)', '0 0 0 20px rgba(34, 197, 94, 0)', '0 0 0 0 rgba(34, 197, 94, 0)']
                  } : {}}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className={`p-4 rounded-full ${isMicEnabled ? 'bg-green-500' : 'bg-gray-600'}`}
                >
                  {isMicEnabled ? <Mic className="w-8 h-8 text-white" /> : <MicOff className="w-8 h-8 text-gray-400" />}
                </motion.div>
                <span className="text-sm text-gray-400">Microphone</span>
              </div>

              {/* Speaker Status */}
              <div className="flex flex-col items-center gap-2">
                <motion.div
                  animate={interviewState === 'speaking' ? {
                    scale: [1, 1.1, 1],
                  } : {}}
                  transition={{ repeat: Infinity, duration: 0.3 }}
                  className={`p-4 rounded-full ${interviewState === 'speaking' ? 'bg-blue-500' : 'bg-gray-600'}`}
                >
                  {interviewState === 'speaking' ? <Volume2 className="w-8 h-8 text-white" /> : <VolumeX className="w-8 h-8 text-gray-400" />}
                </motion.div>
                <span className="text-sm text-gray-400">Speaker</span>
              </div>
            </div>
          </Card>
        )}

        {/* Transcript (if available) */}
        {transcript.length > 0 && (
          <Card className="p-6 bg-slate-800/50 border-slate-700">
            <h3 className="text-white font-medium mb-4">Transcript</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {transcript.map((entry, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg ${
                    entry.role === 'ai'
                      ? 'bg-blue-500/20 text-blue-100'
                      : 'bg-green-500/20 text-green-100'
                  }`}
                >
                  <span className="text-xs font-medium uppercase opacity-70">
                    {entry.role === 'ai' ? 'AI Interviewer' : 'You'}
                  </span>
                  <p className="mt-1">{entry.text}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Instructions */}
        <Card className="p-6 mt-6 bg-slate-800/50 border-slate-700">
          <h3 className="text-white font-medium mb-3">How to Use</h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-400 text-sm">
            <li>Click "Start Interview" to connect and begin</li>
            <li>The AI will introduce itself and ask questions</li>
            <li>Just speak naturally - VAD automatically detects when you talk</li>
            <li>The AI will respond when you pause</li>
            <li>Use "Mute Mic" if you need to pause</li>
            <li>Click "End Interview" when done</li>
          </ol>

          <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
            <p className="text-green-400 text-sm">
              <strong>Automatic Mode:</strong> Voice Activity Detection (VAD) handles turn-taking automatically.
              Just speak naturally like a real conversation!
            </p>
          </div>

          <div className="mt-3 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <p className="text-yellow-400 text-sm">
              <strong>Tip:</strong> Use headphones to prevent echo. Session limit is 15 minutes.
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}

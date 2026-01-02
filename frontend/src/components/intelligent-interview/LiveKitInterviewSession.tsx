'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/components/auth-provider'
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
  Settings,
  Wifi,
  WifiOff,
  MessageSquare,
  Subtitles,
  User
} from 'lucide-react'

// LiveKit imports
import {
  LiveKitRoom,
  useVoiceAssistant,
  BarVisualizer,
  RoomAudioRenderer,
  VoiceAssistantControlBar,
  useConnectionState,
  useLocalParticipant,
  useTracks,
  useIsSpeaking,
} from '@livekit/components-react'
import '@livekit/components-styles'
import { ConnectionState, Track } from 'livekit-client'

interface LiveKitInterviewSessionProps {
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

// Animated sound wave component
function SoundWave({ isActive, color = 'bg-current' }: { isActive: boolean; color?: string }) {
  return (
    <div className="flex items-center justify-center gap-[3px] h-8">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className={`w-1 rounded-full ${color}`}
          animate={isActive ? {
            height: [8, 24, 12, 28, 8],
          } : { height: 8 }}
          transition={{
            duration: 0.8,
            repeat: isActive ? Infinity : 0,
            delay: i * 0.1,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  )
}

// Pulsing ring animation
function PulsingRings({ isActive, color }: { isActive: boolean; color: string }) {
  if (!isActive) return null
  return (
    <>
      <motion.div
        className={`absolute inset-0 rounded-full ${color} opacity-20`}
        animate={{ scale: [1, 1.4, 1.4], opacity: [0.3, 0, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
      />
      <motion.div
        className={`absolute inset-0 rounded-full ${color} opacity-20`}
        animate={{ scale: [1, 1.3, 1.3], opacity: [0.3, 0, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
      />
    </>
  )
}

// Voice assistant visualization component
function VoiceAssistantView({ showCaptions }: { showCaptions: boolean }) {
  const { state, audioTrack, agentTranscriptions } = useVoiceAssistant()
  const { localParticipant } = useLocalParticipant()
  const lastTranscription = agentTranscriptions?.[agentTranscriptions.length - 1]

  // Detect actual voice activity using audio levels
  const isLocalSpeaking = useIsSpeaking(localParticipant)

  // Track AI audio activity - check if audio track exists and state is speaking
  const isAiSpeaking = state === 'speaking' && audioTrack !== undefined

  const getStateMessage = () => {
    // Show more accurate status based on actual voice detection
    if (isAiSpeaking) {
      return { text: 'AI is speaking...', icon: '🎙️' }
    }
    if (isLocalSpeaking) {
      return { text: 'Listening to you...', icon: '🎤' }
    }
    switch (state) {
      case 'connecting':
        return { text: 'Connecting to interviewer...', icon: '🔄' }
      case 'initializing':
        return { text: 'Initializing AI interviewer...', icon: '⚡' }
      case 'listening':
        return { text: 'Your turn to speak...', icon: '👂' }
      case 'thinking':
        return { text: 'AI is thinking...', icon: '🤔' }
      case 'speaking':
        return { text: 'AI is responding...', icon: '🎙️' }
      default:
        return { text: 'Ready to begin', icon: '✨' }
    }
  }

  const stateInfo = getStateMessage()
  // Use actual voice detection for animations
  const isAiActive = isAiSpeaking
  const isUserActive = isLocalSpeaking

  return (
    <div className="space-y-6">
      {/* Status Badge */}
      <div className="flex justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={state}
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium shadow-lg ${
              isAiActive
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                : isUserActive
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                  : 'bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-slate-600'
            }`}
          >
            <span className="text-base">{stateInfo.icon}</span>
            <span>{stateInfo.text}</span>
            {(isAiActive || isUserActive) && (
              <motion.span
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-2 h-2 bg-white rounded-full"
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Main Visual Area */}
      <div className="relative py-8">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-50/30 dark:via-blue-950/20 to-transparent rounded-3xl" />

        {/* Avatars Container */}
        <div className="relative flex justify-center items-center gap-8 md:gap-16">
          {/* AI Interviewer */}
          <div className="flex flex-col items-center">
            <div className="relative">
              {/* Pulsing rings */}
              <PulsingRings isActive={isAiActive} color="bg-blue-500" />

              {/* Glow effect */}
              {isAiActive && (
                <div className="absolute inset-0 rounded-full bg-blue-500 blur-xl opacity-30 scale-110" />
              )}

              {/* Avatar */}
              <motion.div
                animate={isAiActive ? {
                  scale: [1, 1.02, 1],
                  rotate: [0, 1, -1, 0]
                } : {}}
                transition={{ repeat: Infinity, duration: 2 }}
                className={`relative w-24 h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 ${
                  isAiActive
                    ? 'bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600'
                    : 'bg-gradient-to-br from-gray-200 to-gray-300 dark:from-slate-600 dark:to-slate-700'
                }`}
              >
                <Bot className={`w-10 h-10 md:w-12 md:h-12 ${
                  isAiActive ? 'text-white' : 'text-gray-500 dark:text-gray-400'
                }`} />

                {/* Status indicator dot */}
                <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white dark:border-slate-800 ${
                  isAiActive ? 'bg-blue-500' : 'bg-gray-400'
                }`}>
                  {isAiActive && (
                    <motion.div
                      className="w-full h-full rounded-full bg-blue-400"
                      animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  )}
                </div>
              </motion.div>
            </div>

            {/* Label */}
            <span className="mt-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
              AI Interviewer
            </span>

            {/* Voice Indicator */}
            <div className="mt-2 h-10 flex items-center">
              {isAiActive ? (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/40 rounded-full">
                  <Volume2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <SoundWave isActive={isAiActive} color="bg-blue-500" />
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Ready</span>
                </div>
              )}
            </div>
          </div>

          {/* Connection Line with pulse */}
          <div className="hidden md:flex flex-col items-center gap-2">
            <div className="relative">
              <motion.div
                className="w-20 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 rounded-full"
                animate={isAiActive || isUserActive ? { opacity: [0.5, 1, 0.5] } : { opacity: 0.3 }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              {(isAiActive || isUserActive) && (
                <motion.div
                  className="absolute top-0 left-0 w-4 h-0.5 bg-white rounded-full"
                  animate={{ x: [0, 64, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
              )}
            </div>
            <div className="flex items-center gap-1.5">
              <Wifi className={`w-4 h-4 ${
                state !== 'disconnected' ? 'text-green-500' : 'text-gray-400'
              }`} />
              <span className="text-xs font-medium text-gray-500">
                {state !== 'disconnected' ? 'Connected' : 'Offline'}
              </span>
            </div>
          </div>

          {/* User */}
          <div className="flex flex-col items-center">
            <div className="relative">
              {/* Pulsing rings */}
              <PulsingRings isActive={isUserActive} color="bg-green-500" />

              {/* Glow effect */}
              {isUserActive && (
                <div className="absolute inset-0 rounded-full bg-green-500 blur-xl opacity-30 scale-110" />
              )}

              {/* Avatar */}
              <motion.div
                animate={isUserActive ? {
                  scale: [1, 1.02, 1],
                } : {}}
                transition={{ repeat: Infinity, duration: 0.6 }}
                className={`relative w-24 h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 ${
                  isUserActive
                    ? 'bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600'
                    : isAiActive
                      ? 'bg-gradient-to-br from-orange-200 to-orange-300 dark:from-orange-900/50 dark:to-orange-800/50'
                      : 'bg-gradient-to-br from-gray-200 to-gray-300 dark:from-slate-600 dark:to-slate-700'
                }`}
              >
                <User className={`w-10 h-10 md:w-12 md:h-12 ${
                  isUserActive
                    ? 'text-white'
                    : isAiActive
                      ? 'text-orange-600 dark:text-orange-400'
                      : 'text-gray-500 dark:text-gray-400'
                }`} />

                {/* Mute indicator when AI speaking */}
                {isAiActive && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-orange-500 border-2 border-white dark:border-slate-800 flex items-center justify-center"
                  >
                    <MicOff className="w-3 h-3 text-white" />
                  </motion.div>
                )}

                {/* Active indicator */}
                {isUserActive && (
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white dark:border-slate-800 bg-green-500">
                    <motion.div
                      className="w-full h-full rounded-full bg-green-400"
                      animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  </div>
                )}
              </motion.div>
            </div>

            {/* Label */}
            <span className="mt-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
              You
            </span>

            {/* Voice Indicator */}
            <div className="mt-2 h-10 flex items-center">
              {isUserActive ? (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 dark:bg-green-900/40 rounded-full">
                  <Mic className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <SoundWave isActive={isUserActive} color="bg-green-500" />
                </div>
              ) : isAiActive ? (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-100 dark:bg-orange-900/30 rounded-full text-orange-600 dark:text-orange-400 text-xs font-medium">
                  <MicOff className="w-3.5 h-3.5" />
                  <span>Auto-muted</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                  <Mic className="w-3.5 h-3.5" />
                  <span>Ready</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Audio Visualizer from LiveKit */}
      {audioTrack && isAiActive && (
        <div className="flex justify-center">
          <div className="h-12 w-48 opacity-70">
            <BarVisualizer
              state={state}
              barCount={12}
              trackRef={audioTrack}
              className="h-full"
            />
          </div>
        </div>
      )}

      {/* Live Captions */}
      {showCaptions && lastTranscription && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-2xl p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-700/50 dark:to-slate-600/50 rounded-xl border border-blue-100 dark:border-slate-600"
        >
          <div className="flex items-start gap-3">
            <div className="p-1.5 bg-blue-500 rounded-lg flex-shrink-0">
              <MessageSquare className="w-3.5 h-3.5 text-white" />
            </div>
            <div>
              <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">AI Interviewer</p>
              <p className="text-gray-700 dark:text-gray-200 text-sm leading-relaxed">
                {lastTranscription.text}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

// Auto-mute controller to prevent echo when using speakers
function AutoMuteController({
  isMuted,
  setIsMuted,
  wasManuallyMuted,
  setWasManuallyMuted,
}: {
  isMuted: boolean
  setIsMuted: (m: boolean) => void
  wasManuallyMuted: React.MutableRefObject<boolean>
  setWasManuallyMuted: (m: boolean) => void
}) {
  const { state, audioTrack } = useVoiceAssistant()
  const { localParticipant } = useLocalParticipant()

  // Check if AI is actually speaking (state is speaking AND audio track exists)
  const isAiSpeaking = state === 'speaking' && audioTrack !== undefined
  const previousSpeakingState = useRef(false)

  useEffect(() => {
    if (!localParticipant) return

    // AI started speaking - mute user to prevent echo
    if (isAiSpeaking && !previousSpeakingState.current) {
      // Remember if user was manually muted before AI started
      wasManuallyMuted.current = isMuted

      if (!isMuted) {
        localParticipant.setMicrophoneEnabled(false)
        setIsMuted(true)
        console.log('🔇 Auto-muted: AI is speaking')
      }
    }

    // AI stopped speaking - restore user's microphone if they weren't manually muted
    if (!isAiSpeaking && previousSpeakingState.current) {
      if (!wasManuallyMuted.current) {
        localParticipant.setMicrophoneEnabled(true)
        setIsMuted(false)
        console.log('🔊 Auto-unmuted: AI stopped speaking')
      }
    }

    previousSpeakingState.current = isAiSpeaking
  }, [isAiSpeaking, localParticipant, isMuted, setIsMuted, wasManuallyMuted])

  return null // This is a controller component, no UI
}

// Interview room component
function InterviewRoom({
  domainName,
  level,
  showCaptions,
  elapsedTime,
  onEnd
}: {
  domainName: string
  level: string
  showCaptions: boolean
  elapsedTime: number
  onEnd: () => void
}) {
  const connectionState = useConnectionState()
  const { localParticipant, isMicrophoneEnabled } = useLocalParticipant()
  const [isMuted, setIsMuted] = useState(false)
  const wasManuallyMutedRef = useRef(false)

  // Sync mute state with actual microphone state
  useEffect(() => {
    if (isMicrophoneEnabled !== undefined) {
      setIsMuted(!isMicrophoneEnabled)
    }
  }, [isMicrophoneEnabled])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleToggleMute = async () => {
    if (localParticipant) {
      try {
        const newMutedState = !isMuted
        await localParticipant.setMicrophoneEnabled(!newMutedState)
        setIsMuted(newMutedState)
        // Track manual mute state
        wasManuallyMutedRef.current = newMutedState
        console.log(`🎤 Microphone ${newMutedState ? 'muted' : 'unmuted'}`)
      } catch (error) {
        console.error('Failed to toggle microphone:', error)
      }
    }
  }

  const handleEndInterview = () => {
    const confirmed = confirm('Are you sure you want to end this interview?')
    if (confirmed) {
      onEnd()
    }
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }
      if (e.key === 'm' || e.key === 'M') {
        e.preventDefault()
        handleToggleMute()
      }
      if (e.key === 'Escape') {
        e.preventDefault()
        handleEndInterview()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isMuted, localParticipant])

  const getConnectionBadge = () => {
    switch (connectionState) {
      case ConnectionState.Connected:
        return <Badge className="bg-green-500 text-white border-0">Live</Badge>
      case ConnectionState.Connecting:
        return <Badge className="bg-yellow-500 text-white border-0">Connecting</Badge>
      case ConnectionState.Reconnecting:
        return <Badge className="bg-yellow-500 text-white border-0">Reconnecting</Badge>
      default:
        return <Badge className="bg-gray-500 text-white border-0">Offline</Badge>
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <Card className="p-4 bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-teal-500/10 dark:from-green-900/30 dark:via-emerald-900/30 dark:to-teal-900/30 border-green-200 dark:border-green-800/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg">
                  <Radio className="w-6 h-6 text-white" />
                </div>
                {/* Live pulse */}
                <motion.div
                  className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
                  animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    Live Interview
                  </h2>
                  {getConnectionBadge()}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                  {domainName} • {level}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-slate-800/80 rounded-xl shadow-sm">
                <Clock className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span className="font-mono text-lg font-semibold text-gray-800 dark:text-gray-200">
                  {formatTime(elapsedTime)}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Main Interview Area */}
      <Card className="p-6 md:p-8 mb-6 bg-white dark:bg-slate-800/90 border-0 shadow-2xl rounded-2xl overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-green-50/50 dark:from-blue-950/20 dark:to-green-950/20 pointer-events-none" />

        <div className="relative">
          <VoiceAssistantView showCaptions={showCaptions} />

          {/* Controls */}
          <div className="flex justify-center gap-3 mt-8 pt-6 border-t border-gray-100 dark:border-slate-700">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={handleToggleMute}
                size="lg"
                className={`relative px-6 py-3 rounded-xl font-medium shadow-lg transition-all duration-200 ${
                  isMuted
                    ? 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white'
                    : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white'
                }`}
                title={`Press M to ${isMuted ? 'unmute' : 'mute'}`}
              >
                {/* Mic status indicator */}
                {!isMuted && (
                  <motion.div
                    className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
                {isMuted ? (
                  <>
                    <MicOff className="w-5 h-5 mr-2" />
                    Unmute
                  </>
                ) : (
                  <>
                    <Mic className="w-5 h-5 mr-2" />
                    Mute
                  </>
                )}
                <kbd className="ml-2 px-1.5 py-0.5 bg-white/20 rounded text-xs">M</kbd>
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={handleEndInterview}
                size="lg"
                variant="outline"
                className="px-6 py-3 rounded-xl font-medium border-2 border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 shadow-lg"
                title="Press Esc to end"
              >
                <PhoneOff className="w-5 h-5 mr-2" />
                End Interview
                <kbd className="ml-2 px-1.5 py-0.5 bg-red-100 dark:bg-red-900/50 rounded text-xs">Esc</kbd>
              </Button>
            </motion.div>
          </div>
        </div>
      </Card>

      {/* Audio renderer - required for hearing the agent */}
      <RoomAudioRenderer />

      {/* Auto-mute controller - prevents echo when using speakers */}
      <AutoMuteController
        isMuted={isMuted}
        setIsMuted={setIsMuted}
        wasManuallyMuted={wasManuallyMutedRef}
        setWasManuallyMuted={(m) => { wasManuallyMutedRef.current = m }}
      />

      {/* Tips - Collapsible */}
      <Card className="p-5 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 border-emerald-200 dark:border-emerald-800/50 rounded-xl">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-green-500 rounded-lg flex-shrink-0">
            <Subtitles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-green-800 dark:text-green-300 mb-2">Quick Tips</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-green-700 dark:text-green-400">
              <div className="flex items-center gap-2">
                <span className="w-1 h-1 bg-green-500 rounded-full"></span>
                Speak naturally - AI detects your voice automatically
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1 h-1 bg-green-500 rounded-full"></span>
                Auto-mute prevents echo on speakers
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1 h-1 bg-green-500 rounded-full"></span>
                Wait for AI to finish before responding
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1 h-1 bg-green-500 rounded-full"></span>
                Press <kbd className="px-1.5 py-0.5 bg-green-200 dark:bg-green-800 rounded text-xs font-mono">M</kbd> to mute, <kbd className="px-1.5 py-0.5 bg-green-200 dark:bg-green-800 rounded text-xs font-mono">Esc</kbd> to end
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
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
}: {
  voice: string
  setVoice: (v: string) => void
  interviewerStyle: string
  setInterviewerStyle: (s: string) => void
  showCaptions: boolean
  setShowCaptions: (s: boolean) => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <Card className="p-5 mb-6 bg-white dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700 shadow-lg rounded-xl">
        <div className="flex items-center gap-2 mb-5">
          <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
            <Settings className="w-4 h-4 text-white" />
          </div>
          <h3 className="font-semibold text-gray-800 dark:text-gray-200">Interview Settings</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Voice Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Volume2 className="w-4 h-4" />
              Interviewer Voice
            </Label>
            <Select value={voice} onValueChange={setVoice}>
              <SelectTrigger className="bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-slate-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {VOICE_OPTIONS.map(v => (
                  <SelectItem key={v.id} value={v.id}>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-indigo-500" />
                      <div>
                        <div className="font-medium">{v.name}</div>
                        <div className="text-xs text-gray-500">{v.description}</div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Interviewer Style */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Bot className="w-4 h-4" />
              Interview Style
            </Label>
            <Select value={interviewerStyle} onValueChange={setInterviewerStyle}>
              <SelectTrigger className="bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-slate-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {INTERVIEWER_STYLES.map(s => (
                  <SelectItem key={s.id} value={s.id}>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        s.id === 'friendly' ? 'bg-green-500' :
                        s.id === 'formal' ? 'bg-blue-500' : 'bg-orange-500'
                      }`} />
                      <div>
                        <div className="font-medium">{s.name}</div>
                        <div className="text-xs text-gray-500">{s.description}</div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Captions Toggle */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Subtitles className="w-4 h-4" />
              Live Captions
            </Label>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-lg border border-gray-200 dark:border-slate-600">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {showCaptions ? 'Enabled' : 'Disabled'}
              </span>
              <Switch checked={showCaptions} onCheckedChange={setShowCaptions} />
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

// Main component
export function LiveKitInterviewSession({
  domainId,
  domainName,
  level,
  onEnd
}: LiveKitInterviewSessionProps) {
  const { user } = useAuth()
  const [connectionState, setConnectionState] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [serverUrl, setServerUrl] = useState<string | null>(null)
  const connectionAttemptedRef = useRef(false)
  const roomKeyRef = useRef<string>(`room-${Date.now()}`)

  // Settings
  const [voice, setVoice] = useState('Puck')
  const [interviewerStyle, setInterviewerStyle] = useState('friendly')
  const [showCaptions, setShowCaptions] = useState(true)
  const [showSettings, setShowSettings] = useState(true)

  // Timer
  const [elapsedTime, setElapsedTime] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Timer effect
  useEffect(() => {
    if (connectionState === 'connected') {
      timerRef.current = setInterval(() => {
        setElapsedTime(prev => prev + 1)
      }, 1000)
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [connectionState])

  // Connect to LiveKit
  const handleConnect = async () => {
    if (!user) {
      setError('Please sign in to start an interview')
      return
    }

    // Prevent duplicate connection attempts
    if (connectionAttemptedRef.current) {
      return
    }
    connectionAttemptedRef.current = true

    // Generate new room key for this connection
    roomKeyRef.current = `room-${Date.now()}`

    setError(null)
    setShowSettings(false)
    setConnectionState('connecting')

    try {
      // Get Firebase auth token
      const authToken = await user.getIdToken()

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/livekit/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          domain: domainId,
          domainName: domainName,
          level: level,
          voice: voice,
          style: interviewerStyle,
        }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to get connection token')
      }

      setToken(data.token)
      setServerUrl(data.url)
      setConnectionState('connected')
    } catch (err) {
      console.error('Connection error:', err)
      connectionAttemptedRef.current = false  // Allow retry
      setError(err instanceof Error ? err.message : 'Failed to connect')
      setConnectionState('error')
    }
  }

  const handleDisconnect = () => {
    const summary: InterviewSummary = {
      duration: elapsedTime,
      questionCount: 0, // Would need to track this from agent
      transcript: [],
    }

    // Reset connection state for next attempt
    connectionAttemptedRef.current = false
    setToken(null)
    setServerUrl(null)
    setConnectionState('idle')
    onEnd(summary)
  }

  // Idle state - show settings and start button
  if (connectionState === 'idle' || connectionState === 'connecting') {
    return (
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Card className="p-4 bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-teal-500/10 dark:from-green-900/30 dark:via-emerald-900/30 dark:to-teal-900/30 border-green-200 dark:border-green-800/50">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg">
                <Radio className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    Live Interview
                  </h2>
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 text-xs">
                    WebRTC
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                  {domainName} • {level}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Settings Panel */}
        {showSettings && (
          <SettingsPanel
            voice={voice}
            setVoice={setVoice}
            interviewerStyle={interviewerStyle}
            setInterviewerStyle={setInterviewerStyle}
            showCaptions={showCaptions}
            setShowCaptions={setShowCaptions}
          />
        )}

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="p-4 mb-6 bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800 rounded-xl">
              <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="flex-1">{error}</span>
                <Button variant="ghost" size="sm" onClick={() => setError(null)} className="hover:bg-red-100 dark:hover:bg-red-900/50">
                  Dismiss
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-8 mb-6 bg-white dark:bg-slate-800/90 border-0 shadow-2xl rounded-2xl overflow-hidden">
            {/* Decorative background */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 via-transparent to-emerald-50/50 dark:from-green-950/20 dark:to-emerald-950/20 pointer-events-none" />

            <div className="relative text-center">
              <div className="mb-8">
                {/* Animated AI Avatar */}
                <div className="relative inline-block">
                  {/* Outer glow */}
                  <motion.div
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 blur-xl opacity-30"
                    animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />

                  {/* Pulsing rings */}
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-green-400"
                    animate={{ scale: [1, 1.3], opacity: [0.5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-green-400"
                    animate={{ scale: [1, 1.3], opacity: [0.5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  />

                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="relative w-28 h-28 mx-auto rounded-full bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 flex items-center justify-center shadow-2xl"
                  >
                    <Bot className="w-14 h-14 text-white" />
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-6"
                >
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    Ready to Start
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                    Your AI interviewer is prepared for a <span className="font-medium text-green-600 dark:text-green-400">{level.toLowerCase()}</span> level interview in <span className="font-medium text-green-600 dark:text-green-400">{domainName}</span>.
                  </p>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={handleConnect}
                  disabled={connectionState === 'connecting'}
                  size="lg"
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-10 py-7 text-lg font-semibold rounded-xl shadow-lg shadow-green-500/25 transition-all duration-200"
                >
                  {connectionState === 'connecting' ? (
                    <>
                      <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                      Connecting to AI...
                    </>
                  ) : (
                    <>
                      <Radio className="w-6 h-6 mr-3" />
                      Start Live Interview
                    </>
                  )}
                </Button>
              </motion.div>

              {/* Features */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-gray-500 dark:text-gray-400"
              >
                <div className="flex items-center gap-1.5">
                  <Wifi className="w-4 h-4 text-green-500" />
                  <span>Low latency</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Volume2 className="w-4 h-4 text-blue-500" />
                  <span>Crystal clear audio</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Bot className="w-4 h-4 text-purple-500" />
                  <span>Expert AI interviewer</span>
                </div>
              </motion.div>
            </div>
          </Card>
        </motion.div>

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200 dark:border-blue-800/50 rounded-xl">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-500 rounded-lg flex-shrink-0">
                <Wifi className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-1">WebRTC Technology</h3>
                <p className="text-sm text-blue-700 dark:text-blue-400">
                  Real-time voice conversation with crystal-clear audio quality. No delays, no artifacts - just natural conversation with your AI interviewer.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    )
  }

  // Connected state - show LiveKit room
  if (connectionState === 'connected' && token && serverUrl) {
    return (
      <LiveKitRoom
        key={roomKeyRef.current}
        token={token}
        serverUrl={serverUrl}
        connect={true}
        audio={true}
        video={false}
        onDisconnected={handleDisconnect}
        onError={(error) => {
          console.error('LiveKit error:', error)
          setError(error.message)
        }}
        options={{
          disconnectOnPageLeave: true,
          adaptiveStream: true,
        }}
      >
        <InterviewRoom
          domainName={domainName}
          level={level}
          showCaptions={showCaptions}
          elapsedTime={elapsedTime}
          onEnd={handleDisconnect}
        />
      </LiveKitRoom>
    )
  }

  // Error state
  return (
    <div className="max-w-2xl mx-auto">
      <Card className="p-8 text-center">
        <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
        <h3 className="text-xl font-bold mb-2">Connection Error</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
        <div className="flex justify-center gap-4">
          <Button onClick={handleConnect} className="bg-green-600 hover:bg-green-700">
            Try Again
          </Button>
          <Button variant="outline" onClick={() => onEnd()}>
            Cancel
          </Button>
        </div>
      </Card>
    </div>
  )
}

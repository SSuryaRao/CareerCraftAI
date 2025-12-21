'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import ReactMarkdown from 'react-markdown'
import {
  Send, Mic, MicOff, Volume2, VolumeX, Bot, User,
  Sparkles, ThumbsUp, ThumbsDown, Copy,
  Zap, Brain, Target, BookOpen, Users, AlertCircle,
  Check, Loader2, ChevronDown
} from 'lucide-react'
import { apiClient } from '@/lib/api'
import { useVoiceChat } from '@/hooks/useVoiceChat'

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
  language?: string
  suggestions?: string[]
}

interface MentorPersona {
  id: string
  name: string
  specialty: string
  description: string
  avatar: string
  personality: string
}

const mentorPersonas: MentorPersona[] = [
  {
    id: 'career-guide',
    name: 'Arjun - Career Guide',
    specialty: 'Career Planning',
    description: 'Helps with career path decisions and goal setting',
    avatar: '👨‍💼',
    personality: 'Professional and strategic'
  },
  {
    id: 'tech-mentor',
    name: 'Priya - Tech Mentor',
    specialty: 'Technology Careers',
    description: 'Expert in software engineering and tech industry',
    avatar: '👩‍💻',
    personality: 'Technical and innovative'
  },
  {
    id: 'skill-coach',
    name: 'Raj - Skill Coach',
    specialty: 'Skill Development',
    description: 'Focuses on skill gaps and learning roadmaps',
    avatar: '🎯',
    personality: 'Motivational and detailed'
  },
  {
    id: 'interview-prep',
    name: 'Meera - Interview Coach',
    specialty: 'Interview Preparation',
    description: 'Specializes in interview skills and communication',
    avatar: '🗣️',
    personality: 'Encouraging and practical'
  }
]

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸', ttsSupported: true },
  { code: 'hi', name: 'हिंदी (Hindi)', flag: '🇮🇳', ttsSupported: true },
  { code: 'ta', name: 'தமிழ் (Tamil)', flag: '🇮🇳', ttsSupported: true },
  { code: 'te', name: 'తెలుగు (Telugu)', flag: '🇮🇳', ttsSupported: true },
  { code: 'bn', name: 'বাংলা (Bengali)', flag: '🇮🇳', ttsSupported: true },
  { code: 'mr', name: 'मराठी (Marathi)', flag: '🇮🇳', ttsSupported: true },
  { code: 'gu', name: 'ગુજરાતી (Gujarati)', flag: '🇮🇳', ttsSupported: true },
  { code: 'kn', name: 'ಕನ್ನಡ (Kannada)', flag: '🇮🇳', ttsSupported: true },
  { code: 'ml', name: 'മലയാളം (Malayalam)', flag: '🇮🇳', ttsSupported: true },
  { code: 'or', name: 'ଓଡ଼ିଆ (Odia)', flag: '🇮🇳', ttsSupported: false },
]

const quickActions = [
  { text: 'Show me career paths in AI/ML', icon: Brain },
  { text: 'Analyze my skill gaps', icon: Target },
  { text: 'Recommend learning resources', icon: BookOpen },
  { text: 'Help with interview prep', icon: Users },
  { text: 'Create a roadmap for my goals', icon: Zap },
]

// Mentor Dropdown Component - Separate for portal rendering
function MentorDropdown({ 
  isOpen, 
  onClose, 
  selectedMentor, 
  onSelectMentor 
}: {
  isOpen: boolean
  onClose: () => void
  selectedMentor: MentorPersona
  onSelectMentor: (mentor: MentorPersona) => void
}) {
  useEffect(() => {
    if (isOpen) {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose()
      }
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[999998]"
        onClick={onClose}
      />

      {/* Dropdown */}
      <div
        className="fixed top-20 left-4 right-4 sm:left-auto sm:right-6 sm:w-80 max-w-sm bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 rounded-xl shadow-2xl z-[999999]"
      >
        {mentorPersonas.map((mentor) => (
          <button
            key={mentor.id}
            onClick={() => {
              onSelectMentor(mentor)
              onClose()
            }}
            className={`w-full text-left p-3 sm:p-4 hover:bg-blue-50 dark:hover:bg-white/10 border-b border-gray-200 dark:border-white/5 last:border-b-0 transition-colors first:rounded-t-xl last:rounded-b-xl min-h-[60px] ${
              selectedMentor.id === mentor.id ? 'bg-blue-100 dark:bg-violet-600/20' : ''
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="text-xl sm:text-2xl flex-shrink-0">{mentor.avatar}</div>
              <div className="min-w-0 flex-1">
                <div className="font-medium text-sm sm:text-base text-gray-900 dark:text-white truncate">{mentor.name}</div>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-1">{mentor.description}</div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </>
  )
}

export default function AIMentor() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [selectedMentor, setSelectedMentor] = useState(mentorPersonas[0])
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0])
  const [isTyping, setIsTyping] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null)
  const [mentorDropdownOpen, setMentorDropdownOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Initialize Google Cloud voice services
  const voiceChat = useVoiceChat({
    language: selectedLanguage.code === 'en' ? 'en-IN' : `${selectedLanguage.code}-IN`,
    voiceGender: 'FEMALE',
    speakingRate: 1.0,
    pitch: 0.0,
    maxRecordingTime: 60, // 1 minute max for voice messages
    onTranscriptionComplete: (text, confidence) => {
      console.log(`Transcription complete (${Math.round(confidence * 100)}% confidence):`, text)
      setInputMessage(prev => prev + ' ' + text)
      setIsRecording(false)
    },
    onSpeechError: (error) => {
      // Only log error, don't automatically show to user
      // Errors will be handled by individual button click handlers
      console.error('Voice error:', error)
      setIsRecording(false)
    }
  })

  // Initialize welcome message on client side only (avoid hydration mismatch)
  useEffect(() => {
    setMounted(true)
    setMessages([{
      id: '1',
      type: 'assistant',
      content: 'Hello! I\'m your AI Career Mentor. I can help you with career planning, skill development, and job search strategies. What would you like to explore today?',
      timestamp: new Date(),
      suggestions: [
        'Show me career opportunities in technology',
        'Help me analyze my skills',
        'Create a learning roadmap',
        'Prepare for interviews'
      ]
    }])
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Update voice chat language when selectedLanguage changes
  useEffect(() => {
    const langCode = selectedLanguage.code === 'en' ? 'en-IN' : `${selectedLanguage.code}-IN`
    voiceChat.setLanguage(langCode)
  }, [selectedLanguage])

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isTyping) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    const currentInput = inputMessage
    setInputMessage('')
    setIsTyping(true)
    setError(null)

    try {
      // Send message to backend API with personalized context
      const response = await apiClient.sendMentorMessage(
        currentInput,
        {
          id: selectedMentor.id,
          name: selectedMentor.name,
          specialty: selectedMentor.specialty,
          personality: selectedMentor.personality
        },
        selectedLanguage.name
      )

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to get response from AI mentor')
      }

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response.data.response,
        timestamp: new Date(),
        suggestions: response.data.suggestions || []
      }

      setMessages(prev => [...prev, aiResponse])
    } catch (error: any) {
      console.error('Error generating AI response:', error)
      setError(error.message || 'Something went wrong. Please try again.')

      // Show fallback message if backend is unavailable
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: "I'm having trouble connecting to the server right now. Please try again in a moment. In the meantime, feel free to explore other features of the platform!",
        timestamp: new Date(),
        suggestions: []
      }
      setMessages(prev => [...prev, fallbackMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleQuickAction = (actionText: string) => {
    setInputMessage(actionText)
    inputRef.current?.focus()
  }

  const handleVoiceToggle = async () => {
    if (isRecording) {
      // Stop recording and transcribe
      voiceChat.stopRecording()
      setIsRecording(false)
    } else {
      // Start recording
      try {
        await voiceChat.startRecording()
        setIsRecording(true)
        setError(null)
      } catch (error: any) {
        console.error('Failed to start recording:', error)
        setError(`Voice input error: ${error.message || 'Microphone permission denied or not available'}`)
      }
    }
  }

  const handleSpeakMessage = async (content: string) => {
    // Check if TTS is supported for current language
    if (!selectedLanguage.ttsSupported) {
      setError(`Text-to-speech is not available for ${selectedLanguage.name}. Please select a different language for voice output.`)
      return
    }

    if (voiceChat.isSpeaking) {
      // Stop current speech immediately
      voiceChat.stopSpeaking()
    } else {
      // Start speech with Google Cloud TTS
      try {
        setError(null)
        await voiceChat.speak(content)
      } catch (error: any) {
        console.error('Speech error:', error)
        setError(`Voice output error: ${error.message || 'Failed to generate speech. Please try again.'}`)
      }
    }
  }

  const copyMessage = (content: string, messageId: string) => {
    navigator.clipboard.writeText(content)
    setCopiedMessageId(messageId)
    setTimeout(() => setCopiedMessageId(null), 2000)
  }

  return (
    <>
      <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900 pt-16 sm:pt-18 md:pt-20">
        {/* Header */}
        <div className="bg-white/80 dark:bg-black/20 backdrop-blur-xl border-b border-gray-200 dark:border-white/10 shadow-sm">
          <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4">
            <div className="flex items-center justify-between gap-2 sm:gap-4">
              <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 min-w-0 flex-1">
                <div className="relative flex-shrink-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-violet-500 dark:to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-lg sm:text-xl md:text-2xl shadow-xl ring-2 sm:ring-4 ring-blue-200/50 dark:ring-white/20">
                    {selectedMentor.avatar}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 bg-green-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse"></div>
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-sm sm:text-base md:text-xl font-bold text-gray-900 dark:text-white truncate">{selectedMentor.name}</h1>
                  <p className="text-xs sm:text-sm flex items-center text-gray-600 dark:text-gray-300 truncate">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full mr-1 sm:mr-2 animate-pulse flex-shrink-0"></span>
                    <span className="truncate">{selectedMentor.specialty} • Online</span>
                  </p>
                  <p className="hidden sm:block text-xs text-blue-600 dark:text-violet-400 font-medium mt-1 truncate">{selectedMentor.personality}</p>
                </div>
              </div>

              <div className="flex items-center space-x-1.5 sm:space-x-2 md:space-x-3 flex-shrink-0">
                {/* Language Selector */}
                <select
                  value={selectedLanguage.code}
                  onChange={(e) => {
                    const lang = languages.find(l => l.code === e.target.value)
                    if (lang) setSelectedLanguage(lang)
                  }}
                  className="px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm rounded-lg sm:rounded-xl bg-white hover:bg-blue-50 dark:bg-white/10 dark:hover:bg-white/20 border border-blue-200 dark:border-white/20 text-gray-700 dark:text-white shadow-lg transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code} className="dark:bg-slate-800">
                      {lang.flag} {lang.name}
                    </option>
                  ))}
                </select>

                {/* Mentor Selector Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setMentorDropdownOpen(true)}
                  className="bg-white hover:bg-blue-50 dark:bg-white/10 dark:hover:bg-white/20 border-blue-200 dark:border-white/20 text-gray-700 dark:text-white shadow-lg transition-all duration-300 rounded-lg sm:rounded-xl px-2 sm:px-3 py-1.5 sm:py-2 h-auto"
                >
                  <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Switch Mentor</span>
                  <ChevronDown className="w-3 h-3 sm:ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/60 dark:bg-black/10 backdrop-blur-sm border-b border-gray-200 dark:border-white/5 px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 overflow-x-auto">
          <div className="max-w-6xl mx-auto">
            <div className="flex sm:flex-wrap gap-2 sm:gap-2 pb-1 sm:pb-0 min-w-max sm:min-w-0">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAction(action.text)}
                  disabled={isTyping}
                  className="text-[10px] sm:text-xs rounded-full bg-white hover:bg-blue-50 dark:bg-white/5 dark:hover:bg-white/10 border-blue-200 dark:border-white/20 text-gray-700 hover:text-blue-700 dark:text-white/90 dark:hover:text-white transition-all duration-300 font-medium px-3 sm:px-3 py-2 sm:py-2 h-auto whitespace-nowrap flex-shrink-0 sm:flex-shrink"
                >
                  <action.icon className="w-3 h-3 mr-1.5 sm:mr-2 flex-shrink-0" />
                  <span className="truncate sm:line-clamp-1">{action.text}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Error Display */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-red-500/10 border-l-4 border-red-500 overflow-hidden backdrop-blur-sm"
            >
              <div className="p-4">
                <div className="max-w-4xl mx-auto flex">
                  <AlertCircle className="w-5 h-5 text-red-400 mr-2 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-red-300 text-sm">{error}</p>
                    <Button
                      variant="ghost" 
                      size="sm"
                      onClick={() => setError(null)}
                      className="text-red-400 hover:text-red-300 p-0 h-auto mt-1"
                    >
                      Dismiss
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-2 sm:p-4 md:p-6 pb-4">
          <div className="max-w-4xl mx-auto space-y-3 sm:space-y-4 md:space-y-6">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[90%] sm:max-w-[85%] md:max-w-3xl ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                  <div className="flex items-start space-x-2 sm:space-x-3 mb-2">
                    {/* Avatar for Assistant */}
                    {message.type === 'assistant' && (
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-violet-500 dark:to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center text-base sm:text-lg shadow-lg flex-shrink-0">
                        {selectedMentor.avatar}
                      </div>
                    )}

                    {/* Message Content */}
                    <div
                      className={`px-3 py-3 sm:px-4 sm:py-4 md:px-5 md:py-4 rounded-xl sm:rounded-2xl shadow-xl max-w-full ${
                        message.type === 'user'
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-violet-600 dark:to-purple-600 text-white ml-auto'
                          : 'bg-white dark:bg-white/10 dark:backdrop-blur-lg border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white'
                      }`}
                    >
                      <div className={`text-xs sm:text-sm leading-relaxed prose prose-sm max-w-none prose-p:my-1 sm:prose-p:my-2 prose-ul:my-1 sm:prose-ul:my-2 prose-ol:my-1 sm:prose-ol:my-2 prose-li:my-0.5 sm:prose-li:my-1 prose-headings:mb-1 sm:prose-headings:mb-2 prose-headings:mt-2 sm:prose-headings:mt-3 prose-strong:font-semibold ${
                        message.type === 'user'
                          ? 'prose-invert prose-strong:text-white'
                          : 'dark:prose-invert prose-strong:text-white dark:prose-strong:text-white prose-strong:text-gray-900'
                      }`}>
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                      </div>

                      {/* Message Actions */}
                      <div className={`flex items-center justify-between mt-2 sm:mt-3 pt-2 sm:pt-3 border-t ${
                        message.type === 'user'
                          ? 'border-white/10'
                          : 'border-gray-200 dark:border-white/10'
                      }`}>
                        <div className="flex items-center space-x-0.5 sm:space-x-1">
                          {message.type === 'assistant' && (
                            <>
                              <button
                                onClick={() => copyMessage(message.content, message.id)}
                                className="p-1 sm:p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-500 hover:text-gray-700 dark:text-white/60 dark:hover:text-white min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 flex items-center justify-center"
                              >
                                {copiedMessageId === message.id ? (
                                  <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-green-600 dark:text-green-400" />
                                ) : (
                                  <Copy className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                )}
                              </button>
                              <button
                                onClick={() => handleSpeakMessage(message.content)}
                                title={!selectedLanguage.ttsSupported ? "Text-to-speech not available for this language - Click to see message" : (voiceChat.isSpeaking ? "Stop speaking" : "Click to hear this message")}
                                aria-label={voiceChat.isSpeaking ? "Stop speaking" : "Speak this message"}
                                className={`p-1 sm:p-1.5 rounded-lg transition-colors min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 flex items-center justify-center ${
                                  !selectedLanguage.ttsSupported
                                    ? 'opacity-50 cursor-pointer text-gray-400 dark:text-white/30 hover:opacity-70'
                                    : 'hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 hover:text-gray-700 dark:text-white/60 dark:hover:text-white'
                                }`}
                              >
                                {voiceChat.isSpeaking ? <VolumeX className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> : <Volume2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
                              </button>
                              <button className="hidden sm:flex p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-500 hover:text-gray-700 dark:text-white/60 dark:hover:text-white items-center justify-center">
                                <ThumbsUp className="w-3.5 h-3.5" />
                              </button>
                              <button className="hidden sm:flex p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-500 hover:text-gray-700 dark:text-white/60 dark:hover:text-white items-center justify-center">
                                <ThumbsDown className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                        {mounted && (
                          <span className={`text-[10px] sm:text-xs ${
                            message.type === 'user'
                              ? 'text-white/70'
                              : 'text-gray-500 dark:text-white/50'
                          }`}>
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Avatar for User */}
                    {message.type === 'user' && (
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-cyan-500 dark:from-emerald-500 dark:to-teal-600 rounded-lg sm:rounded-xl flex items-center justify-center order-2 shadow-lg flex-shrink-0">
                        <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Suggestions */}
                  {message.suggestions && message.suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 sm:gap-2 ml-10 sm:ml-12 md:ml-13 mt-2">
                      {message.suggestions.map((suggestion, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuickAction(suggestion)}
                          disabled={isTyping}
                          className="text-[10px] sm:text-xs rounded-full bg-blue-100 hover:bg-blue-200 dark:bg-violet-600/20 dark:hover:bg-violet-600/30 border-blue-300 dark:border-violet-500/30 text-blue-700 hover:text-blue-900 dark:text-violet-300 dark:hover:text-white transition-all duration-300 px-2 sm:px-3 py-1.5 sm:py-2"
                        >
                          <Sparkles className="w-3 h-3 mr-1 sm:mr-2 flex-shrink-0" />
                          <span className="line-clamp-1">{suggestion}</span>
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
            
            {/* Typing Indicator */}
            <AnimatePresence>
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex items-start space-x-2 sm:space-x-3"
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-violet-500 dark:to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center text-base sm:text-lg shadow-lg flex-shrink-0">
                    {selectedMentor.avatar}
                  </div>
                  <div className="bg-white dark:bg-white/10 dark:backdrop-blur-lg border border-gray-200 dark:border-white/10 px-3 py-3 sm:px-5 sm:py-4 rounded-xl sm:rounded-2xl shadow-xl">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-blue-500 dark:bg-violet-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-indigo-500 dark:bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '75ms' }} />
                        <div className="w-2 h-2 bg-blue-600 dark:bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      </div>
                      <span className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-300 font-medium">AI is thinking...</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Section */}
        <div className="bg-white/90 dark:bg-black/20 backdrop-blur-xl border-t border-gray-200 dark:border-white/10 shadow-lg safe-area-inset-bottom">
          <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4">
            <div className="flex items-end space-x-2 sm:space-x-3 md:space-x-4">
              <div className="flex-1 relative">
                <Textarea
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about your career..."
                  className="pr-10 sm:pr-12 pl-3 sm:pl-4 py-3 sm:py-4 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm sm:text-sm rounded-xl sm:rounded-2xl border-gray-300 dark:border-white/20 bg-white dark:bg-white/10 dark:backdrop-blur-lg focus:border-blue-500 dark:focus:border-violet-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-violet-500/20 shadow-xl resize-none min-h-[50px] sm:min-h-[56px] max-h-32"
                  rows={1}
                  disabled={isTyping}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleVoiceToggle}
                  disabled={isTyping}
                  title={isRecording ? "Stop recording" : "Click to record voice message"}
                  aria-label={isRecording ? "Stop recording" : "Record voice message"}
                  className={`absolute right-2 sm:right-3 bottom-2.5 sm:bottom-3 h-9 w-9 sm:h-8 sm:w-8 p-0 rounded-lg sm:rounded-xl transition-all ${
                    isRecording
                      ? 'text-red-400 bg-red-500/20 hover:bg-red-500/30 animate-pulse'
                      : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10'
                  }`}
                >
                  {isRecording ? <MicOff className="w-4 h-4 sm:w-4 sm:h-4" /> : <Mic className="w-4 h-4 sm:w-4 sm:h-4" />}
                </Button>
              </div>
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="h-[50px] sm:h-[56px] px-4 sm:px-6 rounded-xl sm:rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-violet-600 dark:to-purple-600 hover:from-blue-700 hover:to-indigo-700 dark:hover:from-violet-700 dark:hover:to-purple-700 text-white shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
              >
                {isTyping ? (
                  <Loader2 className="w-5 h-5 sm:w-5 sm:h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5 sm:w-5 sm:h-5" />
                )}
              </Button>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-2 sm:mt-3 gap-1.5 sm:gap-0">
              <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                AI responses are personalized based on your profile, skills, and career goals.
              </p>
              <div className="flex items-center space-x-1 sm:space-x-2 text-[10px] sm:text-xs text-blue-600 dark:text-violet-400 font-medium flex-shrink-0">
                <span>Powered by Vertex AI</span>
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mentor Dropdown - Rendered outside main component */}
      <MentorDropdown 
        isOpen={mentorDropdownOpen}
        onClose={() => setMentorDropdownOpen(false)}
        selectedMentor={selectedMentor}
        onSelectMentor={setSelectedMentor}
      />
    </>
  )
}
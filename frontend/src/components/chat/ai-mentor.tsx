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
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
  { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
  { code: 'bn', name: 'বাংলা', flag: '🇮🇳' },
  { code: 'mr', name: 'मराठी', flag: '🇮🇳' },
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
        className="fixed top-20 right-6 w-80 bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 rounded-xl shadow-2xl z-[999999]"
      >
        {mentorPersonas.map((mentor) => (
          <button
            key={mentor.id}
            onClick={() => {
              onSelectMentor(mentor)
              onClose()
            }}
            className={`w-full text-left p-4 hover:bg-blue-50 dark:hover:bg-white/10 border-b border-gray-200 dark:border-white/5 last:border-b-0 transition-colors first:rounded-t-xl last:rounded-b-xl ${
              selectedMentor.id === mentor.id ? 'bg-blue-100 dark:bg-violet-600/20' : ''
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="text-2xl">{mentor.avatar}</div>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">{mentor.name}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{mentor.description}</div>
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
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null)
  const [mentorDropdownOpen, setMentorDropdownOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const recognitionRef = useRef<any>(null)

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

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = selectedLanguage.code === 'en' ? 'en-US' : `${selectedLanguage.code}-IN`
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setInputMessage(prev => prev + ' ' + transcript)
        setIsRecording(false)
      }
      
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error)
        setIsRecording(false)
        setError('Voice recognition failed. Please try typing instead.')
      }
      
      recognitionRef.current = recognition
    }
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

  const handleVoiceToggle = () => {
    if (!recognitionRef.current) {
      setError('Voice recognition is not supported in your browser')
      return
    }

    if (isRecording) {
      recognitionRef.current.stop()
      setIsRecording(false)
    } else {
      try {
        recognitionRef.current.start()
        setIsRecording(true)
      } catch (error) {
        console.error('Failed to start recording:', error)
        setError('Failed to start voice recording')
      }
    }
  }

  const handleSpeakMessage = (content: string) => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel()
        setIsSpeaking(false)
      } else {
        const utterance = new SpeechSynthesisUtterance(content)
        utterance.lang = selectedLanguage.code === 'en' ? 'en-US' : `${selectedLanguage.code}-IN`
        utterance.onend = () => setIsSpeaking(false)
        window.speechSynthesis.speak(utterance)
        setIsSpeaking(true)
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
          <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-violet-500 dark:to-purple-600 rounded-2xl flex items-center justify-center text-2xl shadow-xl ring-4 ring-blue-200/50 dark:ring-white/20">
                    {selectedMentor.avatar}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse"></div>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">{selectedMentor.name}</h1>
                  <p className="text-sm flex items-center text-gray-600 dark:text-gray-300">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                    {selectedMentor.specialty} • Online
                  </p>
                  <p className="text-xs text-blue-600 dark:text-violet-400 font-medium mt-1">{selectedMentor.personality}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                {/* Mentor Selector Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setMentorDropdownOpen(true)}
                  className="bg-white hover:bg-blue-50 dark:bg-white/10 dark:hover:bg-white/20 border-blue-200 dark:border-white/20 text-gray-700 dark:text-white shadow-lg transition-all duration-300 rounded-xl"
                >
                  <Bot className="w-4 h-4 mr-2" />
                  Switch Mentor
                  <ChevronDown className="w-3 h-3 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/60 dark:bg-black/10 backdrop-blur-sm border-b border-gray-200 dark:border-white/5 px-6 py-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-wrap gap-2">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAction(action.text)}
                  disabled={isTyping}
                  className="text-xs rounded-full bg-white hover:bg-blue-50 dark:bg-white/5 dark:hover:bg-white/10 border-blue-200 dark:border-white/20 text-gray-700 hover:text-blue-700 dark:text-white/90 dark:hover:text-white transition-all duration-300 font-medium"
                >
                  <action.icon className="w-3 h-3 mr-2" />
                  {action.text}
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
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-3xl ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                  <div className="flex items-start space-x-3 mb-2">
                    {/* Avatar for Assistant */}
                    {message.type === 'assistant' && (
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-violet-500 dark:to-purple-600 rounded-xl flex items-center justify-center text-lg shadow-lg flex-shrink-0">
                        {selectedMentor.avatar}
                      </div>
                    )}

                    {/* Message Content */}
                    <div
                      className={`px-5 py-4 rounded-2xl shadow-xl max-w-full ${
                        message.type === 'user'
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-violet-600 dark:to-purple-600 text-white ml-auto'
                          : 'bg-white dark:bg-white/10 dark:backdrop-blur-lg border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white'
                      }`}
                    >
                      <div className={`text-sm leading-relaxed prose prose-sm max-w-none prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-1 prose-headings:mb-2 prose-headings:mt-3 prose-strong:font-semibold ${
                        message.type === 'user'
                          ? 'prose-invert prose-strong:text-white'
                          : 'dark:prose-invert prose-strong:text-white dark:prose-strong:text-white prose-strong:text-gray-900'
                      }`}>
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                      </div>

                      {/* Message Actions */}
                      <div className={`flex items-center justify-between mt-3 pt-3 border-t ${
                        message.type === 'user'
                          ? 'border-white/10'
                          : 'border-gray-200 dark:border-white/10'
                      }`}>
                        <div className="flex items-center space-x-1">
                          {message.type === 'assistant' && (
                            <>
                              <button
                                onClick={() => copyMessage(message.content, message.id)}
                                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-500 hover:text-gray-700 dark:text-white/60 dark:hover:text-white"
                              >
                                {copiedMessageId === message.id ? (
                                  <Check className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                              <button
                                onClick={() => handleSpeakMessage(message.content)}
                                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-500 hover:text-gray-700 dark:text-white/60 dark:hover:text-white"
                              >
                                {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                              </button>
                              <button className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-500 hover:text-gray-700 dark:text-white/60 dark:hover:text-white">
                                <ThumbsUp className="w-3.5 h-3.5" />
                              </button>
                              <button className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-500 hover:text-gray-700 dark:text-white/60 dark:hover:text-white">
                                <ThumbsDown className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                        {mounted && (
                          <span className={`text-xs ${
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
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 dark:from-emerald-500 dark:to-teal-600 rounded-xl flex items-center justify-center order-2 shadow-lg flex-shrink-0">
                        <User className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </div>
                  
                  {/* Suggestions */}
                  {message.suggestions && message.suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-2 ml-13 mt-2">
                      {message.suggestions.map((suggestion, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuickAction(suggestion)}
                          disabled={isTyping}
                          className="text-xs rounded-full bg-blue-100 hover:bg-blue-200 dark:bg-violet-600/20 dark:hover:bg-violet-600/30 border-blue-300 dark:border-violet-500/30 text-blue-700 hover:text-blue-900 dark:text-violet-300 dark:hover:text-white transition-all duration-300"
                        >
                          <Sparkles className="w-3 h-3 mr-2" />
                          {suggestion}
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
                  className="flex items-start space-x-3"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-violet-500 dark:to-purple-600 rounded-xl flex items-center justify-center text-lg shadow-lg">
                    {selectedMentor.avatar}
                  </div>
                  <div className="bg-white dark:bg-white/10 dark:backdrop-blur-lg border border-gray-200 dark:border-white/10 px-5 py-4 rounded-2xl shadow-xl">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-blue-500 dark:bg-violet-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-indigo-500 dark:bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '75ms' }} />
                        <div className="w-2 h-2 bg-blue-600 dark:bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      </div>
                      <span className="text-xs text-gray-600 dark:text-gray-300 font-medium">AI is thinking...</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Section */}
        <div className="bg-white/90 dark:bg-black/20 backdrop-blur-xl border-t border-gray-200 dark:border-white/10 shadow-lg">
          <div className="max-w-4xl mx-auto px-6 py-5">
            <div className="flex items-end space-x-4">
              <div className="flex-1 relative">
                <Textarea
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about your career..."
                  className="pr-12 py-4 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm rounded-2xl border-gray-300 dark:border-white/20 bg-white dark:bg-white/10 dark:backdrop-blur-lg focus:border-blue-500 dark:focus:border-violet-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-violet-500/20 shadow-xl resize-none min-h-[56px] max-h-32"
                  rows={1}
                  disabled={isTyping}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleVoiceToggle}
                  disabled={isTyping}
                  className={`absolute right-3 bottom-3 h-8 w-8 p-0 rounded-xl ${
                    isRecording
                      ? 'text-red-400 bg-red-500/20 hover:bg-red-500/30'
                      : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10'
                  }`}
                >
                  {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </Button>
              </div>
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="h-[56px] px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-violet-600 dark:to-purple-600 hover:from-blue-700 hover:to-indigo-700 dark:hover:from-violet-700 dark:hover:to-purple-700 text-white shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isTyping ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </Button>
            </div>
            <div className="flex items-center justify-between mt-4">
              <p className="text-xs text-gray-600 dark:text-gray-400">
                AI responses are personalized based on your profile, skills, and career goals.
              </p>
              <div className="flex items-center space-x-2 text-xs text-blue-600 dark:text-violet-400 font-medium">
                <span>Powered by Vertex AI</span>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
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
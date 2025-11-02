'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  MessageCircle,
  X,
  Send,
  Minimize2,
  Maximize2,
  Bot,
  User,
  Loader2,
  Sparkles,
  Brain,
  Zap,
  Heart,
  ChevronDown,
  MoreHorizontal
} from 'lucide-react'
import { apiClient } from '@/lib/api'

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
}

interface ChatbotWidgetProps {
  className?: string
}

export default function ChatbotWidget({ className = '' }: ChatbotWidgetProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [showGreeting, setShowGreeting] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [sessionId] = useState(() => `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Show greeting popup after page load
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen) {
        setShowGreeting(true)
        // Hide greeting after 4 seconds
        setTimeout(() => {
          setShowGreeting(false)
        }, 4000)
      }
    }, 2000) // Show greeting 2 seconds after page load

    return () => clearTimeout(timer)
  }, [isOpen])

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const addMessage = (text: string, sender: 'user' | 'bot') => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, newMessage])
  }

  const sendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage = inputValue.trim()
    setInputValue('')

    // Add user message
    addMessage(userMessage, 'user')

    // Show typing indicator
    setIsTyping(true)

    try {
      // Use apiClient for proper API URL handling
      const data = await apiClient.sendChatbotMessage(userMessage, sessionId)

      // Simulate typing delay
      setTimeout(() => {
        setIsTyping(false)
        if (data.success && data.data?.response) {
          addMessage(data.data.response, 'bot')

          // Handle special actions from Dialogflow
          if (data.data.action) {
            handleBotAction(data.data)
          }
        } else {
          addMessage('Sorry, I couldn\'t process your request. Please try again later.', 'bot')
        }
      }, 1000) // 1 second typing delay

    } catch (error) {
      console.error('Chatbot error:', error)
      setTimeout(() => {
        setIsTyping(false)
        addMessage('I\'m having trouble connecting right now. Please check our navigation menu for quick access to features like Resume Analyzer, Career Roadmaps, and Mock Interviews.', 'bot')
      }, 1000)
    }
  }

  const handleBotAction = (responseData: any) => {
    const { action, redirectTo, mentorPersona, filters, features } = responseData

    switch (action) {
      case 'redirect':
        // Redirect user to the specified page
        if (redirectTo) {
          setTimeout(() => {
            router.push(redirectTo)
            closeChat()
          }, 2000) // Give user time to read the response first
        }
        break

      case 'show_features':
        // Could display features in a modal or panel
        // For now, just log it (you can enhance this later)
        console.log('Available features:', features)
        break

      case 'open_modal':
        // Could trigger a modal to open
        console.log('Open modal for:', responseData.modalType)
        break

      default:
        // No special action needed
        break
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const openChat = () => {
    setIsOpen(true)
    setShowGreeting(false)
    
    // Add welcome message if no messages yet
    if (messages.length === 0) {
      setTimeout(() => {
        addMessage("✨ Hey there! I'm your AI Career Mentor, powered by advanced intelligence to guide your professional journey. I can help with resume optimization, career roadmaps, skill development, interview prep, and much more. What career goal can I help you achieve today?", 'bot')
      }, 500)
    }
  }

  const closeChat = () => {
    setIsOpen(false)
    setIsExpanded(false)
  }

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <div className={`fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 ${className}`}>
      {/* Greeting Popup */}
      <AnimatePresence>
        {showGreeting && !isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="absolute bottom-16 sm:bottom-20 right-0 mb-2"
          >
            <div
              className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-4 sm:p-5 max-w-[280px] sm:max-w-xs cursor-pointer hover:shadow-3xl hover:scale-105 transition-all duration-300 group"
              onClick={openChat}
            >
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 via-violet-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                </div>
                <div>
                  <div className="flex items-center space-x-1">
                    <p className="text-xs sm:text-sm font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">AI Career Mentor</p>
                    <Sparkles className="w-3 h-3 text-purple-500 animate-pulse" />
                  </div>
                  <p className="text-xs sm:text-sm text-gray-700">✨ Ready to boost your career?</p>
                </div>
              </div>
              {/* Enhanced arrow with gradient */}
              <div className="absolute -bottom-2 right-8 w-4 h-4 bg-white/95 border-b border-r border-white/20 transform rotate-45 shadow-sm"></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className={`z-50 ${
              isExpanded
                ? 'fixed inset-4 max-h-[calc(100vh-2rem)]'
                : 'fixed bottom-20 right-4 left-4 h-[520px] max-h-[calc(100vh-8rem)]'
            } sm:absolute sm:bottom-20 sm:right-0 sm:left-auto sm:w-96 sm:h-[520px] sm:max-h-[520px]`}
          >
            <Card className="w-full h-full bg-gradient-to-b from-slate-50/95 to-white/95 backdrop-blur-xl border-0 shadow-2xl rounded-3xl ring-1 ring-white/20 flex flex-col overflow-hidden">
              {/* Header */}
              <div className="relative bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-700 p-3 sm:p-5 text-white flex-shrink-0">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-indigo-600 mix-blend-multiply"></div>
                  <div className="absolute top-0 left-0 w-full h-full"
                       style={{
                         backgroundImage: `radial-gradient(circle at 20% 50%, white 0%, transparent 50%), radial-gradient(circle at 80% 80%, white 0%, transparent 50%)`,
                         backgroundSize: '100px 100px'
                       }}>
                  </div>
                </div>

                <div className="relative flex items-center justify-between gap-2 sm:gap-3">
                  <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                    <div className="relative flex-shrink-0">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                        <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full border-2 border-white/30 animate-pulse"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-1 sm:space-x-2">
                        <h3 className="font-bold text-white text-sm sm:text-lg truncate">AI Career Mentor</h3>
                        <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-300 animate-pulse flex-shrink-0" />
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <p className="text-xs sm:text-sm text-purple-100 truncate">
                          <span className="sm:hidden">Online</span>
                          <span className="hidden sm:inline">Online • Ready to help</span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                    {/* Expand button - visible only on mobile */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleExpand}
                      className="sm:hidden text-white hover:bg-white/20 p-1.5 h-8 w-8 rounded-xl transition-all duration-200 hover:scale-110 flex-shrink-0"
                    >
                      {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                    </Button>
                    {/* Minimize button - visible only on desktop */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={closeChat}
                      className="hidden sm:flex items-center justify-center text-white hover:bg-white/20 p-2 h-9 w-9 rounded-xl transition-all duration-200 hover:scale-110 flex-shrink-0"
                    >
                      <Minimize2 className="w-4 h-4" />
                    </Button>
                    {/* Close button - always visible */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={closeChat}
                      className="flex items-center justify-center text-white hover:bg-white/20 hover:bg-red-500/20 p-1.5 sm:p-2 h-8 w-8 sm:h-9 sm:w-9 rounded-xl transition-all duration-200 hover:scale-110 flex-shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-3 sm:space-y-4 bg-gradient-to-b from-slate-50/50 to-white/80 backdrop-blur-sm">
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[90%] sm:max-w-[85%] ${message.sender === 'user' ? 'ml-4 sm:ml-12' : 'mr-4 sm:mr-12'}`}>
                      {message.sender === 'bot' && (
                        <div className="flex items-center mb-1.5 sm:mb-2 ml-1">
                          <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center mr-1.5 sm:mr-2 shadow-sm">
                            <Brain className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                          </div>
                          <span className="text-xs text-purple-600 font-semibold">AI Career Mentor</span>
                          <Zap className="w-3 h-3 text-yellow-500 ml-1" />
                        </div>
                      )}

                      <div
                        className={`p-3 sm:p-4 rounded-2xl shadow-sm backdrop-blur-sm transition-all duration-200 hover:shadow-md ${
                          message.sender === 'user'
                            ? 'bg-gradient-to-br from-purple-500 via-violet-500 to-indigo-600 text-white shadow-purple-500/20'
                            : 'bg-white/90 border border-white/40 text-gray-800 shadow-gray-200/50'
                        } ${message.sender === 'user' ? 'rounded-br-md' : 'rounded-bl-md'}`}
                      >
                        <p className="text-xs sm:text-sm leading-relaxed font-medium">{message.text}</p>
                        <div className="flex items-center justify-between mt-1.5 sm:mt-2">
                          <p className={`text-xs ${
                            message.sender === 'user' ? 'text-purple-100' : 'text-gray-500'
                          }`}>
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                          {message.sender === 'bot' && (
                            <Heart className="w-3 h-3 text-pink-400 opacity-60" />
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start mr-12"
                  >
                    <div className="bg-white/90 backdrop-blur-sm border border-white/40 rounded-2xl rounded-bl-md p-4 shadow-sm">
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
                          <Brain className="w-3 h-3 text-white" />
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                          </div>
                          <span className="text-xs text-purple-600 font-medium">AI is thinking...</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-3 sm:p-5 bg-gradient-to-r from-white/80 to-slate-50/80 backdrop-blur-sm border-t border-white/30 flex-shrink-0">
                <div className="flex space-x-2 sm:space-x-3">
                  <div className="flex-1 relative">
                    <Input
                      ref={inputRef}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="✨ Ask about careers, skills..."
                      className="w-full pl-3 sm:pl-4 pr-10 sm:pr-12 py-2.5 sm:py-3 text-sm bg-white/80 backdrop-blur-sm border border-white/40 rounded-2xl focus:border-purple-400 focus:ring-4 focus:ring-purple-400/20 text-gray-800 placeholder-gray-500 shadow-sm transition-all duration-200"
                      disabled={isTyping}
                    />
                    {!inputValue.trim() && (
                      <div className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2">
                        <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-400 animate-pulse" />
                      </div>
                    )}
                  </div>
                  <Button
                    onClick={sendMessage}
                    disabled={!inputValue.trim() || isTyping}
                    className="bg-gradient-to-br from-purple-500 via-violet-500 to-indigo-600 hover:from-purple-600 hover:via-violet-600 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 text-white p-2.5 sm:p-3 w-10 h-10 sm:w-12 sm:h-12 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 group flex-shrink-0"
                  >
                    {isTyping ? (
                      <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                    )}
                  </Button>
                </div>

                {/* Quick Actions */}
                <div className="flex items-center space-x-1.5 sm:space-x-2 mt-2 sm:mt-3 overflow-x-auto pb-1">
                  <span className="text-xs text-gray-500 font-medium flex-shrink-0">Quick:</span>
                  {[
                    { icon: Zap, text: "Resume tips", color: "from-yellow-400 to-orange-500" },
                    { icon: Brain, text: "Career path", color: "from-purple-400 to-indigo-500" },
                    { icon: Heart, text: "Interview prep", color: "from-pink-400 to-rose-500" }
                  ].map((action, index) => (
                    <button
                      key={index}
                      onClick={() => setInputValue(action.text)}
                      className="flex items-center space-x-1 px-2 sm:px-3 py-1 sm:py-1.5 bg-white/60 hover:bg-white/80 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700 border border-white/40 hover:border-purple-300 transition-all duration-200 hover:scale-105 flex-shrink-0"
                    >
                      <action.icon className={`w-3 h-3 bg-gradient-to-r ${action.color} text-transparent bg-clip-text`} />
                      <span className="whitespace-nowrap">{action.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="relative"
      >
        <Button
          onClick={openChat}
          className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-purple-500 via-violet-500 to-indigo-600 hover:from-purple-600 hover:via-violet-600 hover:to-indigo-700 text-white shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 border-0 ring-4 ring-white/20 backdrop-blur-sm ${
            isOpen ? 'hidden' : 'flex'
          } items-center justify-center group relative overflow-hidden`}
        >
          {/* Background glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-indigo-500 opacity-0 group-hover:opacity-30 transition-opacity duration-300 rounded-full"></div>

          {/* Pulsing rings */}
          <div className="absolute inset-0 rounded-full animate-ping bg-purple-400 opacity-20"></div>
          <div className="absolute inset-0 rounded-full animate-pulse bg-violet-400 opacity-10"></div>

          {/* Icon */}
          <div className="relative z-10 flex items-center justify-center">
            <Brain className="w-6 h-6 sm:w-7 sm:h-7 group-hover:scale-110 transition-transform duration-200" />
          </div>

          {/* Notification badge */}
          <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full border-2 border-white flex items-center justify-center">
            <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
          </div>
        </Button>

        {/* Floating label - hidden on mobile */}
        <div className="hidden sm:block absolute -top-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <div className="bg-black/80 text-white text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap">
            AI Career Mentor
          </div>
        </div>
      </motion.div>
    </div>
  )
}
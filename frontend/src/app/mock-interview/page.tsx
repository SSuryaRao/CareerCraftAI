'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Navbar from '@/components/layout/navbar'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { useAuth } from '@/components/auth-provider'
import {
  MessageSquareText,
  BrainCircuit,
  Target,
  PlayCircle,
  Mic,
  MicOff,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Clock,
  TrendingUp,
  BookOpen,
  Zap,
  Users,
  Award,
  BarChart3,
  XCircle
} from 'lucide-react'
import { questionPools, AptitudeQuestion } from '@/data/aptitude-questions'
import { getRandomQuestions, calculateScore, formatTime, getCategoryKey, getQuestionPoolKey, getTestMetadata } from '@/lib/aptitude-utils'
import { IntelligentInterviewMain } from '@/components/intelligent-interview/IntelligentInterviewMain'

// Mock data
const domains = [
  { value: 'data-science', label: 'Data Science' },
  { value: 'web-development', label: 'Web Development' },
  { value: 'cybersecurity', label: 'Cybersecurity' },
  { value: 'cloud-computing', label: 'Cloud Computing' },
  { value: 'ai-ml', label: 'AI/Machine Learning' },
  { value: 'mobile-development', label: 'Mobile Development' },
]

const rolesByDomain: { [key: string]: { value: string; label: string }[] } = {
  'data-science': [
    { value: 'data-scientist', label: 'Data Scientist' },
    { value: 'data-analyst', label: 'Data Analyst' },
    { value: 'ml-engineer', label: 'ML Engineer' },
    { value: 'data-engineer', label: 'Data Engineer' },
  ],
  'web-development': [
    { value: 'frontend-developer', label: 'Frontend Developer' },
    { value: 'backend-developer', label: 'Backend Developer' },
    { value: 'fullstack-developer', label: 'Full-Stack Developer' },
    { value: 'ui-ux-designer', label: 'UI/UX Designer' },
  ],
  'cybersecurity': [
    { value: 'security-analyst', label: 'Security Analyst' },
    { value: 'penetration-tester', label: 'Penetration Tester' },
    { value: 'security-engineer', label: 'Security Engineer' },
    { value: 'incident-responder', label: 'Incident Response Specialist' },
  ],
  // Add more as needed...
}

const mockInterviewQuestions = [
  "Tell me about yourself and your background.",
  "What interests you about this role?",
  "Describe a challenging project you worked on.",
  "How do you stay updated with industry trends?",
  "What are your strengths and weaknesses?",
]

const aptitudeTestSets = [
  {
    id: 1,
    title: "Logical Reasoning",
    description: "Test your logical thinking and problem-solving abilities",
    questions: 15,
    duration: "20 minutes",
    difficulty: "Medium",
    icon: BrainCircuit,
    color: "from-purple-500 to-indigo-600"
  },
  {
    id: 2,
    title: "Quantitative Aptitude",
    description: "Mathematical reasoning and numerical problem solving",
    questions: 20,
    duration: "25 minutes", 
    difficulty: "Medium",
    icon: BarChart3,
    color: "from-blue-500 to-cyan-600"
  },
  {
    id: 3,
    title: "Verbal Ability",
    description: "Language comprehension and communication skills",
    questions: 12,
    duration: "15 minutes",
    difficulty: "Easy",
    icon: BookOpen,
    color: "from-green-500 to-emerald-600"
  },
]


type Mode = 'selection' | 'interview' | 'aptitude'
type TabMode = 'interview-tab' | 'aptitude-tab' | 'intelligent-tab'

export default function MockInterviewPage() {
  const { user } = useAuth()
  const [mode, setMode] = useState<Mode>('selection')
  const [activeTab, setActiveTab] = useState<TabMode>('intelligent-tab')
  const [selectedDomain, setSelectedDomain] = useState('')
  const [selectedRole, setSelectedRole] = useState('')
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [answers, setAnswers] = useState<string[]>([])
  const [isRecording, setIsRecording] = useState(false)

  // Aptitude test state
  const [selectedAptitudeTest, setSelectedAptitudeTest] = useState<number | null>(null)
  const [testQuestions, setTestQuestions] = useState<AptitudeQuestion[]>([])
  const [currentAptitudeQuestion, setCurrentAptitudeQuestion] = useState(0)
  const [aptitudeAnswers, setAptitudeAnswers] = useState<(number | null)[]>([])
  const [showResults, setShowResults] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [timeTaken, setTimeTaken] = useState(0)

  const availableRoles = selectedDomain ? rolesByDomain[selectedDomain] || [] : []
  const currentTestQuestion = testQuestions[currentAptitudeQuestion]
  const selectedOption = aptitudeAnswers[currentAptitudeQuestion] ?? null

  // Timer effect for aptitude test
  useEffect(() => {
    if (mode === 'aptitude' && !showResults && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleSubmitTest()
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [mode, showResults, timeRemaining])

  const handleStartInterview = () => {
    if (selectedDomain && selectedRole) {
      setMode('interview')
      setCurrentQuestionIndex(0)
      setAnswers([])
      setUserAnswer('')
    }
  }

  const saveInterviewSession = async () => {
    if (!user) return;

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      const response = await fetch(`${API_BASE_URL}/api/mock-interview/interview-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: user.uid,
          domain: selectedDomain,
          role: selectedRole,
          questionsAnswered: answers.filter(a => a.trim()).length,
          totalQuestions: mockInterviewQuestions.length,
          answers: mockInterviewQuestions.map((q, i) => ({
            question: q,
            answer: answers[i] || '',
            timestamp: new Date()
          }))
        })
      })

      if (response.ok) {
        console.log('Interview session saved successfully')
      }
    } catch (error) {
      console.error('Error saving interview session:', error)
    }
  }

  const handleNextQuestion = () => {
    const newAnswers = [...answers]
    newAnswers[currentQuestionIndex] = userAnswer
    setAnswers(newAnswers)

    if (currentQuestionIndex < mockInterviewQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setUserAnswer('')
    } else {
      // Interview complete - save results
      saveInterviewSession()
      alert('Interview completed! Your responses have been saved.')
      resetToSelection()
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
      setUserAnswer(answers[currentQuestionIndex - 1] || '')
    }
  }

  const handleStartAptitudeTest = (testId: number) => {
    const metadata = getTestMetadata(testId)
    const poolKey = getQuestionPoolKey(testId)
    const randomQuestions = getRandomQuestions(questionPools[poolKey], metadata.questionCount)

    setSelectedAptitudeTest(testId)
    setTestQuestions(randomQuestions)
    setCurrentAptitudeQuestion(0)
    setAptitudeAnswers(new Array(randomQuestions.length).fill(null))
    setShowResults(false)
    setTimeRemaining(metadata.duration)
    setTimeTaken(0)
    setMode('aptitude')
  }

  const handleSelectOption = (optionIndex: number) => {
    const newAnswers = [...aptitudeAnswers]
    newAnswers[currentAptitudeQuestion] = optionIndex
    setAptitudeAnswers(newAnswers)
  }

  const handleNextAptitudeQuestion = () => {
    if (currentAptitudeQuestion < testQuestions.length - 1) {
      setCurrentAptitudeQuestion(currentAptitudeQuestion + 1)
    }
  }

  const handlePreviousAptitudeQuestion = () => {
    if (currentAptitudeQuestion > 0) {
      setCurrentAptitudeQuestion(currentAptitudeQuestion - 1)
    }
  }

  const saveAptitudeTestResult = async (timeTaken: number) => {
    if (!user) return;

    try {
      const score = calculateScore(testQuestions, aptitudeAnswers)

      // Get test metadata
      const testSet = aptitudeTestSets.find(t => t.id === selectedAptitudeTest)
      if (!testSet) {
        console.error('Test set not found')
        return
      }

      // Calculate topic performance
      const topicPerformance: { [topic: string]: { correct: number; total: number } } = {}
      testQuestions.forEach((q, index) => {
        if (!topicPerformance[q.topic]) {
          topicPerformance[q.topic] = { correct: 0, total: 0 }
        }
        topicPerformance[q.topic].total++
        if (aptitudeAnswers[index] === q.correctAnswer) {
          topicPerformance[q.topic].correct++
        }
      })

      const topicPerformanceArray = Object.keys(topicPerformance).map(topic => ({
        topic,
        correct: topicPerformance[topic].correct,
        total: topicPerformance[topic].total,
        percentage: Math.round((topicPerformance[topic].correct / topicPerformance[topic].total) * 100)
      }))

      const payload = {
        userId: user.uid,
        testId: selectedAptitudeTest!,
        testType: getCategoryKey(selectedAptitudeTest!),
        testTitle: testSet.title,
        score: score.correctCount,
        percentage: score.percentage,
        timeTaken: timeTaken,
        totalQuestions: testQuestions.length,
        correctAnswers: score.correctCount,
        incorrectAnswers: score.incorrectCount,
        unanswered: aptitudeAnswers.filter(a => a === null).length,
        topicPerformance: topicPerformanceArray
      }

      console.log('📤 Sending aptitude test result:', payload)

      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      const response = await fetch(`${API_BASE_URL}/api/mock-interview/aptitude-result`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        console.log('Aptitude test result saved successfully')
        const data = await response.json()
        console.log('Saved result:', data)
      } else {
        console.error('Failed to save test result:', await response.text())
      }
    } catch (error) {
      console.error('Error saving aptitude test result:', error)
    }
  }

  const handleSubmitTest = () => {
    const metadata = getTestMetadata(selectedAptitudeTest!)
    const taken = metadata.duration - timeRemaining
    setTimeTaken(taken)
    setShowResults(true)
    saveAptitudeTestResult(taken)
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)
    // In real implementation, this would start/stop voice recording
  }

  const resetToSelection = () => {
    setMode('selection')
    setSelectedDomain('')
    setSelectedRole('')
    setSelectedAptitudeTest(null)
    setShowResults(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <Navbar />

      {/* Hero Header */}
      <div className="relative overflow-hidden mt-20">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-purple-600/10 dark:from-blue-500/5 dark:via-indigo-500/5 dark:to-purple-500/5" />
        
        <div className="relative max-w-7xl mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="flex items-center justify-center mb-8">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur-xl opacity-50 animate-pulse" />
                <div className="relative p-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl">
                  <MessageSquareText className="w-10 h-10 text-white" />
                </div>
              </motion.div>
            </div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-6xl font-bold mb-6"
            >
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                AI Mock Interview
              </span>
              <br />
              <span className="text-gray-800 dark:text-gray-100">&amp; Aptitude Practice</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed"
            >
              Prepare for your dream role with AI-driven interview questions and comprehensive aptitude practice tests.
              <span className="text-indigo-600 dark:text-indigo-400 font-semibold"> Build confidence and ace your next interview!</span>
            </motion.p>

            {/* Mode Toggle */}
            {mode === 'selection' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex justify-center space-x-4 mb-8"
              >
                <div className="flex gap-4 bg-gray-100/50 dark:bg-slate-800/50 rounded-2xl p-2 backdrop-blur-sm">
                  <Button
                    onClick={() => setActiveTab('intelligent-tab')}
                    variant={activeTab === 'intelligent-tab' ? 'default' : 'ghost'}
                    className={`flex-1 font-semibold text-base py-6 transition-all duration-300 ${
                      activeTab === 'intelligent-tab'
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                        : 'bg-white/80 dark:bg-slate-700/80 text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-slate-700 hover:shadow-md'
                    }`}
                  >
                    <Zap className="w-5 h-5 mr-2" />
                    AI Interview
                  </Button>
                  {/* <Button
                    onClick={() => setActiveTab('interview-tab')}
                    variant={activeTab === 'interview-tab' ? 'default' : 'ghost'}
                    className={`transition-all duration-300 ${
                      activeTab === 'interview-tab'
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md'
                        : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50'
                    }`}
                  >
                    <MessageSquareText className="w-4 h-4 mr-2" />
                    Basic Interview
                  </Button> */}
                  <Button
                    onClick={() => setActiveTab('aptitude-tab')}
                    variant={activeTab === 'aptitude-tab' ? 'default' : 'ghost'}
                    className={`flex-1 font-semibold text-base py-6 transition-all duration-300 ${
                      activeTab === 'aptitude-tab'
                        ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg'
                        : 'bg-white/80 dark:bg-slate-700/80 text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-white dark:hover:bg-slate-700 hover:shadow-md'
                    }`}
                  >
                    <BrainCircuit className="w-5 h-5 mr-2" />
                    Aptitude Tests
                  </Button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        {mode === 'selection' && (
          <>
            {/* Intelligent AI Interview Section */}
            {activeTab === 'intelligent-tab' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <IntelligentInterviewMain />
              </motion.div>
            )}

            {/* Mock Interview Section */}
            {activeTab === 'interview-tab' && (
              <>
                {/* Role & Domain Selector */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="mb-12"
                >
                  <Card className="p-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl dark:shadow-2xl dark:shadow-slate-950/50">
                    <div className="flex items-center mb-6">
                      <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl mr-4 shadow-lg">
                        <Target className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">Select Your Role & Domain</h2>
                        <p className="text-gray-600 dark:text-gray-400">Choose your target domain and specific role for tailored interview questions</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                          🎯 Career Domain
                        </label>
                        <Select
                          options={domains}
                          value={selectedDomain}
                          onValueChange={(value) => {
                            setSelectedDomain(value)
                            setSelectedRole('')
                          }}
                          placeholder="Select a domain"
                          className="text-base"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                          👤 Job Role
                        </label>
                        <Select
                          options={availableRoles}
                          value={selectedRole}
                          onValueChange={setSelectedRole}
                          placeholder="Select a role"
                          className="text-base"
                          disabled={!selectedDomain}
                        />
                      </div>
                    </div>

                    <Button
                      onClick={handleStartInterview}
                      disabled={!selectedDomain || !selectedRole}
                      className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 px-8 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <PlayCircle className="w-5 h-5 mr-2" />
                      Start Mock Interview
                    </Button>
                  </Card>
                </motion.div>

                {/* Interview Features */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="mb-12"
                >
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                      Why Choose <span className="text-blue-600 dark:text-blue-400">AI Mock Interview?</span>
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                      Get personalized, role-specific interview preparation
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="p-6 text-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/30 dark:to-indigo-950/30 border-0 shadow-lg hover:shadow-xl dark:shadow-2xl dark:shadow-slate-950/50 transition-all duration-300">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <MessageSquareText className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Role-Specific Questions</h3>
                      <p className="text-gray-600 dark:text-gray-400">Get questions tailored to your target job role and domain</p>
                    </Card>

                    <Card className="p-6 text-center bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950/30 dark:to-emerald-950/30 border-0 shadow-lg hover:shadow-xl dark:shadow-2xl dark:shadow-slate-950/50 transition-all duration-300">
                      <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Mic className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Voice & Text Answers</h3>
                      <p className="text-gray-600 dark:text-gray-400">Practice with both written and voice responses</p>
                    </Card>

                    <Card className="p-6 text-center bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-950/30 dark:to-pink-950/30 border-0 shadow-lg hover:shadow-xl dark:shadow-2xl dark:shadow-slate-950/50 transition-all duration-300">
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <TrendingUp className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Progress Tracking</h3>
                      <p className="text-gray-600 dark:text-gray-400">Monitor your preparation progress and improvements</p>
                    </Card>
                  </div>
                </motion.div>
              </>
            )}

            {/* Aptitude Tests Section */}
            {activeTab === 'aptitude-tab' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                    Practice <span className="text-purple-600 dark:text-purple-400">Aptitude Tests</span>
                  </h2>
                  <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    Sharpen your skills with our comprehensive aptitude test series
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {aptitudeTestSets.map((test, index) => {
                    const Icon = test.icon
                    return (
                      <motion.div
                        key={test.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 + index * 0.1 }}
                      >
                        <Card className="group p-6 h-full bg-white dark:bg-slate-800/80 border-0 shadow-lg hover:shadow-2xl dark:shadow-2xl dark:shadow-slate-950/50 transition-all duration-500 hover:scale-[1.02]">
                          <div className="flex items-center mb-4">
                            <div className={`p-3 rounded-2xl bg-gradient-to-r ${test.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                              <Icon className="w-6 h-6 text-white" />
                            </div>
                            <div className="ml-4">
                              <Badge className={`px-2 py-1 text-xs font-semibold bg-gradient-to-r ${test.color} text-white border-0`}>
                                {test.difficulty}
                              </Badge>
                            </div>
                          </div>

                          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                            {test.title}
                          </h3>

                          <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                            {test.description}
                          </p>

                          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-6">
                            <div className="flex items-center">
                              <Users className="w-4 h-4 mr-1" />
                              {test.questions} questions
                            </div>
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {test.duration}
                            </div>
                          </div>

                          <Button
                            onClick={() => handleStartAptitudeTest(test.id)}
                            className={`w-full bg-gradient-to-r ${test.color} text-white shadow-lg group-hover:shadow-xl transition-all duration-300`}
                          >
                            <PlayCircle className="w-4 h-4 mr-2" />
                            Start Test
                          </Button>
                        </Card>
                      </motion.div>
                    )
                  })}
                </div>
              </motion.div>
            )}
          </>
        )}

        {/* Mock Interview Mode */}
        {mode === 'interview' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Interview Progress Panel */}
            <div className="lg:col-span-1">
              <Card className="p-6 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-0 shadow-xl dark:shadow-2xl dark:shadow-slate-950/50 sticky top-24">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <MessageSquareText className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Interview Progress</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <span>Questions</span>
                      <span>{currentQuestionIndex + 1}/{mockInterviewQuestions.length}</span>
                    </div>
                    <Progress value={(currentQuestionIndex + 1) / mockInterviewQuestions.length * 100} className="h-3" />
                  </div>

                  <div className="pt-4 border-t border-gray-200 dark:border-slate-700">
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Target className="w-4 h-4 mr-2 text-indigo-500 dark:text-indigo-400" />
                        <span>{rolesByDomain[selectedDomain]?.find(r => r.value === selectedRole)?.label}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <BookOpen className="w-4 h-4 mr-2 text-blue-500 dark:text-blue-400" />
                        <span>{domains.find(d => d.value === selectedDomain)?.label}</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={resetToSelection}
                    variant="outline"
                    className="w-full mt-6"
                  >
                    End Interview
                  </Button>
                </div>
              </Card>
            </div>

            {/* Main Interview Area */}
            <div className="lg:col-span-3">
              <Card className="p-8 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-0 shadow-xl dark:shadow-2xl dark:shadow-slate-950/50">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <Badge className="px-3 py-1 bg-blue-100 dark:bg-blue-950/50 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-800">
                      Question {currentQuestionIndex + 1} of {mockInterviewQuestions.length}
                    </Badge>
                    <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span>No time limit</span>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-2xl p-6 border border-blue-200 dark:border-blue-900">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 leading-relaxed">
                      {mockInterviewQuestions[currentQuestionIndex]}
                    </h2>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-lg font-semibold text-gray-900 dark:text-gray-100">Your Answer</label>
                      <Button
                        onClick={toggleRecording}
                        variant="outline"
                        size="sm"
                        className={`flex items-center space-x-2 ${isRecording ? 'bg-red-50 dark:bg-red-950/30 border-red-300 dark:border-red-800 text-red-700 dark:text-red-400' : 'bg-gray-50 dark:bg-slate-900 border-gray-300 dark:border-slate-700 text-gray-600 dark:text-gray-400'}`}
                      >
                        {isRecording ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                        <span>{isRecording ? 'Recording...' : 'Voice Answer'}</span>
                      </Button>
                    </div>

                    <Textarea
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder="Type your answer here or use voice recording..."
                      className="min-h-[120px] text-base resize-none border-gray-300 dark:border-slate-700 focus:border-indigo-500 focus:ring-indigo-500 dark:bg-slate-900 dark:text-gray-100"
                    />
                  </div>

                  <div className="flex justify-between">
                    <Button
                      onClick={handlePreviousQuestion}
                      disabled={currentQuestionIndex === 0}
                      variant="outline"
                      className="flex items-center space-x-2"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Previous</span>
                    </Button>
                    
                    <Button
                      onClick={handleNextQuestion}
                      disabled={!userAnswer.trim()}
                      className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                    >
                      <span>{currentQuestionIndex === mockInterviewQuestions.length - 1 ? 'Complete' : 'Next Question'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Aptitude Test Mode */}
        {mode === 'aptitude' && !showResults && testQuestions.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Test Progress Panel */}
            <div className="lg:col-span-1">
              <Card className="p-6 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-0 shadow-xl dark:shadow-2xl dark:shadow-slate-950/50 sticky top-24">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <BrainCircuit className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Test Progress</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <span>Question</span>
                      <span>{currentAptitudeQuestion + 1}/{testQuestions.length}</span>
                    </div>
                    <Progress value={((currentAptitudeQuestion + 1) / testQuestions.length) * 100} className="h-3" />
                  </div>

                  <div className="pt-4 border-t border-gray-200 dark:border-slate-700">
                    <div className="text-center">
                      <div className={`text-2xl font-bold mb-1 ${timeRemaining < 60 ? 'text-red-600 dark:text-red-400 animate-pulse' : 'text-indigo-600 dark:text-indigo-400'}`}>
                        {formatTime(timeRemaining)}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Time Remaining</div>
                    </div>
                  </div>

                  {/* Question Navigation Grid */}
                  <div className="pt-4 border-t border-gray-200 dark:border-slate-700">
                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-2 font-semibold">Quick Navigation</div>
                    <div className="grid grid-cols-5 gap-2">
                      {testQuestions.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentAptitudeQuestion(index)}
                          className={`w-full h-8 rounded-lg text-xs font-semibold transition-all ${
                            index === currentAptitudeQuestion
                              ? 'bg-indigo-600 dark:bg-indigo-500 text-white ring-2 ring-indigo-300 dark:ring-indigo-400'
                              : aptitudeAnswers[index] !== null
                              ? 'bg-green-100 dark:bg-green-950/50 text-green-700 dark:text-green-400 border border-green-300 dark:border-green-800'
                              : 'bg-gray-100 dark:bg-slate-900 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-slate-700 hover:bg-gray-200 dark:hover:bg-slate-800'
                          }`}
                        >
                          {index + 1}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-3">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-100 dark:bg-green-950/50 border border-green-300 dark:border-green-800 rounded mr-1"></div>
                        <span>Answered</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-gray-100 dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded mr-1"></div>
                        <span>Unanswered</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={resetToSelection}
                    variant="outline"
                    className="w-full mt-6"
                  >
                    End Test
                  </Button>
                </div>
              </Card>
            </div>

            {/* Main Test Area */}
            <div className="lg:col-span-3">
              <Card className="p-8 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-0 shadow-xl dark:shadow-2xl dark:shadow-slate-950/50">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <Badge className="px-3 py-1 bg-purple-100 dark:bg-purple-950/50 text-purple-800 dark:text-purple-300 border border-purple-300 dark:border-purple-800">
                      Question {currentAptitudeQuestion + 1} of {testQuestions.length}
                    </Badge>
                    <Badge className="px-3 py-1 bg-blue-100 dark:bg-blue-950/50 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-800">
                      {currentTestQuestion?.topic.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Badge>
                  </div>

                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 rounded-2xl p-6 border border-purple-200 dark:border-purple-900">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 leading-relaxed">
                      {currentTestQuestion?.question}
                    </h2>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  {currentTestQuestion?.options.map((option, index) => (
                    <div
                      key={index}
                      onClick={() => handleSelectOption(index)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                        selectedOption === index
                          ? 'border-indigo-500 dark:border-indigo-400 bg-indigo-50 dark:bg-indigo-950/30 ring-2 ring-indigo-200 dark:ring-indigo-800'
                          : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-gray-300 dark:hover:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center">
                        <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center ${
                          selectedOption === index
                            ? 'border-indigo-500 dark:border-indigo-400 bg-indigo-500 dark:bg-indigo-400'
                            : 'border-gray-300 dark:border-slate-600'
                        }`}>
                          {selectedOption === index && <div className="w-2 h-2 bg-white rounded-full" />}
                        </div>
                        <span className="text-lg text-gray-800 dark:text-gray-200">{option}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center">
                  <Button
                    onClick={handlePreviousAptitudeQuestion}
                    disabled={currentAptitudeQuestion === 0}
                    variant="outline"
                    className="flex items-center space-x-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </Button>

                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {aptitudeAnswers.filter(a => a !== null).length} / {testQuestions.length} answered
                  </div>

                  {currentAptitudeQuestion < testQuestions.length - 1 ? (
                    <Button
                      onClick={handleNextAptitudeQuestion}
                      className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                    >
                      <span>Next Question</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmitTest}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Submit Test
                    </Button>
                  )}
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Aptitude Test Results */}
        {mode === 'aptitude' && showResults && testQuestions.length > 0 && (
          <div className="max-w-6xl mx-auto">
            <Card className="p-8 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-0 shadow-xl dark:shadow-2xl dark:shadow-slate-950/50">
              <div className="text-center mb-8">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg ${
                  calculateScore(testQuestions, aptitudeAnswers).percentage >= 50
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                    : 'bg-gradient-to-r from-orange-500 to-red-600'
                }`}>
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Test Completed!</h2>
                <p className="text-xl text-gray-600 dark:text-gray-400">Here are your detailed results</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-2xl p-6 border border-blue-200 dark:border-blue-900">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                    {calculateScore(testQuestions, aptitudeAnswers).correctCount}/{testQuestions.length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Correct Answers</div>
                </div>
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-2xl p-6 border border-green-200 dark:border-green-900">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                    {calculateScore(testQuestions, aptitudeAnswers).percentage}%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Accuracy</div>
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-2xl p-6 border border-purple-200 dark:border-purple-900">
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">{formatTime(timeTaken)}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Time Taken</div>
                </div>
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 rounded-2xl p-6 border border-orange-200 dark:border-orange-900">
                  <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">
                    {aptitudeAnswers.filter(a => a === null).length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Unanswered</div>
                </div>
              </div>

              {/* Detailed Question Review */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Question Review</h3>
                <div className="space-y-4">
                  {testQuestions.map((question, index) => {
                    const userAnswer = aptitudeAnswers[index]
                    const isCorrect = userAnswer === question.correctAnswer
                    const wasAnswered = userAnswer !== null

                    return (
                      <Card key={question.id} className={`p-6 border-2 ${
                        !wasAnswered
                          ? 'border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-900'
                          : isCorrect
                          ? 'border-green-300 dark:border-green-800 bg-green-50 dark:bg-green-950/30'
                          : 'border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/30'
                      }`}>
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                              !wasAnswered
                                ? 'bg-gray-400 dark:bg-gray-600'
                                : isCorrect
                                ? 'bg-green-600 dark:bg-green-500'
                                : 'bg-red-600 dark:bg-red-500'
                            }`}>
                              {index + 1}
                            </div>
                            <Badge className={`${
                              !wasAnswered
                                ? 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                                : isCorrect
                                ? 'bg-green-100 dark:bg-green-950/50 text-green-700 dark:text-green-400'
                                : 'bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-400'
                            }`}>
                              {!wasAnswered ? 'Not Answered' : isCorrect ? 'Correct' : 'Incorrect'}
                            </Badge>
                            <Badge className="bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400">
                              {question.topic.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </Badge>
                          </div>
                        </div>

                        <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">{question.question}</h4>

                        <div className="space-y-2 mb-4">
                          {question.options.map((option, optIndex) => {
                            const isUserAnswer = userAnswer === optIndex
                            const isCorrectAnswer = question.correctAnswer === optIndex

                            return (
                              <div
                                key={optIndex}
                                className={`p-3 rounded-lg border-2 flex items-center ${
                                  isCorrectAnswer
                                    ? 'border-green-500 dark:border-green-700 bg-green-100 dark:bg-green-950/30'
                                    : isUserAnswer
                                    ? 'border-red-500 dark:border-red-700 bg-red-100 dark:bg-red-950/30'
                                    : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900'
                                }`}
                              >
                                {isCorrectAnswer && <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-3" />}
                                {isUserAnswer && !isCorrectAnswer && <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 mr-3" />}
                                <span className={`${
                                  isCorrectAnswer ? 'font-semibold text-green-900 dark:text-green-300' : 'text-gray-800 dark:text-gray-200'
                                }`}>
                                  {option}
                                </span>
                                {isCorrectAnswer && <span className="ml-auto text-sm text-green-700 dark:text-green-400 font-semibold">Correct Answer</span>}
                                {isUserAnswer && !isCorrectAnswer && <span className="ml-auto text-sm text-red-700 dark:text-red-400 font-semibold">Your Answer</span>}
                              </div>
                            )
                          })}
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg p-4">
                          <div className="flex items-start">
                            <div className="p-2 bg-blue-600 dark:bg-blue-500 rounded-lg mr-3">
                              <BookOpen className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <h5 className="font-semibold text-blue-900 dark:text-blue-300 mb-1">Explanation</h5>
                              <p className="text-blue-800 dark:text-blue-200">{question.explanation}</p>
                            </div>
                          </div>
                        </div>
                      </Card>
                    )
                  })}
                </div>
              </div>

              <div className="flex justify-center space-x-4">
                <Button
                  onClick={() => handleStartAptitudeTest(selectedAptitudeTest!)}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                >
                  Retake Test
                </Button>
                <Button
                  onClick={resetToSelection}
                  variant="outline"
                >
                  Back to Tests
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
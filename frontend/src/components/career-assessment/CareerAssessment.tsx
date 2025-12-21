'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/components/auth-provider'
import {
  Brain,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Target,
  TrendingUp,
  Lightbulb,
  Award,
  BarChart3,
  Code,
  Shield,
  Cloud,
  Smartphone,
  Database,
  Zap
} from 'lucide-react'

interface Question {
  id: number
  question: string
  type: 'single-choice' | 'multi-choice' | 'rating'
  options?: string[]
  category: 'interest' | 'skills' | 'work-style' | 'background'
}

interface CareerRecommendation {
  domain: string
  confidence: number
  roles: string[]
  reasoning: string
  icon: any
  color: string
}

const assessmentQuestions: Question[] = [
  {
    id: 1,
    question: "Which activities excite you the most?",
    type: "multi-choice",
    category: "interest",
    options: [
      "Analyzing data and finding patterns",
      "Building websites and applications",
      "Protecting systems from threats",
      "Working with cloud infrastructure",
      "Creating mobile apps",
      "Developing AI/ML models"
    ]
  },
  {
    id: 2,
    question: "How would you rate your mathematical and statistical skills?",
    type: "rating",
    category: "skills",
    options: ["Beginner", "Basic", "Intermediate", "Advanced", "Expert"]
  },
  {
    id: 3,
    question: "What type of work environment do you prefer?",
    type: "single-choice",
    category: "work-style",
    options: [
      "Analytical - Working with data and insights",
      "Creative - Designing and building user experiences",
      "Security-focused - Protecting and securing systems",
      "Infrastructure - Managing scalable systems",
      "User-focused - Creating mobile experiences",
      "Research-oriented - Exploring AI and algorithms"
    ]
  },
  {
    id: 4,
    question: "Which programming languages are you familiar with?",
    type: "multi-choice",
    category: "skills",
    options: [
      "Python",
      "JavaScript/TypeScript",
      "Java/C++",
      "SQL",
      "Swift/Kotlin",
      "R/MATLAB"
    ]
  },
  {
    id: 5,
    question: "What interests you most about technology?",
    type: "single-choice",
    category: "interest",
    options: [
      "Extracting insights from data",
      "Creating interactive web experiences",
      "Ethical hacking and security",
      "Scalable cloud solutions",
      "Mobile-first development",
      "Artificial intelligence and automation"
    ]
  },
  {
    id: 6,
    question: "How comfortable are you with problem-solving and logic?",
    type: "rating",
    category: "skills",
    options: ["Beginner", "Basic", "Intermediate", "Advanced", "Expert"]
  },
  {
    id: 7,
    question: "What's your educational background?",
    type: "single-choice",
    category: "background",
    options: [
      "Mathematics/Statistics",
      "Computer Science/Engineering",
      "Information Security",
      "IT/Cloud Computing",
      "Mobile Development",
      "Data Science/AI",
      "Other/Self-taught"
    ]
  },
  {
    id: 8,
    question: "Which tools or technologies are you interested in learning?",
    type: "multi-choice",
    category: "interest",
    options: [
      "Pandas, NumPy, Tableau",
      "React, Node.js, databases",
      "Penetration testing, firewalls",
      "AWS, Docker, Kubernetes",
      "React Native, Flutter",
      "TensorFlow, PyTorch, NLP"
    ]
  }
]

const domainIcons: { [key: string]: any } = {
  'Data Science': Database,
  'Web Development': Code,
  'Cybersecurity': Shield,
  'Cloud Computing': Cloud,
  'Mobile Development': Smartphone,
  'AI/ML': Brain
}

const domainColors: { [key: string]: string } = {
  'Data Science': 'from-blue-500 to-cyan-600',
  'Web Development': 'from-green-500 to-emerald-600',
  'Cybersecurity': 'from-red-500 to-orange-600',
  'Cloud Computing': 'from-purple-500 to-indigo-600',
  'Mobile Development': 'from-pink-500 to-rose-600',
  'AI/ML': 'from-yellow-500 to-amber-600'
}

export default function CareerAssessment({ onComplete }: { onComplete?: (recommendations: CareerRecommendation[]) => void }) {
  const { user } = useAuth()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<{ [key: number]: any }>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [recommendations, setRecommendations] = useState<CareerRecommendation[]>([])

  const question = assessmentQuestions[currentQuestion]
  const progress = ((currentQuestion + 1) / assessmentQuestions.length) * 100

  const handleAnswer = (answer: any) => {
    setAnswers({ ...answers, [question.id]: answer })
  }

  const handleNext = () => {
    if (currentQuestion < assessmentQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      handleSubmit()
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      const response = await fetch(`${API_BASE_URL}/api/career-assessment/recommendations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: user?.uid,
          answers
        })
      })

      if (response.ok) {
        const data = await response.json()
        const formattedRecommendations = data.recommendations.map((rec: any) => ({
          ...rec,
          icon: domainIcons[rec.domain] || Target,
          color: domainColors[rec.domain] || 'from-gray-500 to-gray-600'
        }))
        setRecommendations(formattedRecommendations)
        setShowResults(true)
        if (onComplete) {
          onComplete(formattedRecommendations)
        }
      }
    } catch (error) {
      console.error('Error getting recommendations:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const isAnswered = answers[question.id] !== undefined && answers[question.id] !== null &&
    (Array.isArray(answers[question.id]) ? answers[question.id].length > 0 : true)

  if (showResults) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <Card className="p-8 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-0 shadow-xl">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
            >
              <CheckCircle className="w-10 h-10 text-white" />
            </motion.div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Your Career Recommendations
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Based on your responses, here are the best career paths for you
            </p>
          </div>

          <div className="space-y-6">
            {recommendations.map((rec, index) => {
              const Icon = rec.icon
              return (
                <motion.div
                  key={rec.domain}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6 border-2 border-gray-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 transition-all">
                    <div className="flex items-start gap-4">
                      <div className={`p-4 bg-gradient-to-r ${rec.color} rounded-2xl shadow-lg`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            {rec.domain}
                          </h3>
                          <Badge className="px-4 py-2 text-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0">
                            {rec.confidence}% Match
                          </Badge>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                          {rec.reasoning}
                        </p>
                        <div>
                          <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Recommended Roles:
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {rec.roles.map((role) => (
                              <Badge
                                key={role}
                                className="px-3 py-1 bg-blue-100 dark:bg-blue-950/50 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-800"
                              >
                                {role}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="mt-4">
                          <Progress value={rec.confidence} className="h-2" />
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </div>

          <div className="mt-8 text-center">
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="mr-4"
            >
              Retake Assessment
            </Button>
            <Button
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
            >
              <Target className="w-4 h-4 mr-2" />
              Start Aptitude Tests
            </Button>
          </div>
        </Card>
      </motion.div>
    )
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="p-12 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-0 shadow-xl">
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-6"
            />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Analyzing Your Responses...
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Our AI is determining the best career paths for you
            </p>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="p-8 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-0 shadow-xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                Question {currentQuestion + 1} of {assessmentQuestions.length}
              </span>
            </div>
            <Badge className="px-3 py-1 bg-indigo-100 dark:bg-indigo-950/50 text-indigo-800 dark:text-indigo-300">
              {question.category.replace('-', ' ').toUpperCase()}
            </Badge>
          </div>
          <Progress value={progress} className="h-3" />
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-8">
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-2xl p-6 border border-indigo-200 dark:border-indigo-900">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 leading-relaxed">
                  {question.question}
                </h3>
              </div>
            </div>

            {/* Options */}
            <div className="space-y-3 mb-8">
              {question.type === 'rating' && question.options && (
                <div className="grid grid-cols-5 gap-3">
                  {question.options.map((option, index) => (
                    <button
                      key={option}
                      onClick={() => handleAnswer(index)}
                      className={`p-4 rounded-xl border-2 text-center transition-all ${
                        answers[question.id] === index
                          ? 'border-indigo-500 dark:border-indigo-400 bg-indigo-50 dark:bg-indigo-950/30 ring-2 ring-indigo-200 dark:ring-indigo-800'
                          : 'border-gray-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600'
                      }`}
                    >
                      <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-1">
                        {index + 1}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">{option}</div>
                    </button>
                  ))}
                </div>
              )}

              {question.type === 'single-choice' && question.options && (
                <div className="space-y-3">
                  {question.options.map((option, index) => (
                    <button
                      key={option}
                      onClick={() => handleAnswer(index)}
                      className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                        answers[question.id] === index
                          ? 'border-indigo-500 dark:border-indigo-400 bg-indigo-50 dark:bg-indigo-950/30 ring-2 ring-indigo-200 dark:ring-indigo-800'
                          : 'border-gray-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600'
                      }`}
                    >
                      <div className="flex items-center">
                        <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center ${
                          answers[question.id] === index
                            ? 'border-indigo-500 dark:border-indigo-400 bg-indigo-500 dark:bg-indigo-400'
                            : 'border-gray-300 dark:border-slate-600'
                        }`}>
                          {answers[question.id] === index && <div className="w-2 h-2 bg-white rounded-full" />}
                        </div>
                        <span className="text-lg text-gray-800 dark:text-gray-200">{option}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {question.type === 'multi-choice' && question.options && (
                <div className="space-y-3">
                  {question.options.map((option, index) => {
                    const selectedOptions = answers[question.id] || []
                    const isSelected = selectedOptions.includes(index)

                    return (
                      <button
                        key={option}
                        onClick={() => {
                          const current = answers[question.id] || []
                          const updated = isSelected
                            ? current.filter((i: number) => i !== index)
                            : [...current, index]
                          handleAnswer(updated)
                        }}
                        className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                          isSelected
                            ? 'border-indigo-500 dark:border-indigo-400 bg-indigo-50 dark:bg-indigo-950/30 ring-2 ring-indigo-200 dark:ring-indigo-800'
                            : 'border-gray-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600'
                        }`}
                      >
                        <div className="flex items-center">
                          <div className={`w-5 h-5 rounded border-2 mr-4 flex items-center justify-center ${
                            isSelected
                              ? 'border-indigo-500 dark:border-indigo-400 bg-indigo-500 dark:bg-indigo-400'
                              : 'border-gray-300 dark:border-slate-600'
                          }`}>
                            {isSelected && <CheckCircle className="w-4 h-4 text-white" />}
                          </div>
                          <span className="text-lg text-gray-800 dark:text-gray-200">{option}</span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </Button>

          <div className="text-sm text-gray-500 dark:text-gray-400">
            {isAnswered ? (
              <span className="text-green-600 dark:text-green-400 font-semibold flex items-center gap-1">
                <CheckCircle className="w-4 h-4" />
                Answered
              </span>
            ) : (
              'Please select an answer'
            )}
          </div>

          <Button
            onClick={handleNext}
            disabled={!isAnswered}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
          >
            {currentQuestion === assessmentQuestions.length - 1 ? (
              <>
                <Sparkles className="w-4 h-4" />
                Get Recommendations
              </>
            ) : (
              <>
                Next
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </Card>
    </div>
  )
}

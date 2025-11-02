'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PlayCircle,
  StopCircle,
  Send,
  Loader2,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Sparkles
} from 'lucide-react'
import { useMediaRecorder } from '@/hooks/useMediaRecorder'
import { intelligentInterviewApi, SessionData, Question, Answer, AnalysisResult } from '@/lib/intelligentInterviewApi'
import toast from 'react-hot-toast'

interface InterviewSessionProps {
  sessionData: SessionData
  userId: string
  onComplete: (answers: Answer[]) => void
  onCancel: () => void
}

export function InterviewSession({ sessionData, userId, onComplete, onCancel }: InterviewSessionProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [textAnswer, setTextAnswer] = useState('')
  const [answers, setAnswers] = useState<Answer[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [showPreview, setShowPreview] = useState(false)

  const videoPreviewRef = useRef<HTMLVideoElement>(null)

  const {
    isRecording,
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
    resetRecording,
    hasPermission,
    permissionError
  } = useMediaRecorder({
    recordingType: sessionData.analysisMode === 'advanced' ? 'video' : 'audio',
    maxRecordingTime: 600, // 10 minutes max (increased from default 5 minutes)
    onMaxTimeReached: () => {
      toast.error('Maximum recording time (10 minutes) reached. Recording stopped automatically.')
    },
    onError: (error) => {
      toast.error(`Recording error: ${error.message}`)
    }
  })

  const currentQuestion = sessionData.questions[currentQuestionIndex]
  const isLastQuestion = currentQuestionIndex === sessionData.questions.length - 1

  // Update video preview
  useEffect(() => {
    if (videoUrl && videoPreviewRef.current) {
      videoPreviewRef.current.src = videoUrl
    }
  }, [videoUrl])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleStartRecording = async () => {
    try {
      await startRecording()
      toast.success('Recording started')
    } catch (error) {
      toast.error('Failed to start recording')
    }
  }

  const handleStopRecording = () => {
    stopRecording()
    setShowPreview(true)
    toast.success('Recording stopped')
  }

  const handleAnalyzeResponse = async () => {
    if (sessionData.analysisMode === 'standard' && !textAnswer.trim()) {
      toast.error('Please provide a text answer')
      return
    }

    if (sessionData.analysisMode === 'advanced' && !audioBlob) {
      toast.error('Please record your answer first')
      return
    }

    setIsAnalyzing(true)
    setAnalysisProgress(0)

    // Simulate progress for user feedback
    const progressInterval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 10
      })
    }, 500)

    try {
      let analysis: AnalysisResult

      if (sessionData.analysisMode === 'standard') {
        analysis = await intelligentInterviewApi.analyzeResponseStandard(
          currentQuestion.questionText,
          textAnswer,
          sessionData.domainId,
          sessionData.level,
          currentQuestion.keywords
        )
      } else {
        analysis = await intelligentInterviewApi.analyzeResponseAdvanced(
          currentQuestion.questionText,
          audioBlob!,
          videoBlob,
          sessionData.domainId,
          sessionData.level,
          userId,
          sessionData.sessionId,
          currentQuestion.keywords,
          (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            setAnalysisProgress(Math.min(percentCompleted, 90))
          }
        )
      }

      setAnalysisProgress(100)

      const answer: Answer = {
        question: currentQuestion.questionText,
        questionData: currentQuestion,
        answer: sessionData.analysisMode === 'standard' ? textAnswer : undefined,
        transcription: analysis.transcription,
        analysis,
        timestamp: new Date().toISOString()
      }

      setAnswers([...answers, answer])

      toast.success('Analysis complete!')

      // Move to next question after a short delay
      setTimeout(() => {
        if (isLastQuestion) {
          onComplete([...answers, answer])
        } else {
          handleNextQuestion()
        }
      }, 1500)

    } catch (error) {
      console.error('Error analyzing response:', error)
      toast.error('Failed to analyze response. Please try again.')
    } finally {
      clearInterval(progressInterval)
      setIsAnalyzing(false)
    }
  }

  const handleNextQuestion = () => {
    setCurrentQuestionIndex(currentQuestionIndex + 1)
    setTextAnswer('')
    resetRecording()
    setShowPreview(false)
    setAnalysisProgress(0)
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
      const previousAnswer = answers[currentQuestionIndex - 1]
      if (previousAnswer) {
        setTextAnswer(previousAnswer.answer || '')
      }
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Progress Panel */}
      <div className="lg:col-span-1">
        <Card className="p-6 bg-white dark:bg-gray-800 sticky top-24">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Interview Progress</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{sessionData.domain}</p>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                <span>Question</span>
                <span>{currentQuestionIndex + 1}/{sessionData.totalQuestions}</span>
              </div>
              <Progress
                value={(currentQuestionIndex + 1) / sessionData.totalQuestions * 100}
                className="h-3"
              />
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="space-y-3">
                {sessionData.questions.map((q, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center space-x-2 p-2 rounded-lg ${
                      idx === currentQuestionIndex
                        ? 'bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-300 dark:border-indigo-700'
                        : idx < currentQuestionIndex
                        ? 'bg-green-50 dark:bg-green-900/30 border border-green-300 dark:border-green-700'
                        : 'bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      idx === currentQuestionIndex
                        ? 'bg-indigo-600 text-white'
                        : idx < currentQuestionIndex
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                    }`}>
                      {idx < currentQuestionIndex ? <CheckCircle className="w-4 h-4" /> : idx + 1}
                    </div>
                    <span className="text-xs text-gray-700 dark:text-gray-300 truncate">{q.category}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <Badge className="w-full justify-center bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-700">
                {sessionData.analysisMode === 'advanced' ? 'Advanced' : 'Standard'} Mode
              </Badge>
            </div>

            <Button
              onClick={onCancel}
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
        <Card className="p-8 bg-white dark:bg-gray-800">
          <AnimatePresence mode="wait">
            {!isAnalyzing ? (
              <motion.div
                key="question"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {/* Question */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <Badge className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700">
                      Question {currentQuestionIndex + 1} of {sessionData.totalQuestions}
                    </Badge>
                    <Badge className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-700">
                      {currentQuestion.difficulty}
                    </Badge>
                  </div>

                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-6 border border-indigo-200 dark:border-indigo-800 mb-2">
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white leading-relaxed">
                      {currentQuestion.questionText}
                    </h2>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-3">
                    {currentQuestion.keywords.map((keyword, idx) => (
                      <Badge key={idx} className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-0 text-xs">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Answer Section */}
                <div className="space-y-6">
                  {sessionData.analysisMode === 'standard' ? (
                    /* Text Answer Mode */
                    <div>
                      <label className="text-lg font-semibold text-gray-900 mb-3 block">
                        Your Answer
                      </label>
                      <Textarea
                        value={textAnswer}
                        onChange={(e) => setTextAnswer(e.target.value)}
                        placeholder="Type your detailed answer here..."
                        className="min-h-[200px] text-base resize-none border-gray-300 focus:border-indigo-500"
                      />
                    </div>
                  ) : (
                    /* Recording Mode */
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <label className="text-lg font-semibold text-gray-900 dark:text-white">
                          Record Your Answer
                        </label>
                        <div className="flex items-center gap-2">
                          {isRecording && (
                            <>
                              <Badge className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700 animate-pulse">
                                <div className="w-2 h-2 bg-red-600 rounded-full mr-2"></div>
                                Recording: {formatTime(recordingTime)}
                              </Badge>
                              {isApproachingLimit && (
                                <Badge className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-300 dark:border-orange-700 animate-pulse">
                                  ⏰ {remainingTime}s left
                                </Badge>
                              )}
                            </>
                          )}
                        </div>
                      </div>

                      {permissionError && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg p-4 mb-4">
                          <p className="text-sm text-red-700 dark:text-red-400">
                            Permission Error: {permissionError}. Please allow camera and microphone access.
                          </p>
                        </div>
                      )}

                      {!isRecording && !audioBlob && !videoBlob && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-300 dark:border-blue-700 rounded-lg p-4 mb-4">
                          <p className="text-sm text-blue-700 dark:text-blue-400">
                            ℹ️ Maximum recording time: {Math.floor(maxRecordingTime / 60)} minutes. Recording will automatically stop when limit is reached.
                          </p>
                        </div>
                      )}

                      <div className="bg-gray-50 rounded-xl p-6 border-2 border-dashed border-gray-300">
                        {showPreview && videoUrl ? (
                          <div>
                            <video
                              ref={videoPreviewRef}
                              controls
                              className="w-full max-h-[400px] rounded-lg mb-4"
                            />
                            <div className="flex gap-3">
                              <Button
                                onClick={resetRecording}
                                variant="outline"
                                className="flex-1"
                              >
                                Re-record
                              </Button>
                            </div>
                          </div>
                        ) : isRecording ? (
                          <div className="text-center py-12">
                            <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                              <Mic className="w-10 h-10 text-white" />
                            </div>
                            <p className="text-lg font-semibold text-gray-900 mb-2">Recording in progress...</p>
                            <p className="text-sm text-gray-600 mb-6">Speak clearly and answer the question thoroughly</p>
                            <Button
                              onClick={handleStopRecording}
                              className="bg-red-600 hover:bg-red-700 text-white"
                            >
                              <StopCircle className="w-4 h-4 mr-2" />
                              Stop Recording
                            </Button>
                          </div>
                        ) : (
                          <div className="text-center py-12">
                            <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                              <Video className="w-10 h-10 text-indigo-600" />
                            </div>
                            <p className="text-lg font-semibold text-gray-900 mb-2">Ready to record</p>
                            <p className="text-sm text-gray-600 mb-6">
                              Click the button below to start recording your answer
                            </p>
                            <Button
                              onClick={handleStartRecording}
                              className="bg-indigo-600 hover:bg-indigo-700 text-white"
                            >
                              <PlayCircle className="w-4 h-4 mr-2" />
                              Start Recording
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex justify-between pt-4 border-t border-gray-200">
                    <Button
                      onClick={handlePreviousQuestion}
                      disabled={currentQuestionIndex === 0}
                      variant="outline"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Previous
                    </Button>

                    <Button
                      onClick={handleAnalyzeResponse}
                      disabled={
                        (sessionData.analysisMode === 'standard' && !textAnswer.trim()) ||
                        (sessionData.analysisMode === 'advanced' && !audioBlob)
                      }
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                    >
                      {isLastQuestion ? 'Complete Interview' : 'Next Question'}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ) : (
              /* Analysis Progress */
              <motion.div
                key="analyzing"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center py-16"
              >
                <div className="w-24 h-24 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                  <Loader2 className="w-12 h-12 text-white animate-spin" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {sessionData.analysisMode === 'advanced' ? 'Performing Advanced Analysis...' : 'Analyzing Your Response...'}
                </h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  {sessionData.analysisMode === 'advanced'
                    ? 'Transcribing audio, analyzing speech patterns, and evaluating body language. This may take a moment.'
                    : 'Evaluating your answer for technical accuracy, clarity, and relevance.'
                  }
                </p>
                <div className="max-w-md mx-auto">
                  <Progress value={analysisProgress} className="h-3 mb-2" />
                  <p className="text-sm text-gray-600">{analysisProgress}% Complete</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </div>
    </div>
  )
}

'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Trophy,
  TrendingUp,
  CheckCircle,
  Download,
  Share2,
  RotateCcw,
  ArrowRight,
  Sparkles,
  Award,
  Target,
  Clock,
  BookOpen
} from 'lucide-react'
import { Answer, SessionData } from '@/lib/intelligentInterviewApi'
import { FeedbackDisplay } from './FeedbackDisplay'

interface SessionResultsProps {
  sessionData: SessionData
  answers: Answer[]
  onRestart: () => void
  onNewSession: () => void
}

export function SessionResults({ sessionData, answers, onRestart, onNewSession }: SessionResultsProps) {
  const averageScore = answers.reduce((sum, a) => sum + a.analysis.score, 0) / answers.length
  const totalScore = averageScore.toFixed(2)

  const handleDownloadReport = () => {
    // Create a comprehensive text report
    let reportContent = `AI INTERVIEW REPORT\n`
    reportContent += `${'='.repeat(80)}\n\n`
    reportContent += `Domain: ${sessionData.domain}\n`
    reportContent += `Level: ${sessionData.level}\n`
    reportContent += `Analysis Mode: ${sessionData.analysisMode === 'advanced' ? 'Advanced (AI+)' : 'Standard (AI)'}\n`
    reportContent += `Date: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}\n`
    reportContent += `Total Questions: ${answers.length}\n`
    reportContent += `Overall Score: ${totalScore}/100\n\n`
    reportContent += `${'='.repeat(80)}\n\n`

    // Add detailed results for each question
    answers.forEach((answer, idx) => {
      reportContent += `QUESTION ${idx + 1}\n`
      reportContent += `${'-'.repeat(80)}\n`
      reportContent += `Question: ${answer.questionData.questionText}\n`
      reportContent += `Category: ${answer.questionData.category}\n`
      reportContent += `Difficulty: ${answer.questionData.difficulty}\n`
      reportContent += `Keywords: ${answer.questionData.keywords.join(', ')}\n\n`

      reportContent += `Score: ${answer.analysis.score.toFixed(2)}/100\n\n`

      // Feedback metrics
      reportContent += `FEEDBACK METRICS:\n`
      reportContent += `  Technical Accuracy: ${answer.analysis.feedback.technicalAccuracy.toFixed(2)}%\n`
      reportContent += `  Clarity: ${answer.analysis.feedback.clarity.toFixed(2)}%\n`
      reportContent += `  Relevance: ${answer.analysis.feedback.relevance.toFixed(2)}%\n\n`

      // Score breakdown for advanced mode
      if (answer.analysis.scoreBreakdown) {
        reportContent += `SCORE BREAKDOWN:\n`
        reportContent += `  Content Quality: ${answer.analysis.scoreBreakdown.content.toFixed(2)}%\n`
        reportContent += `  Delivery: ${answer.analysis.scoreBreakdown.delivery.toFixed(2)}%\n`
        reportContent += `  Body Language: ${answer.analysis.scoreBreakdown.bodyLanguage.toFixed(2)}%\n\n`
      }

      // Strengths
      reportContent += `STRENGTHS:\n`
      answer.analysis.feedback.strengths.forEach((strength, i) => {
        reportContent += `  ${i + 1}. ${strength.replace(/\*\*/g, '').replace(/\*/g, '')}\n`
      })
      reportContent += `\n`

      // Areas for improvement
      reportContent += `AREAS FOR IMPROVEMENT:\n`
      answer.analysis.feedback.improvements.forEach((improvement, i) => {
        reportContent += `  ${i + 1}. ${improvement.replace(/\*\*/g, '').replace(/\*/g, '')}\n`
      })
      reportContent += `\n`

      // Overall assessment
      reportContent += `OVERALL ASSESSMENT:\n`
      reportContent += `${answer.analysis.overallAssessment.replace(/\*\*/g, '').replace(/\*/g, '')}\n\n`

      // Domain-specific insights
      if (answer.analysis.domainSpecificInsights) {
        reportContent += `DOMAIN-SPECIFIC INSIGHTS:\n`
        reportContent += `${answer.analysis.domainSpecificInsights.replace(/\*\*/g, '').replace(/\*/g, '')}\n\n`
      }

      // Speech analysis for advanced mode
      if (answer.analysis.speechAnalysis) {
        reportContent += `SPEECH ANALYSIS:\n`
        reportContent += `  Words Per Minute: ${answer.analysis.speechAnalysis.wordsPerMinute}\n`
        reportContent += `  Filler Word Count: ${answer.analysis.speechAnalysis.fillerWordCount}\n`
        reportContent += `  Filler Word Percentage: ${typeof answer.analysis.speechAnalysis.fillerWordPercentage === 'number' ? answer.analysis.speechAnalysis.fillerWordPercentage.toFixed(2) : answer.analysis.speechAnalysis.fillerWordPercentage}%\n`
        reportContent += `  Confidence: ${typeof answer.analysis.speechAnalysis.confidence === 'number' ? answer.analysis.speechAnalysis.confidence.toFixed(2) : answer.analysis.speechAnalysis.confidence}%\n`
        if (answer.analysis.speechAnalysis.recommendations && answer.analysis.speechAnalysis.recommendations.length > 0) {
          reportContent += `  Recommendations:\n`
          answer.analysis.speechAnalysis.recommendations.forEach((rec, i) => {
            reportContent += `    ${i + 1}. ${rec.replace(/\*\*/g, '').replace(/\*/g, '')}\n`
          })
        }
        reportContent += `\n`
      }

      // Body language analysis for advanced mode
      if (answer.analysis.bodyLanguageAnalysis) {
        reportContent += `BODY LANGUAGE ANALYSIS:\n`
        reportContent += `  Eye Contact: ${answer.analysis.bodyLanguageAnalysis.eyeContact}\n`
        reportContent += `  Body Movement: ${answer.analysis.bodyLanguageAnalysis.bodyMovement}\n`
        reportContent += `  Overall Presence: ${answer.analysis.bodyLanguageAnalysis.overallPresence}\n`
        if (answer.analysis.bodyLanguageAnalysis.recommendations && answer.analysis.bodyLanguageAnalysis.recommendations.length > 0) {
          reportContent += `  Recommendations:\n`
          answer.analysis.bodyLanguageAnalysis.recommendations.forEach((rec, i) => {
            reportContent += `    ${i + 1}. ${rec.replace(/\*\*/g, '').replace(/\*/g, '')}\n`
          })
        }
        reportContent += `\n`
      }

      // Transcription for advanced mode
      if (answer.transcription?.text) {
        reportContent += `TRANSCRIPTION:\n`
        reportContent += `"${answer.transcription.text}"\n`
        reportContent += `  Word Count: ${answer.transcription.wordCount}\n`
        reportContent += `  Duration: ${typeof answer.transcription.duration === 'number' ? answer.transcription.duration.toFixed(1) : parseFloat(answer.transcription.duration).toFixed(1)}s\n`
        reportContent += `  Confidence: ${(answer.transcription.confidence * 100).toFixed(2)}%\n`
        reportContent += `\n`
      }

      reportContent += `${'='.repeat(80)}\n\n`
    })

    // Summary
    reportContent += `SUMMARY\n`
    reportContent += `${'='.repeat(80)}\n`
    reportContent += `This interview assessment provides a comprehensive evaluation of your performance.\n`
    reportContent += `Focus on the areas for improvement to enhance your interview skills.\n\n`
    reportContent += `Generated by CareerCraft AI - Intelligent Interview System\n`
    reportContent += `Report Date: ${new Date().toLocaleString()}\n`

    // Create and download the file
    const blob = new Blob([reportContent], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `interview-report-${sessionData.domain.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  const getScoreGrade = (score: number) => {
    if (score >= 90) return {
      grade: 'A+',
      color: 'from-green-500 to-emerald-600',
      text: 'Excellent!',
      bgColor: 'from-green-50 to-emerald-50',
      borderColor: 'border-green-300'
    }
    if (score >= 80) return {
      grade: 'A',
      color: 'from-green-500 to-emerald-600',
      text: 'Great Job!',
      bgColor: 'from-green-50 to-emerald-50',
      borderColor: 'border-green-300'
    }
    if (score >= 70) return {
      grade: 'B',
      color: 'from-blue-500 to-cyan-600',
      text: 'Good Work!',
      bgColor: 'from-blue-50 to-cyan-50',
      borderColor: 'border-blue-300'
    }
    if (score >= 60) return {
      grade: 'C',
      color: 'from-yellow-500 to-orange-600',
      text: 'Keep Practicing!',
      bgColor: 'from-yellow-50 to-orange-50',
      borderColor: 'border-yellow-300'
    }
    return {
      grade: 'D',
      color: 'from-red-500 to-pink-600',
      text: 'Needs Improvement',
      bgColor: 'from-red-50 to-pink-50',
      borderColor: 'border-red-300'
    }
  }

  const scoreGrade = getScoreGrade(parseFloat(totalScore))

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-200/30 to-purple-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-200/30 to-cyan-200/30 rounded-full blur-3xl"></div>
      </div>

      {/* Header with Overall Score - Enhanced */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="text-center relative"
      >
        {/* Animated Confetti Background */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                background: `hsl(${Math.random() * 360}, 70%, 60%)`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* Grade Badge with Glow Effect */}
        <div className="relative inline-block mb-8">
          <motion.div
            className={`absolute inset-0 bg-gradient-to-r ${scoreGrade.color} rounded-full blur-2xl opacity-40`}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.4, 0.6, 0.4],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
            }}
          ></motion.div>
          <motion.div
            className={`relative w-40 h-40 rounded-full flex flex-col items-center justify-center bg-gradient-to-r ${scoreGrade.color} shadow-2xl`}
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Trophy className="w-10 h-10 text-white mb-2" />
            <div className="text-5xl font-bold text-white">{scoreGrade.grade}</div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-3">
            Interview Complete!
          </h2>
          <p className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">{scoreGrade.text}</p>
          <div className="flex items-center justify-center gap-2">
            <Award className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Overall Score: <span className="font-bold text-2xl text-indigo-600 dark:text-indigo-400">{totalScore}</span>
              <span className="text-gray-500 dark:text-gray-500">/100</span>
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* Summary Stats - Enhanced with Modern Design */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
          <Sparkles className="w-6 h-6 mr-2 text-indigo-600 dark:text-indigo-400" />
          Session Summary
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-6 text-white shadow-lg"
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <BookOpen className="w-8 h-8 mb-3 opacity-80" />
            <div className="text-4xl font-bold mb-1">{answers.length}</div>
            <div className="text-sm opacity-90">Questions Answered</div>
            <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-white opacity-10 rounded-full"></div>
          </motion.div>

          <motion.div
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 p-6 text-white shadow-lg"
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Target className="w-8 h-8 mb-3 opacity-80" />
            <div className="text-4xl font-bold mb-1">{sessionData.level}</div>
            <div className="text-sm opacity-90">Difficulty Level</div>
            <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-white opacity-10 rounded-full"></div>
          </motion.div>

          <motion.div
            className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${scoreGrade.color} p-6 text-white shadow-lg`}
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Trophy className="w-8 h-8 mb-3 opacity-80" />
            <div className="text-4xl font-bold mb-1">{totalScore}%</div>
            <div className="text-sm opacity-90">Average Score</div>
            <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-white opacity-10 rounded-full"></div>
          </motion.div>

          <motion.div
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 p-6 text-white shadow-lg"
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Sparkles className="w-8 h-8 mb-3 opacity-80" />
            <div className="text-4xl font-bold mb-1">
              {sessionData.analysisMode === 'advanced' ? 'AI+' : 'AI'}
            </div>
            <div className="text-sm opacity-90">Analysis Mode</div>
            <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-white opacity-10 rounded-full"></div>
          </motion.div>
        </div>
      </motion.div>

      {/* Performance by Question - Dark Modern Design */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
          <TrendingUp className="w-6 h-6 mr-2 text-indigo-600 dark:text-indigo-400" />
          Performance Overview
        </h3>
        <div className="space-y-4">
          {answers.map((answer, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + idx * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card className="p-6 bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 shadow-xl overflow-hidden relative">
                {/* Decorative Element */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl"></div>

                <div className="flex items-start justify-between relative">
                  <div className="flex items-start space-x-4 flex-1">
                    {/* Question Number Badge */}
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold shadow-lg ${
                      answer.analysis.score >= 70 ? 'bg-gradient-to-br from-green-400 to-emerald-500' :
                      answer.analysis.score >= 50 ? 'bg-gradient-to-br from-blue-400 to-cyan-500' :
                      'bg-gradient-to-br from-orange-400 to-red-500'
                    } text-white`}>
                      {idx + 1}
                    </div>

                    <div className="flex-1">
                      {/* Question Text */}
                      <p className="text-base font-medium text-white mb-3 leading-relaxed">
                        {answer.questionData.questionText}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap items-center gap-2 mb-4">
                        <Badge className="bg-gray-700/50 text-gray-200 border-gray-600 hover:bg-gray-700">
                          {answer.questionData.difficulty}
                        </Badge>
                        <Badge className="bg-gray-700/50 text-gray-200 border-gray-600 hover:bg-gray-700">
                          {answer.questionData.category}
                        </Badge>
                        {answer.questionData.keywords?.slice(0, 2).map((keyword, i) => (
                          <Badge key={i} className="bg-indigo-500/20 text-indigo-300 border-indigo-400/30">
                            {keyword}
                          </Badge>
                        ))}
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">Score Performance</span>
                          <span className={`font-bold ${
                            answer.analysis.score >= 70 ? 'text-green-400' :
                            answer.analysis.score >= 50 ? 'text-blue-400' :
                            'text-orange-400'
                          }`}>
                            {answer.analysis.score.toFixed(2)}%
                          </span>
                        </div>
                        <div className="relative h-3 bg-gray-700 rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full rounded-full ${
                              answer.analysis.score >= 70 ? 'bg-gradient-to-r from-green-400 to-emerald-500' :
                              answer.analysis.score >= 50 ? 'bg-gradient-to-r from-blue-400 to-cyan-500' :
                              'bg-gradient-to-r from-orange-400 to-red-500'
                            }`}
                            initial={{ width: 0 }}
                            animate={{ width: `${answer.analysis.score}%` }}
                            transition={{ duration: 1, delay: 0.8 + idx * 0.1 }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Score Badge */}
                  <motion.div
                    className={`ml-6 text-center min-w-[80px]`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <div className={`text-5xl font-bold ${
                      answer.analysis.score >= 70 ? 'text-green-400' :
                      answer.analysis.score >= 50 ? 'text-blue-400' :
                      'text-orange-400'
                    }`}>
                      {answer.analysis.score.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">out of 100</div>
                  </motion.div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Detailed Feedback for Each Question - Enhanced */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
          <CheckCircle className="w-6 h-6 mr-2 text-indigo-600 dark:text-indigo-400" />
          Detailed Feedback
        </h3>
        <div className="space-y-8">
          {answers.map((answer, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + idx * 0.1 }}
            >
              <Card className="overflow-hidden border-2 shadow-xl hover:shadow-2xl transition-shadow duration-300 dark:border-gray-700">
                {/* Header Section */}
                <div className={`p-6 bg-gradient-to-br ${scoreGrade.bgColor} dark:from-gray-800 dark:to-gray-900 ${scoreGrade.borderColor} dark:border-gray-700 border-b-2`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge className="bg-indigo-600 text-white text-sm px-3 py-1">
                          Question {idx + 1}
                        </Badge>
                        <Badge className="bg-gray-700 text-white text-sm px-3 py-1">
                          {answer.questionData.difficulty}
                        </Badge>
                        <Badge className="bg-gray-600 text-white text-sm px-3 py-1">
                          {answer.questionData.category}
                        </Badge>
                      </div>
                      <h4 className="text-xl font-semibold text-gray-900 dark:text-white leading-relaxed">
                        {answer.questionData.questionText}
                      </h4>
                    </div>

                    {/* Score Circle */}
                    <motion.div
                      className={`ml-6 relative`}
                      whileHover={{ scale: 1.1, rotate: 10 }}
                    >
                      <div className={`w-20 h-20 rounded-full flex items-center justify-center bg-white dark:bg-gray-800 shadow-lg border-4 ${
                        answer.analysis.score >= 70 ? 'border-green-500 dark:border-green-400' :
                        answer.analysis.score >= 50 ? 'border-blue-500 dark:border-blue-400' :
                        'border-orange-500 dark:border-orange-400'
                      }`}>
                        <div className={`text-2xl font-bold ${
                          answer.analysis.score >= 70 ? 'text-green-600 dark:text-green-400' :
                          answer.analysis.score >= 50 ? 'text-blue-600 dark:text-blue-400' :
                          'text-orange-600 dark:text-orange-400'
                        }`}>
                          {answer.analysis.score.toFixed(2)}
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Feedback Content */}
                <div className="p-6 bg-white dark:bg-gray-800">
                  <FeedbackDisplay
                    analysis={answer.analysis}
                    questionText={answer.questionData.questionText}
                  />
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Action Buttons - Enhanced */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="flex flex-col md:flex-row gap-4 justify-center items-center pt-8 pb-12"
      >
        <Button
          onClick={onRestart}
          variant="outline"
          size="lg"
          className="flex items-center gap-2 px-8 py-6 text-lg border-2 border-gray-300 dark:border-gray-600 hover:border-indigo-500 dark:hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all duration-300"
        >
          <RotateCcw className="w-5 h-5" />
          Retake This Interview
        </Button>

        <Button
          onClick={onNewSession}
          size="lg"
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white flex items-center gap-2 px-8 py-6 text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
        >
          Start New Interview
          <ArrowRight className="w-5 h-5" />
        </Button>

        <Button
          onClick={handleDownloadReport}
          variant="outline"
          size="lg"
          className="flex items-center gap-2 px-8 py-6 text-lg border-2 border-gray-300 dark:border-gray-600 hover:border-green-500 dark:hover:border-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-300"
        >
          <Download className="w-5 h-5" />
          Download Report
        </Button>
      </motion.div>
    </div>
  )
}

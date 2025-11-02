'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Target,
  MessageSquare,
  Mic,
  Video,
  Brain,
  Sparkles,
  Star,
  Zap
} from 'lucide-react'
import { AnalysisResult } from '@/lib/intelligentInterviewApi'

interface FeedbackDisplayProps {
  analysis: AnalysisResult
  questionText: string
}

export function FeedbackDisplay({ analysis, questionText }: FeedbackDisplayProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-blue-600'
    if (score >= 40) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'from-green-50 to-emerald-50 border-green-200'
    if (score >= 60) return 'from-blue-50 to-cyan-50 border-blue-200'
    if (score >= 40) return 'from-yellow-50 to-orange-50 border-yellow-200'
    return 'from-red-50 to-pink-50 border-red-200'
  }

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-gradient-to-r from-green-500 to-emerald-600'
    if (score >= 60) return 'bg-gradient-to-r from-blue-500 to-cyan-600'
    if (score >= 40) return 'bg-gradient-to-r from-yellow-500 to-orange-600'
    return 'bg-gradient-to-r from-red-500 to-pink-600'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Score Breakdown for Advanced Mode */}
      {analysis.mode === 'advanced' && analysis.scoreBreakdown && (
        <Card className="p-6 bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 dark:from-purple-900/20 dark:via-indigo-900/20 dark:to-blue-900/20 border-2 border-purple-200 dark:border-purple-800 shadow-lg">
          <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-5 flex items-center">
            <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center mr-3">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            Score Breakdown
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md"
              whileHover={{ scale: 1.05, y: -3 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Content Quality</span>
                </div>
                <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">{analysis.scoreBreakdown.content.toFixed(2)}%</span>
              </div>
              <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${analysis.scoreBreakdown.content}%` }}
                  transition={{ duration: 1, delay: 0.2 }}
                />
              </div>
            </motion.div>

            <motion.div
              className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md"
              whileHover={{ scale: 1.05, y: -3 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Mic className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Delivery</span>
                </div>
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{analysis.scoreBreakdown.delivery.toFixed(2)}%</span>
              </div>
              <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${analysis.scoreBreakdown.delivery}%` }}
                  transition={{ duration: 1, delay: 0.3 }}
                />
              </div>
            </motion.div>

            <motion.div
              className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md"
              whileHover={{ scale: 1.05, y: -3 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Video className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Body Language</span>
                </div>
                <span className="text-2xl font-bold text-pink-600 dark:text-pink-400">{analysis.scoreBreakdown.bodyLanguage.toFixed(2)}%</span>
              </div>
              <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-pink-500 to-purple-600 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${analysis.scoreBreakdown.bodyLanguage}%` }}
                  transition={{ duration: 1, delay: 0.4 }}
                />
              </div>
            </motion.div>
          </div>
        </Card>
      )}

      {/* Feedback Metrics - Enhanced */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.05, y: -5 }}
        >
          <Card className="p-6 bg-gradient-to-br from-blue-500 to-cyan-600 text-white shadow-lg hover:shadow-2xl transition-shadow duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-8 -mt-8"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold opacity-90">Technical Accuracy</span>
                <Brain className="w-6 h-6" />
              </div>
              <div className="text-5xl font-bold mb-2">{analysis.feedback.technicalAccuracy.toFixed(2)}%</div>
              <div className="h-2 bg-white/30 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-white rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${analysis.feedback.technicalAccuracy}%` }}
                  transition={{ duration: 1, delay: 0.3 }}
                />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.05, y: -5 }}
        >
          <Card className="p-6 bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg hover:shadow-2xl transition-shadow duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-8 -mt-8"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold opacity-90">Clarity</span>
                <MessageSquare className="w-6 h-6" />
              </div>
              <div className="text-5xl font-bold mb-2">{analysis.feedback.clarity.toFixed(2)}%</div>
              <div className="h-2 bg-white/30 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-white rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${analysis.feedback.clarity}%` }}
                  transition={{ duration: 1, delay: 0.4 }}
                />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.05, y: -5 }}
        >
          <Card className="p-6 bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-lg hover:shadow-2xl transition-shadow duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-8 -mt-8"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold opacity-90">Relevance</span>
                <Target className="w-6 h-6" />
              </div>
              <div className="text-5xl font-bold mb-2">{analysis.feedback.relevance.toFixed(2)}%</div>
              <div className="h-2 bg-white/30 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-white rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${analysis.feedback.relevance}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Strengths - Enhanced */}
      <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-300 dark:border-green-800 shadow-lg">
        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-5 flex items-center">
          <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center mr-3">
            <CheckCircle className="w-5 h-5 text-white" />
          </div>
          Key Strengths
        </h4>
        <div className="space-y-3">
          {analysis.feedback.strengths.map((strength, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + idx * 0.1 }}
              className="flex items-start p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                <Star className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
              <span className="text-gray-800 dark:text-gray-200 leading-relaxed" dangerouslySetInnerHTML={{ __html: strength.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\*(.+?)\*/g, '<em>$1</em>') }}></span>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Areas for Improvement - Enhanced */}
      <Card className="p-6 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border-2 border-orange-300 dark:border-orange-800 shadow-lg">
        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-5 flex items-center">
          <div className="w-10 h-10 rounded-full bg-orange-600 flex items-center justify-center mr-3">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          Areas for Improvement
        </h4>
        <div className="space-y-3">
          {analysis.feedback.improvements.map((improvement, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + idx * 0.1 }}
              className="flex items-start p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                <Zap className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              </div>
              <span className="text-gray-800 dark:text-gray-200 leading-relaxed" dangerouslySetInnerHTML={{ __html: improvement.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\*(.+?)\*/g, '<em>$1</em>') }}></span>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Speech Analysis (Advanced Mode) - Enhanced */}
      {analysis.speechAnalysis && (
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-300 dark:border-blue-800 shadow-lg">
          <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-5 flex items-center">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center mr-3">
              <Mic className="w-5 h-5 text-white" />
            </div>
            Speech Analysis
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
            <motion.div
              className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md"
              whileHover={{ scale: 1.05, y: -3 }}
            >
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">{analysis.speechAnalysis.wordsPerMinute}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Words/Min</div>
            </motion.div>
            <motion.div
              className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md"
              whileHover={{ scale: 1.05, y: -3 }}
            >
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">{analysis.speechAnalysis.fillerWordCount}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Filler Words</div>
            </motion.div>
            <motion.div
              className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md"
              whileHover={{ scale: 1.05, y: -3 }}
            >
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">{typeof analysis.speechAnalysis.fillerWordPercentage === 'number' ? analysis.speechAnalysis.fillerWordPercentage.toFixed(2) : analysis.speechAnalysis.fillerWordPercentage}%</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Filler Rate</div>
            </motion.div>
            <motion.div
              className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md"
              whileHover={{ scale: 1.05, y: -3 }}
            >
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">{typeof analysis.speechAnalysis.confidence === 'number' ? analysis.speechAnalysis.confidence.toFixed(2) : analysis.speechAnalysis.confidence}%</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Confidence</div>
            </motion.div>
          </div>
          {analysis.speechAnalysis.recommendations && analysis.speechAnalysis.recommendations.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
              <h5 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                <Sparkles className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                Recommendations
              </h5>
              <ul className="space-y-2">
                {analysis.speechAnalysis.recommendations.map((rec, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + idx * 0.1 }}
                    className="text-sm text-gray-700 dark:text-gray-300 flex items-start"
                  >
                    <span className="text-blue-600 dark:text-blue-400 mr-2 font-bold">•</span>
                    <span dangerouslySetInnerHTML={{ __html: rec.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\*(.+?)\*/g, '<em>$1</em>') }}></span>
                  </motion.li>
                ))}
              </ul>
            </div>
          )}
        </Card>
      )}

      {/* Body Language Analysis (Advanced Mode) - Enhanced */}
      {analysis.bodyLanguageAnalysis && (
        <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-2 border-purple-300 dark:border-purple-800 shadow-lg">
          <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-5 flex items-center">
            <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center mr-3">
              <Video className="w-5 h-5 text-white" />
            </div>
            Body Language Analysis
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
            <motion.div
              className="text-center p-5 bg-white dark:bg-gray-800 rounded-xl shadow-md"
              whileHover={{ scale: 1.05, y: -3 }}
            >
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-semibold">Eye Contact</div>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{analysis.bodyLanguageAnalysis.eyeContact}</div>
            </motion.div>
            <motion.div
              className="text-center p-5 bg-white dark:bg-gray-800 rounded-xl shadow-md"
              whileHover={{ scale: 1.05, y: -3 }}
            >
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-semibold">Body Movement</div>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{analysis.bodyLanguageAnalysis.bodyMovement}</div>
            </motion.div>
            <motion.div
              className="text-center p-5 bg-white dark:bg-gray-800 rounded-xl shadow-md"
              whileHover={{ scale: 1.05, y: -3 }}
            >
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-semibold">Overall Presence</div>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{analysis.bodyLanguageAnalysis.overallPresence}</div>
            </motion.div>
          </div>
          {analysis.bodyLanguageAnalysis.recommendations && analysis.bodyLanguageAnalysis.recommendations.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
              <h5 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                <Sparkles className="w-4 h-4 mr-2 text-purple-600 dark:text-purple-400" />
                Recommendations
              </h5>
              <ul className="space-y-2">
                {analysis.bodyLanguageAnalysis.recommendations.map((rec, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 + idx * 0.1 }}
                    className="text-sm text-gray-700 dark:text-gray-300 flex items-start"
                  >
                    <span className="text-purple-600 dark:text-purple-400 mr-2 font-bold">•</span>
                    <span dangerouslySetInnerHTML={{ __html: rec.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\*(.+?)\*/g, '<em>$1</em>') }}></span>
                  </motion.li>
                ))}
              </ul>
            </div>
          )}
        </Card>
      )}

      {/* Domain-Specific Insights - Enhanced */}
      {analysis.domainSpecificInsights && (
        <Card className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-2 border-indigo-300 dark:border-indigo-800 shadow-lg">
          <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center mr-3">
              <Brain className="w-5 h-5 text-white" />
            </div>
            Domain-Specific Insights
          </h4>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md">
            <p className="text-gray-800 dark:text-gray-200 leading-relaxed" dangerouslySetInnerHTML={{ __html: analysis.domainSpecificInsights.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\*(.+?)\*/g, '<em>$1</em>') }}></p>
          </div>
        </Card>
      )}

      {/* Overall Assessment - Enhanced */}
      <Card className="p-6 bg-gradient-to-br from-gray-50 to-slate-100 dark:from-gray-800 dark:to-gray-900 border-2 border-gray-300 dark:border-gray-700 shadow-lg">
        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
          <div className="w-10 h-10 rounded-full bg-gray-700 dark:bg-gray-600 flex items-center justify-center mr-3">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          Overall Assessment
        </h4>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md">
          <p className="text-gray-800 dark:text-gray-200 leading-relaxed text-base" dangerouslySetInnerHTML={{ __html: analysis.overallAssessment.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\*(.+?)\*/g, '<em>$1</em>') }}></p>
        </div>
      </Card>

      {/* Transcription (Advanced Mode) - Enhanced */}
      {analysis.transcription && analysis.transcription.text && (
        <Card className="p-6 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 border-2 border-gray-300 dark:border-gray-700 shadow-lg">
          <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <div className="w-10 h-10 rounded-full bg-gray-700 dark:bg-gray-600 flex items-center justify-center mr-3">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            Your Response (Transcribed)
          </h4>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border-2 border-gray-200 dark:border-gray-700 shadow-md">
            <p className="text-gray-800 dark:text-gray-200 leading-relaxed italic text-base">&quot;{analysis.transcription.text}&quot;</p>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Words</div>
              <div className="text-lg font-bold text-gray-900 dark:text-white">{analysis.transcription.wordCount}</div>
            </div>
            <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Duration</div>
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {typeof analysis.transcription.duration === 'number'
                  ? analysis.transcription.duration.toFixed(1)
                  : parseFloat(analysis.transcription.duration).toFixed(1)}s
              </div>
            </div>
            <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Confidence</div>
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {(analysis.transcription.confidence * 100).toFixed(2)}%
              </div>
            </div>
          </div>
        </Card>
      )}
    </motion.div>
  )
}

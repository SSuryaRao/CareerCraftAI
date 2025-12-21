'use client'

import { motion } from 'framer-motion'
import { Sparkles, TrendingUp, Target, ArrowRight, Award, CheckCircle, Zap, RefreshCw, Database, Cpu } from 'lucide-react'

interface PersonalizedRecommendationBannerProps {
  recommendations: {
    recommendedDomain: string
    skillLevel: string
    confidence: number
    reasons: string[]
    skillGaps: string[]
    nextSteps?: string[]
    currentStrengths?: string[]
    improvementAreas?: string[]
  }
  onApply: () => void
  onRegenerate?: () => void
  isCached?: boolean
  modelUsed?: string
  isLoading?: boolean
}

export function PersonalizedRecommendationBanner({
  recommendations,
  onApply,
  onRegenerate,
  isCached = false,
  modelUsed = 'unknown',
  isLoading = false
}: PersonalizedRecommendationBannerProps) {
  const {
    recommendedDomain,
    skillLevel,
    confidence,
    reasons,
    skillGaps,
    nextSteps,
    currentStrengths,
    improvementAreas
  } = recommendations

  // Get confidence color
  const getConfidenceColor = (conf: number) => {
    if (conf >= 85) return { bg: 'bg-emerald-500', text: 'text-emerald-600', badge: 'bg-emerald-100' }
    if (conf >= 70) return { bg: 'bg-blue-500', text: 'text-blue-600', badge: 'bg-blue-100' }
    if (conf >= 55) return { bg: 'bg-amber-500', text: 'text-amber-600', badge: 'bg-amber-100' }
    return { bg: 'bg-purple-500', text: 'text-purple-600', badge: 'bg-purple-100' }
  }

  const colors = getConfidenceColor(confidence)

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl sm:rounded-3xl shadow-2xl mb-6 sm:mb-10"
    >
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0"
             style={{
               backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
             }}
        />
      </div>

      <div className="relative p-4 sm:p-6 lg:p-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4 sm:mb-6">
          <div className="flex-1">
            <div className="flex items-start sm:items-center mb-2 sm:mb-3">
              <div className="p-1.5 sm:p-2 bg-white/20 backdrop-blur-sm rounded-lg sm:rounded-xl mr-2 sm:mr-3 flex-shrink-0">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="min-w-0">
                <h3 className="text-lg sm:text-2xl lg:text-3xl font-bold text-white leading-tight">
                  Recommendations Based on Your Resume
                </h3>
                <div className="flex items-center gap-1.5 sm:gap-2 mt-1.5 sm:mt-2 flex-wrap">
                  <p className="text-purple-100 text-xs sm:text-sm">
                    AI-powered career path analysis
                  </p>
                  {/* Cache Status Badge */}
                  {isCached && (
                    <span className="inline-flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-0.5 bg-green-500/20 border border-green-300/30 rounded-full text-[10px] sm:text-xs text-green-100">
                      <Database className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                      Cached
                    </span>
                  )}
                  {/* Model Badge */}
                  {modelUsed && modelUsed !== 'unknown' && (
                    <span className="inline-flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-0.5 bg-blue-500/20 border border-blue-300/30 rounded-full text-[10px] sm:text-xs text-blue-100">
                      <Cpu className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                      <span className="hidden xs:inline">{modelUsed === 'fine-tuned' ? 'Fine-Tuned' : 'Base'}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Confidence Badge & Refresh Button */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Refresh Button */}
            {onRegenerate && (
              <button
                onClick={onRegenerate}
                disabled={isLoading}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl px-4 py-2 border-2 border-white/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                title="Regenerate recommendations"
              >
                <RefreshCw className={`w-5 h-5 text-white ${isLoading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
              </button>
            )}

            {/* Confidence Badge */}
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-3 border-2 border-white/30">
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-yellow-300" />
                <div>
                  <div className="text-white font-bold text-2xl">{confidence}%</div>
                  <div className="text-purple-100 text-xs">Match Score</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Left Column - Main Recommendation */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-4">
            {/* Recommended Path Card */}
            <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl border border-transparent dark:border-gray-700/50">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3 sm:mb-4">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="p-1.5 sm:p-2 bg-gradient-to-br from-purple-500 to-pink-500 dark:from-purple-400 dark:to-pink-400 rounded-lg sm:rounded-xl flex-shrink-0">
                    <Target className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">Recommended Path</div>
                    <div className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-gray-100 truncate">{recommendedDomain}</div>
                  </div>
                </div>
                <div className={`px-3 sm:px-4 py-1.5 sm:py-2 ${colors.badge} dark:bg-opacity-20 dark:border dark:border-gray-600 ${colors.text} dark:text-gray-200 rounded-full font-semibold text-xs sm:text-sm capitalize self-start sm:self-auto`}>
                  {skillLevel}
                </div>
              </div>

              {/* Confidence Bar */}
              <div className="mb-3 sm:mb-4">
                <div className="flex items-center justify-between text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 mb-1.5 sm:mb-2">
                  <span>Confidence Score</span>
                  <span className="font-bold">{confidence}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 sm:h-2.5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${confidence}%` }}
                    transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
                    className={`h-2 sm:h-2.5 rounded-full bg-gradient-to-r ${
                      confidence >= 85 ? 'from-emerald-500 to-green-600 dark:from-emerald-400 dark:to-green-500' :
                      confidence >= 70 ? 'from-blue-500 to-indigo-600 dark:from-blue-400 dark:to-indigo-500' :
                      confidence >= 55 ? 'from-amber-500 to-orange-600 dark:from-amber-400 dark:to-orange-500' :
                      'from-purple-500 to-pink-600 dark:from-purple-400 dark:to-pink-500'
                    }`}
                  />
                </div>
              </div>

              {/* Why This Path */}
              <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4">
                <div className="text-xs sm:text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center">
                  <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 text-green-600 dark:text-green-500 flex-shrink-0" />
                  Why this path is perfect for you:
                </div>
                <div className="space-y-1 sm:space-y-1.5">
                  {reasons.slice(0, 3).map((reason, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * i }}
                      className="flex items-start text-xs sm:text-sm text-gray-700 dark:text-gray-300"
                    >
                      <span className="text-purple-500 dark:text-purple-400 mr-1.5 sm:mr-2 mt-0.5 sm:mt-1">•</span>
                      <span>{reason}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={onApply}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl flex items-center justify-center group text-sm sm:text-base"
              >
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 group-hover:animate-pulse" />
                <span className="hidden sm:inline">Generate My Personalized Roadmap</span>
                <span className="sm:hidden">Generate Roadmap</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-1.5 sm:ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Mobile Confidence Badge */}
            <div className="lg:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-xl border border-transparent dark:border-gray-700/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <Award className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500 dark:text-yellow-400 flex-shrink-0" />
                  <div>
                    <div className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">Match Score</div>
                    <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">{confidence}%</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Confidence</div>
                  <div className={`text-xs sm:text-sm font-bold ${colors.text} dark:text-gray-200`}>
                    {confidence >= 85 ? 'Excellent' : confidence >= 70 ? 'Very Good' : confidence >= 55 ? 'Good' : 'Fair'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Skills & Insights */}
          <div className="space-y-3 sm:space-y-4">
            {/* Skills to Focus On */}
            {skillGaps.length > 0 && (
              <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-5 shadow-xl border border-transparent dark:border-gray-700/50">
                <div className="flex items-center mb-2 sm:mb-3">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 dark:text-orange-400 mr-1.5 sm:mr-2 flex-shrink-0" />
                  <h4 className="font-bold text-gray-900 dark:text-gray-100 text-sm sm:text-base">Skills to Focus On</h4>
                </div>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {skillGaps.slice(0, 5).map((skill, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 * i }}
                      className="px-2 sm:px-3 py-1 sm:py-1.5 bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-950/40 dark:to-red-950/40 text-orange-800 dark:text-orange-300 rounded-md sm:rounded-lg text-[10px] sm:text-xs font-semibold border border-orange-200 dark:border-orange-800/30"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </div>
            )}

            {/* Your Strengths */}
            {currentStrengths && currentStrengths.length > 0 && (
              <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-5 shadow-xl border border-transparent dark:border-gray-700/50">
                <div className="flex items-center mb-2 sm:mb-3">
                  <Award className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-500 mr-1.5 sm:mr-2 flex-shrink-0" />
                  <h4 className="font-bold text-gray-900 dark:text-gray-100 text-sm sm:text-base">Your Strengths</h4>
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  {currentStrengths.slice(0, 3).map((strength, i) => (
                    <div key={i} className="flex items-start text-[10px] sm:text-xs text-gray-700 dark:text-gray-300">
                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 dark:text-green-500 mr-1.5 sm:mr-2 mt-0.5 flex-shrink-0" />
                      <span>{strength}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Next Steps Preview */}
            {nextSteps && nextSteps.length > 0 && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl sm:rounded-2xl p-3 sm:p-5 border-2 border-blue-200 dark:border-blue-800/30 shadow-lg">
                <div className="flex items-center mb-2 sm:mb-3">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400 mr-1.5 sm:mr-2 flex-shrink-0" />
                  <h4 className="font-bold text-gray-900 dark:text-gray-100 text-sm sm:text-base">Quick Tip</h4>
                </div>
                <p className="text-[10px] sm:text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                  {nextSteps[0]}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
    </motion.div>
  )
}

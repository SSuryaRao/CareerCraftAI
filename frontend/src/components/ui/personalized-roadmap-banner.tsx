'use client'

import { motion } from 'framer-motion'
import { Sparkles, TrendingUp, Target, ArrowRight, Award, CheckCircle, Zap } from 'lucide-react'

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
}

export function PersonalizedRecommendationBanner({
  recommendations,
  onApply
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
      className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl shadow-2xl mb-10"
    >
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0"
             style={{
               backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
             }}
        />
      </div>

      <div className="relative p-8 lg:p-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center mb-3">
              <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl mr-3">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl lg:text-3xl font-bold text-white">
                  Recommendations Based on Your Resume
                </h3>
                <p className="text-purple-100 text-sm mt-1">
                  AI-powered career path analysis from your resume - the perfect learning journey for you
                </p>
              </div>
            </div>
          </div>

          {/* Confidence Badge */}
          <div className="hidden lg:block">
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

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Main Recommendation */}
          <div className="lg:col-span-2 space-y-4">
            {/* Recommended Path Card */}
            <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-transparent dark:border-gray-700/50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 dark:from-purple-400 dark:to-pink-400 rounded-xl">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">Recommended Path</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{recommendedDomain}</div>
                  </div>
                </div>
                <div className={`px-4 py-2 ${colors.badge} dark:bg-opacity-20 dark:border dark:border-gray-600 ${colors.text} dark:text-gray-200 rounded-full font-semibold text-sm capitalize`}>
                  {skillLevel}
                </div>
              </div>

              {/* Confidence Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-2">
                  <span>Confidence Score</span>
                  <span className="font-bold">{confidence}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${confidence}%` }}
                    transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
                    className={`h-2.5 rounded-full bg-gradient-to-r ${
                      confidence >= 85 ? 'from-emerald-500 to-green-600 dark:from-emerald-400 dark:to-green-500' :
                      confidence >= 70 ? 'from-blue-500 to-indigo-600 dark:from-blue-400 dark:to-indigo-500' :
                      confidence >= 55 ? 'from-amber-500 to-orange-600 dark:from-amber-400 dark:to-orange-500' :
                      'from-purple-500 to-pink-600 dark:from-purple-400 dark:to-pink-500'
                    }`}
                  />
                </div>
              </div>

              {/* Why This Path */}
              <div className="space-y-2 mb-4">
                <div className="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-600 dark:text-green-500" />
                  Why this path is perfect for you:
                </div>
                <div className="space-y-1.5">
                  {reasons.slice(0, 3).map((reason, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * i }}
                      className="flex items-start text-sm text-gray-700 dark:text-gray-300"
                    >
                      <span className="text-purple-500 dark:text-purple-400 mr-2 mt-1">•</span>
                      <span>{reason}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={onApply}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl flex items-center justify-center group"
              >
                <Zap className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                Generate My Personalized Roadmap
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Mobile Confidence Badge */}
            <div className="lg:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-transparent dark:border-gray-700/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Award className="w-8 h-8 text-yellow-500 dark:text-yellow-400" />
                  <div>
                    <div className="text-gray-600 dark:text-gray-400 text-sm">Match Score</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{confidence}%</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500 dark:text-gray-400">Confidence Level</div>
                  <div className={`text-sm font-bold ${colors.text} dark:text-gray-200`}>
                    {confidence >= 85 ? 'Excellent' : confidence >= 70 ? 'Very Good' : confidence >= 55 ? 'Good' : 'Fair'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Skills & Insights */}
          <div className="space-y-4">
            {/* Skills to Focus On */}
            {skillGaps.length > 0 && (
              <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-2xl p-5 shadow-xl border border-transparent dark:border-gray-700/50">
                <div className="flex items-center mb-3">
                  <TrendingUp className="w-5 h-5 text-orange-600 dark:text-orange-400 mr-2" />
                  <h4 className="font-bold text-gray-900 dark:text-gray-100">Skills to Focus On</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skillGaps.slice(0, 5).map((skill, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 * i }}
                      className="px-3 py-1.5 bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-950/40 dark:to-red-950/40 text-orange-800 dark:text-orange-300 rounded-lg text-xs font-semibold border border-orange-200 dark:border-orange-800/30"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </div>
            )}

            {/* Your Strengths */}
            {currentStrengths && currentStrengths.length > 0 && (
              <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-2xl p-5 shadow-xl border border-transparent dark:border-gray-700/50">
                <div className="flex items-center mb-3">
                  <Award className="w-5 h-5 text-green-600 dark:text-green-500 mr-2" />
                  <h4 className="font-bold text-gray-900 dark:text-gray-100">Your Strengths</h4>
                </div>
                <div className="space-y-2">
                  {currentStrengths.slice(0, 3).map((strength, i) => (
                    <div key={i} className="flex items-start text-xs text-gray-700 dark:text-gray-300">
                      <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>{strength}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Next Steps Preview */}
            {nextSteps && nextSteps.length > 0 && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-2xl p-5 border-2 border-blue-200 dark:border-blue-800/30 shadow-lg">
                <div className="flex items-center mb-3">
                  <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
                  <h4 className="font-bold text-gray-900 dark:text-gray-100">Quick Tip</h4>
                </div>
                <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
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

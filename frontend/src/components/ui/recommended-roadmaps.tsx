'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Target,
  TrendingUp,
  Clock,
  DollarSign,
  Users,
  ChevronRight,
  Star,
  Sparkles,
  ArrowRight,
  BookOpen
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '@/components/auth-provider'
import { apiClient } from '@/lib/api'
import toast from 'react-hot-toast'

interface Recommendation {
  title: string
  matchScore: number
  matchedSkills: string[]
  matchedInterests: string[]
  roi: {
    time: string
    cost: number
    salary: string
    roiFactor: string
  }
  trends: string
  previewTopics: string[]
  domain: string
  skillLevel: string
}

interface RecommendedRoadmapsProps {
  onStartRoadmap: (domain: string, skillLevel: string) => void
}

export function RecommendedRoadmaps({ onStartRoadmap }: RecommendedRoadmapsProps) {
  const { user } = useAuth()
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [profileCompleteness, setProfileCompleteness] = useState(0)

  useEffect(() => {
    if (user) {
      fetchRecommendations()
    }
  }, [user])

  const fetchRecommendations = async () => {
    if (!user) return

    setLoading(true)
    setError(null)

    try {
      // First try to get existing recommendations
      let response = await apiClient.getRecommendations()
      
      if (!response.success || !response.data) {
        // If no recommendations exist, generate new ones
        response = await apiClient.generateRecommendations()
      }

      if (response.success && response.data) {
        const recommendationsData = response.data.recommendations || response.data
        setRecommendations(recommendationsData)
        
        if (response.data.profileCompleteness !== undefined) {
          setProfileCompleteness(response.data.profileCompleteness)
        }
      } else {
        throw new Error(response.error || 'Failed to fetch recommendations')
      }
    } catch (err) {
      console.error('Error fetching recommendations:', err)
      setError(err instanceof Error ? err.message : 'Failed to load recommendations')
    } finally {
      setLoading(false)
    }
  }

  const generateNewRecommendations = async () => {
    if (!user) return

    setLoading(true)
    try {
      const response = await apiClient.generateRecommendations()
      if (response.success && response.data) {
        setRecommendations(response.data.recommendations)
        if (response.data.profileCompleteness !== undefined) {
          setProfileCompleteness(response.data.profileCompleteness)
        }
        toast.success('Recommendations updated!')
      } else {
        throw new Error(response.error || 'Failed to generate recommendations')
      }
    } catch (err) {
      console.error('Error generating recommendations:', err)
      toast.error(err instanceof Error ? err.message : 'Failed to generate recommendations')
    } finally {
      setLoading(false)
    }
  }

  const getMatchScoreColor = (score: number) => {
    if (score >= 80) return 'from-green-500 to-emerald-600'
    if (score >= 60) return 'from-blue-500 to-indigo-600'
    if (score >= 40) return 'from-yellow-500 to-orange-600'
    return 'from-gray-500 to-slate-600'
  }

  const getMatchScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent Match'
    if (score >= 60) return 'Good Match'
    if (score >= 40) return 'Fair Match'
    return 'Basic Match'
  }

  if (!user) {
    return (
      <Card className="p-8 bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-950/30 dark:to-orange-950/30 border border-amber-200 dark:border-amber-800/30">
        <div className="text-center">
          <div className="w-16 h-16 bg-amber-500 dark:bg-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-amber-900 dark:text-amber-100 mb-2">Sign In for Personalized Recommendations</h3>
          <p className="text-amber-700 dark:text-amber-300">
            Complete your profile to get AI-powered career roadmap recommendations tailored just for you!
          </p>
        </div>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card className="p-8 bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-indigo-950/30 dark:to-purple-950/30 border-0 dark:border dark:border-indigo-800/30 shadow-lg">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-400/30 dark:border-indigo-500/30 border-t-indigo-400 dark:border-t-indigo-400 rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="text-xl font-bold text-indigo-900 dark:text-indigo-100 mb-2">Analyzing Your Profile</h3>
          <p className="text-indigo-700 dark:text-indigo-300">
            Our AI is generating personalized career recommendations...
          </p>
        </div>
      </Card>
    )
  }

  if (error && profileCompleteness < 30) {
    return (
      <Card className="p-8 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-800/30">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-500 dark:bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-2">Complete Your Profile First</h3>
          <p className="text-blue-700 dark:text-blue-300 mb-4">
            To get personalized career recommendations, please add your skills and interests in your profile.
          </p>
          <div className="w-full bg-blue-200 dark:bg-blue-900/30 rounded-full h-3 mb-2">
            <div
              className="bg-blue-500 dark:bg-blue-400 h-3 rounded-full transition-all duration-500"
              style={{ width: `${profileCompleteness}%` }}
            />
          </div>
          <p className="text-sm text-blue-600 dark:text-blue-400">Profile {profileCompleteness}% complete</p>
        </div>
      </Card>
    )
  }

  if (!recommendations.length) {
    return (
      <Card className="p-8 bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-950/30 dark:to-pink-950/30 border border-purple-200 dark:border-purple-800/30">
        <div className="text-center">
          <div className="w-16 h-16 bg-purple-500 dark:bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-purple-900 dark:text-purple-100 mb-2">No Recommendations Yet</h3>
          <p className="text-purple-700 dark:text-purple-300 mb-4">
            Complete your profile with skills and interests to get personalized career recommendations.
          </p>
          <Button
            onClick={generateNewRecommendations}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Generate Recommendations
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl shadow-2xl"
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
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-4">
              <motion.div
                initial={{ scale: 0.8, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.5, type: "spring" }}
                className="relative"
              >
                <div className="absolute inset-0 bg-yellow-400 rounded-2xl blur-xl opacity-60 animate-pulse" />
                <div className="relative p-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl shadow-xl">
                  <Star className="w-8 h-8 text-white" />
                </div>
              </motion.div>
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold mb-2 text-white flex items-center gap-2">
                  Recommended for You
                  <span className="text-2xl">🚀</span>
                </h2>
                <p className="text-purple-100 text-base lg:text-lg">
                  AI-powered career paths tailored to your unique profile
                </p>
              </div>
            </div>
            <Button
              onClick={generateNewRecommendations}
              variant="outline"
              className="border-2 border-white/40 text-white hover:bg-white/20 backdrop-blur-sm font-semibold px-6 py-3 h-auto transition-all duration-300 hover:scale-105 hover:shadow-lg"
              disabled={loading}
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      </motion.div>

      {/* Recommendations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((recommendation, index) => (
          <motion.div
            key={recommendation.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="group relative p-0 h-full border-0 dark:border dark:border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] overflow-hidden bg-white dark:bg-gray-900">
              {/* Gradient Background Accent */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950/20 dark:via-purple-950/20 dark:to-pink-950/20 opacity-50 group-hover:opacity-70 transition-opacity" />

              <div className="relative p-6 h-full flex flex-col">
                {/* Match Score Badge with Animation */}
                <div className="flex items-center justify-between mb-5">
                  <div className="relative">
                    <div className={`absolute inset-0 bg-gradient-to-r ${getMatchScoreColor(recommendation.matchScore)} rounded-xl blur-md opacity-50 group-hover:opacity-70 transition-opacity`} />
                    <Badge className={`relative px-4 py-2 text-white font-bold border-0 bg-gradient-to-r ${getMatchScoreColor(recommendation.matchScore)} shadow-lg`}>
                      <span className="text-lg">{recommendation.matchScore}%</span>
                      <span className="ml-2 text-xs opacity-90">{getMatchScoreLabel(recommendation.matchScore)}</span>
                    </Badge>
                  </div>
                  <div className="text-right bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-600 shadow-sm">
                    <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Skill Level</div>
                    <div className="text-sm font-bold text-gray-800 dark:text-gray-200 capitalize mt-0.5">
                      {recommendation.skillLevel}
                    </div>
                  </div>
                </div>

                {/* Title with Icon */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-400 dark:to-purple-500 rounded-full animate-pulse" />
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 dark:from-gray-100 dark:via-indigo-100 dark:to-purple-100 bg-clip-text text-transparent group-hover:from-indigo-600 group-hover:via-purple-600 group-hover:to-pink-600 dark:group-hover:from-indigo-400 dark:group-hover:via-purple-400 dark:group-hover:to-pink-400 transition-all duration-300">
                      {recommendation.title}
                    </h3>
                  </div>
                </div>

              {/* ROI Summary with Enhanced Design */}
              <div className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-emerald-950/30 dark:via-green-950/30 dark:to-teal-950/30 rounded-2xl p-5 mb-4 border-2 border-green-100 dark:border-green-800/30 shadow-sm">
                <div className="absolute top-0 right-0 w-20 h-20 bg-green-200/30 dark:bg-green-500/10 rounded-full blur-2xl" />
                <div className="relative grid grid-cols-2 gap-4">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-green-600/10 dark:bg-green-400/10 rounded-xl">
                      <Clock className="w-5 h-5 text-green-700 dark:text-green-400" />
                    </div>
                    <div>
                      <div className="text-gray-600 dark:text-gray-400 text-xs font-medium mb-1">Duration</div>
                      <div className="font-bold text-green-900 dark:text-green-100 text-base">{recommendation.roi.time}</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-green-600/10 dark:bg-green-400/10 rounded-xl">
                      <DollarSign className="w-5 h-5 text-green-700 dark:text-green-400" />
                    </div>
                    <div>
                      <div className="text-gray-600 dark:text-gray-400 text-xs font-medium mb-1">Expected Salary</div>
                      <div className="font-bold text-green-900 dark:text-green-100 text-base">{recommendation.roi.salary}</div>
                    </div>
                  </div>
                  <div className="col-span-2 pt-2 border-t border-green-200/50 dark:border-green-700/30">
                    <div className="text-xs text-gray-600 dark:text-gray-400 font-medium mb-1">Return on Investment</div>
                    <div className="font-bold text-green-900 dark:text-green-100 text-lg flex items-center gap-2">
                      {recommendation.roi.roiFactor}
                      <span className="text-xs text-green-700 dark:text-green-300 font-normal bg-green-100 dark:bg-green-900/40 px-2 py-1 rounded-full">Great ROI</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Job Trends with Better Design */}
              <div className="mb-5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl p-4 border border-blue-100 dark:border-blue-800/30">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="p-1.5 bg-blue-600/10 dark:bg-blue-400/10 rounded-lg">
                    <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-sm font-bold text-gray-800 dark:text-gray-200">Market Trends</span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {recommendation.trends}
                </p>
              </div>

              {/* Preview Topics with Enhanced Badges */}
              <div className="mb-6">
                <div className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  Key Learning Areas:
                </div>
                <div className="flex flex-wrap gap-2">
                  {recommendation.previewTopics.slice(0, 3).map((topic, idx) => (
                    <Badge key={idx} className="text-xs bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-400 dark:to-indigo-500 text-white border-0 px-3 py-1.5 shadow-sm hover:shadow-md transition-shadow">
                      {topic}
                    </Badge>
                  ))}
                  {recommendation.previewTopics.length > 3 && (
                    <Badge className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 px-3 py-1.5 font-semibold">
                      +{recommendation.previewTopics.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>

              {/* Matched Skills & Interests with Better Design */}
              {(recommendation.matchedSkills.length > 0 || recommendation.matchedInterests.length > 0) && (
                <div className="mb-6 space-y-3 bg-gray-50/50 dark:bg-gray-800/30 rounded-xl p-4 border border-gray-100 dark:border-gray-700/30">
                  {recommendation.matchedSkills.length > 0 && (
                    <div>
                      <div className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 bg-green-600 dark:bg-green-500 rounded-full" />
                        Matched Skills:
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {recommendation.matchedSkills.slice(0, 3).map((skill, idx) => (
                          <Badge key={idx} className="text-xs bg-gradient-to-r from-green-500 to-emerald-600 dark:from-green-400 dark:to-emerald-500 text-white border-0 px-3 py-1.5 shadow-sm">
                            ✓ {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {recommendation.matchedInterests.length > 0 && (
                    <div>
                      <div className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 bg-purple-600 dark:bg-purple-500 rounded-full" />
                        Matched Interests:
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {recommendation.matchedInterests.slice(0, 2).map((interest, idx) => (
                          <Badge key={idx} className="text-xs bg-gradient-to-r from-purple-500 to-pink-600 dark:from-purple-400 dark:to-pink-500 text-white border-0 px-3 py-1.5 shadow-sm">
                            💜 {interest}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Start Roadmap Button with Enhanced Design */}
              <div className="mt-auto pt-4">
                <Button
                  onClick={() => onStartRoadmap(recommendation.domain, recommendation.skillLevel)}
                  className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold py-4 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] group relative overflow-hidden"
                >
                  {/* Button shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />

                  <div className="relative flex items-center justify-center gap-2">
                    <Target className="w-5 h-5" />
                    <span className="text-base">Start Roadmap</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Button>
              </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
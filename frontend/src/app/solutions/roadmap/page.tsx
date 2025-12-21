'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import Navbar from '@/components/layout/navbar'
import { Roadmap } from '@/components/ui/roadmap'
import { RecommendedRoadmaps } from '@/components/ui/recommended-roadmaps'
import { PersonalizedRecommendationBanner } from '@/components/ui/personalized-roadmap-banner'
import { MapPin, Target, BookOpen } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { useAuth } from '@/components/auth-provider'

export default function RoadmapPage() {
  const { user } = useAuth()
  const roadmapGeneratorRef = useRef<HTMLDivElement>(null)
  const [prefilledDomain, setPrefilledDomain] = useState<string>('')
  const [prefilledSkillLevel, setPrefilledSkillLevel] = useState<string>('')
  const [resumeRecommendations, setResumeRecommendations] = useState<any>(null)
  const [showPersonalized, setShowPersonalized] = useState(false)
  const [loadingRecommendations, setLoadingRecommendations] = useState(true)
  const [isCached, setIsCached] = useState(false)
  const [modelUsed, setModelUsed] = useState<string>('unknown')
  
  // Fetch personalized recommendations when user is available
  useEffect(() => {
    let mounted = true

    const loadRecommendations = async () => {
      if (!mounted) return

      if (user) {
        await fetchPersonalizedRecommendations()
      } else {
        // User not logged in, stop loading
        setLoadingRecommendations(false)
      }
    }

    loadRecommendations()

    return () => {
      mounted = false
    }
  }, [user])

  const fetchPersonalizedRecommendations = async (forceRegenerate = false) => {
    try {
      setLoadingRecommendations(true)

      if (!user) {
        console.log('ℹ️ No user logged in, skipping personalized recommendations')
        setLoadingRecommendations(false)
        return
      }

      console.log(`🔄 Fetching personalized recommendations for: ${user.email} (force: ${forceRegenerate})`)

      const token = await user.getIdToken()
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

      const url = `${API_BASE_URL}/api/roadmap/personalized${forceRegenerate ? '?forceRegenerate=true' : ''}`
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      console.log('📥 Response received:', {
        success: data.success,
        hasResume: data.hasResume,
        cached: data.cached,
        modelUsed: data.modelUsed
      })

      if (data.success && data.hasResume && data.data) {
        setResumeRecommendations(data.data)
        setShowPersonalized(true)
        setIsCached(data.cached || false)
        setModelUsed(data.modelUsed || 'unknown')
        console.log(`✅ Recommendations loaded: ${data.data.recommendedDomain} | Cached: ${data.cached} | Model: ${data.modelUsed}`)
      } else {
        console.log('ℹ️ No resume found for personalized recommendations')
        setShowPersonalized(false)
      }
    } catch (error: any) {
      console.error('❌ Failed to fetch personalized recommendations:', error.message)
      setShowPersonalized(false)
    } finally {
      setLoadingRecommendations(false)
    }
  }

  const handleRegenerateRecommendations = async () => {
    await fetchPersonalizedRecommendations(true)
  }

  const handleApplyPersonalizedRoadmap = () => {
    if (!resumeRecommendations) return

    // Set the prefilled values from AI recommendations
    setPrefilledDomain(resumeRecommendations.recommendedDomain)
    setPrefilledSkillLevel(resumeRecommendations.skillLevel)

    // Scroll to the roadmap generator
    setTimeout(() => {
      roadmapGeneratorRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }, 100)
  }

  const generateRoadmap = async (career_domain: string, skill_level: string) => {
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

      // Get authentication token if user is logged in
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      }

      if (user) {
        try {
          const token = await user.getIdToken()
          headers['Authorization'] = `Bearer ${token}`
        } catch (error) {
          console.error('Failed to get auth token:', error)
          throw new Error('Authentication required. Please log in to generate roadmaps.')
        }
      } else {
        throw new Error('Please log in to generate roadmaps')
      }

      const response = await fetch(`${API_BASE_URL}/api/roadmap/generate`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          career_domain,
          skill_level
        }),
      })

      if (response.ok) {
        const data = await response.json()
        return data
      } else {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Failed to generate roadmap')
      }
    } catch (error: any) {
      console.error('Error generating roadmap:', error)
      throw error
    }
  }

  const handleStartRecommendedRoadmap = (domain: string, skillLevel: string) => {
    // Set the prefilled values
    setPrefilledDomain(domain)
    setPrefilledSkillLevel(skillLevel)
    
    // Scroll to the roadmap generator
    roadmapGeneratorRef.current?.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    })
    
    // Small delay to ensure scrolling completes, then trigger auto-generation
    setTimeout(() => {
      // The Roadmap component will auto-generate when it receives these props
    }, 500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950/20">
      <Navbar />

      {/* Hero Header */}
      <div className="relative overflow-hidden mt-16 sm:mt-20">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 via-purple-600/10 to-pink-600/10 dark:from-indigo-500/5 dark:via-purple-500/5 dark:to-pink-500/5" />
        <div className="absolute inset-0 opacity-40 dark:opacity-20"
             style={{
               backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23a855f7' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
             }} />

        <div className="relative max-w-7xl mx-auto px-3 sm:px-4 py-10 sm:py-16 lg:py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            {/* Icon with animated glow */}
            <div className="flex items-center justify-center mb-5 sm:mb-8">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl sm:rounded-2xl blur-xl opacity-50 animate-pulse" />
                <div className="relative p-4 sm:p-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl sm:rounded-2xl shadow-xl">
                  <MapPin className="w-7 h-7 sm:w-10 sm:h-10 text-white" />
                </div>
              </motion.div>
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-8 px-2"
            >
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                Career Roadmap
              </span>
              <br />
              <span className="text-gray-800 dark:text-gray-100">Generator</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-base sm:text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto mb-8 sm:mb-12 leading-relaxed px-2"
            >
              Create your personalized learning journey with AI-powered roadmaps tailored to your goals.
              <span className="text-purple-600 dark:text-purple-400 font-semibold"> Track progress, access curated resources, and achieve your career dreams.</span>
            </motion.p>

            {/* Stats or badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-gray-500 dark:text-gray-400 px-2"
            >
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 dark:bg-green-400 rounded-full animate-pulse" />
                <span>50+ Career Domains</span>
              </div>
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 dark:bg-blue-400 rounded-full animate-pulse" />
                <span>Personalized Paths</span>
              </div>
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-500 dark:bg-purple-400 rounded-full animate-pulse" />
                <span>Progress Tracking</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Personalized Recommendation Banner */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 pt-6 sm:pt-8">
        {loadingRecommendations && user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl sm:rounded-3xl shadow-2xl p-5 sm:p-8 mb-6 sm:mb-10"
          >
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-3 sm:mb-4"></div>
              <h3 className="text-lg sm:text-2xl font-bold text-white mb-1.5 sm:mb-2">Analyzing Your Resume</h3>
              <p className="text-purple-100 text-sm sm:text-base px-2">
                Our AI is generating personalized career recommendations based on your resume...
              </p>
            </div>
          </motion.div>
        )}
        {!loadingRecommendations && showPersonalized && resumeRecommendations && (
          <PersonalizedRecommendationBanner
            recommendations={resumeRecommendations}
            onApply={handleApplyPersonalizedRoadmap}
            onRegenerate={handleRegenerateRecommendations}
            isCached={isCached}
            modelUsed={modelUsed}
            isLoading={loadingRecommendations}
          />
        )}
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-10 sm:py-16 lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center mb-8 sm:mb-12 lg:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2 sm:mb-4 px-2">
            Why Choose Our <span className="text-purple-600 dark:text-purple-400">Roadmaps?</span>
          </h2>
          <p className="text-sm sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-2">
            Experience the power of AI-driven career guidance with features designed for your success
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-10 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="group"
          >
            <Card className="p-5 sm:p-6 lg:p-8 text-center h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/30 dark:to-indigo-950/30 group-hover:from-blue-100 group-hover:to-indigo-200 dark:group-hover:from-blue-950/50 dark:group-hover:to-indigo-950/50 dark:border dark:border-blue-800/30">
              <div className="relative mb-4 sm:mb-6">
                <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-400 dark:to-indigo-500 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Target className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 bg-yellow-400 dark:bg-yellow-500 rounded-full animate-pulse" />
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2 sm:mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                Personalized Paths
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
                AI-powered roadmaps tailored to your current skill level, career goals, and learning preferences
              </p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="group"
          >
            <Card className="p-5 sm:p-6 lg:p-8 text-center h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950/30 dark:to-emerald-950/30 group-hover:from-green-100 group-hover:to-emerald-200 dark:group-hover:from-green-950/50 dark:group-hover:to-emerald-950/50 dark:border dark:border-green-800/30">
              <div className="relative mb-4 sm:mb-6">
                <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-r from-green-500 to-emerald-600 dark:from-green-400 dark:to-emerald-500 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 bg-orange-400 dark:bg-orange-500 rounded-full animate-pulse" />
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2 sm:mb-4 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                Curated Resources
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
                Premium learning materials from NPTEL, Coursera, freeCodeCamp, and top educational platforms
              </p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="group sm:col-span-2 lg:col-span-1"
          >
            <Card className="p-5 sm:p-6 lg:p-8 text-center h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-950/30 dark:to-pink-950/30 group-hover:from-purple-100 group-hover:to-pink-200 dark:group-hover:from-purple-950/50 dark:group-hover:to-pink-950/50 dark:border dark:border-purple-800/30">
              <div className="relative mb-4 sm:mb-6">
                <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-r from-purple-500 to-pink-600 dark:from-purple-400 dark:to-pink-500 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 bg-green-400 dark:bg-green-500 rounded-full animate-pulse" />
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2 sm:mb-4 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                Smart Progress Tracking
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
                Visual milestone tracking with achievement badges and progress analytics to keep you motivated
              </p>
            </Card>
          </motion.div>
        </div>

        {/* Recommended Roadmaps Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="relative"
        >
          <RecommendedRoadmaps onStartRoadmap={handleStartRecommendedRoadmap} />
        </motion.div>

        {/* Roadmap Component */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="relative"
          ref={roadmapGeneratorRef}
        >
          {/* Background decoration */}
          <div className="absolute -inset-4 bg-gradient-to-r from-purple-200/20 via-pink-200/20 to-indigo-200/20 dark:from-purple-500/10 dark:via-pink-500/10 dark:to-indigo-500/10 rounded-3xl blur-3xl" />
          <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-1">
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-inner">
              <Roadmap
                onGenerateRoadmap={generateRoadmap}
                prefilledDomain={prefilledDomain}
                prefilledSkillLevel={prefilledSkillLevel}
                onPrefilledUsed={() => {
                  setPrefilledDomain('')
                  setPrefilledSkillLevel('')
                }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Area, AreaChart
} from 'recharts'
import {
  Target, TrendingUp, BookOpen, Clock, Star, Calendar, Award, Brain,
  MessageSquare, ChevronRight, Zap, Trophy, Flame, CheckCircle2, MapPin,
  Users, ArrowUp, Activity, Sparkles, GraduationCap, Rocket, Shield
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/layout/navbar'
import { RoadmapProgressCard } from '@/components/dashboard/RoadmapProgressCard'
import { MockInterviewProgressCard } from '@/components/dashboard/MockInterviewProgressCard'
import { useAuth } from '@/components/auth-provider'
import QuotaDisplay from '@/components/dashboard/QuotaDisplay'

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981']

export default function DashboardPage() {
  const { user } = useAuth()
  const [dashboardSummary, setDashboardSummary] = useState<any>(null)
  const [userProgress, setUserProgress] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTimeRange, setSelectedTimeRange] = useState('week')
  const router = useRouter()

  useEffect(() => {
    if (user) {
      fetchDashboardData()
    } else {
      setIsLoading(false)
    }
  }, [user])

  const fetchDashboardData = async () => {
    if (!user) {
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

      console.log('📊 Fetching dashboard data for user:', user.uid)

      // Create abort controller for timeout
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 30000) // 30 second timeout

      try {
        // Fetch unified dashboard summary
        const summaryResponse = await fetch(`${API_BASE_URL}/api/progress/dashboard/${user.uid}`, {
          signal: controller.signal
        })
        clearTimeout(timeout)

        if (summaryResponse.ok) {
          const summaryData = await summaryResponse.json()
          console.log('✅ Dashboard summary loaded:', summaryData.data)
          console.log('🗺️ Roadmap data:', {
            roadmaps: summaryData.data?.roadmaps?.roadmaps,
            totalMilestones: summaryData.data?.roadmaps?.totalMilestones,
            completedMilestones: summaryData.data?.roadmaps?.completedMilestones,
            percentage: summaryData.data?.roadmaps?.percentage
          })
          setDashboardSummary(summaryData.data)
        } else if (summaryResponse.status === 503) {
          // Service temporarily unavailable - retry after a delay
          console.warn('⚠️ Dashboard temporarily unavailable, retrying in 5 seconds...')
          setTimeout(() => fetchDashboardData(), 5000)
          return
        } else {
          console.error('❌ Failed to fetch dashboard summary:', summaryResponse.status)
        }

        // Fetch detailed user progress for resources
        const progressResponse = await fetch(`${API_BASE_URL}/api/progress/user/${user.uid}`)
        if (progressResponse.ok) {
          const progressData = await progressResponse.json()
          setUserProgress(progressData.data.progress)
        }
      } catch (fetchError) {
        clearTimeout(timeout)
        if (fetchError instanceof Error && fetchError.name === 'AbortError') {
          console.error('⏱️ Dashboard request timed out, retrying...')
          // Retry once after timeout
          setTimeout(() => fetchDashboardData(), 2000)
          return
        }
        throw fetchError
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Calculate weekly activity data
  const weeklyActivityData = [
    { day: 'Mon', activities: dashboardSummary?.recentActivity?.last7Days?.resources || 0 + (dashboardSummary?.recentActivity?.last7Days?.aptitudeTests || 0) },
    { day: 'Tue', activities: Math.floor(Math.random() * 5) },
    { day: 'Wed', activities: Math.floor(Math.random() * 5) },
    { day: 'Thu', activities: Math.floor(Math.random() * 5) },
    { day: 'Fri', activities: Math.floor(Math.random() * 5) },
    { day: 'Sat', activities: Math.floor(Math.random() * 3) },
    { day: 'Sun', activities: Math.floor(Math.random() * 3) },
  ]

  // Category distribution for pie chart
  const categoryData = dashboardSummary?.resources?.byCategory
    ? Object.entries(dashboardSummary.resources.byCategory).map(([name, value]: [string, any]) => ({
        name,
        value: value.completed
      }))
    : []

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950/20">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="p-8 text-center max-w-md bg-white dark:bg-slate-800 rounded-3xl border-2 border-gray-300 dark:border-slate-600 shadow-xl">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Welcome to Your Dashboard</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">Please sign in to view your personalized career progress</p>
            <Button onClick={() => router.push('/login')} className="w-full">
              Sign In
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950/20">
      <Navbar />

      {/* Hero Section with Greeting */}
      <div className="relative overflow-hidden mt-20 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-900 dark:via-purple-900 dark:to-pink-900">
        <div className="absolute inset-0 bg-grid-white/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                  Welcome back, {user?.displayName?.split(' ')[0] || 'Learner'}! 🎯
                </h1>
                <p className="text-xl text-blue-100">
                  {dashboardSummary?.overall?.learningStreak > 0
                    ? `You're on a ${dashboardSummary.overall.learningStreak} day streak! Keep it up!`
                    : "Let's start your learning journey today!"
                  }
                </p>
              </motion.div>

              {/* Quick Stats Row */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-wrap gap-4 mt-6"
              >
                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                  <Flame className="w-5 h-5 text-orange-300" />
                  <span className="text-white font-semibold">
                    {dashboardSummary?.overall?.learningStreak || 0} Day Streak
                  </span>
                </div>
                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                  <Trophy className="w-5 h-5 text-yellow-300" />
                  <span className="text-white font-semibold">
                    {dashboardSummary?.overall?.totalAchievements || 0} Achievements
                  </span>
                </div>
                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                  <Brain className="w-5 h-5 text-blue-300" />
                  <span className="text-white font-semibold">
                    {dashboardSummary?.mockInterviews?.totalAptitudeTests || 0} Aptitude Tests
                  </span>
                </div>
                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                  <Activity className="w-5 h-5 text-green-300" />
                  <span className="text-white font-semibold">
                    {dashboardSummary?.recentActivity?.last7Days?.total || 0} This Week
                  </span>
                </div>
              </motion.div>
            </div>

            {/* Overall Progress Circle */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="hidden lg:flex flex-col items-center"
            >
              <div className="relative">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="12"
                    fill="none"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="white"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 56}`}
                    strokeDashoffset={`${2 * Math.PI * 56 * (1 - (dashboardSummary?.overall?.completionPercentage || 0) / 100)}`}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">
                      {dashboardSummary?.overall?.completionPercentage || 0}%
                    </div>
                    <div className="text-xs text-blue-100">Overall</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 -mt-6">
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left Column - Main Content (8 cols) */}
          <div className="lg:col-span-8 space-y-6">

            {/* Learning Progress Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="p-6 bg-white dark:bg-slate-800 rounded-3xl shadow-xl border-2 border-gray-300 dark:border-slate-600">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Learning Progress</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Track your journey across all modules</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {['week', 'month', 'all'].map((range) => (
                      <Button
                        key={range}
                        variant={selectedTimeRange === range ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedTimeRange(range)}
                        className="capitalize"
                      >
                        {range}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Progress Bars for Each Module */}
                <div className="space-y-4 mb-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center space-x-2">
                        <BookOpen className="w-4 h-4 text-green-600 dark:text-green-400" />
                        <span className="font-medium text-gray-700 dark:text-gray-200">Resources</span>
                      </div>
                      <span className="text-lg font-bold text-green-600 dark:text-green-400">
                        {dashboardSummary?.resources?.percentage || 0}%
                      </span>
                    </div>
                    <Progress value={dashboardSummary?.resources?.percentage || 0} className="h-3 bg-gray-200 dark:bg-gray-700" />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {dashboardSummary?.resources?.completed || 0} of {dashboardSummary?.resources?.total || 0} completed
                    </p>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        <span className="font-medium text-gray-700 dark:text-gray-200">Roadmap Milestones</span>
                      </div>
                      <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                        {dashboardSummary?.roadmaps?.percentage || 0}%
                      </span>
                    </div>
                    <Progress value={dashboardSummary?.roadmaps?.percentage || 0} className="h-3 bg-gray-200 dark:bg-gray-700" />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {dashboardSummary?.roadmaps?.completedMilestones || 0} of {dashboardSummary?.roadmaps?.totalMilestones || 0} milestones
                    </p>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center space-x-2">
                        <MessageSquare className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span className="font-medium text-gray-700 dark:text-gray-200">Mock Interviews</span>
                      </div>
                      <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        {dashboardSummary?.mockInterviews?.totalInterviews || 0}
                      </span>
                    </div>
                    <Progress
                      value={Math.min((dashboardSummary?.mockInterviews?.totalInterviews || 0) * 10, 100)}
                      className="h-3 bg-gray-200 dark:bg-gray-700"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {dashboardSummary?.mockInterviews?.totalInterviews || 0} interviews completed
                    </p>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center space-x-2">
                        <Brain className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        <span className="font-medium text-gray-700 dark:text-gray-200">Aptitude Tests</span>
                      </div>
                      <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                        {dashboardSummary?.mockInterviews?.avgAptitudeScore || 0}%
                      </span>
                    </div>
                    <Progress value={dashboardSummary?.mockInterviews?.avgAptitudeScore || 0} className="h-3 bg-gray-200 dark:bg-gray-700" />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {dashboardSummary?.mockInterviews?.totalAptitudeTests || 0} tests taken • Avg: {dashboardSummary?.mockInterviews?.avgAptitudeScore || 0}%
                    </p>
                  </div>
                </div>

                {/* Weekly Activity Chart */}
                <div className="mt-6">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4">Weekly Activity</h4>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={weeklyActivityData}>
                        <defs>
                          <linearGradient id="colorActivities" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="day" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <Tooltip />
                        <Area
                          type="monotone"
                          dataKey="activities"
                          stroke="#3b82f6"
                          fillOpacity={1}
                          fill="url(#colorActivities)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Category Distribution */}
            {categoryData.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div className="p-6 bg-white dark:bg-slate-800 rounded-3xl shadow-xl border-2 border-gray-300 dark:border-slate-600">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl">
                      <BarChart className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Learning by Category</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Your focus areas at a glance</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={categoryData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {categoryData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="flex flex-col justify-center space-y-3">
                      {categoryData.map((category, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            />
                            <span className="font-medium text-gray-900 dark:text-gray-100">{category.name}</span>
                          </div>
                          <span className="text-lg font-bold text-gray-700 dark:text-gray-200">{category.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Aptitude Test Performance Breakdown */}
            {dashboardSummary?.mockInterviews?.totalAptitudeTests > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <div className="p-6 bg-white dark:bg-slate-800 rounded-3xl shadow-xl border-2 border-gray-300 dark:border-slate-600">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl">
                      <Brain className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Aptitude Test Performance</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Your performance across different test types</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {/* Logical Reasoning */}
                    {dashboardSummary?.mockInterviews?.performanceByType?.['logical-reasoning'] && (
                      <div className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-200">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-gray-900 text-sm">Logical Reasoning</h4>
                          <Badge className="bg-purple-100 text-purple-700">
                            {dashboardSummary.mockInterviews.performanceByType['logical-reasoning'].testsTaken} tests
                          </Badge>
                        </div>
                        <div className="mb-2">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs text-gray-600">Average</span>
                            <span className="text-2xl font-bold text-purple-600">
                              {dashboardSummary.mockInterviews.performanceByType['logical-reasoning'].avgScore}%
                            </span>
                          </div>
                          <Progress
                            value={dashboardSummary.mockInterviews.performanceByType['logical-reasoning'].avgScore}
                            className="h-2"
                          />
                        </div>
                        <div className="flex justify-between text-xs text-gray-600 mt-3">
                          <span>Best: {dashboardSummary.mockInterviews.performanceByType['logical-reasoning'].bestScore}%</span>
                          <span className={dashboardSummary.mockInterviews.performanceByType['logical-reasoning'].improvement >= 0 ? 'text-green-600' : 'text-red-600'}>
                            {dashboardSummary.mockInterviews.performanceByType['logical-reasoning'].improvement >= 0 ? '+' : ''}
                            {dashboardSummary.mockInterviews.performanceByType['logical-reasoning'].improvement}%
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Quantitative Aptitude */}
                    {dashboardSummary?.mockInterviews?.performanceByType?.['quantitative-aptitude'] && (
                      <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-gray-900 text-sm">Quantitative</h4>
                          <Badge className="bg-blue-100 text-blue-700">
                            {dashboardSummary.mockInterviews.performanceByType['quantitative-aptitude'].testsTaken} tests
                          </Badge>
                        </div>
                        <div className="mb-2">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs text-gray-600">Average</span>
                            <span className="text-2xl font-bold text-blue-600">
                              {dashboardSummary.mockInterviews.performanceByType['quantitative-aptitude'].avgScore}%
                            </span>
                          </div>
                          <Progress
                            value={dashboardSummary.mockInterviews.performanceByType['quantitative-aptitude'].avgScore}
                            className="h-2"
                          />
                        </div>
                        <div className="flex justify-between text-xs text-gray-600 mt-3">
                          <span>Best: {dashboardSummary.mockInterviews.performanceByType['quantitative-aptitude'].bestScore}%</span>
                          <span className={dashboardSummary.mockInterviews.performanceByType['quantitative-aptitude'].improvement >= 0 ? 'text-green-600' : 'text-red-600'}>
                            {dashboardSummary.mockInterviews.performanceByType['quantitative-aptitude'].improvement >= 0 ? '+' : ''}
                            {dashboardSummary.mockInterviews.performanceByType['quantitative-aptitude'].improvement}%
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Verbal Ability */}
                    {dashboardSummary?.mockInterviews?.performanceByType?.['verbal-ability'] && (
                      <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-gray-900 text-sm">Verbal Ability</h4>
                          <Badge className="bg-green-100 text-green-700">
                            {dashboardSummary.mockInterviews.performanceByType['verbal-ability'].testsTaken} tests
                          </Badge>
                        </div>
                        <div className="mb-2">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs text-gray-600">Average</span>
                            <span className="text-2xl font-bold text-green-600">
                              {dashboardSummary.mockInterviews.performanceByType['verbal-ability'].avgScore}%
                            </span>
                          </div>
                          <Progress
                            value={dashboardSummary.mockInterviews.performanceByType['verbal-ability'].avgScore}
                            className="h-2"
                          />
                        </div>
                        <div className="flex justify-between text-xs text-gray-600 mt-3">
                          <span>Best: {dashboardSummary.mockInterviews.performanceByType['verbal-ability'].bestScore}%</span>
                          <span className={dashboardSummary.mockInterviews.performanceByType['verbal-ability'].improvement >= 0 ? 'text-green-600' : 'text-red-600'}>
                            {dashboardSummary.mockInterviews.performanceByType['verbal-ability'].improvement >= 0 ? '+' : ''}
                            {dashboardSummary.mockInterviews.performanceByType['verbal-ability'].improvement}%
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Show message when no test type data available */}
                  {!dashboardSummary?.mockInterviews?.performanceByType?.['logical-reasoning'] &&
                   !dashboardSummary?.mockInterviews?.performanceByType?.['quantitative-aptitude'] &&
                   !dashboardSummary?.mockInterviews?.performanceByType?.['verbal-ability'] && (
                    <div className="text-center py-8">
                      <Brain className="w-12 h-12 text-indigo-300 dark:text-indigo-500 mx-auto mb-3" />
                      <p className="text-gray-600 dark:text-gray-300 mb-4">Start taking aptitude tests to see your performance breakdown</p>
                      <Button
                        onClick={() => router.push('/mock-interview')}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                      >
                        Take Aptitude Test
                      </Button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <div className="p-6 bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-700 text-white shadow-xl border-2 border-transparent rounded-3xl">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <Zap className="w-6 h-6 mr-2" />
                  Quick Actions
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button
                    onClick={() => router.push('/resources')}
                    className="bg-white/20 hover:bg-white/30 text-white border-0 h-auto py-4 flex flex-col items-center space-y-2"
                  >
                    <BookOpen className="w-6 h-6" />
                    <span className="text-sm">Browse Resources</span>
                  </Button>
                  <Button
                    onClick={() => router.push('/solutions/roadmap')}
                    className="bg-white/20 hover:bg-white/30 text-white border-0 h-auto py-4 flex flex-col items-center space-y-2"
                  >
                    <MapPin className="w-6 h-6" />
                    <span className="text-sm">Create Roadmap</span>
                  </Button>
                  <Button
                    onClick={() => router.push('/mock-interview')}
                    className="bg-white/20 hover:bg-white/30 text-white border-0 h-auto py-4 flex flex-col items-center space-y-2"
                  >
                    <Brain className="w-6 h-6" />
                    <span className="text-sm">Practice Test</span>
                  </Button>
                  <Button
                    onClick={() => router.push('/careers')}
                    className="bg-white/20 hover:bg-white/30 text-white border-0 h-auto py-4 flex flex-col items-center space-y-2"
                  >
                    <Target className="w-6 h-6" />
                    <span className="text-sm">Find Jobs</span>
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-6">

            {/* Usage Quota Display */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <QuotaDisplay />
            </motion.div>

            {/* Weekly Goal */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="p-6 bg-gradient-to-br from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700 text-white shadow-xl border-2 border-transparent rounded-3xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold flex items-center">
                    <Target className="w-5 h-5 mr-2" />
                    Weekly Goal
                  </h3>
                  <Badge className="bg-white/20 text-white border-0">
                    {dashboardSummary?.overall?.weeklyGoal?.current || 0}/{dashboardSummary?.overall?.weeklyGoal?.target || 5}
                  </Badge>
                </div>
                <div className="mb-4">
                  <Progress
                    value={Math.min(((dashboardSummary?.overall?.weeklyGoal?.current || 0) / (dashboardSummary?.overall?.weeklyGoal?.target || 5)) * 100, 100)}
                    className="h-3 bg-white/20"
                  />
                </div>
                <p className="text-sm text-green-100">
                  {(dashboardSummary?.overall?.weeklyGoal?.current || 0) >= (dashboardSummary?.overall?.weeklyGoal?.target || 5)
                    ? "🎉 Goal achieved! Amazing work!"
                    : `${(dashboardSummary?.overall?.weeklyGoal?.target || 5) - (dashboardSummary?.overall?.weeklyGoal?.current || 0)} more to reach your goal`
                  }
                </p>
              </div>
            </motion.div>

            {/* Roadmap Progress Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              {user && (
                <RoadmapProgressCard
                  roadmaps={dashboardSummary?.roadmaps?.roadmaps || []}
                  totalMilestones={dashboardSummary?.roadmaps?.totalMilestones || 0}
                  completedMilestones={dashboardSummary?.roadmaps?.completedMilestones || 0}
                  percentage={dashboardSummary?.roadmaps?.percentage || 0}
                  recentActivity={dashboardSummary?.roadmaps?.recentActivity || 0}
                />
              )}
            </motion.div>

            {/* Mock Interview Progress Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              {user && (
                <MockInterviewProgressCard
                  totalInterviews={dashboardSummary?.mockInterviews?.totalInterviews || 0}
                  totalAptitudeTests={dashboardSummary?.mockInterviews?.totalAptitudeTests || 0}
                  avgAptitudeScore={dashboardSummary?.mockInterviews?.avgAptitudeScore || 0}
                  performanceByType={dashboardSummary?.mockInterviews?.performanceByType || {}}
                  strongCategories={dashboardSummary?.mockInterviews?.strongCategories || []}
                  weakCategories={dashboardSummary?.mockInterviews?.weakCategories || []}
                  recentInterviews={dashboardSummary?.mockInterviews?.recentInterviews || 0}
                  recentTests={dashboardSummary?.mockInterviews?.recentTests || 0}
                />
              )}
            </motion.div>

            {/* Recent Achievements */}
            {dashboardSummary?.achievements && dashboardSummary.achievements.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
              >
                <div className="p-6 bg-white dark:bg-slate-800 rounded-3xl shadow-xl border-2 border-gray-300 dark:border-slate-600">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold flex items-center text-gray-900 dark:text-gray-100">
                      <Trophy className="w-5 h-5 mr-2 text-yellow-500 dark:text-yellow-400" />
                      Recent Achievements
                    </h3>
                    <Badge className="bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300">
                      {dashboardSummary.achievements.length}
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    {dashboardSummary.achievements.map((achievement: any, index: number) => (
                      <motion.div
                        key={achievement.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="flex items-start p-3 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-xl border border-yellow-200 dark:border-yellow-800"
                      >
                        <div className="w-10 h-10 bg-yellow-500 dark:bg-yellow-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                          <Trophy className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{achievement.name}</h4>
                          <p className="text-xs text-gray-600 dark:text-gray-300">{achievement.description}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {new Date(achievement.unlockedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Motivational Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 }}
            >
              <div className="p-6 bg-gradient-to-br from-pink-500 to-rose-600 dark:from-pink-600 dark:to-rose-700 text-white shadow-xl border-2 border-transparent rounded-3xl overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12" />
                <div className="relative">
                  <Sparkles className="w-8 h-8 mb-3" />
                  <h3 className="text-xl font-bold mb-2">Keep Going!</h3>
                  <p className="text-pink-100 text-sm leading-relaxed">
                    You're making great progress. Every step forward counts towards your dream career!
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

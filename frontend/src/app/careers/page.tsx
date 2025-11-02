'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import { apiClient } from '@/lib/api'
import { useAuth } from '@/components/auth-provider'
import toast from 'react-hot-toast'
import {
  Search, Filter, MapPin, Clock, DollarSign, TrendingUp,
  Users, Briefcase, Calendar, Star, ChevronRight, Heart,
  Building, Award, BookOpen, Bell, Sparkles, Loader2, X, Globe,
  Code, Stethoscope, GraduationCap, Megaphone, Palette,
  BarChart, Cog, Shield, Truck, Home, Utensils, Camera
} from 'lucide-react'
import { useRouter } from 'next/navigation'

interface JobCategory {
  name: string;
  count: number;
  icon: any;
  color: string;
  gradient: string;
}

const getJobCategories = (jobs: any[]): JobCategory[] => {
  const defaultCategories: JobCategory[] = [
    { name: 'Technology', count: 0, icon: Code, color: 'bg-blue-500', gradient: 'from-blue-400 to-blue-600' },
    { name: 'Healthcare', count: 0, icon: Stethoscope, color: 'bg-red-500', gradient: 'from-rose-400 to-red-600' },
    { name: 'Finance', count: 0, icon: DollarSign, color: 'bg-green-500', gradient: 'from-emerald-400 to-green-600' },
    { name: 'Education', count: 0, icon: GraduationCap, color: 'bg-purple-500', gradient: 'from-purple-400 to-purple-600' },
    { name: 'Marketing', count: 0, icon: Megaphone, color: 'bg-orange-500', gradient: 'from-orange-400 to-orange-600' },
    { name: 'Design', count: 0, icon: Palette, color: 'bg-pink-500', gradient: 'from-pink-400 to-pink-600' },
    { name: 'Sales', count: 0, icon: TrendingUp, color: 'bg-cyan-500', gradient: 'from-cyan-400 to-cyan-600' },
    { name: 'Engineering', count: 0, icon: Cog, color: 'bg-indigo-500', gradient: 'from-indigo-400 to-indigo-600' },
    { name: 'Data Science', count: 0, icon: BarChart, color: 'bg-violet-500', gradient: 'from-violet-400 to-violet-600' },
    { name: 'Security', count: 0, icon: Shield, color: 'bg-slate-500', gradient: 'from-slate-400 to-slate-600' },
    { name: 'Logistics', count: 0, icon: Truck, color: 'bg-amber-500', gradient: 'from-amber-400 to-amber-600' },
    { name: 'Real Estate', count: 0, icon: Home, color: 'bg-teal-500', gradient: 'from-teal-400 to-teal-600' },
    { name: 'Hospitality', count: 0, icon: Utensils, color: 'bg-rose-500', gradient: 'from-rose-400 to-rose-600' },
    { name: 'Media', count: 0, icon: Camera, color: 'bg-fuchsia-500', gradient: 'from-fuchsia-400 to-fuchsia-600' },
    { name: 'Consulting', count: 0, icon: Briefcase, color: 'bg-sky-500', gradient: 'from-sky-400 to-sky-600' },
    { name: 'HR', count: 0, icon: Users, color: 'bg-lime-500', gradient: 'from-lime-400 to-lime-600' },
  ]

  // If no jobs, return default categories with 0 counts
  if (!jobs || jobs.length === 0) return defaultCategories

  // Count jobs by matching category names in tags
  const categoryCounts = new Map<string, number>()

  jobs.forEach((job: any) => {
    if (!job.tags) return

    job.tags.forEach((tag: string) => {
      const tagLower = tag.toLowerCase()

      // Match tags to categories
      defaultCategories.forEach(category => {
        const categoryLower = category.name.toLowerCase()

        // Check if tag contains category name or vice versa
        if (tagLower.includes(categoryLower) || categoryLower.includes(tagLower)) {
          categoryCounts.set(category.name, (categoryCounts.get(category.name) || 0) + 1)
        }
      })
    })
  })

  // Update counts based on actual job data
  return defaultCategories.map(category => ({
    ...category,
    count: categoryCounts.get(category.name) || 0
  }))
}

const careerInsights = [
  {
    title: 'Tech Hiring Trends 2024',
    description: 'AI and ML roles seeing 40% growth in demand',
    trend: '+40%',
    color: 'text-green-500',
    bgColor: 'from-green-50 to-emerald-50',
    borderColor: 'border-green-200'
  },
  {
    title: 'Remote Work Adoption',
    description: 'Hybrid roles increased by 65% this quarter',
    trend: '+65%',
    color: 'text-blue-500',
    bgColor: 'from-blue-50 to-sky-50',
    borderColor: 'border-blue-200'
  },
  {
    title: 'Salary Benchmarks',
    description: 'Average tech salaries up by 15% YoY',
    trend: '+15%',
    color: 'text-purple-500',
    bgColor: 'from-purple-50 to-violet-50',
    borderColor: 'border-purple-200'
  },
]

export default function CareersPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [bookmarkedJobs, setBookmarkedJobs] = useState<string[]>([])
  const [jobs, setJobs] = useState<any[]>([])
  const [filteredJobs, setFilteredJobs] = useState<any[]>([])
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false)
  const [showRecommendations, setShowRecommendations] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchLoading, setSearchLoading] = useState(false)
  const [isConnectedToBackend, setIsConnectedToBackend] = useState(false)
  const [sortBy, setSortBy] = useState('relevant')
  const [showFilters, setShowFilters] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [totalJobs, setTotalJobs] = useState(0)
  const [loadingMore, setLoadingMore] = useState(false)
  const [showAllCategories, setShowAllCategories] = useState(false)
  const jobsPerPage = 12
  const daysToShow = 30

  const toggleBookmark = (jobId: string) => {
    if (!user) {
      toast.error('Please login to bookmark jobs')
      return
    }
    setBookmarkedJobs(prev =>
      prev.includes(jobId)
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    )
  }

  useEffect(() => {
    loadInitialData()
  }, [])

  useEffect(() => {
    // Debounce the API call when filters change
    const timeoutId = setTimeout(() => {
      if (searchTerm || locationFilter || selectedCategory !== 'all') {
        loadFilteredJobs()
      } else {
        // No filters applied, show all loaded jobs
        setFilteredJobs(jobs)
      }
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [searchTerm, locationFilter, selectedCategory, sortBy, jobs])

  const loadInitialData = async () => {
    try {
      setLoading(true)
      setError(null)
      setIsConnectedToBackend(false)
      setPage(1)

      const response = await apiClient.getAllJobs({
        page: 1,
        limit: jobsPerPage,
        daysOld: daysToShow
      })

      if (response.success && response.data) {
        setJobs(response.data.jobs || [])
        setFilteredJobs(response.data.jobs || [])
        setTotalJobs(response.data.pagination?.totalJobs || 0)
        setHasMore(response.data.pagination?.hasNext || false)
        setIsConnectedToBackend(true)
        console.log(`✅ Loaded ${response.data.jobs.length} jobs from last ${daysToShow} days`)
        console.log(`📊 Total available: ${response.data.pagination?.totalJobs || 0} jobs`)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load jobs'
      setError(errorMessage)
      console.error('Error loading initial data:', err)
      toast.error('Failed to load jobs')
    } finally {
      setLoading(false)
    }
  }

  const loadFilteredJobs = async () => {
    try {
      setSearchLoading(true)
      const response = await apiClient.getAllJobs({
        page: 1,
        limit: jobsPerPage,
        daysOld: daysToShow,
        search: searchTerm || undefined,
        location: locationFilter || undefined,
        tags: selectedCategory !== 'all' ? [selectedCategory] : undefined,
        sortBy: sortBy === 'salary-high' || sortBy === 'salary-low' ? 'salary.max' :
                sortBy === 'latest' ? 'postedAt' : 'postedAt',
        sortOrder: sortBy === 'salary-low' ? 'asc' : 'desc'
      })

      if (response.success && response.data) {
        setFilteredJobs(response.data.jobs || [])
        setTotalJobs(response.data.pagination?.totalJobs || 0)
        console.log(`🔍 Filtered: ${response.data.jobs.length} jobs found`)
      }
    } catch (err) {
      console.error('Error filtering jobs:', err)
      toast.error('Failed to filter jobs')
    } finally {
      setSearchLoading(false)
    }
  }

  const loadMoreJobs = async () => {
    if (!hasMore || loadingMore) return

    try {
      setLoadingMore(true)
      const nextPage = page + 1

      const response = await apiClient.getAllJobs({
        page: nextPage,
        limit: jobsPerPage,
        daysOld: daysToShow,
        search: searchTerm || undefined,
        location: locationFilter || undefined,
        tags: selectedCategory !== 'all' ? [selectedCategory] : undefined
      })

      if (response.success && response.data) {
        const newJobs = response.data.jobs || []
        setJobs(prevJobs => [...prevJobs, ...newJobs])
        setFilteredJobs(prevJobs => [...prevJobs, ...newJobs])
        setPage(nextPage)
        setHasMore(response.data.pagination?.hasNext || false)
        console.log(`✅ Loaded ${newJobs.length} more jobs (Page ${nextPage})`)
        toast.success(`Loaded ${newJobs.length} more jobs!`)
      }
    } catch (err) {
      console.error('Error loading more jobs:', err)
      toast.error('Failed to load more jobs')
    } finally {
      setLoadingMore(false)
    }
  }

  const fetchRecommendations = async () => {
    if (!user) {
      toast.error('Please login to get personalized recommendations')
      return
    }

    try {
      setIsLoadingRecommendations(true)
      const response = await apiClient.getJobRecommendations({
        limit: 10,
        minMatchScore: 50
      })

      if (response.success && response.data) {
        setRecommendations(response.data)
        setShowRecommendations(true)
        toast.success(`Found ${response.data.length} personalized job recommendations!`)
      } else {
        toast.error(response.message || 'Failed to get recommendations. Please complete your profile and upload a resume.')
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error)
      toast.error('Failed to load recommendations')
    } finally {
      setIsLoadingRecommendations(false)
    }
  }

  const filterJobs = () => {
    // This function is no longer needed as filtering is done server-side
    // Kept for backward compatibility
    setFilteredJobs(jobs)
  }

  const handleSearch = () => {
    // Trigger server-side search
    loadFilteredJobs()
  }

  const formatSalary = (salary: any) => {
    if (!salary) return 'Not specified'
    if (salary.min && salary.max) {
      return `₹${salary.min.toLocaleString()} - ₹${salary.max.toLocaleString()}`
    }
    return 'Competitive'
  }

  const formatDate = (date: string) => {
    const now = new Date()
    const posted = new Date(date)
    const diffTime = Math.abs(now.getTime() - posted.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return 'Posted today'
    if (diffDays < 7) return `Posted ${diffDays} days ago`
    if (diffDays < 30) return `Posted ${Math.floor(diffDays / 7)} weeks ago`
    return `Posted ${Math.floor(diffDays / 30)} months ago`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950/20">
      <Navbar variant="transparent" />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 gradient-test-4 text-white relative overflow-hidden">
        {/* Dark overlay for better text visibility */}
        <div className="absolute inset-0 bg-black/10"></div>

        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl float-slow"></div>
          <div className="absolute top-3/4 right-1/4 w-48 h-48 bg-blue-300/10 rounded-full blur-2xl float-delay-1"></div>
          <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-purple-300/10 rounded-full blur-xl float-delay-2"></div>
          <div className="absolute top-1/3 right-1/2 w-20 h-20 bg-cyan-300/10 rounded-full blur-lg float-fast"></div>
          <div className="absolute bottom-1/4 left-1/2 w-36 h-36 bg-indigo-300/8 rounded-full blur-2xl float-delay-1"></div>
          
          <div className="absolute top-20 right-20 w-6 h-6 bg-white/20 rotate-45 float-slow"></div>
          <div className="absolute bottom-32 left-20 w-4 h-4 bg-blue-300/30 rounded-full float-delay-2"></div>
          <div className="absolute top-1/2 left-20 w-2 h-2 bg-purple-300/40 rounded-full float-fast"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Find Your Dream Career
            </h1>
            <p className="text-xl text-white/95 max-w-3xl mx-auto mb-8">
              Discover opportunities that match your skills, interests, and career goals.
              Get AI-powered recommendations tailored just for you.
            </p>

            {/* AI Recommendations Button */}
            <div className="mb-8">
              <Button
                onClick={fetchRecommendations}
                disabled={isLoadingRecommendations}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 text-lg shadow-xl hover:shadow-2xl transition-all"
              >
                {isLoadingRecommendations ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Generating Recommendations...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Get AI-Powered Recommendations
                  </>
                )}
              </Button>
            </div>

            <div className="max-w-4xl mx-auto glass-career rounded-3xl p-3 shadow-2xl backdrop-blur-2xl">
              <div className="flex flex-col lg:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Search jobs, companies, or skills..."
                    className="pl-12 border-0 bg-white/90 backdrop-blur-sm text-gray-900 text-lg py-4 focus:ring-2 focus:ring-blue-400/50 rounded-2xl"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-3">
                  {/* <Button variant="outline" className="text-gray-700 border-white/30 bg-white/80 hover:bg-white/90 backdrop-blur-sm rounded-xl">
                    <MapPin className="w-4 h-4 mr-2" />
                    Location
                  </Button> */}
                  <Button
                    className="btn-career px-8 py-4 rounded-xl font-semibold"
                    onClick={handleSearch}
                    disabled={searchLoading}
                  >
                    {searchLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      'Search Jobs'
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
              {[
                { label: 'Total Jobs', value: totalJobs.toString(), color: 'text-blue-300', bg: 'bg-blue-500/10' },
                { label: 'Filtered Jobs', value: filteredJobs.length.toString(), color: 'text-purple-300', bg: 'bg-purple-500/10' },
                { label: 'AI Recommendations', value: recommendations.length.toString(), color: 'text-cyan-300', bg: 'bg-cyan-500/10' },
                { label: 'New This Week', value: jobs.filter((j: any) => {
                  const posted = new Date(j.postedAt)
                  const weekAgo = new Date()
                  weekAgo.setDate(weekAgo.getDate() - 7)
                  return posted >= weekAgo
                }).length.toString(), color: 'text-emerald-300', bg: 'bg-emerald-500/10' },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="text-center group cursor-pointer"
                >
                  <div className={`${stat.bg} backdrop-blur-sm rounded-2xl p-6 transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg border border-white/10`}>
                    <div className={`text-2xl lg:text-3xl font-bold ${stat.color} mb-2 group-hover:scale-110 transition-transform`}>{stat.value}</div>
                    <div className="text-white/90 text-sm font-medium">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ENHANCED CONTENT SECTION STARTS HERE */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Enhanced Job Categories Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Browse by Category
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg">Explore opportunities across different industries</p>
            </div>
            <Button
              onClick={() => setShowAllCategories(!showAllCategories)}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              {showAllCategories ? 'Show Less' : 'View All Categories'}
            </Button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-5">
            {getJobCategories(jobs).slice(0, showAllCategories ? 16 : 8).map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="group cursor-pointer"
                onClick={() => setSelectedCategory(category.name.toLowerCase())}
              >
                <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 border-2 border-gray-300 dark:border-slate-600 hover:border-indigo-300 dark:hover:border-indigo-500 p-6 text-center hover:shadow-2xl transition-all duration-500 hover:scale-105">
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-purple-50 dark:to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className={`w-16 h-16 bg-gradient-to-br ${category.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg relative`}>
                    <category.icon className="w-8 h-8 text-white relative z-10" />
                  </div>
                  <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-2 text-lg group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{category.name}</h3>
                  <p className="text-gray-500 text-sm font-semibold">{category.count.toLocaleString()} jobs</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* AI Recommendations Section */}
        {showRecommendations && recommendations.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400 mr-2" />
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                  AI-Powered Recommendations for You
                </h2>
              </div>
              <Button
                variant="outline"
                onClick={() => setShowRecommendations(false)}
                className="border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30"
              >
                Hide Recommendations
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {recommendations.map((job: any, index: number) => (
                <motion.div
                  key={job._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index }}
                >
                  <Card className="relative overflow-hidden p-6 hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-800 dark:via-gray-900 dark:to-purple-900/30 border-2 border-purple-200 dark:border-purple-700/50 cursor-pointer h-full group">
                    {/* Animated gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="relative z-10 flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-colors mb-2">
                          {job.title}
                        </h3>
                        <div className="flex items-center text-gray-600 dark:text-gray-300 mb-2">
                          <Building className="w-4 h-4 mr-2" />
                          <span>{job.company}</span>
                        </div>
                      </div>
                      {/* Enhanced Match Score Circle with glow */}
                      <div className="ml-4">
                        <div className="relative w-20 h-20">
                          {/* Glow effect */}
                          <div className={`absolute inset-0 rounded-full blur-md ${
                            (job.matchScore || 50) >= 80 ? 'bg-green-400/30' :
                            (job.matchScore || 50) >= 60 ? 'bg-blue-400/30' : 'bg-yellow-400/30'
                          }`} />
                          <svg className="transform -rotate-90 w-20 h-20 relative z-10">
                            <circle cx="40" cy="40" r="36" stroke="#e5e7eb" className="dark:stroke-gray-700" strokeWidth="6" fill="none" />
                            <circle
                              cx="40"
                              cy="40"
                              r="36"
                              stroke={
                                (job.matchScore || 50) >= 80 ? '#22c55e' :
                                (job.matchScore || 50) >= 60 ? '#3b82f6' : '#eab308'
                              }
                              strokeWidth="6"
                              fill="none"
                              strokeDasharray={`${((job.matchScore || 50) / 100) * 226} 226`}
                              strokeLinecap="round"
                            />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                            <span className="text-2xl font-bold text-gray-800 dark:text-white">{job.matchScore || 50}%</span>
                            <span className="text-xs text-gray-600 dark:text-gray-400">Match</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* AI Reason - Enhanced with relative positioning */}
                    {job.matchReason && (
                      <div className={`relative mb-4 p-3 rounded-lg border backdrop-blur-sm ${
                        job.matchReason.includes('Basic recommendation')
                          ? 'border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20'
                          : 'border-purple-200 dark:border-purple-800 bg-white dark:bg-purple-900/20'
                      }`}>
                        <div className="flex items-start relative z-10">
                          <Sparkles className={`w-4 h-4 mr-2 mt-0.5 flex-shrink-0 ${
                            job.matchReason.includes('Basic recommendation')
                              ? 'text-orange-600 dark:text-orange-400'
                              : 'text-purple-600 dark:text-purple-400'
                          }`} />
                          <div className="flex-1">
                            <p className="text-sm text-gray-700 dark:text-gray-200">{job.matchReason}</p>
                            {job.matchReason.includes('Basic recommendation') && (
                              <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                                💡 Complete your profile and upload a resume for personalized AI recommendations
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="relative z-10 space-y-2 mb-4">
                      <div className="flex items-center text-gray-600 dark:text-gray-300 text-sm">
                        <MapPin className="w-4 h-4 mr-2 text-purple-500 dark:text-purple-400" />
                        <span>{job.location || 'Remote'}</span>
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-300 text-sm">
                        <DollarSign className="w-4 h-4 mr-2 text-green-500 dark:text-green-400" />
                        <span>{formatSalary(job.salary)}</span>
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-300 text-sm">
                        <Clock className="w-4 h-4 mr-2 text-blue-500 dark:text-blue-400" />
                        <span>{formatDate(job.postedAt)}</span>
                      </div>
                    </div>

                    {/* Strengths */}
                    {job.strengths && job.strengths.length > 0 && (
                      <div className="relative z-10 mb-4">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-medium flex items-center">
                          <span className="mr-1">✨</span> Your Strengths:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {job.strengths.slice(0, 3).map((strength: string, idx: number) => (
                            <Badge key={idx} className="text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800">
                              {strength}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Skill Gaps */}
                    {job.skillGaps && job.skillGaps.length > 0 && (
                      <div className="relative z-10 mb-4">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-medium flex items-center">
                          <span className="mr-1">📚</span> Skills to Learn:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {job.skillGaps.slice(0, 3).map((skill: string, idx: number) => (
                            <Badge key={idx} variant="outline" className="text-xs text-orange-700 dark:text-orange-400 border-orange-300 dark:border-orange-700 bg-orange-50 dark:bg-orange-900/20">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Apply Now Button - Enhanced with gradient and shadow */}
                    <div className="relative z-10 mt-auto pt-4 border-t border-purple-200 dark:border-purple-800">
                      <Button
                        className="w-full bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 hover:from-purple-700 hover:via-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
                        onClick={(e) => {
                          e.stopPropagation()
                          if (job.applicationUrl) {
                            window.open(job.applicationUrl, '_blank')
                          } else if (job.applyUrl) {
                            window.open(job.applyUrl, '_blank')
                          } else {
                            toast.error('Application link not available for this job')
                          }
                        }}
                      >
                        Apply Now
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
            <div className="border-t border-gray-300 dark:border-gray-700 pt-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">All Available Jobs</h2>
            </div>
          </div>
        )}

        <div className="w-full">
          {/* Enhanced Job Listings */}
          <div className="w-full">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10 gap-4">
              <div className="flex items-center gap-4">
                <div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-1">
                    Live Remote Jobs
                  </h2>
                  <p className="text-gray-600 text-sm font-medium">Updated every 15 minutes</p>
                </div>
                {isConnectedToBackend && (
                  <div className="flex items-center text-sm bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 px-4 py-2 rounded-full border border-emerald-300 shadow-md">
                    <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full mr-2 animate-pulse shadow-emerald-400 shadow-sm"></div>
                    <span className="font-bold">Live</span>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  onClick={() => setShowFilters(!showFilters)}
                  className="bg-gradient-to-r from-violet-50 to-purple-50 hover:from-violet-100 hover:to-purple-100 text-purple-700 border border-purple-200 rounded-xl font-semibold shadow-sm hover:shadow-md transition-all"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  {showFilters ? 'Hide Filters' : 'Show Filters'}
                </Button>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm hover:border-indigo-300 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 text-gray-700 font-semibold shadow-sm"
                >
                  <option value="relevant">Most Relevant</option>
                  <option value="latest">Latest</option>
                  <option value="salary-high">Salary: High to Low</option>
                  <option value="salary-low">Salary: Low to High</option>
                </select>
              </div>
            </div>

            {/* Collapsible Filter Panel */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border border-purple-200 dark:border-gray-700"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                      Search Jobs
                    </label>
                    <Input
                      type="text"
                      placeholder="Job title, company, keywords..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="bg-white dark:bg-gray-700 dark:text-white border-purple-200 dark:border-gray-600 focus:border-purple-400 dark:focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                      Location
                    </label>
                    <Input
                      type="text"
                      placeholder="City, state, or remote"
                      value={locationFilter}
                      onChange={(e) => setLocationFilter(e.target.value)}
                      className="bg-white dark:bg-gray-700 dark:text-white border-purple-200 dark:border-gray-600 focus:border-purple-400 dark:focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                      Category
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full bg-white dark:bg-gray-700 dark:text-white border border-purple-200 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 dark:focus:ring-purple-500"
                    >
                      <option value="all">All Categories</option>
                      {getJobCategories(jobs).map((cat) => (
                        <option key={cat.name} value={cat.name.toLowerCase()}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    <span className="font-semibold text-purple-700 dark:text-purple-400">{filteredJobs.length}</span> jobs found
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm('')
                      setLocationFilter('')
                      setSelectedCategory('all')
                      // Reload all jobs
                      loadInitialData()
                    }}
                    className="border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/30"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Clear All Filters
                  </Button>
                </div>
              </motion.div>
            )}

            {loading ? (
              <div className="flex items-center justify-center py-20 bg-white rounded-3xl shadow-sm">
                <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
                <span className="ml-3 text-gray-600 font-medium text-lg">Loading amazing jobs...</span>
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <div className="bg-gradient-to-br from-red-50 to-pink-50 border border-red-200 rounded-2xl p-8 max-w-md mx-auto shadow-lg">
                  <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-red-100 to-pink-100 rounded-2xl mx-auto mb-5">
                    <Building className="w-7 h-7 text-red-600" />
                  </div>
                  <h3 className="text-xl font-bold text-red-800 mb-3">Connection Issue</h3>
                  <p className="text-red-700 mb-5 font-medium">{error}</p>
                  <div className="space-y-3">
                    <Button onClick={loadInitialData} className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all">
                      <Loader2 className="w-4 h-4 mr-2" />
                      Try Again
                    </Button>
                    <p className="text-xs text-red-600 font-medium">
                      Make sure your backend server is running on port 5000
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredJobs.map((job, index) => (
                <motion.div
                  key={job._id || job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * (index % 9) }}
                  className="group"
                >
                  <div className="relative bg-white dark:bg-slate-800 rounded-3xl p-6 hover:shadow-2xl transition-all duration-500 border-2 border-gray-300 dark:border-slate-600 overflow-hidden hover:border-indigo-300 dark:hover:border-indigo-500 h-full flex flex-col">
                    {/* Gradient accent bar */}
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500"></div>
                    
                    {/* Premium highlight */}
                    {job.featured && (
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-yellow-300/20 via-orange-300/10 to-transparent"></div>
                    )}

                    <div className="flex-1 flex flex-col">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start gap-2 mb-2">
                            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors cursor-pointer line-clamp-2">
                              {job.title}
                            </h3>
                          </div>
                          <div className="flex flex-wrap items-center gap-1.5 mb-2">
                            {job.featured && (
                              <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white border-0 font-bold text-xs px-2 py-0.5 shadow-sm">
                                ⭐
                              </Badge>
                            )}
                            {(job.isRemote || job.jobType === 'Remote') && (
                              <Badge className="bg-gradient-to-r from-emerald-400 to-green-500 text-white border-0 font-semibold text-xs px-2 py-0.5 shadow-sm">
                                🌍
                              </Badge>
                            )}
                          </div>
                          <div className="space-y-2 text-xs text-gray-600 dark:text-gray-300">
                            <div className="flex items-center gap-2">
                              <Building className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-300 flex-shrink-0" />
                              <span className="font-semibold text-gray-800 dark:text-gray-100 truncate">{job.company}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-300 flex-shrink-0" />
                              <span className="font-medium truncate">{job.location}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-3.5 h-3.5 text-orange-600 dark:text-orange-300 flex-shrink-0" />
                              <span className="font-medium">{formatDate(job.postedAt)}</span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleBookmark(job._id || job.id)
                          }}
                          className="p-2 hover:bg-gradient-to-br hover:from-red-50 hover:to-pink-50 rounded-xl transition-all duration-300 group/heart flex-shrink-0"
                          title={user ? (bookmarkedJobs.includes(job._id || job.id) ? 'Remove bookmark' : 'Bookmark this job') : 'Sign in to bookmark jobs'}
                        >
                          <Heart
                            className={`w-5 h-5 transition-all duration-300 ${
                              bookmarkedJobs.includes(job._id || job.id)
                                ? 'fill-red-500 text-red-500 scale-110'
                                : 'text-gray-400 group-hover/heart:text-red-500 group-hover/heart:scale-110'
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {job.tags?.slice(0, 3).map((tag: string, tagIndex: number) => (
                          <Badge key={`${tag}-${tagIndex}`} className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900 dark:to-purple-900 text-indigo-700 dark:text-indigo-300 hover:from-indigo-100 hover:to-purple-100 dark:hover:from-indigo-800 dark:hover:to-purple-800 transition-all cursor-pointer border border-indigo-200 dark:border-indigo-700 font-semibold text-xs px-2 py-0.5 rounded-full">
                            {tag}
                          </Badge>
                        ))}
                        {job.tags && job.tags.length > 3 && (
                          <Badge className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 text-xs px-2 py-0.5 rounded-full font-semibold">
                            +{job.tags.length - 3}
                          </Badge>
                        )}
                      </div>

                      <div className="mt-auto space-y-3">
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <div className="flex items-center font-bold bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900 dark:to-green-900 text-emerald-700 dark:text-emerald-300 px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-700">
                            <DollarSign className="w-3.5 h-3.5 mr-1" />
                            <span className="text-xs">{formatSalary(job.salary)}</span>
                          </div>
                          {job.jobType && (
                            <div className="flex items-center bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900 dark:to-violet-900 text-purple-700 dark:text-purple-300 px-3 py-1.5 rounded-lg border border-purple-200 dark:border-purple-700 font-semibold">
                              <Briefcase className="w-3.5 h-3.5 mr-1" />
                              <span className="text-xs">{job.jobType}</span>
                            </div>
                          )}
                          {job.experienceLevel && (
                            <div className="flex items-center bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900 dark:to-orange-900 text-amber-700 dark:text-amber-300 px-3 py-1.5 rounded-lg border border-amber-200 dark:border-amber-700 font-semibold">
                              <Award className="w-3.5 h-3.5 mr-1" />
                              <span className="text-xs">{job.experienceLevel}</span>
                            </div>
                          )}
                        </div>
                        <Button
                          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-4 py-3 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                          onClick={(e) => {
                            e.stopPropagation()
                            const url = job.applicationUrl || job.applyUrl
                            if (url) {
                              window.open(url, '_blank')
                            } else {
                              toast.error('Application URL not available')
                            }
                          }}
                        >
                          Apply Now
                          <ChevronRight className="w-4 h-4 ml-1 inline-block group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
                ))}
              </div>
            )}

            {/* Load More Button */}
            {!loading && !error && filteredJobs.length > 0 && hasMore && (
              <div className="mt-12 text-center">
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 border border-purple-200 dark:border-purple-800">
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                      Showing <span className="font-bold text-purple-700 dark:text-purple-400">{jobs.length}</span> of{' '}
                      <span className="font-bold text-purple-700 dark:text-purple-400">{totalJobs}</span> jobs
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Latest jobs from the past {daysToShow} days
                    </p>
                  </div>
                  <Button
                    onClick={loadMoreJobs}
                    disabled={loadingMore}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-6 text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                  >
                    {loadingMore ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Loading More Jobs...
                      </>
                    ) : (
                      <>
                        Load More Jobs
                        <ChevronRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                    💡 {totalJobs - jobs.length} more jobs available
                  </p>
                </div>
              </div>
            )}

            {/* No More Jobs Message */}
            {!loading && !error && filteredJobs.length > 0 && !hasMore && (
              <div className="mt-12 text-center">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 border border-green-200 dark:border-green-800">
                  <div className="flex items-center justify-center mb-2">
                    <Star className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
                    <p className="text-sm font-semibold text-green-800 dark:text-green-300">
                      You've seen all {totalJobs} available jobs!
                    </p>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Check back later for new opportunities or adjust your filters
                  </p>
                </div>
              </div>
            )}

            {filteredJobs.length === 0 && !loading && !error && (
              <div className="text-center py-16">
                <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-4">No jobs found matching your criteria.</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('')
                    setLocationFilter('')
                    setSelectedCategory('all')
                    // Reload all jobs
                    loadInitialData()
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Career Insights Section - Moved Below Jobs */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Career Insights Widget */}
          <div className="bg-gradient-to-br from-white to-indigo-50/30 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-6 border border-indigo-100 dark:border-indigo-900 shadow-xl">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                Career Insights
              </h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">AI and ML roles seeing 40% growth in demand across industries</p>
          </div>

          {/* Quick Apply Widget */}
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-500 group cursor-pointer">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mr-3">
                <Users className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold">Quick Apply</h3>
            </div>
            <p className="text-blue-100 text-sm mb-4">Upload resume once, apply to multiple jobs with one click</p>
            <Button className="w-full bg-white text-indigo-600 hover:bg-blue-50 rounded-xl py-2 font-bold text-sm">
              📄 Upload Resume
            </Button>
          </div>

          {/* Job Alerts Widget */}
          <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-500 group cursor-pointer">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mr-3">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold">Job Alerts</h3>
            </div>
            <p className="text-amber-100 text-sm mb-4">Get instant notifications for new matching jobs</p>
            <Button className="w-full bg-white text-orange-600 hover:bg-amber-50 rounded-xl py-2 font-bold text-sm">
              🔔 Create Alert
            </Button>
          </div>

          {/* AI Career Coach Widget */}
          <div className="bg-gradient-to-br from-purple-600 via-indigo-600 to-pink-600 rounded-3xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-500 group cursor-pointer">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mr-3">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold">AI Career Coach</h3>
            </div>
            <p className="text-purple-100 text-sm mb-4">Get personalized career advice powered by AI</p>
            <Button className="w-full bg-white text-purple-600 hover:bg-purple-50 rounded-xl py-2 font-bold text-sm">
              🤖 Chat with AI
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
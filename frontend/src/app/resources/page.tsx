'use client'

import { useState, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Navbar from '@/components/layout/navbar'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { useAuth } from '@/components/auth-provider'
import {
  BookOpen, FileText, Video, Headphones, Download, Calendar,
  Clock, User, Star, Search, Filter, ChevronRight, Play,
  ExternalLink, Tag, TrendingUp, Users, Award, Bookmark,
  X, Code, Database, Brain, Briefcase, GraduationCap, 
  Globe, Mic, PenTool, Target, Zap, MessageSquare, 
  Monitor, Smartphone, Cloud, Shield, BarChart3, Layers,
  CheckCircle2, Trophy, Flame
} from 'lucide-react'
import { 
  resourceCategories, 
  featuredResources, 
  trendingTopics, 
  learningPlatforms, 
  upcomingWebinars, 
  resourceTypes, 
  resourceCategoriesFilter 
} from '@/data/resources'

export default function ResourcesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedPlatformCategory, setSelectedPlatformCategory] = useState('all')
  const [selectedResourceType, setSelectedResourceType] = useState('all')
  const [selectedResourceCategory, setSelectedResourceCategory] = useState('all')
  const [bookmarkedItems, setBookmarkedItems] = useState<number[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [showResourceFilters, setShowResourceFilters] = useState(false)
  const [completedResources, setCompletedResources] = useState<number[]>([])
  const [userProgress, setUserProgress] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  // Get authenticated user
  const { user } = useAuth()
  
  useEffect(() => {
    if (user) {
      fetchUserProgress()
    } else {
      setIsLoading(false)
    }
  }, [user])
  
  const fetchUserProgress = async () => {
    if (!user) {
      setIsLoading(false)
      return
    }
    
    try {
      setIsLoading(true)
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      const response = await fetch(`${API_BASE_URL}/api/progress/user/${user.uid}`)
      if (response.ok) {
        const data = await response.json()
        setUserProgress(data.data.progress)
        setCompletedResources(data.data.progress.completedResources.map((r: any) => r.resourceId))
      }
    } catch (error) {
      console.error('Error fetching user progress:', error)
      // Continue without progress data
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleResourceComplete = async (resourceId: number, isCompleted: boolean) => {
    if (!user) {
      console.error('User not authenticated')
      return
    }
    
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      const endpoint = isCompleted ? 'complete' : 'uncomplete'
      const response = await fetch(`${API_BASE_URL}/api/progress/user/${user.uid}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ resourceId })
      })
      
      if (response.ok) {
        const data = await response.json()
        setUserProgress(data.data.progress)
        setCompletedResources(data.data.progress.completedResources.map((r: any) => r.resourceId))
        
        // Show achievement notification if any new achievements
        if (isCompleted && data.data.newAchievements && data.data.newAchievements.length > 0) {
          // In a real app, show toast notification for new achievements
          console.log('New achievements unlocked!', data.data.newAchievements)
        }
      }
    } catch (error) {
      console.error('Error updating resource completion:', error)
    }
  }

  // Dynamic resource counts calculation
  const resourceCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    
    resourceCategories.forEach(category => {
      let count = 0
      
      switch (category.name) {
        case 'Career Guides':
          count = featuredResources.filter(r => 
            r.category === 'Career Development' || r.type === 'Guide'
          ).length
          break
        case 'Resume Templates':
          count = featuredResources.filter(r => 
            r.category === 'Resume Building' || r.type === 'Template'
          ).length
          break
        case 'Video Tutorials':
          count = featuredResources.filter(r => r.type === 'Video').length
          break
        case 'Podcasts':
          count = featuredResources.filter(r => r.type === 'Podcast').length
          break
        case 'Webinars':
          count = featuredResources.filter(r => r.type === 'Webinar').length
          break
        case 'Templates':
          count = featuredResources.filter(r => r.type === 'Template').length
          break
        default:
          count = 0
      }
      
      counts[category.name] = count
    })
    
    return counts
  }, [])

  const toggleBookmark = (itemId: number) => {
    setBookmarkedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  // Filter platforms
  const filteredPlatforms = learningPlatforms.filter(platform => {
    const matchesSearch = platform.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          platform.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedPlatformCategory === 'all' || platform.category === selectedPlatformCategory
    return matchesSearch && matchesCategory
  })

  // Filter resources
  const filteredResources = featuredResources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesType = selectedResourceType === 'all' || resource.type === selectedResourceType
    const matchesCategory = selectedResourceCategory === 'all' || resource.category === selectedResourceCategory
    return matchesSearch && matchesType && matchesCategory
  })

  const platformCategories = ['all', ...Array.from(new Set(learningPlatforms.map(p => p.category)))]

  const handleExternalLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const resetFilters = () => {
    setSearchTerm('')
    setSelectedPlatformCategory('all')
    setSelectedResourceType('all')
    setSelectedResourceCategory('all')
  }

  // Format number consistently for SSR
  const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
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
              Career Resources Hub
            </h1>
            <p className="text-xl text-white/95 max-w-3xl mx-auto mb-8">
              Access comprehensive career resources, guides, templates, and expert insights
              to accelerate your professional journey. Track your progress and build your skills systematically.
            </p>

            {/* Search Bar */}
            <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl p-2 shadow-2xl border border-white/20">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-300 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Search resources, guides, templates..."
                    className="pl-12 border-0 bg-white/5 text-white placeholder:text-gray-300 text-lg py-4 focus:ring-0 focus:bg-white/10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-8 font-semibold shadow-lg border border-white/30"
                  onClick={() => {
                    setShowResourceFilters(true)
                  }}
                >
                  Search
                </Button>
              </div>
            </div>

            {/* Resource Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
              {[
                { label: 'Resources Available', value: `${featuredResources.length}` },
                { label: 'Learning Platforms', value: `${learningPlatforms.length}` },
                { label: 'Your Progress', value: user && userProgress ? `${Math.round((completedResources.length / featuredResources.length) * 100)}%` : user ? '0%' : 'Sign in' },
                { label: 'Completed Resources', value: user ? `${completedResources.length}/${featuredResources.length}` : 'Sign in to track' },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="text-center"
                >
                  <div className="text-2xl lg:text-3xl font-bold text-white">{stat.value}</div>
                  <div className="text-white/80 text-sm font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Progress Bar */}
            {user && userProgress && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-8 max-w-md mx-auto"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-white/90">Overall Progress</span>
                  <span className="text-sm text-white/90">
                    {Math.round((completedResources.length / featuredResources.length) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-cyan-400 to-blue-400 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${(completedResources.length / featuredResources.length) * 100}%` }}
                  />
                </div>
                <div className="flex items-center justify-center space-x-4 mt-4 text-sm text-white/90">
                  <div className="flex items-center">
                    <Flame className="w-4 h-4 mr-1 text-orange-300" />
                    <span>Streak: {userProgress.stats?.streak?.current || 0} days</span>
                  </div>
                  <div className="flex items-center">
                    <Trophy className="w-4 h-4 mr-1 text-yellow-300" />
                    <span>{userProgress.achievements?.length || 0} achievements</span>
                  </div>
                </div>
              </motion.div>
            )}

            {user && !userProgress && !isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-8 max-w-md mx-auto text-center"
              >
                <p className="text-white/90">Start marking resources as complete to track your progress!</p>
              </motion.div>
            )}

            {!user && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-8 max-w-md mx-auto text-center"
              >
                <p className="text-white/90 mb-4">Sign in to track your learning progress and unlock achievements!</p>
                <Button
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-6 py-2 border border-white/30"
                  onClick={() => window.location.href = '/login'}
                >
                  Sign In
                </Button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Browse Categories Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Browse Categories
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg">Explore resources across different topics</p>
            </div>
            <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all">
              View All Categories
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-5">
            {resourceCategories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="group cursor-pointer"
                onClick={() => setSelectedCategory(category.name)}
              >
                <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 border-2 border-gray-300 dark:border-slate-600 hover:border-indigo-300 dark:hover:border-indigo-500 p-6 text-center hover:shadow-2xl transition-all duration-500 hover:scale-105 h-full min-h-[180px] flex flex-col justify-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-purple-50 dark:to-purple-950/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className={`w-16 h-16 ${category.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg relative`}>
                    <category.icon className="w-8 h-8 text-white relative z-10" />
                  </div>
                  <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-2 text-base leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors min-h-[2.5rem] flex items-center justify-center">{category.name}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-semibold">{resourceCounts[category.name] || 0} resources</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Popular Learning Platforms Section - ENHANCED STYLING */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Popular Learning Platforms
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg">Discover top platforms for skill development</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950 dark:to-purple-950 hover:from-violet-100 hover:to-purple-100 dark:hover:from-violet-900 dark:hover:to-purple-900 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-700 rounded-xl font-semibold shadow-sm hover:shadow-md transition-all"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>

          {/* Enhanced Filter Options */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 rounded-2xl p-6 border border-purple-200 dark:border-purple-800"
            >
              <div className="flex flex-wrap gap-3">
                {platformCategories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedPlatformCategory === category ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedPlatformCategory(category)}
                    className="capitalize hover:scale-105 transition-transform"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Enhanced Platform Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredPlatforms.slice(0, 8).map((platform, index) => (
              <motion.div
                key={platform.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="group"
              >
                <div
                  className="relative bg-white dark:bg-slate-800 rounded-3xl p-6 flex flex-col hover:shadow-2xl transition-all duration-500 border-2 border-gray-300 dark:border-slate-600 overflow-hidden hover:border-indigo-300 dark:hover:border-indigo-500 h-full cursor-pointer hover:-translate-y-1"
                  onClick={() => handleExternalLink(platform.url)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-14 h-14 ${platform.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-md`}>
                      <platform.icon className="w-7 h-7 text-white" />
                    </div>
                    <Badge variant="secondary" className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900">
                      {platform.category}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 text-left text-lg">{platform.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 flex-grow text-left leading-relaxed">{platform.description}</p>
                  <div className="flex items-center text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors mt-auto">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">Visit Platform</span>
                    <ChevronRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {filteredPlatforms.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No platforms found matching your filters.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={resetFilters}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Featured Resources Section */}
            <section>
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h2 className="text-3xl font-bold mb-1 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    Featured Resources
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Curated learning materials for your career growth</p>
                </div>
                <div className="flex items-center space-x-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowResourceFilters(!showResourceFilters)}
                    className="bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950 dark:to-purple-950 hover:from-violet-100 hover:to-purple-100 dark:hover:from-violet-900 dark:hover:to-purple-900 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-700 rounded-xl font-semibold shadow-sm hover:shadow-md transition-all"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </div>

              {/* Resource Filters */}
              {showResourceFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-8 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 rounded-2xl p-6 border border-purple-200 dark:border-purple-800"
                >
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-3 block">Type</label>
                      <div className="flex flex-wrap gap-2">
                        {resourceTypes.map((type) => (
                          <Button
                            key={type}
                            variant={selectedResourceType === type ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setSelectedResourceType(type)}
                            className="capitalize"
                          >
                            {type}
                          </Button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-3 block">Category</label>
                      <div className="flex flex-wrap gap-2">
                        {resourceCategoriesFilter.map((category) => (
                          <Button
                            key={category}
                            variant={selectedResourceCategory === category ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setSelectedResourceCategory(category)}
                            className="capitalize"
                          >
                            {category}
                          </Button>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-end pt-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={resetFilters}
                        className="text-gray-600 hover:text-gray-800"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Clear all filters
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Resource List */}
              <div className="space-y-6">
                {filteredResources.map((resource, index) => (
                  <motion.div
                    key={resource.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * index }}
                  >
                    <div className={`relative bg-white dark:bg-slate-800 rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 border-2 border-gray-300 dark:border-slate-600 overflow-hidden hover:border-indigo-300 dark:hover:border-indigo-500 ${completedResources.includes(resource.id) ? 'ring-2 ring-green-300 dark:ring-green-500 bg-green-50 dark:bg-green-950/20' : ''}`}>
                      <div className="flex flex-col sm:flex-row gap-6">
                        <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-xl flex items-center justify-center flex-shrink-0 mx-auto sm:mx-0 shadow-sm relative">
                          <resource.icon className="w-8 h-8 text-blue-600 dark:text-blue-300" />
                          {completedResources.includes(resource.id) && (
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                              <CheckCircle2 className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <div className="flex items-center space-x-3 mb-2">
                                <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{resource.title}</h3>
                                {resource.isPremium && (
                                  <Badge className="bg-amber-100 text-amber-800 border border-amber-200">Premium</Badge>
                                )}
                                {completedResources.includes(resource.id) && (
                                  <Badge className="bg-green-100 text-green-800 border border-green-200">
                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                    Completed
                                  </Badge>
                                )}
                              </div>
                              <p className="text-gray-600 dark:text-gray-300 mb-3 leading-relaxed">{resource.description}</p>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                toggleBookmark(resource.id)
                              }}
                              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                            >
                              <Bookmark
                                className={`w-5 h-5 ${bookmarkedItems.includes(resource.id) ? 'fill-blue-500 text-blue-500 dark:fill-blue-400 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}`}
                              />
                            </button>
                          </div>

                          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-700 dark:text-gray-300 mb-4">
                            <div className="flex items-center">
                              <User className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
                              <span className="font-medium dark:text-gray-200">{resource.author}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
                              <span>{resource.duration}</span>
                            </div>
                            <div className="flex items-center">
                              <Download className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
                              <span>{formatNumber(resource.downloads)}</span>
                            </div>
                            <div className="flex items-center">
                              <Star className="w-4 h-4 mr-2 text-yellow-500 fill-yellow-400" />
                              <span className="font-medium">{resource.rating}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex flex-wrap gap-2">
                              {resource.tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs bg-indigo-50 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <div className="flex items-center space-x-3">
                              {user ? (
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`resource-${resource.id}`}
                                    checked={completedResources.includes(resource.id)}
                                    onCheckedChange={(checked) => handleResourceComplete(resource.id, checked as boolean)}
                                    className="w-5 h-5"
                                  />
                                  <label
                                    htmlFor={`resource-${resource.id}`}
                                    className="text-sm font-medium text-gray-700 dark:text-gray-200 cursor-pointer flex items-center space-x-1"
                                  >
                                    {completedResources.includes(resource.id) ? (
                                      <>
                                        <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                                        <span className="text-green-700 dark:text-green-400">Completed</span>
                                      </>
                                    ) : (
                                      <span>Mark Complete</span>
                                    )}
                                  </label>
                                </div>
                              ) : (
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  <span>Sign in to track progress</span>
                                </div>
                              )}
                              <Button 
                                className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                                onClick={() => handleExternalLink(resource.externalUrl)}
                              >
                                {resource.type === 'Template' ? 'Download' : 'Access'}
                                <ExternalLink className="w-4 h-4 ml-2" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {filteredResources.length === 0 && (
                <div className="text-center py-16">
                  <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg mb-4">No resources found matching your filters.</p>
                  <Button 
                    variant="outline" 
                    className="mt-2"
                    onClick={resetFilters}
                  >
                    Clear Filters
                  </Button>
                </div>
              )}

              {filteredResources.length > 0 && (
                <div className="text-center mt-10">
                  <Button variant="outline" size="lg" className="hover:bg-blue-50">
                    Load More Resources
                  </Button>
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress Summary */}
            {user && userProgress && (
              <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border-2 border-blue-200 dark:border-blue-800 rounded-2xl shadow-lg">
                <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-900 dark:text-gray-100">
                  <Trophy className="w-5 h-5 mr-2 text-blue-500 dark:text-blue-400" />
                  Your Progress
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Resources Completed</span>
                    <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      {completedResources.length}/{featuredResources.length}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(completedResources.length / featuredResources.length) * 100}%` }}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold text-orange-600 flex items-center justify-center">
                        <Flame className="w-4 h-4 mr-1" />
                        {userProgress.stats?.streak?.current || 0}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Day Streak</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                        {userProgress.achievements?.length || 0}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Achievements</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!user && (
              <div className="p-6 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950/30 border-2 border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg">
                <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-900 dark:text-gray-100">
                  <Trophy className="w-5 h-5 mr-2 text-gray-400 dark:text-gray-500" />
                  Track Your Progress
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  Sign in to start tracking your learning progress and unlock achievements!
                </p>
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => window.location.href = '/login'}
                >
                  Sign In
                </Button>
              </div>
            )}

            {/* Trending Topics */}
            <div className="p-6 bg-white dark:bg-slate-800 border-2 border-gray-300 dark:border-slate-600 rounded-2xl shadow-lg">
              <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-900 dark:text-gray-100">
                <TrendingUp className="w-5 h-5 mr-2 text-green-500 dark:text-green-400" />
                Trending Topics
              </h3>
              <div className="space-y-3">
                {trendingTopics.map((topic, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer">
                    <span className="font-medium text-gray-900 dark:text-gray-100 text-sm">{topic.name}</span>
                    <span className="text-sm text-green-600 dark:text-green-400 font-bold">{topic.searches}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Webinars */}
            <div className="p-6 bg-white dark:bg-slate-800 border-2 border-gray-300 dark:border-slate-600 rounded-2xl shadow-lg">
              <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-900 dark:text-gray-100">
                <Calendar className="w-5 h-5 mr-2 text-blue-500 dark:text-blue-400" />
                Upcoming Webinars
              </h3>
              <div className="space-y-4">
                {upcomingWebinars.slice(0, 3).map((webinar) => (
                  <div key={webinar.id} className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-100 dark:border-blue-800">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 text-sm">{webinar.title}</h4>
                    <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-2" />
                        {webinar.date} at {webinar.time}
                      </div>
                      <div className="flex items-center">
                        <User className="w-3 h-3 mr-2" />
                        {webinar.speaker} • {webinar.company}
                      </div>
                      <div className="flex items-center">
                        <Users className="w-3 h-3 mr-2" />
                        {webinar.attendees} registered
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      className="w-full mt-3 text-xs"
                      onClick={() => handleExternalLink(webinar.registrationUrl)}
                    >
                      Register Free
                    </Button>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4 dark:border-slate-500 dark:text-gray-200 dark:hover:bg-slate-700" size="sm">
                View All Webinars
              </Button>
            </div>

            {/* Newsletter Signup */}
            <div className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 border-2 border-purple-200 dark:border-purple-800 rounded-2xl shadow-lg">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Weekly Career Insights</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4 text-sm leading-relaxed">
                Get the latest career resources, job market trends, and expert tips delivered to your inbox.
              </p>
              <div className="space-y-3">
                <Input type="email" placeholder="Enter your email" className="border-purple-200 dark:border-purple-700 dark:bg-slate-700 dark:text-gray-100" />
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  Subscribe Now
                </Button>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-3">
                Join 35,000+ professionals. Unsubscribe anytime.
              </p>
            </div>

            {/* Quick Access */}
            <div className="p-6 bg-white dark:bg-slate-800 border-2 border-gray-300 dark:border-slate-600 rounded-2xl shadow-lg">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Quick Access</h3>
              <div className="space-y-2">
                {[
                  { name: 'Resume Builder', icon: FileText, url: 'https://www.canva.com/resumes/templates/' },
                  { name: 'Interview Prep', icon: Users, url: 'https://www.interviewbit.com/' },
                  { name: 'Salary Calculator', icon: TrendingUp, url: 'https://www.glassdoor.co.in/Salaries/index.htm' },
                  { name: 'Skill Assessment', icon: Award, url: 'https://www.hackerrank.com/skills-verification' },
                ].map((link, index) => (
                  <button
                    key={index}
                    className="w-full flex items-center p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors group"
                    onClick={() => handleExternalLink(link.url)}
                  >
                    <link.icon className="w-4 h-4 mr-3 text-blue-600 dark:text-blue-400" />
                    <span className="font-medium text-gray-900 dark:text-gray-100 text-sm">{link.name}</span>
                    <ExternalLink className="w-3 h-3 ml-auto text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import {
  Award,
  Briefcase,
  Search,
  Filter,
  ExternalLink,
  Calendar,
  MapPin,
  Building2,
  GraduationCap,
  TrendingUp,
  IndianRupee,
  DollarSign,
  Sparkles,
  Target,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
} from 'lucide-react'
import Navbar from '@/components/layout/navbar'
import { apiClient } from '@/lib/api'

interface AIRecommendation {
  matchScore: number
  matchReason: string
  eligibilityStatus: 'Eligible' | 'MayBeEligible' | 'CheckDetails'
  actionSteps: string[]
  priority: 'High' | 'Medium' | 'Low'
}

interface Scholarship {
  _id?: string
  title: string
  provider: string
  amount: string
  eligibility: string
  deadline: string
  link: string
  category?: string
  domain?: string
  trending?: boolean
  aiRecommendation?: AIRecommendation
}

interface Internship {
  id: number
  title: string
  company: string
  location: string
  stipend: string
  duration?: string
  type?: string
  domain?: string
  description?: string
  requirements?: string
  link: string
  trending?: boolean
  deadline?: string
}

export default function ScholarshipsPage() {
  const [activeTab, setActiveTab] = useState<'scholarships' | 'internships'>('scholarships')
  const [viewMode, setViewMode] = useState<'all' | 'personalized'>('all')
  const [scholarships, setScholarships] = useState<Scholarship[]>([])
  const [internships, setInternships] = useState<Scholarship[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [personalizedLoading, setPersonalizedLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [domainFilter, setDomainFilter] = useState('all')
  const [sortBy, setSortBy] = useState('deadline')
  const [showFilters, setShowFilters] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const itemsPerPage = 20

  useEffect(() => {
    // Reset filters when switching tabs
    setCategoryFilter('all')
    setDomainFilter('all')
    setSearchTerm('')
    fetchData()
  }, [activeTab])

  // Reset to page 1 and refetch when filters or sort change
  useEffect(() => {
    if (viewMode === 'all') {
      setCurrentPage(1)
      fetchData(1, false)
    }
  }, [categoryFilter, domainFilter, sortBy])

  const fetchData = async (page = 1, append = false) => {
    if (page === 1) {
      setLoading(true)
    } else {
      setLoadingMore(true)
    }
    setError(null)
    if (page === 1) {
      setViewMode('all') // Reset to all view when switching tabs
    }

    try {
      // Build API params based on active tab
      const params: any = {
        page,
        limit: itemsPerPage
      }

      if (activeTab === 'internships') {
        // Get only Internships
        params.category = 'Internship'
      } else {
        // Get everything EXCEPT Internships
        params.excludeCategory = 'Internship'
      }

      // Add filters
      if (categoryFilter && categoryFilter !== 'all' && activeTab === 'scholarships') {
        // Override excludeCategory if specific category is selected
        delete params.excludeCategory
        params.category = categoryFilter
      }

      if (domainFilter && domainFilter !== 'all') {
        params.domain = domainFilter
      }

      // Add sorting
      if (sortBy) {
        params.sortBy = sortBy
      }

      console.log('🔍 Fetching with params:', params)

      const response = await apiClient.getAllScholarships(params)

      if (response.success) {
        const data = response.data || []
        const total = response.pagination?.totalItems || data.length
        const currentPageNum = response.pagination?.currentPage || page

        console.log('Pagination Debug:', {
          receivedItems: data.length,
          totalItems: total,
          currentPage: currentPageNum,
          append,
          activeTab
        })

        // Update page number first
        setCurrentPage(currentPageNum)
        setTotalCount(total)

        // Backend now filters by category, so data is already correct
        if (activeTab === 'scholarships') {
          console.log('📚 Scholarships - Before Update:', {
            receivedFromAPI: data.length,
            currentState: scholarships.length,
            willAppend: append,
            page: currentPageNum
          })

          setScholarships(prevScholarships => {
            const newScholarships = append ? [...prevScholarships, ...data] : data
            const shouldHaveMore = newScholarships.length < total

            console.log('📚 Scholarships - After Update:', {
              previous: prevScholarships.length,
              received: data.length,
              newTotal: newScholarships.length,
              totalInDB: total,
              hasMore: shouldHaveMore,
              itemsPerPage,
              expectedNext: currentPageNum * itemsPerPage
            })

            setHasMore(shouldHaveMore)
            return newScholarships
          })
        } else {
          console.log('💼 Internships - Before Update:', {
            receivedFromAPI: data.length,
            currentState: internships.length,
            willAppend: append,
            page: currentPageNum
          })

          setInternships(prevInternships => {
            const newInternships = append ? [...prevInternships, ...data] : data
            const shouldHaveMore = newInternships.length < total

            console.log('💼 Internships - After Update:', {
              previous: prevInternships.length,
              received: data.length,
              newTotal: newInternships.length,
              totalInDB: total,
              hasMore: shouldHaveMore,
              itemsPerPage,
              expectedNext: currentPageNum * itemsPerPage
            })

            setHasMore(shouldHaveMore)
            return newInternships
          })
        }
      } else {
        setError(response.error || `Failed to fetch ${activeTab}`)
      }
    } catch (error) {
      console.error(`Error fetching ${activeTab}:`, error)
      setError(`Error fetching ${activeTab}. Please try again.`)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  const loadMore = () => {
    console.log('🔄 Load More Clicked:', {
      currentPage,
      nextPage: currentPage + 1,
      currentScholarships: scholarships.length,
      currentInternships: internships.length,
      totalCount,
      hasMore,
      activeTab,
      loadingMore
    })
    fetchData(currentPage + 1, true)
  }

  const fetchPersonalizedScholarships = async () => {
    setPersonalizedLoading(true)
    setError(null)

    try {
      const response = await apiClient.getPersonalizedScholarships()

      if (response.success) {
        setScholarships(response.data || [])
        setViewMode('personalized')
      } else {
        setError(response.error || 'Failed to generate personalized recommendations')
      }
    } catch (error) {
      console.error('Error fetching personalized scholarships:', error)
      setError('Error generating recommendations. Please ensure you are logged in and have uploaded a resume.')
    } finally {
      setPersonalizedLoading(false)
    }
  }

  // Client-side filtering for search term only (other filters handled by backend)
  let filteredData = activeTab === 'scholarships'
    ? scholarships.filter(item =>
        !searchTerm ||
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.provider.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : internships.filter(item =>
        !searchTerm ||
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.provider.toLowerCase().includes(searchTerm.toLowerCase())
      )

  // Client-side sorting for better UX (already sorted by backend, this is backup)
  if (sortBy === 'deadline') {
    filteredData = [...filteredData].sort((a, b) => {
      const dateA = new Date(a.deadline).getTime()
      const dateB = new Date(b.deadline).getTime()
      return dateA - dateB
    })
  } else if (sortBy === 'recent') {
    filteredData = [...filteredData].sort((a, b) => {
      const dateA = new Date((a as any).createdAt || 0).getTime()
      const dateB = new Date((b as any).createdAt || 0).getTime()
      return dateB - dateA
    })
  } else if (sortBy === 'trending') {
    filteredData = [...filteredData].sort((a, b) => {
      const trendA = a.trending ? 1 : 0
      const trendB = b.trending ? 1 : 0
      return trendB - trendA
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-black dark:to-gray-900 transition-colors duration-200">
      <Navbar />
      {/* Header */}
      <div className="container mx-auto px-3 sm:px-4 pt-20 sm:pt-24 pb-6 sm:pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 mb-3 sm:mb-4 px-2">
            Scholarship & Internship Finder
          </h1>
          <p className="text-gray-700 dark:text-gray-400 text-sm sm:text-lg max-w-3xl mx-auto px-2">
            Discover opportunities to fund your education and gain valuable work experience
          </p>
        </motion.div>

        {/* Tab Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center mb-6 sm:mb-8 px-2"
        >
          <div className="bg-white/70 dark:bg-gray-800 backdrop-blur-sm rounded-xl p-1.5 sm:p-2 flex shadow-lg border border-gray-200 dark:border-gray-700 w-full sm:w-auto max-w-md">
            <motion.button
              onClick={() => setActiveTab('scholarships')}
              className={`flex items-center justify-center space-x-1.5 sm:space-x-2 px-3 sm:px-6 py-2.5 sm:py-3 rounded-lg transition-all duration-300 flex-1 sm:flex-initial ${
                activeTab === 'scholarships'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700/50'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Award className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 ${activeTab === 'scholarships' ? 'rotate-0' : 'group-hover:rotate-12'}`} />
              <span className="text-sm sm:text-base">Scholarships</span>
            </motion.button>
            <motion.button
              onClick={() => setActiveTab('internships')}
              className={`flex items-center justify-center space-x-1.5 sm:space-x-2 px-3 sm:px-6 py-2.5 sm:py-3 rounded-lg transition-all duration-300 flex-1 sm:flex-initial ${
                activeTab === 'internships'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700/50'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Briefcase className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 ${activeTab === 'internships' ? 'rotate-0' : 'group-hover:rotate-12'}`} />
              <span className="text-sm sm:text-base">Internships</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Item Count Display */}
        {!loading && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center mb-4 sm:mb-6 px-2"
          >
            <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
              {viewMode === 'personalized' ? (
                <>
                  Showing <span className="font-semibold text-gray-900 dark:text-white">{filteredData.length}</span> personalized recommendations
                </>
              ) : (searchTerm || categoryFilter !== 'all' || domainFilter !== 'all') ? (
                <>
                  Showing <span className="font-semibold text-gray-900 dark:text-white">{filteredData.length}</span> filtered results from{' '}
                  <span className="font-semibold text-gray-900 dark:text-white">{activeTab === 'scholarships' ? scholarships.length : internships.length}</span> loaded {activeTab}
                </>
              ) : (
                <>
                  Showing <span className="font-semibold text-gray-900 dark:text-white">{activeTab === 'scholarships' ? scholarships.length : internships.length}</span> out of{' '}
                  <span className="font-semibold text-gray-900 dark:text-white">{totalCount}</span> {activeTab}
                </>
              )}
            </p>
          </motion.div>
        )}

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-6 sm:mb-8 px-1"
        >
          <div className="flex flex-col gap-3 sm:gap-4 mb-4">
            {/* Search Input - Full width on mobile */}
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <Input
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 sm:pl-10 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 shadow-sm text-sm sm:text-base"
              />
            </div>

            {/* Filter buttons - Responsive layout */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-2 sm:items-center sm:justify-between">
              {/* View Mode Buttons - Scholarships only */}
              {activeTab === 'scholarships' && (
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button
                    onClick={() => {
                      setViewMode('all')
                      fetchData()
                    }}
                    className={`flex items-center justify-center space-x-1.5 sm:space-x-2 flex-1 sm:flex-initial text-xs sm:text-sm px-3 sm:px-4 py-2 ${
                      viewMode === 'all'
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                        : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200'
                    }`}
                  >
                    <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>Show All</span>
                  </Button>
                  <Button
                    onClick={fetchPersonalizedScholarships}
                    disabled={personalizedLoading}
                    className="flex items-center justify-center space-x-1.5 sm:space-x-2 flex-1 sm:flex-initial text-xs sm:text-sm px-3 sm:px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {personalizedLoading ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </motion.div>
                        <span className="hidden sm:inline">Generating...</span>
                        <span className="sm:hidden">AI...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">Get Personalized</span>
                        <span className="sm:hidden">AI Match</span>
                      </>
                    )}
                  </Button>
                </div>
              )}

              {/* Sort and Filter Buttons */}
              <div className="flex gap-2 w-full sm:w-auto">
                <Select
                  options={[
                    { value: 'deadline', label: 'Deadline (Nearest)' },
                    { value: 'amount', label: 'Amount (Highest)' },
                    { value: 'trending', label: 'Trending' },
                    { value: 'recent', label: 'Recently Added' },
                  ]}
                  value={sortBy}
                  onValueChange={setSortBy}
                  placeholder="Sort By"
                  className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 flex-1 sm:flex-initial sm:min-w-[150px] text-sm"
                />
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center justify-center space-x-1.5 sm:space-x-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 px-3 sm:px-4 text-xs sm:text-sm ${
                    (categoryFilter !== 'all' || domainFilter !== 'all') ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  <Filter className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>Filters</span>
                  {(categoryFilter !== 'all' || domainFilter !== 'all') && (
                    <span className="ml-1 px-1.5 sm:px-2 py-0.5 bg-blue-500 text-white text-[10px] sm:text-xs rounded-full">
                      {(categoryFilter !== 'all' ? 1 : 0) + (domainFilter !== 'all' ? 1 : 0)}
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="mb-4 p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-500/50 rounded-lg flex items-start sm:items-center space-x-2 text-red-700 dark:text-red-400"
            >
              <motion.div
                animate={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex-shrink-0"
              >
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              </motion.div>
              <span className="text-xs sm:text-sm">{error}</span>
            </motion.div>
          )}

          {/* Personalized Loading Info - ENHANCED */}
          {personalizedLoading && activeTab === 'scholarships' && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="mb-4 p-3 sm:p-5 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-2 border-blue-300 dark:border-blue-500/50 rounded-xl shadow-lg"
            >
              <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-3">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
                </motion.div>
                <span className="font-bold text-blue-700 dark:text-blue-300 text-sm sm:text-lg">🚀 AI is working its magic...</span>
              </div>
              <div className="ml-7 sm:ml-9 space-y-1.5 sm:space-y-2">
                <p className="text-xs sm:text-sm text-blue-700 dark:text-blue-400 font-medium">
                  ⚡ <strong>Optimized for Speed:</strong> Analyzing top 30 scholarships
                </p>
                <p className="text-xs sm:text-sm text-blue-600 dark:text-blue-400">
                  🎯 Matching your profile with personalized recommendations
                </p>
                <p className="text-[10px] sm:text-xs text-blue-500 dark:text-blue-500 mt-1.5 sm:mt-2">
                  ⏱️ Estimated time: <strong>15-30 seconds</strong>
                </p>
                <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 mt-0.5 sm:mt-1">
                  💡 Results are cached for 30 minutes
                </p>
              </div>
            </motion.div>
          )}

          {/* Personalized Mode Info */}
          {viewMode === 'personalized' && activeTab === 'scholarships' && !error && !personalizedLoading && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="mb-4 p-3 sm:p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-300 dark:border-purple-500/50 rounded-lg flex items-start sm:items-center space-x-2 text-purple-700 dark:text-purple-300"
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="flex-shrink-0"
              >
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
              </motion.div>
              <span className="text-xs sm:text-sm">Showing personalized recommendations based on your profile and resume</span>
            </motion.div>
          )}

          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="mt-3 sm:mt-4 p-3 sm:p-4 bg-white/70 dark:bg-gray-800 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-gray-700 shadow-md overflow-hidden"
            >
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">Filter Options</h3>
                {(categoryFilter !== 'all' || domainFilter !== 'all') && (
                  <button
                    onClick={() => {
                      setCategoryFilter('all')
                      setDomainFilter('all')
                    }}
                    className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Clear All
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4">
                {activeTab === 'scholarships' && (
                  <Select
                    options={[
                      { value: 'all', label: 'All Categories' },
                      { value: 'UG', label: 'Undergraduate' },
                      { value: 'PG', label: 'Postgraduate' },
                      { value: 'Research', label: 'Research' },
                      { value: 'Women', label: 'Women' },
                      { value: 'Merit-based', label: 'Merit-based' },
                    ]}
                    value={categoryFilter}
                    onValueChange={setCategoryFilter}
                    placeholder="Category"
                    className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-sm"
                  />
                )}
                <Select
                  options={[
                    { value: 'all', label: 'All Domains' },
                    { value: 'Engineering', label: 'Engineering' },
                    { value: 'Medical', label: 'Medical' },
                    { value: 'Science', label: 'Science' },
                    { value: 'Arts', label: 'Arts' },
                    { value: 'Commerce', label: 'Commerce' },
                    { value: 'General', label: 'General' },
                  ]}
                  value={domainFilter}
                  onValueChange={setDomainFilter}
                  placeholder="Domain"
                  className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-sm"
                />
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Results */}
        {loading ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="text-center py-8 sm:py-12"
          >
            <motion.div
              className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-gray-600 dark:text-gray-400 mt-3 sm:mt-4 text-sm sm:text-base"
            >
              Loading {activeTab}...
            </motion.p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filteredData.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="col-span-full text-center py-8 sm:py-12"
              >
                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-lg">No {activeTab} found matching your criteria</p>
              </motion.div>
            ) : (
              filteredData.map((item, index) => (
                <motion.div
                  key={(item as Scholarship)._id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.05,
                    ease: "easeOut"
                  }}
                  whileHover={{
                    y: -8,
                    transition: { duration: 0.2, ease: "easeOut" }
                  }}
                  className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500/50 transition-colors duration-300 group shadow-lg hover:shadow-2xl"
                >
                  {/* AI Match Score & Priority - Personalized Mode */}
                  {activeTab === 'scholarships' && viewMode === 'personalized' && (item as Scholarship).aiRecommendation && (
                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                      <div className="flex items-center space-x-1.5 sm:space-x-2">
                        <Target className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                        <span className="text-sm sm:text-lg font-bold text-purple-400">
                          {(item as Scholarship).aiRecommendation!.matchScore}% Match
                        </span>
                      </div>
                      <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium ${
                        (item as Scholarship).aiRecommendation!.priority === 'High'
                          ? 'bg-red-500/20 text-red-400'
                          : (item as Scholarship).aiRecommendation!.priority === 'Medium'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {(item as Scholarship).aiRecommendation!.priority} Priority
                      </span>
                    </div>
                  )}

                  {/* Trending Badge */}
                  {item.trending && !(activeTab === 'scholarships' && viewMode === 'personalized') && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="flex items-center space-x-1 text-yellow-600 dark:text-yellow-400 mb-2 sm:mb-3"
                    >
                      <motion.div
                        animate={{ y: [0, -3, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </motion.div>
                      <span className="text-xs sm:text-sm font-medium">Trending</span>
                    </motion.div>
                  )}

                  <h3 className="text-base sm:text-xl font-semibold text-gray-900 dark:text-white mb-1.5 sm:mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 line-clamp-2">
                    {item.title}
                  </h3>

                  <div className="flex items-center space-x-1.5 sm:space-x-2 text-gray-600 dark:text-gray-400 mb-2 sm:mb-3">
                    <Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 group-hover:scale-110 flex-shrink-0" />
                    <span className="text-xs sm:text-sm truncate">
                      {(item as Scholarship).provider}
                    </span>
                  </div>

                  <motion.div
                    className="flex items-center space-x-1.5 sm:space-x-2 text-green-600 dark:text-green-400 mb-2 sm:mb-3"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <IndianRupee className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="font-medium text-sm sm:text-base">{(item as Scholarship).amount}</span>
                  </motion.div>

                  {activeTab === 'scholarships' ? (
                    <>
                      {/* AI Match Reason - Personalized Mode */}
                      {viewMode === 'personalized' && (item as Scholarship).aiRecommendation && (
                        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-300 dark:border-purple-500/30 rounded-lg p-2 sm:p-3 mb-2 sm:mb-3">
                          <p className="text-xs sm:text-sm text-purple-800 dark:text-purple-200 mb-1.5 sm:mb-2">
                            <span className="font-semibold">Why this matches:</span> {(item as Scholarship).aiRecommendation!.matchReason}
                          </p>
                          <div className="flex items-center space-x-1.5 sm:space-x-2 text-[10px] sm:text-xs">
                            {(item as Scholarship).aiRecommendation!.eligibilityStatus === 'Eligible' ? (
                              <>
                                <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 dark:text-green-400" />
                                <span className="text-green-600 dark:text-green-400">Eligible</span>
                              </>
                            ) : (item as Scholarship).aiRecommendation!.eligibilityStatus === 'MayBeEligible' ? (
                              <>
                                <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-600 dark:text-yellow-400" />
                                <span className="text-yellow-600 dark:text-yellow-400">May Be Eligible</span>
                              </>
                            ) : (
                              <>
                                <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600 dark:text-gray-400" />
                                <span className="text-gray-600 dark:text-gray-400">Check Details</span>
                              </>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Action Steps - Personalized Mode */}
                      {viewMode === 'personalized' && (item as Scholarship).aiRecommendation?.actionSteps && (item as Scholarship).aiRecommendation!.actionSteps.length > 0 && (
                        <div className="mb-2 sm:mb-3">
                          <p className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">Next Steps:</p>
                          <ul className="space-y-0.5 sm:space-y-1">
                            {(item as Scholarship).aiRecommendation!.actionSteps.slice(0, 3).map((step, idx) => (
                              <li key={idx} className="flex items-start space-x-1.5 sm:space-x-2 text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">
                                <ArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 mt-0.5 flex-shrink-0 text-purple-600 dark:text-purple-400" />
                                <span className="line-clamp-2">{step}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Regular eligibility - All Mode */}
                      {viewMode === 'all' && (
                        <p className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
                          {(item as Scholarship).eligibility}
                        </p>
                      )}

                      <div className="flex items-center space-x-1.5 sm:space-x-2 text-gray-600 dark:text-gray-400 mb-3 sm:mb-4">
                        <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                        <span className="text-xs sm:text-sm">Deadline: {formatDate((item as Scholarship).deadline)}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Internship details - using Scholarship model fields */}
                      <p className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-3">
                        {(item as Scholarship).eligibility}
                      </p>

                      <div className="flex items-center space-x-1.5 sm:space-x-2 text-gray-600 dark:text-gray-400 mb-3 sm:mb-4">
                        <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                        <span className="text-xs sm:text-sm">Deadline: {formatDate((item as Scholarship).deadline)}</span>
                      </div>
                    </>
                  )}

                  <motion.a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white flex items-center justify-center space-x-1.5 sm:space-x-2 cursor-pointer py-2 sm:py-2.5 px-3 sm:px-4 rounded-md font-medium text-xs sm:text-sm transition-all duration-200 hover:shadow-xl"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={(e) => {
                      console.log('Apply Now clicked:', item.title, 'Link:', item.link)
                      // Let the default anchor behavior handle the link opening
                    }}
                  >
                    <span>Apply Now</span>
                    <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
                  </motion.a>
                </motion.div>
              ))
            )}
          </motion.div>
        )}

        {/* Debug Info */}
        {!loading && viewMode === 'all' && process.env.NODE_ENV === 'development' && (
          <div className="text-center py-3 sm:py-4 text-[10px] sm:text-xs text-gray-500 px-2">
            Debug: loading={loading.toString()}, personalizedLoading={personalizedLoading.toString()},
            viewMode={viewMode}, hasMore={hasMore.toString()},
            currentPage={currentPage}, totalCount={totalCount},
            loaded={activeTab === 'scholarships' ? scholarships.length : internships.length}
          </div>
        )}

        {/* Load More Button */}
        {!loading && !personalizedLoading && viewMode === 'all' && hasMore && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center mt-8 sm:mt-12 mb-6 sm:mb-8 px-4"
          >
            <motion.button
              onClick={loadMore}
              disabled={loadingMore}
              className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-medium text-sm sm:text-base shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto justify-center"
              whileHover={{ scale: loadingMore ? 1 : 1.05 }}
              whileTap={{ scale: loadingMore ? 1 : 0.95 }}
            >
              {loadingMore ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full" />
                  </motion.div>
                  <span className="hidden sm:inline">Loading more {activeTab}...</span>
                  <span className="sm:hidden">Loading...</span>
                </>
              ) : (
                <>
                  <span>Load More {activeTab}</span>
                  <motion.div
                    animate={{ y: [0, 3, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 rotate-90" />
                  </motion.div>
                </>
              )}
            </motion.button>
            <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mt-3 sm:mt-4 text-center">
              Loaded {activeTab === 'scholarships' ? scholarships.length : internships.length} of {totalCount} total {activeTab}
            </p>
          </motion.div>
        )}

        {/* End of Results Message */}
        {!loading && !hasMore && filteredData.length > 0 && viewMode === 'all' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-center py-6 sm:py-8 px-4"
          >
            <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
              You've reached the end of {activeTab}. Showing all {totalCount} results.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
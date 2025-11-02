'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  MessageSquare,
  Star,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  Users,
  Activity
} from 'lucide-react'
import { useAuth } from '@/components/auth-provider'
import Link from 'next/link'

interface DashboardStats {
  feedback: {
    total: number
    pending: number
    resolved: number
    byType: { type: string; count: number }[]
    byPriority: { priority: string; count: number }[]
  }
  reviews: {
    total: number
    pending: number
    approved: number
    featured: number
    avgRating: number
  }
}

export default function AdminDashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
  }, [user])

  const fetchDashboardStats = async () => {
    if (!user) return

    try {
      setIsLoading(true)
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      const token = await user.getIdToken()

      const [feedbackRes, reviewsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/feedback/stats`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_BASE_URL}/api/reviews/stats`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ])

      if (feedbackRes.ok && reviewsRes.ok) {
        const feedbackData = await feedbackRes.json()
        const reviewsData = await reviewsRes.json()

        setStats({
          feedback: feedbackData.data,
          reviews: reviewsData.data
        })
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Overview of feedback and reviews management
        </p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Link href="/admin/feedback?filter=pending">
            <Card className="p-6 bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-xl border-0 hover:shadow-2xl transition-shadow cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <AlertCircle className="w-8 h-8" />
                <Badge className="bg-white/20 text-white border-0">Pending</Badge>
              </div>
              <p className="text-3xl font-bold">{stats?.feedback.pending || 0}</p>
              <p className="text-orange-100 text-sm">Feedback Pending</p>
            </Card>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Link href="/admin/feedback">
            <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-xl border-0 hover:shadow-2xl transition-shadow cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <MessageSquare className="w-8 h-8" />
                <Badge className="bg-white/20 text-white border-0">Total</Badge>
              </div>
              <p className="text-3xl font-bold">{stats?.feedback.total || 0}</p>
              <p className="text-blue-100 text-sm">Total Feedback</p>
            </Card>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Link href="/admin/reviews?filter=pending">
            <Card className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-xl border-0 hover:shadow-2xl transition-shadow cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <Clock className="w-8 h-8" />
                <Badge className="bg-white/20 text-white border-0">Pending</Badge>
              </div>
              <p className="text-3xl font-bold">{stats?.reviews.pending || 0}</p>
              <p className="text-purple-100 text-sm">Reviews Pending</p>
            </Card>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Link href="/admin/reviews">
            <Card className="p-6 bg-gradient-to-br from-green-500 to-green-600 text-white shadow-xl border-0 hover:shadow-2xl transition-shadow cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <Star className="w-8 h-8" />
                <Badge className="bg-white/20 text-white border-0">Average</Badge>
              </div>
              <p className="text-3xl font-bold">{stats?.reviews.avgRating?.toFixed(1) || '0.0'}</p>
              <p className="text-green-100 text-sm">Average Rating</p>
            </Card>
          </Link>
        </motion.div>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Feedback Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Feedback by Type
            </h3>
            <div className="space-y-3">
              {stats?.feedback.byType.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      item.type === 'bug' ? 'bg-red-500' :
                      item.type === 'feature_request' ? 'bg-blue-500' :
                      item.type === 'improvement' ? 'bg-green-500' :
                      'bg-gray-500'
                    }`} />
                    <span className="text-gray-700 dark:text-gray-300 capitalize">
                      {item.type.replace('_', ' ')}
                    </span>
                  </div>
                  <Badge variant="outline">{item.count}</Badge>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Feedback by Priority */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Feedback by Priority
            </h3>
            <div className="space-y-3">
              {stats?.feedback.byPriority.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      item.priority === 'critical' ? 'bg-red-600' :
                      item.priority === 'high' ? 'bg-orange-500' :
                      item.priority === 'medium' ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`} />
                    <span className="text-gray-700 dark:text-gray-300 capitalize">
                      {item.priority}
                    </span>
                  </div>
                  <Badge variant="outline">{item.count}</Badge>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Review Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="lg:col-span-2"
        >
          <Card className="p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Review Statistics
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {stats?.reviews.total || 0}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Reviews</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {stats?.reviews.approved || 0}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Approved</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                  {stats?.reviews.pending || 0}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Pending</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  {stats?.reviews.featured || 0}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Featured</div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-8"
      >
        <Card className="p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/admin/feedback?filter=pending"
              className="flex items-center space-x-3 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors"
            >
              <AlertCircle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              <div>
                <div className="font-semibold text-gray-900 dark:text-gray-100">Review Pending Feedback</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {stats?.feedback.pending || 0} items need attention
                </div>
              </div>
            </Link>

            <Link
              href="/admin/reviews?filter=pending"
              className="flex items-center space-x-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
            >
              <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              <div>
                <div className="font-semibold text-gray-900 dark:text-gray-100">Moderate Reviews</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {stats?.reviews.pending || 0} reviews awaiting approval
                </div>
              </div>
            </Link>

            <Link
              href="/admin/insights"
              className="flex items-center space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
            >
              <Activity className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <div>
                <div className="font-semibold text-gray-900 dark:text-gray-100">View Analytics</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Detailed platform insights
                </div>
              </div>
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}

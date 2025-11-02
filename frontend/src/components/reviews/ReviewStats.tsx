'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Star, TrendingUp, Users, Award } from 'lucide-react'
import { getReviewStats } from '@/lib/api/reviews'
import StarRating from '@/components/shared/StarRating'
import { Card } from '@/components/ui/card'

export default function ReviewStats() {
  const [stats, setStats] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      const result = await getReviewStats()
      if (result.success && result.data) {
        setStats(result.data)
      }
      setIsLoading(false)
    }

    loadStats()
  }, [])

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </Card>
    )
  }

  if (!stats) {
    return null
  }

  const ratingDistribution = stats.ratingDistribution || {}
  const total = stats.approved || 0

  return (
    <Card className="p-6 bg-white dark:bg-gray-900/50">
      {/* Overall Rating */}
      <div className="text-center mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mb-3">
          <span className="text-3xl font-bold text-white">
            {stats.avgRating.toFixed(1)}
          </span>
        </div>
        <StarRating rating={stats.avgRating} size="lg" className="justify-center mb-2" />
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Based on {stats.approved} review{stats.approved !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Rating Distribution */}
      <div className="space-y-2 mb-6">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Rating Distribution
        </h4>
        {[5, 4, 3, 2, 1].map((rating) => {
          const count = ratingDistribution[`${rating}star`] || 0
          const percentage = total > 0 ? (count / total) * 100 : 0

          return (
            <div key={rating} className="flex items-center gap-3">
              <div className="flex items-center gap-1 w-12">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {rating}
                </span>
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              </div>

              <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.5, delay: (5 - rating) * 0.1 }}
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                />
              </div>

              <span className="text-sm text-gray-600 dark:text-gray-400 w-12 text-right">
                {count}
              </span>
            </div>
          )
        })}
      </div>

      {/* Aspect Ratings */}
      {stats.aspectRatings && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Aspect Ratings
          </h4>
          <div className="space-y-3">
            {Object.entries(stats.aspectRatings).map(([key, value]: [string, any]) => {
              if (!value || value === 0) return null

              const labels: Record<string, string> = {
                features: 'Features',
                support: 'Customer Support',
                easeOfUse: 'Ease of Use',
                valueForMoney: 'Value for Money'
              }

              return (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {labels[key]}
                  </span>
                  <div className="flex items-center gap-2">
                    <StarRating rating={value} size="sm" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white w-8">
                      {value.toFixed(1)}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Recommendation Rate */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Recommendation Rate
          </span>
          <span className="text-2xl font-bold text-green-600 dark:text-green-400">
            {stats.recommendationRate}%
          </span>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Of reviewers would recommend CareerCraft AI
        </p>
      </div>
    </Card>
  )
}

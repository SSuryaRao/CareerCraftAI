'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ThumbsUp, Star, CheckCircle, MessageCircle } from 'lucide-react'
import { Review } from '@/lib/api/reviews'
import { markReviewHelpful } from '@/lib/api/reviews'
import StarRating from '@/components/shared/StarRating'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useAuth } from '@/components/auth-provider'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils'

interface ReviewCardProps {
  review: Review
  onHelpfulUpdate?: () => void
}

export default function ReviewCard({ review, onHelpfulUpdate }: ReviewCardProps) {
  const { user } = useAuth()
  const [isHelpful, setIsHelpful] = useState(false)
  const [helpfulCount, setHelpfulCount] = useState(review.helpfulCount)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleHelpful = async () => {
    if (!user) {
      toast.error('Please log in to mark reviews as helpful')
      return
    }

    setIsSubmitting(true)

    try {
      const result = await markReviewHelpful(review.id)

      if (result.success && result.data) {
        setHelpfulCount(result.data.helpfulCount)
        setIsHelpful(result.data.isHelpful)
        toast.success(result.data.isHelpful ? 'Marked as helpful' : 'Removed helpful mark')
        onHelpfulUpdate?.()
      } else {
        toast.error(result.error || 'Failed to update')
      }
    } catch (error: any) {
      toast.error(error.message || 'An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-6 hover:shadow-lg transition-shadow duration-300 bg-white dark:bg-gray-900/50">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4 flex-1">
            {/* Avatar */}
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
              {review.userName.charAt(0).toUpperCase()}
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  {review.userName}
                </h4>
                {review.isVerifiedUser && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-medium rounded-full">
                    <CheckCircle className="w-3 h-3" />
                    Verified
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {review.userRole}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                {formatDate(review.createdAt)}
              </p>
            </div>
          </div>

          {/* Featured Badge */}
          {review.isFeatured && (
            <span className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold rounded-full">
              ⭐ Featured
            </span>
          )}
        </div>

        {/* Rating */}
        <div className="mb-3">
          <StarRating rating={review.rating} size="md" showNumber />
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          {review.title}
        </h3>

        {/* Review Text */}
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
          {review.review}
        </p>

        {/* Aspect Ratings */}
        {review.aspectRatings && Object.values(review.aspectRatings).some(v => v !== null && v > 0) && (
          <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Detailed Ratings
            </h5>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(review.aspectRatings).map(([key, value]) => {
                if (!value) return null
                const labels: Record<string, string> = {
                  features: 'Features',
                  support: 'Support',
                  easeOfUse: 'Ease of Use',
                  valueForMoney: 'Value'
                }
                return (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {labels[key]}
                    </span>
                    <StarRating rating={value} size="sm" />
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Team Response */}
        {review.teamResponse && (
          <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-950/20 border-l-4 border-blue-500 rounded">
            <div className="flex items-start gap-2 mb-2">
              <MessageCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h5 className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                  Response from CareerCraft AI Team
                </h5>
                {review.responseDate && (
                  <p className="text-xs text-blue-600 dark:text-blue-400">
                    {formatDate(review.responseDate)}
                  </p>
                )}
              </div>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 ml-6">
              {review.teamResponse}
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleHelpful}
            disabled={isSubmitting}
            className={cn(
              'gap-2',
              isHelpful && 'text-blue-600 dark:text-blue-400'
            )}
          >
            <ThumbsUp className={cn('w-4 h-4', isHelpful && 'fill-current')} />
            <span>Helpful ({helpfulCount})</span>
          </Button>
        </div>
      </Card>
    </motion.div>
  )
}

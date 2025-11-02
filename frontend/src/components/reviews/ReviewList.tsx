'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Star, Filter, Search } from 'lucide-react'
import { getApprovedReviews, Review } from '@/lib/api/reviews'
import ReviewCard from './ReviewCard'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function ReviewList() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [sortBy, setSortBy] = useState('-createdAt')
  const [minRating, setMinRating] = useState(1)

  const loadReviews = async () => {
    setIsLoading(true)

    const result = await getApprovedReviews({
      page,
      limit: 10,
      sort: sortBy,
      minRating
    })

    if (result.success && result.data) {
      setReviews(result.data.reviews)
      setTotalPages(result.data.pagination.totalPages)
    }

    setIsLoading(false)
  }

  useEffect(() => {
    loadReviews()
  }, [page, sortBy, minRating])

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (isLoading && reviews.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="p-4 bg-white dark:bg-gray-900/50">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Sort By */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value)
                setPage(1)
              }}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="-createdAt">Newest First</option>
              <option value="createdAt">Oldest First</option>
              <option value="-rating">Highest Rated</option>
              <option value="rating">Lowest Rated</option>
              <option value="-helpfulCount">Most Helpful</option>
            </select>
          </div>

          {/* Filter by Rating */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Minimum Rating
            </label>
            <select
              value={minRating}
              onChange={(e) => {
                setMinRating(Number(e.target.value))
                setPage(1)
              }}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="1">All Reviews (1★+)</option>
              <option value="2">2 Stars & Above</option>
              <option value="3">3 Stars & Above</option>
              <option value="4">4 Stars & Above</option>
              <option value="5">5 Stars Only</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <Card className="p-12 text-center">
          <Star className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No Reviews Yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Be the first to share your experience!
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} onHelpfulUpdate={loadReviews} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1 || isLoading}
          >
            Previous
          </Button>

          <span className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
            Page {page} of {totalPages}
          </span>

          <Button
            variant="outline"
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages || isLoading}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}

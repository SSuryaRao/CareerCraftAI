'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Search,
  Star,
  User,
  Calendar,
  CheckCircle2,
  XCircle,
  Trash2,
  Eye,
  X,
  MessageSquare,
  Award,
  ThumbsUp
} from 'lucide-react'
import { useAuth } from '@/components/auth-provider'
import { useSearchParams } from 'next/navigation'
import * as reviewsApi from '@/lib/api/reviews'

interface Review {
  _id: string
  userId: string
  userName?: string
  userPicture?: string
  userRole?: string
  rating: number
  title: string
  review: string
  status: string
  isFeatured: boolean
  helpfulCount: number
  aspectRatings?: {
    features?: number
    support?: number
    easeOfUse?: number
    valueForMoney?: number
  }
  teamResponse?: {
    message: string
    responderName: string
    respondedAt: Date
  }
  createdAt: string
  updatedAt: string
}

export default function AdminReviewsPage() {
  const { user } = useAuth()
  const searchParams = useSearchParams()
  const [reviewsList, setReviewsList] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState(searchParams.get('filter') || 'all')
  const [filterRating, setFilterRating] = useState('all')
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [teamResponse, setTeamResponse] = useState('')
  const [rejectionReason, setRejectionReason] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchReviews()
  }, [user, filterStatus, filterRating, searchTerm, page])

  const fetchReviews = async () => {
    if (!user) return

    try {
      setIsLoading(true)
      const token = await user.getIdToken()

      const params: any = {
        page,
        limit: 20,
        sort: '-createdAt'
      }

      if (filterStatus !== 'all') params.status = filterStatus
      if (filterRating !== 'all') params.minRating = parseInt(filterRating)
      if (searchTerm) params.search = searchTerm

      const response = await reviewsApi.getAllReviews(params)

      if (response.success) {
        setReviewsList(response.data.reviews)
        setTotalPages(response.data.pagination.pages)
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewDetails = (review: Review) => {
    setSelectedReview(review)
    setTeamResponse(review.teamResponse?.message || '')
    setShowDetailModal(true)
  }

  const handleApprove = async (reviewId: string) => {
    if (!user) return

    try {
      await reviewsApi.approveReview(reviewId)
      await fetchReviews()

      if (selectedReview && selectedReview._id === reviewId) {
        setShowDetailModal(false)
      }
    } catch (error) {
      console.error('Error approving review:', error)
      alert('Failed to approve review')
    }
  }

  const handleReject = async (reviewId: string) => {
    if (!user || !rejectionReason.trim()) {
      alert('Please provide a rejection reason')
      return
    }

    try {
      await reviewsApi.rejectReview(reviewId, rejectionReason)
      await fetchReviews()
      setShowDetailModal(false)
      setRejectionReason('')
    } catch (error) {
      console.error('Error rejecting review:', error)
      alert('Failed to reject review')
    }
  }

  const handleToggleFeatured = async (reviewId: string) => {
    if (!user) return

    try {
      await reviewsApi.toggleReviewFeatured(reviewId)
      await fetchReviews()

      // Update selected review
      if (selectedReview && selectedReview._id === reviewId) {
        setSelectedReview({ ...selectedReview, isFeatured: !selectedReview.isFeatured })
      }
    } catch (error) {
      console.error('Error toggling featured:', error)
      alert('Failed to toggle featured status')
    }
  }

  const handleAddResponse = async () => {
    if (!user || !selectedReview || !teamResponse.trim()) return

    try {
      await reviewsApi.respondToReview(selectedReview._id, teamResponse)

      setTeamResponse('')
      await fetchReviews()

      // Refresh selected review
      const updated = await reviewsApi.getAllReviews({})
      const updatedReview = updated.data.reviews.find((r: Review) => r._id === selectedReview._id)
      if (updatedReview) {
        setSelectedReview(updatedReview)
      }
    } catch (error) {
      console.error('Error adding response:', error)
      alert('Failed to add response')
    }
  }

  const handleDelete = async (reviewId: string) => {
    if (!user || !confirm('Are you sure you want to delete this review?')) return

    try {
      await reviewsApi.deleteReview(reviewId)
      await fetchReviews()
      setShowDetailModal(false)
    } catch (error) {
      console.error('Error deleting review:', error)
      alert('Failed to delete review')
    }
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      approved: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      rejected: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
    }
    return colors[status] || colors.pending
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex space-x-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-5 h-5 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Reviews Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Moderate and manage user reviews
        </p>
      </div>

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search reviews..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>

          <select
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100"
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4+ Stars</option>
            <option value="3">3+ Stars</option>
            <option value="2">2+ Stars</option>
            <option value="1">1+ Star</option>
          </select>
        </div>
      </Card>

      {/* Reviews List */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : reviewsList.length === 0 ? (
        <Card className="p-12 text-center">
          <Star className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            No reviews found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your filters or search term
          </p>
        </Card>
      ) : (
        <>
          <div className="space-y-4">
            {reviewsList.map((review, index) => (
              <motion.div
                key={review._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        {renderStars(review.rating)}
                        <Badge className={getStatusColor(review.status)}>
                          {review.status}
                        </Badge>
                        {review.isFeatured && (
                          <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400">
                            <Award className="w-3 h-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                      </div>

                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                        {review.title}
                      </h3>

                      <p className="text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                        {review.review}
                      </p>

                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span>{review.userName || 'Anonymous'}</span>
                        </div>
                        {review.userRole && (
                          <Badge variant="outline" className="text-xs">{review.userRole}</Badge>
                        )}
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <ThumbsUp className="w-4 h-4" />
                          <span>{review.helpfulCount} helpful</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewDetails(review)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center space-x-2 mt-6">
              <Button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                variant="outline"
              >
                Previous
              </Button>
              <span className="px-4 py-2 text-gray-700 dark:text-gray-300">
                Page {page} of {totalPages}
              </span>
              <Button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                variant="outline"
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedReview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl max-w-3xl w-full my-8"
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Review Details
              </h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 max-h-[70vh] overflow-y-auto">
              {/* Status and Rating */}
              <div className="flex items-center space-x-3 mb-6">
                {renderStars(selectedReview.rating)}
                <Badge className={getStatusColor(selectedReview.status)}>
                  {selectedReview.status}
                </Badge>
                {selectedReview.isFeatured && (
                  <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400">
                    <Award className="w-3 h-3 mr-1" />
                    Featured
                  </Badge>
                )}
              </div>

              {/* Main Content */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Title</h3>
                  <p className="text-gray-700 dark:text-gray-300">{selectedReview.title}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Review</h3>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{selectedReview.review}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">User</h3>
                    <p className="text-gray-700 dark:text-gray-300">{selectedReview.userName || 'Anonymous'}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Role</h3>
                    <p className="text-gray-700 dark:text-gray-300">{selectedReview.userRole || 'N/A'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Submitted</h3>
                    <p className="text-gray-700 dark:text-gray-300">
                      {new Date(selectedReview.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Helpful Count</h3>
                    <p className="text-gray-700 dark:text-gray-300">{selectedReview.helpfulCount}</p>
                  </div>
                </div>

                {/* Aspect Ratings */}
                {selectedReview.aspectRatings && (
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Aspect Ratings</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {selectedReview.aspectRatings.features && (
                        <div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Features</div>
                          <div className="flex space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < selectedReview.aspectRatings!.features! ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                      {selectedReview.aspectRatings.support && (
                        <div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Support</div>
                          <div className="flex space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < selectedReview.aspectRatings!.support! ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                      {selectedReview.aspectRatings.easeOfUse && (
                        <div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Ease of Use</div>
                          <div className="flex space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < selectedReview.aspectRatings!.easeOfUse! ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                      {selectedReview.aspectRatings.valueForMoney && (
                        <div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Value for Money</div>
                          <div className="flex space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < selectedReview.aspectRatings!.valueForMoney! ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Team Response */}
                {selectedReview.teamResponse && (
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Team Response</h3>
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                      <p className="text-gray-700 dark:text-gray-300 mb-2">{selectedReview.teamResponse.message}</p>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {selectedReview.teamResponse.responderName} - {new Date(selectedReview.teamResponse.respondedAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                )}

                {/* Add/Edit Team Response */}
                {selectedReview.status === 'approved' && (
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      {selectedReview.teamResponse ? 'Edit Team Response' : 'Add Team Response'}
                    </h3>
                    <div className="space-y-2">
                      <textarea
                        value={teamResponse}
                        onChange={(e) => setTeamResponse(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100"
                        rows={3}
                        placeholder="Thank the reviewer or provide additional context..."
                      />
                      <Button onClick={handleAddResponse} disabled={!teamResponse.trim()}>
                        {selectedReview.teamResponse ? 'Update Response' : 'Add Response'}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Rejection Reason (for pending reviews) */}
                {selectedReview.status === 'pending' && (
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Rejection Reason (if rejecting)</h3>
                    <Input
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Reason for rejection..."
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-between">
              <div className="space-x-2">
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(selectedReview._id)}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
              <div className="space-x-2">
                {selectedReview.status === 'approved' && (
                  <Button
                    variant="outline"
                    onClick={() => handleToggleFeatured(selectedReview._id)}
                  >
                    <Award className="w-4 h-4 mr-1" />
                    {selectedReview.isFeatured ? 'Unfeature' : 'Feature'}
                  </Button>
                )}
                {selectedReview.status === 'pending' && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => handleReject(selectedReview._id)}
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Reject
                    </Button>
                    <Button
                      onClick={() => handleApprove(selectedReview._id)}
                    >
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

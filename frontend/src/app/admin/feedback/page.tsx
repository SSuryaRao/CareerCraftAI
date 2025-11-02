'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Search,
  Filter,
  ChevronDown,
  MessageSquare,
  User,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock,
  Trash2,
  Eye,
  X,
  FileText,
  ExternalLink
} from 'lucide-react'
import { useAuth } from '@/components/auth-provider'
import { useSearchParams } from 'next/navigation'
import * as feedbackApi from '@/lib/api/feedback'

interface Feedback {
  _id: string
  userId?: string
  type: string
  category: string
  subject: string
  message: string
  email?: string
  rating?: number
  status: string
  priority: string
  createdAt: string
  sentiment?: {
    score: number
    magnitude: number
    label: string
  }
  adminNotes?: string
  responses?: Array<{
    message: string
    adminId: string
    adminEmail: string
    timestamp: Date
  }>
  attachments?: Array<{
    url: string
    filename: string
  }>
}

export default function AdminFeedbackPage() {
  const { user } = useAuth()
  const searchParams = useSearchParams()
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState(searchParams.get('filter') || 'all')
  const [filterType, setFilterType] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [adminNote, setAdminNote] = useState('')
  const [responseMessage, setResponseMessage] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchFeedback()
  }, [user, filterStatus, filterType, filterPriority, searchTerm, page])

  const fetchFeedback = async () => {
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
      if (filterType !== 'all') params.type = filterType
      if (filterPriority !== 'all') params.priority = filterPriority
      if (searchTerm) params.search = searchTerm

      const response = await feedbackApi.getAllFeedback(params)

      if (response.success) {
        setFeedbackList(response.data.feedback)
        setTotalPages(response.data.pagination.pages)
      }
    } catch (error) {
      console.error('Error fetching feedback:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewDetails = (feedback: Feedback) => {
    setSelectedFeedback(feedback)
    setAdminNote(feedback.adminNotes || '')
    setShowDetailModal(true)
  }

  const handleUpdateStatus = async (feedbackId: string, status: string, priority?: string) => {
    if (!user) return

    try {
      const token = await user.getIdToken()
      const updates: any = { status }
      if (priority) updates.priority = priority
      if (adminNote) updates.adminNotes = adminNote

      await feedbackApi.updateFeedback(feedbackId, updates)
      await fetchFeedback()

      if (selectedFeedback && selectedFeedback._id === feedbackId) {
        setShowDetailModal(false)
      }
    } catch (error) {
      console.error('Error updating feedback:', error)
      alert('Failed to update feedback')
    }
  }

  const handleAddResponse = async () => {
    if (!user || !selectedFeedback || !responseMessage.trim()) return

    try {
      const token = await user.getIdToken()

      await feedbackApi.updateFeedback(selectedFeedback._id, {
        responses: [
          ...(selectedFeedback.responses || []),
          {
            message: responseMessage,
            adminId: user.uid,
            adminEmail: user.email || '',
            timestamp: new Date()
          }
        ]
      })

      setResponseMessage('')
      await fetchFeedback()

      // Refresh selected feedback
      const updated = await feedbackApi.getAllFeedback({})
      const updatedFeedback = updated.data.feedback.find((f: Feedback) => f._id === selectedFeedback._id)
      if (updatedFeedback) {
        setSelectedFeedback(updatedFeedback)
      }
    } catch (error) {
      console.error('Error adding response:', error)
      alert('Failed to add response')
    }
  }

  const handleDelete = async (feedbackId: string) => {
    if (!user || !confirm('Are you sure you want to delete this feedback?')) return

    try {
      await feedbackApi.deleteFeedback(feedbackId)
      await fetchFeedback()
      setShowDetailModal(false)
    } catch (error) {
      console.error('Error deleting feedback:', error)
      alert('Failed to delete feedback')
    }
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      reviewing: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      'in-progress': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
      resolved: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      archived: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
    }
    return colors[status] || colors.pending
  }

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      critical: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
      high: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
      medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      low: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    }
    return colors[priority] || colors.medium
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Feedback Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Review and manage user feedback submissions
        </p>
      </div>

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search feedback..."
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
            <option value="reviewing">Reviewing</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="archived">Archived</option>
          </select>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100"
          >
            <option value="all">All Types</option>
            <option value="bug">Bug Report</option>
            <option value="feature_request">Feature Request</option>
            <option value="improvement">Improvement</option>
            <option value="general">General</option>
            <option value="complaint">Complaint</option>
          </select>

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100"
          >
            <option value="all">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </Card>

      {/* Feedback List */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : feedbackList.length === 0 ? (
        <Card className="p-12 text-center">
          <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            No feedback found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your filters or search term
          </p>
        </Card>
      ) : (
        <>
          <div className="space-y-4">
            {feedbackList.map((feedback, index) => (
              <motion.div
                key={feedback._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          {feedback.subject}
                        </h3>
                        <Badge className={getStatusColor(feedback.status)}>
                          {feedback.status}
                        </Badge>
                        <Badge className={getPriorityColor(feedback.priority)}>
                          {feedback.priority}
                        </Badge>
                        <Badge variant="outline" className="capitalize">
                          {feedback.type.replace('_', ' ')}
                        </Badge>
                      </div>

                      <p className="text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                        {feedback.message}
                      </p>

                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span>{feedback.email || 'Anonymous'}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(feedback.createdAt).toLocaleDateString()}</span>
                        </div>
                        {feedback.sentiment && (
                          <Badge variant="outline" className="text-xs">
                            Sentiment: {feedback.sentiment.label}
                          </Badge>
                        )}
                        {feedback.attachments && feedback.attachments.length > 0 && (
                          <Badge variant="outline" className="text-xs">
                            {feedback.attachments.length} attachment(s)
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex space-x-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewDetails(feedback)}
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
      {showDetailModal && selectedFeedback && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl max-w-3xl w-full my-8"
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Feedback Details
              </h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 max-h-[70vh] overflow-y-auto">
              {/* Status and Priority */}
              <div className="flex space-x-3 mb-6">
                <Badge className={getStatusColor(selectedFeedback.status)}>
                  {selectedFeedback.status}
                </Badge>
                <Badge className={getPriorityColor(selectedFeedback.priority)}>
                  {selectedFeedback.priority}
                </Badge>
                <Badge variant="outline" className="capitalize">
                  {selectedFeedback.type.replace('_', ' ')}
                </Badge>
                <Badge variant="outline" className="capitalize">
                  {selectedFeedback.category}
                </Badge>
              </div>

              {/* Main Content */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Subject</h3>
                  <p className="text-gray-700 dark:text-gray-300">{selectedFeedback.subject}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Message</h3>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{selectedFeedback.message}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Email</h3>
                    <p className="text-gray-700 dark:text-gray-300">{selectedFeedback.email || 'Anonymous'}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Submitted</h3>
                    <p className="text-gray-700 dark:text-gray-300">
                      {new Date(selectedFeedback.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                {selectedFeedback.rating && (
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Rating</h3>
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < selectedFeedback.rating! ? 'text-yellow-400' : 'text-gray-300'}>
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedFeedback.sentiment && (
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Sentiment Analysis</h3>
                    <div className="flex space-x-4">
                      <Badge>{selectedFeedback.sentiment.label}</Badge>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Score: {selectedFeedback.sentiment.score.toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}

                {selectedFeedback.attachments && selectedFeedback.attachments.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Attachments</h3>
                    <div className="space-y-2">
                      {selectedFeedback.attachments.map((attachment, idx) => (
                        <a
                          key={idx}
                          href={attachment.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 dark:text-blue-400"
                        >
                          <FileText className="w-4 h-4" />
                          <span>{attachment.filename}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Admin Notes */}
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Admin Notes</h3>
                  <textarea
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100"
                    rows={3}
                    placeholder="Add internal notes..."
                  />
                </div>

                {/* Responses */}
                {selectedFeedback.responses && selectedFeedback.responses.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Responses</h3>
                    <div className="space-y-3">
                      {selectedFeedback.responses.map((response, idx) => (
                        <div key={idx} className="bg-gray-50 dark:bg-slate-700 p-3 rounded-lg">
                          <p className="text-gray-700 dark:text-gray-300 mb-2">{response.message}</p>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {response.adminEmail} - {new Date(response.timestamp).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add Response */}
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Add Response</h3>
                  <div className="flex space-x-2">
                    <Input
                      value={responseMessage}
                      onChange={(e) => setResponseMessage(e.target.value)}
                      placeholder="Type your response..."
                      className="flex-1"
                    />
                    <Button onClick={handleAddResponse} disabled={!responseMessage.trim()}>
                      Send
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-between">
              <div className="space-x-2">
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(selectedFeedback._id)}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
              <div className="space-x-2">
                <Button
                  variant="outline"
                  onClick={() => handleUpdateStatus(selectedFeedback._id, 'reviewing')}
                >
                  Mark Reviewing
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleUpdateStatus(selectedFeedback._id, 'in-progress')}
                >
                  Mark In Progress
                </Button>
                <Button
                  onClick={() => handleUpdateStatus(selectedFeedback._id, 'resolved')}
                >
                  <CheckCircle2 className="w-4 h-4 mr-1" />
                  Mark Resolved
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

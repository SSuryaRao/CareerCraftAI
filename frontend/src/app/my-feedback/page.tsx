'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Navbar from '@/components/layout/navbar'
import {
  MessageSquare,
  Calendar,
  Eye,
  X,
  FileText,
  ExternalLink,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'
import { useAuth } from '@/components/auth-provider'
import { useRouter } from 'next/navigation'
import * as feedbackApi from '@/lib/api/feedback'

interface Feedback {
  _id: string
  type: string
  category: string
  subject: string
  message: string
  rating?: number
  status: string
  priority: string
  createdAt: string
  sentiment?: {
    score: number
    magnitude: number
    label: string
  }
  responses?: Array<{
    message: string
    adminEmail: string
    timestamp: Date
  }>
  attachments?: Array<{
    url: string
    filename: string
  }>
}

export default function MyFeedbackPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push('/login?redirect=/my-feedback')
      return
    }

    fetchMyFeedback()
  }, [user])

  const fetchMyFeedback = async () => {
    if (!user) return

    try {
      setIsLoading(true)
      const response = await feedbackApi.getUserFeedback()

      if (response.success) {
        setFeedbackList(response.data)
      }
    } catch (error) {
      console.error('Error fetching feedback:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewDetails = (feedback: Feedback) => {
    setSelectedFeedback(feedback)
    setShowDetailModal(true)
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5" />
      case 'reviewing':
      case 'in-progress':
        return <AlertCircle className="w-5 h-5" />
      case 'resolved':
        return <CheckCircle2 className="w-5 h-5" />
      default:
        return <MessageSquare className="w-5 h-5" />
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950/20">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-8 mt-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            My Feedback
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your feedback submissions and responses from our team
          </p>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="text-2xl font-bold">{feedbackList.length}</div>
            <div className="text-sm text-blue-100">Total Submissions</div>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
            <div className="text-2xl font-bold">
              {feedbackList.filter(f => f.status === 'pending').length}
            </div>
            <div className="text-sm text-yellow-100">Pending</div>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <div className="text-2xl font-bold">
              {feedbackList.filter(f => f.status === 'in-progress' || f.status === 'reviewing').length}
            </div>
            <div className="text-sm text-purple-100">In Progress</div>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-green-500 to-green-600 text-white">
            <div className="text-2xl font-bold">
              {feedbackList.filter(f => f.status === 'resolved').length}
            </div>
            <div className="text-sm text-green-100">Resolved</div>
          </Card>
        </div>

        {/* Feedback List */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : feedbackList.length === 0 ? (
          <Card className="p-12 text-center">
            <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No feedback yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Have suggestions or encountered issues? We'd love to hear from you!
            </p>
            <Button onClick={() => router.push('/feedback')}>
              Submit Feedback
            </Button>
          </Card>
        ) : (
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
                          {getStatusIcon(feedback.status)}
                          <span className="ml-1">{feedback.status}</span>
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
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(feedback.createdAt).toLocaleDateString()}</span>
                        </div>
                        {feedback.responses && feedback.responses.length > 0 && (
                          <Badge variant="outline" className="text-xs bg-green-50 dark:bg-green-900/20">
                            {feedback.responses.length} response(s)
                          </Badge>
                        )}
                        {feedback.attachments && feedback.attachments.length > 0 && (
                          <Badge variant="outline" className="text-xs">
                            {feedback.attachments.length} attachment(s)
                          </Badge>
                        )}
                      </div>
                    </div>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewDetails(feedback)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View Details
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* CTA */}
        {feedbackList.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-center"
          >
            <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-700">
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Have more feedback to share?
              </p>
              <Button onClick={() => router.push('/feedback')}>
                Submit New Feedback
              </Button>
            </Card>
          </motion.div>
        )}
      </div>

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
              {/* Status */}
              <div className="flex space-x-3 mb-6">
                <Badge className={getStatusColor(selectedFeedback.status)}>
                  {getStatusIcon(selectedFeedback.status)}
                  <span className="ml-1">{selectedFeedback.status}</span>
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

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Submitted</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    {new Date(selectedFeedback.createdAt).toLocaleString()}
                  </p>
                </div>

                {selectedFeedback.rating && (
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Your Rating</h3>
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < selectedFeedback.rating! ? 'text-yellow-400' : 'text-gray-300'}>
                          ★
                        </span>
                      ))}
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

                {/* Responses from Team */}
                {selectedFeedback.responses && selectedFeedback.responses.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                      Responses from Our Team
                    </h3>
                    <div className="space-y-3">
                      {selectedFeedback.responses.map((response, idx) => (
                        <div key={idx} className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border-l-4 border-blue-600">
                          <p className="text-gray-700 dark:text-gray-300 mb-2">{response.message}</p>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {response.adminEmail} - {new Date(response.timestamp).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* No responses yet message */}
                {(!selectedFeedback.responses || selectedFeedback.responses.length === 0) && (
                  <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg text-center">
                    <MessageSquare className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      No responses yet. Our team will review your feedback soon.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end">
              <Button onClick={() => setShowDetailModal(false)}>
                Close
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

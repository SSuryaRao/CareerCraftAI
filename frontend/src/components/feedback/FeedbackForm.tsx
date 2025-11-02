'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Bug, Lightbulb, MessageSquare, TrendingUp, AlertCircle, Send, CheckCircle } from 'lucide-react'
import { feedbackSchema, FeedbackFormData, feedbackTypeLabels, feedbackCategoryLabels } from '@/lib/validations/feedback'
import { submitFeedback } from '@/lib/api/feedback'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import RatingInput from '@/components/shared/RatingInput'
import FileUpload from '@/components/shared/FileUpload'
import { useAuth } from '@/components/auth-provider'
import toast from 'react-hot-toast'

const typeIcons = {
  bug: Bug,
  feature_request: Lightbulb,
  general: MessageSquare,
  improvement: TrendingUp,
  complaint: AlertCircle
}

export default function FeedbackForm() {
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [files, setFiles] = useState<File[]>([])

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors }
  } = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      isAnonymous: false,
      rating: null,
      email: user?.email || ''
    }
  })

  const watchType = watch('type')
  const watchMessage = watch('message', '')
  const watchSubject = watch('subject', '')
  const watchIsAnonymous = watch('isAnonymous')

  const onSubmit = async (data: FeedbackFormData) => {
    setIsSubmitting(true)

    try {
      // Add current page URL
      data.pageUrl = window.location.href

      const result = await submitFeedback(data, files)

      if (result.success) {
        setIsSuccess(true)
        toast.success('Feedback submitted successfully! Thank you.')
        reset()
        setFiles([])

        // Reset success state after 5 seconds
        setTimeout(() => setIsSuccess(false), 5000)
      } else {
        toast.error(result.error || 'Failed to submit feedback')
      }
    } catch (error: any) {
      toast.error(error.message || 'An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
        >
          <CheckCircle className="w-20 h-20 mx-auto text-green-500 mb-6" />
        </motion.div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          Thank You!
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Your feedback has been submitted successfully. We'll review it and get back to you if needed.
        </p>
        <Button onClick={() => setIsSuccess(false)}>
          Submit Another Feedback
        </Button>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Feedback Type */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Feedback Type <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {Object.entries(feedbackTypeLabels).map(([value, label]) => {
            const Icon = typeIcons[value as keyof typeof typeIcons]
            const isSelected = watchType === value

            return (
              <button
                key={value}
                type="button"
                onClick={() => setValue('type', value as any)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
                }`}
              >
                <Icon className={`w-6 h-6 mx-auto mb-2 ${isSelected ? 'text-blue-500' : 'text-gray-400'}`} />
                <p className={`text-xs font-medium ${isSelected ? 'text-blue-700 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}>
                  {label}
                </p>
              </button>
            )
          })}
        </div>
        {errors.type && (
          <p className="text-sm text-red-600 dark:text-red-400">{errors.type.message}</p>
        )}
      </div>

      {/* Category */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Category <span className="text-red-500">*</span>
        </label>
        <select
          {...register('category')}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          <option value="">Select a category</option>
          {Object.entries(feedbackCategoryLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="text-sm text-red-600 dark:text-red-400">{errors.category.message}</p>
        )}
      </div>

      {/* Subject */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Subject <span className="text-red-500">*</span>
        </label>
        <input
          {...register('subject')}
          type="text"
          placeholder="Brief summary of your feedback"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
        <div className="flex justify-between text-xs">
          <div>
            {errors.subject && (
              <p className="text-red-600 dark:text-red-400">{errors.subject.message}</p>
            )}
          </div>
          <p className="text-gray-500 dark:text-gray-400">
            {watchSubject.length}/150
          </p>
        </div>
      </div>

      {/* Message */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          {...register('message')}
          rows={6}
          placeholder="Please provide details about your feedback..."
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
        />
        <div className="flex justify-between text-xs">
          <div>
            {errors.message && (
              <p className="text-red-600 dark:text-red-400">{errors.message.message}</p>
            )}
          </div>
          <p className="text-gray-500 dark:text-gray-400">
            {watchMessage.length}/2000
          </p>
        </div>
      </div>

      {/* Rating (Optional) */}
      <RatingInput
        value={watch('rating') || 0}
        onChange={(rating) => setValue('rating', rating)}
        label="Overall Rating (Optional)"
        size="md"
      />

      {/* Email (for anonymous users) */}
      {(!user || watchIsAnonymous) && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            {...register('email')}
            type="email"
            placeholder="your.email@example.com"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
          {errors.email && (
            <p className="text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
          )}
        </div>
      )}

      {/* File Upload */}
      <FileUpload
        files={files}
        onChange={setFiles}
        error={errors.attachments?.message}
      />

      {/* Anonymous Option (for logged in users) */}
      {user && (
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            {...register('isAnonymous')}
            type="checkbox"
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Submit anonymously
          </span>
        </label>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3"
      >
        {isSubmitting ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
            Submitting...
          </>
        ) : (
          <>
            <Send className="w-5 h-5 mr-2" />
            Submit Feedback
          </>
        )}
      </Button>
    </form>
  )
}

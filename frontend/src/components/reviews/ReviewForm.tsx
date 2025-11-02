'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Star, Send, CheckCircle, Edit } from 'lucide-react'
import { reviewSchema, ReviewFormData, userRoleOptions, aspectRatingLabels } from '@/lib/validations/reviews'
import { submitReview, getUserReview } from '@/lib/api/reviews'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import RatingInput from '@/components/shared/RatingInput'
import { useAuth } from '@/components/auth-provider'
import toast from 'react-hot-toast'

export default function ReviewForm() {
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [existingReview, setExistingReview] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors }
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      userRole: 'User',
      platform: 'web',
      aspectRatings: {
        features: null,
        support: null,
        easeOfUse: null,
        valueForMoney: null
      }
    }
  })

  const watchRating = watch('rating', 0)
  const watchTitle = watch('title', '')
  const watchReview = watch('review', '')

  // Check for existing review
  useEffect(() => {
    const loadExistingReview = async () => {
      if (!user) {
        setIsLoading(false)
        return
      }

      const result = await getUserReview()
      if (result.success && result.data) {
        setExistingReview(result.data)
        // Populate form with existing data
        setValue('rating', result.data.rating)
        setValue('title', result.data.title)
        setValue('review', result.data.review)
        setValue('userRole', result.data.userRole)
        if (result.data.aspectRatings) {
          setValue('aspectRatings', result.data.aspectRatings)
        }
      }
      setIsLoading(false)
    }

    loadExistingReview()
  }, [user, setValue])

  const onSubmit = async (data: ReviewFormData) => {
    if (!user) {
      toast.error('Please log in to submit a review')
      return
    }

    setIsSubmitting(true)

    try {
      const result = await submitReview(data)

      if (result.success) {
        setIsSuccess(true)
        toast.success(
          existingReview
            ? 'Review updated successfully!'
            : 'Review submitted successfully! It will be visible after admin approval.'
        )

        setTimeout(() => {
          setIsSuccess(false)
          window.location.reload()
        }, 3000)
      } else {
        toast.error(result.error || 'Failed to submit review')
      }
    } catch (error: any) {
      toast.error(error.message || 'An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!user) {
    return (
      <Card className="p-8 text-center">
        <Star className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Login Required
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Please log in to submit a review
        </p>
        <Button onClick={() => window.location.href = '/login'}>
          Log In
        </Button>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card className="p-8">
        <div className="flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </Card>
    )
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
          {existingReview ? 'Review Updated!' : 'Thank You!'}
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          {existingReview
            ? 'Your review has been updated successfully.'
            : 'Your review has been submitted and is awaiting approval.'}
        </p>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {existingReview && (
        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Edit className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900 dark:text-blue-100">
                Editing Your Review
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Status: <span className="font-medium capitalize">{existingReview.status}</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Overall Rating */}
      <RatingInput
        value={watchRating}
        onChange={(rating) => setValue('rating', rating)}
        label="Overall Rating"
        size="lg"
        required
        error={errors.rating?.message}
      />

      {/* Title */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Review Title <span className="text-red-500">*</span>
        </label>
        <input
          {...register('title')}
          type="text"
          placeholder="Sum up your experience in one line"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
        <div className="flex justify-between text-xs">
          <div>
            {errors.title && (
              <p className="text-red-600 dark:text-red-400">{errors.title.message}</p>
            )}
          </div>
          <p className="text-gray-500 dark:text-gray-400">
            {watchTitle.length}/100
          </p>
        </div>
      </div>

      {/* Review Message */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Your Review <span className="text-red-500">*</span>
        </label>
        <textarea
          {...register('review')}
          rows={6}
          placeholder="Share your experience with CareerCraft AI. What did you like? What could be improved?"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
        />
        <div className="flex justify-between text-xs">
          <div>
            {errors.review && (
              <p className="text-red-600 dark:text-red-400">{errors.review.message}</p>
            )}
          </div>
          <p className="text-gray-500 dark:text-gray-400">
            {watchReview.length}/1000
          </p>
        </div>
      </div>

      {/* User Role */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          I am a...
        </label>
        <select
          {...register('userRole')}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          {userRoleOptions.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      </div>

      {/* Aspect Ratings */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Rate Specific Aspects (Optional)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(aspectRatingLabels).map(([key, label]) => (
            <RatingInput
              key={key}
              value={watch(`aspectRatings.${key as any}`) || 0}
              onChange={(rating) => setValue(`aspectRatings.${key as any}`, rating)}
              label={label}
              size="sm"
            />
          ))}
        </div>
      </div>

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
            {existingReview ? 'Update Review' : 'Submit Review'}
          </>
        )}
      </Button>

      {!existingReview && (
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          You can only submit one review. It will be visible after admin approval.
        </p>
      )}
    </form>
  )
}

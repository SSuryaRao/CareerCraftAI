'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RatingInputProps {
  value: number
  onChange: (rating: number) => void
  maxRating?: number
  size?: 'sm' | 'md' | 'lg'
  label?: string
  error?: string
  required?: boolean
  className?: string
}

export default function RatingInput({
  value,
  onChange,
  maxRating = 5,
  size = 'md',
  label,
  error,
  required = false,
  className
}: RatingInputProps) {
  const [hoverRating, setHoverRating] = useState(0)

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  }

  const displayRating = hoverRating || value

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="flex items-center gap-1">
        {Array.from({ length: maxRating }, (_, index) => {
          const starValue = index + 1
          const isFilled = starValue <= displayRating
          const isSelected = starValue <= value

          return (
            <button
              key={index}
              type="button"
              onClick={() => onChange(starValue)}
              onMouseEnter={() => setHoverRating(starValue)}
              onMouseLeave={() => setHoverRating(0)}
              className={cn(
                'transition-all duration-200 hover:scale-125 cursor-pointer',
                'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full p-1'
              )}
            >
              <Star
                className={cn(
                  sizeClasses[size],
                  'transition-all duration-200',
                  isFilled
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'fill-none text-gray-300 dark:text-gray-600',
                  isSelected && !hoverRating && 'drop-shadow-lg'
                )}
              />
            </button>
          )
        })}
        {value > 0 && (
          <span className="ml-3 text-lg font-semibold text-gray-700 dark:text-gray-300">
            {value} / {maxRating}
          </span>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      {!error && value === 0 && required && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Click on the stars to rate
        </p>
      )}
    </div>
  )
}

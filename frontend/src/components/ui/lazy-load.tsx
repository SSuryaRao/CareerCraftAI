'use client'

import { useEffect, useRef, useState, ReactNode } from 'react'
import { motion } from 'framer-motion'

interface LazyLoadProps {
  children: ReactNode
  threshold?: number
  rootMargin?: string
  className?: string
  showSkeleton?: boolean
}

export function LazyLoad({
  children,
  threshold = 0.1,
  rootMargin = '100px',
  className = '',
  showSkeleton = false
}: LazyLoadProps) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      {
        threshold,
        rootMargin,
      }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [threshold, rootMargin])

  return (
    <div ref={ref} className={className}>
      {isVisible ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      ) : showSkeleton ? (
        <SkeletonLoader />
      ) : (
        <div style={{ minHeight: '400px' }} />
      )}
    </div>
  )
}

function SkeletonLoader() {
  return (
    <div className="animate-pulse space-y-4 py-20">
      <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mx-auto" />
      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2 mx-auto" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-gray-200 dark:bg-gray-800 rounded" />
        ))}
      </div>
    </div>
  )
}

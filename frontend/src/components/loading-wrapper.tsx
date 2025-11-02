'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { GlassGlowLoader } from '@/components/ui/glass-glow-loader'

export function LoadingWrapper({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false)
  const [minTimeElapsed, setMinTimeElapsed] = useState(true)
  const pathname = usePathname()

  useEffect(() => {
    // Reset loading state when pathname changes
    setIsLoading(true)
    setMinTimeElapsed(false)

    // Set minimum 1 second timer (reduced from 1.5s for better UX)
    const timer = setTimeout(() => {
      setMinTimeElapsed(true)
    }, 1000)

    // Simulate page load completion
    const loadTimer = setTimeout(() => {
      setIsLoading(false)
    }, 100)

    return () => {
      clearTimeout(timer)
      clearTimeout(loadTimer)
    }
  }, [pathname])

  // Show loading screen if loading OR if minimum time hasn't elapsed
  const shouldShowLoading = isLoading || !minTimeElapsed

  if (shouldShowLoading) {
    return (
      <GlassGlowLoader
        text="CareerCraft AI"
        subtext="Navigating to your page..."
      />
    )
  }

  return <>{children}</>
}

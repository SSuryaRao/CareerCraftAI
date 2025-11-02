'use client'

import React from 'react'

type BackgroundVariant =
  | 'transparent'
  | 'white'
  | 'gradient-purple'
  | 'gradient-pink'
  | 'gradient-career'
  | 'glass'
  | 'dark'
  | 'pattern'

interface PulsingWaveLoaderProps {
  background?: BackgroundVariant
  showText?: boolean
  text?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function PulsingWaveLoader({
  background = 'transparent',
  showText = true,
  text = 'CareerCraft AI',
  size = 'md',
  className = ''
}: PulsingWaveLoaderProps) {

  const sizeClasses = {
    sm: { height: 'h-8', barWidth: 'w-2', space: 'space-x-1', textSize: 'text-xs' },
    md: { height: 'h-16', barWidth: 'w-3', space: 'space-x-2', textSize: 'text-sm' },
    lg: { height: 'h-24', barWidth: 'w-4', space: 'space-x-3', textSize: 'text-base' }
  }

  const currentSize = sizeClasses[size]

  const backgroundClasses: Record<BackgroundVariant, string> = {
    transparent: '',
    white: 'bg-white dark:bg-gray-900',
    'gradient-purple': 'bg-gradient-to-br from-purple-50 via-white to-purple-100 dark:from-purple-950 dark:via-gray-900 dark:to-purple-900',
    'gradient-pink': 'bg-gradient-to-br from-pink-50 via-white to-pink-100 dark:from-pink-950 dark:via-gray-900 dark:to-pink-900',
    'gradient-career': 'bg-gradient-to-br from-purple-50 via-pink-50 to-white dark:from-gray-900 dark:via-purple-950 dark:to-pink-950',
    glass: 'backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 border border-purple-200/50 dark:border-purple-800/50',
    dark: 'bg-gray-900 dark:bg-black',
    pattern: 'bg-white dark:bg-gray-900 bg-pattern-dots dark:bg-pattern-dots-dark'
  }

  return (
    <div className={`flex flex-col items-center justify-center p-8 rounded-2xl ${backgroundClasses[background]} ${className}`}>
      {/* Wave Bars */}
      <div className={`flex items-end ${currentSize.space} ${currentSize.height}`}>
        <div
          className={`${currentSize.barWidth} bg-purple-600 dark:bg-purple-400 rounded-t animate-wave-pulse`}
          style={{ animationDelay: '0s' }}
        ></div>
        <div
          className={`${currentSize.barWidth} bg-purple-500 dark:bg-purple-300 rounded-t animate-wave-pulse`}
          style={{ animationDelay: '0.1s' }}
        ></div>
        <div
          className={`${currentSize.barWidth} bg-pink-600 dark:bg-pink-400 rounded-t animate-wave-pulse`}
          style={{ animationDelay: '0.2s' }}
        ></div>
        <div
          className={`${currentSize.barWidth} bg-pink-500 dark:bg-pink-300 rounded-t animate-wave-pulse`}
          style={{ animationDelay: '0.3s' }}
        ></div>
      </div>

      {/* Text */}
      {showText && (
        <div className={`mt-4 ${currentSize.textSize} font-semibold text-gray-700 dark:text-gray-300 animate-pulse`}>
          {text}
        </div>
      )}
    </div>
  )
}

// Full-screen loader variants
export function FullScreenPulsingWave({
  variant = 'default',
  text = 'Loading...'
}: {
  variant?: 'default' | 'gradient' | 'glass' | 'minimal' | 'premium'
  text?: string
}) {
  const variants = {
    default: (
      <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-900 z-50">
        <div className="text-center">
          <PulsingWaveLoader background="transparent" text="CareerCraft AI" size="lg" />
          <p className="mt-6 text-gray-600 dark:text-gray-400 animate-pulse">{text}</p>
        </div>
      </div>
    ),
    gradient: (
      <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-white dark:from-gray-900 dark:via-purple-950 dark:to-pink-950 z-50">
        <div className="text-center">
          <PulsingWaveLoader background="glass" text="CareerCraft AI" size="lg" />
          <p className="mt-6 text-gray-700 dark:text-gray-300 font-medium animate-pulse">{text}</p>
        </div>
      </div>
    ),
    glass: (
      <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-white/30 dark:bg-gray-900/30 z-50">
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-purple-200/50 dark:border-purple-800/50 p-12">
          <PulsingWaveLoader background="transparent" text="CareerCraft AI" size="lg" />
          <p className="mt-6 text-gray-600 dark:text-gray-400 text-center animate-pulse">{text}</p>
        </div>
      </div>
    ),
    minimal: (
      <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-900 z-50">
        <PulsingWaveLoader background="transparent" showText={false} size="md" />
      </div>
    ),
    premium: (
      <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-purple-900 via-pink-900 to-purple-800 dark:from-black dark:via-purple-950 dark:to-black z-50">
        <div className="text-center">
          <div className="relative">
            {/* Glowing background effect */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-40 h-40 bg-purple-500/30 dark:bg-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
            </div>

            {/* Wave loader */}
            <div className="relative">
              <PulsingWaveLoader background="transparent" showText={false} size="lg" />
            </div>
          </div>

          <h2 className="mt-8 text-3xl font-bold text-white">CareerCraft AI</h2>
          <p className="mt-3 text-purple-200 dark:text-purple-300 animate-pulse">{text}</p>
        </div>
      </div>
    )
  }

  return variants[variant]
}

// Inline loader for buttons, cards, etc.
export function InlinePulsingWave({
  size = 'sm',
  text
}: {
  size?: 'sm' | 'md'
  text?: string
}) {
  return (
    <div className="flex items-center gap-3">
      <PulsingWaveLoader
        background="transparent"
        showText={false}
        size={size}
        className="p-0"
      />
      {text && (
        <span className="text-sm text-gray-600 dark:text-gray-400">{text}</span>
      )}
    </div>
  )
}

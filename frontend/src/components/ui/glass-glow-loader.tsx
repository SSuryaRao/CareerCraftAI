'use client'

import React from 'react'

interface GlassGlowLoaderProps {
  text?: string
  subtext?: string
}

/**
 * Glass with Glow Full Screen Loader - CareerCraft AI
 *
 * A premium glass morphism loader with purple glow effect.
 * Automatically adapts to light and dark mode.
 *
 * @example
 * ```tsx
 * import { GlassGlowLoader } from '@/components/ui/glass-glow-loader'
 *
 * <GlassGlowLoader text="Loading your dashboard..." />
 * ```
 */
export function GlassGlowLoader({
  text = 'CareerCraft AI',
  subtext = 'Loading your career path...'
}: GlassGlowLoaderProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-black/20 dark:bg-black/40 z-50">
      <div className="relative">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-pink-500/30 blur-3xl rounded-3xl"></div>

        {/* Glass card */}
        <div className="relative bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-purple-300/50 dark:border-purple-700/50 p-12">
          {/* Pulsing Wave Loader */}
          <div className="flex items-end justify-center space-x-3 h-16">
            <div
              className="w-3 bg-purple-600 dark:bg-purple-400 rounded-t animate-wave-pulse"
              style={{ animationDelay: '0s' }}
            ></div>
            <div
              className="w-3 bg-purple-500 dark:bg-purple-300 rounded-t animate-wave-pulse"
              style={{ animationDelay: '0.1s' }}
            ></div>
            <div
              className="w-3 bg-pink-600 dark:bg-pink-400 rounded-t animate-wave-pulse"
              style={{ animationDelay: '0.2s' }}
            ></div>
            <div
              className="w-3 bg-pink-500 dark:bg-pink-300 rounded-t animate-wave-pulse"
              style={{ animationDelay: '0.3s' }}
            ></div>
          </div>

          {/* Text */}
          <div className="mt-6 text-center">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
              {text}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 font-medium animate-pulse">
              {subtext}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Compact version for smaller loading states
 */
export function GlassGlowLoaderCompact({
  text = 'Loading...'
}: {
  text?: string
}) {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="relative">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 blur-2xl rounded-2xl"></div>

        {/* Glass card */}
        <div className="relative bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-2xl shadow-xl border border-purple-300/50 dark:border-purple-700/50 p-6">
          {/* Pulsing Wave Loader - Small */}
          <div className="flex items-end justify-center space-x-2 h-10">
            <div
              className="w-2 bg-purple-600 dark:bg-purple-400 rounded-t animate-wave-pulse"
              style={{ animationDelay: '0s' }}
            ></div>
            <div
              className="w-2 bg-purple-500 dark:bg-purple-300 rounded-t animate-wave-pulse"
              style={{ animationDelay: '0.1s' }}
            ></div>
            <div
              className="w-2 bg-pink-600 dark:bg-pink-400 rounded-t animate-wave-pulse"
              style={{ animationDelay: '0.2s' }}
            ></div>
            <div
              className="w-2 bg-pink-500 dark:bg-pink-300 rounded-t animate-wave-pulse"
              style={{ animationDelay: '0.3s' }}
            ></div>
          </div>

          {/* Text */}
          <p className="mt-3 text-sm text-gray-700 dark:text-gray-300 font-medium text-center">
            {text}
          </p>
        </div>
      </div>
    </div>
  )
}

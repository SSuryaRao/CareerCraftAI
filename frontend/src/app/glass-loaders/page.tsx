'use client'

import React, { useState } from 'react'
import { PulsingWaveLoader } from '@/components/ui/pulsing-wave-loader'

export default function GlassLoadersPage() {
  const [darkMode, setDarkMode] = useState(false)
  const [activeLoader, setActiveLoader] = useState<number | null>(null)

  const loaders = [
    {
      id: 1,
      title: 'Classic Glass Card',
      description: 'Centered glass card with blur backdrop',
      component: (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-white/30 dark:bg-gray-900/30 z-50">
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-purple-200/50 dark:border-purple-800/50 p-12">
            <PulsingWaveLoader background="transparent" text="CareerCraft AI" size="lg" />
            <p className="mt-6 text-gray-600 dark:text-gray-400 text-center animate-pulse">Loading your career path...</p>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: 'Frosted Glass Minimal',
      description: 'Ultra-minimalist frosted glass',
      component: (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-lg bg-gradient-to-br from-white/20 via-purple-50/20 to-pink-50/20 dark:from-black/20 dark:via-purple-950/20 dark:to-pink-950/20 z-50">
          <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-2xl rounded-2xl shadow-xl border border-white/40 dark:border-gray-800/40 p-10 min-w-[320px]">
            <PulsingWaveLoader background="transparent" showText={false} size="lg" />
            <div className="mt-6 text-center">
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">CareerCraft AI</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Please wait...</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: 'Glass with Glow',
      description: 'Glass card with purple glow effect',
      component: (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-black/20 dark:bg-black/40 z-50">
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-pink-500/30 blur-3xl rounded-3xl"></div>

            {/* Glass card */}
            <div className="relative bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-purple-300/50 dark:border-purple-700/50 p-12">
              <PulsingWaveLoader background="transparent" text="CareerCraft AI" size="lg" />
              <p className="mt-6 text-gray-700 dark:text-gray-300 text-center font-medium">Preparing your dashboard...</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: 'Gradient Glass Card',
      description: 'Glass with gradient border',
      component: (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-lg bg-gradient-to-br from-purple-100/30 via-pink-100/30 to-white/30 dark:from-purple-950/30 dark:via-pink-950/30 dark:to-black/30 z-50">
          <div className="relative p-[2px] rounded-3xl bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600">
            <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-3xl p-12">
              <PulsingWaveLoader background="transparent" text="CareerCraft AI" size="lg" />
              <div className="mt-6 text-center">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                  <div className="w-2 h-2 bg-pink-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 5,
      title: 'Double Glass Layers',
      description: 'Layered glass effect with depth',
      component: (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-white/20 dark:bg-black/20 z-50">
          <div className="relative">
            {/* Outer glass layer */}
            <div className="absolute inset-0 bg-white/30 dark:bg-gray-900/30 backdrop-blur-md rounded-3xl transform scale-110 opacity-50"></div>

            {/* Inner glass layer */}
            <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-purple-200/60 dark:border-purple-800/60 p-14">
              <PulsingWaveLoader background="transparent" text="CareerCraft AI" size="lg" />
              <p className="mt-6 text-gray-600 dark:text-gray-400 text-center animate-pulse">Loading...</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 6,
      title: 'Soft Glass Bubble',
      description: 'Rounded bubble-like glass design',
      component: (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-xl bg-gradient-to-br from-purple-50/40 via-white/40 to-pink-50/40 dark:from-purple-950/40 dark:via-black/40 dark:to-pink-950/40 z-50">
          <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-2xl rounded-full shadow-2xl border border-white/50 dark:border-gray-800/50 p-16 w-96 h-96 flex flex-col items-center justify-center">
            <PulsingWaveLoader background="transparent" showText={false} size="lg" />
            <h3 className="mt-8 text-2xl font-bold text-gray-800 dark:text-gray-200">CareerCraft AI</h3>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-center">Initializing...</p>
          </div>
        </div>
      )
    },
    {
      id: 7,
      title: 'Glass with Progress',
      description: 'Glass card with progress indicator',
      component: (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-white/30 dark:bg-gray-900/30 z-50">
          <div className="bg-white/75 dark:bg-gray-900/75 backdrop-blur-xl rounded-3xl shadow-2xl border border-purple-200/50 dark:border-purple-800/50 p-12 min-w-[400px]">
            <PulsingWaveLoader background="transparent" text="CareerCraft AI" size="lg" />

            {/* Progress bar */}
            <div className="mt-8">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                <span>Loading resources...</span>
                <span>75%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full w-3/4 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 8,
      title: 'Neumorphic Glass',
      description: 'Soft shadow neumorphic style',
      component: (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-lg bg-gray-100 dark:bg-gray-900 z-50">
          <div className="bg-gray-100/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl p-12 shadow-[20px_20px_60px_#bebebe,-20px_-20px_60px_#ffffff] dark:shadow-[20px_20px_60px_#000000,-20px_-20px_60px_#1a1a1a]">
            <PulsingWaveLoader background="transparent" text="CareerCraft AI" size="lg" />
            <p className="mt-6 text-gray-600 dark:text-gray-400 text-center">Processing...</p>
          </div>
        </div>
      )
    },
    {
      id: 9,
      title: 'Glass with Animated Border',
      description: 'Glass card with rotating gradient border',
      component: (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-white/20 dark:bg-black/20 z-50">
          <div className="relative p-[3px] rounded-3xl bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 animate-spin-slow">
            <div className="bg-white/85 dark:bg-gray-900/85 backdrop-blur-xl rounded-3xl p-12">
              <PulsingWaveLoader background="transparent" text="CareerCraft AI" size="lg" />
              <p className="mt-6 text-gray-600 dark:text-gray-400 text-center">Loading...</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 10,
      title: 'Floating Glass Card',
      description: 'Glass card with floating animation',
      component: (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-lg bg-gradient-to-br from-purple-100/20 via-white/20 to-pink-100/20 dark:from-purple-950/20 dark:via-black/20 dark:to-pink-950/20 z-50">
          <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-2xl rounded-3xl shadow-2xl border border-purple-300/40 dark:border-purple-700/40 p-12 animate-float-slow">
            <PulsingWaveLoader background="transparent" text="CareerCraft AI" size="lg" />
            <p className="mt-6 text-gray-600 dark:text-gray-400 text-center">Please wait...</p>
          </div>
        </div>
      )
    },
    {
      id: 11,
      title: 'Glass with Logo Background',
      description: 'Large logo in background',
      component: (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-white/30 dark:bg-gray-900/30 z-50">
          <div className="relative bg-white/75 dark:bg-gray-900/75 backdrop-blur-xl rounded-3xl shadow-2xl border border-purple-200/50 dark:border-purple-800/50 p-12 overflow-hidden">
            {/* Background logo */}
            <div className="absolute inset-0 flex items-center justify-center opacity-5 dark:opacity-10">
              <div className="text-9xl font-bold text-purple-600">CC</div>
            </div>

            {/* Content */}
            <div className="relative z-10">
              <PulsingWaveLoader background="transparent" text="CareerCraft AI" size="lg" />
              <p className="mt-6 text-gray-600 dark:text-gray-400 text-center">Initializing your workspace...</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 12,
      title: 'Glass with Particles',
      description: 'Floating particles effect',
      component: (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-lg bg-white/20 dark:bg-black/20 z-50">
          <div className="relative">
            {/* Floating particles */}
            <div className="absolute inset-0">
              <div className="absolute top-10 left-10 w-2 h-2 bg-purple-500 rounded-full animate-ping"></div>
              <div className="absolute top-20 right-20 w-3 h-3 bg-pink-500 rounded-full animate-pulse"></div>
              <div className="absolute bottom-20 left-20 w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
              <div className="absolute bottom-10 right-10 w-3 h-3 bg-pink-400 rounded-full animate-ping"></div>
            </div>

            {/* Glass card */}
            <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl rounded-3xl shadow-2xl border border-purple-200/50 dark:border-purple-800/50 p-12">
              <PulsingWaveLoader background="transparent" text="CareerCraft AI" size="lg" />
              <p className="mt-6 text-gray-600 dark:text-gray-400 text-center">Loading...</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 13,
      title: 'Compact Glass Card',
      description: 'Smaller, compact design',
      component: (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-xl bg-gradient-to-br from-white/30 to-gray-100/30 dark:from-black/30 dark:to-gray-900/30 z-50">
          <div className="bg-white/85 dark:bg-gray-900/85 backdrop-blur-2xl rounded-2xl shadow-xl border border-purple-200/60 dark:border-purple-800/60 p-8 max-w-xs">
            <PulsingWaveLoader background="transparent" showText={false} size="md" />
            <div className="mt-4 text-center">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">CareerCraft AI</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Loading...</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 14,
      title: 'Glass with Steps',
      description: 'Loading steps indicator',
      component: (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-white/30 dark:bg-gray-900/30 z-50">
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-purple-200/50 dark:border-purple-800/50 p-12 min-w-[450px]">
            <PulsingWaveLoader background="transparent" text="CareerCraft AI" size="lg" />

            <div className="mt-8 space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">✓</div>
                <span className="text-gray-600 dark:text-gray-400">Loading configuration...</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">✓</div>
                <span className="text-gray-600 dark:text-gray-400">Fetching user data...</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-5 h-5 rounded-full border-2 border-purple-600 flex items-center justify-center">
                  <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse"></div>
                </div>
                <span className="text-gray-700 dark:text-gray-300 font-medium">Initializing dashboard...</span>
              </div>
              <div className="flex items-center gap-3 text-sm opacity-50">
                <div className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-600"></div>
                <span className="text-gray-500 dark:text-gray-500">Ready to use</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 15,
      title: 'Premium Glass',
      description: 'Luxury design with shadows',
      component: (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-2xl bg-gradient-to-br from-purple-100/40 via-pink-100/40 to-white/40 dark:from-purple-950/40 dark:via-pink-950/40 dark:to-black/40 z-50">
          <div className="relative">
            {/* Shadow layers */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 blur-2xl rounded-3xl transform scale-110"></div>

            {/* Glass card */}
            <div className="relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-2xl rounded-3xl shadow-[0_8px_32px_0_rgba(147,51,234,0.2)] dark:shadow-[0_8px_32px_0_rgba(147,51,234,0.4)] border-2 border-white/60 dark:border-gray-800/60 p-14">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  CareerCraft AI
                </h2>
              </div>

              <PulsingWaveLoader background="transparent" showText={false} size="lg" />

              <p className="mt-6 text-gray-600 dark:text-gray-400 text-center font-medium">
                Preparing your personalized experience...
              </p>
            </div>
          </div>
        </div>
      )
    }
  ]

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black transition-colors duration-300 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                Glass Full Screen Loaders
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                15 premium glass morphism designs for CareerCraft AI
              </p>
            </div>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
            </button>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loaders.map((loader) => (
              <button
                key={loader.id}
                onClick={() => setActiveLoader(loader.id)}
                className="group p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all border border-gray-200 dark:border-gray-700 text-left"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full font-semibold">
                    #{loader.id}
                  </span>
                  <div className="text-purple-600 dark:text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    Click to preview →
                  </div>
                </div>

                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">
                  {loader.title}
                </h3>

                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {loader.description}
                </p>

                <div className="mt-4 h-32 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-lg flex items-center justify-center overflow-hidden">
                  <div className="scale-50 origin-center">
                    <PulsingWaveLoader background="glass" size="md" showText={false} />
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Recommendations */}
          <div className="mt-16 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-800 rounded-2xl shadow-xl p-8 border border-purple-100 dark:border-gray-700">
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              🎯 Top Recommendations
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-700 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
                <h3 className="font-bold text-lg mb-3 text-purple-900 dark:text-purple-200">Most Professional</h3>
                <ul className="space-y-2 mb-4">
                  <li className="text-sm text-purple-700 dark:text-purple-300 flex items-center">
                    <span className="w-1.5 h-1.5 bg-purple-600 dark:bg-purple-400 rounded-full mr-2"></span>
                    #15 - Premium Glass
                  </li>
                  <li className="text-sm text-purple-700 dark:text-purple-300 flex items-center">
                    <span className="w-1.5 h-1.5 bg-purple-600 dark:bg-purple-400 rounded-full mr-2"></span>
                    #3 - Glass with Glow
                  </li>
                  <li className="text-sm text-purple-700 dark:text-purple-300 flex items-center">
                    <span className="w-1.5 h-1.5 bg-purple-600 dark:bg-purple-400 rounded-full mr-2"></span>
                    #14 - Glass with Steps
                  </li>
                </ul>
                <p className="text-xs text-gray-600 dark:text-gray-400 italic">
                  Polished, premium feel for main app loading
                </p>
              </div>

              <div className="bg-white dark:bg-gray-700 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
                <h3 className="font-bold text-lg mb-3 text-purple-900 dark:text-purple-200">Most Eye-Catching</h3>
                <ul className="space-y-2 mb-4">
                  <li className="text-sm text-purple-700 dark:text-purple-300 flex items-center">
                    <span className="w-1.5 h-1.5 bg-purple-600 dark:bg-purple-400 rounded-full mr-2"></span>
                    #9 - Animated Border
                  </li>
                  <li className="text-sm text-purple-700 dark:text-purple-300 flex items-center">
                    <span className="w-1.5 h-1.5 bg-purple-600 dark:bg-purple-400 rounded-full mr-2"></span>
                    #12 - Glass with Particles
                  </li>
                  <li className="text-sm text-purple-700 dark:text-purple-300 flex items-center">
                    <span className="w-1.5 h-1.5 bg-purple-600 dark:bg-purple-400 rounded-full mr-2"></span>
                    #4 - Gradient Border
                  </li>
                </ul>
                <p className="text-xs text-gray-600 dark:text-gray-400 italic">
                  Dynamic animations that grab attention
                </p>
              </div>

              <div className="bg-white dark:bg-gray-700 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
                <h3 className="font-bold text-lg mb-3 text-purple-900 dark:text-purple-200">Best UX</h3>
                <ul className="space-y-2 mb-4">
                  <li className="text-sm text-purple-700 dark:text-purple-300 flex items-center">
                    <span className="w-1.5 h-1.5 bg-purple-600 dark:bg-purple-400 rounded-full mr-2"></span>
                    #7 - Glass with Progress
                  </li>
                  <li className="text-sm text-purple-700 dark:text-purple-300 flex items-center">
                    <span className="w-1.5 h-1.5 bg-purple-600 dark:bg-purple-400 rounded-full mr-2"></span>
                    #13 - Compact Glass
                  </li>
                  <li className="text-sm text-purple-700 dark:text-purple-300 flex items-center">
                    <span className="w-1.5 h-1.5 bg-purple-600 dark:bg-purple-400 rounded-full mr-2"></span>
                    #2 - Frosted Minimal
                  </li>
                </ul>
                <p className="text-xs text-gray-600 dark:text-gray-400 italic">
                  Clean, informative, user-friendly designs
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Screen Preview */}
      {activeLoader && (
        <div onClick={() => setActiveLoader(null)} className="cursor-pointer">
          {loaders.find(l => l.id === activeLoader)?.component}
        </div>
      )}
    </div>
  )
}

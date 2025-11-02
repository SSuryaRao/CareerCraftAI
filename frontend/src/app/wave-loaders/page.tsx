'use client'

import React, { useState } from 'react'

export default function WaveLoadersPage() {
  const [darkMode, setDarkMode] = useState(false)

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header with Dark Mode Toggle */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                Wave Bar Loaders
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Beautiful wave animations for CareerCraft AI
              </p>
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

            {/* Wave 1: Classic Wave Bars */}
            <WaveCard title="Classic Wave Bars" number={1}>
              <div className="flex items-end space-x-2 h-16">
                <div className="w-3 bg-gradient-to-t from-purple-600 to-purple-400 dark:from-purple-400 dark:to-purple-300 rounded-t animate-wave" style={{ animationDelay: '0s' }}></div>
                <div className="w-3 bg-gradient-to-t from-purple-500 to-purple-300 dark:from-purple-300 dark:to-purple-200 rounded-t animate-wave" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-3 bg-gradient-to-t from-pink-600 to-pink-400 dark:from-pink-400 dark:to-pink-300 rounded-t animate-wave" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-3 bg-gradient-to-t from-pink-500 to-pink-300 dark:from-pink-300 dark:to-pink-200 rounded-t animate-wave" style={{ animationDelay: '0.3s' }}></div>
                <div className="w-3 bg-gradient-to-t from-purple-400 to-purple-200 dark:from-purple-300 dark:to-purple-100 rounded-t animate-wave" style={{ animationDelay: '0.4s' }}></div>
              </div>
              <div className="mt-4 text-sm font-semibold text-gray-700 dark:text-gray-300">CareerCraft AI</div>
            </WaveCard>

            {/* Wave 2: Thick Wave Bars */}
            <WaveCard title="Thick Wave Bars" number={2}>
              <div className="flex items-end space-x-3 h-16">
                <div className="w-5 bg-purple-600 dark:bg-purple-400 rounded-t-lg animate-wave-slow" style={{ animationDelay: '0s' }}></div>
                <div className="w-5 bg-purple-500 dark:bg-purple-300 rounded-t-lg animate-wave-slow" style={{ animationDelay: '0.15s' }}></div>
                <div className="w-5 bg-pink-600 dark:bg-pink-400 rounded-t-lg animate-wave-slow" style={{ animationDelay: '0.3s' }}></div>
                <div className="w-5 bg-pink-500 dark:bg-pink-300 rounded-t-lg animate-wave-slow" style={{ animationDelay: '0.45s' }}></div>
              </div>
              <div className="mt-4 text-xs font-semibold text-gray-700 dark:text-gray-300">Loading...</div>
            </WaveCard>

            {/* Wave 3: Thin Elegant Bars */}
            <WaveCard title="Thin Elegant Bars" number={3}>
              <div className="flex items-end space-x-1.5 h-16">
                {[...Array(7)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-1.5 rounded-t ${
                      i % 2 === 0
                        ? 'bg-purple-600 dark:bg-purple-400'
                        : 'bg-pink-600 dark:bg-pink-400'
                    } animate-wave-fast`}
                    style={{ animationDelay: `${i * 0.1}s` }}
                  ></div>
                ))}
              </div>
              <div className="mt-4 text-xs font-semibold text-gray-700 dark:text-gray-300">CC AI</div>
            </WaveCard>

            {/* Wave 4: Rainbow Wave */}
            <WaveCard title="Rainbow Wave" number={4}>
              <div className="flex items-end space-x-2 h-16">
                <div className="w-3 bg-purple-600 dark:bg-purple-400 rounded-t animate-wave" style={{ animationDelay: '0s' }}></div>
                <div className="w-3 bg-purple-500 dark:bg-purple-300 rounded-t animate-wave" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-3 bg-indigo-600 dark:bg-indigo-400 rounded-t animate-wave" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-3 bg-pink-600 dark:bg-pink-400 rounded-t animate-wave" style={{ animationDelay: '0.3s' }}></div>
                <div className="w-3 bg-pink-500 dark:bg-pink-300 rounded-t animate-wave" style={{ animationDelay: '0.4s' }}></div>
                <div className="w-3 bg-purple-400 dark:bg-purple-200 rounded-t animate-wave" style={{ animationDelay: '0.5s' }}></div>
              </div>
              <div className="mt-4 text-sm font-semibold text-gray-700 dark:text-gray-300">CareerCraft</div>
            </WaveCard>

            {/* Wave 5: Glowing Wave Bars */}
            <WaveCard title="Glowing Wave Bars" number={5}>
              <div className="flex items-end space-x-2 h-16">
                <div className="w-3 bg-purple-600 dark:bg-purple-400 rounded-t animate-wave shadow-lg shadow-purple-500/50 dark:shadow-purple-400/50" style={{ animationDelay: '0s' }}></div>
                <div className="w-3 bg-purple-500 dark:bg-purple-300 rounded-t animate-wave shadow-lg shadow-purple-400/50 dark:shadow-purple-300/50" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-3 bg-pink-600 dark:bg-pink-400 rounded-t animate-wave shadow-lg shadow-pink-500/50 dark:shadow-pink-400/50" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-3 bg-pink-500 dark:bg-pink-300 rounded-t animate-wave shadow-lg shadow-pink-400/50 dark:shadow-pink-300/50" style={{ animationDelay: '0.3s' }}></div>
              </div>
              <div className="mt-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Processing</div>
            </WaveCard>

            {/* Wave 6: Square Wave */}
            <WaveCard title="Square Wave" number={6}>
              <div className="flex items-end space-x-2 h-16">
                <div className="w-4 bg-purple-600 dark:bg-purple-400 animate-wave-square" style={{ animationDelay: '0s' }}></div>
                <div className="w-4 bg-purple-500 dark:bg-purple-300 animate-wave-square" style={{ animationDelay: '0.15s' }}></div>
                <div className="w-4 bg-pink-600 dark:bg-pink-400 animate-wave-square" style={{ animationDelay: '0.3s' }}></div>
                <div className="w-4 bg-pink-500 dark:bg-pink-300 animate-wave-square" style={{ animationDelay: '0.45s' }}></div>
              </div>
              <div className="mt-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Loading</div>
            </WaveCard>

            {/* Wave 7: Mirrored Wave */}
            <WaveCard title="Mirrored Wave" number={7}>
              <div className="flex items-center space-x-2 h-16">
                <div className="w-3 bg-purple-600 dark:bg-purple-400 rounded animate-wave-mirror" style={{ animationDelay: '0s' }}></div>
                <div className="w-3 bg-purple-500 dark:bg-purple-300 rounded animate-wave-mirror" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-3 bg-pink-600 dark:bg-pink-400 rounded animate-wave-mirror" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-3 bg-pink-500 dark:bg-pink-300 rounded animate-wave-mirror" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-3 bg-purple-400 dark:bg-purple-200 rounded animate-wave-mirror" style={{ animationDelay: '0s' }}></div>
              </div>
            </WaveCard>

            {/* Wave 8: Circular Wave Bars */}
            <WaveCard title="Circular Wave Bars" number={8}>
              <div className="flex items-end space-x-2 h-16">
                <div className="w-2.5 bg-purple-600 dark:bg-purple-400 rounded-full animate-wave" style={{ animationDelay: '0s' }}></div>
                <div className="w-2.5 bg-purple-500 dark:bg-purple-300 rounded-full animate-wave" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2.5 bg-pink-600 dark:bg-pink-400 rounded-full animate-wave" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2.5 bg-pink-500 dark:bg-pink-300 rounded-full animate-wave" style={{ animationDelay: '0.3s' }}></div>
                <div className="w-2.5 bg-purple-400 dark:bg-purple-200 rounded-full animate-wave" style={{ animationDelay: '0.4s' }}></div>
              </div>
              <div className="mt-4 text-sm font-semibold text-gray-700 dark:text-gray-300">CareerCraft</div>
            </WaveCard>

            {/* Wave 9: Audio Spectrum Style */}
            <WaveCard title="Audio Spectrum" number={9}>
              <div className="flex items-end justify-center space-x-1 h-16">
                {[...Array(9)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 rounded-t ${
                      i < 3
                        ? 'bg-purple-600 dark:bg-purple-400'
                        : i < 6
                        ? 'bg-pink-600 dark:bg-pink-400'
                        : 'bg-purple-500 dark:bg-purple-300'
                    } animate-wave-spectrum`}
                    style={{ animationDelay: `${i * 0.05}s` }}
                  ></div>
                ))}
              </div>
              <div className="mt-4 text-xs font-semibold text-gray-700 dark:text-gray-300">Analyzing...</div>
            </WaveCard>

            {/* Wave 10: Gradient Wave Bars */}
            <WaveCard title="Gradient Wave Bars" number={10}>
              <div className="flex items-end space-x-2 h-16">
                <div className="w-3 bg-gradient-to-t from-purple-600 via-purple-400 to-pink-400 dark:from-purple-400 dark:via-purple-300 dark:to-pink-300 rounded-t animate-wave" style={{ animationDelay: '0s' }}></div>
                <div className="w-3 bg-gradient-to-t from-purple-500 via-pink-400 to-pink-500 dark:from-purple-300 dark:via-pink-300 dark:to-pink-400 rounded-t animate-wave" style={{ animationDelay: '0.12s' }}></div>
                <div className="w-3 bg-gradient-to-t from-pink-600 via-pink-400 to-purple-400 dark:from-pink-400 dark:via-pink-300 dark:to-purple-300 rounded-t animate-wave" style={{ animationDelay: '0.24s' }}></div>
                <div className="w-3 bg-gradient-to-t from-pink-500 via-purple-400 to-purple-500 dark:from-pink-300 dark:via-purple-300 dark:to-purple-400 rounded-t animate-wave" style={{ animationDelay: '0.36s' }}></div>
              </div>
              <div className="mt-4 text-sm font-semibold text-gray-700 dark:text-gray-300">CareerCraft AI</div>
            </WaveCard>

            {/* Wave 11: Neon Wave */}
            <WaveCard title="Neon Wave Bars" number={11}>
              <div className="flex items-end space-x-2.5 h-16">
                <div className="w-3 bg-purple-500 dark:bg-purple-300 rounded-t animate-wave shadow-[0_0_10px_rgba(147,51,234,0.7)] dark:shadow-[0_0_10px_rgba(196,181,253,0.7)]" style={{ animationDelay: '0s' }}></div>
                <div className="w-3 bg-pink-500 dark:bg-pink-300 rounded-t animate-wave shadow-[0_0_10px_rgba(236,72,153,0.7)] dark:shadow-[0_0_10px_rgba(249,168,212,0.7)]" style={{ animationDelay: '0.15s' }}></div>
                <div className="w-3 bg-purple-600 dark:bg-purple-400 rounded-t animate-wave shadow-[0_0_10px_rgba(147,51,234,0.7)] dark:shadow-[0_0_10px_rgba(196,181,253,0.7)]" style={{ animationDelay: '0.3s' }}></div>
                <div className="w-3 bg-pink-600 dark:bg-pink-400 rounded-t animate-wave shadow-[0_0_10px_rgba(236,72,153,0.7)] dark:shadow-[0_0_10px_rgba(249,168,212,0.7)]" style={{ animationDelay: '0.45s' }}></div>
              </div>
              <div className="mt-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Processing</div>
            </WaveCard>

            {/* Wave 12: Mini Wave */}
            <WaveCard title="Mini Wave Bars" number={12}>
              <div className="flex items-end space-x-1 h-12">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-1 rounded-t ${
                      i % 3 === 0
                        ? 'bg-purple-600 dark:bg-purple-400'
                        : i % 3 === 1
                        ? 'bg-pink-600 dark:bg-pink-400'
                        : 'bg-purple-500 dark:bg-purple-300'
                    } animate-wave-fast`}
                    style={{ animationDelay: `${i * 0.05}s` }}
                  ></div>
                ))}
              </div>
              <div className="mt-4 text-xs font-semibold text-gray-700 dark:text-gray-300">Loading...</div>
            </WaveCard>

            {/* Wave 13: Pulsing Wave */}
            <WaveCard title="Pulsing Wave Bars" number={13}>
              <div className="flex items-end space-x-2 h-16">
                <div className="w-3 bg-purple-600 dark:bg-purple-400 rounded-t animate-wave-pulse" style={{ animationDelay: '0s' }}></div>
                <div className="w-3 bg-purple-500 dark:bg-purple-300 rounded-t animate-wave-pulse" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-3 bg-pink-600 dark:bg-pink-400 rounded-t animate-wave-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-3 bg-pink-500 dark:bg-pink-300 rounded-t animate-wave-pulse" style={{ animationDelay: '0.3s' }}></div>
              </div>
              <div className="mt-4 text-sm font-semibold text-gray-700 dark:text-gray-300">CareerCraft</div>
            </WaveCard>

            {/* Wave 14: Asymmetric Wave */}
            <WaveCard title="Asymmetric Wave" number={14}>
              <div className="flex items-end space-x-2 h-16">
                <div className="w-2 bg-purple-600 dark:bg-purple-400 rounded-t animate-wave" style={{ animationDelay: '0s' }}></div>
                <div className="w-3 bg-purple-500 dark:bg-purple-300 rounded-t animate-wave" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-4 bg-pink-600 dark:bg-pink-400 rounded-t animate-wave" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-3 bg-pink-500 dark:bg-pink-300 rounded-t animate-wave" style={{ animationDelay: '0.3s' }}></div>
                <div className="w-2 bg-purple-400 dark:bg-purple-200 rounded-t animate-wave" style={{ animationDelay: '0.4s' }}></div>
              </div>
              <div className="mt-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Loading</div>
            </WaveCard>

            {/* Wave 15: Double Wave */}
            <WaveCard title="Double Wave Stack" number={15}>
              <div className="space-y-2">
                <div className="flex items-end space-x-2 h-12">
                  <div className="w-2 bg-purple-600 dark:bg-purple-400 rounded-t animate-wave" style={{ animationDelay: '0s' }}></div>
                  <div className="w-2 bg-purple-500 dark:bg-purple-300 rounded-t animate-wave" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 bg-pink-600 dark:bg-pink-400 rounded-t animate-wave" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 bg-pink-500 dark:bg-pink-300 rounded-t animate-wave" style={{ animationDelay: '0.3s' }}></div>
                </div>
                <div className="flex items-end space-x-2 h-12">
                  <div className="w-2 bg-purple-400 dark:bg-purple-200 rounded-t animate-wave" style={{ animationDelay: '0.3s' }}></div>
                  <div className="w-2 bg-pink-400 dark:bg-pink-200 rounded-t animate-wave" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 bg-purple-300 dark:bg-purple-100 rounded-t animate-wave" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 bg-pink-300 dark:bg-pink-100 rounded-t animate-wave" style={{ animationDelay: '0s' }}></div>
                </div>
              </div>
              <div className="mt-2 text-xs font-semibold text-gray-700 dark:text-gray-300">CC AI</div>
            </WaveCard>

            {/* Wave 16: Wide Wave Bars */}
            <WaveCard title="Wide Wave Bars" number={16}>
              <div className="flex items-end space-x-4 h-16">
                <div className="w-6 bg-gradient-to-t from-purple-600 to-purple-400 dark:from-purple-400 dark:to-purple-300 rounded-t-xl animate-wave-slow" style={{ animationDelay: '0s' }}></div>
                <div className="w-6 bg-gradient-to-t from-pink-600 to-pink-400 dark:from-pink-400 dark:to-pink-300 rounded-t-xl animate-wave-slow" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-6 bg-gradient-to-t from-purple-500 to-purple-300 dark:from-purple-300 dark:to-purple-200 rounded-t-xl animate-wave-slow" style={{ animationDelay: '0.4s' }}></div>
              </div>
              <div className="mt-4 text-sm font-semibold text-gray-700 dark:text-gray-300">CareerCraft</div>
            </WaveCard>

            {/* Wave 17: Minimal Wave */}
            <WaveCard title="Minimal Wave" number={17}>
              <div className="flex items-end space-x-3 h-16">
                <div className="w-1 bg-purple-600 dark:bg-purple-400 rounded-t animate-wave-minimal" style={{ animationDelay: '0s' }}></div>
                <div className="w-1 bg-purple-500 dark:bg-purple-300 rounded-t animate-wave-minimal" style={{ animationDelay: '0.15s' }}></div>
                <div className="w-1 bg-pink-600 dark:bg-pink-400 rounded-t animate-wave-minimal" style={{ animationDelay: '0.3s' }}></div>
              </div>
              <div className="mt-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Loading</div>
            </WaveCard>

            {/* Wave 18: Extreme Wave */}
            <WaveCard title="Extreme Wave" number={18}>
              <div className="flex items-end space-x-1.5 h-20">
                <div className="w-2.5 bg-purple-600 dark:bg-purple-400 rounded-t animate-wave-extreme" style={{ animationDelay: '0s' }}></div>
                <div className="w-2.5 bg-purple-500 dark:bg-purple-300 rounded-t animate-wave-extreme" style={{ animationDelay: '0.08s' }}></div>
                <div className="w-2.5 bg-pink-600 dark:bg-pink-400 rounded-t animate-wave-extreme" style={{ animationDelay: '0.16s' }}></div>
                <div className="w-2.5 bg-pink-500 dark:bg-pink-300 rounded-t animate-wave-extreme" style={{ animationDelay: '0.24s' }}></div>
                <div className="w-2.5 bg-purple-400 dark:bg-purple-200 rounded-t animate-wave-extreme" style={{ animationDelay: '0.32s' }}></div>
              </div>
              <div className="mt-2 text-xs font-semibold text-gray-700 dark:text-gray-300">Loading...</div>
            </WaveCard>

          </div>

          {/* Recommendations */}
          <div className="mt-16 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-800 rounded-2xl shadow-xl p-8 border border-purple-100 dark:border-gray-700">
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              🎯 Top Recommendations
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              <RecommendationCard
                title="Most Professional"
                loaders={["#10 - Gradient Wave", "#5 - Glowing Wave", "#1 - Classic Wave"]}
                reason="Clean, polished, perfect for main loading screens"
                darkMode={darkMode}
              />
              <RecommendationCard
                title="Most Eye-Catching"
                loaders={["#11 - Neon Wave", "#9 - Audio Spectrum", "#18 - Extreme Wave"]}
                reason="Dynamic and engaging, great for user attention"
                darkMode={darkMode}
              />
              <RecommendationCard
                title="Best Performance"
                loaders={["#17 - Minimal Wave", "#3 - Thin Elegant", "#12 - Mini Wave"]}
                reason="Lightweight animations, smooth on all devices"
                darkMode={darkMode}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function WaveCard({ title, number, children }: { title: string; number: number; children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">{title}</h3>
        <span className="text-xs bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full font-semibold">
          #{number}
        </span>
      </div>
      <div className="flex flex-col items-center justify-center min-h-32 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-lg">
        {children}
      </div>
    </div>
  )
}

function RecommendationCard({
  title,
  loaders,
  reason,
  darkMode
}: {
  title: string
  loaders: string[]
  reason: string
  darkMode: boolean
}) {
  return (
    <div className="bg-white dark:bg-gray-700 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
      <h3 className="font-bold text-lg mb-3 text-purple-900 dark:text-purple-200">{title}</h3>
      <ul className="space-y-2 mb-4">
        {loaders.map((loader, i) => (
          <li key={i} className="text-sm text-purple-700 dark:text-purple-300 flex items-center">
            <span className="w-1.5 h-1.5 bg-purple-600 dark:bg-purple-400 rounded-full mr-2"></span>
            {loader}
          </li>
        ))}
      </ul>
      <p className="text-xs text-gray-600 dark:text-gray-400 italic">{reason}</p>
    </div>
  )
}

'use client'

import React, { useState } from 'react'
import { GlassGlowLoader, GlassGlowLoaderCompact } from '@/components/ui/glass-glow-loader'

export default function FinalLoaderPage() {
  const [showFullScreen, setShowFullScreen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black transition-colors duration-300 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                Final Loader - Glass with Glow ✨
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Your official CareerCraft AI loading animation
              </p>
            </div>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
            </button>
          </div>

          {/* Preview Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">
              🎬 Full Screen Preview
            </h2>

            <button
              onClick={() => setShowFullScreen(true)}
              className="w-full p-12 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 rounded-xl border-2 border-dashed border-purple-300 dark:border-purple-700 hover:border-purple-500 dark:hover:border-purple-500 transition-all group"
            >
              <div className="text-center">
                <div className="text-6xl mb-4">🖱️</div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                  Click to Preview Full Screen Loader
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  See how it looks in your app
                </p>
                <div className="mt-4 text-purple-600 dark:text-purple-400 font-semibold group-hover:scale-110 transition-transform">
                  Launch Preview →
                </div>
              </div>
            </button>
          </div>

          {/* Compact Version */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">
              📦 Compact Version
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Use this for smaller loading states like cards, modals, or sections
            </p>

            <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-xl p-4">
              <GlassGlowLoaderCompact text="Loading data..." />
            </div>
          </div>

          {/* Usage Examples */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">
              💻 Usage Examples
            </h2>

            <div className="space-y-6">
              {/* Example 1 */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm">1</span>
                  Full Screen Loader (Main App Loading)
                </h3>
                <pre className="bg-gray-900 dark:bg-black text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{`import { GlassGlowLoader } from '@/components/ui/glass-glow-loader'

export default function App() {
  const [loading, setLoading] = useState(true)

  if (loading) {
    return <GlassGlowLoader text="CareerCraft AI" subtext="Loading your dashboard..." />
  }

  return <YourApp />
}`}</code>
                </pre>
              </div>

              {/* Example 2 */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm">2</span>
                  Custom Loading Messages
                </h3>
                <pre className="bg-gray-900 dark:bg-black text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{`// For different contexts
<GlassGlowLoader
  text="Analyzing Your Profile"
  subtext="This may take a few moments..."
/>

<GlassGlowLoader
  text="Preparing Interview"
  subtext="Setting up your AI mentor..."
/>

<GlassGlowLoader
  text="Generating Resources"
  subtext="Creating personalized content..."
/>`}</code>
                </pre>
              </div>

              {/* Example 3 */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm">3</span>
                  Compact Version (Cards, Modals, Sections)
                </h3>
                <pre className="bg-gray-900 dark:bg-black text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{`import { GlassGlowLoaderCompact } from '@/components/ui/glass-glow-loader'

// In a card
<div className="card">
  {loading ? (
    <GlassGlowLoaderCompact text="Loading profile..." />
  ) : (
    <ProfileContent />
  )}
</div>

// In a modal
<Modal>
  <GlassGlowLoaderCompact text="Processing..." />
</Modal>`}</code>
                </pre>
              </div>

              {/* Example 4 */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm">4</span>
                  With React Suspense
                </h3>
                <pre className="bg-gray-900 dark:bg-black text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{`import { Suspense } from 'react'
import { GlassGlowLoader } from '@/components/ui/glass-glow-loader'

export default function Page() {
  return (
    <Suspense fallback={<GlassGlowLoader />}>
      <YourAsyncComponent />
    </Suspense>
  )
}`}</code>
                </pre>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-800 rounded-2xl shadow-xl p-8 border border-purple-100 dark:border-gray-700">
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              ✨ Features
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-600 text-white rounded-lg flex items-center justify-center flex-shrink-0">
                  ✓
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">
                    Auto Dark Mode Support
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Automatically adapts to light and dark mode
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-600 text-white rounded-lg flex items-center justify-center flex-shrink-0">
                  ✓
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">
                    Purple Glow Effect
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Signature purple/pink brand glow
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-600 text-white rounded-lg flex items-center justify-center flex-shrink-0">
                  ✓
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">
                    Glass Morphism
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Modern frosted glass design
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-600 text-white rounded-lg flex items-center justify-center flex-shrink-0">
                  ✓
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">
                    Pulsing Wave Animation
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Smooth, branded wave bars
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-600 text-white rounded-lg flex items-center justify-center flex-shrink-0">
                  ✓
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">
                    Customizable Text
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Easy to customize messages
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-600 text-white rounded-lg flex items-center justify-center flex-shrink-0">
                  ✓
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">
                    Two Sizes
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Full-screen and compact versions
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Reference */}
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">
              📋 Quick Reference
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 font-semibold text-gray-800 dark:text-gray-200">Component</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-800 dark:text-gray-200">Use Case</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-800 dark:text-gray-200">Props</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="py-3 px-4 font-mono text-purple-600 dark:text-purple-400">GlassGlowLoader</td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">Full screen loading</td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">text, subtext</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="py-3 px-4 font-mono text-purple-600 dark:text-purple-400">GlassGlowLoaderCompact</td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">Cards, modals, sections</td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">text</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Full Screen Loader */}
      {showFullScreen && (
        <div onClick={() => setShowFullScreen(false)} className="cursor-pointer">
          <GlassGlowLoader
            text="CareerCraft AI"
            subtext="Click anywhere to close"
          />
        </div>
      )}
    </div>
  )
}

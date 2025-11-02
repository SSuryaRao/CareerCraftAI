'use client'

import React, { useState } from 'react'
import { PulsingWaveLoader, FullScreenPulsingWave, InlinePulsingWave } from '@/components/ui/pulsing-wave-loader'

export default function PulsingWaveDemoPage() {
  const [darkMode, setDarkMode] = useState(false)
  const [showFullScreen, setShowFullScreen] = useState<string | null>(null)

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black transition-colors duration-300 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                Pulsing Wave Loader - CareerCraft AI
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Dynamic backgrounds that adapt to light and dark mode
              </p>
            </div>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
            </button>
          </div>

          {/* Background Variants Grid */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">
              🎨 Background Variants
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

              {/* Transparent */}
              <VariantCard title="Transparent Background" description="No background, adapts to parent">
                <PulsingWaveLoader background="transparent" />
              </VariantCard>

              {/* White */}
              <VariantCard title="Solid White/Dark" description="Clean solid background">
                <PulsingWaveLoader background="white" />
              </VariantCard>

              {/* Gradient Purple */}
              <VariantCard title="Gradient Purple" description="Purple gradient background">
                <PulsingWaveLoader background="gradient-purple" />
              </VariantCard>

              {/* Gradient Pink */}
              <VariantCard title="Gradient Pink" description="Pink gradient background">
                <PulsingWaveLoader background="gradient-pink" />
              </VariantCard>

              {/* Gradient Career */}
              <VariantCard title="Gradient Career" description="Purple to Pink brand gradient">
                <PulsingWaveLoader background="gradient-career" />
              </VariantCard>

              {/* Glass */}
              <VariantCard title="Glass Morphism" description="Frosted glass effect">
                <PulsingWaveLoader background="glass" />
              </VariantCard>

              {/* Dark */}
              <VariantCard title="Dark Background" description="Dark/Black background">
                <PulsingWaveLoader background="dark" />
              </VariantCard>

              {/* Pattern */}
              <VariantCard title="Pattern Background" description="Dotted pattern background">
                <PulsingWaveLoader background="pattern" />
              </VariantCard>

            </div>
          </div>

          {/* Size Variants */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">
              📏 Size Variants
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              <VariantCard title="Small Size" description="Compact loader for tight spaces">
                <PulsingWaveLoader background="gradient-career" size="sm" />
              </VariantCard>

              <VariantCard title="Medium Size (Default)" description="Standard loader size">
                <PulsingWaveLoader background="gradient-career" size="md" />
              </VariantCard>

              <VariantCard title="Large Size" description="Prominent loader for main screens">
                <PulsingWaveLoader background="gradient-career" size="lg" />
              </VariantCard>

            </div>
          </div>

          {/* Customization Options */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">
              ⚙️ Customization Options
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <VariantCard title="Without Text" description="Loader only, no label">
                <PulsingWaveLoader background="gradient-career" showText={false} />
              </VariantCard>

              <VariantCard title="Custom Text" description="Personalized loading message">
                <PulsingWaveLoader background="gradient-career" text="Analyzing your career..." />
              </VariantCard>

              <VariantCard title="Small with Custom Text" description="Compact with message">
                <PulsingWaveLoader background="glass" size="sm" text="Processing..." />
              </VariantCard>

              <VariantCard title="Large with Custom Text" description="Large with message">
                <PulsingWaveLoader background="gradient-purple" size="lg" text="Please wait..." />
              </VariantCard>

            </div>
          </div>

          {/* Full Screen Variants */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">
              🖥️ Full Screen Loaders
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

              <button
                onClick={() => setShowFullScreen('default')}
                className="p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all border border-gray-200 dark:border-gray-700 text-left"
              >
                <div className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">
                  Default Full Screen
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Clean and simple full screen loader
                </p>
                <div className="text-purple-600 dark:text-purple-400 font-semibold">
                  Click to Preview →
                </div>
              </button>

              <button
                onClick={() => setShowFullScreen('gradient')}
                className="p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all border border-gray-200 dark:border-gray-700 text-left"
              >
                <div className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">
                  Gradient Full Screen
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Gradient background with glass card
                </p>
                <div className="text-purple-600 dark:text-purple-400 font-semibold">
                  Click to Preview →
                </div>
              </button>

              <button
                onClick={() => setShowFullScreen('glass')}
                className="p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all border border-gray-200 dark:border-gray-700 text-left"
              >
                <div className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">
                  Glass Full Screen
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Blurred background with glass card
                </p>
                <div className="text-purple-600 dark:text-purple-400 font-semibold">
                  Click to Preview →
                </div>
              </button>

              <button
                onClick={() => setShowFullScreen('minimal')}
                className="p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all border border-gray-200 dark:border-gray-700 text-left"
              >
                <div className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">
                  Minimal Full Screen
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Just the loader, nothing else
                </p>
                <div className="text-purple-600 dark:text-purple-400 font-semibold">
                  Click to Preview →
                </div>
              </button>

              <button
                onClick={() => setShowFullScreen('premium')}
                className="p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all border border-gray-200 dark:border-gray-700 text-left"
              >
                <div className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">
                  Premium Full Screen
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Dark gradient with glow effects
                </p>
                <div className="text-purple-600 dark:text-purple-400 font-semibold">
                  Click to Preview →
                </div>
              </button>

            </div>
          </div>

          {/* Inline Usage Examples */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">
              💼 Inline Usage Examples
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4">
                  In Buttons
                </h3>
                <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold flex items-center gap-3">
                  <InlinePulsingWave size="sm" />
                  Processing...
                </button>
              </div>

              <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4">
                  In Cards
                </h3>
                <div className="flex items-center justify-center p-8 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <InlinePulsingWave size="md" text="Loading your data..." />
                </div>
              </div>

              <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4">
                  In Lists
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <InlinePulsingWave size="sm" />
                    <span className="text-gray-700 dark:text-gray-300">Fetching results...</span>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4">
                  In Forms
                </h3>
                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg text-center">
                  <InlinePulsingWave size="sm" text="Validating..." />
                </div>
              </div>

            </div>
          </div>

          {/* Usage Code Examples */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">
              💻 Usage Examples
            </h2>

            <div className="space-y-6">
              <CodeBlock
                title="Basic Usage"
                code={`import { PulsingWaveLoader } from '@/components/ui/pulsing-wave-loader'

<PulsingWaveLoader background="gradient-career" />`}
              />

              <CodeBlock
                title="Custom Size and Text"
                code={`<PulsingWaveLoader
  background="glass"
  size="lg"
  text="Analyzing your career path..."
/>`}
              />

              <CodeBlock
                title="Full Screen Loader"
                code={`import { FullScreenPulsingWave } from '@/components/ui/pulsing-wave-loader'

<FullScreenPulsingWave
  variant="premium"
  text="Loading your dashboard..."
/>`}
              />

              <CodeBlock
                title="Inline Loader"
                code={`import { InlinePulsingWave } from '@/components/ui/pulsing-wave-loader'

<button>
  <InlinePulsingWave size="sm" text="Processing..." />
</button>`}
              />
            </div>
          </div>

        </div>
      </div>

      {/* Full Screen Loader Preview */}
      {showFullScreen && (
        <div onClick={() => setShowFullScreen(null)}>
          <FullScreenPulsingWave
            variant={showFullScreen as any}
            text="Click anywhere to close"
          />
        </div>
      )}
    </div>
  )
}

function VariantCard({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="font-bold text-gray-800 dark:text-gray-200">{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
      </div>
      <div className="p-6 flex items-center justify-center min-h-[200px] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        {children}
      </div>
    </div>
  )
}

function CodeBlock({ title, code }: { title: string; code: string }) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">{title}</h3>
      <pre className="bg-gray-900 dark:bg-black text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
        <code>{code}</code>
      </pre>
    </div>
  )
}

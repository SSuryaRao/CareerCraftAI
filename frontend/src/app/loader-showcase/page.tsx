'use client'

import React from 'react'

export default function LoaderShowcasePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          CareerCraft AI Loader Animations
        </h1>
        <p className="text-center text-gray-600 mb-12">
          Choose the perfect loading animation for your application
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          {/* Loader 1: Spinning Gradient Ring */}
          <LoaderCard title="Spinning Gradient Ring" number={1}>
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-600 border-r-pink-600 animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="font-bold text-xs text-purple-600">Career</div>
                  <div className="font-bold text-xs text-pink-600">Craft</div>
                </div>
              </div>
            </div>
          </LoaderCard>

          {/* Loader 2: Pulsing Logo */}
          <LoaderCard title="Pulsing Logo" number={2}>
            <div className="text-center">
              <div className="font-bold text-2xl animate-pulse bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                CareerCraft
              </div>
              <div className="text-sm font-semibold text-purple-500 animate-pulse">AI</div>
            </div>
          </LoaderCard>

          {/* Loader 3: Bouncing Dots */}
          <LoaderCard title="Bouncing Dots" number={3}>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
              <div className="w-4 h-4 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-4 h-4 bg-pink-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
            <div className="mt-4 text-sm font-semibold text-gray-600">CareerCraft AI</div>
          </LoaderCard>

          {/* Loader 4: Orbiting Circles */}
          <LoaderCard title="Orbiting Circles" number={4}>
            <div className="relative w-24 h-24">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="font-bold text-sm text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  <div>Career</div>
                  <div>Craft</div>
                </div>
              </div>
              <div className="absolute inset-0 animate-spin">
                <div className="w-3 h-3 bg-purple-600 rounded-full absolute top-0 left-1/2 -translate-x-1/2"></div>
              </div>
              <div className="absolute inset-0 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}>
                <div className="w-3 h-3 bg-pink-600 rounded-full absolute bottom-0 left-1/2 -translate-x-1/2"></div>
              </div>
            </div>
          </LoaderCard>

          {/* Loader 5: Progress Bar */}
          <LoaderCard title="Gradient Progress Bar" number={5}>
            <div className="w-full">
              <div className="text-center mb-3 font-semibold text-sm text-gray-700">CareerCraft AI</div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full animate-loading-bar"></div>
              </div>
            </div>
          </LoaderCard>

          {/* Loader 6: Rotating Square */}
          <LoaderCard title="Rotating Square" number={6}>
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white font-bold text-xs text-center">CC<br/>AI</div>
              </div>
            </div>
          </LoaderCard>

          {/* Loader 7: Wave Animation */}
          <LoaderCard title="Wave Bars" number={7}>
            <div className="flex items-end space-x-2 h-16">
              <div className="w-2 bg-purple-600 rounded-t animate-wave" style={{ animationDelay: '0s' }}></div>
              <div className="w-2 bg-purple-500 rounded-t animate-wave" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 bg-pink-600 rounded-t animate-wave" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 bg-pink-500 rounded-t animate-wave" style={{ animationDelay: '0.3s' }}></div>
              <div className="w-2 bg-purple-400 rounded-t animate-wave" style={{ animationDelay: '0.4s' }}></div>
            </div>
            <div className="mt-4 text-sm font-semibold text-gray-600">CareerCraft AI</div>
          </LoaderCard>

          {/* Loader 8: Dual Ring */}
          <LoaderCard title="Dual Ring Spinner" number={8}>
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin"></div>
              <div className="absolute inset-2 rounded-full border-4 border-pink-200 border-t-pink-600 animate-spin" style={{ animationDirection: 'reverse' }}></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-xs font-bold text-purple-600">CC</div>
              </div>
            </div>
          </LoaderCard>

          {/* Loader 9: Glowing Pulse */}
          <LoaderCard title="Glowing Pulse" number={9}>
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 animate-pulse shadow-lg shadow-purple-500/50"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white font-bold text-center text-sm">
                  <div>Career</div>
                  <div>Craft</div>
                </div>
              </div>
            </div>
          </LoaderCard>

          {/* Loader 10: Dots Orbit */}
          <LoaderCard title="Dots Orbit" number={10}>
            <div className="relative w-24 h-24">
              {[...Array(8)].map((_, i) => {
                const angle = (i * 360) / 8
                return (
                  <div
                    key={i}
                    className="absolute inset-0 animate-spin"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    <div
                      className="w-2 h-2 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full absolute"
                      style={{
                        top: '50%',
                        left: '50%',
                        transform: `rotate(${angle}deg) translateY(-35px) translateX(-50%)`,
                      }}
                    />
                  </div>
                )
              })}
              <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-700">
                CC AI
              </div>
            </div>
          </LoaderCard>

          {/* Loader 11: Flip Card */}
          <LoaderCard title="Flip Animation" number={11}>
            <div className="relative w-20 h-20">
              <div className="w-full h-full bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg animate-flip-card flex items-center justify-center">
                <div className="text-white font-bold text-center">
                  <div>Career</div>
                  <div className="text-xs">Craft AI</div>
                </div>
              </div>
            </div>
          </LoaderCard>

          {/* Loader 12: Typing Effect */}
          <LoaderCard title="Typing Effect" number={12}>
            <div className="text-center">
              <div className="font-bold text-xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent animate-typing">
                CareerCraft AI
              </div>
              <div className="flex justify-center mt-2 space-x-1">
                <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                <div className="w-2 h-2 bg-pink-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </LoaderCard>

          {/* Loader 13: Hexagon Spinner */}
          <LoaderCard title="Hexagon Spinner" number={13}>
            <div className="relative w-20 h-20">
              <svg className="w-full h-full animate-spin" viewBox="0 0 100 100">
                <defs>
                  <linearGradient id="hexGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#9333ea" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
                <polygon
                  points="50,5 90,25 90,75 50,95 10,75 10,25"
                  fill="none"
                  stroke="url(#hexGradient)"
                  strokeWidth="4"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-purple-600">
                CC
              </div>
            </div>
          </LoaderCard>

          {/* Loader 14: Scale Pulse */}
          <LoaderCard title="Scale Pulse" number={14}>
            <div className="flex space-x-2">
              <div className="w-4 h-4 bg-purple-600 rounded-full animate-scale-pulse" style={{ animationDelay: '0s' }}></div>
              <div className="w-4 h-4 bg-purple-500 rounded-full animate-scale-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-4 h-4 bg-pink-600 rounded-full animate-scale-pulse" style={{ animationDelay: '0.4s' }}></div>
              <div className="w-4 h-4 bg-pink-500 rounded-full animate-scale-pulse" style={{ animationDelay: '0.6s' }}></div>
            </div>
            <div className="mt-4 text-sm font-semibold text-gray-600">CareerCraft AI</div>
          </LoaderCard>

          {/* Loader 15: Morphing Circle to Square */}
          <LoaderCard title="Morphing Shape" number={15}>
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 animate-morph"></div>
          </LoaderCard>

          {/* Loader 16: DNA Helix */}
          <LoaderCard title="DNA Helix" number={16}>
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-1 h-full bg-gradient-to-b from-purple-600 to-pink-600 opacity-30"></div>
              </div>
              <div className="absolute inset-0 animate-helix-1">
                <div className="w-3 h-3 bg-purple-600 rounded-full absolute top-0 left-1/2 -translate-x-1/2"></div>
              </div>
              <div className="absolute inset-0 animate-helix-2">
                <div className="w-3 h-3 bg-pink-600 rounded-full absolute top-0 left-1/2 -translate-x-1/2"></div>
              </div>
            </div>
          </LoaderCard>

          {/* Loader 17: Gradient Ring with Text */}
          <LoaderCard title="Premium Ring" number={17}>
            <div className="relative w-24 h-24">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <defs>
                  <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#9333ea" />
                    <stop offset="50%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="6"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="url(#ringGradient)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray="70 212"
                  className="animate-spin-slow origin-center"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-center">
                <div className="font-bold text-xs bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  <div>Career</div>
                  <div>Craft</div>
                </div>
              </div>
            </div>
          </LoaderCard>

          {/* Loader 18: Ripple Effect */}
          <LoaderCard title="Ripple Effect" number={18}>
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 rounded-full bg-purple-600 opacity-20 animate-ping"></div>
              <div className="absolute inset-2 rounded-full bg-pink-600 opacity-20 animate-ping" style={{ animationDelay: '0.5s' }}></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white text-xs font-bold">
                  CC
                </div>
              </div>
            </div>
          </LoaderCard>

        </div>

        {/* Recommendations Section */}
        <div className="mt-16 bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            🎯 Recommended Loaders for CareerCraft AI
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <RecommendationCard
              title="Best for Main Loading Screen"
              loaders={["#17 - Premium Ring", "#9 - Glowing Pulse", "#4 - Orbiting Circles"]}
              reason="Professional, eye-catching, and brand-focused"
            />
            <RecommendationCard
              title="Best for Quick Actions"
              loaders={["#1 - Spinning Gradient Ring", "#3 - Bouncing Dots", "#8 - Dual Ring"]}
              reason="Simple, clean, and doesn't distract from content"
            />
            <RecommendationCard
              title="Best for Data Loading"
              loaders={["#5 - Progress Bar", "#7 - Wave Bars", "#14 - Scale Pulse"]}
              reason="Shows progress indication, better UX"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function LoaderCard({ title, number, children }: { title: string; number: number; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
        <span className="text-xs bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-3 py-1 rounded-full font-semibold">
          #{number}
        </span>
      </div>
      <div className="flex items-center justify-center h-32 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg">
        {children}
      </div>
    </div>
  )
}

function RecommendationCard({ title, loaders, reason }: { title: string; loaders: string[]; reason: string }) {
  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
      <h3 className="font-bold text-lg mb-3 text-purple-900">{title}</h3>
      <ul className="space-y-2 mb-4">
        {loaders.map((loader, i) => (
          <li key={i} className="text-sm text-purple-700 flex items-center">
            <span className="w-1.5 h-1.5 bg-purple-600 rounded-full mr-2"></span>
            {loader}
          </li>
        ))}
      </ul>
      <p className="text-xs text-gray-600 italic">{reason}</p>
    </div>
  )
}

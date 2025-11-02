'use client'

import React from 'react'

export function LoaderThree() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="relative">
        {/* Outer rotating ring */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32 rounded-full border-4 border-transparent border-t-purple-600 border-r-pink-600 animate-spin"></div>
        </div>

        {/* Middle rotating ring - opposite direction */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-24 h-24 rounded-full border-4 border-transparent border-b-purple-400 border-l-pink-400 animate-spin-reverse"></div>
        </div>

        {/* Inner pulsing circle */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 animate-pulse"></div>
        </div>

        {/* CareerCraft AI Logo Text */}
        <div className="relative z-10 flex items-center justify-center w-32 h-32">
          <div className="text-center">
            <div className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 animate-pulse">
              <div className="text-xl leading-tight">Career</div>
              <div className="text-xl leading-tight">Craft</div>
              <div className="text-xs mt-1 opacity-80">AI</div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading text */}
      <div className="absolute bottom-1/3 left-1/2 transform -translate-x-1/2 translate-y-20">
        <p className="text-gray-600 font-medium animate-pulse">Loading...</p>
      </div>
    </div>
  )
}

export function LoaderOne() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900">
      <div className="relative">
        {/* Glowing background effect */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-40 h-40 bg-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
        </div>

        {/* Rotating gradient ring */}
        <div className="relative">
          <svg className="w-32 h-32 animate-spin" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#9333ea" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="url(#gradient1)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="70 200"
            />
          </svg>

          {/* Center logo text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="font-bold text-2xl leading-tight drop-shadow-lg">
                <span className="block">Career</span>
                <span className="block">Craft</span>
              </div>
              <div className="text-sm mt-1 opacity-90 font-semibold">AI</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function LoaderTwo() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="relative">
        {/* Animated dots around the logo */}
        <div className="absolute inset-0 flex items-center justify-center">
          {[...Array(8)].map((_, i) => {
            const angle = (i * 360) / 8
            const delay = i * 0.1
            return (
              <div
                key={i}
                className="absolute w-3 h-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full animate-ping"
                style={{
                  transform: `rotate(${angle}deg) translateY(-50px)`,
                  animationDelay: `${delay}s`,
                }}
              />
            )
          })}
        </div>

        {/* Logo text */}
        <div className="relative z-10 text-center">
          <h1 className="text-5xl font-bold mb-2">
            <span className="inline-block animate-bounce text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400" style={{ animationDelay: '0s' }}>C</span>
            <span className="inline-block animate-bounce text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400" style={{ animationDelay: '0.1s' }}>a</span>
            <span className="inline-block animate-bounce text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400" style={{ animationDelay: '0.2s' }}>r</span>
            <span className="inline-block animate-bounce text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400" style={{ animationDelay: '0.3s' }}>e</span>
            <span className="inline-block animate-bounce text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400" style={{ animationDelay: '0.4s' }}>e</span>
            <span className="inline-block animate-bounce text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400" style={{ animationDelay: '0.5s' }}>r</span>
          </h1>
          <h1 className="text-5xl font-bold mb-2">
            <span className="inline-block animate-bounce text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400" style={{ animationDelay: '0.6s' }}>C</span>
            <span className="inline-block animate-bounce text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400" style={{ animationDelay: '0.7s' }}>r</span>
            <span className="inline-block animate-bounce text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400" style={{ animationDelay: '0.8s' }}>a</span>
            <span className="inline-block animate-bounce text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400" style={{ animationDelay: '0.9s' }}>f</span>
            <span className="inline-block animate-bounce text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400" style={{ animationDelay: '1s' }}>t</span>
          </h1>
          <p className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 animate-pulse">
            AI
          </p>
        </div>

        {/* Loading bar */}
        <div className="mt-8 w-64 h-1 bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 animate-loading-bar"></div>
        </div>
      </div>
    </div>
  )
}

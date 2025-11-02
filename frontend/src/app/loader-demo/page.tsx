'use client'

import React, { useState } from 'react'
import { LoaderOne, LoaderTwo, LoaderThree } from '@/components/ui/loader'

export default function LoaderDemoPage() {
  const [activeLoader, setActiveLoader] = useState<'one' | 'two' | 'three'>('three')

  return (
    <div className="min-h-screen">
      {/* Control Panel */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-white/90 backdrop-blur-lg rounded-full shadow-2xl border border-gray-200 p-2 flex gap-2">
        <button
          onClick={() => setActiveLoader('one')}
          className={`px-6 py-2 rounded-full font-semibold transition-all ${
            activeLoader === 'one'
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Loader 1
        </button>
        <button
          onClick={() => setActiveLoader('two')}
          className={`px-6 py-2 rounded-full font-semibold transition-all ${
            activeLoader === 'two'
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Loader 2
        </button>
        <button
          onClick={() => setActiveLoader('three')}
          className={`px-6 py-2 rounded-full font-semibold transition-all ${
            activeLoader === 'three'
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Loader 3
        </button>
      </div>

      {/* Loader Display */}
      {activeLoader === 'one' && <LoaderOne />}
      {activeLoader === 'two' && <LoaderTwo />}
      {activeLoader === 'three' && <LoaderThree />}
    </div>
  )
}

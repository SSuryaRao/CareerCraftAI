'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { usePWA } from '@/hooks/usePWA'

export function InstallPWAPrompt() {
  const { isInstalled, canInstall, isIOS, install, dismissPrompt, isPromptDismissed } = usePWA()
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    // Don't show if already installed or dismissed
    if (isInstalled || isPromptDismissed || !canInstall) {
      return
    }

    // Show prompt after a delay
    const delay = isIOS ? 5000 : 3000
    const timer = setTimeout(() => {
      setShowPrompt(true)
    }, delay)

    return () => clearTimeout(timer)
  }, [isInstalled, isPromptDismissed, canInstall, isIOS])

  const handleInstall = async () => {
    await install()
    setShowPrompt(false)
    dismissPrompt()
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    dismissPrompt()
  }

  if (!showPrompt || isInstalled || !canInstall) return null

  // iOS installation prompt
  if (isIOS) {
    return (
      <div className="fixed bottom-4 left-4 right-4 md:left-4 md:right-auto md:max-w-sm bg-gradient-to-r from-purple-900/95 to-pink-900/95 backdrop-blur-xl text-white p-5 rounded-2xl shadow-2xl border border-purple-500/30 z-50 animate-in slide-in-from-bottom duration-300">
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 text-white/70 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start space-x-3 mb-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-2xl">📱</span>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-1">Install CareerCraft AI</h3>
            <p className="text-sm text-white/80">
              Add to your home screen for quick access!
            </p>
          </div>
        </div>

        <div className="bg-black/20 p-3 rounded-lg text-sm space-y-2 mb-3">
          <p className="flex items-center space-x-2">
            <span>1.</span>
            <span>Tap the share button</span>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M16 5l-1.42 1.42-1.59-1.59V16h-1.98V4.83L9.42 6.42 8 5l4-4 4 4zm4 5v11c0 1.1-.9 2-2 2H6c-1.11 0-2-.9-2-2V10c0-1.11.89-2 2-2h3v2H6v11h12V10h-3V8h3c1.1 0 2 .89 2 2z"/>
            </svg>
          </p>
          <p className="flex items-center space-x-2">
            <span>2.</span>
            <span>Select "Add to Home Screen"</span>
          </p>
        </div>

        <button
          onClick={handleDismiss}
          className="w-full bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
        >
          Got it
        </button>
      </div>
    )
  }

  // Android/Desktop installation prompt
  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-4 md:right-auto md:max-w-sm bg-gradient-to-r from-purple-900/95 to-pink-900/95 backdrop-blur-xl text-white p-5 rounded-2xl shadow-2xl border border-purple-500/30 z-50 animate-in slide-in-from-bottom duration-300">
      <button
        onClick={handleDismiss}
        className="absolute top-3 right-3 text-white/70 hover:text-white transition-colors"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="flex items-start space-x-3 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
          <span className="text-2xl">🚀</span>
        </div>
        <div>
          <h3 className="font-bold text-lg mb-1">Install CareerCraft AI</h3>
          <p className="text-sm text-white/80">
            Get quick access from your home screen and use offline!
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleInstall}
          className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-4 py-2.5 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
        >
          Install
        </button>
        <button
          onClick={handleDismiss}
          className="px-4 py-2.5 text-white/80 hover:text-white rounded-lg font-semibold transition-colors"
        >
          Later
        </button>
      </div>
    </div>
  )
}

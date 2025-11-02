'use client'

import { Download, Smartphone } from 'lucide-react'
import { usePWA } from '@/hooks/usePWA'

interface InstallPWAButtonProps {
  variant?: 'navbar' | 'dropdown' | 'mobile'
  className?: string
}

export function InstallPWAButton({ variant = 'navbar', className = '' }: InstallPWAButtonProps) {
  const { isInstalled, canInstall, isIOS, install } = usePWA()

  const handleInstall = async () => {
    // Check if iOS
    if (isIOS) {
      alert(
        'To install this app on iOS:\n\n' +
        '1. Tap the Share button (square with arrow)\n' +
        '2. Scroll down and tap "Add to Home Screen"\n' +
        '3. Tap "Add" in the top right corner'
      )
      return
    }

    // Try to install programmatically
    const installResult = await install()

    // If install didn't work (no deferredPrompt), show manual instructions
    if (!canInstall) {
      const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor)
      const isEdge = /Edg/.test(navigator.userAgent)
      const isFirefox = /Firefox/.test(navigator.userAgent)

      let message = '📱 To install CareerCraft AI:\n\n'

      if (isChrome || isEdge) {
        message += '1. Look for the install icon (⊕ or 💻) in the address bar\n'
        message += '2. Or click the menu (⋮) → "Install CareerCraft AI"\n\n'
        message += 'Note: App must be on HTTPS to install'
      } else if (isFirefox) {
        message += '1. Click the home icon with (+) in the address bar\n'
        message += '2. Select "Install"\n\n'
        message += 'Note: Make sure the app is on HTTPS'
      } else {
        message += '1. Look for an install icon in your browser\'s address bar\n'
        message += '2. Or check your browser menu for "Install" option\n\n'
        message += 'Note: App must be on HTTPS and in production mode'
      }

      alert(message)
    }
  }

  // Only hide for mobile variant - Always show for desktop navbar and dropdown
  if (variant === 'mobile' && (isInstalled || !canInstall)) {
    return null
  }

  // Navbar variant (button in navigation bar)
  if (variant === 'navbar') {
    return (
      <button
        onClick={handleInstall}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm font-medium transition-all transform hover:scale-105 shadow-lg ${className}`}
      >
        <Download className="w-4 h-4" />
        <span className="hidden lg:inline">Install App</span>
        <span className="lg:hidden">Install</span>
      </button>
    )
  }

  // Dropdown variant (menu item in profile dropdown)
  if (variant === 'dropdown') {
    return (
      <button
        onClick={handleInstall}
        className={`w-full flex items-center space-x-3 px-4 py-3 transition-colors text-left hover:bg-blue-50 dark:hover:bg-white/10 ${className}`}
      >
        <Smartphone className="w-4 h-4 text-blue-500 dark:text-blue-400" />
        <span className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white">
          Install App
        </span>
      </button>
    )
  }

  // Mobile variant (full width button in mobile menu)
  if (variant === 'mobile') {
    return (
      <button
        onClick={handleInstall}
        className={`w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium transition-all ${className}`}
      >
        <Download className="w-4 h-4" />
        <span>Install App</span>
      </button>
    )
  }

  return null
}

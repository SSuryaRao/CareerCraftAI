'use client'

import { useEffect, useState, useCallback } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

interface PWAState {
  isInstalled: boolean
  isInstallable: boolean
  isIOS: boolean
  isAndroid: boolean
  deferredPrompt: BeforeInstallPromptEvent | null
  canInstall: boolean
}

const STORAGE_KEY = 'pwa-installed-state'
const PROMPT_DISMISSED_KEY = 'pwa-prompt-dismissed'

/**
 * Robust PWA installation detection hook
 * Uses multiple methods to detect if PWA is installed:
 * 1. display-mode media query (standalone)
 * 2. navigator.standalone (iOS)
 * 3. document.referrer check
 * 4. localStorage persistence
 * 5. appinstalled event listener
 */
export function usePWA(): PWAState & {
  install: () => Promise<void>
  dismissPrompt: () => void
  isPromptDismissed: boolean
} {
  const [isInstalled, setIsInstalled] = useState(false)
  const [isInstallable, setIsInstallable] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isIOS, setIsIOS] = useState(false)
  const [isAndroid, setIsAndroid] = useState(false)
  const [isPromptDismissed, setIsPromptDismissed] = useState(false)

  /**
   * Check if PWA is installed using multiple detection methods
   */
  const checkInstallation = useCallback((): boolean => {
    // Method 1: Check display-mode media query
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches

    // Method 2: Check iOS standalone mode
    const isIOSStandalone = (navigator as any).standalone === true

    // Method 3: Check if launched from installed app (referrer check)
    const isFromPWA = document.referrer.includes('android-app://') ||
                      document.referrer.includes('ios-app://')

    // Method 4: Check minimal-ui display mode (some browsers)
    const isMinimalUI = window.matchMedia('(display-mode: minimal-ui)').matches

    // Method 5: Check fullscreen display mode
    const isFullscreen = window.matchMedia('(display-mode: fullscreen)').matches

    // Check real-time detection methods (not localStorage)
    const installedByRealTimeChecks = isStandalone || isIOSStandalone || isFromPWA || isMinimalUI || isFullscreen

    // Method 6: Check localStorage for installation state (only if real-time checks pass)
    // If real-time checks say NOT installed, clear the localStorage
    if (!installedByRealTimeChecks) {
      const storedState = localStorage.getItem(STORAGE_KEY)
      if (storedState === 'true') {
        // App was uninstalled, clear the state
        localStorage.removeItem(STORAGE_KEY)
      }
      return false
    }

    return installedByRealTimeChecks
  }, [])

  /**
   * Detect device type
   */
  const detectDevice = useCallback(() => {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera

    // iOS detection
    const iosDevice = /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream
    setIsIOS(iosDevice)

    // Android detection
    const androidDevice = /android/i.test(userAgent)
    setIsAndroid(androidDevice)
  }, [])

  /**
   * Initialize PWA detection
   */
  useEffect(() => {
    detectDevice()

    // Initial installation check
    const installed = checkInstallation()
    setIsInstalled(installed)

    // Check if prompt was dismissed
    const dismissed = localStorage.getItem(PROMPT_DISMISSED_KEY) === 'true'
    setIsPromptDismissed(dismissed)

    // Listen for beforeinstallprompt event (indicates app is installable)
    const beforeInstallHandler = (e: Event) => {
      e.preventDefault()
      const promptEvent = e as BeforeInstallPromptEvent
      setDeferredPrompt(promptEvent)
      setIsInstallable(true)
    }

    // Listen for appinstalled event (app was just installed)
    const appInstalledHandler = () => {
      setIsInstalled(true)
      setIsInstallable(false)
      setDeferredPrompt(null)

      // Persist installation state
      localStorage.setItem(STORAGE_KEY, 'true')

      console.log('PWA was installed successfully')
    }

    // Listen for display-mode changes
    const standaloneQuery = window.matchMedia('(display-mode: standalone)')
    const standaloneChangeHandler = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setIsInstalled(true)
        localStorage.setItem(STORAGE_KEY, 'true')
      } else {
        // App was uninstalled or switched back to browser mode
        setIsInstalled(false)
        localStorage.removeItem(STORAGE_KEY)
        // Reset prompt dismissal so user can install again
        localStorage.removeItem(PROMPT_DISMISSED_KEY)
        setIsPromptDismissed(false)
      }
    }

    window.addEventListener('beforeinstallprompt', beforeInstallHandler)
    window.addEventListener('appinstalled', appInstalledHandler)

    // Modern browsers
    if (standaloneQuery.addEventListener) {
      standaloneQuery.addEventListener('change', standaloneChangeHandler)
    } else {
      // Fallback for older browsers
      standaloneQuery.addListener(standaloneChangeHandler)
    }

    // For iOS, we can't detect beforeinstallprompt, but we can still show install button
    if (isIOS && !installed) {
      setIsInstallable(true)
    }

    // Periodic check for installation state (every 5 seconds)
    const intervalId = setInterval(() => {
      const currentlyInstalled = checkInstallation()
      if (currentlyInstalled !== isInstalled) {
        setIsInstalled(currentlyInstalled)
        if (currentlyInstalled) {
          localStorage.setItem(STORAGE_KEY, 'true')
        } else {
          // App was uninstalled
          localStorage.removeItem(STORAGE_KEY)
          // Reset prompt dismissal so user can install again
          localStorage.removeItem(PROMPT_DISMISSED_KEY)
          setIsPromptDismissed(false)
        }
      }
    }, 5000)

    return () => {
      window.removeEventListener('beforeinstallprompt', beforeInstallHandler)
      window.removeEventListener('appinstalled', appInstalledHandler)

      if (standaloneQuery.removeEventListener) {
        standaloneQuery.removeEventListener('change', standaloneChangeHandler)
      } else {
        standaloneQuery.removeListener(standaloneChangeHandler)
      }

      clearInterval(intervalId)
    }
  }, [checkInstallation, detectDevice, isInstalled, isIOS])

  /**
   * Install the PWA
   */
  const install = useCallback(async () => {
    if (!deferredPrompt) {
      // For iOS, we can't trigger install programmatically
      if (isIOS) {
        console.log('Installation must be done manually on iOS')
      }
      return
    }

    try {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice

      if (outcome === 'accepted') {
        setIsInstalled(true)
        setIsInstallable(false)
        localStorage.setItem(STORAGE_KEY, 'true')
      }

      setDeferredPrompt(null)
    } catch (error) {
      console.error('Error during PWA installation:', error)
    }
  }, [deferredPrompt, isIOS])

  /**
   * Dismiss the installation prompt
   */
  const dismissPrompt = useCallback(() => {
    localStorage.setItem(PROMPT_DISMISSED_KEY, 'true')
    setIsPromptDismissed(true)
  }, [])

  return {
    isInstalled,
    isInstallable,
    isIOS,
    isAndroid,
    deferredPrompt,
    canInstall: isInstallable && !isInstalled,
    install,
    dismissPrompt,
    isPromptDismissed,
  }
}

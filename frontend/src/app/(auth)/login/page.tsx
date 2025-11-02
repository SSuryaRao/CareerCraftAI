'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Mail, Lock, Chrome, ArrowRight, Sparkles, Home } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
} from 'firebase/auth'
import { auth } from '@/lib/firebase'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsMounted(true)
    
    // Check for redirect result when component mounts
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth)
        if (result) {
          toast.success('Successfully signed in!')
          router.push('/dashboard')
        }
      } catch (error: any) {
        console.error('Redirect sign-in error:', error)
        toast.error(error.message || 'Failed to complete Google sign-in')
      }
    }
    
    handleRedirectResult()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.push('/dashboard')
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    // Check if we're on the client side and component is mounted
    if (typeof window === 'undefined' || !isMounted) {
      toast.error('Google sign-in is not available yet. Please wait a moment and try again.')
      return
    }

    const provider = new GoogleAuthProvider()
    provider.addScope('email')
    provider.addScope('profile')
    
    try {
      setIsLoading(true)
      
      // Check if window.open is available at all
      if (!window.open || typeof window.open !== 'function') {
        console.log('window.open not available, using redirect method...')
        toast.loading('Redirecting to Google sign-in...')
        await signInWithRedirect(auth, provider)
        return
      }
      
      // Try popup first
      try {
        await signInWithPopup(auth, provider)
        toast.success('Successfully signed in!')
        router.push('/dashboard')
        return
      } catch (popupError: any) {
        console.error('Popup sign-in failed:', popupError)
        
        // If popup fails with window.open error or is blocked, try redirect
        if (
          popupError.message?.includes('window.open') ||
          popupError.code === 'auth/popup-blocked' ||
          popupError.code === 'auth/popup-closed-by-user' ||
          popupError.message?.includes('popup')
        ) {
          console.log('Falling back to redirect method...')
          toast.loading('Redirecting to Google sign-in...')
          await signInWithRedirect(auth, provider)
          // Note: signInWithRedirect will redirect away from this page
          return
        }
        
        // If it's not a popup-related error, re-throw it
        throw popupError
      }
    } catch (error: any) {
      console.error('Google sign-in error:', error)
      if (error.code === 'auth/popup-closed-by-user') {
        toast.error('Sign-in was cancelled')
      } else if (error.code === 'auth/popup-blocked') {
        toast.error('Popup was blocked. Redirecting to Google sign-in...')
        try {
          await signInWithRedirect(auth, provider)
          return
        } catch (redirectError) {
          toast.error('Failed to redirect to Google sign-in')
        }
      } else if (error.code === 'auth/cancelled-popup-request') {
        toast.error('Sign-in request was cancelled. Please try again.')
      } else {
        toast.error(error.message || 'Failed to sign in with Google')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" />

      {/* Animated background particles */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-pulse"
            style={{
              left: `${(i * 17) % 100}%`,
              top: `${(i * 23) % 100}%`,
              animationDelay: `${(i * 0.1) % 5}s`,
              animationDuration: `${3 + (i * 0.08)}s`,
            }}
          >
            <Sparkles className="w-2 h-2 text-white/20" />
          </div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/20">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mb-4"
            >
              <Sparkles className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-white/60">
              Sign in to continue your career journey
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-purple-400 focus:bg-white/20 transition"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-purple-400 focus:bg-white/20 transition"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-white/20 bg-white/10 text-purple-500 focus:ring-purple-500"
                />
                <span className="ml-2 text-sm text-white/60">Remember me</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-sm text-purple-300 hover:text-purple-200"
              >
                Forgot password?
              </Link>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-blue-600 transition duration-200 flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-transparent text-white/60">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleGoogleLogin}
                disabled={isLoading || !isMounted}
                className="w-full flex items-center justify-center px-4 py-3 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Chrome className="w-5 h-5 text-white" />
                )}
                <span className="ml-2 text-white">
                  {isLoading ? 'Signing in...' : 'Google'}
                </span>
              </button>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-white/60">
            Don't have an account?{' '}
            <Link
              href="/signup"
              className="text-purple-300 hover:text-purple-200 font-medium"
            >
              Sign up
            </Link>
          </p>

          <div className="mt-4 text-center">
            <Link href="/" className="inline-flex items-center text-sm text-white/60 hover:text-white transition">
              <Home className="w-4 h-4 mr-2" />
              Back to Homepage
            </Link>
          </div>

        </div>
      </motion.div>
    </div>
  )
}
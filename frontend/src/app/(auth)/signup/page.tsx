// src/app/(auth)/signup/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  User,
  Mail,
  Lock,
  Phone,
  Calendar,
  ArrowRight,
  Sparkles,
  CheckCircle,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  updateProfile,
} from 'firebase/auth'
import { auth } from '@/lib/firebase'
import toast from 'react-hot-toast'
import { apiClient } from '@/lib/api'

export default function SignupPage() {
  const [step, setStep] = useState(1)
  const [isMounted, setIsMounted] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    userType: 'student',
    birthDate: '',
    careerInterests: [] as string[],
    preferredLanguages: [] as string[],
    enableAIMentor: true,
    receiveCareerUpdates: true,
  })
  const router = useRouter()

  useEffect(() => {
    setIsMounted(true)
    
    // Check for redirect result when component mounts
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth)
        if (result) {
          // Create basic profile in MongoDB for Google signup
          await createBasicProfile()
          toast.success('Account created successfully!')
          router.push('/dashboard')
        }
      } catch (error: any) {
        console.error('Redirect sign-up error:', error)
        toast.error(error.message || 'Failed to complete Google sign-up')
      }
    }
    
    handleRedirectResult()
  }, [])

  const handleNext = () => {
    if (step < 3) setStep(step + 1)
    else handleEmailSignup()
  }

  const handleEmailSignup = async () => {
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    
    try {
      // Create Firebase user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      )

      // Update Firebase profile with display name
      if (userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName: formData.name
        })

        // Create user profile in MongoDB
        await createUserProfile()
      }

      toast.success('Account created successfully!')
      router.push('/dashboard')
    } catch (error: any) {
      console.error('Signup error:', error)
      toast.error(error.message || 'Failed to create account')
    }
  }

  const createUserProfile = async () => {
    try {
      const profileData = {
        profile: {
          phone: formData.phone,
          bio: `I am a ${formData.userType} interested in ${formData.careerInterests.join(', ')}`,
        },
        preferences: {
          interestedTags: formData.careerInterests.map(interest => interest.toLowerCase()),
          jobTypes: formData.userType === 'student' ? ['internship', 'entry'] : ['full-time'],
        },
        notifications: {
          emailAlerts: formData.receiveCareerUpdates,
          jobMatches: formData.receiveCareerUpdates,
          applicationUpdates: true,
          weeklyDigest: false
        }
      }

      const response = await apiClient.updateProfile(profileData)
      if (!response.success) {
        console.error('Failed to create user profile:', response.error)
      }
    } catch (error) {
      console.error('Error creating user profile:', error)
      // Don't fail signup if profile creation fails
    }
  }

  const handleGoogleSignup = async () => {
    // Check if we're on the client side and component is mounted
    if (typeof window === 'undefined' || !isMounted) {
      toast.error('Google sign-up is not available yet. Please wait a moment and try again.')
      return
    }

    const provider = new GoogleAuthProvider()
    provider.addScope('email')
    provider.addScope('profile')
    
    try {
      // Check if window.open is available at all
      if (!window.open || typeof window.open !== 'function') {
        console.log('window.open not available, using redirect method...')
        toast.loading('Redirecting to Google sign-up...')
        await signInWithRedirect(auth, provider)
        return
      }
      
      // Try popup first
      try {
        const result = await signInWithPopup(auth, provider)
        if (result.user) {
          // Create basic profile in MongoDB for Google signup
          await createBasicProfile()
        }
        toast.success('Account created successfully!')
        router.push('/dashboard')
        return
      } catch (popupError: any) {
        console.error('Popup sign-up failed:', popupError)
        
        // If popup fails with window.open error or is blocked, try redirect
        if (
          popupError.message?.includes('window.open') ||
          popupError.code === 'auth/popup-blocked' ||
          popupError.code === 'auth/popup-closed-by-user' ||
          popupError.message?.includes('popup')
        ) {
          console.log('Falling back to redirect method...')
          toast.loading('Redirecting to Google sign-up...')
          await signInWithRedirect(auth, provider)
          // Note: signInWithRedirect will redirect away from this page
          return
        }
        
        // If it's not a popup-related error, re-throw it
        throw popupError
      }
    } catch (error: any) {
      console.error('Google signup error:', error)
      if (error.code === 'auth/popup-closed-by-user') {
        toast.error('Sign-up was cancelled')
      } else if (error.code === 'auth/popup-blocked') {
        toast.error('Popup was blocked. Redirecting to Google sign-up...')
        try {
          await signInWithRedirect(auth, provider)
          return
        } catch (redirectError) {
          toast.error('Failed to redirect to Google sign-up')
        }
      } else if (error.code === 'auth/cancelled-popup-request') {
        toast.error('Sign-up request was cancelled. Please try again.')
      } else {
        toast.error(error.message || 'Failed to sign up with Google')
      }
    }
  }

  const createBasicProfile = async () => {
    try {
      const profileData = {
        preferences: {
          jobTypes: ['full-time'],
        },
        notifications: {
          emailAlerts: true,
          jobMatches: true,
          applicationUpdates: true,
          weeklyDigest: false
        }
      }

      const response = await apiClient.updateProfile(profileData)
      if (!response.success) {
        console.error('Failed to create basic user profile:', response.error)
      }
    } catch (error) {
      console.error('Error creating basic user profile:', error)
    }
  }

  const toggleCareerInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      careerInterests: prev.careerInterests.includes(interest)
        ? prev.careerInterests.filter(item => item !== interest)
        : [...prev.careerInterests, interest]
    }))
  }

  const toggleLanguage = (language: string) => {
    setFormData(prev => ({
      ...prev,
      preferredLanguages: prev.preferredLanguages.includes(language)
        ? prev.preferredLanguages.filter(item => item !== language)
        : [...prev.preferredLanguages, language]
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-2xl"
      >
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/20">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: step >= i ? 1 : 0.8 }}
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      step >= i
                        ? 'bg-gradient-to-r from-purple-500 to-blue-500'
                        : 'bg-white/20'
                    }`}
                  >
                    {step > i ? (
                      <CheckCircle className="w-6 h-6 text-white" />
                    ) : (
                      <span className="text-white font-semibold">{i}</span>
                    )}
                  </motion.div>
                  {i < 3 && (
                    <div
                      className={`w-full h-1 mx-2 ${
                        step > i
                          ? 'bg-gradient-to-r from-purple-500 to-blue-500'
                          : 'bg-white/20'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-sm text-white/60">
              <span>Basic Info</span>
              <span>Account Setup</span>
              <span>Preferences</span>
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Create Your Account
            </h1>
            <p className="text-white/60">
              Start your personalized career journey
            </p>
          </div>

          {/* Step 1: Basic Info */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-purple-400"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Date of Birth
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) =>
                      setFormData({ ...formData, birthDate: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-purple-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  I am a
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['Student', 'Parent', 'Professional'].map((type) => (
                    <button
                      key={type}
                      onClick={() =>
                        setFormData({
                          ...formData,
                          userType: type.toLowerCase(),
                        })
                      }
                      className={`py-3 px-4 rounded-lg border transition ${
                        formData.userType === type.toLowerCase()
                          ? 'bg-gradient-to-r from-purple-500 to-blue-500 border-transparent text-white'
                          : 'bg-white/10 border-white/20 text-white/60 hover:bg-white/20'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Account Setup */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-purple-400"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-purple-400"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-purple-400"
                      placeholder="Create password"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-purple-400"
                      placeholder="Confirm password"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Preferences */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-medium text-white/80 mb-4">
                  Career Interests
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    'Technology',
                    'Healthcare',
                    'Business',
                    'Arts',
                    'Science',
                    'Engineering',
                  ].map((interest) => (
                    <label
                      key={interest}
                      className="flex items-center space-x-3 p-3 bg-white/10 rounded-lg hover:bg-white/20 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.careerInterests.includes(interest)}
                        onChange={() => toggleCareerInterest(interest)}
                        className="w-4 h-4 rounded border-white/20 bg-white/10 text-purple-500"
                      />
                      <span className="text-white/80">{interest}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-4">
                  Preferred Languages
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    'English',
                    'Hindi',
                    'Tamil',
                    'Telugu',
                    'Bengali',
                    'Marathi',
                  ].map((lang) => (
                    <label
                      key={lang}
                      className="flex items-center space-x-2 p-2 bg-white/10 rounded-lg hover:bg-white/20 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.preferredLanguages.includes(lang)}
                        onChange={() => toggleLanguage(lang)}
                        className="w-4 h-4 rounded border-white/20 bg-white/10 text-purple-500"
                      />
                      <span className="text-white/80 text-sm">{lang}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                  <span className="text-white/80">Enable AI Mentor</span>
                  <input
                    type="checkbox"
                    checked={formData.enableAIMentor}
                    onChange={(e) => setFormData({...formData, enableAIMentor: e.target.checked})}
                    className="w-12 h-6 bg-white/20 rounded-full"
                  />
                </label>
                <label className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                  <span className="text-white/80">
                    Receive Career Updates
                  </span>
                  <input
                    type="checkbox"
                    checked={formData.receiveCareerUpdates}
                    onChange={(e) => setFormData({...formData, receiveCareerUpdates: e.target.checked})}
                    className="w-12 h-6 bg-white/20 rounded-full"
                  />
                </label>
              </div>
            </motion.div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-8 flex justify-between">
            {step > 1 && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setStep(step - 1)}
                className="px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition"
              >
                Previous
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleNext}
              className="ml-auto px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-blue-600 transition flex items-center space-x-2"
            >
              <span>{step === 3 ? 'Complete Setup' : 'Next'}</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>
          <p className="mt-6 text-center text-sm text-white/60">
            Already have an account?{' '}
            <Link
              href="/login"
              className="text-purple-300 hover:text-purple-200 font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
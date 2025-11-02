'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { LazyLoad } from '@/components/ui/lazy-load'
import Navbar from '@/components/layout/navbar'
import Hero from '@/components/sections/hero'
import Features from '@/components/sections/features'
import HowItWorks from '@/components/sections/how-it-works'
import Testimonials from '@/components/sections/testimonials'
import Stats from '@/components/sections/stats'
import CTA from '@/components/sections/cta'
import Footer from '@/components/layout/footer'
import FeaturedReviews from '@/components/reviews/FeaturedReviews'
import { ArrowRight, Sparkles, Brain, Target, Users, TrendingUp, Award, Globe, Star } from 'lucide-react'

export default function LandingPage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const handleStartJourney = () => {
    router.push('/mentor')
  }

  const handleWatchDemo = () => {
    window.open('https://youtu.be/2rb_krNQHOE', '_blank')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white dark:from-black dark:via-gray-900 dark:to-black text-gray-900 dark:text-white overflow-x-hidden">
      {/* Background Effects - Optimized */}
      <div
        className="fixed inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-50 dark:opacity-100"
        style={{ willChange: 'opacity' }}
      />
      <div className="fixed inset-0" style={{ willChange: 'transform' }}>
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-3xl" />
      </div>

      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center container-padding section-padding">
        <div className="container mx-auto max-w-7xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-200/50 dark:border-white/10 mb-8"
            >
              <Sparkles className="w-4 h-4 text-yellow-500 dark:text-yellow-400" />
              <span className="text-sm font-medium text-gray-800 dark:text-white">AI-Powered Career Guidance for Indian Students</span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="heading-responsive-lg font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 leading-tight text-center"
            >
              Your Personalized
              <br />
              Career Navigator
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-responsive text-gray-600 dark:text-gray-400 mb-8 max-w-4xl mx-auto text-center leading-relaxed"
            >
              Transform your career journey with AI-driven insights, personalized roadmaps,
              and expert mentorship tailored for the Indian job market
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center"
            >
              <Button
                size="lg"
                className="btn-responsive-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full group shadow-2xl w-full sm:w-auto"
                onClick={handleStartJourney}
              >
                Start Your Journey
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="btn-responsive-lg border-gray-300 dark:border-white/20 hover:bg-gray-100 dark:hover:bg-white/10 text-gray-900 dark:text-white rounded-full w-full sm:w-auto"
                onClick={handleWatchDemo}
              >
                Watch Demo
              </Button>
            </motion.div>

            {/* Stats Preview */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="responsive-grid-4 mt-16 sm:mt-20 lg:mt-24"
            >
              {[
                { icon: Users, label: 'Active Students', value: '50,000+' },
                { icon: Brain, label: 'Career Paths', value: '5,000+' },
                { icon: Target, label: 'Success Rate', value: '94%' },
                { icon: Globe, label: 'Languages', value: '10+' },
              ].map((stat, index) => (
                <div key={index} className="glass bg-white/40 dark:bg-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:scale-105 transition-transform text-center border border-gray-200/50 dark:border-white/20">
                  <stat.icon className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 dark:text-blue-400 mb-2 mx-auto" />
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Floating Elements - Optimized */}
          <motion.div
            animate={{
              y: [0, -20, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{ willChange: 'transform' }}
            className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-3xl opacity-50"
          />
          <motion.div
            animate={{
              y: [0, 20, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{ willChange: 'transform' }}
            className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-3xl opacity-50"
          />
        </div>
      </section>

      {/* Features Section */}
      <LazyLoad showSkeleton>
        <Features />
      </LazyLoad>

      {/* How It Works */}
      <LazyLoad showSkeleton>
        <HowItWorks />
      </LazyLoad>

      {/* Testimonials */}
      <LazyLoad showSkeleton>
        <Testimonials />
      </LazyLoad>

      {/* Stats */}
      <LazyLoad showSkeleton>
        <Stats />
      </LazyLoad>

      {/* Featured Reviews */}
      <LazyLoad>
        <section className="relative container-padding section-padding">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl mb-4">
                <Star className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Loved by Students & Professionals
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                See what our users are saying about their experience with CareerCraft AI
              </p>
            </motion.div>
            <FeaturedReviews />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center mt-8"
            >
              <Button
                variant="outline"
                onClick={() => router.push('/reviews')}
                className="group"
              >
                View All Reviews
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          </div>
        </section>
      </LazyLoad>

      {/* CTA Section */}
      <LazyLoad>
        <CTA />
      </LazyLoad>

      {/* Footer */}
      <LazyLoad>
        <Footer />
      </LazyLoad>
    </div>
  )
}
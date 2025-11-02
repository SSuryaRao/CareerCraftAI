'use client'

import { useState, useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, Play, Sparkles, Zap } from 'lucide-react'
import Link from 'next/link'

const stats = [
  { label: 'Active Students', value: '50,000+', suffix: '' },
  { label: 'Career Paths', value: '5,000', suffix: '+' },
  { label: 'Success Rate', value: '94', suffix: '%' },
  { label: 'Languages', value: '10', suffix: '+' },
]

const floatingWords = [
  'Engineering', 'Medicine', 'Design', 'Business', 'Arts', 'Technology',
  'Data Science', 'AI/ML', 'Finance', 'Marketing', 'Research', 'Teaching',
]

export default function Hero() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const controls = useAnimation()

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % floatingWords.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    controls.start({
      opacity: [0, 1, 1, 0],
      y: [20, 0, 0, -20],
      transition: { duration: 2, times: [0, 0.2, 0.8, 1] },
    })
  }, [currentWordIndex, controls])

  return (
    <section className="relative min-h-screen flex items-center justify-center container-padding section-padding overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20" />
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
              }}
              animate={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
              }}
              transition={{
                duration: Math.random() * 20 + 10,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          ))}
        </div>
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="text-center">
          {/* Announcement Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 mb-8"
          >
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium text-yellow-400">
              Launching Advanced AI Features
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <h1 className="heading-responsive-lg font-bold mb-4 text-center">
              <span className="block text-white mb-2 leading-tight">Your Career in</span>
              <span className="relative inline-block">
                <motion.span
                  key={currentWordIndex}
                  animate={controls}
                  className="absolute inset-0 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"
                >
                  {floatingWords[currentWordIndex]}
                </motion.span>
                <span className="invisible">{floatingWords[0]}</span>
              </span>
            </h1>
            <h2 className="heading-responsive font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-center">
              Starts Here
            </h2>
          </motion.div>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-responsive text-gray-400 mb-8 max-w-4xl mx-auto text-center leading-relaxed"
          >
            AI-powered career guidance designed specifically for Indian students. 
            Get personalized roadmaps, skill analysis, and mentorship.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-12"
          >
            <Link href="/signup" className="w-full sm:w-auto">
              <Button
                size="xl"
                className="btn-responsive-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full group shadow-2xl w-full"
              >
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button
              size="xl"
              variant="outline"
              className="btn-responsive-lg border-white/20 hover:bg-white/10 text-white rounded-full group w-full sm:w-auto"
            >
              <Play className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
              Watch Demo
            </Button>
          </motion.div>

          {/* Live Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="responsive-grid-4 max-w-5xl mx-auto"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl sm:rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
                <div className="relative backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1">
                    {stat.value}
                    <span className="text-blue-400">{stat.suffix}</span>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-400">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-center"
          >
            <div className="flex items-center gap-2 text-gray-400 text-sm sm:text-base">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 flex-shrink-0" />
              <span>Trusted by IITs & NITs</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400 text-sm sm:text-base">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 flex-shrink-0" />
              <span>Government Recognized</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400 text-sm sm:text-base">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 flex-shrink-0" />
              <span>Industry Partnerships</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { GlassCard } from '@/components/ui/card'
import {
  Brain,
  Target,
  Users,
  TrendingUp,
  BookOpen,
  Award,
  Globe,
  Sparkles,
  BarChart,
  MessageSquare,
  Briefcase,
  Zap,
} from 'lucide-react'

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Digital Twin',
    description: 'Create your comprehensive career profile with academic records, skills, and aspirations',
    color: 'from-blue-500 to-cyan-500',
    details: [
      'Multi-modal input support',
      'Automatic skill extraction',
      'Personality assessment',
      'Goal mapping',
    ],
  },
  {
    icon: Target,
    title: 'Career Path Engine',
    description: 'Explore 5000+ career paths with viability scores and market projections',
    color: 'from-purple-500 to-pink-500',
    details: [
      'Real-time market data',
      'Salary projections',
      'Growth forecasts',
      'Location-based insights',
    ],
  },
  {
    icon: MessageSquare,
    title: 'AI Mentor Chat',
    description: 'Get 24/7 personalized guidance in 10+ Indian languages with voice support',
    color: 'from-green-500 to-emerald-500',
    details: [
      'Natural conversations',
      'Voice interaction',
      'Emotional intelligence',
      'Context awareness',
    ],
  },
  {
    icon: TrendingUp,
    title: 'Skill Gap Analysis',
    description: 'Identify skill gaps and get personalized learning roadmaps',
    color: 'from-orange-500 to-red-500',
    details: [
      'Automated gap detection',
      'Priority ranking',
      'Time estimates',
      'Progress tracking',
    ],
  },
  {
    icon: BookOpen,
    title: 'Learning Generator',
    description: 'Access curated courses from Coursera, NPTEL, and more',
    color: 'from-indigo-500 to-blue-500',
    details: [
      'Personalized recommendations',
      'Cost optimization',
      'Schedule planning',
      'Certificate tracking',
    ],
  },
  {
    icon: Briefcase,
    title: 'Interview Suite',
    description: 'Practice with AI mock interviews and connect with industry mentors',
    color: 'from-pink-500 to-rose-500',
    details: [
      'Mock interviews',
      'Resume builder',
      'Mentor matching',
      'Feedback analysis',
    ],
  },
]

export default function Features() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section className="relative section-padding container-padding" id="features">
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-200/50 dark:border-white/10 mb-4">
            <Sparkles className="w-4 h-4 text-yellow-500 dark:text-yellow-400" />
            <span className="text-sm font-medium text-gray-800 dark:text-white">Comprehensive Career Platform</span>
          </div>
          <h2 className="heading-responsive font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 text-center">
            Everything You Need to Succeed
          </h2>
          <p className="text-responsive text-gray-600 dark:text-gray-400 max-w-4xl mx-auto text-center leading-relaxed">
            Our AI-powered platform provides end-to-end career guidance tailored for Indian students
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="responsive-grid-3">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="relative group"
            >
              <GlassCard className="p-4 sm:p-6 h-full hover:scale-105 transition-all duration-300">
                {/* Gradient Background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity rounded-xl`}
                />

                {/* Icon */}
                <div className="relative mb-4">
                  <div
                    className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${feature.color}`}
                  >
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-lg sm:text-xl font-semibold mb-2 text-center sm:text-left text-gray-900 dark:text-white">{feature.title}</h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 text-center sm:text-left leading-relaxed">{feature.description}</p>

                {/* Details (shown on hover) */}
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{
                    height: hoveredIndex === index ? 'auto' : 0,
                    opacity: hoveredIndex === index ? 1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <ul className="space-y-2">
                    {feature.details.map((detail, detailIndex) => (
                      <li
                        key={detailIndex}
                        className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300"
                      >
                        <Zap className="w-4 h-4 text-yellow-500 dark:text-yellow-400" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Interactive Demo CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-12"
        >
          <button className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium transition-all hover:scale-105">
            <BarChart className="w-5 h-5" />
            Explore Interactive Demo
          </button>
        </motion.div>
      </div>
    </section>
  )
}
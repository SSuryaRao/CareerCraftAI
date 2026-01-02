'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { GlassCard } from '@/components/ui/card'
import Link from 'next/link'
import {
  Brain,
  Target,
  FileSearch,
  FileEdit,
  Award,
  MapPin,
  Sparkles,
  BarChart,
  MessageSquare,
  Zap,
} from 'lucide-react'

const features = [
  {
    icon: Brain,
    title: 'AI Mentor',
    description: 'Get 24/7 personalized career guidance in 10+ Indian languages with voice support',
    color: 'from-blue-500 to-cyan-500',
    link: '/features/ai-mentor',
    details: [
      'Natural conversations',
      'Voice interaction',
      'Multi-language support',
      'Career guidance',
    ],
  },
  {
    icon: FileSearch,
    title: 'Resume Analyzer',
    description: 'Get AI-powered resume analysis with ATS compatibility scores and improvement tips',
    color: 'from-purple-500 to-pink-500',
    link: '/features/resume-analyzer',
    details: [
      'ATS compatibility check',
      'Skill extraction',
      'Improvement suggestions',
      'Industry benchmarking',
    ],
  },
  {
    icon: FileEdit,
    title: 'Resume Builder',
    description: 'Create professional, ATS-friendly resumes with AI-powered suggestions',
    color: 'from-green-500 to-emerald-500',
    link: '/features/resume-builder',
    details: [
      'Professional templates',
      'AI content suggestions',
      'ATS optimization',
      'Export to PDF',
    ],
  },
  {
    icon: Award,
    title: 'Scholarship Finder',
    description: 'Discover scholarships and internship opportunities tailored to your profile',
    color: 'from-orange-500 to-red-500',
    link: '/features/scholarships',
    details: [
      'Personalized matches',
      'Deadline tracking',
      'Application guidance',
      'Eligibility filters',
    ],
  },
  {
    icon: MapPin,
    title: 'Career Roadmap',
    description: 'Get personalized learning paths and skill roadmaps for your dream career',
    color: 'from-indigo-500 to-blue-500',
    link: '/solutions/roadmap',
    details: [
      'Custom learning paths',
      'Milestone tracking',
      'Progress monitoring',
      'Resource recommendations',
    ],
  },
  {
    icon: MessageSquare,
    title: 'AI Mock Interview',
    description: 'Practice interviews with AI, take aptitude tests, and get detailed feedback',
    color: 'from-pink-500 to-rose-500',
    link: '/mock-interview',
    details: [
      'AI-powered interviews',
      'Aptitude tests',
      'Instant feedback',
      'Performance analytics',
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
              <Link href={feature.link}>
                <GlassCard className="p-4 sm:p-6 h-full hover:scale-105 transition-all duration-300 cursor-pointer">
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
              </Link>
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
          <button
            onClick={() => window.open('https://youtu.be/2rb_krNQHOE', '_blank')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium transition-all hover:scale-105"
          >
            <BarChart className="w-5 h-5" />
            Explore Interactive Demo
          </button>
        </motion.div>
      </div>
    </section>
  )
}
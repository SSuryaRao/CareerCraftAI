'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { UserPlus, Brain, Target, TrendingUp, Users, Sparkles, ArrowRight, CheckCircle2, Play } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

const steps = [
  {
    icon: UserPlus,
    title: 'Create Your Digital Twin',
    description: 'Complete our intelligent onboarding to build your comprehensive career profile with AI-powered assessments.',
    step: '01',
    color: 'from-blue-500 to-purple-500',
    primaryAction: {
      label: 'Start Onboarding',
      href: '/onboarding',
      icon: Play
    },
    features: [
      { name: 'Academic profile setup', href: '/onboarding' },
      { name: 'Skills & interests assessment', href: '/onboarding' },
      { name: 'Career goals definition', href: '/onboarding' },
      { name: 'Personality evaluation', href: '/onboarding' }
    ]
  },
  {
    icon: Brain,
    title: 'AI-Powered Analysis',
    description: 'Our advanced AI analyzes your profile, resume, and career goals to provide personalized insights and recommendations.',
    step: '02',
    color: 'from-purple-500 to-pink-500',
    primaryAction: {
      label: 'Analyze Resume',
      href: '/features/resume-analyzer',
      icon: Brain
    },
    features: [
      { name: 'Resume strength analysis', href: '/features/resume-analyzer' },
      { name: 'Career path matching (50+ domains)', href: '/solutions/roadmap' },
      { name: 'Skill gap identification', href: '/features/resume-analyzer' },
      { name: 'Market insights & trends', href: '/mentor' }
    ]
  },
  {
    icon: Target,
    title: 'Get Personalized Roadmap',
    description: 'Receive a customized learning path with curated resources, milestones, and timeline to achieve your career goals.',
    step: '03',
    color: 'from-pink-500 to-orange-500',
    primaryAction: {
      label: 'Generate Roadmap',
      href: '/solutions/roadmap',
      icon: Target
    },
    features: [
      { name: 'AI-generated learning paths', href: '/solutions/roadmap' },
      { name: 'Visual milestone tracking', href: '/solutions/roadmap' },
      { name: 'Curated resources (NPTEL, Coursera)', href: '/resources' },
      { name: 'Progress analytics', href: '/dashboard' }
    ]
  },
  {
    icon: TrendingUp,
    title: 'Learn & Practice',
    description: 'Access AI mentorship, practice with mock interviews, take aptitude tests, and prepare for your dream career.',
    step: '04',
    color: 'from-orange-500 to-red-500',
    primaryAction: {
      label: 'Start Practicing',
      href: '/mock-interview',
      icon: TrendingUp
    },
    features: [
      { name: 'AI Mentor (voice & text)', href: '/mentor' },
      { name: 'Mock interviews (AI-powered)', href: '/mock-interview' },
      { name: 'Aptitude tests (Logical, Quant, Verbal)', href: '/mock-interview' },
      { name: 'Company pattern questions (200+)', href: '/mock-interview' }
    ]
  },
  {
    icon: Users,
    title: 'Track & Succeed',
    description: 'Monitor your progress, build professional resumes, find scholarships, and land your dream job with our comprehensive dashboard.',
    step: '05',
    color: 'from-red-500 to-pink-500',
    primaryAction: {
      label: 'View Dashboard',
      href: '/dashboard',
      icon: Users
    },
    features: [
      { name: 'Progress dashboard with analytics', href: '/dashboard' },
      { name: 'Professional resume builder', href: '/features/resume-builder' },
      { name: 'Scholarship finder (AI-powered)', href: '/features/scholarships' },
      { name: 'Job search & career opportunities', href: '/careers' }
    ]
  }
]

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState<number | null>(null)

  return (
    <section className="relative py-20 px-4" id="how-it-works">
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
            <span className="text-sm font-medium text-gray-800 dark:text-white">Simple 5-Step Process</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
            How CareerCraft AI Works
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            From profile creation to career success - your personalized journey in 5 interactive steps
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 transform -translate-x-1/2" />

          <div className="space-y-12 lg:space-y-24">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                onMouseEnter={() => setActiveStep(index)}
                onMouseLeave={() => setActiveStep(null)}
                className={`flex flex-col lg:flex-row items-center gap-8 ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                {/* Step Content */}
                <div className="flex-1 lg:max-w-md">
                  <Card className={`p-8 bg-white/80 dark:bg-white/10 backdrop-blur-xl border-gray-200 dark:border-white/20 transition-all duration-500 shadow-lg group ${
                    activeStep === index
                      ? 'bg-white dark:bg-white/15 shadow-2xl scale-105 border-2'
                      : 'hover:bg-white dark:hover:bg-white/15 hover:shadow-xl hover:scale-[1.02]'
                  }`}>
                    <div className="flex items-center gap-4 mb-6">
                      <div className={`w-16 h-16 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center transition-transform ${
                        activeStep === index ? 'scale-110' : ''
                      }`}>
                        <step.icon className="w-8 h-8 text-white" />
                      </div>
                      <div className={`text-6xl font-bold bg-gradient-to-r ${step.color} bg-clip-text text-transparent opacity-30`}>
                        {step.step}
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{step.title}</h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">{step.description}</p>

                    {/* Interactive Features List */}
                    <div className="space-y-2 mb-6">
                      {step.features.map((feature, featureIndex) => (
                        <Link key={featureIndex} href={feature.href}>
                          <motion.div
                            whileHover={{ x: 4 }}
                            className="flex items-center gap-2 cursor-pointer group/feature py-1"
                          >
                            <CheckCircle2 className={`w-4 h-4 bg-gradient-to-r ${step.color} bg-clip-text text-transparent group-hover/feature:scale-110 transition-transform`} />
                            <span className="text-gray-600 dark:text-gray-400 text-sm group-hover/feature:text-gray-900 dark:group-hover/feature:text-white transition-colors underline-offset-2 group-hover/feature:underline">
                              {feature.name}
                            </span>
                          </motion.div>
                        </Link>
                      ))}
                    </div>

                    {/* Primary Action Button */}
                    <Link href={step.primaryAction.href}>
                      <Button
                        className={`w-full bg-gradient-to-r ${step.color} text-white hover:opacity-90 transition-all group/btn shadow-lg hover:shadow-xl`}
                        size="lg"
                      >
                        <step.primaryAction.icon className="w-4 h-4 mr-2" />
                        {step.primaryAction.label}
                        <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </Card>
                </div>

                {/* Center Icon */}
                <div className="relative">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", duration: 0.6, delay: index * 0.1 + 0.3 }}
                    className={`w-20 h-20 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center relative z-10 cursor-pointer transition-transform ${
                      activeStep === index ? 'scale-125' : 'hover:scale-110'
                    }`}
                  >
                    <step.icon className="w-10 h-10 text-white" />
                  </motion.div>

                  {/* Pulse Animation */}
                  <motion.div
                    animate={{
                      scale: activeStep === index ? [1, 1.4, 1] : [1, 1.2, 1],
                      opacity: activeStep === index ? [0.7, 0, 0.7] : [0.5, 0, 0.5]
                    }}
                    transition={{
                      duration: activeStep === index ? 1.5 : 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className={`absolute inset-0 bg-gradient-to-r ${step.color} rounded-full`}
                  />
                </div>

                {/* Spacer for odd steps */}
                <div className="flex-1 lg:max-w-md" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center mt-20"
        >
          <Card className="inline-block p-8 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-blue-200 dark:border-white/20 backdrop-blur-xl hover:shadow-2xl transition-all">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-6 h-6 text-yellow-500 dark:text-yellow-400" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Ready to Transform Your Career?</h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-6 max-w-2xl">
              Join thousands of students who've transformed their careers with AI-powered guidance, personalized roadmaps, and expert mentorship
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/onboarding">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:from-blue-700 hover:to-purple-700 transition-all hover:scale-105 shadow-xl group"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Start Free Now
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/mentor">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-purple-300 dark:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all group"
                >
                  <Brain className="w-5 h-5 mr-2" />
                  Talk to AI Mentor
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}

'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { UserPlus, Brain, Target, TrendingUp, Users, Sparkles } from 'lucide-react'

const steps = [
  {
    icon: UserPlus,
    title: 'Create Your Profile',
    description: 'Sign up and build your comprehensive Digital Twin with academic records, skills, and aspirations.',
    step: '01',
    color: 'from-blue-500 to-purple-500',
    features: ['Academic import', 'Skills assessment', 'Goal setting', 'Personality test']
  },
  {
    icon: Brain,
    title: 'AI Analysis & Matching',
    description: 'Our AI analyzes your profile and matches you with 5000+ career opportunities based on your unique strengths.',
    step: '02',
    color: 'from-purple-500 to-pink-500',
    features: ['Smart matching', 'Market analysis', 'Skill gap detection', 'Growth predictions']
  },
  {
    icon: Target,
    title: 'Get Personalized Roadmap',
    description: 'Receive custom learning paths, skill recommendations, and career strategies tailored to your goals.',
    step: '03',
    color: 'from-pink-500 to-orange-500',
    features: ['Learning paths', 'Skill roadmaps', 'Timeline planning', 'Progress tracking']
  },
  {
    icon: TrendingUp,
    title: 'Learn & Grow',
    description: 'Access curated courses, practice with AI mentors, and connect with industry professionals.',
    step: '04',
    color: 'from-orange-500 to-red-500',
    features: ['Course recommendations', 'AI mentorship', 'Mock interviews', 'Peer learning']
  },
  {
    icon: Users,
    title: 'Connect & Succeed',
    description: 'Join our community, find mentors, practice interviews, and land your dream career.',
    step: '05',
    color: 'from-red-500 to-pink-500',
    features: ['Mentor matching', 'Interview prep', 'Job applications', 'Career success']
  }
]

export default function HowItWorks() {
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
            From profile creation to career success - your personalized journey in just 5 simple steps
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
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className={`flex flex-col lg:flex-row items-center gap-8 ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                {/* Step Content */}
                <div className="flex-1 lg:max-w-md">
                  <Card className="p-8 bg-white/80 dark:bg-white/10 backdrop-blur-xl border-gray-200 dark:border-white/20 hover:bg-white dark:hover:bg-white/15 transition-all duration-300 shadow-lg">
                    <div className="flex items-center gap-4 mb-6">
                      <div className={`w-16 h-16 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center`}>
                        <step.icon className="w-8 h-8 text-white" />
                      </div>
                      <div className={`text-6xl font-bold bg-gradient-to-r ${step.color} bg-clip-text text-transparent opacity-30`}>
                        {step.step}
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{step.title}</h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">{step.description}</p>

                    <div className="space-y-2">
                      {step.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-2">
                          <div className={`w-2 h-2 bg-gradient-to-r ${step.color} rounded-full`} />
                          <span className="text-gray-600 dark:text-gray-400 text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>

                {/* Center Icon */}
                <div className="relative">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", duration: 0.6, delay: index * 0.2 + 0.3 }}
                    className={`w-20 h-20 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center relative z-10`}
                  >
                    <step.icon className="w-10 h-10 text-white" />
                  </motion.div>
                  
                  {/* Pulse Animation */}
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 0, 0.5]
                    }}
                    transition={{
                      duration: 2,
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
          transition={{ duration: 0.5, delay: 1 }}
          className="text-center mt-20"
        >
          <Card className="inline-block p-8 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-blue-200 dark:border-white/20 backdrop-blur-xl">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Ready to Start Your Journey?</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-6">Join thousands of students who've transformed their careers with CareerCraft AI</p>
            <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full hover:from-blue-700 hover:to-purple-700 transition-all hover:scale-105 shadow-xl">
              Get Started for Free
            </button>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
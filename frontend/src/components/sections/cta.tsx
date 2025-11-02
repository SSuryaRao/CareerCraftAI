'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { 
  ArrowRight, Sparkles, Users, Target, Award, 
  Clock, CheckCircle, Star, Zap 
} from 'lucide-react'

const features = [
  'Personalized AI Career Guidance',
  'Skills Gap Analysis & Roadmaps',
  'Mock Interviews with Experts',
  'Industry Mentor Connections',
  'Real-time Job Market Insights',
  '10+ Indian Language Support'
]

const benefits = [
  {
    icon: Target,
    title: '94% Success Rate',
    description: 'Students achieving career goals'
  },
  {
    icon: Clock,
    title: 'Save 6+ Months',
    description: 'Fast-track your career journey'
  },
  {
    icon: Award,
    title: '₹15L+ Avg Boost',
    description: 'Average salary increase'
  },
  {
    icon: Users,
    title: '500+ Mentors',
    description: 'Industry experts available'
  }
]

export default function CTA() {
  return (
    <section className="relative py-20 px-4" id="cta">
      <div className="container mx-auto max-w-7xl">
        <div className="relative">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl opacity-10 blur-3xl" />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl opacity-5 blur-2xl transform rotate-3" />
          
          <Card className="relative p-8 md:p-12 lg:p-16 bg-gradient-to-br from-white/90 to-white/80 dark:from-white/10 dark:to-white/5 backdrop-blur-xl border-gray-200 dark:border-white/20 rounded-3xl overflow-hidden shadow-2xl">
            {/* Decorative Elements */}
            <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-20 blur-xl" />
            <div className="absolute bottom-4 left-4 w-32 h-32 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-15 blur-2xl" />
            
            <div className="relative z-10">
              {/* Main Content */}
              <div className="text-center mb-12">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-200 dark:border-white/20 rounded-full mb-6"
                >
                  <Sparkles className="w-5 h-5 text-yellow-500 dark:text-yellow-400" />
                  <span className="font-medium text-gray-900 dark:text-white">Limited Time Offer</span>
                  <Sparkles className="w-5 h-5 text-yellow-500 dark:text-yellow-400" />
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-700 to-purple-700 dark:from-white dark:via-blue-200 dark:to-purple-200"
                >
                  Ready to Transform Your Career?
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-4xl mx-auto mb-8"
                >
                  Join 50,000+ students who've already discovered their dream careers with
                  CareerCraft AI's personalized guidance
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
                >
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg rounded-full shadow-2xl hover:scale-105 transition-all duration-300"
                  >
                    Start Free Today
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-gray-300 dark:border-white/30 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-900 dark:text-white px-8 py-6 text-lg rounded-full backdrop-blur-xl"
                  >
                    Book Demo Call
                  </Button>
                </motion.div>

                {/* Features List */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-w-4xl mx-auto mb-12"
                >
                  {features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                      className="flex items-center space-x-3 text-left"
                    >
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              {/* Benefits Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                    className="text-center"
                  >
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <benefit.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{benefit.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{benefit.description}</p>
                  </motion.div>
                ))}
              </div>

              {/* Social Proof */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="text-center mb-8"
              >
                <div className="flex items-center justify-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 text-yellow-500 dark:text-yellow-400 fill-current" />
                  ))}
                  <span className="text-2xl font-bold text-gray-900 dark:text-white ml-2">4.9</span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-2">Rated 4.9/5 by 10,000+ students</p>
                <div className="flex items-center justify-center space-x-8 text-sm text-gray-600 dark:text-gray-400">
                  <span>✅ No Credit Card Required</span>
                  <span>✅ 7-Day Money Back Guarantee</span>
                  <span>✅ Cancel Anytime</span>
                </div>
              </motion.div>

              {/* Urgency Element */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 1 }}
                className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-2xl p-6 text-center"
              >
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Zap className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  <span className="text-orange-600 dark:text-orange-400 font-semibold">Early Bird Special</span>
                </div>
                <p className="text-gray-900 dark:text-white mb-2">
                  <span className="font-bold">50% OFF</span> Premium Plan - Limited to first 1,000 users
                </p>
                <div className="flex items-center justify-center space-x-4 text-sm">
                  <span className="bg-orange-500/20 px-3 py-1 rounded-full">
                    <span className="text-orange-600 dark:text-orange-400 font-semibold">847 spots left</span>
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">Expires in 48 hours</span>
                </div>
              </motion.div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
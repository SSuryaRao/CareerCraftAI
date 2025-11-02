'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import {
  Brain, MessageSquare, Lightbulb, Clock, Star, CheckCircle, 
  ArrowRight, Zap, Users, BookOpen, Target, TrendingUp, Award
} from 'lucide-react'

export default function AIMentorPage() {
  const router = useRouter()

  const handleChatClick = () => {
    router.push('/mentor')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950/20">
      <Navbar variant="transparent" />

      <section className="pt-24 pb-16 gradient-test-4 text-white relative overflow-hidden">
        {/* Dark overlay for better text visibility */}
        <div className="absolute inset-0 bg-black/20"></div>

        {/* Animated Background Elements */}
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-purple-300/20 dark:bg-purple-400/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-10 right-10 w-96 h-96 bg-blue-300/20 dark:bg-blue-400/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.6, 0.4, 0.6],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Badge className="bg-white/20 dark:bg-purple-500/20 text-white border-white/30 dark:border-purple-400 mb-6 backdrop-blur-sm">
                <Brain className="w-4 h-4 mr-2" />
                AI-Powered Mentorship
              </Badge>
            </motion.div>

            <motion.h1
              className="text-4xl lg:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Your Personal
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-100 to-blue-100 dark:from-purple-400 dark:to-blue-400 drop-shadow-lg"> AI Mentor</span>
            </motion.h1>

            <motion.p
              className="text-xl text-white/95 dark:text-gray-300 max-w-3xl mx-auto mb-8 drop-shadow-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Get 24/7 access to personalized career guidance, skill development advice,
              and professional insights powered by advanced AI technology.
            </motion.p>

            <motion.div
              className="flex justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <motion.div
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.98 }}
                animate={{
                  boxShadow: [
                    "0 20px 60px -15px rgba(255, 255, 255, 0.3)",
                    "0 25px 70px -15px rgba(255, 255, 255, 0.5)",
                    "0 20px 60px -15px rgba(255, 255, 255, 0.3)",
                  ]
                }}
                transition={{
                  boxShadow: {
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }
                }}
              >
                <Button
                  size="lg"
                  className="bg-white text-purple-600 hover:bg-purple-50 shadow-2xl hover:shadow-3xl font-bold text-lg px-10 py-7 rounded-xl ring-4 ring-white/30 hover:ring-white/50 transition-all duration-300"
                  onClick={handleChatClick}
                >
                  <MessageSquare className="w-6 h-6 mr-3" />
                  Chat with AI Mentor
                  <motion.div
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="w-5 h-5 ml-3" />
                  </motion.div>
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <section className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">AI Mentor Capabilities</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
              Unlock your potential with intelligent guidance tailored to your career journey
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Lightbulb,
                title: 'Career Strategy',
                description: 'Get personalized advice on career planning and growth strategies',
                gradient: 'from-amber-500 to-orange-500'
              },
              {
                icon: BookOpen,
                title: 'Skill Development',
                description: 'Receive guidance on which skills to learn and how to develop them',
                gradient: 'from-blue-500 to-cyan-500'
              },
              {
                icon: Target,
                title: 'Goal Setting',
                description: 'Set and track meaningful career goals with AI-powered insights',
                gradient: 'from-purple-500 to-pink-500'
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.15,
                  ease: "easeOut"
                }}
                whileHover={{ y: -8 }}
                className="group"
              >
                <div className="relative p-8 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 hover:border-blue-200 dark:hover:border-transparent hover:shadow-2xl dark:hover:bg-white/10 transition-all duration-300 h-full backdrop-blur-xl">
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 dark:group-hover:opacity-10 rounded-2xl transition-opacity duration-300`} />
                  <div className="relative">
                    <motion.div
                      className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mx-auto mb-5 shadow-lg`}
                      whileHover={{
                        rotate: 360,
                        scale: 1.1
                      }}
                      transition={{ duration: 0.6 }}
                    >
                      <feature.icon className="w-7 h-7 text-white" />
                    </motion.div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="p-12 text-center bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 dark:from-purple-700 dark:via-indigo-700 dark:to-blue-700 text-white shadow-2xl border-0 relative overflow-hidden">
              {/* Animated shine effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{
                  x: ['-100%', '100%']
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatDelay: 5,
                  ease: "easeInOut"
                }}
              />

              <div className="relative z-10">
                <motion.h2
                  className="text-3xl font-bold mb-4 drop-shadow-md"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  Start Your AI Mentorship Journey
                </motion.h2>
                <motion.p
                  className="text-white/95 dark:text-purple-200 mb-8 text-lg max-w-2xl mx-auto drop-shadow-sm"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  Join thousands of professionals who are accelerating their careers with AI-powered mentorship.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    className="bg-white text-purple-600 hover:bg-gray-100 dark:bg-white dark:text-purple-700 dark:hover:bg-gray-200 shadow-xl hover:shadow-2xl group font-semibold"
                    onClick={handleChatClick}
                  >
                    Get Started Today
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </motion.div>
                  </Button>
                </motion.div>
              </div>
            </Card>
          </motion.div>
        </section>
      </div>

      <Footer />
    </div>
  )
}
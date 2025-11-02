'use client'

import { motion } from 'framer-motion'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import FeedbackForm from '@/components/feedback/FeedbackForm'
import { MessageSquare, Bug, Lightbulb, TrendingUp, Mail } from 'lucide-react'
import { Card } from '@/components/ui/card'

export default function FeedbackPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950/20">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-24 pb-12 gradient-test-4 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6">
              <MessageSquare className="w-8 h-8 text-white" />
            </div>

            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              We Value Your Feedback
            </h1>

            <p className="text-xl text-white/95 max-w-2xl mx-auto">
              Help us improve CareerCraft AI by sharing your thoughts, reporting bugs, or suggesting new features.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="p-8 bg-white dark:bg-gray-900/50 backdrop-blur-sm">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Submit Your Feedback
                </h2>
                <FeedbackForm />
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* What to Report */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="p-6 bg-white dark:bg-gray-900/50">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  What to Report
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      icon: Bug,
                      title: 'Bug Reports',
                      description: 'Found something broken? Let us know!'
                    },
                    {
                      icon: Lightbulb,
                      title: 'Feature Requests',
                      description: 'Have an idea? We\'d love to hear it!'
                    },
                    {
                      icon: TrendingUp,
                      title: 'Improvements',
                      description: 'Suggest ways we can do better'
                    }
                  ].map((item, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                          {item.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="p-6 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                <Mail className="w-8 h-8 mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Need Direct Support?
                </h3>
                <p className="text-white/90 text-sm mb-4">
                  For urgent issues or specific inquiries, email us directly.
                </p>
                <a
                  href="mailto:hello@careercraft.ai"
                  className="text-sm font-medium underline hover:text-white/80 transition-colors"
                >
                  hello@careercraft.ai
                </a>
              </Card>
            </motion.div>

            {/* FAQ */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="p-6 bg-white dark:bg-gray-900/50">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Quick Tips
                </h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500">•</span>
                    <span>Be specific about the issue or suggestion</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500">•</span>
                    <span>Include screenshots if reporting a bug</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500">•</span>
                    <span>We typically respond within 24-48 hours</span>
                  </li>
                </ul>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

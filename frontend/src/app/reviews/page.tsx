'use client'

import { motion } from 'framer-motion'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import ReviewForm from '@/components/reviews/ReviewForm'
import ReviewList from '@/components/reviews/ReviewList'
import ReviewStats from '@/components/reviews/ReviewStats'
import { Star, TrendingUp, Users, Award } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function ReviewsPage() {
  const scrollToForm = () => {
    document.getElementById('review-form')?.scrollIntoView({
      behavior: 'smooth'
    })
  }

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
              <Star className="w-8 h-8 text-yellow-300" />
            </div>

            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Reviews & Testimonials
            </h1>

            <p className="text-xl text-white/95 max-w-2xl mx-auto mb-8">
              See what our users are saying about CareerCraft AI and share your own experience
            </p>

            <Button
              onClick={scrollToForm}
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 shadow-xl"
            >
              Write a Review
            </Button>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Write Review Section */}
            <div id="review-form">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="p-8 bg-white dark:bg-gray-900/50">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Share Your Experience
                  </h2>
                  <ReviewForm />
                </Card>
              </motion.div>
            </div>

            {/* Reviews List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                What Our Users Say
              </h2>
              <ReviewList />
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <ReviewStats />
            </motion.div>

            {/* Why Review */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="p-6 bg-white dark:bg-gray-900/50">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Why Leave a Review?
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      icon: Users,
                      title: 'Help Others',
                      description: 'Your feedback helps others make informed decisions'
                    },
                    {
                      icon: TrendingUp,
                      title: 'Improve Platform',
                      description: 'We use reviews to enhance our services'
                    },
                    {
                      icon: Award,
                      title: 'Get Featured',
                      description: 'Best reviews may be featured on our homepage'
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

            {/* Review Guidelines */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Card className="p-6 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                <Star className="w-8 h-8 mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Review Guidelines
                </h3>
                <ul className="space-y-2 text-sm text-white/90">
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-300">•</span>
                    <span>Be honest and constructive in your feedback</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-300">•</span>
                    <span>Share specific experiences and examples</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-300">•</span>
                    <span>Reviews are moderated before publishing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-300">•</span>
                    <span>You can edit your review once every 30 days</span>
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

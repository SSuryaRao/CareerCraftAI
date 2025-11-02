'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Quote, Star, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'

const testimonials = [
  {
    id: 1,
    name: 'Arjun Sharma',
    role: 'Software Engineer at Google',
    location: 'Bangalore',
    image: '👨‍💻',
    rating: 5,
    text: "CareerCraft AI completely changed my career trajectory. The AI mentor helped me identify my strengths and guided me through the entire journey from learning to landing my dream job at Google. The personalized roadmap was spot on!",
    beforeRole: '12th Grade Student',
    achievement: 'Got placed at Google with ₹45 LPA package',
    timeframe: '18 months'
  },
  {
    id: 2,
    name: 'Priya Patel',
    role: 'Product Manager at Microsoft',
    location: 'Hyderabad',
    image: '👩‍💼',
    rating: 5,
    text: "As a working professional looking to switch careers, CareerCraft AI's skill gap analysis was incredibly accurate. The mock interviews prepared me perfectly, and the mentor matching connected me with industry leaders who guided my transition.",
    beforeRole: 'Software Developer',
    achievement: 'Successfully transitioned to Product Management',
    timeframe: '8 months'
  },
  {
    id: 3,
    name: 'Rahul Kumar',
    role: 'Data Scientist at Amazon',
    location: 'Mumbai',
    image: '📊',
    rating: 5,
    text: "The AI-powered career matching is phenomenal! I was confused between multiple career paths, but CareerCraft AI's analysis helped me discover my passion for data science. The learning resources and practice interviews were game-changers.",
    beforeRole: 'Engineering Graduate',
    achievement: 'Landed Data Scientist role at Amazon',
    timeframe: '14 months'
  },
  {
    id: 4,
    name: 'Sneha Reddy',
    role: 'UX Designer at Flipkart',
    location: 'Chennai',
    image: '🎨',
    rating: 5,
    text: "Coming from a non-tech background, I thought breaking into design was impossible. CareerCraft AI's personalized learning path and mentor support helped me build a portfolio that landed me a design role at Flipkart!",
    beforeRole: 'Commerce Graduate',
    achievement: 'Career switch to UX Design',
    timeframe: '12 months'
  },
  {
    id: 5,
    name: 'Vikram Singh',
    role: 'Startup Founder',
    location: 'Delhi',
    image: '🚀',
    rating: 5,
    text: "The entrepreneurship guidance and market intelligence features helped me validate my startup idea and connect with the right mentors. CareerCraft AI doesn't just find jobs - it helps you create them!",
    beforeRole: 'MBA Student',
    achievement: 'Founded successful startup with ₹5Cr funding',
    timeframe: '2 years'
  },
  {
    id: 6,
    name: 'Ananya Joshi',
    role: 'Machine Learning Engineer at Zomato',
    location: 'Pune',
    image: '🤖',
    rating: 5,
    text: "The AI mentor's guidance on ML career paths was incredibly detailed. The skill development roadmap and practice problems helped me ace technical interviews. Now I'm working on cutting-edge ML projects at Zomato!",
    beforeRole: 'Computer Science Student',
    achievement: 'Specialized in Machine Learning',
    timeframe: '16 months'
  }
]

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  }

  const swipeConfidenceThreshold = 10000
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity
  }

  const paginate = (newDirection: number) => {
    setDirection(newDirection)
    setCurrentIndex((prevIndex) => {
      if (newDirection === 1) {
        return prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      } else {
        return prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
      }
    })
  }

  return (
    <section className="relative py-20 px-4" id="testimonials">
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
            <span className="text-sm font-medium text-gray-800 dark:text-white">Success Stories</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
            Transforming Careers, Creating Success
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            See how CareerCraft AI has helped thousands of students and professionals achieve their dream careers
          </p>
        </motion.div>

        {/* Main Testimonial Carousel */}
        <div className="relative mb-12">
          <div className="overflow-hidden">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 }
                }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={1}
                onDragEnd={(e, { offset, velocity }) => {
                  const swipe = swipePower(offset.x, velocity.x)

                  if (swipe < -swipeConfidenceThreshold) {
                    paginate(1)
                  } else if (swipe > swipeConfidenceThreshold) {
                    paginate(-1)
                  }
                }}
                className="w-full"
              >
                <Card className="max-w-4xl mx-auto p-8 md:p-12 bg-white/90 dark:bg-white/10 backdrop-blur-xl border-gray-200 dark:border-white/20 shadow-xl">
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    {/* Profile Section */}
                    <div className="text-center md:text-left">
                      <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-4xl mb-4 mx-auto md:mx-0">
                        {testimonials[currentIndex].image}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                        {testimonials[currentIndex].name}
                      </h3>
                      <p className="text-blue-600 dark:text-blue-400 font-medium mb-1">
                        {testimonials[currentIndex].role}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                        {testimonials[currentIndex].location}
                      </p>

                      {/* Rating */}
                      <div className="flex justify-center md:justify-start gap-1 mb-4">
                        {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-500 dark:text-yellow-400 fill-current" />
                        ))}
                      </div>

                      {/* Achievement Stats */}
                      <div className="space-y-2 text-sm">
                        <div className="bg-green-500/20 dark:bg-green-500/10 border border-green-500/30 dark:border-green-500/20 rounded-lg p-3">
                          <p className="text-green-600 dark:text-green-400 font-medium">Achievement</p>
                          <p className="text-gray-900 dark:text-white">{testimonials[currentIndex].achievement}</p>
                        </div>
                        <div className="bg-blue-500/20 dark:bg-blue-500/10 border border-blue-500/30 dark:border-blue-500/20 rounded-lg p-3">
                          <p className="text-blue-600 dark:text-blue-400 font-medium">Timeline</p>
                          <p className="text-gray-900 dark:text-white">{testimonials[currentIndex].timeframe}</p>
                        </div>
                      </div>
                    </div>

                    {/* Testimonial Content */}
                    <div className="flex-1">
                      <Quote className="w-12 h-12 text-blue-500 dark:text-blue-400 mb-6 opacity-50" />
                      <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                        {testimonials[currentIndex].text}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <span>From: <span className="text-gray-900 dark:text-white">{testimonials[currentIndex].beforeRole}</span></span>
                        <span className="text-blue-600 dark:text-blue-400">→</span>
                        <span>To: <span className="text-gray-900 dark:text-white">{testimonials[currentIndex].role}</span></span>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={() => paginate(-1)}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/80 dark:bg-white/10 hover:bg-white dark:hover:bg-white/20 backdrop-blur-xl border border-gray-200 dark:border-white/20 rounded-full flex items-center justify-center text-gray-900 dark:text-white transition-all hover:scale-110 shadow-lg"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={() => paginate(1)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/80 dark:bg-white/10 hover:bg-white dark:hover:bg-white/20 backdrop-blur-xl border border-gray-200 dark:border-white/20 rounded-full flex items-center justify-center text-gray-900 dark:text-white transition-all hover:scale-110 shadow-lg"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Testimonial Indicators */}
        <div className="flex justify-center gap-2 mb-12">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1)
                setCurrentIndex(index)
              }}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-blue-600 dark:bg-blue-400 scale-125'
                  : 'bg-gray-300 dark:bg-white/30 hover:bg-gray-400 dark:hover:bg-white/50'
              }`}
            />
          ))}
        </div>

        {/* Grid of Mini Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <motion.div
              key={`mini-${testimonial.id}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <Card className="p-6 bg-white/70 dark:bg-white/5 backdrop-blur-xl border-gray-200 dark:border-white/10 hover:bg-white dark:hover:bg-white/10 transition-all cursor-pointer shadow-md">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-xl">
                    {testimonial.image}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role.split(' at ')[0]}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-3 line-clamp-3">
                  {testimonial.text}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 text-yellow-500 dark:text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-500">{testimonial.timeframe}</span>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16"
        >
          {[
            { value: '10,000+', label: 'Success Stories' },
            { value: '94%', label: 'Success Rate' },
            { value: '₹15L+', label: 'Average Salary Increase' },
            { value: '12 months', label: 'Average Timeline' },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
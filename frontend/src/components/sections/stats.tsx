'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { 
  Users, Target, Award, TrendingUp, Globe, Brain, 
  BookOpen, MessageSquare, Video, Briefcase 
} from 'lucide-react'

const stats = [
  {
    icon: Users,
    value: 50000,
    suffix: '+',
    label: 'Active Students',
    description: 'Students actively using our platform',
    color: 'from-blue-500 to-purple-500'
  },
  {
    icon: Target,
    value: 5000,
    suffix: '+',
    label: 'Career Paths',
    description: 'Diverse career opportunities analyzed',
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: Award,
    value: 94,
    suffix: '%',
    label: 'Success Rate',
    description: 'Students achieving career goals',
    color: 'from-pink-500 to-red-500'
  },
  {
    icon: TrendingUp,
    value: 15,
    suffix: 'L+',
    label: 'Avg Salary Boost',
    description: 'Average salary increase achieved',
    color: 'from-red-500 to-orange-500'
  },
  {
    icon: Globe,
    value: 10,
    suffix: '+',
    label: 'Languages',
    description: 'Indian languages supported',
    color: 'from-orange-500 to-yellow-500'
  },
  {
    icon: Brain,
    value: 1000000,
    suffix: '+',
    label: 'AI Interactions',
    description: 'Mentor conversations completed',
    color: 'from-yellow-500 to-green-500'
  },
  {
    icon: BookOpen,
    value: 25000,
    suffix: '+',
    label: 'Learning Hours',
    description: 'Total learning time on platform',
    color: 'from-green-500 to-blue-500'
  },
  {
    icon: Video,
    value: 500,
    suffix: '+',
    label: 'Expert Mentors',
    description: 'Industry professionals available',
    color: 'from-blue-500 to-indigo-500'
  }
]

const achievements = [
  {
    title: 'Featured in Tech Crunch',
    description: 'Recognized as top EdTech innovation',
    date: '2024'
  },
  {
    title: 'Government Partnership',
    description: 'Partnered with Skill India mission',
    date: '2023'
  },
  {
    title: 'AI Excellence Award',
    description: 'Best AI application in education',
    date: '2023'
  },
  {
    title: '₹50Cr Funding Round',
    description: 'Series A funding from top VCs',
    date: '2023'
  }
]

function Counter({ value, suffix, duration = 2000 }: { value: number, suffix: string, duration?: number }) {
  const [count, setCount] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true)
          
          const startTime = Date.now()
          const startValue = 0
          
          const updateCounter = () => {
            const elapsedTime = Date.now() - startTime
            const progress = Math.min(elapsedTime / duration, 1)
            
            // Easing function for smoother animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4)
            const currentValue = Math.floor(startValue + (value - startValue) * easeOutQuart)
            
            setCount(currentValue)
            
            if (progress < 1) {
              requestAnimationFrame(updateCounter)
            } else {
              setCount(value)
            }
          }
          
          requestAnimationFrame(updateCounter)
        }
      },
      { threshold: 0.5 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [value, duration, hasStarted])

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    } else if (num >= 1000) {
      return (num / 1000).toFixed(0) + 'K'
    }
    return num.toString()
  }

  return (
    <div ref={ref} className="text-4xl md:text-5xl font-bold">
      {suffix === 'L+' || suffix === '+' 
        ? `${formatNumber(count)}${suffix}`
        : `${count}${suffix}`
      }
    </div>
  )
}

export default function Stats() {
  return (
    <section className="relative py-20 px-4" id="stats">
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
            Numbers That Speak
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Our impact in transforming careers across India
          </p>
        </motion.div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="p-6 bg-white/70 dark:bg-white/5 backdrop-blur-xl border-gray-200 dark:border-white/10 hover:bg-white dark:hover:bg-white/10 transition-all duration-300 text-center group shadow-lg">
                <div className={`w-16 h-16 bg-gradient-to-r ${stat.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  <stat.icon className="w-8 h-8 text-white" />
                </div>

                <div className={`bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
                  <Counter value={stat.value} suffix={stat.suffix} />
                </div>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{stat.label}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{stat.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Achievements Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            Recognition & Achievements
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="p-6 bg-gradient-to-br from-white/80 to-white/60 dark:from-white/10 dark:to-white/5 backdrop-blur-xl border-gray-200 dark:border-white/20 hover:from-white hover:to-white dark:hover:from-white/20 dark:hover:to-white/10 transition-all duration-300 shadow-md">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{achievement.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{achievement.description}</p>
                    <div className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">{achievement.date}</div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Additional Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16"
        >
          <Card className="p-8 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-xl border-blue-200 dark:border-white/20 shadow-lg">
            <div className="text-center mb-8">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Growing Every Day
              </h3>
              <p className="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
                Join a thriving community of learners, mentors, and industry professionals
                who are shaping the future of careers in India
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                  <Counter value={850} suffix="+" />
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Companies Hiring</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                  <Counter value={28} suffix="" />
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Cities Covered</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-pink-600 dark:text-pink-400 mb-1">
                  <Counter value={15000} suffix="+" />
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Mock Interviews</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-orange-600 dark:text-orange-400 mb-1">
                  <Counter value={99} suffix="%" />
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">User Satisfaction</div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Live Stats Ticker */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-12"
        >
          <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-200 dark:border-white/10 rounded-full p-4">
            <div className="flex items-center justify-center space-x-8 text-sm text-gray-800 dark:text-white">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full animate-pulse" />
                <span>Live: <Counter value={1247} suffix="" /> users online</span>
              </div>
              <div className="hidden md:flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full animate-pulse" />
                <span>Today: <Counter value={342} suffix="" /> new registrations</span>
              </div>
              <div className="hidden lg:flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 dark:bg-purple-400 rounded-full animate-pulse" />
                <span>This week: <Counter value={89} suffix="" /> job offers</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import {
  BookOpen, Star, Target, TrendingUp, Users, Award, 
  ArrowRight, Brain, Compass, Zap, GraduationCap, Lightbulb
} from 'lucide-react'

export default function StudentsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50 bg-students-pattern">
      <Navbar />
      
      <section className="pt-24 pb-16 gradient-students text-white relative overflow-hidden">
        {/* Floating background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-white/5 rounded-full blur-3xl float-slow"></div>
          <div className="absolute top-3/4 right-1/4 w-56 h-56 bg-emerald-300/10 rounded-full blur-2xl float-delay-1"></div>
          <div className="absolute top-1/2 right-1/3 w-40 h-40 bg-teal-300/10 rounded-full blur-xl float-delay-2"></div>
          <div className="absolute bottom-1/4 left-1/3 w-32 h-32 bg-rose-300/10 rounded-full blur-xl float-fast"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Badge className="glass-students text-emerald-200 border-emerald-300/50 mb-6 px-4 py-2 text-sm font-medium">
              <BookOpen className="w-4 h-4 mr-2" />
              For Students
            </Badge>
            
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Your Career Starts
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 to-teal-300"> Here</span>
            </h1>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Discover your potential, explore career paths, and build the skills you need 
              to succeed in today's competitive job market. Start your journey with confidence.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="btn-student px-8 py-4 rounded-2xl font-semibold text-lg shadow-2xl hover:shadow-3xl">
                Start Free Assessment
                <GraduationCap className="w-5 h-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 hover:bg-white/10 text-white backdrop-blur-sm px-8 py-4 rounded-2xl font-semibold text-lg">
                Explore Careers
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <section className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Everything You Need to Succeed</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: 'AI Career Guidance',
                description: 'Get personalized career recommendations based on your interests and skills'
              },
              {
                icon: Target,
                title: 'Skill Assessment',
                description: 'Identify your strengths and areas for improvement with detailed analysis'
              },
              {
                icon: Compass,
                title: 'Career Exploration',
                description: 'Discover thousands of career paths and their requirements'
              },
              {
                icon: Award,
                title: 'Certification Prep',
                description: 'Prepare for industry certifications with curated learning paths'
              },
              {
                icon: Users,
                title: 'Peer Community',
                description: 'Connect with like-minded students and share experiences'
              },
              {
                icon: Lightbulb,
                title: 'Project Ideas',
                description: 'Get suggestions for projects that enhance your portfolio'
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card className="student-card p-8 text-center interactive-card-subtle h-full">
                  <div className="w-20 h-20 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <feature.icon className="w-10 h-10 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed font-medium">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <section>
          <Card className="p-12 text-center bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 text-white shadow-2xl border-0 rounded-3xl relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
            </div>
            <div className="relative z-10">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">Ready to Shape Your Future?</h2>
              <p className="text-emerald-100 mb-8 text-lg max-w-2xl mx-auto font-medium">
                Join over 50,000 students who have already started their career journey with AI Career Advisor.
              </p>
              <Button size="lg" className="bg-white text-emerald-600 hover:bg-gray-50 px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300">
                Get Started Today
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </Card>
        </section>
      </div>

      <Footer />
    </div>
  )
}
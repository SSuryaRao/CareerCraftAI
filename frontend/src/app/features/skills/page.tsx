'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import {
  TrendingUp, Star, Award, BookOpen, Target, CheckCircle, 
  ArrowRight, BarChart3, Zap, Activity
} from 'lucide-react'

export default function SkillsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-red-50">
      <Navbar />
      
      <section className="pt-24 pb-16 bg-gradient-to-br from-orange-900 via-red-900 to-pink-900 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Badge className="bg-orange-500/20 text-orange-300 border-orange-400 mb-6">
              <TrendingUp className="w-4 h-4 mr-2" />
              Advanced Analytics
            </Badge>
            
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Skill Gap
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-red-400"> Analysis</span>
            </h1>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Get detailed insights into your current skill set, identify gaps, and receive 
              personalized recommendations for skill development and career advancement.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700">
                Analyze My Skills
                <BarChart3 className="w-5 h-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="border-white/20 hover:bg-white/10 text-white">
                View Sample Report
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <section className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Comprehensive Skill Assessment</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Activity,
                title: 'Real-time Assessment',
                description: 'Dynamic evaluation of your technical and soft skills'
              },
              {
                icon: Target,
                title: 'Gap Identification',
                description: 'Pinpoint exact areas where skill development is needed'
              },
              {
                icon: BookOpen,
                title: 'Learning Roadmap',
                description: 'Personalized learning path to bridge identified gaps'
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-100 to-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-8 h-8 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <section>
          <Card className="p-12 text-center bg-gradient-to-r from-orange-600 to-red-600 text-white">
            <h2 className="text-3xl font-bold mb-4">Accelerate Your Skill Development</h2>
            <p className="text-orange-100 mb-8 text-lg max-w-2xl mx-auto">
              Transform your career with data-driven insights into your skill set and targeted recommendations for growth.
            </p>
            <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100">
              Start Assessment
              <Zap className="w-5 h-5 ml-2" />
            </Button>
          </Card>
        </section>
      </div>

      <Footer />
    </div>
  )
}
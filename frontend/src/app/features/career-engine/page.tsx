'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import {
  Target, Zap, TrendingUp, Users, Award, CheckCircle, 
  ArrowRight, BarChart3, Compass, Rocket
} from 'lucide-react'

export default function CareerEnginePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-blue-50">
      <Navbar />
      
      <section className="pt-24 pb-16 bg-gradient-to-br from-green-900 via-blue-900 to-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Badge className="bg-green-500/20 text-green-300 border-green-400 mb-6">
              <Target className="w-4 h-4 mr-2" />
              Smart Career Matching
            </Badge>
            
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Career Discovery
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-400"> Engine</span>
            </h1>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Discover career paths perfectly aligned with your skills, interests, and goals. 
              Our advanced engine analyzes thousands of career options to find your ideal match.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
                Discover Careers
                <Compass className="w-5 h-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="border-white/20 hover:bg-white/10 text-white">
                Take Assessment
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <section className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">How Our Engine Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: BarChart3,
                title: 'Skills Analysis',
                description: 'Comprehensive evaluation of your technical and soft skills'
              },
              {
                icon: TrendingUp,
                title: 'Market Trends',
                description: 'Real-time analysis of job market demands and opportunities'
              },
              {
                icon: Target,
                title: 'Perfect Matching',
                description: 'AI-powered matching algorithm for optimal career suggestions'
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-100 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <section>
          <Card className="p-12 text-center bg-gradient-to-r from-green-600 to-blue-600 text-white">
            <h2 className="text-3xl font-bold mb-4">Find Your Dream Career</h2>
            <p className="text-green-100 mb-8 text-lg max-w-2xl mx-auto">
              Let our career engine guide you to opportunities that match your unique profile and aspirations.
            </p>
            <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
              Start Discovery
              <Rocket className="w-5 h-5 ml-2" />
            </Button>
          </Card>
        </section>
      </div>

      <Footer />
    </div>
  )
}
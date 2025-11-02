'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import {
  Briefcase, Users, BarChart3, Award, Target, Shield, 
  ArrowRight, Building, TrendingUp, BookOpen, Star, Zap
} from 'lucide-react'

export default function InstitutionsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50">
      <Navbar />
      
      <section className="pt-24 pb-16 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-400 mb-6">
              <Briefcase className="w-4 h-4 mr-2" />
              For Institutions
            </Badge>
            
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Empower Your
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-pink-400"> Institution</span>
            </h1>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Transform career guidance at your institution with AI-powered tools, analytics, 
              and comprehensive support systems for students and counselors.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                Request Demo
                <Building className="w-5 h-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="border-white/20 hover:bg-white/10 text-white">
                View Pricing
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <section className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Complete Career Services Platform</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: BarChart3,
                title: 'Student Analytics',
                description: 'Comprehensive dashboards to track student progress and outcomes'
              },
              {
                icon: Users,
                title: 'Counselor Tools',
                description: 'Professional tools for career counselors and placement officers'
              },
              {
                icon: Target,
                title: 'Placement Support',
                description: 'Enhanced placement services with industry connections'
              },
              {
                icon: Award,
                title: 'Success Metrics',
                description: 'Track placement rates, salary outcomes, and student satisfaction'
              },
              {
                icon: BookOpen,
                title: 'Curriculum Integration',
                description: 'Seamlessly integrate career guidance into your existing programs'
              },
              {
                icon: Shield,
                title: 'Enterprise Security',
                description: 'Bank-grade security with institutional data protection'
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card className="p-6 text-center hover:shadow-lg transition-shadow h-full">
                  <div className="w-16 h-16 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-8 h-8 text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <section>
          <Card className="p-12 text-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
            <h2 className="text-3xl font-bold mb-4">Transform Student Success</h2>
            <p className="text-indigo-100 mb-8 text-lg max-w-2xl mx-auto">
              Join leading educational institutions already using CareerCraft AI 
              to improve student outcomes and placement rates.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-indigo-600 hover:bg-gray-100">
                Schedule Demo
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="border-white/20 hover:bg-white/10 text-white">
                <Zap className="w-5 h-5 mr-2" />
                Get Started
              </Button>
            </div>
          </Card>
        </section>
      </div>

      <Footer />
    </div>
  )
}
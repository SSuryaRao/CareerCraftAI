'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import {
  Users, Heart, Shield, TrendingUp, Award, BookOpen, 
  ArrowRight, Eye, MessageSquare, BarChart3, Star, Phone
} from 'lucide-react'

export default function ParentsPage() {
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
              <Users className="w-4 h-4 mr-2" />
              For Parents
            </Badge>
            
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Guide Your Child's
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-400"> Career Journey</span>
            </h1>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Get the insights and tools you need to support your child's career decisions 
              with confidence. Make informed choices together for a brighter future.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
                Explore Parent Tools
                <Heart className="w-5 h-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="border-white/20 hover:bg-white/10 text-white">
                Schedule Consultation
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <section className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Supporting Your Child's Success</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Eye,
                title: 'Progress Tracking',
                description: 'Monitor your child\'s career exploration journey and skill development'
              },
              {
                icon: BarChart3,
                title: 'Career Insights',
                description: 'Get detailed reports on career options and market opportunities'
              },
              {
                icon: MessageSquare,
                title: 'Expert Consultation',
                description: 'Connect with career counselors for professional guidance'
              },
              {
                icon: Shield,
                title: 'Safe Environment',
                description: 'Secure platform with parental controls and privacy protection'
              },
              {
                icon: TrendingUp,
                title: 'Market Trends',
                description: 'Stay updated on industry trends and future job prospects'
              },
              {
                icon: Award,
                title: 'Success Stories',
                description: 'Learn from other families\' career journey experiences'
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card className="p-6 text-center hover:shadow-lg transition-shadow h-full">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-100 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <section>
          <Card className="p-12 text-center bg-gradient-to-r from-green-600 to-blue-600 text-white">
            <h2 className="text-3xl font-bold mb-4">Partner with Us in Your Child's Success</h2>
            <p className="text-green-100 mb-8 text-lg max-w-2xl mx-auto">
              Join thousands of parents who are actively supporting their children's career development 
              with our expert guidance and tools.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
                Get Parent Access
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="border-white/20 hover:bg-white/10 text-white">
                <Phone className="w-5 h-5 mr-2" />
                Talk to Counselor
              </Button>
            </div>
          </Card>
        </section>
      </div>

      <Footer />
    </div>
  )
}
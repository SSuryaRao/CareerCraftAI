'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Navbar from '@/components/layout/navbar'
import {
  BookOpen, Clock, User, Download, Star, ArrowRight,
  FileText, Video, Headphones, Trophy, Target, Users
} from 'lucide-react'

const guides = [
  {
    id: 1,
    title: "Complete Resume Writing Guide",
    description: "Learn how to craft a compelling resume that gets noticed by recruiters and hiring managers.",
    category: "Resume Building",
    readTime: "15 min read",
    author: "Sarah Johnson",
    rating: 4.9,
    downloads: 12543,
    type: "guide",
    icon: FileText,
    featured: true
  },
  {
    id: 2,
    title: "Interview Preparation Masterclass",
    description: "Master the art of job interviews with proven strategies, common questions, and expert tips.",
    category: "Interview Prep",
    readTime: "12 min read",
    author: "Michael Chen",
    rating: 4.8,
    downloads: 8932,
    type: "guide",
    icon: Users,
    featured: false
  },
  {
    id: 3,
    title: "Salary Negotiation Strategies",
    description: "Discover how to negotiate your salary effectively and maximize your earning potential.",
    category: "Career Advancement",
    readTime: "10 min read",
    author: "Emily Rodriguez",
    rating: 4.9,
    downloads: 7654,
    type: "guide",
    icon: Trophy,
    featured: false
  },
  {
    id: 4,
    title: "LinkedIn Profile Optimization",
    description: "Transform your LinkedIn profile to attract recruiters and build professional connections.",
    category: "Personal Branding",
    readTime: "8 min read",
    author: "Alex Kim",
    rating: 4.7,
    downloads: 9876,
    type: "guide",
    icon: Target,
    featured: false
  }
]

export default function GuidesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Career <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">Guides</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Comprehensive guides to help you navigate every aspect of your career journey. 
              From resume writing to salary negotiation, we've got you covered.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Featured Guide */}
        {guides.filter(guide => guide.featured).map(guide => (
          <motion.section
            key={guide.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Featured Guide</h2>
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <div className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <Badge className="bg-white/20 text-white border-white/30 mb-4">
                      {guide.category}
                    </Badge>
                    <h3 className="text-3xl font-bold mb-4">{guide.title}</h3>
                    <p className="text-blue-100 text-lg mb-6">{guide.description}</p>
                    <div className="flex items-center space-x-6 text-blue-200 text-sm mb-6">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        {guide.author}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        {guide.readTime}
                      </div>
                      <div className="flex items-center">
                        <Download className="w-4 h-4 mr-2" />
                        {guide.downloads.toLocaleString()}
                      </div>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 mr-2 fill-yellow-400 text-yellow-400" />
                        {guide.rating}
                      </div>
                    </div>
                    <Button variant="outline" className="bg-white text-blue-600 hover:bg-gray-50 border-white">
                      Read Guide
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                  <div className="relative">
                    <div className="aspect-video bg-white/20 rounded-xl flex items-center justify-center">
                      <guide.icon className="w-24 h-24 text-white/60" />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.section>
        ))}

        {/* All Guides */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">All Career Guides</h2>
            <div className="flex items-center space-x-4">
              <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                <option>All Categories</option>
                <option>Resume Building</option>
                <option>Interview Prep</option>
                <option>Career Advancement</option>
                <option>Personal Branding</option>
              </select>
              <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                <option>Most Popular</option>
                <option>Newest</option>
                <option>Highest Rated</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {guides.filter(guide => !guide.featured).map((guide, index) => (
              <motion.div
                key={guide.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 bg-white hover:-translate-y-1">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <guide.icon className="w-6 h-6 text-white" />
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {guide.category}
                      </Badge>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 hover:text-blue-600 transition-colors">
                      {guide.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{guide.description}</p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center">
                          <User className="w-3 h-3 mr-1" />
                          {guide.author}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {guide.readTime}
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                        {guide.rating}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-xs text-gray-500">
                        <Download className="w-3 h-3 mr-1" />
                        {guide.downloads.toLocaleString()} downloads
                      </div>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        Read Guide
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center"
        >
          <h2 className="text-3xl font-bold mb-4">Need Personalized Career Guidance?</h2>
          <p className="text-xl mb-6 opacity-90">
            Get one-on-one career coaching tailored to your specific goals and challenges.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" className="bg-white text-blue-600 hover:bg-gray-50 border-white">
              Book a Session
            </Button>
            <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-blue-600">
              Learn More
            </Button>
          </div>
        </motion.section>
      </div>
    </div>
  )
}
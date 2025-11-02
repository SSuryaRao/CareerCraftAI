'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Navbar from '@/components/layout/navbar'
import {
  Target, Users, Award, TrendingUp, Heart, Lightbulb,
  Globe, Shield, Zap, User, MapPin, Mail
} from 'lucide-react'

export default function AboutPage() {
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
              About <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">Career Craft AI</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Empowering careers through AI-driven insights, personalized guidance, and comprehensive resources 
              to help you achieve your professional dreams.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Mission Section */}
        <section className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              To democratize career success by providing AI-powered tools, personalized guidance, 
              and comprehensive resources that help individuals at every stage of their professional journey.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: "Focused Guidance",
                description: "AI-driven career recommendations tailored to your unique skills, interests, and goals."
              },
              {
                icon: Users,
                title: "Community-Driven",
                description: "Connect with like-minded professionals and learn from shared experiences."
              },
              {
                icon: TrendingUp,
                title: "Future-Ready",
                description: "Stay ahead with insights into emerging trends and in-demand skills."
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card className="p-6 text-center h-full bg-white hover:shadow-lg transition-all duration-300">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Values Section */}
        <section className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Heart,
                title: "Empathy",
                description: "Understanding each individual's unique career journey."
              },
              {
                icon: Lightbulb,
                title: "Innovation",
                description: "Leveraging cutting-edge AI technology for career success."
              },
              {
                icon: Shield,
                title: "Integrity",
                description: "Providing honest, transparent guidance and recommendations."
              },
              {
                icon: Globe,
                title: "Inclusivity",
                description: "Making career opportunities accessible to everyone, everywhere."
              }
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card className="p-6 text-center bg-white hover:shadow-lg transition-all duration-300">
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-sm text-gray-600">{value.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A diverse team of career experts, AI engineers, and passionate individuals 
              dedicated to transforming the future of work.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "CEO & Co-founder",
                bio: "Former HR executive with 15 years of experience in talent acquisition and career development.",
                location: "San Francisco, CA"
              },
              {
                name: "Dr. Michael Chen",
                role: "CTO & Co-founder",
                bio: "AI researcher and former Google engineer specializing in machine learning and natural language processing.",
                location: "Seattle, WA"
              },
              {
                name: "Emily Rodriguez",
                role: "Head of Product",
                bio: "Product leader passionate about creating user-centric career development tools.",
                location: "Austin, TX"
              }
            ].map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card className="p-6 text-center bg-white hover:shadow-lg transition-all duration-300">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm mb-3">{member.bio}</p>
                  <div className="flex items-center justify-center text-gray-500 text-sm">
                    <MapPin className="w-4 h-4 mr-1" />
                    {member.location}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center"
          >
            <h2 className="text-3xl font-bold mb-4">Get In Touch</h2>
            <p className="text-xl mb-6">
              Have questions or want to learn more? We'd love to hear from you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="outline" 
                className="bg-white text-blue-600 hover:bg-gray-50 border-white"
              >
                <Mail className="w-4 h-4 mr-2" />
                Contact Us
              </Button>
              <Button 
                variant="outline" 
                className="bg-transparent border-white text-white hover:bg-white hover:text-blue-600"
              >
                Join Our Community
              </Button>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  )
}
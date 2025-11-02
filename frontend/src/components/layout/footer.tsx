'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Sparkles, Mail, Phone, MapPin, Twitter,
  Linkedin, Instagram, Youtube, Github,
  ArrowRight, Heart
} from 'lucide-react'

const footerLinks = {
  features: [
    { name: 'AI Mentor', href: '/features/ai-mentor' },
    { name: 'Resume Analyzer', href: '/features/resume-analyzer' },
    { name: 'Resume Builder', href: '/features/resume-builder' },
    { name: 'Scholarship Finder', href: '/features/scholarships' }
  ],
  solutions: [
    { name: 'Roadmap', href: '/solutions/roadmap' },
    { name: 'AI Mock Interview', href: '/mock-interview' }
  ],
  quickLinks: [
    { name: 'Careers', href: '/careers' },
    { name: 'Resources', href: '/resources' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Dashboard', href: '/dashboard' }
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Reviews', href: '/reviews' },
    { name: 'Feedback', href: '/feedback' },
    { name: 'Contact', href: '#' }
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' }
  ]
}

const socialLinks = [
  { name: 'Twitter', href: '#', icon: Twitter },
  { name: 'LinkedIn', href: '#', icon: Linkedin },
  { name: 'Instagram', href: '#', icon: Instagram },
  { name: 'YouTube', href: '#', icon: Youtube },
  { name: 'GitHub', href: '#', icon: Github }
]


export default function Footer() {
  return (
    <footer className="relative bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-white/10">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10" />
      
      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="container mx-auto max-w-7xl px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-12">
            {/* Company Info */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-2 mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur-lg opacity-75" />
                    <div className="relative bg-white dark:bg-gray-900 rounded-lg p-2">
                      <Sparkles className="w-8 h-8 text-blue-600 dark:text-white" />
                    </div>
                  </div>
                  <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                    CareerCraft AI
                  </span>
                </Link>

                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  Empowering Indian students with AI-driven career guidance,
                  personalized learning paths, and industry connections.
                </p>

                {/* Contact Info */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-400">
                    <Mail className="w-4 h-4" />
                    <span>hello@careercraft.ai</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-400">
                    <Phone className="w-4 h-4" />
                    <span>+91 80 4000 3000</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-400">
                    <MapPin className="w-4 h-4" />
                    <span>Bangalore, Karnataka, India</span>
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex space-x-4">
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-gray-200 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/20 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all duration-300"
                    >
                      <social.icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Links Sections */}
            <div className="lg:col-span-3">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
                {/* Features */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <h3 className="text-gray-900 dark:text-white font-semibold mb-4">Features</h3>
                  <ul className="space-y-3">
                    {footerLinks.features.map((link) => (
                      <li key={link.name}>
                        <Link
                          href={link.href}
                          className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-300 flex items-center group"
                        >
                          {link.name}
                          <ArrowRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </motion.div>

                {/* Solutions */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <h3 className="text-gray-900 dark:text-white font-semibold mb-4">Solutions</h3>
                  <ul className="space-y-3">
                    {footerLinks.solutions.map((link) => (
                      <li key={link.name}>
                        <Link
                          href={link.href}
                          className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-300 flex items-center group"
                        >
                          {link.name}
                          <ArrowRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </motion.div>

                {/* Quick Links */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <h3 className="text-gray-900 dark:text-white font-semibold mb-4">Quick Links</h3>
                  <ul className="space-y-3">
                    {footerLinks.quickLinks.map((link) => (
                      <li key={link.name}>
                        <Link
                          href={link.href}
                          className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-300 flex items-center group"
                        >
                          {link.name}
                          <ArrowRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </motion.div>

                {/* Company */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <h3 className="text-gray-900 dark:text-white font-semibold mb-4">Company</h3>
                  <ul className="space-y-3">
                    {footerLinks.company.map((link) => (
                      <li key={link.name}>
                        <Link
                          href={link.href}
                          className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-300 flex items-center group"
                        >
                          {link.name}
                          <ArrowRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </motion.div>

                {/* Legal */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <h3 className="text-gray-900 dark:text-white font-semibold mb-4">Legal</h3>
                  <ul className="space-y-3">
                    {footerLinks.legal.map((link) => (
                      <li key={link.name}>
                        <Link
                          href={link.href}
                          className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-300 flex items-center group"
                        >
                          {link.name}
                          <ArrowRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Newsletter Signup */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-200 dark:border-white/10 rounded-2xl p-8 mb-12"
          >
            <div className="max-w-2xl mx-auto text-center">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Stay Updated</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Get the latest career insights, AI updates, and success stories delivered to your inbox
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 bg-white dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300">
                  Subscribe
                </button>
              </div>
            </div>
          </motion.div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 dark:border-white/10">
          <div className="container mx-auto max-w-7xl px-4 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex flex-wrap items-center gap-6 mb-4 md:mb-0">
                <p className="text-gray-600 dark:text-gray-400 text-sm flex items-center">
                  © 2025 CareerCraft AI. Made with
                  <Heart className="w-4 h-4 text-red-500 mx-1 fill-current" />
                  in India
                </p>
                <div className="flex space-x-6">
                  {footerLinks.legal.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm transition-colors duration-300"
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                <span>🇮🇳 Proudly Indian</span>
                <span>|</span>
                <span>Available in 10+ languages</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
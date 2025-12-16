'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Package, Zap, CheckCircle, Clock, Globe, Shield, Mail, ArrowLeft } from 'lucide-react'

export default function ShippingPolicy() {
  const sections = [
    {
      icon: Zap,
      title: "Digital Service Delivery",
      content: [
        {
          subtitle: "Instant Access",
          text: "CareerCraft AI is a digital platform providing online career guidance services. All our services are delivered electronically through our website and mobile applications. There is no physical shipping involved."
        },
        {
          subtitle: "Immediate Activation",
          text: "Upon successful payment, your subscription or purchased service is activated immediately. You will receive instant access to all features included in your plan without any waiting period."
        },
        {
          subtitle: "Account Access",
          text: "Access your services by logging into your account at careercraft.ai or through our mobile app. All your data, reports, and resources are available 24/7 from anywhere with an internet connection."
        },
        {
          subtitle: "No Physical Products",
          text: "We do not sell or ship any physical products. All career guidance materials, reports, analyses, and consultations are provided digitally through our platform."
        }
      ]
    },
    {
      icon: CheckCircle,
      title: "Service Delivery Timeline",
      content: [
        {
          subtitle: "Subscription Plans",
          text: "Subscription services (Monthly, Quarterly, Annual plans) are activated immediately upon payment confirmation. You can start using all premium features within minutes of purchase."
        },
        {
          subtitle: "One-Time Services",
          text: "One-time services such as resume reviews, career consultations, or mock interviews are scheduled based on availability. You will receive a booking confirmation within 2-4 hours of purchase."
        },
        {
          subtitle: "AI-Powered Features",
          text: "AI-driven services like resume analysis, career roadmaps, and personalized recommendations are generated in real-time and are available instantly upon request."
        },
        {
          subtitle: "Downloadable Resources",
          text: "Any downloadable content such as reports, certificates, or career guides are available for immediate download from your dashboard after generation."
        }
      ]
    },
    {
      icon: Globe,
      title: "Service Availability",
      content: [
        {
          subtitle: "Geographic Coverage",
          text: "Our services are available globally to anyone with an internet connection. While our platform is optimized for Indian students and professionals, users from any country can access our services."
        },
        {
          subtitle: "Platform Access",
          text: "Access CareerCraft AI through our web platform (desktop and mobile browsers) or download our mobile apps from Google Play Store and Apple App Store."
        },
        {
          subtitle: "24/7 Availability",
          text: "Our digital platform is available 24 hours a day, 7 days a week. You can access your account, use AI features, and browse resources at any time."
        },
        {
          subtitle: "Live Support Hours",
          text: "While automated features are available 24/7, live customer support and scheduled consultations are available during business hours: Monday-Friday, 9 AM - 6 PM IST."
        }
      ]
    },
    {
      icon: Clock,
      title: "Delivery Confirmation",
      content: [
        {
          subtitle: "Email Notifications",
          text: "You will receive email confirmations for all purchases, subscription activations, and service bookings. Check your registered email address for delivery confirmations and access instructions."
        },
        {
          subtitle: "In-App Notifications",
          text: "Real-time notifications are sent through our platform and mobile apps when services are ready, reports are generated, or consultations are scheduled."
        },
        {
          subtitle: "Dashboard Updates",
          text: "Your account dashboard is updated in real-time with all active services, upcoming consultations, completed analyses, and available resources."
        },
        {
          subtitle: "Confirmation Messages",
          text: "For scheduled services like mock interviews or career consultations, you will receive confirmation messages with date, time, and joining instructions at least 24 hours in advance."
        }
      ]
    },
    {
      icon: Shield,
      title: "Delivery Guarantee",
      content: [
        {
          subtitle: "Service Commitment",
          text: "We guarantee that all paid services will be delivered as described. If you experience any issues accessing your services, our support team will resolve them within 24 hours."
        },
        {
          subtitle: "Technical Issues",
          text: "In case of technical difficulties preventing service delivery, we will provide immediate support and, if necessary, extend your subscription period to compensate for the downtime."
        },
        {
          subtitle: "Quality Assurance",
          text: "All AI-generated reports and analyses undergo quality checks before delivery. Manual services like consultations are provided by verified career experts."
        },
        {
          subtitle: "Refund Policy",
          text: "If we are unable to deliver services as promised, you are eligible for a full refund as per our Cancellation and Refund Policy."
        }
      ]
    },
    {
      icon: Package,
      title: "Types of Digital Deliverables",
      content: [
        {
          subtitle: "Instant Deliverables",
          text: "AI Resume Analysis, Career Roadmaps, Skill Assessments, Course Recommendations, Scholarship Matches - Available within seconds of request."
        },
        {
          subtitle: "Scheduled Deliverables",
          text: "Mock Interview Sessions, One-on-One Career Consultations, Resume Review by Experts - Delivered on scheduled date and time with advance booking."
        },
        {
          subtitle: "Ongoing Access",
          text: "AI Mentor Chat, Learning Resources, Career Library, Job Listings, Scholarship Database - Continuous access throughout your subscription period."
        },
        {
          subtitle: "Generated Documents",
          text: "Personalized Career Reports, Interview Feedback, Skills Gap Analysis, Progress Tracking Reports - Available for download in PDF format."
        }
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-orange-50/30 to-amber-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center opacity-5 pointer-events-none" />

      <div className="relative z-10">
        {/* Header */}
        <div className="bg-gradient-to-br from-orange-600 via-amber-600 to-yellow-600 text-white py-20">
          <div className="container mx-auto max-w-6xl px-4">
            <Link
              href="/"
              className="inline-flex items-center space-x-2 text-white/80 hover:text-white mb-6 transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <Package className="w-8 h-8" />
                </div>
                <h1 className="text-5xl font-bold">Shipping & Delivery Policy</h1>
              </div>
              <p className="text-xl text-orange-100 max-w-3xl">
                Learn how we deliver our digital career guidance services instantly to users worldwide.
              </p>
              <p className="text-sm text-orange-200 mt-4">
                Last updated: January 2025
              </p>
            </motion.div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto max-w-6xl px-4 py-16">
          {/* Introduction */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8 border border-gray-200 dark:border-gray-700"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Digital Service Delivery</h2>
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-6 mb-4">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No Physical Shipping Required</h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    CareerCraft AI is a 100% digital platform. All our services, including subscriptions, consultations,
                    reports, and resources, are delivered electronically. You will receive instant access to all purchased
                    services through your online account.
                  </p>
                </div>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              This policy explains how we deliver our digital services to you, expected delivery timelines, and what to
              do if you experience any issues accessing your purchased services.
            </p>
          </motion.div>

          {/* Policy Sections */}
          <div className="space-y-8">
            {sections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * (index + 1) }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-start space-x-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <section.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {section.title}
                    </h2>
                  </div>
                </div>

                <div className="space-y-6">
                  {section.content.map((item, itemIndex) => (
                    <div key={itemIndex} className="pl-16">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {item.subtitle}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Important Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mt-8 border border-gray-200 dark:border-gray-700"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Important Notes</h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-1" />
                <p className="leading-relaxed">
                  <strong>Internet Connection Required:</strong> An active internet connection is required to access our services.
                  Ensure you have stable connectivity for the best experience.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-1" />
                <p className="leading-relaxed">
                  <strong>Email Verification:</strong> Make sure to verify your email address to receive all service notifications,
                  confirmations, and important updates.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-1" />
                <p className="leading-relaxed">
                  <strong>Browser Compatibility:</strong> For the best experience, use the latest version of Chrome, Firefox, Safari,
                  or Edge. Mobile apps are available for iOS and Android devices.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-1" />
                <p className="leading-relaxed">
                  <strong>Service Access Issues:</strong> If you experience any problems accessing your purchased services, contact
                  our support team immediately at support@careercraft.ai.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Compliance Note */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mt-8 border border-gray-200 dark:border-gray-700"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Compliance Statement</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              As a digital service provider, CareerCraft AI does not engage in physical product shipping or delivery.
              All services are delivered electronically in compliance with Indian e-commerce regulations and Consumer Protection
              (E-Commerce) Rules, 2020. Our service delivery practices adhere to IT Act 2000 and related guidelines for
              digital service provision.
            </p>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="bg-gradient-to-br from-orange-500/10 to-amber-500/10 rounded-2xl shadow-lg p-8 mt-8 border border-orange-200 dark:border-amber-500/30"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Need Assistance?</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
              If you have any questions about service delivery or need help accessing your purchased services,
              our support team is here to help:
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                <Mail className="w-5 h-5 text-orange-600" />
                <a href="mailto:support@careercraft.ai" className="hover:text-orange-600 transition-colors">
                  support@careercraft.ai
                </a>
              </div>
              <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                <Mail className="w-5 h-5 text-orange-600" />
                <a href="mailto:hello@careercraft.ai" className="hover:text-orange-600 transition-colors">
                  hello@careercraft.ai
                </a>
              </div>
            </div>
          </motion.div>

          {/* Back to Home Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.1 }}
            className="text-center mt-12"
          >
            <Link
              href="/"
              className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-orange-600 to-amber-600 text-white font-semibold rounded-xl hover:from-orange-700 hover:to-amber-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

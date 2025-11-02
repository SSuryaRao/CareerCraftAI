'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Shield, Lock, Eye, UserCheck, FileText, Mail, ArrowLeft } from 'lucide-react'

export default function PrivacyPolicy() {
  const sections = [
    {
      icon: FileText,
      title: "Information We Collect",
      content: [
        {
          subtitle: "Personal Information",
          text: "We collect information you provide directly to us, including your name, email address, phone number, educational background, career interests, and resume information when you create an account or use our services."
        },
        {
          subtitle: "Usage Information",
          text: "We automatically collect information about your interactions with our platform, including pages viewed, features used, search queries, and the time and duration of your visits."
        },
        {
          subtitle: "Device Information",
          text: "We collect information about the device you use to access our services, including hardware model, operating system, browser type, IP address, and mobile network information."
        }
      ]
    },
    {
      icon: Lock,
      title: "How We Use Your Information",
      content: [
        {
          subtitle: "Service Delivery",
          text: "We use your information to provide, maintain, and improve our AI-powered career guidance services, including personalized recommendations, resume analysis, and career roadmaps."
        },
        {
          subtitle: "Communication",
          text: "We may use your contact information to send you service updates, newsletters, career tips, scholarship opportunities, and promotional materials. You can opt out of marketing communications at any time."
        },
        {
          subtitle: "Analytics and Improvement",
          text: "We analyze usage patterns to understand how our services are used, identify trends, and improve our platform's functionality and user experience."
        }
      ]
    },
    {
      icon: Shield,
      title: "Data Security",
      content: [
        {
          subtitle: "Security Measures",
          text: "We implement industry-standard security measures to protect your personal information, including encryption, secure servers, and regular security audits."
        },
        {
          subtitle: "Data Storage",
          text: "Your data is stored on secure servers with restricted access. We use encryption both in transit and at rest to protect sensitive information."
        },
        {
          subtitle: "Third-Party Services",
          text: "We work with trusted third-party service providers who adhere to strict data protection standards. These providers only access your information as necessary to perform their functions."
        }
      ]
    },
    {
      icon: Eye,
      title: "Information Sharing",
      content: [
        {
          subtitle: "No Sale of Data",
          text: "We do not sell, rent, or trade your personal information to third parties for marketing purposes."
        },
        {
          subtitle: "Service Providers",
          text: "We may share your information with service providers who assist us in operating our platform, conducting our business, or serving our users, provided they agree to keep this information confidential."
        },
        {
          subtitle: "Legal Requirements",
          text: "We may disclose your information if required by law or in response to valid requests by public authorities."
        }
      ]
    },
    {
      icon: UserCheck,
      title: "Your Rights",
      content: [
        {
          subtitle: "Access and Correction",
          text: "You have the right to access, update, or correct your personal information at any time through your account settings."
        },
        {
          subtitle: "Data Deletion",
          text: "You can request deletion of your account and associated data. We will process such requests in accordance with applicable laws."
        },
        {
          subtitle: "Data Portability",
          text: "You have the right to request a copy of your personal data in a structured, commonly used, and machine-readable format."
        },
        {
          subtitle: "Opt-Out",
          text: "You can opt out of marketing communications and certain data collection practices through your account settings or by contacting us directly."
        }
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center opacity-5 pointer-events-none" />

      <div className="relative z-10">
        {/* Header */}
        <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white py-20">
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
                  <Shield className="w-8 h-8" />
                </div>
                <h1 className="text-5xl font-bold">Privacy Policy</h1>
              </div>
              <p className="text-xl text-blue-100 max-w-3xl">
                Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
              </p>
              <p className="text-sm text-blue-200 mt-4">
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
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Welcome to CareerCraft AI</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
              At CareerCraft AI, we are committed to protecting your privacy and ensuring the security of your personal information.
              This Privacy Policy outlines how we collect, use, store, and protect your data when you use our AI-powered career
              guidance platform.
            </p>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              By using CareerCraft AI, you agree to the collection and use of information in accordance with this policy.
              We encourage you to read this policy carefully to understand our practices regarding your personal data.
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
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
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

          {/* Additional Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mt-8 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-start space-x-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Cookies and Tracking
                </h2>
              </div>
            </div>
            <div className="pl-16 space-y-4">
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                We use cookies and similar tracking technologies to track activity on our platform and hold certain information.
                Cookies are files with a small amount of data which may include an anonymous unique identifier.
              </p>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However,
                if you do not accept cookies, you may not be able to use some portions of our service.
              </p>
            </div>
          </motion.div>

          {/* Children's Privacy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mt-8 border border-gray-200 dark:border-gray-700"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Children's Privacy</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Our service is intended for students and professionals of all ages. For users under 13 years of age,
              we require parental consent before collecting any personal information. We do not knowingly collect
              personal information from children under 13 without parental consent.
            </p>
          </motion.div>

          {/* Changes to Policy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mt-8 border border-gray-200 dark:border-gray-700"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Changes to This Privacy Policy</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the
              new Privacy Policy on this page and updating the "Last updated" date at the top of this policy.
            </p>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              We encourage you to review this Privacy Policy periodically for any changes. Changes to this Privacy
              Policy are effective when they are posted on this page.
            </p>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.1 }}
            className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl shadow-lg p-8 mt-8 border border-blue-200 dark:border-purple-500/30"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Contact Us</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
              If you have any questions or concerns about this Privacy Policy or our data practices,
              please don't hesitate to contact us:
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                <Mail className="w-5 h-5 text-blue-600" />
                <a href="mailto:privacy@careercraft.ai" className="hover:text-blue-600 transition-colors">
                  privacy@careercraft.ai
                </a>
              </div>
              <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                <Mail className="w-5 h-5 text-blue-600" />
                <span>hello@careercraft.ai</span>
              </div>
            </div>
          </motion.div>

          {/* Back to Home Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="text-center mt-12"
          >
            <Link
              href="/"
              className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
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

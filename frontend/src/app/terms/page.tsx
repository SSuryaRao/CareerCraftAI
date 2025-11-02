'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Scale, FileText, AlertCircle, Users, Shield, CreditCard, Ban, Mail, ArrowLeft } from 'lucide-react'

export default function TermsOfService() {
  const sections = [
    {
      icon: FileText,
      title: "Acceptance of Terms",
      content: [
        {
          subtitle: "Agreement to Terms",
          text: "By accessing and using CareerCraft AI, you accept and agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, please do not use our services."
        },
        {
          subtitle: "Eligibility",
          text: "You must be at least 13 years old to use our services. Users under 18 must have parental or guardian consent. By using CareerCraft AI, you represent that you meet these age requirements."
        },
        {
          subtitle: "Changes to Terms",
          text: "We reserve the right to modify these terms at any time. We will notify users of any material changes via email or through our platform. Continued use of our services after changes constitutes acceptance of the modified terms."
        }
      ]
    },
    {
      icon: Users,
      title: "User Accounts",
      content: [
        {
          subtitle: "Account Creation",
          text: "To access certain features, you must create an account. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate, current, and complete."
        },
        {
          subtitle: "Account Security",
          text: "You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must immediately notify us of any unauthorized use of your account or any other security breach."
        },
        {
          subtitle: "Account Termination",
          text: "We reserve the right to suspend or terminate your account at any time for any reason, including violation of these terms. You may also terminate your account at any time through your account settings or by contacting us."
        }
      ]
    },
    {
      icon: Shield,
      title: "Use of Services",
      content: [
        {
          subtitle: "Permitted Use",
          text: "You may use CareerCraft AI for lawful purposes only and in accordance with these terms. Our services are designed to provide career guidance, educational resources, resume analysis, and related professional development tools."
        },
        {
          subtitle: "Prohibited Activities",
          text: "You agree not to: (a) use our services for any illegal purpose; (b) attempt to gain unauthorized access to our systems; (c) interfere with or disrupt our services; (d) upload malicious code or viruses; (e) harass or harm other users; (f) impersonate any person or entity; or (g) scrape or harvest data from our platform."
        },
        {
          subtitle: "Content Accuracy",
          text: "While we strive to provide accurate and helpful career guidance, our AI-powered recommendations are for informational purposes only. We do not guarantee employment outcomes, admission to educational institutions, or any specific career results."
        }
      ]
    },
    {
      icon: FileText,
      title: "Intellectual Property",
      content: [
        {
          subtitle: "Our Content",
          text: "All content on CareerCraft AI, including text, graphics, logos, icons, images, audio clips, digital downloads, data compilations, and software, is our property or that of our content suppliers and is protected by intellectual property laws."
        },
        {
          subtitle: "User Content",
          text: "You retain ownership of any content you submit to our platform, including resumes, personal information, and other materials. By submitting content, you grant us a license to use, store, and process such content to provide our services."
        },
        {
          subtitle: "License to Use",
          text: "We grant you a limited, non-exclusive, non-transferable license to access and use our services for personal, non-commercial purposes. This license does not include any resale or commercial use of our services or content."
        }
      ]
    },
    {
      icon: CreditCard,
      title: "Payments and Subscriptions",
      content: [
        {
          subtitle: "Pricing",
          text: "Certain features of CareerCraft AI require payment. All prices are displayed in Indian Rupees (INR) or other applicable currency and are subject to change. We will notify you of any price changes in advance."
        },
        {
          subtitle: "Billing",
          text: "For subscription services, you authorize us to charge your payment method on a recurring basis. Payments are non-refundable except as required by law or as explicitly stated in our refund policy."
        },
        {
          subtitle: "Free Trial",
          text: "We may offer free trials for certain paid features. By signing up for a free trial, you agree to be charged for the subscription if you do not cancel before the trial period ends. We will notify you before charging your payment method."
        },
        {
          subtitle: "Cancellation",
          text: "You may cancel your subscription at any time through your account settings. Cancellation will take effect at the end of your current billing period, and you will retain access to paid features until that time."
        }
      ]
    },
    {
      icon: Ban,
      title: "Disclaimers and Limitations",
      content: [
        {
          subtitle: "No Warranty",
          text: "Our services are provided 'as is' and 'as available' without any warranties of any kind, either express or implied. We do not warrant that our services will be uninterrupted, timely, secure, or error-free."
        },
        {
          subtitle: "Career Guidance Disclaimer",
          text: "The career advice, recommendations, and information provided by CareerCraft AI are for general informational purposes only and should not be considered as professional career counseling, legal advice, or a guarantee of any specific outcome."
        },
        {
          subtitle: "Limitation of Liability",
          text: "To the fullest extent permitted by law, CareerCraft AI shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly."
        },
        {
          subtitle: "Third-Party Services",
          text: "Our platform may contain links to third-party websites or services. We are not responsible for the content, accuracy, or practices of any third-party sites. Use of third-party services is at your own risk."
        }
      ]
    },
    {
      icon: Scale,
      title: "Dispute Resolution",
      content: [
        {
          subtitle: "Governing Law",
          text: "These terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions."
        },
        {
          subtitle: "Dispute Resolution Process",
          text: "In the event of any dispute arising from these terms or your use of our services, you agree to first attempt to resolve the dispute informally by contacting us. If the dispute cannot be resolved informally, it shall be resolved through binding arbitration in accordance with Indian arbitration laws."
        },
        {
          subtitle: "Class Action Waiver",
          text: "You agree that any dispute resolution proceedings will be conducted only on an individual basis and not in a class, consolidated, or representative action."
        }
      ]
    },
    {
      icon: AlertCircle,
      title: "Indemnification",
      content: [
        {
          subtitle: "User Indemnification",
          text: "You agree to indemnify, defend, and hold harmless CareerCraft AI, its officers, directors, employees, agents, and affiliates from any claims, liabilities, damages, losses, and expenses, including reasonable attorneys' fees, arising from your use of our services or violation of these terms."
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
        <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white py-20">
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
                  <Scale className="w-8 h-8" />
                </div>
                <h1 className="text-5xl font-bold">Terms of Service</h1>
              </div>
              <p className="text-xl text-purple-100 max-w-3xl">
                Please read these terms carefully before using CareerCraft AI. These terms govern your use of our platform and services.
              </p>
              <p className="text-sm text-purple-200 mt-4">
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
              These Terms of Service ("Terms") govern your access to and use of CareerCraft AI's website, mobile applications,
              and related services (collectively, the "Services"). CareerCraft AI is an AI-powered career guidance platform
              designed to help students and professionals in India navigate their career paths.
            </p>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              By accessing or using our Services, you agree to be bound by these Terms and our Privacy Policy. If you do not
              agree to these Terms, you may not access or use our Services. Please read these Terms carefully.
            </p>
          </motion.div>

          {/* Terms Sections */}
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
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
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

          {/* Additional Sections */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mt-8 border border-gray-200 dark:border-gray-700"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Data Protection and Privacy</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
              Your privacy is important to us. Our collection and use of personal information in connection with your
              use of our Services is described in our Privacy Policy. By using our Services, you consent to the
              collection and use of your information as described in the Privacy Policy.
            </p>
            <Link
              href="/privacy"
              className="inline-flex items-center text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-semibold transition-colors"
            >
              Read our Privacy Policy
              <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mt-8 border border-gray-200 dark:border-gray-700"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Severability</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              If any provision of these Terms is found to be unenforceable or invalid, that provision will be limited
              or eliminated to the minimum extent necessary so that these Terms will otherwise remain in full force
              and effect and enforceable.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mt-8 border border-gray-200 dark:border-gray-700"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Entire Agreement</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              These Terms, together with our Privacy Policy, constitute the entire agreement between you and
              CareerCraft AI regarding your use of our Services and supersede all prior agreements and understandings,
              whether written or oral, regarding such subject matter.
            </p>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-2xl shadow-lg p-8 mt-8 border border-indigo-200 dark:border-purple-500/30"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Questions About These Terms?</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
              If you have any questions, concerns, or comments about these Terms of Service, please don't
              hesitate to contact us:
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                <Mail className="w-5 h-5 text-indigo-600" />
                <a href="mailto:legal@careercraft.ai" className="hover:text-indigo-600 transition-colors">
                  legal@careercraft.ai
                </a>
              </div>
              <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                <Mail className="w-5 h-5 text-indigo-600" />
                <a href="mailto:hello@careercraft.ai" className="hover:text-indigo-600 transition-colors">
                  hello@careercraft.ai
                </a>
              </div>
            </div>
          </motion.div>

          {/* Back to Home Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.3 }}
            className="text-center mt-12"
          >
            <Link
              href="/"
              className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
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

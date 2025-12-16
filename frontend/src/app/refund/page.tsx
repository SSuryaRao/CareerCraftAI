'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { RefreshCw, XCircle, CheckCircle, Clock, CreditCard, AlertCircle, Mail, ArrowLeft } from 'lucide-react'

export default function RefundPolicy() {
  const sections = [
    {
      icon: CheckCircle,
      title: "Refund Eligibility",
      content: [
        {
          subtitle: "Subscription Services",
          text: "You may request a full refund within 7 days of your initial subscription purchase if you are not satisfied with our services. After 7 days, refunds will be prorated based on the remaining subscription period."
        },
        {
          subtitle: "One-Time Purchases",
          text: "For one-time purchases such as individual resume reviews or career consultations, refunds can be requested within 48 hours of purchase if the service has not been delivered or utilized."
        },
        {
          subtitle: "Technical Issues",
          text: "If you experience technical issues that prevent you from accessing our services, and we are unable to resolve the issue within 72 hours, you are eligible for a full refund regardless of the subscription period."
        },
        {
          subtitle: "Non-Refundable Items",
          text: "Completed services, downloaded resources, and services used beyond the refund period are non-refundable. Credits purchased or earned cannot be refunded for cash."
        }
      ]
    },
    {
      icon: XCircle,
      title: "Cancellation Policy",
      content: [
        {
          subtitle: "How to Cancel",
          text: "You can cancel your subscription at any time through your account settings by navigating to 'Subscription Management' and clicking 'Cancel Subscription'. Alternatively, you can contact our support team at hello@careercraft.ai to process your cancellation."
        },
        {
          subtitle: "Cancellation Effect",
          text: "When you cancel your subscription, you will retain access to all premium features until the end of your current billing period. No further charges will be made after cancellation."
        },
        {
          subtitle: "Immediate Cancellation",
          text: "If you wish to cancel immediately and receive a prorated refund for the unused portion of your subscription, please contact our support team within 7 days of your billing date."
        },
        {
          subtitle: "Reactivation",
          text: "You can reactivate your subscription at any time. Your previous settings and data will be preserved for up to 90 days after cancellation."
        }
      ]
    },
    {
      icon: RefreshCw,
      title: "Refund Process",
      content: [
        {
          subtitle: "How to Request a Refund",
          text: "To request a refund, please email us at refunds@careercraft.ai with your order ID, account email, and reason for the refund request. Our team will review your request within 2-3 business days."
        },
        {
          subtitle: "Refund Timeline",
          text: "Once approved, refunds will be processed within 5-7 business days. The refund will be credited to your original payment method. Depending on your bank or payment provider, it may take an additional 3-5 business days for the amount to reflect in your account."
        },
        {
          subtitle: "Refund Method",
          text: "All refunds will be processed through the original payment method used for the purchase. We do not provide refunds in alternative forms such as credits, gift cards, or cash (except for credit-based refunds)."
        },
        {
          subtitle: "Partial Refunds",
          text: "In some cases, we may offer partial refunds based on the services utilized. For example, if you cancel mid-billing cycle, you may receive a prorated refund for the unused days."
        }
      ]
    },
    {
      icon: Clock,
      title: "Billing Cycle and Charges",
      content: [
        {
          subtitle: "Subscription Billing",
          text: "Subscriptions are billed on a recurring basis according to the plan you selected (monthly, quarterly, or annually). You will be charged automatically at the start of each billing period."
        },
        {
          subtitle: "Price Changes",
          text: "We will notify you at least 30 days in advance of any price changes to your subscription. The new price will take effect at your next billing cycle. You may cancel your subscription before the price change takes effect."
        },
        {
          subtitle: "Failed Payments",
          text: "If your payment fails, we will attempt to charge your payment method up to 3 times over a 10-day period. If all attempts fail, your subscription will be suspended, and you will need to update your payment information to reactivate."
        },
        {
          subtitle: "No Hidden Fees",
          text: "We do not charge any hidden fees or additional charges beyond your subscription price. All applicable taxes will be clearly displayed before you complete your purchase."
        }
      ]
    },
    {
      icon: CreditCard,
      title: "Payment Methods",
      content: [
        {
          subtitle: "Accepted Payment Methods",
          text: "We accept all major credit and debit cards (Visa, Mastercard, American Express, RuPay), UPI, net banking, and digital wallets through our secure payment partner Razorpay."
        },
        {
          subtitle: "Payment Security",
          text: "All payments are processed through Razorpay's secure payment gateway. We do not store your credit card information on our servers. Your payment information is encrypted and handled in compliance with PCI DSS standards."
        },
        {
          subtitle: "Currency",
          text: "All prices are displayed in Indian Rupees (INR) unless otherwise specified. International customers may see prices converted to their local currency, subject to exchange rates and payment provider fees."
        }
      ]
    },
    {
      icon: AlertCircle,
      title: "Special Circumstances",
      content: [
        {
          subtitle: "Service Discontinuation",
          text: "In the unlikely event that we discontinue our services, all active subscribers will receive a full refund for any unused portion of their subscription, along with at least 60 days advance notice."
        },
        {
          subtitle: "Account Termination by Us",
          text: "If we terminate your account due to violation of our Terms of Service, no refund will be provided. However, if we terminate your account in error, you will receive a full refund."
        },
        {
          subtitle: "Disputes",
          text: "If you have any disputes regarding charges or refunds, please contact us first at refunds@careercraft.ai. We are committed to resolving all disputes fairly and promptly."
        },
        {
          subtitle: "Chargebacks",
          text: "We encourage you to contact us before initiating a chargeback with your bank. Chargebacks may result in immediate account suspension. We will work with you to resolve any billing issues directly."
        }
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-green-50/30 to-blue-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center opacity-5 pointer-events-none" />

      <div className="relative z-10">
        {/* Header */}
        <div className="bg-gradient-to-br from-green-600 via-teal-600 to-blue-700 text-white py-20">
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
                  <RefreshCw className="w-8 h-8" />
                </div>
                <h1 className="text-5xl font-bold">Cancellation & Refund Policy</h1>
              </div>
              <p className="text-xl text-green-100 max-w-3xl">
                We want you to be completely satisfied with our services. Learn about our cancellation and refund policies.
              </p>
              <p className="text-sm text-green-200 mt-4">
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
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Commitment to You</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
              At CareerCraft AI, we strive to provide the best career guidance services. We understand that sometimes
              our services may not meet your expectations, and we want to make the cancellation and refund process as
              transparent and straightforward as possible.
            </p>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              This policy outlines the terms and conditions for cancellations, refunds, and billing. Please read this
              policy carefully before making a purchase.
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
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
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

          {/* Compliance Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mt-8 border border-gray-200 dark:border-gray-700"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Regulatory Compliance</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
              Our refund and cancellation policies comply with Indian consumer protection laws, RBI guidelines for payment aggregators,
              and applicable e-commerce regulations. All refunds are processed in accordance with the Payment and Settlement Systems Act 2007
              and Consumer Protection Act 2019.
            </p>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Refunds are processed through Razorpay, our authorized payment aggregator, ensuring secure and compliant transaction handling.
              Processing times may vary based on your bank or payment provider's policies.
            </p>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-2xl shadow-lg p-8 mt-8 border border-green-200 dark:border-blue-500/30"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Need Help?</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
              If you have any questions about our cancellation or refund policy, or need assistance with a refund request,
              please don't hesitate to contact us:
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                <Mail className="w-5 h-5 text-green-600" />
                <a href="mailto:refunds@careercraft.ai" className="hover:text-green-600 transition-colors">
                  refunds@careercraft.ai
                </a>
              </div>
              <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                <Mail className="w-5 h-5 text-green-600" />
                <a href="mailto:hello@careercraft.ai" className="hover:text-green-600 transition-colors">
                  hello@careercraft.ai
                </a>
              </div>
            </div>
          </motion.div>

          {/* Back to Home Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="text-center mt-12"
          >
            <Link
              href="/"
              className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
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

'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import RazorpayCheckout from '@/components/payment/RazorpayCheckout'
import { useAuth } from '@/components/auth-provider'
import {
  Check, X, Star, Zap, Crown, Gift, Users, MessageSquare,
  BookOpen, Target, TrendingUp, Award, Calendar, Phone,
  ChevronRight, Sparkles, Shield, Clock
} from 'lucide-react'

const pricingPlans = [
  {
    id: 'free',
    name: 'Free',
    price: '₹0',
    period: '/month',
    description: 'Perfect for students exploring career options',
    popular: false,
    features: [
      { name: 'Basic career assessment', included: true },
      { name: '30 AI mentor conversations/month', included: true },
      { name: 'Access to free resources', included: true },
      { name: '5 Resume analysis/month', included: true },
      { name: '10 Mock interviews/month', included: true },
      { name: 'Advanced analytics', included: false },
      { name: 'Intelligent interviews', included: false },
      { name: 'Learning paths', included: false },
      { name: 'Priority support', included: false },
      { name: '1:1 mentor sessions', included: false }
    ],
    buttonText: 'Get Started Free',
    buttonVariant: 'outline' as const
  },
  {
    id: 'student',
    name: 'Starter',
    price: '₹399',
    period: '/month',
    originalPrice: '₹799',
    description: 'Best for students serious about career growth',
    popular: true,
    features: [
      { name: '100 AI mentor conversations/month', included: true },
      { name: '15 Resume analysis/month', included: true },
      { name: '25 Mock interviews/month', included: true },
      { name: '5 Intelligent interviews/month', included: true },
      { name: '1 Video interview (3 min)/month', included: true },
      { name: '3 Personalized learning paths', included: true },
      { name: '5 Custom roadmaps/month', included: true },
      { name: 'Priority email support', included: true },
      { name: 'Advanced career analytics', included: true },
      { name: '10 Scholarship matches/month', included: true }
    ],
    buttonText: 'Start Learning',
    buttonVariant: 'default' as const
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '₹799',
    period: '/month',
    originalPrice: '₹1,299',
    description: 'Ideal for serious career growth and development',
    popular: false,
    features: [
      { name: 'Unlimited resume analysis', included: true },
      { name: 'Unlimited AI mentor conversations', included: true },
      { name: '20 Intelligent interviews (text+audio)', included: true },
      { name: '1 Video interview analysis/month', included: true },
      { name: 'Personalized career roadmaps', included: true },
      { name: 'Advanced skill gap analysis', included: true },
      { name: 'Priority email support', included: true },
      { name: 'Interview preparation tools', included: true },
      { name: 'Salary negotiation guidance', included: true },
      { name: 'Career progress tracking', included: true }
    ],
    buttonText: 'Start Premium',
    buttonVariant: 'default' as const
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '₹1,999',
    period: '/month',
    originalPrice: '₹3,999',
    description: 'For professionals and career changers',
    popular: false,
    features: [
      { name: 'Everything in Premium', included: true },
      { name: '10 Video interview analysis/month', included: true },
      { name: 'Unlimited intelligent interviews', included: true },
      { name: '2x 1:1 mentor sessions/month', included: true },
      { name: 'LinkedIn profile optimization', included: true },
      { name: 'Personal branding guidance', included: true },
      { name: 'Job placement assistance', included: true },
      { name: 'Resume optimization by experts', included: true },
      { name: 'Priority job matching', included: true },
      { name: '24/7 phone & chat support', included: true }
    ],
    buttonText: 'Go Pro',
    buttonVariant: 'default' as const
  }
]

const additionalServices = [
  {
    name: 'Career Coaching Session',
    price: '₹2,999',
    duration: '90 minutes',
    description: 'One-on-one career guidance with industry experts',
    icon: Users
  },
  {
    name: 'Resume Makeover',
    price: '₹1,499',
    duration: '3-5 days',
    description: 'Professional resume redesign and ATS optimization',
    icon: BookOpen
  },
  {
    name: 'Mock Interview Pack',
    price: '₹999',
    duration: '3 sessions',
    description: 'Practice interviews with feedback from professionals',
    icon: MessageSquare
  },
  {
    name: 'LinkedIn Optimization',
    price: '₹799',
    duration: '1-2 days',
    description: 'Complete LinkedIn profile optimization for visibility',
    icon: Target
  }
]

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Software Engineer at Microsoft',
    image: '/placeholder-avatar.jpg',
    quote: 'CareerCraft helped me transition from mechanical to software engineering. The roadmap was spot-on!',
    rating: 5
  },
  {
    name: 'Rahul Gupta',
    role: 'Product Manager at Flipkart',
    image: '/placeholder-avatar.jpg',
    quote: 'The Premium plan gave me insights I never knew I needed. Landed my dream job within 3 months.',
    rating: 5
  },
  {
    name: 'Sneha Patel',
    role: 'Data Scientist at Paytm',
    image: '/placeholder-avatar.jpg',
    quote: 'Amazing mentorship and resources. The Pro plan was worth every penny for career acceleration.',
    rating: 5
  }
]

const faqs = [
  {
    question: 'Can I cancel my subscription anytime?',
    answer: 'Yes, you can cancel your subscription at any time. Your access will continue until the end of your current billing period.'
  },
  {
    question: 'Is there a free trial for premium plans?',
    answer: 'Yes, we offer a 7-day free trial for both Premium and Pro plans. No credit card required to start.'
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit/debit cards, UPI, Net Banking, and digital wallets like Paytm, PhonePe, and Google Pay.'
  },
  {
    question: 'Do you offer student discounts?',
    answer: 'Yes! Students with valid ID can get 40% off on all premium plans. Contact our support team for verification.'
  },
  {
    question: 'What if I need more mentor sessions?',
    answer: 'You can purchase additional mentor sessions at ₹1,999 each, or upgrade to the Pro plan for unlimited sessions.'
  }
]

export default function PricingPage() {
  const { user } = useAuth()
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly')
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [currentPlan, setCurrentPlan] = useState<string>('free')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCurrentPlan = async () => {
      if (!user) {
        setCurrentPlan('free')
        setLoading(false)
        return
      }

      try {
        const token = await user.getIdToken()
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          setCurrentPlan(data.data?.subscription?.plan || 'free')
        }
      } catch (error) {
        console.error('Error fetching current plan:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCurrentPlan()
  }, [user])

  const getYearlyPrice = (monthlyPrice: string) => {
    const price = parseInt(monthlyPrice.replace('₹', '').replace(',', ''))
    const yearlyPrice = price * 10 // 2 months free on yearly
    return `₹${yearlyPrice.toLocaleString()}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950/20">
      <Navbar variant="transparent" />

      {/* Hero Section */}
      <section className="pt-24 pb-12 gradient-test-4 text-white relative overflow-hidden">
        {/* Dark overlay for better text visibility */}
        <div className="absolute inset-0 bg-black/10"></div>

        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl float-slow"></div>
          <div className="absolute top-3/4 right-1/4 w-48 h-48 bg-blue-300/10 rounded-full blur-2xl float-delay-1"></div>
          <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-purple-300/10 rounded-full blur-xl float-delay-2"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span className="text-sm font-medium">Limited Time: 2 Months Free on Annual Plans</span>
            </div>

            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Choose Your Success Plan
            </h1>
            <p className="text-xl text-white/95 max-w-3xl mx-auto mb-8">
              Accelerate your career journey with personalized guidance, expert mentorship,
              and AI-powered insights tailored for Indian professionals.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center space-x-4 mb-12">
              <span className={`text-sm ${billingPeriod === 'monthly' ? 'text-white' : 'text-gray-400'}`}>
                Monthly
              </span>
              <button
                onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
                className="relative w-12 h-6 bg-white/20 rounded-full transition-colors"
              >
                <div 
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    billingPeriod === 'yearly' ? 'translate-x-6' : ''
                  }`}
                />
              </button>
              <div className="flex items-center space-x-2">
                <span className={`text-sm ${billingPeriod === 'yearly' ? 'text-white' : 'text-gray-400'}`}>
                  Yearly
                </span>
                <Badge className="bg-green-500 text-white text-xs">Save 20%</Badge>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Current Plan Banner */}
        {!loading && currentPlan !== 'free' && user && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-2 border-green-200 dark:border-green-800 rounded-2xl"
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    You're on the {currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)} Plan
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Enjoying unlimited access to premium features
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => window.location.href = '/dashboard'}
                className="border-green-500 text-green-700 hover:bg-green-50 dark:border-green-600 dark:text-green-400 dark:hover:bg-green-950/20"
              >
                View Dashboard
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="relative"
            >
              <div className={`relative bg-white dark:bg-slate-800 rounded-3xl p-8 h-full transition-all duration-500 border-2 ${
                currentPlan === plan.id
                  ? 'border-green-500 dark:border-green-400 shadow-2xl shadow-green-500/20'
                  : plan.popular
                    ? 'border-indigo-500 dark:border-indigo-400 shadow-2xl shadow-indigo-500/20'
                    : 'border-gray-200 dark:border-slate-600 hover:border-indigo-300 dark:hover:border-indigo-500'
              } overflow-hidden hover:shadow-2xl`}>
                {plan.popular && currentPlan !== plan.id && (
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/20 dark:to-purple-950/20"></div>
                )}
                {currentPlan === plan.id && (
                  <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:from-green-950/20 dark:to-emerald-950/20"></div>
                )}
                <div className="relative text-center mb-8">
                  {currentPlan === plan.id && (
                    <Badge className="mb-3 bg-green-500 text-white hover:bg-green-600">
                      <Crown className="w-3 h-3 mr-1" />
                      Current Plan
                    </Badge>
                  )}
                  {plan.popular && currentPlan !== plan.id && (
                    <Badge className="mb-3 bg-indigo-500 text-white hover:bg-indigo-600">
                      <Star className="w-3 h-3 mr-1" />
                      Most Popular
                    </Badge>
                  )}
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{plan.description}</p>

                  <div className="flex items-baseline justify-center mb-4">
                    <span className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                      {billingPeriod === 'yearly' && plan.price !== '₹0' ? getYearlyPrice(plan.price) : plan.price}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400 ml-1">
                      {billingPeriod === 'yearly' && plan.price !== '₹0' ? '/year' : plan.period}
                    </span>
                  </div>

                  {plan.originalPrice && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <span className="line-through">
                        {billingPeriod === 'yearly' ? getYearlyPrice(plan.originalPrice) : plan.originalPrice}
                      </span>
                      <span className="ml-2 text-green-600 dark:text-green-400 font-semibold">
                        Save {Math.round(((parseInt(plan.originalPrice.replace('₹', '').replace(',', '')) - parseInt(plan.price.replace('₹', '').replace(',', ''))) / parseInt(plan.originalPrice.replace('₹', '').replace(',', ''))) * 100)}%
                      </span>
                    </p>
                  )}
                  
                  {currentPlan === plan.id ? (
                    <Button
                      className="w-full"
                      variant="outline"
                      size="lg"
                      disabled
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Current Plan
                    </Button>
                  ) : plan.id === 'free' ? (
                    <Button
                      className="w-full"
                      variant={plan.buttonVariant}
                      size="lg"
                      onClick={() => window.location.href = '/signup'}
                    >
                      {plan.buttonText}
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <RazorpayCheckout
                      plan={`${plan.id}_${billingPeriod}` as any}
                      buttonText={
                        currentPlan === 'free'
                          ? plan.buttonText
                          : currentPlan === 'premium' && plan.id === 'pro'
                            ? 'Upgrade to Pro'
                            : plan.buttonText
                      }
                      buttonVariant={plan.buttonVariant}
                      className={`w-full ${plan.popular ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' : ''}`}
                    />
                  )}
                </div>


                <div className="relative space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-3">
                      {feature.included ? (
                        <Check className="w-5 h-5 text-green-500 dark:text-green-400 flex-shrink-0" />
                      ) : (
                        <X className="w-5 h-5 text-gray-300 dark:text-gray-600 flex-shrink-0" />
                      )}
                      <span className={`text-sm ${feature.included ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400 dark:text-gray-500'}`}>
                        {feature.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Services */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Add-on Services
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
              Boost your career growth with our expert-led additional services.
              Perfect for specific needs and one-time requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {additionalServices.map((service, index) => (
              <motion.div
                key={service.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <div className="relative bg-white dark:bg-slate-800 rounded-3xl p-6 text-center hover:shadow-2xl transition-all duration-500 border-2 border-gray-200 dark:border-slate-600 hover:border-indigo-300 dark:hover:border-indigo-500 h-full">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <service.icon className="w-6 h-6 text-blue-600 dark:text-blue-300" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{service.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{service.description}</p>
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">{service.price}</div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{service.duration}</p>
                  <Button variant="outline" className="w-full dark:border-slate-500 dark:text-gray-200 dark:hover:bg-slate-700">
                    Get Started
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Success Stories
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
              See how CareerCraft has transformed careers of thousands of professionals across India.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <div className="relative bg-white dark:bg-slate-800 rounded-3xl p-6 hover:shadow-2xl transition-all duration-500 border-2 border-gray-200 dark:border-slate-600 h-full">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-4 italic">"{testimonial.quote}"</p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white font-semibold text-sm">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-gray-100">{testimonial.name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
              Got questions? We've got answers. If you have other questions, feel free to contact our support team.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="relative bg-white dark:bg-slate-800 rounded-2xl border-2 border-gray-200 dark:border-slate-600 overflow-hidden">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <span className="font-semibold text-gray-900 dark:text-gray-100">{faq.question}</span>
                  <ChevronRight className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform ${expandedFaq === index ? 'rotate-90' : ''}`} />
                </button>
                {expandedFaq === index && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-600 dark:text-gray-300">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section>
          <div className="relative overflow-hidden p-12 text-center bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-900 dark:via-purple-900 dark:to-pink-900 text-white rounded-3xl shadow-2xl border-2 border-transparent">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
            <div className="relative max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 mb-6">
                <Sparkles className="w-4 h-4 text-yellow-300" />
                <span className="text-sm font-medium">Limited Time Offer</span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">Ready to Accelerate Your Career?</h2>
              <p className="text-white/90 mb-8 text-lg">
                Join thousands of professionals who have transformed their careers with CareerCraft AI.
                Start your journey today with a free trial.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 shadow-lg">
                  <Zap className="w-5 h-5 mr-2" />
                  Start Free Trial
                </Button>
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/20 backdrop-blur-sm">
                  <Phone className="w-5 h-5 mr-2" />
                  Schedule Demo
                </Button>
              </div>
              <p className="text-sm text-white/90 mt-6 flex items-center justify-center gap-4 flex-wrap">
                <span className="flex items-center gap-1">
                  <Shield className="w-4 h-4" />
                  No credit card required
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  7-day free trial
                </span>
                <span className="flex items-center gap-1">
                  <Check className="w-4 h-4" />
                  Cancel anytime
                </span>
              </p>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  )
}
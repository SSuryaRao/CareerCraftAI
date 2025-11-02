'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Sparkles,
  Code,
  Server,
  Database,
  Shield,
  Smartphone,
  Cloud,
  Network,
  Monitor,
  Briefcase,
  CheckCircle,
  Zap,
  Star,
  TrendingUp,
  Award
} from 'lucide-react'
import { intelligentInterviewApi, Domain } from '@/lib/intelligentInterviewApi'

interface DomainSelectorProps {
  onStartSession: (domainId: string, level: string, questionCount: number, analysisMode: 'standard' | 'advanced') => void
}

const categoryIcons: { [key: string]: any } = {
  technical: Code,
  it: Monitor,
  business: Briefcase
}

const categoryColors: { [key: string]: { gradient: string; border: string; bg: string; iconBg: string } } = {
  technical: {
    gradient: 'from-blue-50 via-cyan-50 to-blue-50',
    border: 'border-blue-500',
    bg: 'bg-gradient-to-br from-blue-500 to-cyan-600',
    iconBg: 'group-hover:from-blue-100 group-hover:to-cyan-100'
  },
  it: {
    gradient: 'from-emerald-50 via-teal-50 to-emerald-50',
    border: 'border-emerald-500',
    bg: 'bg-gradient-to-br from-emerald-500 to-teal-600',
    iconBg: 'group-hover:from-emerald-100 group-hover:to-teal-100'
  },
  business: {
    gradient: 'from-orange-50 via-amber-50 to-orange-50',
    border: 'border-orange-500',
    bg: 'bg-gradient-to-br from-orange-500 to-amber-600',
    iconBg: 'group-hover:from-orange-100 group-hover:to-amber-100'
  }
}

const domainIcons: { [key: string]: any } = {
  'software-engineering-frontend': Code,
  'software-engineering-backend': Server,
  'software-engineering-fullstack': Code,
  'data-science-ml': Database,
  'devops-sre': Cloud,
  'cloud-architecture': Cloud,
  'cybersecurity': Shield,
  'mobile-development': Smartphone,
  'database-engineering': Database,
  'it-support': Monitor,
  'network-administration': Network,
  'systems-administration': Server,
  'database-administration': Database,
  'it-project-management': Briefcase,
  'business-analysis': Briefcase,
  'qa-testing': CheckCircle,
  'product-management': Briefcase,
  'ui-ux-design': Sparkles
}

const domainColors: { [key: string]: { gradient: string; border: string; iconBg: string; iconHoverBg: string; badgeBg: string; textColor: string } } = {
  'software-engineering-frontend': {
    gradient: 'from-blue-50 via-indigo-50 to-purple-50',
    border: 'border-blue-500',
    iconBg: 'bg-gradient-to-br from-blue-500 to-indigo-600',
    iconHoverBg: 'group-hover:from-blue-100 group-hover:to-indigo-100',
    badgeBg: 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border-blue-200',
    textColor: 'text-blue-700'
  },
  'software-engineering-backend': {
    gradient: 'from-green-50 via-emerald-50 to-teal-50',
    border: 'border-green-500',
    iconBg: 'bg-gradient-to-br from-green-500 to-emerald-600',
    iconHoverBg: 'group-hover:from-green-100 group-hover:to-emerald-100',
    badgeBg: 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-200',
    textColor: 'text-green-700'
  },
  'software-engineering-fullstack': {
    gradient: 'from-violet-50 via-purple-50 to-fuchsia-50',
    border: 'border-violet-500',
    iconBg: 'bg-gradient-to-br from-violet-500 to-purple-600',
    iconHoverBg: 'group-hover:from-violet-100 group-hover:to-purple-100',
    badgeBg: 'bg-gradient-to-r from-violet-100 to-purple-100 text-violet-700 border-violet-200',
    textColor: 'text-violet-700'
  },
  'data-science-ml': {
    gradient: 'from-amber-50 via-orange-50 to-red-50',
    border: 'border-amber-500',
    iconBg: 'bg-gradient-to-br from-amber-500 to-orange-600',
    iconHoverBg: 'group-hover:from-amber-100 group-hover:to-orange-100',
    badgeBg: 'bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 border-amber-200',
    textColor: 'text-amber-700'
  },
  'devops-sre': {
    gradient: 'from-cyan-50 via-sky-50 to-blue-50',
    border: 'border-cyan-500',
    iconBg: 'bg-gradient-to-br from-cyan-500 to-sky-600',
    iconHoverBg: 'group-hover:from-cyan-100 group-hover:to-sky-100',
    badgeBg: 'bg-gradient-to-r from-cyan-100 to-sky-100 text-cyan-700 border-cyan-200',
    textColor: 'text-cyan-700'
  },
  'cloud-architecture': {
    gradient: 'from-sky-50 via-blue-50 to-indigo-50',
    border: 'border-sky-500',
    iconBg: 'bg-gradient-to-br from-sky-500 to-blue-600',
    iconHoverBg: 'group-hover:from-sky-100 group-hover:to-blue-100',
    badgeBg: 'bg-gradient-to-r from-sky-100 to-blue-100 text-sky-700 border-sky-200',
    textColor: 'text-sky-700'
  },
  'cybersecurity': {
    gradient: 'from-red-50 via-rose-50 to-pink-50',
    border: 'border-red-500',
    iconBg: 'bg-gradient-to-br from-red-500 to-rose-600',
    iconHoverBg: 'group-hover:from-red-100 group-hover:to-rose-100',
    badgeBg: 'bg-gradient-to-r from-red-100 to-rose-100 text-red-700 border-red-200',
    textColor: 'text-red-700'
  },
  'mobile-development': {
    gradient: 'from-fuchsia-50 via-pink-50 to-rose-50',
    border: 'border-fuchsia-500',
    iconBg: 'bg-gradient-to-br from-fuchsia-500 to-pink-600',
    iconHoverBg: 'group-hover:from-fuchsia-100 group-hover:to-pink-100',
    badgeBg: 'bg-gradient-to-r from-fuchsia-100 to-pink-100 text-fuchsia-700 border-fuchsia-200',
    textColor: 'text-fuchsia-700'
  },
  'database-engineering': {
    gradient: 'from-lime-50 via-green-50 to-emerald-50',
    border: 'border-lime-500',
    iconBg: 'bg-gradient-to-br from-lime-500 to-green-600',
    iconHoverBg: 'group-hover:from-lime-100 group-hover:to-green-100',
    badgeBg: 'bg-gradient-to-r from-lime-100 to-green-100 text-lime-700 border-lime-200',
    textColor: 'text-lime-700'
  },
  'it-support': {
    gradient: 'from-teal-50 via-cyan-50 to-sky-50',
    border: 'border-teal-500',
    iconBg: 'bg-gradient-to-br from-teal-500 to-cyan-600',
    iconHoverBg: 'group-hover:from-teal-100 group-hover:to-cyan-100',
    badgeBg: 'bg-gradient-to-r from-teal-100 to-cyan-100 text-teal-700 border-teal-200',
    textColor: 'text-teal-700'
  },
  'network-administration': {
    gradient: 'from-indigo-50 via-blue-50 to-cyan-50',
    border: 'border-indigo-500',
    iconBg: 'bg-gradient-to-br from-indigo-500 to-blue-600',
    iconHoverBg: 'group-hover:from-indigo-100 group-hover:to-blue-100',
    badgeBg: 'bg-gradient-to-r from-indigo-100 to-blue-100 text-indigo-700 border-indigo-200',
    textColor: 'text-indigo-700'
  },
  'systems-administration': {
    gradient: 'from-slate-50 via-gray-50 to-zinc-50',
    border: 'border-slate-500',
    iconBg: 'bg-gradient-to-br from-slate-500 to-gray-600',
    iconHoverBg: 'group-hover:from-slate-100 group-hover:to-gray-100',
    badgeBg: 'bg-gradient-to-r from-slate-100 to-gray-100 text-slate-700 border-slate-200',
    textColor: 'text-slate-700'
  },
  'database-administration': {
    gradient: 'from-emerald-50 via-green-50 to-lime-50',
    border: 'border-emerald-500',
    iconBg: 'bg-gradient-to-br from-emerald-500 to-green-600',
    iconHoverBg: 'group-hover:from-emerald-100 group-hover:to-green-100',
    badgeBg: 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 border-emerald-200',
    textColor: 'text-emerald-700'
  },
  'it-project-management': {
    gradient: 'from-yellow-50 via-amber-50 to-orange-50',
    border: 'border-yellow-500',
    iconBg: 'bg-gradient-to-br from-yellow-500 to-amber-600',
    iconHoverBg: 'group-hover:from-yellow-100 group-hover:to-amber-100',
    badgeBg: 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-700 border-yellow-200',
    textColor: 'text-yellow-700'
  },
  'business-analysis': {
    gradient: 'from-orange-50 via-red-50 to-rose-50',
    border: 'border-orange-500',
    iconBg: 'bg-gradient-to-br from-orange-500 to-red-600',
    iconHoverBg: 'group-hover:from-orange-100 group-hover:to-red-100',
    badgeBg: 'bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 border-orange-200',
    textColor: 'text-orange-700'
  },
  'qa-testing': {
    gradient: 'from-purple-50 via-violet-50 to-indigo-50',
    border: 'border-purple-500',
    iconBg: 'bg-gradient-to-br from-purple-500 to-violet-600',
    iconHoverBg: 'group-hover:from-purple-100 group-hover:to-violet-100',
    badgeBg: 'bg-gradient-to-r from-purple-100 to-violet-100 text-purple-700 border-purple-200',
    textColor: 'text-purple-700'
  },
  'product-management': {
    gradient: 'from-pink-50 via-rose-50 to-red-50',
    border: 'border-pink-500',
    iconBg: 'bg-gradient-to-br from-pink-500 to-rose-600',
    iconHoverBg: 'group-hover:from-pink-100 group-hover:to-rose-100',
    badgeBg: 'bg-gradient-to-r from-pink-100 to-rose-100 text-pink-700 border-pink-200',
    textColor: 'text-pink-700'
  },
  'ui-ux-design': {
    gradient: 'from-rose-50 via-pink-50 to-fuchsia-50',
    border: 'border-rose-500',
    iconBg: 'bg-gradient-to-br from-rose-500 to-pink-600',
    iconHoverBg: 'group-hover:from-rose-100 group-hover:to-pink-100',
    badgeBg: 'bg-gradient-to-r from-rose-100 to-pink-100 text-rose-700 border-rose-200',
    textColor: 'text-rose-700'
  }
}

export function DomainSelector({ onStartSession }: DomainSelectorProps) {
  const [domains, setDomains] = useState<Domain[]>([])
  const [categories, setCategories] = useState<{ key: string; label: string }[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null)
  const [selectedLevel, setSelectedLevel] = useState<string>('')
  const [questionCount, setQuestionCount] = useState<number>(5)
  const [analysisMode, setAnalysisMode] = useState<'standard' | 'advanced'>('standard')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDomains()
  }, [])

  const loadDomains = async () => {
    try {
      const data = await intelligentInterviewApi.getDomains()
      setDomains(data.domains)
      setCategories(data.categories)
      if (data.categories.length > 0) {
        setSelectedCategory(data.categories[0].key)
      }
    } catch (error) {
      console.error('Error loading domains:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredDomains = selectedCategory
    ? domains.filter(d => {
        const categoryDomains = categories.find(c => c.key === selectedCategory)
        return d.id.includes(selectedCategory) || categoryDomains
      })
    : domains

  const handleDomainSelect = (domain: Domain) => {
    setSelectedDomain(domain)
    setSelectedLevel(domain.levels[0])
  }

  const handleStart = () => {
    if (selectedDomain && selectedLevel) {
      onStartSession(selectedDomain.id, selectedLevel, questionCount, analysisMode)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-20">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="inline-block"
        >
          <Sparkles className="w-16 h-16 text-indigo-600 mx-auto" />
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 text-lg text-gray-600 font-medium"
        >
          Loading intelligent domains...
        </motion.p>
      </div>
    )
  }

  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="inline-block mb-4"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl blur-xl opacity-50 animate-pulse"></div>
            <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 p-4 rounded-2xl">
              <Zap className="w-12 h-12 text-white" />
            </div>
          </div>
        </motion.div>
        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
          AI-Powered Interview Preparation
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Choose your domain and experience level to get personalized interview questions with intelligent feedback
        </p>
      </motion.div>

      {/* Category Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center mb-6">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
          <h3 className="text-2xl font-bold text-gray-900 mx-6 flex items-center">
            <Star className="w-6 h-6 text-yellow-500 mr-2" />
            Select Category
          </h3>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category, idx) => {
            const Icon = categoryIcons[category.key] || Code
            const colors = categoryColors[category.key] || categoryColors.technical
            return (
              <motion.div
                key={category.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card
                  onClick={() => setSelectedCategory(category.key)}
                  className={`p-6 cursor-pointer transition-all duration-300 relative overflow-hidden group ${
                    selectedCategory === category.key
                      ? `border-2 ${colors.border} bg-gradient-to-br ${colors.gradient} shadow-xl scale-105`
                      : 'border-2 border-gray-200 bg-white hover:border-gray-300 hover:shadow-lg'
                  }`}
                >
                  {/* Animated shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                  {selectedCategory === category.key && (
                    <motion.div
                      layoutId="category-selected"
                      className="absolute top-2 right-2 z-10"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 200 }}
                    >
                      <CheckCircle className={`w-6 h-6 ${colors.border.replace('border', 'text')} fill-current`} />
                    </motion.div>
                  )}
                  <div className="relative flex items-center">
                    <motion.div
                      className={`p-4 rounded-2xl mr-4 shadow-md ${
                        selectedCategory === category.key
                          ? colors.bg
                          : `bg-gradient-to-br from-gray-100 to-gray-200 ${colors.iconBg}`
                      }`}
                      whileHover={{ rotate: 10, scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <Icon className={`w-6 h-6 ${
                        selectedCategory === category.key ? 'text-white' : `text-gray-700 group-hover:${colors.border.replace('border', 'text')}`
                      }`} />
                    </motion.div>
                    <span className={`font-bold text-lg ${
                      selectedCategory === category.key ? colors.border.replace('border', 'text') : 'text-gray-900'
                    }`}>
                      {category.label}
                    </span>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* Domain Selection */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedCategory}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center mb-6">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-indigo-300 to-transparent"></div>
            <h3 className="text-2xl font-bold text-gray-900 mx-6 flex items-center">
              <TrendingUp className="w-6 h-6 text-indigo-500 mr-2" />
              Choose Your Domain
            </h3>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-indigo-300 to-transparent"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDomains.map((domain, idx) => {
              const Icon = domainIcons[domain.id] || Code
              const colors = domainColors[domain.id] || {
                gradient: 'from-indigo-50 via-purple-50 to-pink-50',
                border: 'border-indigo-500',
                iconBg: 'bg-gradient-to-br from-indigo-500 to-purple-600',
                iconHoverBg: 'group-hover:from-indigo-100 group-hover:to-purple-100',
                badgeBg: 'bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 border-indigo-200',
                textColor: 'text-indigo-700'
              }
              return (
                <motion.div
                  key={domain.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                >
                  <Card
                    onClick={() => handleDomainSelect(domain)}
                    className={`p-6 cursor-pointer transition-all duration-300 h-full relative overflow-hidden group ${
                      selectedDomain?.id === domain.id
                        ? `border-2 ${colors.border} bg-gradient-to-br ${colors.gradient} shadow-2xl ring-2 ring-offset-2 ${colors.border.replace('border', 'ring')}`
                        : 'border-2 border-gray-200 bg-white hover:border-gray-300 hover:shadow-xl'
                    }`}
                  >
                    {/* Animated shine effect on hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>

                    {selectedDomain?.id === domain.id && (
                      <motion.div
                        layoutId="domain-selected"
                        className="absolute top-3 right-3 z-10"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 200 }}
                      >
                        <div className={`${colors.iconBg} rounded-full p-1.5 shadow-lg`}>
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                      </motion.div>
                    )}

                    <div className="relative flex items-start mb-4">
                      <motion.div
                        className={`p-3 rounded-xl mr-3 shadow-md ${
                          selectedDomain?.id === domain.id
                            ? colors.iconBg
                            : `bg-gradient-to-br from-gray-100 to-gray-200 ${colors.iconHoverBg}`
                        }`}
                        whileHover={{ rotate: 10, scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <Icon className={`w-6 h-6 ${
                          selectedDomain?.id === domain.id ? 'text-white' : `text-gray-700 group-hover:${colors.textColor}`
                        }`} />
                      </motion.div>
                      <div className="flex-1">
                        <h4 className={`font-bold mb-2 text-base leading-tight ${
                          selectedDomain?.id === domain.id ? colors.textColor : 'text-gray-900'
                        }`}>
                          {domain.name}
                        </h4>
                        <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                          {domain.description}
                        </p>
                      </div>
                    </div>

                    <div className="relative flex flex-wrap gap-2">
                      {domain.keywords.slice(0, 4).map((keyword, keyIdx) => (
                        <motion.div
                          key={keyIdx}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: keyIdx * 0.05 }}
                        >
                          <Badge className={`text-xs font-medium px-2.5 py-1 ${
                            selectedDomain?.id === domain.id
                              ? colors.badgeBg
                              : `bg-gray-100 text-gray-700 border-gray-200 group-hover:${colors.badgeBg}`
                          }`}>
                            {keyword}
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Configuration Panel */}
      <AnimatePresence>
        {selectedDomain && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <div className="relative">
              <Card className="relative p-8 bg-white dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700 shadow-xl dark:shadow-2xl dark:shadow-slate-950/50">
                <div className="flex items-center mb-8">
                  <div className="flex-1 h-px bg-gray-200 dark:bg-slate-700"></div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mx-6 flex items-center">
                    <Award className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mr-2" />
                    Interview Configuration
                  </h3>
                  <div className="flex-1 h-px bg-gray-200 dark:bg-slate-700"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  {/* Experience Level */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Experience Level
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {selectedDomain.levels.map((level, idx) => (
                        <motion.div
                          key={level}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.4 + idx * 0.1 }}
                        >
                          <Button
                            onClick={() => setSelectedLevel(level)}
                            variant={selectedLevel === level ? 'default' : 'outline'}
                            className={`w-full h-11 font-medium text-sm transition-all duration-200 ${
                              selectedLevel === level
                                ? 'bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 text-white'
                                : 'border border-gray-300 dark:border-slate-600 hover:border-indigo-500 dark:hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 dark:text-gray-300'
                            }`}
                          >
                            {level}
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Question Count */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Number of Questions
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[3, 5, 10].map((count, idx) => (
                        <motion.div
                          key={count}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.4 + idx * 0.1 }}
                        >
                          <Button
                            onClick={() => setQuestionCount(count)}
                            variant={questionCount === count ? 'default' : 'outline'}
                            className={`w-full h-11 font-medium text-sm transition-all duration-200 ${
                              questionCount === count
                                ? 'bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 text-white'
                                : 'border border-gray-300 dark:border-slate-600 hover:border-indigo-500 dark:hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 dark:text-gray-300'
                            }`}
                          >
                            {count}
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </div>

                {/* Analysis Mode */}
                <motion.div
                  className="mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Analysis Mode
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Card
                        onClick={() => setAnalysisMode('standard')}
                        className={`p-4 cursor-pointer transition-all duration-200 relative overflow-hidden group ${
                          analysisMode === 'standard'
                            ? 'border-2 border-indigo-500 dark:border-indigo-400 bg-indigo-50 dark:bg-indigo-950/30'
                            : 'border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 hover:border-indigo-400 dark:hover:border-indigo-500'
                        }`}
                      >
                        {analysisMode === 'standard' && (
                          <motion.div
                            className="absolute top-2 right-2"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                          >
                            <CheckCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                          </motion.div>
                        )}
                        <div className="relative flex items-start">
                          <div className={`p-2 rounded-lg mr-3 ${
                            analysisMode === 'standard' ? 'bg-indigo-600 dark:bg-indigo-500' : 'bg-gray-200 dark:bg-slate-700'
                          }`}>
                            <Sparkles className={`w-5 h-5 ${
                              analysisMode === 'standard' ? 'text-white' : 'text-gray-600 dark:text-gray-400'
                            }`} />
                          </div>
                          <div>
                            <h4 className={`font-semibold text-sm mb-1 ${
                              analysisMode === 'standard' ? 'text-indigo-700 dark:text-indigo-300' : 'text-gray-900 dark:text-gray-100'
                            }`}>Standard Analysis</h4>
                            <p className="text-xs text-gray-600 dark:text-gray-400">Fast feedback on content quality and technical accuracy</p>
                          </div>
                        </div>
                      </Card>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Card
                        onClick={() => setAnalysisMode('advanced')}
                        className={`p-4 cursor-pointer transition-all duration-200 relative overflow-hidden group ${
                          analysisMode === 'advanced'
                            ? 'border-2 border-purple-500 dark:border-purple-400 bg-purple-50 dark:bg-purple-950/30'
                            : 'border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 hover:border-purple-400 dark:hover:border-purple-500'
                        }`}
                      >
                        {analysisMode === 'advanced' && (
                          <motion.div
                            className="absolute top-2 right-2"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                          >
                            <CheckCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                          </motion.div>
                        )}
                        <div className="relative flex items-start">
                          <div className={`p-2 rounded-lg mr-3 ${
                            analysisMode === 'advanced' ? 'bg-purple-600 dark:bg-purple-500' : 'bg-gray-200 dark:bg-slate-700'
                          }`}>
                            <Zap className={`w-5 h-5 ${
                              analysisMode === 'advanced' ? 'text-white' : 'text-gray-600 dark:text-gray-400'
                            }`} />
                          </div>
                          <div>
                            <h4 className={`font-semibold text-sm mb-1 ${
                              analysisMode === 'advanced' ? 'text-purple-700 dark:text-purple-300' : 'text-gray-900 dark:text-gray-100'
                            }`}>Advanced Analysis</h4>
                            <p className="text-xs text-gray-600 dark:text-gray-400">Includes speech patterns, body language, and comprehensive feedback</p>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Button
                    onClick={handleStart}
                    disabled={!selectedDomain || !selectedLevel}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-600 dark:hover:to-indigo-600 text-white py-3 text-lg font-semibold shadow-lg transition-all duration-200"
                  >
                    <span className="flex items-center justify-center">
                      <Sparkles className="w-5 h-5 mr-2" />
                      Start Intelligent Interview
                    </span>
                  </Button>
                </motion.div>
              </Card>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

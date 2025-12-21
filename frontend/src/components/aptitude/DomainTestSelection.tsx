'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Database,
  Code,
  Shield,
  Cloud,
  Smartphone,
  Brain,
  Building2,
  Rocket,
  Briefcase,
  Target,
  Clock,
  Users,
  PlayCircle,
  ArrowLeft,
  Sparkles,
  Monitor,
  Server,
  Globe,
  Layers,
  Network,
  Settings,
  TrendingUp,
  Cpu,
  HardDrive,
  BarChart3,
  ClipboardList,
  Users2,
  DollarSign
} from 'lucide-react'

interface DomainTestSelectionProps {
  onStartTest: (testId: number) => void
  onBack?: () => void
}

// Top-level categories
const categories = [
  {
    id: 'technical',
    name: 'Technical',
    icon: Code,
    color: 'from-blue-500 to-indigo-600',
    bgColor: 'bg-white dark:bg-slate-800',
    selectedBgColor: 'bg-orange-50 dark:bg-orange-950/30',
    selectedBorderColor: 'border-orange-400 dark:border-orange-500',
    description: 'Software development & engineering roles'
  },
  {
    id: 'it-infrastructure',
    name: 'IT & Infrastructure',
    icon: Monitor,
    color: 'from-cyan-500 to-blue-600',
    bgColor: 'bg-white dark:bg-slate-800',
    selectedBgColor: 'bg-orange-50 dark:bg-orange-950/30',
    selectedBorderColor: 'border-orange-400 dark:border-orange-500',
    description: 'Systems, networks & cloud infrastructure'
  },
  {
    id: 'business-management',
    name: 'Business & Management',
    icon: Briefcase,
    color: 'from-orange-500 to-amber-600',
    bgColor: 'bg-white dark:bg-slate-800',
    selectedBgColor: 'bg-orange-50 dark:bg-orange-950/30',
    selectedBorderColor: 'border-orange-400 dark:border-orange-500',
    description: 'Business, product & management roles'
  }
]

// Domains organized by category
const domainsByCategory: Record<string, Array<{
  id: string
  name: string
  icon: any
  color: string
  description: string
  tags: string[]
  questions: number
  duration: string
}>> = {
  'technical': [
    {
      id: 'frontend',
      name: 'Software Engineering - Frontend',
      icon: Globe,
      color: 'from-blue-500 to-cyan-600',
      description: 'Frontend development with React, Vue, Angular, etc.',
      tags: ['HTML', 'CSS', 'JavaScript', 'React'],
      questions: 15,
      duration: '20 min'
    },
    {
      id: 'backend',
      name: 'Software Engineering - Backend',
      icon: Server,
      color: 'from-green-500 to-emerald-600',
      description: 'Backend development with Node.js, Python, Java, etc.',
      tags: ['Node.js', 'Python', 'Java', 'API'],
      questions: 15,
      duration: '20 min'
    },
    {
      id: 'fullstack',
      name: 'Software Engineering - Full-Stack',
      icon: Layers,
      color: 'from-purple-500 to-indigo-600',
      description: 'Full-stack development across frontend and backend',
      tags: ['MERN', 'MEAN', 'Full-Stack', 'JavaScript'],
      questions: 15,
      duration: '20 min'
    },
    {
      id: 'data-science',
      name: 'Data Science & Machine Learning',
      icon: Brain,
      color: 'from-pink-500 to-rose-600',
      description: 'Data analysis, ML models, and AI applications',
      tags: ['Python', 'Machine Learning', 'Deep Learning', 'TensorFlow'],
      questions: 15,
      duration: '20 min'
    },
    {
      id: 'mobile',
      name: 'Mobile Development',
      icon: Smartphone,
      color: 'from-orange-500 to-red-600',
      description: 'iOS, Android, and cross-platform mobile apps',
      tags: ['iOS', 'Android', 'React Native', 'Flutter'],
      questions: 15,
      duration: '20 min'
    },
    {
      id: 'ai-ml',
      name: 'AI & ML Engineering',
      icon: Cpu,
      color: 'from-violet-500 to-purple-600',
      description: 'Building and deploying AI/ML systems at scale',
      tags: ['PyTorch', 'TensorFlow', 'MLOps', 'LLMs'],
      questions: 15,
      duration: '20 min'
    }
  ],
  'it-infrastructure': [
    {
      id: 'devops',
      name: 'DevOps & Site Reliability Engineering',
      icon: Settings,
      color: 'from-blue-500 to-indigo-600',
      description: 'Infrastructure, automation, and reliability',
      tags: ['Docker', 'Kubernetes', 'CI/CD', 'AWS'],
      questions: 15,
      duration: '20 min'
    },
    {
      id: 'cloud',
      name: 'Cloud Architecture',
      icon: Cloud,
      color: 'from-cyan-500 to-blue-600',
      description: 'Designing and implementing cloud solutions',
      tags: ['AWS', 'Azure', 'GCP', 'Cloud Architecture'],
      questions: 15,
      duration: '20 min'
    },
    {
      id: 'database',
      name: 'Database Engineering',
      icon: Database,
      color: 'from-emerald-500 to-teal-600',
      description: 'Database design, optimization, and administration',
      tags: ['SQL', 'NoSQL', 'PostgreSQL', 'MongoDB'],
      questions: 15,
      duration: '20 min'
    },
    {
      id: 'cybersecurity',
      name: 'Cybersecurity & Ethical Hacking',
      icon: Shield,
      color: 'from-red-500 to-orange-600',
      description: 'Security testing, penetration testing, and defense',
      tags: ['Security', 'Penetration Testing', 'Cryptography', 'Network Security'],
      questions: 15,
      duration: '20 min'
    },
    {
      id: 'network',
      name: 'Network Engineering',
      icon: Network,
      color: 'from-purple-500 to-pink-600',
      description: 'Network design, configuration, and troubleshooting',
      tags: ['TCP/IP', 'Routing', 'Firewall', 'VPN'],
      questions: 15,
      duration: '20 min'
    },
    {
      id: 'sysadmin',
      name: 'System Administration',
      icon: HardDrive,
      color: 'from-gray-500 to-slate-600',
      description: 'Linux/Windows server management and automation',
      tags: ['Linux', 'Windows Server', 'Bash', 'PowerShell'],
      questions: 15,
      duration: '20 min'
    }
  ],
  'business-management': [
    {
      id: 'business-analyst',
      name: 'Business Analyst',
      icon: BarChart3,
      color: 'from-blue-500 to-indigo-600',
      description: 'Requirements gathering, process analysis, and documentation',
      tags: ['Requirements', 'Process Mapping', 'Stakeholder Management', 'Agile'],
      questions: 15,
      duration: '20 min'
    },
    {
      id: 'product-manager',
      name: 'Product Manager',
      icon: Target,
      color: 'from-purple-500 to-pink-600',
      description: 'Product strategy, roadmaps, and user-centric development',
      tags: ['Product Strategy', 'Roadmapping', 'User Research', 'Metrics'],
      questions: 15,
      duration: '20 min'
    },
    {
      id: 'project-manager',
      name: 'Project Manager',
      icon: ClipboardList,
      color: 'from-green-500 to-emerald-600',
      description: 'Project planning, execution, and team coordination',
      tags: ['Scrum', 'Kanban', 'Risk Management', 'PMP'],
      questions: 15,
      duration: '20 min'
    },
    {
      id: 'hr-talent',
      name: 'HR & Talent Acquisition',
      icon: Users2,
      color: 'from-orange-500 to-amber-600',
      description: 'Recruitment, employee relations, and talent management',
      tags: ['Recruiting', 'Employee Relations', 'HRIS', 'Talent Management'],
      questions: 15,
      duration: '20 min'
    },
    {
      id: 'marketing',
      name: 'Marketing & Growth',
      icon: TrendingUp,
      color: 'from-pink-500 to-rose-600',
      description: 'Digital marketing, growth strategies, and analytics',
      tags: ['Digital Marketing', 'SEO', 'Analytics', 'Growth Hacking'],
      questions: 15,
      duration: '20 min'
    },
    {
      id: 'finance',
      name: 'Finance & Operations',
      icon: DollarSign,
      color: 'from-emerald-500 to-teal-600',
      description: 'Financial analysis, budgeting, and operations management',
      tags: ['Financial Analysis', 'Budgeting', 'Forecasting', 'Operations'],
      questions: 15,
      duration: '20 min'
    }
  ]
}

// Company patterns remain the same
const companyPatterns = [
  {
    id: 'faang',
    name: 'FAANG Companies',
    icon: Building2,
    color: 'from-blue-600 to-indigo-700',
    description: 'DSA, System Design, Complex Problem Solving',
    difficulty: 'Hard',
    questions: 20,
    duration: '30 min'
  },
  {
    id: 'startup',
    name: 'Startups',
    icon: Rocket,
    color: 'from-green-600 to-teal-600',
    description: 'Full-stack, Practical Coding, Agile Development',
    difficulty: 'Medium',
    questions: 20,
    duration: '25 min'
  },
  {
    id: 'service-based',
    name: 'Service Companies',
    icon: Briefcase,
    color: 'from-purple-600 to-pink-600',
    description: 'OOP, DBMS, Core Concepts, Java/C++',
    difficulty: 'Medium',
    questions: 20,
    duration: '25 min'
  }
]

export default function DomainTestSelection({ onStartTest, onBack }: DomainTestSelectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('technical')
  const [showCompanyPatterns, setShowCompanyPatterns] = useState(false)
  const [currentDomains, setCurrentDomains] = useState(domainsByCategory['technical'])

  // Update domains when category changes
  useEffect(() => {
    const domains = domainsByCategory[selectedCategory] || []
    setCurrentDomains(domains)
    console.log('Category changed to:', selectedCategory, 'Domains:', domains.length)
  }, [selectedCategory])

  // Calculate test ID based on category and domain index
  const getTestId = (categoryId: string, domainIndex: number): number => {
    const categoryBaseIds: Record<string, number> = {
      'technical': 100,
      'it-infrastructure': 200,
      'business-management': 300
    }
    return (categoryBaseIds[categoryId] || 100) + domainIndex
  }

  return (
    <div className="space-y-8">
      {/* Back Button */}
      {onBack && (
        <Button
          onClick={onBack}
          variant="outline"
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Main Menu
        </Button>
      )}

      {/* Section Header */}
      <div className="text-center mb-4">
        <div className="flex items-center justify-center gap-2 text-orange-500 mb-2">
          <Sparkles className="w-5 h-5" />
          <span className="text-sm font-semibold uppercase tracking-wider">Select Category</span>
        </div>
      </div>

      {/* Top 3 Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {categories.map((category) => {
          const Icon = category.icon
          const isSelected = selectedCategory === category.id

          return (
            <motion.div
              key={category.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                onClick={() => {
                  setSelectedCategory(category.id)
                  setShowCompanyPatterns(false)
                }}
                className={`relative p-6 cursor-pointer transition-all duration-300 border-2 ${
                  isSelected
                    ? `${category.selectedBgColor} ${category.selectedBorderColor} shadow-lg`
                    : `${category.bgColor} border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600 hover:shadow-md`
                }`}
              >
                {/* Selection indicator */}
                {isSelected && (
                  <div className="absolute top-3 right-3">
                    <div className="w-3 h-3 bg-orange-500 rounded-full" />
                  </div>
                )}

                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${
                    isSelected
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500'
                      : 'bg-gray-100 dark:bg-slate-700'
                  } transition-all duration-300`}>
                    <Icon className={`w-6 h-6 ${isSelected ? 'text-white' : 'text-gray-600 dark:text-gray-300'}`} />
                  </div>
                  <span className={`text-lg font-semibold ${
                    isSelected
                      ? 'text-orange-600 dark:text-orange-400'
                      : 'text-gray-800 dark:text-gray-200'
                  }`}>
                    {category.name}
                  </span>
                </div>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Section Header for Domains */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 text-blue-500 mb-2">
          <TrendingUp className="w-5 h-5" />
          <span className="text-sm font-semibold uppercase tracking-wider">Choose Your Path</span>
        </div>
      </div>

      {/* Domain Cards Grid */}
      <motion.div
        key={selectedCategory}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {currentDomains.map((domain, index) => {
          const Icon = domain.icon
          return (
            <motion.div
              key={domain.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="group p-6 h-full bg-white dark:bg-slate-800/80 border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02]">
                <div className="flex items-center mb-4">
                  <div className={`p-3 rounded-2xl bg-gradient-to-r ${domain.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {domain.name}
                </h3>

                <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed text-sm">
                  {domain.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {domain.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="text-xs px-2 py-1 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-6">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {domain.questions} questions
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {domain.duration}
                  </div>
                </div>

                <Button
                  onClick={() => onStartTest(getTestId(selectedCategory, index))}
                  className={`w-full bg-gradient-to-r ${domain.color} text-white shadow-lg group-hover:shadow-xl transition-all duration-300`}
                >
                  <PlayCircle className="w-4 h-4 mr-2" />
                  Start Test
                </Button>
              </Card>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Company Patterns Section */}
      <div className="mt-16">
        <div className="text-center mb-6">
          <Button
            onClick={() => setShowCompanyPatterns(!showCompanyPatterns)}
            variant="outline"
            className="px-8 py-6 text-lg font-semibold transition-all duration-300 bg-white dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-purple-950/30"
          >
            <Sparkles className="w-5 h-5 mr-2 text-purple-500" />
            {showCompanyPatterns ? 'Hide' : 'Show'} Company Pattern Tests
          </Button>
        </div>

        {showCompanyPatterns && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {companyPatterns.map((pattern, index) => {
              const Icon = pattern.icon
              return (
                <motion.div
                  key={pattern.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="group p-6 h-full bg-white dark:bg-slate-800/80 border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02]">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-2xl bg-gradient-to-r ${pattern.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <Badge className={`px-2 py-1 text-xs font-semibold bg-gradient-to-r ${pattern.color} text-white border-0`}>
                        {pattern.difficulty}
                      </Badge>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {pattern.name}
                    </h3>

                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed text-sm">
                      {pattern.description}
                    </p>

                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-6">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {pattern.questions} questions
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {pattern.duration}
                      </div>
                    </div>

                    <Button
                      onClick={() => onStartTest(400 + index)} // Company tests start from ID 400
                      className={`w-full bg-gradient-to-r ${pattern.color} text-white shadow-lg group-hover:shadow-xl transition-all duration-300`}
                    >
                      <PlayCircle className="w-4 h-4 mr-2" />
                      Start Test
                    </Button>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </div>
    </div>
  )
}

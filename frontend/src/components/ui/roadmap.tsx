'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select } from '@/components/ui/select'
import { ROISummaryCard } from '@/components/ui/roi-summary-card'
import { 
  BookOpen, Clock, CheckCircle2, MapPin, Target, 
  Users, Code, Brain, Award, TrendingUp, ExternalLink 
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '@/components/auth-provider'
import { apiClient } from '@/lib/api'
import toast from 'react-hot-toast'

interface Subtask {
  id: string
  name: string
  optional?: boolean
}

interface RoadmapMilestone {
  id: string
  title: string
  description: string
  resources: string[]
  estimated_time: string
  prerequisites: string[]
  category: string
  subtasks?: Subtask[]
}

interface ROIData {
  estimatedTimeWeeks: number
  estimatedInvestment: number
  expectedSalaryRange: {
    min: number
    max: number
    average: number
  }
  roiSummary: {
    multiplier: number
    paybackPeriodMonths: number
    description: string
  }
  marketInsights: {
    demand: string
    growthRate: string
    avgTimeToJob: number
  }
  keySkills: string[]
  explanation: string
}

interface RoadmapData {
  domain: string
  total_estimated_time: string
  stages: {
    category: string
    milestones: RoadmapMilestone[]
  }[]
  roiCalculator?: ROIData
}

interface RoadmapProps {
  onGenerateRoadmap: (domain: string, skillLevel: string) => Promise<RoadmapData | null>
  prefilledDomain?: string
  prefilledSkillLevel?: string
  onPrefilledUsed?: () => void
}

const careerDomains = [
  { value: 'web-development', label: 'Web Development', description: 'Frontend and backend web technologies' },
  { value: 'data-science', label: 'Data Science', description: 'Machine learning, analytics, and data engineering' },
  { value: 'mobile-development', label: 'Mobile Development', description: 'iOS, Android, and cross-platform development' },
  { value: 'cybersecurity', label: 'Cybersecurity', description: 'Network security, ethical hacking, and security analysis' },
  { value: 'cloud-computing', label: 'Cloud Computing', description: 'AWS, Azure, GCP, and cloud architecture' },
  { value: 'artificial-intelligence', label: 'Artificial Intelligence', description: 'ML, deep learning, and AI systems' },
  { value: 'devops', label: 'DevOps', description: 'CI/CD, infrastructure, and automation' },
  { value: 'blockchain', label: 'Blockchain', description: 'Cryptocurrency, smart contracts, and DeFi' }
]

const skillLevels = [
  { value: 'beginner', label: 'Beginner', description: 'New to the field, minimal experience' },
  { value: 'intermediate', label: 'Intermediate', description: 'Some experience, looking to advance' },
  { value: 'advanced', label: 'Advanced', description: 'Experienced, seeking specialization' }
]

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'foundations': return BookOpen
    case 'core skills': return Code
    case 'advanced topics': case 'advanced': return Brain
    case 'projects': return Target
    case 'career preparation': case 'career prep': return Award
    default: return MapPin
  }
}

const getCategoryColor = (category: string) => {
  switch (category.toLowerCase()) {
    case 'foundations': return 'from-indigo-500 to-blue-600'
    case 'core skills': return 'from-emerald-500 to-green-600'
    case 'advanced topics': case 'advanced': return 'from-purple-500 to-violet-600'
    case 'projects': return 'from-orange-500 to-amber-600'
    case 'career preparation': case 'career prep': return 'from-pink-500 to-rose-600'
    default: return 'from-gray-500 to-slate-600'
  }
}

export function Roadmap({ onGenerateRoadmap, prefilledDomain, prefilledSkillLevel, onPrefilledUsed }: RoadmapProps) {
  const [selectedDomain, setSelectedDomain] = useState<string>('')
  const [selectedSkillLevel, setSelectedSkillLevel] = useState<string>('')
  const [roadmapData, setRoadmapData] = useState<RoadmapData | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [completedMilestones, setCompletedMilestones] = useState<Set<string>>(new Set())
  const [completedSubtasks, setCompletedSubtasks] = useState<Map<string, Set<string>>>(new Map())
  const [isLoading, setIsLoading] = useState(false)
  const { user} = useAuth()

  // Load saved roadmap selection from localStorage on mount
  useEffect(() => {
    const savedDomain = localStorage.getItem('selected_roadmap_domain')
    const savedSkillLevel = localStorage.getItem('selected_roadmap_skill_level')
    const savedRoadmapData = localStorage.getItem('selected_roadmap_data')

    if (savedDomain && savedSkillLevel && savedRoadmapData && !prefilledDomain && !prefilledSkillLevel) {
      try {
        setSelectedDomain(savedDomain)
        setSelectedSkillLevel(savedSkillLevel)
        setRoadmapData(JSON.parse(savedRoadmapData))

        // Load progress after restoring roadmap
        if (user) {
          setTimeout(() => loadSavedProgress(), 100)
        }
      } catch (error) {
        console.error('Error loading saved roadmap from localStorage:', error)
        // Clear invalid data
        localStorage.removeItem('selected_roadmap_domain')
        localStorage.removeItem('selected_roadmap_skill_level')
        localStorage.removeItem('selected_roadmap_data')
      }
    }
  }, [user])

  // Handle prefilled values from recommendations
  useEffect(() => {
    if (prefilledDomain && prefilledSkillLevel) {
      setSelectedDomain(prefilledDomain)
      setSelectedSkillLevel(prefilledSkillLevel)
      
      // Auto-generate roadmap after a short delay
      const timer = setTimeout(async () => {
        try {
          setIsGenerating(true)
          const data = await onGenerateRoadmap(prefilledDomain, prefilledSkillLevel)
          setRoadmapData(data)

          // Save roadmap selection to localStorage for persistence
          localStorage.setItem('selected_roadmap_domain', prefilledDomain)
          localStorage.setItem('selected_roadmap_skill_level', prefilledSkillLevel)
          localStorage.setItem('selected_roadmap_data', JSON.stringify(data))

          // Load any existing progress for this roadmap
          if (user) {
            setTimeout(() => loadSavedProgress(), 100)
          }

          // Clear the prefilled values
          if (onPrefilledUsed) {
            onPrefilledUsed()
          }
        } catch (error) {
          console.error('Error auto-generating roadmap:', error)
          toast.error('Failed to generate roadmap')
        } finally {
          setIsGenerating(false)
        }
      }, 1000) // 1 second delay to allow for smooth scrolling
      
      return () => clearTimeout(timer)
    }
  }, [prefilledDomain, prefilledSkillLevel, onGenerateRoadmap, onPrefilledUsed, user])

  // Load saved progress on component mount
  useEffect(() => {
    if (user && roadmapData && selectedDomain && selectedSkillLevel) {
      loadSavedProgress()
    }
  }, [user, roadmapData, selectedDomain, selectedSkillLevel])

  const loadSavedProgress = async () => {
    if (!user || !selectedDomain || !selectedSkillLevel) return

    setIsLoading(true)
    try {
      const response = await apiClient.getRoadmapProgress(user.uid, selectedDomain, selectedSkillLevel)
      if (response.success && response.data.length > 0) {
        const progress = response.data[0]
        const completed = new Set(progress.completedMilestones.map((m: any) => m.milestoneId))
        setCompletedMilestones(completed)

        // Load subtask completion
        const subtasksMap = new Map<string, Set<string>>()
        progress.completedMilestones.forEach((m: any) => {
          if (m.completedSubtasks && m.completedSubtasks.length > 0) {
            subtasksMap.set(m.milestoneId, new Set(m.completedSubtasks))
          }
        })
        setCompletedSubtasks(subtasksMap)

        toast.success('Progress loaded successfully!')
      }
    } catch (error) {
      console.error('Error loading saved progress:', error)
      toast.error('Failed to load saved progress')
    } finally {
      setIsLoading(false)
    }
  }

  const saveProgress = async () => {
    if (!user || !roadmapData || !selectedDomain || !selectedSkillLevel) return

    try {
      const completedMilestonesArray = Array.from(completedMilestones).map(id => {
        const milestone = roadmapData.stages
          .flatMap(s => s.milestones)
          .find(m => m.id === id)
        const subtasksForMilestone = completedSubtasks.get(id) || new Set()
        return {
          milestoneId: id,
          title: milestone?.title || id,
          completedAt: new Date().toISOString(),
          completedSubtasks: Array.from(subtasksForMilestone)
        }
      })

      const progressData = {
        userId: user.uid,
        domain: selectedDomain,
        skillLevel: selectedSkillLevel,
        title: roadmapData.domain,
        completedMilestones: completedMilestonesArray,
        roadmapData
      }

      const response = await apiClient.saveRoadmapProgress(progressData)

      if (response.success) {
        toast.success('Progress saved successfully!')
      } else {
        throw new Error(response.error || 'Failed to save progress')
      }
    } catch (error) {
      console.error('Error saving progress:', error)
      toast.error('Failed to save progress')
    }
  }

  const handleGenerateRoadmap = async () => {
    if (!selectedDomain || !selectedSkillLevel) return

    setIsGenerating(true)
    try {
      const data = await onGenerateRoadmap(selectedDomain, selectedSkillLevel)
      if (!data) {
        throw new Error('No data received from server')
      }
      setRoadmapData(data)

      // Save roadmap selection to localStorage for persistence
      localStorage.setItem('selected_roadmap_domain', selectedDomain)
      localStorage.setItem('selected_roadmap_skill_level', selectedSkillLevel)
      localStorage.setItem('selected_roadmap_data', JSON.stringify(data))

      // Load any existing progress for this roadmap
      if (user) {
        setTimeout(() => loadSavedProgress(), 100)
      }
    } catch (error: any) {
      console.error('Error generating roadmap:', error)
      const errorMessage = error?.message || 'Failed to generate roadmap'
      toast.error(errorMessage)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleNewRoadmap = () => {
    // Clear all roadmap state
    setSelectedDomain('')
    setSelectedSkillLevel('')
    setRoadmapData(null)
    setCompletedMilestones(new Set())
    setCompletedSubtasks(new Map())

    // Clear localStorage
    localStorage.removeItem('selected_roadmap_domain')
    localStorage.removeItem('selected_roadmap_skill_level')
    localStorage.removeItem('selected_roadmap_data')

    toast.success('Ready to create a new roadmap!')
  }

  const toggleSubtask = async (milestoneId: string, subtaskId: string) => {
    const newSubtasks = new Map(completedSubtasks)
    const milestoneSubtasks = newSubtasks.get(milestoneId) || new Set()

    if (milestoneSubtasks.has(subtaskId)) {
      milestoneSubtasks.delete(subtaskId)
    } else {
      milestoneSubtasks.add(subtaskId)
    }

    newSubtasks.set(milestoneId, milestoneSubtasks)
    setCompletedSubtasks(newSubtasks)

    // Auto-save subtask progress
    if (user && roadmapData && selectedDomain && selectedSkillLevel) {
      try {
        const completedMilestonesArray = Array.from(completedMilestones).map(id => {
          const milestone = roadmapData.stages
            .flatMap(s => s.milestones)
            .find(m => m.id === id)
          const subtasksForMilestone = newSubtasks.get(id) || new Set()
          return {
            milestoneId: id,
            title: milestone?.title || id,
            completedAt: new Date().toISOString(),
            completedSubtasks: Array.from(subtasksForMilestone)
          }
        })

        const progressData = {
          userId: user.uid,
          domain: selectedDomain,
          skillLevel: selectedSkillLevel,
          title: roadmapData.domain,
          completedMilestones: completedMilestonesArray,
          roadmapData
        }

        await apiClient.saveRoadmapProgress(progressData)
      } catch (error) {
        console.error('Error saving subtask progress:', error)
      }
    }
  }

  const toggleMilestone = async (milestoneId: string) => {
    const newCompleted = new Set(completedMilestones)
    const isCompleted = !newCompleted.has(milestoneId)
    
    if (newCompleted.has(milestoneId)) {
      newCompleted.delete(milestoneId)
    } else {
      newCompleted.add(milestoneId)
    }
    setCompletedMilestones(newCompleted)
    
    // Save progress immediately when milestone is toggled
    if (user && roadmapData && selectedDomain && selectedSkillLevel) {
      try {
        const completedMilestonesArray = Array.from(newCompleted).map(id => {
          const milestone = roadmapData.stages
            .flatMap(s => s.milestones)
            .find(m => m.id === id)
          return {
            milestoneId: id,
            title: milestone?.title || id,
            completedAt: new Date().toISOString()
          }
        })

        const progressData = {
          userId: user.uid,
          domain: selectedDomain,
          skillLevel: selectedSkillLevel,
          title: roadmapData.domain,
          completedMilestones: completedMilestonesArray,
          roadmapData
        }

        await apiClient.saveRoadmapProgress(progressData)
      } catch (error) {
        console.error('Error saving milestone progress:', error)
      }
    }
  }

  const getMilestoneProgress = (milestones: RoadmapMilestone[]) => {
    const completed = milestones.filter(m => completedMilestones.has(m.id)).length
    return Math.round((completed / milestones.length) * 100)
  }

  // Helper function to convert resource names to actual URLs
  const getResourceUrl = (resourceName: string): string => {
    const resourceUrls: { [key: string]: string } = {
      // Programming Resources
      'freeCodeCamp HTML/CSS': 'https://www.freecodecamp.org/learn/responsive-web-design/',
      'NPTEL Web Technologies': 'https://nptel.ac.in/courses/106105084',
      'MDN Web Docs': 'https://developer.mozilla.org/en-US/docs/Web',
      'JavaScript.info': 'https://javascript.info/',
      'NPTEL JavaScript': 'https://nptel.ac.in/courses/106105171',
      'Codecademy JavaScript': 'https://www.codecademy.com/learn/introduction-to-javascript',
      
      // Frameworks
      'React Official Tutorial': 'https://react.dev/learn',
      'Scrimba React Course': 'https://scrimba.com/learn/learnreact',
      'NPTEL Web Development': 'https://nptel.ac.in/courses/106105153',
      
      // Backend & Databases
      'Node.js Documentation': 'https://nodejs.org/en/docs/',
      'Express.js Guide': 'https://expressjs.com/en/starter/installing.html',
      'NPTEL Database Systems': 'https://nptel.ac.in/courses/106106093',
      'MongoDB University': 'https://university.mongodb.com/',
      'SQL Tutorial': 'https://www.w3schools.com/sql/',
      
      // Data Science
      'Khan Academy Statistics': 'https://www.khanacademy.org/math/statistics-probability',
      'NPTEL Probability': 'https://nptel.ac.in/courses/111104079',
      'MIT Linear Algebra': 'https://ocw.mit.edu/courses/mathematics/18-06-linear-algebra-spring-2010/',
      'Python for Everybody (Coursera)': 'https://www.coursera.org/specializations/python',
      'NPTEL Python': 'https://nptel.ac.in/courses/106106145',
      'Pandas Documentation': 'https://pandas.pydata.org/docs/',
      'Matplotlib Tutorial': 'https://matplotlib.org/stable/tutorials/index.html',
      'Scikit-learn Tutorial': 'https://scikit-learn.org/stable/tutorial/index.html',
      
      // Mobile Development
      'Flutter Documentation': 'https://docs.flutter.dev/',
      'Dart Programming': 'https://dart.dev/guides',
      'Material Design': 'https://material.io/design',
      'iOS Design Guidelines': 'https://developer.apple.com/design/human-interface-guidelines/',
      
      // Cybersecurity
      'Security+ Study Guide': 'https://www.comptia.org/certifications/security',
      'Kali Linux': 'https://www.kali.org/',
      'SANS Incident Response': 'https://www.sans.org/cyber-security-courses/incident-response/',
      
      // Cloud Computing
      'AWS Cloud Practitioner': 'https://aws.amazon.com/certification/certified-cloud-practitioner/',
      'Azure Fundamentals': 'https://docs.microsoft.com/en-us/learn/certifications/azure-fundamentals/',
      'Docker Mastery': 'https://www.docker.com/get-started',
      'Kubernetes Course': 'https://kubernetes.io/docs/tutorials/',
      
      // AI/ML
      'Deep Learning Specialization': 'https://www.coursera.org/specializations/deep-learning',
      'TensorFlow Certification': 'https://www.tensorflow.org/certificate',
      'PyTorch Tutorials': 'https://pytorch.org/tutorials/',
      
      // DevOps
      'DevOps Handbook': 'https://www.amazon.com/DevOps-Handbook-World-Class-Reliability-Organizations/dp/1942788002',
      'Jenkins Mastery': 'https://www.jenkins.io/doc/',
      'GitHub Actions': 'https://docs.github.com/en/actions',
      
      // Blockchain
      'Solidity Documentation': 'https://docs.soliditylang.org/',
      'Web3.js Guide': 'https://web3js.readthedocs.io/',
      'MetaMask Integration': 'https://docs.metamask.io/',
      
      // General Learning Platforms
      'Coursera': 'https://www.coursera.org/',
      'Udemy': 'https://www.udemy.com/',
      'UpGrad': 'https://www.upgrad.com/',
      'Internshala': 'https://internshala.com/',
      'GeeksforGeeks': 'https://www.geeksforgeeks.org/',
      'LeetCode': 'https://leetcode.com/',
      'Kaggle': 'https://www.kaggle.com/',
      'GitHub': 'https://github.com/',
      'Stack Overflow': 'https://stackoverflow.com/'
    }
    
    return resourceUrls[resourceName] || `https://www.google.com/search?q=${encodeURIComponent(resourceName)}`
  }

  return (
    <div className="space-y-6">
      {/* Roadmap Generator */}
      <Card className="p-8 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border-0 dark:border dark:border-gray-700/50 shadow-lg">
        <div className="flex items-center mb-8">
          <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-600 dark:to-pink-600 rounded-2xl mr-4 shadow-lg">
            <MapPin className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Start Your Journey</h3>
            <p className="text-gray-600 dark:text-gray-300 text-lg">Choose your domain and skill level to generate your personalized roadmap</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-base font-semibold text-gray-800 dark:text-gray-200 mb-3">
              🎯 Career Domain
              {prefilledDomain && (
                <span className="ml-2 text-sm text-green-600 dark:text-green-400 font-normal">
                  ✨ Auto-selected from recommendation
                </span>
              )}
            </label>
            <Select
              options={careerDomains}
              value={selectedDomain}
              onValueChange={setSelectedDomain}
              placeholder="Choose your career domain"
              className={`text-base ${prefilledDomain ? 'ring-2 ring-green-400 ring-opacity-50' : ''}`}
            />
          </div>

          <div>
            <label className="block text-base font-semibold text-gray-800 dark:text-gray-200 mb-3">
              📊 Current Skill Level
              {prefilledSkillLevel && (
                <span className="ml-2 text-sm text-green-600 dark:text-green-400 font-normal">
                  ✨ Auto-selected from recommendation
                </span>
              )}
            </label>
            <Select
              options={skillLevels}
              value={selectedSkillLevel}
              onValueChange={setSelectedSkillLevel}
              placeholder="Select your current level"
              className={`text-base ${prefilledSkillLevel ? 'ring-2 ring-green-400 ring-opacity-50' : ''}`}
            />
          </div>
        </div>

        <div className="space-y-3">
          {prefilledDomain && prefilledSkillLevel && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-200 dark:border-green-800/30 rounded-2xl p-4 mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-500 dark:bg-green-600 rounded-full flex items-center justify-center">
                  <Target className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-green-800 dark:text-green-200 font-semibold">🎯 Starting recommended roadmap...</p>
                  <p className="text-green-600 dark:text-green-400 text-sm">Auto-generating your personalized learning path</p>
                </div>
              </div>
            </div>
          )}
          
          <Button 
            onClick={handleGenerateRoadmap}
            disabled={!selectedDomain || !selectedSkillLevel || isGenerating}
            className="w-full py-4 text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {isGenerating ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                {prefilledDomain ? '✨ Creating Your Recommended Roadmap...' : '✨ Generating Your Roadmap...'}
              </>
            ) : (
              <>
                <Target className="w-5 h-5 mr-3" />
                🚀 Generate My Personalized Roadmap
              </>
            )}
          </Button>
          
          {!user && (
            <div className="text-center p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/30 rounded-lg">
              <p className="text-sm text-amber-700 dark:text-amber-300">
                💡 <strong>Sign in</strong> to save your progress and access your roadmaps from any device!
              </p>
            </div>
          )}
          
          {user && roadmapData && (
            <div className="flex gap-2">
              <Button
                onClick={saveProgress}
                variant="outline"
                className="flex-1 text-sm py-2 bg-green-50 dark:bg-green-950/30 border-green-300 dark:border-green-800/30 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30"
              >
                💾 Save Progress (Auto-saved)
              </Button>
              <Button
                onClick={handleNewRoadmap}
                variant="outline"
                className="flex-1 text-sm py-2 bg-blue-50 dark:bg-blue-950/30 border-blue-300 dark:border-blue-800/30 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30"
              >
                🆕 Create New Roadmap
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Roadmap Display */}
      {roadmapData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Roadmap Header */}
          <Card className="p-8 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950/30 dark:via-purple-950/30 dark:to-pink-950/30 border-0 dark:border dark:border-gray-700/50 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent mb-2">
                  🎯 {roadmapData.domain} Roadmap
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-lg">Your personalized learning journey awaits!</p>
              </div>
              <div className="flex items-center space-x-3 bg-white dark:bg-gray-800 rounded-2xl px-4 py-3 shadow-lg border border-transparent dark:border-gray-700">
                <Clock className="w-6 h-6 text-purple-500 dark:text-purple-400" />
                <div className="text-right">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Total Time</div>
                  <div className="font-bold text-purple-600 dark:text-purple-400 text-lg">{roadmapData.total_estimated_time}</div>
                </div>
              </div>
            </div>
            
            {/* Overall Progress */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-inner border border-transparent dark:border-gray-700">
              <div className="flex justify-between items-center mb-3">
                <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">🚀 Overall Progress</span>
                <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                  {completedMilestones.size}/{roadmapData.stages.reduce((acc, stage) => acc + stage.milestones.length, 0)} milestones
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-400 dark:to-pink-400 h-4 rounded-full transition-all duration-500 shadow-lg"
                  style={{
                    width: `${Math.round((completedMilestones.size / roadmapData.stages.reduce((acc, stage) => acc + stage.milestones.length, 0)) * 100)}%`
                  }}
                />
              </div>
              <div className="text-center mt-2">
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                  {Math.round((completedMilestones.size / roadmapData.stages.reduce((acc, stage) => acc + stage.milestones.length, 0)) * 100)}%
                </span>
                <span className="text-gray-500 dark:text-gray-400 ml-1">Complete</span>
              </div>
            </div>
          </Card>

          {/* ROI Summary Card */}
          {roadmapData.roiCalculator && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <ROISummaryCard 
                roiData={roadmapData.roiCalculator} 
                domain={roadmapData.domain}
              />
            </motion.div>
          )}

          {/* Roadmap Stages */}
          {roadmapData.stages.map((stage, stageIndex) => {
            const CategoryIcon = getCategoryIcon(stage.category)
            const progress = getMilestoneProgress(stage.milestones)
            
            return (
              <motion.div
                key={stage.category}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: stageIndex * 0.1 }}
              >
                <Card className="p-8 border-0 dark:border dark:border-gray-700/50 shadow-xl bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-900 dark:to-gray-800/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-500">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center">
                      <div className="relative">
                        <div className={`absolute inset-0 bg-gradient-to-r ${getCategoryColor(stage.category)} rounded-2xl blur-lg opacity-30 animate-pulse`} />
                        <div className={`relative p-4 rounded-2xl bg-gradient-to-r ${getCategoryColor(stage.category)} shadow-xl`}>
                          <CategoryIcon className="w-8 h-8 text-white" />
                        </div>
                      </div>
                      <div className="ml-6">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">{stage.category}</h3>
                        <p className="text-gray-600 dark:text-gray-300 text-lg flex items-center">
                          <span className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full mr-2 animate-pulse" />
                          {stage.milestones.length} milestones to master
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center space-x-3 mb-3">
                          <TrendingUp className="w-5 h-5 text-purple-500 dark:text-purple-400" />
                          <span className="font-bold text-gray-800 dark:text-gray-200 text-lg">{progress}% Complete</span>
                        </div>
                        <div className="w-40 bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                          <div
                            className={`h-3 rounded-full transition-all duration-700 bg-gradient-to-r ${getCategoryColor(stage.category)} shadow-lg`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <div className="text-center mt-2">
                          <span className={`text-lg font-bold bg-gradient-to-r ${getCategoryColor(stage.category)} bg-clip-text text-transparent`}>
                            {stage.milestones.filter(m => completedMilestones.has(m.id)).length}/{stage.milestones.length}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {stage.milestones.map((milestone, milestoneIndex) => {
                      const isCompleted = completedMilestones.has(milestone.id)
                      
                      return (
                        <motion.div
                          key={milestone.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: (stageIndex * 0.1) + (milestoneIndex * 0.05) }}
                          className={`group relative p-6 rounded-2xl border-0 transition-all duration-300 cursor-pointer transform hover:scale-[1.02] ${
                            isCompleted
                              ? 'bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950/30 dark:to-emerald-950/30 shadow-lg hover:shadow-xl border-l-4 border-l-green-500 dark:border-l-green-400'
                              : 'bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 hover:from-blue-50 hover:to-indigo-100 dark:hover:from-blue-950/30 dark:hover:to-indigo-950/30 shadow-md hover:shadow-xl border-l-4 border-l-gray-300 dark:border-l-gray-600 hover:border-l-blue-500 dark:hover:border-l-blue-400'
                          }`}
                          onClick={() => toggleMilestone(milestone.id)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {/* Completion Status Indicator */}
                          {isCompleted && (
                            <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-2 shadow-lg animate-bounce">
                              <CheckCircle2 className="w-4 h-4" />
                            </div>
                          )}
                          
                          <div className="flex items-start space-x-5">
                            <div className="relative">
                              <button
                                className={`p-3 rounded-full transition-all duration-300 shadow-lg ${
                                  isCompleted 
                                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-green-200 scale-110' 
                                    : 'bg-white border-2 border-gray-300 hover:border-purple-500 hover:bg-purple-50 group-hover:border-purple-500'
                                }`}
                              >
                                <CheckCircle2 className={`w-5 h-5 transition-colors ${
                                  isCompleted ? 'text-white' : 'text-gray-400 group-hover:text-purple-500'
                                }`} />
                              </button>
                              {isCompleted && (
                                <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20" />
                              )}
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-3">
                                <h4 className={`text-xl font-bold transition-colors ${
                                  isCompleted
                                    ? 'text-green-800 dark:text-green-200 line-through opacity-75'
                                    : 'text-gray-900 dark:text-gray-100 group-hover:text-purple-700 dark:group-hover:text-purple-400'
                                }`}>
                                  {isCompleted ? '✅ ' : '🎯 '}{milestone.title}
                                </h4>
                                <div className="flex items-center space-x-2">
                                  <Badge
                                    variant={isCompleted ? "success" : "secondary"}
                                    className={`px-3 py-1 text-sm font-semibold ${
                                      isCompleted
                                        ? 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 border border-green-300 dark:border-green-700'
                                        : 'bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300 border border-purple-300 dark:border-purple-700'
                                    }`}
                                  >
                                    ⏰ {milestone.estimated_time}
                                  </Badge>
                                  {isCompleted && (
                                    <div className="bg-green-500 dark:bg-green-600 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse">
                                      DONE!
                                    </div>
                                  )}
                                </div>
                              </div>

                              <p className={`text-base leading-relaxed mb-4 ${
                                isCompleted
                                  ? 'text-green-700 dark:text-green-300'
                                  : 'text-gray-600 dark:text-gray-300 group-hover:text-gray-700 dark:group-hover:text-gray-200'
                              }`}>
                                {milestone.description}
                              </p>

                              {/* Subtasks Section */}
                              {milestone.subtasks && milestone.subtasks.length > 0 && (
                                <div className="mb-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 p-4 rounded-xl border border-purple-200 dark:border-purple-800/50">
                                  <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center">
                                      <CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400 mr-2" />
                                      <p className="text-sm font-bold text-purple-900 dark:text-purple-200">📝 Sub-Topics to Master</p>
                                    </div>
                                    <span className="text-xs font-semibold text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/50 px-2 py-1 rounded-full">
                                      {(completedSubtasks.get(milestone.id)?.size || 0)}/{milestone.subtasks.length} completed
                                    </span>
                                  </div>
                                  <div className="space-y-2">
                                    {milestone.subtasks.map((subtask) => {
                                      const isSubtaskCompleted = completedSubtasks.get(milestone.id)?.has(subtask.id) || false
                                      return (
                                        <div
                                          key={subtask.id}
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            toggleSubtask(milestone.id, subtask.id)
                                          }}
                                          className={`flex items-start p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                                            isSubtaskCompleted
                                              ? 'bg-green-100 dark:bg-green-900/40 border border-green-300 dark:border-green-700'
                                              : 'bg-white dark:bg-gray-800/50 border border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-950/50 hover:border-purple-300 dark:hover:border-purple-700'
                                          }`}
                                        >
                                          <div className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center mr-3 mt-0.5 transition-all ${
                                            isSubtaskCompleted
                                              ? 'bg-green-500 dark:bg-green-600 border-green-500 dark:border-green-600'
                                              : 'border-purple-400 dark:border-purple-600 hover:border-purple-500 dark:hover:border-purple-500'
                                          }`}>
                                            {isSubtaskCompleted && (
                                              <CheckCircle2 className="w-4 h-4 text-white" />
                                            )}
                                          </div>
                                          <div className="flex-1">
                                            <span className={`text-sm font-medium ${
                                              isSubtaskCompleted
                                                ? 'text-green-800 dark:text-green-200 line-through'
                                                : 'text-gray-800 dark:text-gray-200'
                                            }`}>
                                              {subtask.name}
                                            </span>
                                            {subtask.optional && (
                                              <span className="ml-2 text-xs text-gray-500 dark:text-gray-400 italic">(optional)</span>
                                            )}
                                          </div>
                                        </div>
                                      )
                                    })}
                                  </div>
                                </div>
                              )}

                              {milestone.resources.length > 0 && (
                                <div className="mb-4">
                                  <div className="flex items-center mb-3">
                                    <BookOpen className="w-4 h-4 text-blue-500 dark:text-blue-400 mr-2" />
                                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">📚 Learning Resources:</p>
                                  </div>
                                  <div className="flex flex-wrap gap-3">
                                    {milestone.resources.map((resource, idx) => (
                                      <a
                                        key={idx}
                                        href={getResourceUrl(resource)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-block"
                                      >
                                        <Badge
                                          variant="outline"
                                          className={`px-3 py-2 text-sm font-medium transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-md flex items-center gap-1 ${
                                            isCompleted
                                              ? 'bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700 hover:bg-green-100 dark:hover:bg-green-950/60 hover:border-green-400 dark:hover:border-green-600'
                                              : 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-950/60 hover:border-blue-400 dark:hover:border-blue-600'
                                          }`}
                                        >
                                          <ExternalLink className="w-3 h-3" />
                                          {resource}
                                        </Badge>
                                      </a>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              {milestone.prerequisites.length > 0 && (
                                <div>
                                  <div className="flex items-center mb-3">
                                    <Target className="w-4 h-4 text-orange-500 dark:text-orange-400 mr-2" />
                                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">🔗 Prerequisites:</p>
                                  </div>
                                  <div className="flex flex-wrap gap-3">
                                    {milestone.prerequisites.map((prereq, idx) => {
                                      const prereqMilestone = roadmapData.stages
                                        .flatMap(s => s.milestones)
                                        .find(m => m.id === prereq)
                                      const isPrereqCompleted = completedMilestones.has(prereq)
                                      return (
                                        <Badge
                                          key={idx}
                                          variant={isPrereqCompleted ? "success" : "secondary"}
                                          className={`px-3 py-2 text-sm font-medium transition-all ${
                                            isPrereqCompleted
                                              ? 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 border-green-300 dark:border-green-700 shadow-md'
                                              : 'bg-orange-100 dark:bg-orange-900/40 text-orange-800 dark:text-orange-300 border-orange-300 dark:border-orange-700'
                                          }`}
                                        >
                                          {isPrereqCompleted ? '✅ ' : '⏳ '}
                                          {prereqMilestone?.title || prereq}
                                        </Badge>
                                      )
                                    })}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>
      )}
    </div>
  )
}
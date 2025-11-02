'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, Cell, PieChart, Pie
} from 'recharts'
import {
  Target, TrendingUp, Award, Clock, CheckCircle, AlertTriangle,
  BookOpen, Video, FileText, Users, Star, Zap, Brain, Calendar,
  Play, Download, Share2, Filter, Search, ChevronRight, Plus
} from 'lucide-react'

const skillCategories = [
  { name: 'Technical Skills', color: '#3b82f6' },
  { name: 'Communication', color: '#10b981' },
  { name: 'Leadership', color: '#f59e0b' },
  { name: 'Problem Solving', color: '#ef4444' },
  { name: 'Creativity', color: '#8b5cf6' },
  { name: 'Teamwork', color: '#06b6d4' },
]

const currentSkills = [
  { skill: 'JavaScript', category: 'Technical Skills', level: 85, marketDemand: 95, trend: '+15%', priority: 'High' },
  { skill: 'Python', category: 'Technical Skills', level: 78, marketDemand: 92, trend: '+22%', priority: 'High' },
  { skill: 'React', category: 'Technical Skills', level: 82, marketDemand: 88, trend: '+18%', priority: 'High' },
  { skill: 'Communication', category: 'Communication', level: 70, marketDemand: 85, trend: '+12%', priority: 'Medium' },
  { skill: 'Leadership', category: 'Leadership', level: 65, marketDemand: 80, trend: '+8%', priority: 'Medium' },
  { skill: 'Data Analysis', category: 'Technical Skills', level: 75, marketDemand: 90, trend: '+25%', priority: 'High' },
  { skill: 'Project Management', category: 'Leadership', level: 60, marketDemand: 83, trend: '+10%', priority: 'Medium' },
  { skill: 'UI/UX Design', category: 'Creativity', level: 55, marketDemand: 78, trend: '+20%', priority: 'Low' },
]

const skillGaps = [
  {
    role: 'Full Stack Developer',
    match: 85,
    gaps: [
      { skill: 'Node.js', currentLevel: 0, requiredLevel: 80, effort: '3 months', priority: 'Critical' },
      { skill: 'AWS/Cloud', currentLevel: 20, requiredLevel: 70, effort: '2 months', priority: 'High' },
      { skill: 'System Design', currentLevel: 30, requiredLevel: 75, effort: '4 months', priority: 'High' },
    ]
  },
  {
    role: 'Data Scientist',
    match: 78,
    gaps: [
      { skill: 'Machine Learning', currentLevel: 40, requiredLevel: 85, effort: '5 months', priority: 'Critical' },
      { skill: 'Statistics', currentLevel: 45, requiredLevel: 80, effort: '3 months', priority: 'High' },
      { skill: 'R Programming', currentLevel: 0, requiredLevel: 60, effort: '2 months', priority: 'Medium' },
    ]
  },
  {
    role: 'Product Manager',
    match: 82,
    gaps: [
      { skill: 'Product Strategy', currentLevel: 50, requiredLevel: 85, effort: '4 months', priority: 'Critical' },
      { skill: 'User Research', currentLevel: 35, requiredLevel: 75, effort: '3 months', priority: 'High' },
      { skill: 'Analytics', currentLevel: 60, requiredLevel: 80, effort: '2 months', priority: 'Medium' },
    ]
  }
]

const learningResources = [
  {
    title: 'Node.js Complete Course',
    provider: 'Coursera',
    duration: '6 weeks',
    level: 'Beginner to Advanced',
    rating: 4.7,
    price: '₹2,499',
    type: 'course',
    skills: ['Node.js', 'Express.js', 'MongoDB'],
    thumbnail: '📚'
  },
  {
    title: 'AWS Cloud Practitioner',
    provider: 'AWS Training',
    duration: '4 weeks',
    level: 'Beginner',
    rating: 4.6,
    price: 'Free',
    type: 'certification',
    skills: ['AWS', 'Cloud Computing'],
    thumbnail: '☁️'
  },
  {
    title: 'System Design Interview Prep',
    provider: 'YouTube Playlist',
    duration: '20 hours',
    level: 'Advanced',
    rating: 4.8,
    price: 'Free',
    type: 'video',
    skills: ['System Design', 'Architecture'],
    thumbnail: '🎥'
  },
  {
    title: 'Machine Learning Specialization',
    provider: 'Coursera',
    duration: '3 months',
    level: 'Intermediate',
    rating: 4.9,
    price: '₹3,999/month',
    type: 'specialization',
    skills: ['Machine Learning', 'Python', 'TensorFlow'],
    thumbnail: '🧠'
  }
]

const radarData = skillCategories.map(category => {
  const categorySkills = currentSkills.filter(skill => skill.category === category.name)
  const avgLevel = categorySkills.length > 0 
    ? categorySkills.reduce((sum, skill) => sum + skill.level, 0) / categorySkills.length 
    : 0
  
  return {
    category: category.name,
    current: Math.round(avgLevel),
    target: 85,
    fullMark: 100
  }
})

export default function SkillsPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedRole, setSelectedRole] = useState(skillGaps[0])
  const [searchQuery, setSearchQuery] = useState('')

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'critical': return 'destructive'
      case 'high': return 'warning'
      case 'medium': return 'default'
      case 'low': return 'secondary'
      default: return 'default'
    }
  }

  const filteredResources = learningResources.filter(resource =>
    resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Skills Analysis & Development</h1>
            <p className="text-xl text-gray-600">Identify gaps, track progress, and accelerate your growth</p>
          </div>
          
          {/* Navigation Tabs */}
          <div className="flex justify-center">
            <div className="bg-white rounded-full p-1 shadow-sm border">
              {[
                { id: 'overview', label: 'Skills Overview', icon: Target },
                { id: 'gaps', label: 'Gap Analysis', icon: AlertTriangle },
                { id: 'roadmap', label: 'Learning Roadmap', icon: BookOpen },
                { id: 'resources', label: 'Resources', icon: Video },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-2 rounded-full transition-all ${
                    activeTab === tab.id
                      ? 'bg-blue-500 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Skills Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Overall Skills Radar */}
            <Card className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Skills Radar Analysis</h2>
                <div className="flex items-center space-x-2">
                  <Badge variant="success">Overall Score: 72/100</Badge>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export Report
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="category" className="text-sm" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} />
                      <Radar 
                        name="Current Level" 
                        dataKey="current" 
                        stroke="#3b82f6" 
                        fill="#3b82f6" 
                        fillOpacity={0.3}
                        strokeWidth={2}
                      />
                      <Radar 
                        name="Target Level" 
                        dataKey="target" 
                        stroke="#10b981" 
                        fill="transparent"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold mb-4">Category Breakdown</h3>
                  {radarData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">{item.category}</span>
                          <span className="text-sm text-gray-600">{item.current}/100</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${item.current}%` }}
                          />
                        </div>
                      </div>
                      <Badge variant={item.current >= 80 ? 'success' : item.current >= 60 ? 'warning' : 'destructive'} className="ml-3">
                        {item.current >= 80 ? 'Strong' : item.current >= 60 ? 'Good' : 'Needs Work'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Individual Skills List */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Individual Skills Assessment</h2>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Skill
                </Button>
              </div>
              
              <div className="grid gap-4">
                {currentSkills.map((skill, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{skill.skill}</h3>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{skill.category}</Badge>
                          <Badge variant={getPriorityColor(skill.priority)}>{skill.priority}</Badge>
                          <Badge variant="success">{skill.trend}</Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">Your Level</span>
                            <span className="font-medium">{skill.level}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${skill.level}%` }}
                            />
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">Market Demand</span>
                            <span className="font-medium">{skill.marketDemand}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full"
                              style={{ width: `${skill.marketDemand}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Gap Analysis Tab */}
        {activeTab === 'gaps' && (
          <div className="space-y-8">
            {/* Role Selector */}
            <div className="flex flex-wrap gap-3">
              {skillGaps.map((role, index) => (
                <Button
                  key={index}
                  variant={selectedRole.role === role.role ? 'default' : 'outline'}
                  onClick={() => setSelectedRole(role)}
                  className="rounded-full"
                >
                  <Badge variant="outline" className="mr-2">{role.match}% match</Badge>
                  {role.role}
                </Button>
              ))}
            </div>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold">{selectedRole.role} - Skill Gap Analysis</h2>
                  <p className="text-gray-600">Current match: {selectedRole.match}% • Target: 90%+</p>
                </div>
                <Button>
                  <Target className="w-4 h-4 mr-2" />
                  Generate Roadmap
                </Button>
              </div>

              <div className="grid gap-6">
                {selectedRole.gaps.map((gap, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border-l-4 border-l-blue-500"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{gap.skill}</h3>
                        <p className="text-gray-600">Estimated effort: {gap.effort}</p>
                      </div>
                      <Badge variant={getPriorityColor(gap.priority)} className="text-sm">
                        {gap.priority} Priority
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Current Level</span>
                          <span className="font-medium">{gap.currentLevel}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-red-400 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${gap.currentLevel}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Required Level</span>
                          <span className="font-medium">{gap.requiredLevel}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-green-500 h-3 rounded-full"
                            style={{ width: `${gap.requiredLevel}%` }}
                          />
                        </div>
                      </div>

                      <div className="pt-3 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">
                            Gap to close: {gap.requiredLevel - gap.currentLevel} points
                          </span>
                          <Button size="sm" variant="outline">
                            <BookOpen className="w-4 h-4 mr-2" />
                            Find Resources
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Learning Resources Tab */}
        {activeTab === 'resources' && (
          <div className="space-y-6">
            {/* Search and Filter */}
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search courses, skills, or providers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>

            {/* Resources Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((resource, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6 hover:shadow-lg transition-shadow h-full">
                    <div className="flex items-start justify-between mb-4">
                      <div className="text-4xl">{resource.thumbnail}</div>
                      <Badge variant="outline">{resource.type}</Badge>
                    </div>

                    <h3 className="font-semibold text-lg mb-2">{resource.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{resource.provider}</p>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Duration:</span>
                        <span className="text-sm font-medium">{resource.duration}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Level:</span>
                        <span className="text-sm font-medium">{resource.level}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Rating:</span>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 mr-1" />
                          <span className="text-sm font-medium">{resource.rating}</span>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Price:</span>
                        <span className="text-sm font-bold text-green-600">{resource.price}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {resource.skills.map((skill, skillIndex) => (
                        <Badge key={skillIndex} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex space-x-2">
                      <Button className="flex-1" size="sm">
                        <Play className="w-4 h-4 mr-2" />
                        Start Learning
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Video, Mic, Camera, Users, Calendar, Clock, Star, 
  Play, Pause, RotateCcw, Download, Share2, Bookmark,
  Target, TrendingUp, Award, Brain, MessageSquare,
  Filter, Search, ChevronRight, Plus, Eye, FileText,
  CheckCircle, AlertTriangle, Zap, Phone, MapPin,BookOpen
} from 'lucide-react'

const interviewTypes = [
  {
    id: 'technical',
    title: 'Technical Interview',
    description: 'Coding challenges and technical problem solving',
    duration: '60 minutes',
    difficulty: 'Hard',
    icon: '💻',
    topics: ['Data Structures', 'Algorithms', 'System Design', 'Coding'],
    color: 'from-blue-500 to-purple-500'
  },
  {
    id: 'behavioral',
    title: 'Behavioral Interview',
    description: 'Soft skills and personality assessment',
    duration: '45 minutes',
    difficulty: 'Medium',
    icon: '🗣️',
    topics: ['Leadership', 'Teamwork', 'Problem Solving', 'Communication'],
    color: 'from-green-500 to-blue-500'
  },
  {
    id: 'case-study',
    title: 'Case Study Interview',
    description: 'Business problem solving and analysis',
    duration: '90 minutes',
    difficulty: 'Hard',
    icon: '📊',
    topics: ['Business Analysis', 'Strategic Thinking', 'Presentation', 'Analytics'],
    color: 'from-orange-500 to-red-500'
  },
  {
    id: 'hr-round',
    title: 'HR Round',
    description: 'Company culture fit and basic screening',
    duration: '30 minutes',
    difficulty: 'Easy',
    icon: '👥',
    topics: ['Company Knowledge', 'Career Goals', 'Salary Discussion', 'Background'],
    color: 'from-purple-500 to-pink-500'
  }
]

const mentors = [
  {
    id: 1,
    name: 'Rajesh Kumar',
    role: 'Senior Software Engineer',
    company: 'Google',
    experience: '8 years',
    rating: 4.9,
    sessions: 156,
    avatar: '👨‍💻',
    specialties: ['System Design', 'Algorithms', 'Career Guidance'],
    price: '₹2,000',
    nextAvailable: 'Today 6:00 PM',
    languages: ['English', 'Hindi']
  },
  {
    id: 2,
    name: 'Priya Sharma',
    role: 'Product Manager',
    company: 'Microsoft',
    experience: '6 years',
    rating: 4.8,
    sessions: 89,
    avatar: '👩‍💼',
    specialties: ['Product Strategy', 'Case Studies', 'Leadership'],
    price: '₹1,800',
    nextAvailable: 'Tomorrow 10:00 AM',
    languages: ['English', 'Hindi', 'Tamil']
  },
  {
    id: 3,
    name: 'Arjun Patel',
    role: 'Data Scientist',
    company: 'Amazon',
    experience: '5 years',
    rating: 4.9,
    sessions: 124,
    avatar: '📊',
    specialties: ['Machine Learning', 'Statistics', 'Technical Interviews'],
    price: '₹1,500',
    nextAvailable: 'Today 8:00 PM',
    languages: ['English', 'Gujarati']
  },
  {
    id: 4,
    name: 'Meera Reddy',
    role: 'HR Director',
    company: 'Flipkart',
    experience: '10 years',
    rating: 4.7,
    sessions: 203,
    avatar: '👩‍🎓',
    specialties: ['Behavioral Interviews', 'Communication Skills', 'Salary Negotiation'],
    price: '₹1,200',
    nextAvailable: 'Today 4:00 PM',
    languages: ['English', 'Hindi', 'Telugu']
  }
]

const mockInterviews = [
  {
    id: 1,
    title: 'Full Stack Developer Mock Interview',
    type: 'Technical',
    duration: 60,
    status: 'completed',
    score: 78,
    date: '2024-01-15',
    feedback: 'Strong technical skills, needs improvement in system design explanation',
    interviewer: 'AI Interviewer',
    questions: 12,
    topicsCount: 4
  },
  {
    id: 2,
    title: 'Product Manager Case Study',
    type: 'Case Study',
    duration: 90,
    status: 'scheduled',
    date: '2024-01-20',
    interviewer: 'Priya Sharma',
    questions: 8,
    topicsCount: 6
  },
  {
    id: 3,
    title: 'Behavioral Interview Practice',
    type: 'Behavioral',
    duration: 45,
    status: 'in-progress',
    score: 65,
    date: '2024-01-18',
    interviewer: 'AI Interviewer',
    questions: 10,
    topicsCount: 5
  }
]

export default function InterviewsPage() {
  const [activeTab, setActiveTab] = useState('practice')
  const [selectedType, setSelectedType] = useState(interviewTypes[0])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterSpecialty, setFilterSpecialty] = useState('All')
  const [isRecording, setIsRecording] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(1)
  const [totalQuestions] = useState(10)

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'success'
      case 'medium': return 'warning'
      case 'hard': return 'destructive'
      default: return 'default'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'success'
      case 'in-progress': return 'warning'
      case 'scheduled': return 'default'
      default: return 'secondary'
    }
  }

  const filteredMentors = mentors.filter(mentor => {
    const matchesSearch = mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         mentor.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         mentor.role.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSpecialty = filterSpecialty === 'All' || 
                            mentor.specialties.some(specialty => specialty.includes(filterSpecialty))
    return matchesSearch && matchesSpecialty
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Interview Preparation Suite</h1>
            <p className="text-xl text-gray-600">Practice, learn, and ace your next interview</p>
          </div>
          
          {/* Navigation Tabs */}
          <div className="flex justify-center">
            <div className="bg-white rounded-full p-1 shadow-sm border">
              {[
                { id: 'practice', label: 'Mock Interviews', icon: Video },
                { id: 'mentors', label: 'Find Mentors', icon: Users },
                { id: 'history', label: 'My History', icon: Clock },
                { id: 'resources', label: 'Resources', icon: BookOpen },
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
        {/* Mock Interviews Tab */}
        {activeTab === 'practice' && (
          <div className="space-y-8">
            {/* Interview Types */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Choose Interview Type</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {interviewTypes.map((type, index) => (
                  <motion.div
                    key={type.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setSelectedType(type)}
                    className={`cursor-pointer ${selectedType.id === type.id ? 'ring-2 ring-blue-500' : ''}`}
                  >
                    <Card className="p-6 h-full hover:shadow-lg transition-all">
                      <div className={`w-16 h-16 bg-gradient-to-r ${type.color} rounded-full flex items-center justify-center text-2xl mb-4`}>
                        {type.icon}
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{type.title}</h3>
                      <p className="text-gray-600 text-sm mb-4">{type.description}</p>
                      <div className="flex items-center justify-between mb-3">
                        <Badge variant="outline">{type.duration}</Badge>
                        <Badge variant={getDifficultyColor(type.difficulty)}>
                          {type.difficulty}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {type.topics.slice(0, 2).map((topic, topicIndex) => (
                          <Badge key={topicIndex} variant="secondary" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                        {type.topics.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{type.topics.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Selected Interview Setup */}
            <Card className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold mb-2">{selectedType.title}</h3>
                  <p className="text-gray-600">{selectedType.description}</p>
                </div>
                <div className={`w-16 h-16 bg-gradient-to-r ${selectedType.color} rounded-full flex items-center justify-center text-2xl`}>
                  {selectedType.icon}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Setup Options */}
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3">Interview Settings</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span>Duration</span>
                        <span className="font-medium">{selectedType.duration}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span>Questions</span>
                        <select className="bg-transparent font-medium">
                          <option>10 Questions</option>
                          <option>15 Questions</option>
                          <option>20 Questions</option>
                        </select>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span>Difficulty</span>
                        <select className="bg-transparent font-medium">
                          <option>Beginner</option>
                          <option>Intermediate</option>
                          <option>Advanced</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Topics Covered</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedType.topics.map((topic, index) => (
                        <Badge key={index} variant="outline">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Camera Preview */}
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3">Camera & Audio Check</h4>
                    <div className="bg-gray-900 rounded-lg aspect-video flex items-center justify-center mb-4">
                      <div className="text-center text-white">
                        <Camera className="w-12 h-12 mx-auto mb-2 opacity-60" />
                        <p className="text-sm opacity-60">Camera preview will appear here</p>
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <Button variant="outline" size="sm">
                        <Camera className="w-4 h-4 mr-2" />
                        Test Camera
                      </Button>
                      <Button variant="outline" size="sm">
                        <Mic className="w-4 h-4 mr-2" />
                        Test Microphone
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-sm">Camera access granted</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-sm">Microphone access granted</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-sm">Stable internet connection</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center mt-8 pt-6 border-t">
                <div className="text-sm text-gray-600">
                  <p>💡 Tip: Ensure you're in a quiet environment with good lighting</p>
                </div>
                <Button size="lg">
                  <Play className="w-5 h-5 mr-2" />
                  Start Interview
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Mentors Tab */}
        {activeTab === 'mentors' && (
          <div className="space-y-6">
            {/* Search and Filter */}
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search mentors by name, company, or role..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select 
                value={filterSpecialty}
                onChange={(e) => setFilterSpecialty(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Specialties</option>
                <option value="System Design">System Design</option>
                <option value="Algorithms">Algorithms</option>
                <option value="Product Strategy">Product Strategy</option>
                <option value="Machine Learning">Machine Learning</option>
                <option value="Behavioral">Behavioral Interviews</option>
              </select>
            </div>

            {/* Mentors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMentors.map((mentor, index) => (
                <motion.div
                  key={mentor.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-2xl">
                          {mentor.avatar}
                        </div>
                        <div>
                          <h3 className="font-semibold">{mentor.name}</h3>
                          <p className="text-sm text-gray-600">{mentor.role}</p>
                          <p className="text-xs text-gray-500">{mentor.company}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 mr-1" />
                          <span className="text-sm font-medium">{mentor.rating}</span>
                        </div>
                        <p className="text-xs text-gray-500">{mentor.sessions} sessions</p>
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Experience:</span>
                        <span className="font-medium">{mentor.experience}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Price:</span>
                        <span className="font-bold text-green-600">{mentor.price}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Available:</span>
                        <span className="font-medium">{mentor.nextAvailable}</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-sm font-medium mb-2">Specialties</h4>
                      <div className="flex flex-wrap gap-1">
                        {mentor.specialties.map((specialty, specIndex) => (
                          <Badge key={specIndex} variant="secondary" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-sm font-medium mb-2">Languages</h4>
                      <div className="flex flex-wrap gap-1">
                        {mentor.languages.map((lang, langIndex) => (
                          <Badge key={langIndex} variant="outline" className="text-xs">
                            {lang}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" className="flex-1">
                        <Calendar className="w-4 h-4 mr-2" />
                        Book Session
                      </Button>
                      <Button variant="outline" size="sm">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Chat
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Interview History</h2>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Schedule New Interview
              </Button>
            </div>

            <div className="space-y-4">
              {mockInterviews.map((interview, index) => (
                <motion.div
                  key={interview.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold">{interview.title}</h3>
                          <Badge variant={getStatusColor(interview.status)}>
                            {interview.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                          <div>
                            <span className="font-medium">Type:</span> {interview.type}
                          </div>
                          <div>
                            <span className="font-medium">Duration:</span> {interview.duration}min
                          </div>
                          <div>
                            <span className="font-medium">Questions:</span> {interview.questions}
                          </div>
                          <div>
                            <span className="font-medium">Date:</span> {new Date(interview.date).toLocaleDateString()}
                          </div>
                        </div>

                        {interview.status === 'completed' && interview.score && (
                          <div className="flex items-center space-x-4 mb-3">
                            <div className="flex items-center">
                              <Target className="w-4 h-4 mr-1 text-blue-500" />
                              <span className="text-sm">Score: <span className="font-bold text-blue-600">{interview.score}%</span></span>
                            </div>
                            {interview.feedback && (
                              <div className="flex-1">
                                <p className="text-sm text-gray-600 italic">"{interview.feedback}"</p>
                              </div>
                            )}
                          </div>
                        )}

                        <div className="flex items-center text-sm text-gray-500">
                          <Users className="w-4 h-4 mr-1" />
                          Interviewer: {interview.interviewer}
                        </div>
                      </div>

                      <div className="flex space-x-2 ml-4">
                        {interview.status === 'completed' && (
                          <>
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 mr-2" />
                              View Report
                            </Button>
                            <Button variant="outline" size="sm">
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </Button>
                          </>
                        )}
                        {interview.status === 'scheduled' && (
                          <Button size="sm">
                            <Video className="w-4 h-4 mr-2" />
                            Join Interview
                          </Button>
                        )}
                        {interview.status === 'in-progress' && (
                          <Button size="sm">
                            <Play className="w-4 h-4 mr-2" />
                            Resume
                          </Button>
                        )}
                      </div>
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
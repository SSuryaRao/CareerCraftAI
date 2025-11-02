'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  User, BookOpen, Target, Brain, Upload, Award, 
  MapPin, Calendar, Briefcase, GraduationCap, 
  Heart, Zap, ChevronRight, CheckCircle, Sparkles,
  FileText, Camera, Mic, Video
} from 'lucide-react'
import { useRouter } from 'next/navigation'

const steps = [
  { id: 1, title: 'Academic Profile', icon: GraduationCap },
  { id: 2, title: 'Skills & Interests', icon: Brain },
  { id: 3, title: 'Career Goals', icon: Target },
  { id: 4, title: 'Personality', icon: Heart },
  { id: 5, title: 'Digital Twin', icon: Zap }
]

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [profileData, setProfileData] = useState({
    education: '',
    skills: [],
    interests: [],
    goals: [],
    personality: {},
    documents: []
  })
  const router = useRouter()

  const handleNext = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1)
    else router.push('/dashboard')
  }

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Progress Header */}
      <div className="sticky top-0 z-50 bg-black/20 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">Build Your Digital Twin</h1>
            </div>
            <div className="flex items-center space-x-2">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ 
                      scale: currentStep >= step.id ? 1 : 0.8,
                      backgroundColor: currentStep >= step.id ? '#8b5cf6' : 'rgba(255,255,255,0.1)'
                    }}
                    className={`w-8 h-8 rounded-full flex items-center justify-center`}
                  >
                    {currentStep > step.id ? (
                      <CheckCircle className="w-5 h-5 text-white" />
                    ) : (
                      <step.icon className="w-4 h-4 text-white" />
                    )}
                  </motion.div>
                  {index < steps.length - 1 && (
                    <div className={`w-12 h-0.5 ${
                      currentStep > step.id ? 'bg-purple-500' : 'bg-white/20'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {/* Step 1: Academic Profile */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Tell us about your education</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Current Education Level
                  </label>
                  <select className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400">
                    <option>10th Standard</option>
                    <option>12th Standard</option>
                    <option>Undergraduate</option>
                    <option>Postgraduate</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    School/College Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-purple-400"
                    placeholder="Enter your institution name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Academic Performance
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-purple-400"
                      placeholder="Percentage/CGPA"
                    />
                    <select className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400">
                      <option>Science</option>
                      <option>Commerce</option>
                      <option>Arts</option>
                      <option>Engineering</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-4">
                    Upload Documents (Optional)
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="p-6 bg-white/5 border-2 border-dashed border-white/20 rounded-lg hover:bg-white/10 transition"
                    >
                      <FileText className="w-8 h-8 text-white/60 mx-auto mb-2" />
                      <p className="text-sm text-white/60">Upload Marksheet</p>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="p-6 bg-white/5 border-2 border-dashed border-white/20 rounded-lg hover:bg-white/10 transition"
                    >
                      <Award className="w-8 h-8 text-white/60 mx-auto mb-2" />
                      <p className="text-sm text-white/60">Upload Certificates</p>
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Skills & Interests */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Your skills and interests</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-4">
                    Select your top skills
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {['Python', 'JavaScript', 'Data Analysis', 'Communication', 'Leadership', 
                      'Problem Solving', 'Design', 'Marketing', 'Finance', 'Research'].map((skill) => (
                      <motion.button
                        key={skill}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full text-white hover:bg-purple-500/30 transition"
                      >
                        {skill}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-4">
                    Areas of interest
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { name: 'Technology', icon: '💻' },
                      { name: 'Healthcare', icon: '🏥' },
                      { name: 'Business', icon: '💼' },
                      { name: 'Arts', icon: '🎨' },
                      { name: 'Science', icon: '🔬' },
                      { name: 'Sports', icon: '⚽' }
                    ].map((interest) => (
                      <motion.button
                        key={interest.name}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-4 bg-white/5 border border-white/20 rounded-lg hover:bg-white/10 transition"
                      >
                        <div className="text-3xl mb-2">{interest.icon}</div>
                        <p className="text-sm text-white/80">{interest.name}</p>
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Describe your hobbies and extracurriculars
                  </label>
                  <textarea
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-purple-400 h-24 resize-none"
                    placeholder="Tell us about your activities outside academics..."
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Career Goals */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Define your career aspirations</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-4">
                    What are your dream careers?
                  </label>
                  <div className="space-y-3">
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-purple-400"
                      placeholder="Primary career choice (e.g., Software Engineer)"
                    />
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-purple-400"
                      placeholder="Alternative career choice (optional)"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-4">
                    Work preferences
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <label className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 cursor-pointer">
                        <input type="radio" name="worktype" className="w-4 h-4" />
                        <span className="text-white/80">Remote Work</span>
                      </label>
                      <label className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 cursor-pointer">
                        <input type="radio" name="worktype" className="w-4 h-4" />
                        <span className="text-white/80">Office Work</span>
                      </label>
                      <label className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 cursor-pointer">
                        <input type="radio" name="worktype" className="w-4 h-4" />
                        <span className="text-white/80">Hybrid</span>
                      </label>
                    </div>
                    <div className="space-y-3">
                      <label className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4" />
                        <span className="text-white/80">Startup Culture</span>
                      </label>
                      <label className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4" />
                        <span className="text-white/80">MNC Environment</span>
                      </label>
                      <label className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4" />
                        <span className="text-white/80">Entrepreneurship</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Expected salary range (per annum)
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="range"
                      min="0"
                      max="50"
                      className="flex-1"
                    />
                    <span className="text-white/80">₹3-50 LPA</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Preferred locations
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {['Bangalore', 'Mumbai', 'Delhi NCR', 'Hyderabad', 'Chennai', 'Pune', 'Remote'].map((city) => (
                      <button
                        key={city}
                        className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-full text-white hover:bg-blue-500/30 transition"
                      >
                        <MapPin className="inline w-4 h-4 mr-1" />
                        {city}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4: Personality Assessment */}
          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Quick personality assessment</h2>
              
              <div className="space-y-6">
                <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                  <p className="text-white/80 text-sm">
                    Answer a few questions to help us understand your work style and preferences better.
                  </p>
                </div>

                {[
                  {
                    question: "How do you prefer to work on projects?",
                    options: ["Independently", "In small teams", "In large groups", "Flexible"]
                  },
                  {
                    question: "What motivates you the most?",
                    options: ["Challenge", "Recognition", "Impact", "Learning"]
                  },
                  {
                    question: "How do you handle deadlines?",
                    options: ["Plan ahead", "Work under pressure", "Need reminders", "Flexible approach"]
                  }
                ].map((item, index) => (
                  <div key={index}>
                    <label className="block text-sm font-medium text-white/80 mb-3">
                      {index + 1}. {item.question}
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {item.options.map((option) => (
                        <label
                          key={option}
                          className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 cursor-pointer"
                        >
                          <input type="radio" name={`q${index}`} className="w-4 h-4" />
                          <span className="text-white/80">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-4">
                    Express yourself (Optional)
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-4 bg-white/5 border border-white/20 rounded-lg hover:bg-white/10 transition"
                    >
                      <Mic className="w-6 h-6 text-white/60 mx-auto mb-2" />
                      <p className="text-xs text-white/60">Voice Note</p>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-4 bg-white/5 border border-white/20 rounded-lg hover:bg-white/10 transition"
                    >
                      <Video className="w-6 h-6 text-white/60 mx-auto mb-2" />
                      <p className="text-xs text-white/60">Video Intro</p>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-4 bg-white/5 border border-white/20 rounded-lg hover:bg-white/10 transition"
                    >
                      <Camera className="w-6 h-6 text-white/60 mx-auto mb-2" />
                      <p className="text-xs text-white/60">Photo</p>
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 5: Digital Twin Summary */}
          {currentStep === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20"
            >
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", duration: 0.5 }}
                  className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mb-4"
                >
                  <Zap className="w-10 h-10 text-white" />
                </motion.div>
                <h2 className="text-3xl font-bold text-white mb-2">Your Digital Twin is Ready!</h2>
                <p className="text-white/60">We've created your personalized career profile</p>
              </div>

              <div className="space-y-6">
                <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg p-6 border border-white/20">
                  <h3 className="text-lg font-semibold text-white mb-4">Profile Summary</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/10 rounded-lg p-3">
                      <p className="text-xs text-white/60 mb-1">Completion</p>
                      <p className="text-2xl font-bold text-white">92%</p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3">
                      <p className="text-xs text-white/60 mb-1">Match Score</p>
                      <p className="text-2xl font-bold text-green-400">85%</p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3">
                      <p className="text-xs text-white/60 mb-1">Career Paths</p>
                      <p className="text-2xl font-bold text-white">24</p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3">
                      <p className="text-xs text-white/60 mb-1">Skills Identified</p>
                      <p className="text-2xl font-bold text-white">18</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-white">Top Career Recommendations</h3>
                  {[
                    { title: 'Full Stack Developer', match: '92%', growth: '+22%' },
                    { title: 'Data Scientist', match: '88%', growth: '+35%' },
                    { title: 'Product Manager', match: '85%', growth: '+28%' }
                  ].map((career, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
                    >
                      <div>
                        <p className="font-medium text-white">{career.title}</p>
                        <p className="text-sm text-white/60">Match: {career.match}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-green-400">Growth: {career.growth}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                  <p className="text-green-400 text-sm">
                    ✨ Your AI Mentor is ready to guide you! Start exploring career paths and get personalized recommendations.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          {currentStep > 1 && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePrevious}
              className="px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition"
            >
              Previous
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleNext}
            className="ml-auto px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-blue-600 transition flex items-center space-x-2"
          >
            <span>{currentStep === 5 ? 'Go to Dashboard' : 'Continue'}</span>
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </div>
  )
}
'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  Github,
  Linkedin,
  Briefcase,
  Save,
  Edit,
  Plus,
  X,
  Settings,
  Bell,
  Shield,
  ChevronRight,
  Target
} from 'lucide-react'
import Navbar from '@/components/layout/navbar'
import { apiClient } from '@/lib/api'
import { useAuth } from '@/components/auth-provider'
import toast from 'react-hot-toast'

interface UserProfile {
  id: string
  email: string
  name: string
  picture?: string
  profile: {
    title: string
    bio: string
    location: string
    website: string
    linkedin: string
    github: string
    phone: string
    education: string
    interests: string[]
    careerGoal: string
  }
  skills: Array<{
    name: string
    level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
    yearsOfExperience: number
  }>
  preferences: {
    jobTypes: string[]
    experienceLevels: string[]
    remotePreference: 'fully-remote' | 'hybrid' | 'office-based' | 'any'
    preferredLocations: string[]
    salaryRange: {
      min: number
      max: number
      currency: string
    }
    interestedTags: string[]
  }
  notifications: {
    emailAlerts: boolean
    jobMatches: boolean
    applicationUpdates: boolean
    weeklyDigest: boolean
  }
}

interface TabItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  color: string
}


export default function ProfilePage(): JSX.Element {
  const { user } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<string>('personal')
  const [newSkill, setNewSkill] = useState<{
    name: string
    level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
    yearsOfExperience: number
  }>({ 
    name: '', 
    level: 'intermediate', 
    yearsOfExperience: 0 
  })
  const [newInterest, setNewInterest] = useState<string>('')

  // Character limits for different fields
  const CHARACTER_LIMITS = {
    title: 100,
    bio: 500,
    education: 150,
    careerGoal: 300,
    location: 100,
    website: 200,
    linkedin: 200,
    github: 200,
    phone: 20,
    name: 100,
  }

  // Helper function to get remaining characters
  const getRemainingChars = (text: string, limit: number): number => {
    return limit - (text?.length || 0)
  }

  // Helper function to check if limit is exceeded
  const isLimitExceeded = (text: string, limit: number): boolean => {
    return (text?.length || 0) > limit
  }

  // Fetch user profile data from backend
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setLoading(false)
        setError('User not authenticated')
        return
      }

      try {
        setLoading(true)
        setError(null)
        
        const response = await apiClient.getProfile()
        
        if (response.success && response.data) {
          setProfile(response.data)
        } else {
          throw new Error(response.error || 'Failed to fetch profile')
        }
      } catch (err) {
        console.error('Error fetching profile:', err)
        setError(err instanceof Error ? err.message : 'Failed to load profile')
        toast.error('Failed to load profile data')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [user])

  const addSkill = (): void => {
    if (!profile || !newSkill.name.trim()) return

    const updatedProfile: UserProfile = {
      ...profile,
      skills: [...profile.skills, newSkill]
    }
    setProfile(updatedProfile)
    setNewSkill({ name: '', level: 'intermediate', yearsOfExperience: 0 })
  }

  const removeSkill = (index: number): void => {
    if (!profile) return

    const updatedProfile: UserProfile = {
      ...profile,
      skills: profile.skills.filter((_, i) => i !== index)
    }
    setProfile(updatedProfile)
  }

  const addInterest = (): void => {
    if (!profile || !newInterest.trim()) return

    const updatedProfile: UserProfile = {
      ...profile,
      profile: {
        ...profile.profile,
        interests: [...profile.profile.interests, newInterest.trim().toLowerCase()]
      }
    }
    setProfile(updatedProfile)
    setNewInterest('')
  }

  const removeInterest = (index: number): void => {
    if (!profile) return

    const updatedProfile: UserProfile = {
      ...profile,
      profile: {
        ...profile.profile,
        interests: profile.profile.interests.filter((_, i) => i !== index)
      }
    }
    setProfile(updatedProfile)
  }

  const updateProfile = (field: string, value: any): void => {
    if (!profile) return

    const keys = field.split('.')
    const updatedProfile = { ...profile }
    let current: any = updatedProfile

    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) current[keys[i]] = {}
      current = current[keys[i]]
    }

    current[keys[keys.length - 1]] = value
    setProfile(updatedProfile)
  }

  const saveProfile = async (): Promise<void> => {
    if (!profile) return

    try {
      setIsSaving(true)
      
      const response = await apiClient.updateProfile({
        name: profile.name,
        profile: profile.profile,
        skills: profile.skills,
        preferences: profile.preferences,
        notifications: profile.notifications
      })
      
      if (response.success) {
        toast.success('Profile updated successfully')
        setIsEditing(false)
        // Refresh profile data
        const updatedResponse = await apiClient.getProfile()
        if (updatedResponse.success && updatedResponse.data) {
          setProfile(updatedResponse.data)
        }
      } else {
        throw new Error(response.error || 'Failed to update profile')
      }
    } catch (err) {
      console.error('Error saving profile:', err)
      toast.error(err instanceof Error ? err.message : 'Failed to save profile')
    } finally {
      setIsSaving(false)
    }
  }

  const tabs: TabItem[] = [
    { id: 'personal', label: 'Personal Info', icon: User, color: 'bg-blue-500' },
    { id: 'career', label: 'Career Profile', icon: Target, color: 'bg-indigo-500' },
    { id: 'skills', label: 'Skills', icon: Briefcase, color: 'bg-purple-500' },
    { id: 'preferences', label: 'Job Preferences', icon: Settings, color: 'bg-green-500' },
    { id: 'notifications', label: 'Notifications', icon: Bell, color: 'bg-orange-500' },
  ]

  const getLevelColor = (level: string): string => {
    switch (level) {
      case 'beginner': return 'bg-yellow-500 text-white'
      case 'intermediate': return 'bg-blue-500 text-white'
      case 'advanced': return 'bg-purple-500 text-white'
      case 'expert': return 'bg-green-500 text-white'
      default: return 'bg-gray-500 text-white'
    }
  }

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>, field: string): void => {
    updateProfile(field, e.target.value)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: string): void => {
    const value = e.target.type === 'number' ? parseInt(e.target.value) || 0 : e.target.value
    updateProfile(field, value)
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>, field: string): void => {
    updateProfile(field, e.target.value)
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, field: string): void => {
    updateProfile(field, e.target.checked)
  }

  // Show loading spinner while fetching data
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-pink-400/20 to-violet-600/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-cyan-400/10 to-blue-600/10 rounded-full blur-3xl"></div>
        </div>
        
        <Navbar />
        
        <div className="relative pt-20 pb-12 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white text-xl font-semibold">Loading your profile...</p>
          </div>
        </div>
      </div>
    )
  }

  // Show error state if there's an error or no user
  if (error || !user || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-pink-400/20 to-violet-600/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-cyan-400/10 to-blue-600/10 rounded-full blur-3xl"></div>
        </div>
        
        <Navbar />
        
        <div className="relative pt-20 pb-12 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-8 h-8 text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Unable to load profile</h2>
            <p className="text-blue-200/70 mb-4">
              {error || (!user ? 'Please sign in to view your profile' : 'Profile data not available')}
            </p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-pink-400/20 to-violet-600/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-cyan-400/10 to-blue-600/10 rounded-full blur-3xl"></div>
      </div>
      
      <Navbar />
      
      <div className="relative pt-20 pb-12">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-3">
                  My Profile
                </h1>
                <p className="text-blue-100/80 text-xl font-medium">Manage your personal information and preferences</p>
              </div>
              <div className="flex space-x-4">
                {isEditing ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                      className="border-white/30 hover:bg-white/10 text-white backdrop-blur-sm bg-white/5 hover:border-white/50 transition-all duration-300"
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={saveProfile} 
                      disabled={isSaving}
                      className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 backdrop-blur-sm"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </>
                ) : (
                  <Button 
                    onClick={() => setIsEditing(true)}
                    className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 backdrop-blur-sm"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="p-8 bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:bg-white/15">
                <div className="text-center mb-8">
                  <div className="relative w-28 h-28 mx-auto mb-6">
                    <div className="w-28 h-28 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl ring-4 ring-white/30">
                      {profile.picture ? (
                        <img
                          src={profile.picture}
                          alt={profile.name}
                          className="w-28 h-28 rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-14 h-14 text-white" />
                      )}
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full border-4 border-white flex items-center justify-center shadow-xl">
                      <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{profile.name}</h3>
                  <p className="text-blue-100/70 text-sm mb-4">{profile.email}</p>
                  {profile.profile.title && (
                    <div className="inline-block px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 backdrop-blur-sm border border-white/30 text-white text-sm font-medium rounded-full">
                      {profile.profile.title}
                    </div>
                  )}
                </div>

                <nav className="space-y-3">
                  {tabs.map((tab) => {
                    const IconComponent = tab.icon
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`group w-full flex items-center space-x-4 px-5 py-4 rounded-2xl text-left transition-all duration-300 hover:scale-[1.02] relative overflow-hidden ${
                          activeTab === tab.id
                            ? 'bg-white/20 text-white shadow-2xl border border-white/30'
                            : 'text-blue-100/80 hover:bg-white/10 hover:text-white hover:shadow-xl hover:border hover:border-white/20'
                        }`}
                      >
                        <div className={`p-3 rounded-xl transition-all duration-300 ${
                          activeTab === tab.id 
                            ? 'bg-gradient-to-r from-cyan-400 to-blue-500 shadow-lg' 
                            : 'bg-white/10 group-hover:bg-white/20'
                        }`}>
                          <IconComponent className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-semibold flex-1">{tab.label}</span>
                        <ChevronRight className={`w-5 h-5 transition-all duration-300 ${
                          activeTab === tab.id ? 'rotate-90 text-cyan-300' : 'text-blue-200/60 group-hover:text-blue-100'
                        }`} />
                        {activeTab === tab.id && (
                          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 rounded-2xl"></div>
                        )}
                      </button>
                    )
                  })}
                </nav>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {activeTab === 'personal' && (
                <Card className="p-10 bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:bg-white/15">
                  <div className="flex items-center space-x-4 mb-10">
                    <div className="p-4 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl shadow-lg">
                      <User className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-white">Personal Information</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="block text-sm font-bold text-blue-100/90 tracking-wide uppercase">
                          Full Name
                        </label>
                        {isEditing && (
                          <span className={`text-sm font-semibold ${
                            profile.name?.length > CHARACTER_LIMITS.name
                              ? 'text-red-400'
                              : profile.name?.length > CHARACTER_LIMITS.name - 10
                              ? 'text-yellow-400'
                              : 'text-blue-200/70'
                          }`}>
                            {profile.name?.length || 0}/{CHARACTER_LIMITS.name}
                          </span>
                        )}
                      </div>
                      <Input
                        value={profile.name}
                        onChange={(e) => {
                          if (e.target.value.length <= CHARACTER_LIMITS.name) {
                            handleInputChange(e, 'name')
                          }
                        }}
                        disabled={!isEditing}
                        maxLength={CHARACTER_LIMITS.name}
                        className="border-white/20 focus:border-cyan-400 focus:ring-cyan-400/20 bg-white/10 backdrop-blur-sm text-white placeholder-blue-200/60 transition-all duration-300 hover:bg-white/15"
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="block text-sm font-bold text-blue-100/90 tracking-wide uppercase">
                          Job Title
                        </label>
                        {isEditing && (
                          <span className={`text-sm font-semibold ${
                            profile.profile.title?.length > CHARACTER_LIMITS.title
                              ? 'text-red-400'
                              : profile.profile.title?.length > CHARACTER_LIMITS.title - 10
                              ? 'text-yellow-400'
                              : 'text-blue-200/70'
                          }`}>
                            {profile.profile.title?.length || 0}/{CHARACTER_LIMITS.title}
                          </span>
                        )}
                      </div>
                      <Input
                        value={profile.profile.title}
                        onChange={(e) => {
                          if (e.target.value.length <= CHARACTER_LIMITS.title) {
                            handleInputChange(e, 'profile.title')
                          }
                        }}
                        disabled={!isEditing}
                        placeholder="e.g. Software Engineer"
                        maxLength={CHARACTER_LIMITS.title}
                        className="border-white/20 focus:border-cyan-400 focus:ring-cyan-400/20 bg-white/10 backdrop-blur-sm text-white placeholder-blue-200/60 transition-all duration-300 hover:bg-white/15"
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="block text-sm font-bold text-blue-100/90 tracking-wide uppercase">
                          Phone Number
                        </label>
                        {isEditing && (
                          <span className={`text-sm font-semibold ${
                            profile.profile.phone?.length > CHARACTER_LIMITS.phone
                              ? 'text-red-400'
                              : profile.profile.phone?.length > CHARACTER_LIMITS.phone - 3
                              ? 'text-yellow-400'
                              : 'text-blue-200/70'
                          }`}>
                            {profile.profile.phone?.length || 0}/{CHARACTER_LIMITS.phone}
                          </span>
                        )}
                      </div>
                      <Input
                        value={profile.profile.phone}
                        onChange={(e) => {
                          if (e.target.value.length <= CHARACTER_LIMITS.phone) {
                            handleInputChange(e, 'profile.phone')
                          }
                        }}
                        disabled={!isEditing}
                        placeholder="+1 (555) 123-4567"
                        maxLength={CHARACTER_LIMITS.phone}
                        className="border-white/20 focus:border-cyan-400 focus:ring-cyan-400/20 bg-white/10 backdrop-blur-sm text-white placeholder-blue-200/60 transition-all duration-300 hover:bg-white/15"
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="block text-sm font-bold text-blue-100/90 tracking-wide uppercase">
                          Location
                        </label>
                        {isEditing && (
                          <span className={`text-sm font-semibold ${
                            profile.profile.location?.length > CHARACTER_LIMITS.location
                              ? 'text-red-400'
                              : profile.profile.location?.length > CHARACTER_LIMITS.location - 10
                              ? 'text-yellow-400'
                              : 'text-blue-200/70'
                          }`}>
                            {profile.profile.location?.length || 0}/{CHARACTER_LIMITS.location}
                          </span>
                        )}
                      </div>
                      <Input
                        value={profile.profile.location}
                        onChange={(e) => {
                          if (e.target.value.length <= CHARACTER_LIMITS.location) {
                            handleInputChange(e, 'profile.location')
                          }
                        }}
                        disabled={!isEditing}
                        placeholder="City, Country"
                        maxLength={CHARACTER_LIMITS.location}
                        className="border-white/20 focus:border-cyan-400 focus:ring-cyan-400/20 bg-white/10 backdrop-blur-sm text-white placeholder-blue-200/60 transition-all duration-300 hover:bg-white/15"
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="block text-sm font-bold text-blue-100/90 tracking-wide uppercase">
                          Website
                        </label>
                        {isEditing && (
                          <span className={`text-sm font-semibold ${
                            profile.profile.website?.length > CHARACTER_LIMITS.website
                              ? 'text-red-400'
                              : profile.profile.website?.length > CHARACTER_LIMITS.website - 20
                              ? 'text-yellow-400'
                              : 'text-blue-200/70'
                          }`}>
                            {profile.profile.website?.length || 0}/{CHARACTER_LIMITS.website}
                          </span>
                        )}
                      </div>
                      <Input
                        value={profile.profile.website}
                        onChange={(e) => {
                          if (e.target.value.length <= CHARACTER_LIMITS.website) {
                            handleInputChange(e, 'profile.website')
                          }
                        }}
                        disabled={!isEditing}
                        placeholder="https://yourwebsite.com"
                        maxLength={CHARACTER_LIMITS.website}
                        className="border-white/20 focus:border-cyan-400 focus:ring-cyan-400/20 bg-white/10 backdrop-blur-sm text-white placeholder-blue-200/60 transition-all duration-300 hover:bg-white/15"
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="block text-sm font-bold text-blue-100/90 tracking-wide uppercase">
                          LinkedIn Profile
                        </label>
                        {isEditing && (
                          <span className={`text-sm font-semibold ${
                            profile.profile.linkedin?.length > CHARACTER_LIMITS.linkedin
                              ? 'text-red-400'
                              : profile.profile.linkedin?.length > CHARACTER_LIMITS.linkedin - 20
                              ? 'text-yellow-400'
                              : 'text-blue-200/70'
                          }`}>
                            {profile.profile.linkedin?.length || 0}/{CHARACTER_LIMITS.linkedin}
                          </span>
                        )}
                      </div>
                      <Input
                        value={profile.profile.linkedin}
                        onChange={(e) => {
                          if (e.target.value.length <= CHARACTER_LIMITS.linkedin) {
                            handleInputChange(e, 'profile.linkedin')
                          }
                        }}
                        disabled={!isEditing}
                        placeholder="https://linkedin.com/in/yourprofile"
                        maxLength={CHARACTER_LIMITS.linkedin}
                        className="border-white/20 focus:border-cyan-400 focus:ring-cyan-400/20 bg-white/10 backdrop-blur-sm text-white placeholder-blue-200/60 transition-all duration-300 hover:bg-white/15"
                      />
                    </div>
                  </div>

                  <div className="mt-8 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-bold text-blue-100/90 tracking-wide uppercase">
                        GitHub Profile
                      </label>
                      {isEditing && (
                        <span className={`text-sm font-semibold ${
                          profile.profile.github?.length > CHARACTER_LIMITS.github
                            ? 'text-red-400'
                            : profile.profile.github?.length > CHARACTER_LIMITS.github - 20
                            ? 'text-yellow-400'
                            : 'text-blue-200/70'
                        }`}>
                          {profile.profile.github?.length || 0}/{CHARACTER_LIMITS.github}
                        </span>
                      )}
                    </div>
                    <Input
                      value={profile.profile.github}
                      onChange={(e) => {
                        if (e.target.value.length <= CHARACTER_LIMITS.github) {
                          handleInputChange(e, 'profile.github')
                        }
                      }}
                      disabled={!isEditing}
                      placeholder="https://github.com/yourusername"
                      maxLength={CHARACTER_LIMITS.github}
                      className="border-white/20 focus:border-cyan-400 focus:ring-cyan-400/20 bg-white/10 backdrop-blur-sm text-white placeholder-blue-200/60 transition-all duration-300 hover:bg-white/15"
                    />
                  </div>

                  <div className="mt-8 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-bold text-blue-100/90 tracking-wide uppercase">
                        Bio
                      </label>
                      {isEditing && (
                        <span className={`text-sm font-semibold ${
                          getRemainingChars(profile.profile.bio, CHARACTER_LIMITS.bio) < 0
                            ? 'text-red-400'
                            : getRemainingChars(profile.profile.bio, CHARACTER_LIMITS.bio) < 50
                            ? 'text-yellow-400'
                            : 'text-blue-200/70'
                        }`}>
                          {profile.profile.bio?.length || 0} / {CHARACTER_LIMITS.bio} characters
                        </span>
                      )}
                    </div>
                    <Textarea
                      value={profile.profile.bio}
                      onChange={(e) => {
                        if (e.target.value.length <= CHARACTER_LIMITS.bio) {
                          handleTextareaChange(e, 'profile.bio')
                        }
                      }}
                      disabled={!isEditing}
                      placeholder="Tell us about yourself..."
                      rows={4}
                      maxLength={CHARACTER_LIMITS.bio}
                      className="border-white/20 focus:border-cyan-400 focus:ring-cyan-400/20 bg-white/10 backdrop-blur-sm text-white placeholder-blue-200/60 transition-all duration-300 hover:bg-white/15 resize-none"
                    />
                  </div>
                </Card>
              )}

              {activeTab === 'career' && (
                <Card className="p-10 bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:bg-white/15">
                  <div className="flex items-center space-x-4 mb-10">
                    <div className="p-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
                      <Target className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-white">Career Profile</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-8">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="block text-sm font-bold text-blue-100/90 tracking-wide uppercase">
                          Education Background
                        </label>
                        {isEditing && (
                          <span className={`text-sm font-semibold ${
                            getRemainingChars(profile.profile.education || '', CHARACTER_LIMITS.education) < 0
                              ? 'text-red-400'
                              : getRemainingChars(profile.profile.education || '', CHARACTER_LIMITS.education) < 20
                              ? 'text-yellow-400'
                              : 'text-blue-200/70'
                          }`}>
                            {profile.profile.education?.length || 0} / {CHARACTER_LIMITS.education} characters
                          </span>
                        )}
                      </div>
                      <Input
                        value={profile.profile.education || ''}
                        onChange={(e) => {
                          if (e.target.value.length <= CHARACTER_LIMITS.education) {
                            handleInputChange(e, 'profile.education')
                          }
                        }}
                        disabled={!isEditing}
                        placeholder="e.g. B.Tech Computer Science, MBA Marketing"
                        maxLength={CHARACTER_LIMITS.education}
                        className="border-white/20 focus:border-cyan-400 focus:ring-cyan-400/20 bg-white/10 backdrop-blur-sm text-white placeholder-blue-200/60 transition-all duration-300 hover:bg-white/15"
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="block text-sm font-bold text-blue-100/90 tracking-wide uppercase">
                          Career Goal (Optional)
                        </label>
                        {isEditing && (
                          <span className={`text-sm font-semibold ${
                            getRemainingChars(profile.profile.careerGoal || '', CHARACTER_LIMITS.careerGoal) < 0
                              ? 'text-red-400'
                              : getRemainingChars(profile.profile.careerGoal || '', CHARACTER_LIMITS.careerGoal) < 30
                              ? 'text-yellow-400'
                              : 'text-blue-200/70'
                          }`}>
                            {profile.profile.careerGoal?.length || 0} / {CHARACTER_LIMITS.careerGoal} characters
                          </span>
                        )}
                      </div>
                      <Textarea
                        value={profile.profile.careerGoal || ''}
                        onChange={(e) => {
                          if (e.target.value.length <= CHARACTER_LIMITS.careerGoal) {
                            handleTextareaChange(e, 'profile.careerGoal')
                          }
                        }}
                        disabled={!isEditing}
                        placeholder="e.g. Machine Learning Engineer, Full-Stack Developer, Product Manager"
                        rows={3}
                        maxLength={CHARACTER_LIMITS.careerGoal}
                        className="border-white/20 focus:border-cyan-400 focus:ring-cyan-400/20 bg-white/10 backdrop-blur-sm text-white placeholder-blue-200/60 transition-all duration-300 hover:bg-white/15 resize-none"
                      />
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <label className="block text-sm font-bold text-blue-100/90 tracking-wide uppercase">
                          Interests & Areas of Interest
                        </label>
                        {isEditing && (
                          <Button
                            onClick={addInterest}
                            disabled={!newInterest.trim()}
                            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Interest
                          </Button>
                        )}
                      </div>

                      {isEditing && (
                        <div className="mb-6 p-6 bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10">
                          <h3 className="text-lg font-bold text-white mb-4">Add New Interest</h3>
                          <div className="flex gap-4">
                            <Input
                              value={newInterest}
                              onChange={(e) => setNewInterest(e.target.value)}
                              placeholder="e.g. AI/ML, Data Science, Web Development"
                              className="flex-1 border-white/20 focus:border-cyan-400 focus:ring-cyan-400/20 bg-white/10 backdrop-blur-sm text-white placeholder-blue-200/60 transition-all duration-300 hover:bg-white/15"
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  addInterest()
                                }
                              }}
                            />
                          </div>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-4">
                        {profile.profile.interests && profile.profile.interests.length > 0 ? (
                          profile.profile.interests.map((interest, index) => (
                            <Badge 
                              key={index} 
                              className="group px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-0 font-semibold text-sm hover:shadow-2xl hover:from-indigo-400 hover:to-purple-400 transition-all duration-300 rounded-full"
                            >
                              {interest}
                              {isEditing && (
                                <button
                                  onClick={() => removeInterest(index)}
                                  className="ml-3 text-white/80 hover:text-white transition-colors"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              )}
                            </Badge>
                          ))
                        ) : (
                          <div className="text-center py-10 text-blue-100/60 w-full">
                            <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 border border-white/20">
                              <Target className="w-8 h-8 text-blue-200/80" />
                            </div>
                            <p className="text-lg font-semibold text-white mb-2">No interests added yet</p>
                            {isEditing && (
                              <p className="text-blue-200/70">Add your interests to get personalized career recommendations</p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              )}

              {activeTab === 'skills' && (
                <Card className="p-10 bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:bg-white/15">
                  <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center space-x-4">
                      <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-lg">
                        <Briefcase className="w-8 h-8 text-white" />
                      </div>
                      <h2 className="text-3xl font-bold text-white">Skills & Experience</h2>
                    </div>
                    {isEditing && (
                      <Button
                        onClick={addSkill}
                        disabled={!newSkill.name.trim()}
                        className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300"
                      >
                        <Plus className="w-5 h-5 mr-2" />
                        Add Skill
                      </Button>
                    )}
                  </div>

                  {isEditing && (
                    <div className="mb-10 p-8 bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10">
                      <h3 className="text-xl font-bold text-white mb-6">Add New Skill</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Input
                          value={newSkill.name}
                          onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                          placeholder="Skill name"
                          className="border-white/20 focus:border-cyan-400 focus:ring-cyan-400/20 bg-white/10 backdrop-blur-sm text-white placeholder-blue-200/60 transition-all duration-300 hover:bg-white/15"
                        />
                        <select
                          value={newSkill.level}
                          onChange={(e) => setNewSkill({ ...newSkill, level: e.target.value as 'beginner' | 'intermediate' | 'advanced' | 'expert' })}
                          className="px-4 py-3 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400/20 focus:border-cyan-400 bg-white/10 backdrop-blur-sm text-white transition-all duration-300 hover:bg-white/15"
                        >
                          <option value="beginner" className="bg-gray-800">Beginner</option>
                          <option value="intermediate" className="bg-gray-800">Intermediate</option>
                          <option value="advanced" className="bg-gray-800">Advanced</option>
                          <option value="expert" className="bg-gray-800">Expert</option>
                        </select>
                        <Input
                          type="number"
                          value={newSkill.yearsOfExperience}
                          onChange={(e) => setNewSkill({ ...newSkill, yearsOfExperience: parseInt(e.target.value) || 0 })}
                          placeholder="Years of experience"
                          min="0"
                          max="50"
                          className="border-white/20 focus:border-cyan-400 focus:ring-cyan-400/20 bg-white/10 backdrop-blur-sm text-white placeholder-blue-200/60 transition-all duration-300 hover:bg-white/15"
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-6">
                    {profile.skills.map((skill, index) => (
                      <div
                        key={index}
                        className="group flex items-center justify-between p-8 bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 hover:shadow-2xl hover:bg-white/10 transition-all duration-300"
                      >
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-bold text-white text-xl group-hover:text-cyan-100 transition-colors">{skill.name}</h4>
                            <div className="flex items-center space-x-4">
                              <Badge className={`capitalize px-4 py-2 text-sm font-bold border-0 rounded-full ${getLevelColor(skill.level)} shadow-lg`}>
                                {skill.level}
                              </Badge>
                              <span className="text-sm font-semibold text-blue-100/80 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                                {skill.yearsOfExperience} {skill.yearsOfExperience === 1 ? 'year' : 'years'}
                              </span>
                              {isEditing && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeSkill(index)}
                                  className="text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-full p-3 transition-all duration-300"
                                >
                                  <X className="w-5 h-5" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {profile.skills.length === 0 && (
                      <div className="text-center py-20 text-blue-100/60">
                        <div className="w-24 h-24 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6 border border-white/20">
                          <Briefcase className="w-10 h-10 text-blue-200/80" />
                        </div>
                        <p className="text-xl font-semibold text-white mb-2">No skills added yet</p>
                        {isEditing && (
                          <p className="text-blue-200/70">Add your first skill above to get started</p>
                        )}
                      </div>
                    )}
                  </div>
                </Card>
              )}

              {activeTab === 'preferences' && (
                <Card className="p-10 bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:bg-white/15">
                  <div className="flex items-center space-x-4 mb-10">
                    <div className="p-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl shadow-lg">
                      <Settings className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-white">Job Preferences</h2>
                  </div>
                  
                  <div className="space-y-10">
                    <div className="space-y-4">
                      <label className="block text-sm font-bold text-blue-100/90 tracking-wide uppercase">
                        Remote Work Preference
                      </label>
                      <select
                        value={profile.preferences.remotePreference}
                        onChange={(e) => handleSelectChange(e, 'preferences.remotePreference')}
                        disabled={!isEditing}
                        className="w-full px-5 py-4 border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-400/20 focus:border-cyan-400 bg-white/10 backdrop-blur-sm text-white transition-all duration-300 hover:bg-white/15"
                      >
                        <option value="fully-remote" className="bg-gray-800">Fully Remote</option>
                        <option value="hybrid" className="bg-gray-800">Hybrid</option>
                        <option value="office-based" className="bg-gray-800">Office Based</option>
                        <option value="any" className="bg-gray-800">Any</option>
                      </select>
                    </div>

                    <div className="space-y-4">
                      <label className="block text-sm font-bold text-blue-100/90 tracking-wide uppercase">
                        Salary Range (USD)
                      </label>
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <Input
                            type="number"
                            value={profile.preferences.salaryRange.min}
                            onChange={(e) => handleInputChange(e, 'preferences.salaryRange.min')}
                            disabled={!isEditing}
                            placeholder="Minimum"
                            className="border-white/20 focus:border-cyan-400 focus:ring-cyan-400/20 bg-white/10 backdrop-blur-sm text-white placeholder-blue-200/60 transition-all duration-300 hover:bg-white/15"
                          />
                        </div>
                        <div>
                          <Input
                            type="number"
                            value={profile.preferences.salaryRange.max}
                            onChange={(e) => handleInputChange(e, 'preferences.salaryRange.max')}
                            disabled={!isEditing}
                            placeholder="Maximum"
                            className="border-white/20 focus:border-cyan-400 focus:ring-cyan-400/20 bg-white/10 backdrop-blur-sm text-white placeholder-blue-200/60 transition-all duration-300 hover:bg-white/15"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="block text-sm font-bold text-blue-100/90 tracking-wide uppercase">
                        Interested Tags
                      </label>
                      <div className="flex flex-wrap gap-4">
                        {profile.preferences.interestedTags.map((tag, index) => (
                          <Badge 
                            key={index} 
                            className="group px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-0 font-semibold text-sm hover:shadow-2xl hover:from-indigo-400 hover:to-purple-400 transition-all duration-300 rounded-full"
                          >
                            {tag}
                            {isEditing && (
                              <button
                                onClick={() => {
                                  const newTags = profile.preferences.interestedTags.filter((_, i) => i !== index)
                                  updateProfile('preferences.interestedTags', newTags)
                                }}
                                className="ml-3 text-white/80 hover:text-white transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            )}
                          </Badge>
                        ))}
                        {profile.preferences.interestedTags.length === 0 && (
                          <p className="text-blue-200/70 py-6">No interests selected</p>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              )}

              {activeTab === 'notifications' && (
                <Card className="p-10 bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:bg-white/15">
                  <div className="flex items-center space-x-4 mb-10">
                    <div className="p-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl shadow-lg">
                      <Bell className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-white">Notification Preferences</h2>
                  </div>
                  
                  <div className="space-y-6">
                    {[
                      { key: 'emailAlerts', label: 'Email Alerts', description: 'Receive email notifications for important updates', icon: Mail },
                      { key: 'jobMatches', label: 'Job Matches', description: 'Get notified when new jobs match your preferences', icon: Briefcase },
                      { key: 'applicationUpdates', label: 'Application Updates', description: 'Receive updates on your job applications', icon: Bell },
                      { key: 'weeklyDigest', label: 'Weekly Digest', description: 'Get a weekly summary of your activity and new opportunities', icon: Settings },
                    ].map((notification) => {
                      const IconComponent = notification.icon
                      return (
                        <div 
                          key={notification.key} 
                          className="group flex items-center justify-between p-8 bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 hover:shadow-2xl hover:bg-white/10 transition-all duration-300"
                        >
                          <div className="flex items-center space-x-5">
                            <div className="p-4 bg-gradient-to-r from-orange-400/20 to-red-400/20 backdrop-blur-sm rounded-2xl border border-white/20">
                              <IconComponent className="w-6 h-6 text-orange-200" />
                            </div>
                            <div>
                              <h4 className="font-bold text-white text-lg group-hover:text-orange-100 transition-colors">{notification.label}</h4>
                              <p className="text-blue-200/70 mt-2">{notification.description}</p>
                            </div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={profile.notifications[notification.key as keyof typeof profile.notifications]}
                              onChange={(e) => handleCheckboxChange(e, `notifications.${notification.key}`)}
                              disabled={!isEditing}
                              className="sr-only peer"
                            />
                            <div className="w-16 h-9 bg-white/10 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300/30 rounded-full peer peer-checked:after:translate-x-7 peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-7 after:w-7 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-cyan-400 peer-checked:to-blue-500 shadow-xl border border-white/20"></div>
                          </label>
                        </div>
                      )
                    })}
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
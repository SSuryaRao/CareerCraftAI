import { auth } from '@/lib/firebase'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

// Helper to get auth token
async function getAuthToken(): Promise<string> {
  const user = auth.currentUser
  if (!user) {
    throw new Error('User not authenticated')
  }
  return await user.getIdToken()
}

export interface UserProfile {
  _id: string
  firebaseUid: string
  email: string
  name: string
  picture?: string
  profile?: {
    title?: string
    bio?: string
    location?: string
    website?: string
    linkedin?: string
    github?: string
    phone?: string
    education?: string
    interests?: string[]
    careerGoal?: string
  }
  skills?: Array<{
    name: string
    level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
    yearsOfExperience: number
    category?: string
  }>
  preferences?: {
    jobTypes?: string[]
    remotePre?: string
    salaryRange?: {
      min: number
      max: number
    }
  }
}

/**
 * Get user profile
 */
export async function getUserProfile(): Promise<UserProfile> {
  try {
    const token = await getAuthToken()

    const response = await fetch(`${API_URL}/api/user/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to fetch profile')
    }

    const data = await response.json()
    return data.data || data.user || data
  } catch (error) {
    console.error('Get profile error:', error)
    throw error
  }
}

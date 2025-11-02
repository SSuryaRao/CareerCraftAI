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

export interface ResumeBuilderData {
  name: string
  email: string
  phone: string
  location: string
  linkedin: string
  github: string
  website: string
  professionalSummary: string
  education: string
  workExperience: Array<{
    company: string
    position: string
    startDate: string
    endDate: string
    current: boolean
    achievements: string[]
  }>
  projects: Array<{
    name: string
    link: string
    technologies: string
    description: string[]
  }>
  skills: {
    frontend: string[]
    backend: string[]
    database: string[]
    languages: string[]
    softSkills: string[]
  }
  extraCurricular: string[]
}

export interface CreateResumeResponse {
  success: boolean
  message: string
  downloadUrl: string
  resumeId: string
}

/**
 * Generate professional summary using AI
 */
export async function generateProfessionalSummary(
  resumeData: Partial<ResumeBuilderData>
): Promise<string> {
  try {
    const token = await getAuthToken()

    const response = await fetch(`${API_URL}/api/resume-builder/generate-summary`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(resumeData)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to generate summary')
    }

    const data = await response.json()
    return data.summary
  } catch (error) {
    console.error('Generate summary error:', error)
    throw error
  }
}

/**
 * Create resume PDF from profile data
 */
export async function createResumeFromProfile(
  resumeData: ResumeBuilderData,
  templateId: string = 'professional'
): Promise<CreateResumeResponse> {
  try {
    const token = await getAuthToken()

    const response = await fetch(`${API_URL}/api/resume-builder/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ ...resumeData, templateId })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to create resume')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Create resume error:', error)
    throw error
  }
}

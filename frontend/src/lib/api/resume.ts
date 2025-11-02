import { auth } from '@/lib/firebase'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export interface BackendResumeAnalysis {
  resumeId: string
  filename: string
  atsAnalysis: {
    overallScore: number
    scores: {
      keywords: number
      formatting: number
      experience: number
      skills: number
    }
    suggestions: Array<{
      section: string
      issue: string
      improvement: string
      beforeAfter?: {
        before: string
        after: string
      }
      priority: 'low' | 'medium' | 'high' | 'critical'
    }>
    keywordAnalysis: {
      found: string[]
      missing: string[]
      suggested: string[]
      density: number
    }
    strengths: string[]
    weaknesses: string[]
  }
  metadata: {
    processingTime: number
    textLength: number
    uploadedAt: string
  }
}

export interface ResumeHistoryItem {
  id: string
  filename: string
  originalName: string
  atsAnalysis: {
    overallScore: number
    scores: {
      keywords: number
      formatting: number
      experience: number
      skills: number
    }
  }
  status: 'uploading' | 'processing' | 'completed' | 'failed'
  createdAt: string
  updatedAt: string
}

export interface AnalyticsData {
  avgScore: number
  maxScore: number
  minScore: number
  totalResumes: number
  totalSuggestions: number
}

// Get authenticated user's ID token
const getAuthToken = async (): Promise<string> => {
  const user = auth.currentUser
  if (!user) {
    throw new Error('User not authenticated')
  }
  return await user.getIdToken()
}

// Upload and analyze resume
export const uploadAndAnalyzeResume = async (
  file: File,
  uploadMethod: 'drag-drop' | 'file-picker' = 'file-picker',
  onProgress?: (progress: number) => void
): Promise<BackendResumeAnalysis> => {
  const token = await getAuthToken()

  const formData = new FormData()
  formData.append('resume', file)
  formData.append('uploadMethod', uploadMethod)

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    
    // Track upload progress
    if (onProgress) {
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = (event.loaded / event.total) * 100
          onProgress(progress)
        }
      })
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const response = JSON.parse(xhr.responseText)
        if (response.success) {
          resolve(response.data)
        } else {
          reject(new Error(response.message || 'Upload failed'))
        }
      } else {
        const response = JSON.parse(xhr.responseText)
        reject(new Error(response.message || `HTTP ${xhr.status}: Upload failed`))
      }
    }

    xhr.onerror = () => {
      reject(new Error('Network error during upload'))
    }

    xhr.open('POST', `${API_BASE_URL}/api/resume/upload`)
    xhr.setRequestHeader('Authorization', `Bearer ${token}`)
    xhr.send(formData)
  })
}

// Get resume history
export const getResumeHistory = async (
  page: number = 1, 
  limit: number = 10
): Promise<{
  resumes: ResumeHistoryItem[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}> => {
  const token = await getAuthToken()
  
  const response = await fetch(
    `${API_BASE_URL}/api/resume/history?page=${page}&limit=${limit}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to fetch resume history')
  }

  const data = await response.json()
  return data.data
}

// Get specific resume analysis
export const getResumeAnalysis = async (resumeId: string): Promise<BackendResumeAnalysis> => {
  const token = await getAuthToken()
  
  const response = await fetch(`${API_BASE_URL}/api/resume/${resumeId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to fetch resume analysis')
  }

  const data = await response.json()
  return data.data
}

// Delete resume
export const deleteResume = async (resumeId: string): Promise<void> => {
  const token = await getAuthToken()
  
  const response = await fetch(`${API_BASE_URL}/api/resume/${resumeId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to delete resume')
  }
}

// Get analytics data
export const getAnalytics = async (): Promise<AnalyticsData> => {
  const token = await getAuthToken()

  const response = await fetch(`${API_BASE_URL}/api/resume/analytics`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to fetch analytics')
  }

  const data = await response.json()
  return data.data
}

// Improve resume based on analysis suggestions
export interface ImproveResumeResponse {
  resumeId: string
  improvement: {
    originalScore: number
    improvedScore: number
    scoreIncrease: number
    percentageIncrease: number
  }
  download: {
    url: string
    filename: string
  }
  appliedSuggestions: number
  processingTime: number
}

export const improveResume = async (
  resumeId: string,
  onProgress?: (status: string) => void
): Promise<ImproveResumeResponse> => {
  const token = await getAuthToken()

  if (onProgress) onProgress('Generating improved content...')

  const response = await fetch(`${API_BASE_URL}/api/resume/${resumeId}/improve`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to improve resume')
  }

  const data = await response.json()

  if (onProgress) onProgress('Improvement complete!')

  return data.data
}

// Get improvement status/history for a resume
export interface ImprovementStatus {
  hasImprovement: boolean
  improvement: {
    originalScore: number
    improvedScore: number
    scoreIncrease: number
    improvedResumeUrl: string
    appliedSuggestions: number
    generatedAt: string
    processingTime: number
  } | null
  originalScore: number
}

export const getImprovementStatus = async (resumeId: string): Promise<ImprovementStatus> => {
  const token = await getAuthToken()

  const response = await fetch(`${API_BASE_URL}/api/resume/${resumeId}/improvement`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to fetch improvement status')
  }

  const data = await response.json()
  return data.data
}
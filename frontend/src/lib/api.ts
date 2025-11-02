// src/lib/api.ts
import { auth } from './firebase'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

class ApiClient {
  private async getAuthToken(): Promise<string | null> {
    const user = auth.currentUser
    if (user) {
      try {
        return await user.getIdToken()
      } catch (error) {
        console.error('Error getting auth token:', error)
        return null
      }
    }
    return null
  }

  private async request<T = any>(
    endpoint: string,
    options: RequestInit & { timeout?: number } = {}
  ): Promise<ApiResponse<T>> {
    // Create abort controller for timeout
    // Use custom timeout if provided, otherwise default to 30 seconds
    const timeoutDuration = options.timeout || 30000
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeoutDuration)

    try {
      const token = await this.getAuthToken()

      // Remove timeout from options before passing to fetch
      const { timeout, ...fetchOptions } = options

      const config: RequestInit = {
        ...fetchOptions,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
          ...options.headers,
        },
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, config)
      clearTimeout(timeoutId)

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Request failed')
      }

      return data
    } catch (error) {
      clearTimeout(timeoutId)

      // Handle timeout errors specifically
      if (error instanceof Error && error.name === 'AbortError') {
        console.error('API request timeout:', endpoint)
        return {
          success: false,
          error: 'Request timed out. Please check your connection and try again.'
        }
      }

      console.error('API request error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }

  // User profile methods
  async getProfile(): Promise<ApiResponse<any>> {
    return this.request('/api/user/profile')
  }

  async updateProfile(profileData: any): Promise<ApiResponse<any>> {
    return this.request('/api/user/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    })
  }

  // Additional user methods
  async getSavedJobs(page = 1, limit = 10): Promise<ApiResponse<any>> {
    return this.request(`/api/user/saved-jobs?page=${page}&limit=${limit}`)
  }

  async saveJob(jobId: string, notes = ''): Promise<ApiResponse<any>> {
    return this.request(`/api/user/saved-jobs/${jobId}`, {
      method: 'POST',
      body: JSON.stringify({ notes })
    })
  }

  async unsaveJob(jobId: string): Promise<ApiResponse<any>> {
    return this.request(`/api/user/saved-jobs/${jobId}`, {
      method: 'DELETE'
    })
  }

  async getAppliedJobs(page = 1, limit = 10, status?: string): Promise<ApiResponse<any>> {
    const statusParam = status ? `&status=${status}` : ''
    return this.request(`/api/user/applied-jobs?page=${page}&limit=${limit}${statusParam}`)
  }

  async markJobAsApplied(jobId: string, status = 'applied', notes = ''): Promise<ApiResponse<any>> {
    return this.request(`/api/user/applied-jobs/${jobId}`, {
      method: 'POST',
      body: JSON.stringify({ status, notes })
    })
  }

  async getActivityLog(page = 1, limit = 20): Promise<ApiResponse<any>> {
    return this.request(`/api/user/activity?page=${page}&limit=${limit}`)
  }

  // Career Recommendations
  async generateRecommendations(): Promise<ApiResponse<any>> {
    return this.request('/api/recommendations/generate', {
      method: 'POST'
    })
  }

  async getRecommendations(): Promise<ApiResponse<any>> {
    return this.request('/api/recommendations/get')
  }

  // Enhanced Roadmap Management
  async saveRoadmapProgress(progressData: any): Promise<ApiResponse<any>> {
    return this.request('/api/roadmaps/save', {
      method: 'POST',
      body: JSON.stringify(progressData)
    })
  }

  async getRoadmapProgress(userId: string, domain?: string, skillLevel?: string): Promise<ApiResponse<any>> {
    const params = new URLSearchParams({ userId })
    if (domain) params.append('domain', domain)
    if (skillLevel) params.append('skillLevel', skillLevel)
    return this.request(`/api/roadmaps/get?${params.toString()}`)
  }

  async getUserRoadmaps(): Promise<ApiResponse<any>> {
    return this.request('/api/roadmaps/user')
  }

  async toggleMilestone(roadmapId: string, milestoneId: string, milestoneTitle: string, isCompleted: boolean): Promise<ApiResponse<any>> {
    return this.request('/api/roadmaps/milestone/toggle', {
      method: 'POST',
      body: JSON.stringify({ roadmapId, milestoneId, milestoneTitle, isCompleted })
    })
  }

  async getRoadmapStats(): Promise<ApiResponse<any>> {
    return this.request('/api/roadmaps/stats')
  }

  async deactivateRoadmap(roadmapId: string): Promise<ApiResponse<any>> {
    return this.request(`/api/roadmaps/${roadmapId}`, {
      method: 'DELETE'
    })
  }

  // Chatbot Methods
  async sendChatbotMessage(message: string, sessionId: string): Promise<ApiResponse<any>> {
    return this.request('/api/chatbot/message', {
      method: 'POST',
      body: JSON.stringify({ message, sessionId })
    })
  }

  async getChatbotHealth(): Promise<ApiResponse<any>> {
    return this.request('/api/chatbot/health')
  }

  // AI Mentor Methods
  async sendMentorMessage(message: string, mentorPersona: any, language = 'English'): Promise<ApiResponse<any>> {
    return this.request('/api/mentor/message', {
      method: 'POST',
      body: JSON.stringify({ message, mentorPersona, language })
    })
  }

  async getMentorConversations(): Promise<ApiResponse<any>> {
    return this.request('/api/mentor/conversations')
  }

  async getMentorConversationHistory(mentorId: string): Promise<ApiResponse<any>> {
    return this.request(`/api/mentor/conversation/${mentorId}`)
  }

  async getMentorProgressAnalysis(): Promise<ApiResponse<any>> {
    return this.request('/api/mentor/progress')
  }

  async generateLearningPath(targetRole?: string, timeframe = '3 months'): Promise<ApiResponse<any>> {
    return this.request('/api/mentor/learning-path', {
      method: 'POST',
      body: JSON.stringify({ targetRole, timeframe })
    })
  }

  async getCareerGuidance(situation: string): Promise<ApiResponse<any>> {
    return this.request('/api/mentor/career-guidance', {
      method: 'POST',
      body: JSON.stringify({ situation })
    })
  }

  // Scholarship Methods
  async getAllScholarships(params?: { category?: string; excludeCategory?: string; domain?: string; trending?: boolean; limit?: number; page?: number; sortBy?: string }): Promise<ApiResponse<any>> {
    const queryParams = new URLSearchParams()
    if (params?.category) queryParams.append('category', params.category)
    if (params?.excludeCategory) queryParams.append('excludeCategory', params.excludeCategory)
    if (params?.domain) queryParams.append('domain', params.domain)
    if (params?.trending !== undefined) queryParams.append('trending', String(params.trending))
    if (params?.limit) queryParams.append('limit', String(params.limit))
    if (params?.page) queryParams.append('page', String(params.page))
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy)

    const queryString = queryParams.toString()
    return this.request(`/api/scholarships${queryString ? `?${queryString}` : ''}`)
  }

  async getPersonalizedScholarships(): Promise<ApiResponse<any>> {
    return this.request('/api/scholarships/personalized', {
      method: 'POST',
      timeout: 120000 // 2 minutes timeout for AI generation
    })
  }

  async getTrendingScholarships(): Promise<ApiResponse<any>> {
    return this.request('/api/scholarships/trending')
  }

  async getScholarshipById(id: string): Promise<ApiResponse<any>> {
    return this.request(`/api/scholarships/${id}`)
  }

  // Job Methods
  async getAllJobs(params?: {
    page?: number
    limit?: number
    search?: string
    location?: string
    tags?: string[]
    company?: string
    jobType?: string
    experienceLevel?: string
    sortBy?: string
    sortOrder?: string
    daysOld?: number
  }): Promise<ApiResponse<any>> {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.append('page', String(params.page))
    if (params?.limit) queryParams.append('limit', String(params.limit))
    if (params?.search) queryParams.append('search', params.search)
    if (params?.location) queryParams.append('location', params.location)
    if (params?.tags) params.tags.forEach(tag => queryParams.append('tags', tag))
    if (params?.company) queryParams.append('company', params.company)
    if (params?.jobType) queryParams.append('jobType', params.jobType)
    if (params?.experienceLevel) queryParams.append('experienceLevel', params.experienceLevel)
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy)
    if (params?.daysOld) queryParams.append('daysOld', String(params.daysOld))
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder)

    const queryString = queryParams.toString()
    return this.request(`/api/jobs${queryString ? `?${queryString}` : ''}`)
  }

  async getJobById(jobId: string): Promise<ApiResponse<any>> {
    return this.request(`/api/jobs/${jobId}`)
  }

  async getFeaturedJobs(limit = 6): Promise<ApiResponse<any>> {
    return this.request(`/api/jobs/featured?limit=${limit}`)
  }

  async getJobStats(): Promise<ApiResponse<any>> {
    return this.request('/api/jobs/stats')
  }

  async searchJobs(query: string, limit = 10): Promise<ApiResponse<any>> {
    return this.request(`/api/jobs/search?q=${encodeURIComponent(query)}&limit=${limit}`)
  }

  async getJobRecommendations(params?: {
    limit?: number
    minMatchScore?: number
  }): Promise<ApiResponse<any>> {
    const queryParams = new URLSearchParams()
    if (params?.limit) queryParams.append('limit', String(params.limit))
    if (params?.minMatchScore) queryParams.append('minMatchScore', String(params.minMatchScore))

    const queryString = queryParams.toString()
    // Use 60 second timeout for AI recommendations (they take longer)
    return this.request(`/api/jobs/recommendations${queryString ? `?${queryString}` : ''}`, {
      timeout: 60000
    })
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<any>> {
    return this.request('/api/health')
  }
}

export const apiClient = new ApiClient()
export default apiClient
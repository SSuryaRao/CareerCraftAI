import { authService } from './authService';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface Job {
  id: string;
  remoteId: string;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  description: string;
  tags: string[];
  salary: {
    min: number | null;
    max: number | null;
    currency: string;
  };
  jobType: 'full-time' | 'part-time' | 'contract' | 'freelance' | 'internship';
  experienceLevel: 'entry' | 'mid' | 'senior' | 'lead' | 'executive';
  applicationUrl: string;
  postedAt: string;
  expiresAt?: string;
  isActive: boolean;
  featured: boolean;
  remoteLevel: 'fully-remote' | 'hybrid' | 'office-based';
  sourceApi: string;
  createdAt: string;
  updatedAt: string;
}

export interface JobsResponse {
  success: boolean;
  data: {
    jobs: Job[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalJobs: number;
      hasNext: boolean;
      hasPrev: boolean;
      limit: number;
    };
  };
}

export interface JobStatsResponse {
  success: boolean;
  data: {
    totalJobs: number;
    totalCompanies: number;
    recentJobs: number;
    jobTypeBreakdown: Array<{ _id: string; count: number }>;
    experienceLevelBreakdown: Array<{ _id: string; count: number }>;
    topTags: Array<{ name: string; count: number }>;
  };
}

export interface SearchJobsResponse {
  success: boolean;
  data: {
    jobs: Job[];
    total: number;
  };
}

class JobService {
  private async fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    try {
      // Use Record<string, string> for headers to ensure it's a plain object
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string> || {}),
      };

      const token = await authService.getIdToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error(`API Error for ${endpoint}:`, error);
      throw error;
    }
  }

  async getAllJobs(params: {
    page?: number;
    limit?: number;
    search?: string;
    tags?: string[];
    company?: string;
    jobType?: string;
    experienceLevel?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}): Promise<JobsResponse> {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          queryParams.append(key, value.join(','));
        } else {
          queryParams.append(key, value.toString());
        }
      }
    });

    const endpoint = `/api/jobs${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.fetchAPI<JobsResponse>(endpoint);
  }

  async getJobById(id: string): Promise<{ success: boolean; data: Job }> {
    return this.fetchAPI<{ success: boolean; data: Job }>(`/api/jobs/${id}`);
  }

  async getFeaturedJobs(limit: number = 6): Promise<{ success: boolean; data: Job[] }> {
    return this.fetchAPI<{ success: boolean; data: Job[] }>(`/api/jobs/featured?limit=${limit}`);
  }

  async getJobStats(): Promise<JobStatsResponse> {
    return this.fetchAPI<JobStatsResponse>('/api/jobs/stats');
  }

  async searchJobs(query: string, limit: number = 10): Promise<SearchJobsResponse> {
    const queryParams = new URLSearchParams({
      q: query,
      limit: limit.toString()
    });
    
    return this.fetchAPI<SearchJobsResponse>(`/api/jobs/search?${queryParams.toString()}`);
  }

  formatSalary(job: Job): string {
    const { salary } = job;
    
    if (!salary.min && !salary.max) {
      return 'Salary not disclosed';
    }
    
    const formatAmount = (amount: number | null): string => {
      if (!amount) return '';
      
      if (amount >= 1000000) {
        return `${(amount / 1000000).toFixed(1)}M`;
      } else if (amount >= 1000) {
        return `${(amount / 1000).toFixed(0)}K`;
      }
      return amount.toString();
    };
    
    const currency = salary.currency === 'USD' ? '$' : salary.currency;
    
    if (salary.min && salary.max) {
      return `${currency}${formatAmount(salary.min)} - ${currency}${formatAmount(salary.max)}`;
    } else if (salary.min) {
      return `${currency}${formatAmount(salary.min)}+`;
    } else if (salary.max) {
      return `Up to ${currency}${formatAmount(salary.max)}`;
    }
    
    return 'Salary not disclosed';
  }

  formatTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMilliseconds = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    } else {
      const diffInWeeks = Math.floor(diffInDays / 7);
      return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
    }
  }

  getExperienceLevelLabel(level: string): string {
    const labels: Record<string, string> = {
      entry: 'Entry Level',
      mid: 'Mid Level',
      senior: 'Senior Level',
      lead: 'Lead/Staff',
      executive: 'Executive'
    };
    return labels[level] || level;
  }

  getJobTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      'full-time': 'Full Time',
      'part-time': 'Part Time',
      'contract': 'Contract',
      'freelance': 'Freelance',
      'internship': 'Internship'
    };
    return labels[type] || type;
  }

  // User-specific methods (require authentication)
  async saveJob(jobId: string, notes?: string): Promise<void> {
    await this.fetchAPI(`/api/user/saved-jobs/${jobId}`, {
      method: 'POST',
      body: JSON.stringify({ notes: notes || '' }),
    });
  }

  async unsaveJob(jobId: string): Promise<void> {
    await this.fetchAPI(`/api/user/saved-jobs/${jobId}`, {
      method: 'DELETE',
    });
  }

  async getSavedJobs(page: number = 1, limit: number = 10): Promise<JobsResponse> {
    return this.fetchAPI<JobsResponse>(`/api/user/saved-jobs?page=${page}&limit=${limit}`);
  }

  async markJobAsApplied(jobId: string, status: string = 'applied', notes?: string): Promise<void> {
    await this.fetchAPI(`/api/user/applied-jobs/${jobId}`, {
      method: 'POST',
      body: JSON.stringify({ status, notes: notes || '' }),
    });
  }

  async getAppliedJobs(page: number = 1, limit: number = 10, status?: string): Promise<JobsResponse> {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    if (status) params.append('status', status);
    
    return this.fetchAPI<JobsResponse>(`/api/user/applied-jobs?${params.toString()}`);
  }
}

export const jobService = new JobService();
export default jobService;
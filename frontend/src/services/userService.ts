import { authService } from './authService';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  picture?: string;
  emailVerified: boolean;
  profile: {
    title: string;
    bio: string;
    location: string;
    website: string;
    linkedin: string;
    github: string;
    phone: string;
  };
  skills: Array<{
    name: string;
    level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    yearsOfExperience: number;
  }>;
  preferences: {
    jobTypes: string[];
    experienceLevels: string[];
    remotePreference: 'fully-remote' | 'hybrid' | 'office-based' | 'any';
    preferredLocations: string[];
    salaryRange: {
      min: number;
      max: number;
      currency: string;
    };
    interestedTags: string[];
  };
  notifications: {
    emailAlerts: boolean;
    jobMatches: boolean;
    applicationUpdates: boolean;
    weeklyDigest: boolean;
  };
  subscription: {
    plan: 'free' | 'premium' | 'enterprise';
    validUntil?: string;
    features: string[];
  };
  lastLoginAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityLogItem {
  action: string;
  details: any;
  timestamp: string;
}

class UserService {
  private async fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
      };

      const token = await authService.getIdToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication expired. Please sign in again.');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error(`User API Error for ${endpoint}:`, error);
      throw error;
    }
  }

  async getProfile(): Promise<UserProfile> {
    const response = await this.fetchAPI<{ success: boolean; data: UserProfile }>('/api/user/profile');
    return response.data;
  }

  async updateProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    const response = await this.fetchAPI<{ success: boolean; data: UserProfile }>('/api/user/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return response.data;
  }

  async updateProfileSection(section: keyof UserProfile, data: any): Promise<UserProfile> {
    return this.updateProfile({ [section]: data });
  }

  async addSkill(skill: { name: string; level: string; yearsOfExperience: number }): Promise<UserProfile> {
    const profile = await this.getProfile();
    const updatedSkills = [...profile.skills, skill];
    return this.updateProfile({ skills: updatedSkills });
  }

  async removeSkill(skillName: string): Promise<UserProfile> {
    const profile = await this.getProfile();
    const updatedSkills = profile.skills.filter(skill => skill.name !== skillName);
    return this.updateProfile({ skills: updatedSkills });
  }

  async updatePreferences(preferences: Partial<UserProfile['preferences']>): Promise<UserProfile> {
    const profile = await this.getProfile();
    const updatedPreferences = { ...profile.preferences, ...preferences };
    return this.updateProfile({ preferences: updatedPreferences });
  }

  async updateNotifications(notifications: Partial<UserProfile['notifications']>): Promise<UserProfile> {
    const profile = await this.getProfile();
    const updatedNotifications = { ...profile.notifications, ...notifications };
    return this.updateProfile({ notifications: updatedNotifications });
  }

  async getActivityLog(page: number = 1, limit: number = 20): Promise<{
    activities: ActivityLogItem[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  }> {
    const response = await this.fetchAPI<{
      success: boolean;
      data: {
        activities: ActivityLogItem[];
        pagination: any;
      };
    }>(`/api/user/activity?page=${page}&limit=${limit}`);
    
    return response.data;
  }

  async deleteAccount(): Promise<void> {
    await this.fetchAPI('/api/user/account', {
      method: 'DELETE',
    });
  }

  // Helper methods for common operations
  isProfileComplete(profile: UserProfile): boolean {
    const requiredFields = [
      profile.profile.title,
      profile.profile.bio,
      profile.profile.location,
    ];
    
    return requiredFields.every(field => field && field.trim().length > 0) &&
           profile.skills.length > 0;
  }

  getProfileCompletionPercentage(profile: UserProfile): number {
    const fields = [
      profile.profile.title,
      profile.profile.bio,
      profile.profile.location,
      profile.profile.phone,
      profile.profile.linkedin,
      profile.profile.website,
    ];
    
    const completedFields = fields.filter(field => field && field.trim().length > 0).length;
    const skillsBonus = profile.skills.length > 0 ? 1 : 0;
    const preferencesBonus = profile.preferences.interestedTags.length > 0 ? 1 : 0;
    
    return Math.round(((completedFields + skillsBonus + preferencesBonus) / (fields.length + 2)) * 100);
  }

  getRecommendedSkills(currentSkills: string[]): string[] {
    const popularSkills = [
      'JavaScript', 'Python', 'React', 'Node.js', 'TypeScript', 'AWS', 'Docker',
      'SQL', 'MongoDB', 'GraphQL', 'REST APIs', 'Git', 'Agile', 'Scrum',
      'Machine Learning', 'Data Analysis', 'UI/UX Design', 'Product Management',
      'Marketing', 'Sales', 'Project Management', 'Leadership', 'Communication'
    ];
    
    return popularSkills.filter(skill => 
      !currentSkills.some(current => 
        current.toLowerCase().includes(skill.toLowerCase())
      )
    ).slice(0, 10);
  }
}

export const userService = new UserService();
export default userService;
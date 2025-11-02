import { auth } from '@/lib/firebase';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface FeedbackSubmission {
  type: string;
  category: string;
  subject: string;
  message: string;
  email?: string;
  rating?: number;
  pageUrl?: string;
  isAnonymous?: boolean;
}

export interface Feedback {
  id: string;
  type: string;
  category: string;
  subject: string;
  message: string;
  email?: string;
  rating?: number;
  status: string;
  priority: string;
  adminResponse?: string;
  attachments: Array<{
    filename: string;
    url: string;
    mimetype: string;
    size: number;
  }>;
  sentiment?: {
    score: number;
    magnitude: number;
    label: string;
  };
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

async function getAuthToken(): Promise<string | null> {
  const user = auth.currentUser;
  if (!user) return null;
  return await user.getIdToken();
}

export async function submitFeedback(
  data: FeedbackSubmission,
  files?: File[]
): Promise<{ success: boolean; data?: any; message?: string; error?: string }> {
  try {
    const formData = new FormData();

    // Append feedback data
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    // Append files if any
    if (files && files.length > 0) {
      files.forEach((file) => {
        formData.append('attachments', file);
      });
    }

    const token = await getAuthToken();
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/api/feedback/submit`, {
      method: 'POST',
      headers,
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to submit feedback');
    }

    return result;
  } catch (error: any) {
    console.error('Error submitting feedback:', error);
    return {
      success: false,
      error: error.message || 'An error occurred',
    };
  }
}

export async function getUserFeedback(params?: {
  page?: number;
  limit?: number;
  status?: string;
  type?: string;
}): Promise<{
  success: boolean;
  data?: { feedback: Feedback[]; pagination: any };
  error?: string;
}> {
  try {
    const token = await getAuthToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', String(params.page));
    if (params?.limit) queryParams.append('limit', String(params.limit));
    if (params?.status) queryParams.append('status', params.status);
    if (params?.type) queryParams.append('type', params.type);

    const response = await fetch(
      `${API_URL}/api/feedback/user?${queryParams.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to fetch feedback');
    }

    return result;
  } catch (error: any) {
    console.error('Error fetching user feedback:', error);
    return {
      success: false,
      error: error.message || 'An error occurred',
    };
  }
}

export async function getAllFeedback(params?: {
  page?: number;
  limit?: number;
  status?: string;
  type?: string;
  priority?: string;
  search?: string;
}): Promise<{
  success: boolean;
  data?: { feedback: Feedback[]; pagination: any };
  error?: string;
}> {
  try {
    const token = await getAuthToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', String(params.page));
    if (params?.limit) queryParams.append('limit', String(params.limit));
    if (params?.status) queryParams.append('status', params.status);
    if (params?.type) queryParams.append('type', params.type);
    if (params?.priority) queryParams.append('priority', params.priority);
    if (params?.search) queryParams.append('search', params.search);

    const response = await fetch(
      `${API_URL}/api/feedback/admin/all?${queryParams.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to fetch feedback');
    }

    return result;
  } catch (error: any) {
    console.error('Error fetching all feedback:', error);
    return {
      success: false,
      error: error.message || 'An error occurred',
    };
  }
}

export async function updateFeedback(
  id: string,
  updates: {
    status?: string;
    priority?: string;
    adminNotes?: string;
    adminResponse?: string;
  }
): Promise<{ success: boolean; data?: Feedback; message?: string; error?: string }> {
  try {
    const token = await getAuthToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_URL}/api/feedback/admin/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to update feedback');
    }

    return result;
  } catch (error: any) {
    console.error('Error updating feedback:', error);
    return {
      success: false,
      error: error.message || 'An error occurred',
    };
  }
}

export async function deleteFeedback(id: string): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  try {
    const token = await getAuthToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_URL}/api/feedback/admin/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to delete feedback');
    }

    return result;
  } catch (error: any) {
    console.error('Error deleting feedback:', error);
    return {
      success: false,
      error: error.message || 'An error occurred',
    };
  }
}

export async function getFeedbackStats(): Promise<{
  success: boolean;
  data?: any;
  error?: string;
}> {
  try {
    const token = await getAuthToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_URL}/api/feedback/stats`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to fetch stats');
    }

    return result;
  } catch (error: any) {
    console.error('Error fetching feedback stats:', error);
    return {
      success: false,
      error: error.message || 'An error occurred',
    };
  }
}

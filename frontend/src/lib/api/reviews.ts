import { auth } from '@/lib/firebase';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface ReviewSubmission {
  rating: number;
  title: string;
  review: string;
  userRole?: string;
  aspectRatings?: {
    features?: number;
    support?: number;
    easeOfUse?: number;
    valueForMoney?: number;
  };
  platform?: string;
}

export interface Review {
  id: string;
  userId?: string;
  userName: string;
  userPicture?: string;
  userRole: string;
  rating: number;
  title: string;
  review: string;
  aspectRatings?: {
    features?: number;
    support?: number;
    easeOfUse?: number;
    valueForMoney?: number;
  };
  status: string;
  isVerifiedUser: boolean;
  isFeatured: boolean;
  helpfulCount: number;
  teamResponse?: string;
  responseDate?: string;
  createdAt: string;
  updatedAt: string;
  approvedAt?: string;
}

async function getAuthToken(): Promise<string | null> {
  const user = auth.currentUser;
  if (!user) return null;
  return await user.getIdToken();
}

export async function submitReview(
  data: ReviewSubmission
): Promise<{ success: boolean; data?: any; message?: string; error?: string }> {
  try {
    const token = await getAuthToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_URL}/api/reviews/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to submit review');
    }

    return result;
  } catch (error: any) {
    console.error('Error submitting review:', error);
    return {
      success: false,
      error: error.message || 'An error occurred',
    };
  }
}

export async function getUserReview(): Promise<{
  success: boolean;
  data?: Review | null;
  error?: string;
}> {
  try {
    const token = await getAuthToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_URL}/api/reviews/user/my-review`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to fetch review');
    }

    return result;
  } catch (error: any) {
    console.error('Error fetching user review:', error);
    return {
      success: false,
      error: error.message || 'An error occurred',
    };
  }
}

export async function getApprovedReviews(params?: {
  page?: number;
  limit?: number;
  sort?: string;
  minRating?: number;
}): Promise<{
  success: boolean;
  data?: { reviews: Review[]; pagination: any };
  error?: string;
}> {
  try {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', String(params.page));
    if (params?.limit) queryParams.append('limit', String(params.limit));
    if (params?.sort) queryParams.append('sort', params.sort);
    if (params?.minRating) queryParams.append('minRating', String(params.minRating));

    const response = await fetch(
      `${API_URL}/api/reviews/approved?${queryParams.toString()}`
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to fetch reviews');
    }

    return result;
  } catch (error: any) {
    console.error('Error fetching approved reviews:', error);
    return {
      success: false,
      error: error.message || 'An error occurred',
    };
  }
}

export async function getFeaturedReviews(limit?: number): Promise<{
  success: boolean;
  data?: Review[];
  error?: string;
}> {
  try {
    const queryParams = new URLSearchParams();
    if (limit) queryParams.append('limit', String(limit));

    const response = await fetch(
      `${API_URL}/api/reviews/featured?${queryParams.toString()}`
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to fetch featured reviews');
    }

    return result;
  } catch (error: any) {
    console.error('Error fetching featured reviews:', error);
    return {
      success: false,
      error: error.message || 'An error occurred',
    };
  }
}

export async function markReviewHelpful(id: string): Promise<{
  success: boolean;
  data?: { helpfulCount: number; isHelpful: boolean };
  message?: string;
  error?: string;
}> {
  try {
    const token = await getAuthToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_URL}/api/reviews/${id}/helpful`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to mark review as helpful');
    }

    return result;
  } catch (error: any) {
    console.error('Error marking review as helpful:', error);
    return {
      success: false,
      error: error.message || 'An error occurred',
    };
  }
}

export async function getAllReviews(params?: {
  page?: number;
  limit?: number;
  status?: string;
  minRating?: number;
  search?: string;
  sort?: string;
}): Promise<{
  success: boolean;
  data?: { reviews: Review[]; pagination: any };
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
    if (params?.minRating) queryParams.append('minRating', String(params.minRating));
    if (params?.search) queryParams.append('search', params.search);
    if (params?.sort) queryParams.append('sort', params.sort);

    const response = await fetch(
      `${API_URL}/api/reviews/admin/all?${queryParams.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to fetch reviews');
    }

    return result;
  } catch (error: any) {
    console.error('Error fetching all reviews:', error);
    return {
      success: false,
      error: error.message || 'An error occurred',
    };
  }
}

export async function approveReview(id: string): Promise<{
  success: boolean;
  data?: Review;
  message?: string;
  error?: string;
}> {
  try {
    const token = await getAuthToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_URL}/api/reviews/admin/${id}/approve`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to approve review');
    }

    return result;
  } catch (error: any) {
    console.error('Error approving review:', error);
    return {
      success: false,
      error: error.message || 'An error occurred',
    };
  }
}

export async function rejectReview(id: string, reason?: string): Promise<{
  success: boolean;
  data?: Review;
  message?: string;
  error?: string;
}> {
  try {
    const token = await getAuthToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_URL}/api/reviews/admin/${id}/reject`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ reason }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to reject review');
    }

    return result;
  } catch (error: any) {
    console.error('Error rejecting review:', error);
    return {
      success: false,
      error: error.message || 'An error occurred',
    };
  }
}

export async function toggleReviewFeatured(id: string): Promise<{
  success: boolean;
  data?: { isFeatured: boolean };
  message?: string;
  error?: string;
}> {
  try {
    const token = await getAuthToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_URL}/api/reviews/admin/${id}/feature`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to toggle featured status');
    }

    return result;
  } catch (error: any) {
    console.error('Error toggling featured status:', error);
    return {
      success: false,
      error: error.message || 'An error occurred',
    };
  }
}

export async function respondToReview(id: string, response: string): Promise<{
  success: boolean;
  data?: Review;
  message?: string;
  error?: string;
}> {
  try {
    const token = await getAuthToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const res = await fetch(`${API_URL}/api/reviews/admin/${id}/respond`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ response }),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || 'Failed to respond to review');
    }

    return result;
  } catch (error: any) {
    console.error('Error responding to review:', error);
    return {
      success: false,
      error: error.message || 'An error occurred',
    };
  }
}

export async function deleteReview(id: string): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  try {
    const token = await getAuthToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_URL}/api/reviews/admin/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to delete review');
    }

    return result;
  } catch (error: any) {
    console.error('Error deleting review:', error);
    return {
      success: false,
      error: error.message || 'An error occurred',
    };
  }
}

export async function getReviewStats(): Promise<{
  success: boolean;
  data?: any;
  error?: string;
}> {
  try {
    const response = await fetch(`${API_URL}/api/reviews/stats`);

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to fetch stats');
    }

    return result;
  } catch (error: any) {
    console.error('Error fetching review stats:', error);
    return {
      success: false,
      error: error.message || 'An error occurred',
    };
  }
}

import axios, { AxiosError } from 'axios';
import { auth } from '@/lib/firebase';
import toast from 'react-hot-toast';

// Create axios instance
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<any>) => {
    const status = error.response?.status;
    const data = error.response?.data;

    // Handle 401 Unauthorized
    if (status === 401) {
      toast.error('Please login to continue');
      setTimeout(() => {
        window.location.href = '/login';
      }, 1500);
      return Promise.reject(error);
    }

    // Handle 429 Usage Limit Exceeded
    if (status === 429) {
      const message = data?.message || 'Usage limit exceeded';
      const upgradeRequired = data?.upgradeRequired;

      toast.error(message, {
        duration: 6000,
        icon: '⚠️',
      });

      // Dispatch custom event for upgrade modal
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('show-upgrade-modal', {
          detail: {
            feature: data?.feature,
            upgradeRequired,
            used: data?.used,
            limit: data?.limit,
          }
        }));
      }

      return Promise.reject(error);
    }

    // Handle 403 Feature Not Available
    if (status === 403 && data?.error === 'Feature not available') {
      const message = data?.message || 'This feature is not available in your plan';
      const upgradeRequired = data?.upgradeRequired;

      toast.error(message, {
        duration: 6000,
        icon: '🔒',
      });

      // Dispatch custom event for upgrade modal
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('show-upgrade-modal', {
          detail: {
            feature: data?.feature,
            upgradeRequired,
            currentTier: 'free',
          }
        }));
      }

      return Promise.reject(error);
    }

    // Handle other errors
    if (data?.message) {
      toast.error(data.message);
    } else if (error.message) {
      toast.error(error.message);
    } else {
      toast.error('An error occurred. Please try again.');
    }

    return Promise.reject(error);
  }
);

export default apiClient;

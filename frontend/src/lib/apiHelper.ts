import toast from 'react-hot-toast';

export interface APIError {
  error: string;
  message: string;
  limit?: number;
  used?: number;
  resetDate?: string;
  upgradeRequired?: 'premium' | 'pro';
  feature?: string;
}

export function handleAPIError(error: APIError) {
  if (error.error === 'Usage limit exceeded') {
    toast.error(error.message, {
      duration: 5000,
      icon: '⚠️',
    });

    // You can trigger an upgrade modal here
    // Example: dispatchEvent(new CustomEvent('show-upgrade-modal', { detail: error }));

    return {
      shouldUpgrade: true,
      upgradeRequired: error.upgradeRequired,
      feature: error.feature
    };
  }

  if (error.error === 'Feature not available') {
    toast.error(error.message, {
      duration: 5000,
      icon: '🔒',
    });

    return {
      shouldUpgrade: true,
      upgradeRequired: error.upgradeRequired,
      feature: error.feature
    };
  }

  toast.error(error.message || 'An error occurred');
  return { shouldUpgrade: false };
}

// Example usage in your components:
/*
try {
  const response = await fetch(API_URL, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  const data = await response.json();

  if (!data.success) {
    const errorInfo = handleAPIError(data);
    if (errorInfo.shouldUpgrade) {
      // Show upgrade modal or redirect to pricing
      setShowUpgradeModal(true);
      setUpgradeInfo({
        tier: errorInfo.upgradeRequired,
        feature: errorInfo.feature
      });
    }
    return;
  }

  // Process successful response
} catch (error) {
  toast.error('Network error');
}
*/

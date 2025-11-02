'use client';

import { useEffect, useState } from 'react';
import UpgradeModal from '@/components/ui/UpgradeModal';

interface UpgradeEventDetail {
  feature?: string;
  upgradeRequired?: 'premium' | 'pro';
  used?: number;
  limit?: number;
  currentTier?: string;
}

export default function GlobalErrorHandler() {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeDetails, setUpgradeDetails] = useState<UpgradeEventDetail>({
    feature: '',
    upgradeRequired: 'premium',
    currentTier: 'free'
  });

  useEffect(() => {
    // Listen for upgrade modal events from apiInterceptor
    const handleShowUpgradeModal = (event: CustomEvent<UpgradeEventDetail>) => {
      const detail = event.detail;
      setUpgradeDetails({
        feature: detail.feature || 'this feature',
        upgradeRequired: detail.upgradeRequired || 'premium',
        used: detail.used,
        limit: detail.limit,
        currentTier: detail.currentTier || 'free'
      });
      setShowUpgradeModal(true);
    };

    // Type assertion for CustomEvent
    window.addEventListener('show-upgrade-modal', handleShowUpgradeModal as EventListener);

    return () => {
      window.removeEventListener('show-upgrade-modal', handleShowUpgradeModal as EventListener);
    };
  }, []);

  return (
    <UpgradeModal
      open={showUpgradeModal}
      onClose={() => setShowUpgradeModal(false)}
      feature={upgradeDetails.feature || 'this feature'}
      currentTier={upgradeDetails.currentTier || 'free'}
      suggestedTier={upgradeDetails.upgradeRequired || 'premium'}
      usedLimit={upgradeDetails.used}
      totalLimit={upgradeDetails.limit}
    />
  );
}

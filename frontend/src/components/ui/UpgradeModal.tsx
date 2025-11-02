'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Zap, TrendingUp, Check, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface UpgradeModalProps {
  open: boolean;
  onClose: () => void;
  feature: string;
  currentTier: string;
  suggestedTier: 'premium' | 'pro';
  usedLimit?: number;
  totalLimit?: number;
}

const tierFeatures = {
  premium: {
    name: 'Premium',
    price: '₹799/month',
    icon: Zap,
    color: 'from-blue-600 to-cyan-600',
    features: [
      'Unlimited resume analysis',
      'Unlimited AI mentor chat',
      '20 intelligent interviews/month',
      '1 video interview/month',
      'Unlimited job recommendations',
      'Priority support'
    ]
  },
  pro: {
    name: 'Pro',
    price: '₹1,999/month',
    icon: Crown,
    color: 'from-purple-600 to-pink-600',
    features: [
      'Everything in Premium',
      '10 video interviews/month',
      'Unlimited intelligent interviews',
      '2x 1:1 mentor sessions/month',
      'LinkedIn optimization',
      '24/7 priority support'
    ]
  }
};

export default function UpgradeModal({
  open,
  onClose,
  feature,
  currentTier,
  suggestedTier,
  usedLimit,
  totalLimit
}: UpgradeModalProps) {
  const router = useRouter();
  const tierInfo = tierFeatures[suggestedTier];
  const TierIcon = tierInfo.icon;

  const handleUpgrade = () => {
    router.push('/pricing');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className={`p-4 rounded-full bg-gradient-to-r ${tierInfo.color}`}>
              <TierIcon className="w-8 h-8 text-white" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl">
            {usedLimit !== undefined ? 'Usage Limit Reached!' : `Upgrade to ${tierInfo.name}`}
          </DialogTitle>
          <DialogDescription className="text-center">
            {usedLimit !== undefined ? (
              <>
                You've used <span className="font-bold">{usedLimit}/{totalLimit}</span> {feature} this month.
                <br />
                Upgrade to {tierInfo.name} to continue using this feature.
              </>
            ) : (
              <>
                This feature is not available in your <span className="capitalize font-semibold">{currentTier}</span> plan.
                <br />
                Upgrade to unlock {feature} and more!
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-6">
          {/* Pricing */}
          <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-lg">
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {tierInfo.price}
            </div>
            <Badge className="bg-green-500 text-white">
              Save 20% on annual plan
            </Badge>
          </div>

          {/* Features */}
          <div className="space-y-2">
            <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-3">
              What's included:
            </h4>
            {tierInfo.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Maybe Later
            </Button>
            <Button
              onClick={handleUpgrade}
              className={`flex-1 bg-gradient-to-r ${tierInfo.color}`}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Upgrade Now
            </Button>
          </div>

          <p className="text-xs text-center text-gray-500 dark:text-gray-400">
            Cancel anytime • No long-term commitment
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

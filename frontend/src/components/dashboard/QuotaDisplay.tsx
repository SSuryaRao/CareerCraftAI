'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth-provider';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Zap, Crown, TrendingUp, AlertCircle, CheckCircle,
  Video, MessageSquare, FileText, Briefcase, Map, Award
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface QuotaData {
  tier: string;
  month: string;
  resetDate: string;
  quotas: {
    [key: string]: {
      limit: number | 'unlimited';
      used: number;
      remaining: number | 'unlimited';
      percentUsed: number;
    };
  };
}

const featureIcons: { [key: string]: any } = {
  resumeAnalysis: FileText,
  resumeImprovement: FileText,
  resumeBuilder: FileText,
  intelligentInterviewStandard: MessageSquare,
  intelligentInterviewVideo: Video,
  aiMentorMessages: MessageSquare,
  jobRecommendations: Briefcase,
  careerRecommendations: Map,
  roadmapGeneration: Map,
};

const featureNames: { [key: string]: string } = {
  resumeAnalysis: 'Resume Analysis',
  resumeImprovement: 'Resume Improvement',
  resumeBuilder: 'Resume Builder',
  intelligentInterviewStandard: 'Intelligent Interviews',
  intelligentInterviewVideo: 'Video Interviews',
  aiMentorMessages: 'AI Mentor Messages',
  jobRecommendations: 'Job Recommendations',
  careerRecommendations: 'Career Recommendations',
  roadmapGeneration: 'Career Roadmaps',
};

export default function QuotaDisplay() {
  const { user } = useAuth();
  const [quota, setQuota] = useState<QuotaData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchQuota();
    }
  }, [user]);

  const fetchQuota = async () => {
    try {
      const token = await user?.getIdToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/quota/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setQuota(data);
      }
    } catch (error) {
      console.error('Failed to fetch quota:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (!quota || !quota.quotas) {
    return null;
  }

  const resetDate = new Date(quota.resetDate);
  const daysUntilReset = Math.ceil((resetDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  // Filter out features that should be displayed
  const displayFeatures = Object.entries(quota.quotas).filter(([key, value]) => {
    return value.limit !== 0 && featureNames[key];
  });

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'pro': return 'from-purple-500 to-pink-500';
      case 'premium': return 'from-blue-500 to-cyan-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'pro': return Crown;
      case 'premium': return Zap;
      default: return Award;
    }
  };

  const TierIcon = getTierIcon(quota.tier);

  return (
    <Card className="p-6 bg-gradient-to-br from-white to-indigo-50/30 dark:from-gray-900 dark:to-indigo-950/20 border-2 border-indigo-100 dark:border-indigo-900/50">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg bg-gradient-to-r ${getTierColor(quota.tier)}`}>
            <TierIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold capitalize text-gray-900 dark:text-white">
              {quota.tier} Plan
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Resets in {daysUntilReset} days
            </p>
          </div>
        </div>

        {quota.tier === 'free' && (
          <Link href="/pricing">
            <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600">
              <TrendingUp className="w-4 h-4 mr-2" />
              Upgrade
            </Button>
          </Link>
        )}
      </div>

      {/* Quota Items */}
      <div className="space-y-4">
        {displayFeatures.map(([key, value]) => {
          const Icon = featureIcons[key] || FileText;
          const isUnlimited = value.limit === 'unlimited';
          const isNearLimit = !isUnlimited && value.percentUsed >= 80;
          const isAtLimit = !isUnlimited && value.remaining === 0;

          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-lg border-2 transition-all ${
                isAtLimit
                  ? 'border-red-200 dark:border-red-900 bg-red-50/50 dark:bg-red-950/20'
                  : isNearLimit
                  ? 'border-yellow-200 dark:border-yellow-900 bg-yellow-50/50 dark:bg-yellow-950/20'
                  : 'border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${
                    isAtLimit ? 'text-red-600' : isNearLimit ? 'text-yellow-600' : 'text-gray-600 dark:text-gray-400'
                  }`} />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {featureNames[key]}
                  </span>
                </div>

                {isUnlimited ? (
                  <Badge className="bg-green-500 text-white text-xs">
                    Unlimited
                  </Badge>
                ) : (
                  <span className={`text-sm font-semibold ${
                    isAtLimit ? 'text-red-600' : isNearLimit ? 'text-yellow-600' : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    {value.used} / {value.limit}
                  </span>
                )}
              </div>

              {!isUnlimited && (
                <>
                  <Progress
                    value={value.percentUsed}
                    className="h-2 mb-2"
                    indicatorClassName={
                      isAtLimit
                        ? 'bg-red-600'
                        : isNearLimit
                        ? 'bg-yellow-600'
                        : 'bg-blue-600'
                    }
                  />

                  {isAtLimit && (
                    <div className="flex items-center gap-2 text-xs text-red-600 mt-2">
                      <AlertCircle className="w-3 h-3" />
                      <span>Limit reached. Upgrade to continue.</span>
                    </div>
                  )}

                  {isNearLimit && !isAtLimit && (
                    <div className="flex items-center gap-2 text-xs text-yellow-600 mt-2">
                      <AlertCircle className="w-3 h-3" />
                      <span>{value.remaining} remaining</span>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Upgrade CTA */}
      {quota.tier === 'free' && (
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-lg border-2 border-blue-200 dark:border-blue-900">
          <div className="flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                Unlock Unlimited Potential
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Upgrade to Premium for unlimited AI conversations, resume analysis, and video interviews!
              </p>
              <Link href="/pricing">
                <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600">
                  View Plans
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {quota.tier === 'premium' && (
        <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 rounded-lg border-2 border-purple-200 dark:border-purple-900">
          <div className="flex items-start gap-3">
            <Crown className="w-5 h-5 text-purple-600 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                Go Pro for More
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Upgrade to Pro for 10 video interviews/month, 1:1 mentorship, and priority support!
              </p>
              <Link href="/pricing">
                <Button size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600">
                  Upgrade to Pro
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

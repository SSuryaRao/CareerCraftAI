'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth-provider';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import QuotaDisplay from '@/components/dashboard/QuotaDisplay';
import { Crown, Zap, Award, Calendar, CreditCard, AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface SubscriptionData {
  plan: string;
  status: string;
  validUntil: string;
  startDate: string;
  subscriptionId: string;
  isActive: boolean;
}

export default function SubscriptionPage() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [canceling, setCanceling] = useState(false);

  useEffect(() => {
    if (user) {
      fetchSubscription();
    }
  }, [user]);

  const fetchSubscription = async () => {
    try {
      const token = await user?.getIdToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payment/subscription-status`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setSubscription(data.subscription);
      }
    } catch (error) {
      console.error('Failed to fetch subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!confirm('Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your billing period.')) {
      return;
    }

    setCanceling(true);
    try {
      const token = await user?.getIdToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payment/cancel-subscription`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Subscription canceled successfully');
        fetchSubscription();
      } else {
        toast.error(data.error || 'Failed to cancel subscription');
      }
    } catch (error) {
      console.error('Cancellation error:', error);
      toast.error('Failed to cancel subscription');
    } finally {
      setCanceling(false);
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'pro': return Crown;
      case 'premium': return Zap;
      default: return Award;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'pro': return 'from-purple-500 to-pink-500';
      case 'premium': return 'from-blue-500 to-cyan-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950/20">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Please Login</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              You need to be logged in to view your subscription
            </p>
            <Link href="/login">
              <Button>Go to Login</Button>
            </Link>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  const TierIcon = subscription ? getTierIcon(subscription.plan) : Award;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950/20">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Subscription Management
        </h1>

        {loading ? (
          <Card className="p-12">
            <div className="flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Current Plan */}
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Current Plan
              </h2>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className={`p-4 rounded-xl bg-gradient-to-r ${getTierColor(subscription?.plan || 'free')}`}>
                    <TierIcon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold capitalize">{subscription?.plan || 'Free'}</h3>
                    <Badge className={subscription?.isActive ? 'bg-green-500' : 'bg-red-500'}>
                      {subscription?.status || 'active'}
                    </Badge>
                  </div>
                </div>

                {subscription?.validUntil && (
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>Valid until: {new Date(subscription.validUntil).toLocaleDateString()}</span>
                    </div>
                  </div>
                )}

                {subscription?.startDate && (
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>Started on: {new Date(subscription.startDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  {subscription?.plan !== 'free' && subscription?.plan !== 'pro' && (
                    <Link href="/pricing" className="flex-1">
                      <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600">
                        Upgrade to Pro
                      </Button>
                    </Link>
                  )}

                  {subscription?.plan === 'free' && (
                    <Link href="/pricing" className="flex-1">
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
                        Upgrade Plan
                      </Button>
                    </Link>
                  )}

                  {subscription?.plan !== 'free' && subscription?.status === 'active' && (
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={handleCancelSubscription}
                      disabled={canceling}
                    >
                      {canceling ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Canceling...
                        </>
                      ) : (
                        'Cancel Subscription'
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </Card>

            {/* Usage Quota */}
            <QuotaDisplay />
          </div>
        )}

        {/* Plan Comparison */}
        <Card className="mt-8 p-6">
          <h2 className="text-xl font-bold mb-6">Compare Plans</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Feature</th>
                  <th className="text-center py-3 px-4">Free</th>
                  <th className="text-center py-3 px-4">Premium</th>
                  <th className="text-center py-3 px-4">Pro</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3 px-4">Resume Analysis</td>
                  <td className="text-center">5/month</td>
                  <td className="text-center">Unlimited</td>
                  <td className="text-center">Unlimited</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">AI Mentor Messages</td>
                  <td className="text-center">30/month</td>
                  <td className="text-center">Unlimited</td>
                  <td className="text-center">Unlimited</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">Video Interviews</td>
                  <td className="text-center">-</td>
                  <td className="text-center">1/month</td>
                  <td className="text-center">10/month</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">1:1 Mentor Sessions</td>
                  <td className="text-center">-</td>
                  <td className="text-center">-</td>
                  <td className="text-center">2/month</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">Priority Support</td>
                  <td className="text-center">-</td>
                  <td className="text-center">✓</td>
                  <td className="text-center">24/7</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <Footer />
    </div>
  );
}

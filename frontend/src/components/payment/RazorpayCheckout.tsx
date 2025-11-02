'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth-provider';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayCheckoutProps {
  plan: 'student_monthly' | 'student_yearly' | 'premium_monthly' | 'premium_yearly' | 'pro_monthly' | 'pro_yearly';
  buttonText?: string;
  buttonVariant?: 'default' | 'outline' | 'ghost';
  className?: string;
}

export default function RazorpayCheckout({
  plan,
  buttonText = 'Subscribe Now',
  buttonVariant = 'default',
  className
}: RazorpayCheckoutProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  // Wait for Razorpay script to load
  useEffect(() => {
    const checkRazorpay = () => {
      if (window.Razorpay) {
        console.log('✅ Razorpay script loaded');
        setRazorpayLoaded(true);
      } else {
        console.log('⏳ Waiting for Razorpay script...');
        setTimeout(checkRazorpay, 100);
      }
    };

    checkRazorpay();
  }, []);

  const handleSubscribe = async () => {
    if (!user) {
      toast.error('Please login to subscribe');
      window.location.href = '/login';
      return;
    }

    // Check if Razorpay script is loaded
    if (!window.Razorpay) {
      toast.error('Payment system is loading. Please try again in a moment.');
      return;
    }

    setLoading(true);

    try {
      // Get Firebase ID token
      const token = await user.getIdToken();

      console.log('Creating subscription for plan:', plan);
      console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);

      // Create subscription on backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payment/create-subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ plan })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('HTTP error:', response.status, errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();

      if (!data.success) {
        console.error('Backend error:', data);
        throw new Error(data.message || data.error || 'Failed to create subscription');
      }

      console.log('✅ Subscription created:', data.subscriptionId);
      console.log('🔑 Using Razorpay Key:', process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID);

      // Initialize Razorpay Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        subscription_id: data.subscriptionId,
        name: 'CareerCraft AI',
        description: `${data.planDetails.name} Subscription`,
        image: '/logo.png',
        handler: async (response: any) => {
          console.log('💳 Payment successful:', response.razorpay_payment_id);

          // Verify payment on backend
          try {
            const verifyResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payment/verify-payment`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${await user.getIdToken()}`
              },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_subscription_id: response.razorpay_subscription_id,
                razorpay_signature: response.razorpay_signature
              })
            });

            const verifyData = await verifyResponse.json();

            if (verifyData.success) {
              toast.success('🎉 Subscription activated successfully!');
              setTimeout(() => {
                window.location.href = '/dashboard';
              }, 1500);
            } else {
              toast.error('Payment verification failed. Please contact support.');
            }
          } catch (error) {
            console.error('Verification error:', error);
            toast.error('Payment verification failed');
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: user.displayName || '',
          email: user.email || '',
        },
        notes: {
          userId: user.uid,
          plan: plan
        },
        theme: {
          color: '#3b82f6'
        },
        modal: {
          ondismiss: () => {
            console.log('❌ Payment modal dismissed');
            setLoading(false);
            toast.error('Payment cancelled');
          },
          escape: true,
          backdropclose: false
        }
      };

      console.log('🚀 Opening Razorpay modal...');
      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', function (response: any) {
        console.error('❌ Payment failed:', response.error);
        setLoading(false);

        // Show helpful error message
        if (response.error.description?.includes('International cards')) {
          toast.error(
            'Please use an Indian debit/credit card. International cards are not enabled in test mode.',
            { duration: 6000 }
          );
          console.log('💡 Try these test cards:');
          console.log('   Card: 4111 1111 1111 1111');
          console.log('   CVV: 123, Expiry: 12/30');
        } else {
          toast.error(`Payment failed: ${response.error.description}`);
        }
      });

      razorpay.open();
    } catch (error: any) {
      console.error('Subscription error:', error);
      toast.error(error.message || 'Failed to initiate payment');
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleSubscribe}
      disabled={loading || !razorpayLoaded}
      variant={buttonVariant}
      className={className}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Processing...
        </>
      ) : !razorpayLoaded ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Loading...
        </>
      ) : (
        buttonText
      )}
    </Button>
  );
}

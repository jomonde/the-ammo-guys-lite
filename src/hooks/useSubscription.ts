import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { createCheckoutSession } from '@/lib/stripe/client';
import { SubscriptionFormData } from '@/types/subscription';

export const useSubscription = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubscribe = async (formData: SubscriptionFormData) => {
    if (!formData.subscriptionTier?.stripePriceId) {
      setError('No subscription tier selected');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Create checkout session
      const { sessionId } = await createCheckoutSession({
        priceId: formData.subscriptionTier.stripePriceId,
        customerEmail: user?.email,
        userId: user?.id,
        metadata: {
          ammoType: formData.ammoType?.name || '',
          quantity: formData.quantity.toString(),
          frequency: formData.frequency,
        },
        successUrl: '/subscribe/success?session_id={CHECKOUT_SESSION_ID}',
        cancelUrl: '/subscribe',
      });

      // Redirect to Stripe Checkout
      const stripe = (await import('@stripe/stripe-js')).loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''
      );
      
      const { error: stripeError } = await (await stripe).redirectToCheckout({
        sessionId,
      });

      if (stripeError) {
        throw stripeError;
      }
    } catch (err) {
      console.error('Error creating subscription:', err);
      setError(
        err instanceof Error ? err.message : 'An error occurred during checkout'
      );
      setIsLoading(false);
      return null;
    }
  };

  const handleManageSubscription = async () => {
    if (!user?.stripe_customer_id) {
      setError('No subscription found');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/stripe/create-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId: user.stripe_customer_id,
          returnUrl: '/dashboard',
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create portal session');
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (err) {
      console.error('Error managing subscription:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to manage subscription'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleSubscribe,
    handleManageSubscription,
    isLoading,
    error,
  };
};

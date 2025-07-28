import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { createCheckoutSession } from '@/lib/stripe/client';
import { SubscriptionFormData } from '@/types/subscription';

export const useSubscription = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubscribe = async (formData: SubscriptionFormData) => {
    if (!formData.subscriptionTier?.id) {
      setError('No subscription tier selected');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Create checkout session
      const { sessionId } = await createCheckoutSession({
        // Using the tier ID as the price ID for now - this should be updated to use actual Stripe price IDs
        priceId: formData.subscriptionTier.id, 
        customerEmail: user?.email || '',
        userId: user?.id || '',
        metadata: {
          ammoType: formData.ammoType?.name || '',
          quantity: formData.quantity.toString(),
          frequency: formData.frequency,
        },
        successUrl: '/subscribe/success?session_id={CHECKOUT_SESSION_ID}',
        cancelUrl: '/subscribe',
      });

      // Redirect to Stripe Checkout
      const stripeModule = await import('@stripe/stripe-js');
      const stripe = await stripeModule.loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''
      );
      
      if (!stripe) {
        throw new Error('Failed to load Stripe');
      }
      
      const { error: stripeError } = await stripe.redirectToCheckout({
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
    // Get the user's profile to access stripe_customer_id
    const profile = user?.user_metadata || {};
    const stripeCustomerId = profile.stripe_customer_id;
    
    if (!stripeCustomerId) {
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
          customerId: stripeCustomerId,
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

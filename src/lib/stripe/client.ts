import { loadStripe, Stripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (!stripeKey) {
      throw new Error('Stripe publishable key is not set. Please add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY to your environment variables.');
    }
    stripePromise = loadStripe(stripeKey);
  }
  return stripePromise;
};

// Types for Stripe integration
export interface CreateCheckoutSessionParams {
  priceId: string;
  customerEmail?: string;
  userId?: string;
  metadata?: Record<string, string>;
  successUrl: string;
  cancelUrl: string;
}

export const createCheckoutSession = async (params: CreateCheckoutSessionParams) => {
  try {
    const response = await fetch('/api/stripe/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create checkout session');
    }

    const session = await response.json();
    return session;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};

export const createCustomerPortalSession = async (customerId: string, returnUrl: string) => {
  try {
    const response = await fetch('/api/stripe/create-portal-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ customerId, returnUrl }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create customer portal session');
    }

    const { url } = await response.json();
    return url;
  } catch (error) {
    console.error('Error creating customer portal session:', error);
    throw error;
  }
};

// Helper function to format price for display
export const formatPrice = (amount: number, currency: string = 'usd') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount / 100); // Stripe amounts are in cents
};

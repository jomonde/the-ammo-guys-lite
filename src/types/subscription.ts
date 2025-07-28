export type AmmoType = {
  id: string;
  name: string;
  caliber: string;
  grain: number;
  type: 'FMJ' | 'JHP' | 'HP' | 'SP' | 'AP' | 'Tracer' | 'Match';
  pricePerRound: number;
  image: string;
  description: string;
  features: string[];
  inStock: boolean;
};

export type SubscriptionTier = {
  id: string;
  name: string;
  description: string;
  pricePerMonth: number;
  features: string[];
  shippingIncluded: boolean;
  discount: number;
  recommended: boolean;
  roundLimit: number;
  shippingFrequency: 'monthly' | 'bimonthly' | 'quarterly';
};

export type SubscriptionFrequency = 'monthly' | 'bimonthly' | 'quarterly';

export type CartItem = {
  ammoType: AmmoType;
  quantity: number;
};

export type SubscriptionFormData = {
  ammoType: AmmoType | null;
  quantity: number;
  subscriptionTier: SubscriptionTier | null;
  frequency: SubscriptionFrequency;
  paymentMethod: 'card' | 'ach' | null;
  cardDetails: {
    number: string;
    expiry: string;
    cvc: string;
    name: string;
  };
  billingAddress: {
    line1: string;
    line2: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
};

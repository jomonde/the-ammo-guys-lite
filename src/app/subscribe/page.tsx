'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import SubscriptionSteps from '@/components/subscribe/SubscriptionSteps';
import AmmoSelection from '@/components/subscribe/AmmoSelection';
import PlanSelection from '@/components/subscribe/PlanSelection';
import PaymentDetails from '@/components/subscribe/PaymentDetails';
import Confirmation from '@/components/subscribe/Confirmation';
import { AmmoType, SubscriptionTier } from '@/types/subscription';

type FormData = {
  ammoType: AmmoType | null;
  quantity: number;
  subscriptionTier: SubscriptionTier | null;
  frequency: 'monthly' | 'bimonthly' | 'quarterly';
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

export default function SubscribePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    ammoType: null,
    quantity: 100,
    subscriptionTier: null,
    frequency: 'monthly',
    paymentMethod: null,
    cardDetails: {
      number: '',
      expiry: '',
      cvc: '',
      name: '',
    },
    billingAddress: {
      line1: '',
      line2: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'US',
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const steps = [
    { id: '1', name: 'Ammo Selection' },
    { id: '2', name: 'Plan' },
    { id: '3', name: 'Payment' },
    { id: '4', name: 'Confirm' },
  ];

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    setError(null);
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!user) {
      router.push('/login?redirect=/subscribe');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // TODO: Implement Stripe subscription creation
      // This will be implemented in the next steps
      console.log('Submitting subscription:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Move to success step
      handleNext();
    } catch (err) {
      console.error('Subscription error:', err);
      setError('Failed to process subscription. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (newData: Partial<FormData>) => {
    setFormData(prev => ({
      ...prev,
      ...newData,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Get Started with The Ammo Guys
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Join our community of responsible gun owners and never worry about ammo shortages again.
          </p>
        </div>

        <SubscriptionSteps currentStep={currentStep} steps={steps} />

        <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <AmmoSelection
                formData={formData}
                updateFormData={updateFormData}
                onNext={handleNext}
              />
            )}

            {currentStep === 2 && (
              <PlanSelection
                formData={formData}
                updateFormData={updateFormData}
                onNext={handleNext}
                onBack={handleBack}
              />
            )}

            {currentStep === 3 && (
              <PaymentDetails
                formData={formData}
                updateFormData={updateFormData}
                onSubmit={handleSubmit}
                onBack={handleBack}
                isLoading={isLoading}
              />
            )}

            {currentStep === 4 && (
              <Confirmation
                formData={formData}
                onComplete={() => router.push('/dashboard')}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

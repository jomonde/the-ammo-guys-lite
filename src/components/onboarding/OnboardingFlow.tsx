'use client';

import { useOnboarding } from '@/contexts/OnboardingContext';
import WelcomeStep from './steps/WelcomeStep';
import AccountInfoStep from './steps/AccountInfoStep';
import ChooseCalibersStep from './steps/ChooseCalibersStep';
import SelectPurposeStep from './steps/SelectPurposeStep';
import SetupAutoStackStep from './steps/SetupAutoStackStep';
import ShippingTriggerStep from './steps/ShippingTriggerStep';
import FinalReviewStep from './steps/FinalReviewStep';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const OnboardingFlow = () => {
  const { currentStep, isLoading, error } = useOnboarding();
  const router = useRouter();

  // Redirect to dashboard if user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push('/dashboard');
      }
    };
    checkAuth();
  }, [router]);

  // Render the current step
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <WelcomeStep />;
      case 2:
        return <AccountInfoStep />;
      case 3:
        return <ChooseCalibersStep />;
      case 4:
        return <SelectPurposeStep />;
      case 5:
        return <SetupAutoStackStep />;
      case 6:
        return <ShippingTriggerStep />;
      case 7:
        return <FinalReviewStep />;
      default:
        return <WelcomeStep />;
    }
  };

  // Render progress steps
  const renderProgressSteps = () => {
    const steps = [
      'Welcome',
      'Account',
      'Calibers',
      'Purpose',
      'AutoStack',
      'Shipping',
      'Review',
    ];

    return (
      <div className="flex justify-between mb-8">
        {steps.map((step, index) => (
          <div key={step} className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep > index + 1
                  ? 'bg-green-500 text-white'
                  : currentStep === index + 1
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {currentStep > index + 1 ? (
                <span>✓</span>
              ) : (
                <span>{index + 1}</span>
              )}
            </div>
            <span
              className={`text-xs mt-2 ${
                currentStep >= index + 1 ? 'font-medium' : 'text-gray-400'
              }`}
            >
              {step}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <h1 className="text-2xl font-bold text-center mb-8">
        Welcome to The Ammo Guys
      </h1>
      
      {renderProgressSteps()}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="min-h-[400px] flex flex-col">
        {renderStep()}
      </div>
      
      {isLoading && (
        <div className="mt-4 text-center text-gray-600">
          Saving your preferences...
        </div>
      )}
    </div>
  );
};

export default OnboardingFlow;

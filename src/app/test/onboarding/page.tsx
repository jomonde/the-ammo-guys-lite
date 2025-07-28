'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function OnboardingTestPage() {
  const router = useRouter();
  const {
    currentStep,
    goToNextStep,
    goToPreviousStep,
    updateOnboardingData,
    submitOnboarding,
    onboardingData,
    isLoading,
    error,
  } = useOnboarding();

  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentStep === 7) {
      try {
        await submitOnboarding();
      } catch (err) {
        setLocalError(err instanceof Error ? err.message : 'An unknown error occurred');
      }
    } else {
      goToNextStep();
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <h2 className="text-2xl font-bold">Welcome to The Ammo Guys</h2>;
      
      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Account Information</h2>
            <div>
              <label>Full Name</label>
              <input
                value={onboardingData.fullName}
                onChange={(e) => updateOnboardingData({ fullName: e.target.value })}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label>Email</label>
              <input
                type="email"
                value={onboardingData.email}
                onChange={(e) => updateOnboardingData({ email: e.target.value })}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        );
      
      case 3:
        return (
          <div>
            <h2 className="text-2xl font-bold">Choose Calibers</h2>
            <div className="space-y-2 mt-4">
              {onboardingData.calibers.map((caliber) => (
                <div key={caliber.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={caliber.selected}
                    onChange={(e) => {
                      const updated = onboardingData.calibers.map(c => 
                        c.id === caliber.id ? { ...c, selected: e.target.checked } : c
                      );
                      updateOnboardingData({ calibers: updated });
                    }}
                  />
                  <span>{caliber.name}</span>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 7:
        return (
          <div>
            <h2 className="text-2xl font-bold">Review & Submit</h2>
            <pre className="mt-4 p-4 bg-gray-100 rounded">
              {JSON.stringify(onboardingData, null, 2)}
            </pre>
          </div>
        );
      
      default:
        return <h2>Step {currentStep}</h2>;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Onboarding Test - Step {currentStep} of 7</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {renderStep()}
            
            {(error || localError) && (
              <div className="p-4 bg-red-100 text-red-700 rounded">
                {error || localError}
              </div>
            )}
            
            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={goToPreviousStep}
                disabled={currentStep === 1}
              >
                Back
              </Button>
              
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Processing...' : currentStep === 7 ? 'Complete Onboarding' : 'Next'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

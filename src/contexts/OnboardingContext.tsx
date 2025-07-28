'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { saveOnboardingData, completeOnboarding, getOnboardingStatus } from '@/lib/onboarding';

type Caliber = {
  id: string;
  name: string;
  selected: boolean;
  allocation?: number;
};

type Purpose = {
  id: 'self_defense' | 'range_training' | 'hunting' | 'preparedness' | 'all';
  label: string;
  selected: boolean;
};

type Frequency = 'weekly' | 'biweekly' | 'monthly';

type ShippingTrigger = {
  type: 'round_count' | 'value_threshold' | 'time_interval' | 'manual';
  value?: number;
  unit?: 'rounds' | 'dollars' | 'months';
};

// Base data type without metadata
type OnboardingFormData = {
  // Step 2: Account Info
  fullName: string;
  email: string;
  password: string;
  
  // Step 3: Calibers
  calibers: Caliber[];
  
  // Step 4: Purpose
  purposes: Purpose[];
  
  // Step 5: AutoStack
  monthlyBudget: number;
  frequency: Frequency;
  
  // Step 6: Shipping Triggers
  shippingTrigger: ShippingTrigger;
};

// Extended type with metadata for the UI
export type OnboardingData = OnboardingFormData & {
  // Metadata
  currentStep: number;
  lastSavedAt?: string;
};

type OnboardingContextType = {
  currentStep: number;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  updateOnboardingData: (data: Partial<OnboardingData>) => void;
  submitOnboarding: () => Promise<void>;
  onboardingData: OnboardingData;
  isLoading: boolean;
  error: string | null;
};

const defaultOnboardingData: OnboardingData = {
  // Metadata
  currentStep: 1,
  lastSavedAt: new Date().toISOString(),
  
  // Step 2: Account Info
  fullName: '',
  email: '',
  password: '',
  
  // Step 3: Calibers
  calibers: [
    { id: '9mm', name: '9mm', selected: false, allocation: 0 },
    { id: '223-rem', name: '.223 Rem', selected: false, allocation: 0 },
    { id: '556-nato', name: '5.56 NATO', selected: false, allocation: 0 },
    { id: '762x39', name: '7.62x39', selected: false, allocation: 0 },
    { id: '308-win', name: '.308 Win', selected: false, allocation: 0 },
    { id: '12-gauge', name: '12 Gauge', selected: false, allocation: 0 },
  ],
  
  // Step 4: Purposes
  purposes: [
    { id: 'self_defense', label: 'Self Defense', selected: false },
    { id: 'range_training', label: 'Range Training', selected: false },
    { id: 'hunting', label: 'Hunting', selected: false },
    { id: 'preparedness', label: 'Emergency Preparedness', selected: false },
    { id: 'all', label: 'All of the Above', selected: false },
  ],
  
  // Step 5: AutoStack
  monthlyBudget: 100,
  frequency: 'monthly',
  
  // Step 6: Shipping Triggers
  shippingTrigger: {
    type: 'manual',
  },
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

// Key for localStorage
const ONBOARDING_STORAGE_KEY = 'ammo_guys_onboarding_data';

// Helper to save to localStorage
const saveToLocalStorage = (data: OnboardingData) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify({
      ...data,
      currentStep: data.currentStep || 1,
      lastSavedAt: new Date().toISOString(),
    }));
  }
};

// Helper to load from localStorage
const loadFromLocalStorage = (): Partial<OnboardingData> => {
  if (typeof window === 'undefined') return {};
  
  try {
    const saved = localStorage.getItem(ONBOARDING_STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch (error) {
    console.error('Failed to load onboarding data from localStorage:', error);
    return {};
  }
};

export const OnboardingProvider = ({ children }: { children: ReactNode }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>(() => ({
    ...defaultOnboardingData,
    ...loadFromLocalStorage(),
  }));
  const [isLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient();
  const router = useRouter();
  
  // Load saved progress on mount
  useEffect(() => {
    const loadProgress = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error: statusError } = await getOnboardingStatus(user.id);
        if (!statusError && data?.completed) {
          router.push('/dashboard');
          return;
        }
      }
      
      const savedData = loadFromLocalStorage();
      if (savedData.currentStep) {
        setCurrentStep(savedData.currentStep);
      }
    };
    
    loadProgress();
  }, [supabase, router]);

  const updateOnboardingData = (data: Partial<OnboardingFormData> & { currentStep?: number }) => {
    const updatedData: OnboardingData = {
      ...onboardingData,
      ...data,
      // Ensure metadata is preserved
      currentStep: data.currentStep !== undefined ? data.currentStep : onboardingData.currentStep,
      lastSavedAt: new Date().toISOString(),
    };
    
    setOnboardingData(updatedData);
    saveToLocalStorage(updatedData);
    
    // Auto-save progress to server if user is authenticated
    const autoSave = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        try {
          // Don't include metadata in the saved data
          const { currentStep, lastSavedAt, ...dataToSave } = updatedData;
          await saveOnboardingData(user.id, dataToSave);
        } catch (error) {
          console.error('Auto-save failed:', error);
          // Non-blocking error - we still have localStorage
        }
      }
    };
    
    autoSave();
  };

  const goToNextStep = () => {
    if (currentStep < 7) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const submitOnboarding = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      // 1. Create user account with Supabase Auth if not already logged in
      const { data: { user } } = await supabase.auth.getUser();
      let userId = user?.id;
      
      if (!userId) {
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: onboardingData.email,
          password: onboardingData.password,
          options: {
            data: {
              full_name: onboardingData.fullName,
            },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });

        if (authError) throw authError;
        userId = authData.user?.id;
        
        // Update profile with full name
        if (userId) {
          await supabase
            .from('profiles')
            .upsert({
              id: userId,
              email: onboardingData.email,
              first_name: onboardingData.fullName.split(' ')[0],
              last_name: onboardingData.fullName.split(' ').slice(1).join(' '),
            });
        }
      }

      if (!userId) {
        throw new Error('Failed to create or retrieve user account');
      }

      // 2. Extract only the form data without metadata for submission
      const { currentStep, lastSavedAt, ...formData } = onboardingData;
      
      // 3. Complete the onboarding process
      const { error: onboardingError } = await completeOnboarding(userId, formData);
      
      if (onboardingError) throw onboardingError;

      // 3. Clear local storage
      if (typeof window !== 'undefined') {
        localStorage.removeItem(ONBOARDING_STORAGE_KEY);
      }

      // 4. Redirect to dashboard
      router.push('/dashboard');

    } catch (err) {
      console.error('Error during onboarding:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      
      // Log the error to your error tracking service
      if (process.env.NODE_ENV === 'production') {
        // Example: logErrorToService('onboarding_error', errorMessage, { step: currentStep });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <OnboardingContext.Provider
      value={{
        currentStep,
        goToNextStep,
        goToPreviousStep,
        updateOnboardingData,
        submitOnboarding,
        onboardingData,
        isLoading: isLoading || isSubmitting,
        error,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};

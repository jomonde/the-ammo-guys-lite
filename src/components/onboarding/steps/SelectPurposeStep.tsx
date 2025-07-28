'use client';

import { useState } from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { FiArrowLeft, FiArrowRight, FiInfo } from 'react-icons/fi';

type PurposeId = 'self_defense' | 'range_training' | 'hunting' | 'preparedness' | 'all';

interface PurposeOption {
  id: PurposeId;
  title: string;
  description: string;
  icon: string;
}

const PURPOSE_OPTIONS: PurposeOption[] = [
  {
    id: 'self_defense',
    title: 'Self Defense',
    description: 'Ammo for personal and home protection',
    icon: '🛡️',
  },
  {
    id: 'range_training',
    title: 'Range Training',
    description: 'Practice and improve shooting skills',
    icon: '🎯',
  },
  {
    id: 'hunting',
    title: 'Hunting',
    description: 'Ammo for hunting game',
    icon: '🦌',
  },
  {
    id: 'preparedness',
    title: 'General Preparedness',
    description: 'For emergency stockpiling',
    icon: '🛠️',
  },
  {
    id: 'all',
    title: 'All of the Above',
    description: 'A mix for all purposes',
    icon: '🎯',
  },
];

const SelectPurposeStep = () => {
  const { onboardingData, updateOnboardingData, goToNextStep, goToPreviousStep } = useOnboarding();
  
  // Initialize selected purposes from onboarding data
  const initialPurposes = new Set<PurposeId>();
  (onboardingData.purposes || []).forEach(p => {
    if (p.selected && PURPOSE_OPTIONS.some(opt => opt.id === p.id)) {
      initialPurposes.add(p.id as PurposeId);
    }
  });
  
  const [selectedPurposes, setSelectedPurposes] = useState<Set<PurposeId>>(initialPurposes);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  const togglePurpose = (purposeId: PurposeId) => {
    setSelectedPurposes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(purposeId)) {
        newSet.delete(purposeId);
      } else {
        newSet.add(purposeId);
      }
      // If 'all' is selected, clear other selections
      if (purposeId === 'all') {
        return new Set(['all'] as PurposeId[]);
      } else {
        newSet.delete('all');
      }
      return newSet;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // If 'all' is selected, select all purposes
    const finalPurposes = selectedPurposes.has('all')
      ? PURPOSE_OPTIONS.map(opt => opt.id)
      : Array.from(selectedPurposes);

    // Update the onboarding data with selected purposes
    updateOnboardingData({
      purposes: PURPOSE_OPTIONS.map(option => ({
        id: option.id,
        label: option.title,
        selected: finalPurposes.includes(option.id),
      })),
    });
    
    goToNextStep();
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">What&apos;s Your Primary Use for This Ammo?</h2>
        <p className="text-gray-600">
          This helps us suggest optimal stockpile targets and recommendations.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PURPOSE_OPTIONS.map((purpose) => (
            <div key={purpose.id} className="relative">
              <button
                type="button"
                onClick={() => togglePurpose(purpose.id)}
                className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                  selectedPurposes.has(purpose.id)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="flex items-start">
                  <span className="text-2xl mr-3">{purpose.icon}</span>
                  <div>
                    <h3 className="font-medium text-gray-900">{purpose.title}</h3>
                    <p className="text-sm text-gray-500">{purpose.description}</p>
                  </div>
                </div>
              </button>
              
              <button
                type="button"
                onMouseEnter={() => setShowTooltip(purpose.id)}
                onMouseLeave={() => setShowTooltip(null)}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowTooltip(showTooltip === purpose.id ? null : purpose.id);
                }}
              >
                <FiInfo />
              </button>
              
              {showTooltip === purpose.id && (
                <div className="absolute right-0 z-10 mt-2 w-64 rounded-md bg-white p-3 shadow-lg ring-1 ring-black ring-opacity-5">
                  <p className="text-sm text-gray-700">
                    {purpose.id === 'self_defense' && 'Recommended: Hollow points for better stopping power'}
                    {purpose.id === 'range_training' && 'FMJ rounds are cost-effective for practice'}
                    {purpose.id === 'hunting' && 'Consider expanding rounds for ethical hunting'}
                    {purpose.id === 'preparedness' && 'A mix of FMJ and defensive rounds recommended'}
                    {purpose.id === 'all' && 'We&apos;ll help you build a versatile stockpile'}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-800 mb-2 flex items-center">
            <FiInfo className="mr-2" /> How This Helps You
          </h4>
          <p className="text-sm text-blue-700">
            Your selection helps us recommend the right ammo types and quantities for your needs. 
            You can always update these preferences later in your account settings.
          </p>
        </div>

        <div className="pt-4 border-t">
          <div className="flex justify-between">
            <button
              type="button"
              onClick={goToPreviousStep}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FiArrowLeft className="mr-2" />
              Back
            </button>
            
            <button
              type="submit"
              disabled={selectedPurposes.size === 0}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
              <FiArrowRight className="ml-2" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SelectPurposeStep;

'use client';

import { useOnboarding } from '@/contexts/OnboardingContext';
import { FiCheck, FiPlus, FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { useState } from 'react';

// Caliber options with common calibers and their display names
const CALIBER_OPTIONS = [
  { id: '9mm', name: '9mm Luger', category: 'Pistol' },
  { id: '45acp', name: '.45 ACP', category: 'Pistol' },
  { id: '40sw', name: '.40 S&W', category: 'Pistol' },
  { id: '380acp', name: '.380 ACP', category: 'Pistol' },
  { id: '10mm', name: '10mm Auto', category: 'Pistol' },
  { id: '556', name: '5.56 NATO', category: 'Rifle' },
  { id: '223', name: '.223 Remington', category: 'Rifle' },
  { id: '762x39', name: '7.62x39mm', category: 'Rifle' },
  { id: '308', name: '.308 Winchester', category: 'Rifle' },
  { id: '3006', name: '.30-06 Springfield', category: 'Rifle' },
  { id: '12ga', name: '12 Gauge', category: 'Shotgun' },
  { id: '20ga', name: '20 Gauge', category: 'Shotgun' },
  { id: '22lr', name: '.22 LR', category: 'Rimfire' },
  { id: '17hmr', name: '.17 HMR', category: 'Rimfire' },
];

// Group calibers by category for better organization
const groupByCategory = (calibers: typeof CALIBER_OPTIONS) => {
  return calibers.reduce<Record<string, typeof CALIBER_OPTIONS>>((acc, caliber) => {
    if (!acc[caliber.category]) {
      acc[caliber.category] = [];
    }
    acc[caliber.category].push(caliber);
    return acc;
  }, {});
};

const ChooseCalibersStep = () => {
  const { onboardingData, updateOnboardingData, goToNextStep, goToPreviousStep } = useOnboarding();
  const [customCaliber, setCustomCaliber] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  
  // Group calibers by category
  const caliberCategories = groupByCategory(CALIBER_OPTIONS);
  
  // Get currently selected caliber IDs
  const selectedCaliberIds = new Set(
    onboardingData.calibers.filter(c => c.selected).map(c => c.id)
  );

  const toggleCaliber = (caliberId: string) => {
    const existingCaliber = onboardingData.calibers.find(c => c.id === caliberId);
    
    if (existingCaliber) {
      // Toggle selection
      updateOnboardingData({
        calibers: onboardingData.calibers.map(caliber => 
          caliber.id === caliberId 
            ? { ...caliber, selected: !caliber.selected }
            : caliber
        ),
      });
    } else {
      // Add new caliber from custom input
      updateOnboardingData({
        calibers: [
          ...onboardingData.calibers,
          { id: caliberId, name: caliberId, selected: true, allocation: 0 },
        ],
      });
      setCustomCaliber('');
      setShowCustomInput(false);
    }
  };

  const handleAddCustomCaliber = (e: React.FormEvent) => {
    e.preventDefault();
    if (customCaliber.trim() && !onboardingData.calibers.some(c => c.id === customCaliber.toLowerCase())) {
      toggleCaliber(customCaliber.trim().toLowerCase());
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ensure at least one caliber is selected
    if (selectedCaliberIds.size === 0) {
      return;
    }
    goToNextStep();
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">What Calibers Do You Use?</h2>
        <p className="text-gray-600">
          Select all the calibers you&apos;d like to include in your stockpile.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-6">
          {Object.entries(caliberCategories).map(([category, calibers]) => (
            <div key={category} className="space-y-3">
              <h3 className="text-lg font-medium text-gray-900 border-b pb-1">{category}</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {calibers.map((caliber) => {
                  const isSelected = selectedCaliberIds.has(caliber.id);
                  return (
                    <button
                      key={caliber.id}
                      type="button"
                      onClick={() => toggleCaliber(caliber.id)}
                      className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <span className="font-medium">{caliber.name}</span>
                      {isSelected && <FiCheck className="text-blue-600" />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Custom caliber input */}
          <div className="pt-2">
            {showCustomInput ? (
              <form onSubmit={handleAddCustomCaliber} className="flex space-x-2">
                <input
                  type="text"
                  value={customCaliber}
                  onChange={(e) => setCustomCaliber(e.target.value)}
                  placeholder="Enter custom caliber (e.g., 6.5 Creedmoor)"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={!customCaliber.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setShowCustomInput(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setShowCustomInput(true)}
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <FiPlus className="mr-2" />
                Add a caliber not listed
              </button>
            )}
          </div>
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
              disabled={selectedCaliberIds.size === 0}
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

export default ChooseCalibersStep;

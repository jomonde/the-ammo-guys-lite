'use client';

import { useState, useEffect } from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { FiArrowLeft, FiArrowRight, FiDollarSign, FiPercent } from 'react-icons/fi';

type Frequency = 'weekly' | 'biweekly' | 'monthly';

const frequencyOptions = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'biweekly', label: 'Every 2 Weeks' },
  { value: 'monthly', label: 'Monthly' },
];

const SetupAutoStackStep = () => {
  const { onboardingData, updateOnboardingData, goToNextStep, goToPreviousStep } = useOnboarding();
  
  // Get selected calibers
  const selectedCalibers = onboardingData.calibers.filter(caliber => caliber.selected);
  
  // Initialize state
  const [monthlyBudget, setMonthlyBudget] = useState<number>(onboardingData.monthlyBudget || 100);
  const [frequency, setFrequency] = useState<Frequency>(onboardingData.frequency as Frequency || 'monthly');
  const [allocations, setAllocations] = useState<Record<string, number>>({});
  const [equalAllocation, setEqualAllocation] = useState<boolean>(true);
  
  // Calculate allocation per caliber when budget or selection changes
  useEffect(() => {
    if (selectedCalibers.length === 0) return;
    
    if (equalAllocation) {
      const equalShare = 100 / selectedCalibers.length;
      const newAllocations: Record<string, number> = {};
      
      selectedCalibers.forEach(caliber => {
        newAllocations[caliber.id] = parseFloat(equalShare.toFixed(1));
      });
      
      setAllocations(newAllocations);
    }
  }, [selectedCalibers.length, equalAllocation]);
  
  // Handle allocation change
  const handleAllocationChange = (caliberId: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    
    // Ensure the value is between 0 and 100
    if (numValue < 0 || numValue > 100) return;
    
    setAllocations(prev => ({
      ...prev,
      [caliberId]: numValue
    }));
    
    // If user manually adjusts allocations, disable equal allocation
    if (equalAllocation) {
      setEqualAllocation(false);
    }
  };
  
  // Toggle equal allocation
  const toggleEqualAllocation = () => {
    setEqualAllocation(!equalAllocation);
  };
  
  // Calculate total allocation
  const totalAllocation = Object.values(allocations).reduce((sum, val) => sum + val, 0);
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update onboarding data with AutoStack configuration
    updateOnboardingData({
      monthlyBudget,
      frequency,
      calibers: onboardingData.calibers.map(caliber => ({
        ...caliber,
        allocation: allocations[caliber.id] || 0,
      })),
    });
    
    goToNextStep();
  };
  
  // Calculate budget per caliber
  const calculateCaliberBudget = (allocation: number) => {
    return (monthlyBudget * (allocation / 100)).toFixed(2);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Set Up Your AutoStack</h2>
        <p className="text-gray-600">
          Build your stockpile over time by setting your budget and preferences.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-6">
          {/* Monthly Budget */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Your Monthly Budget
            </h3>
            
            <div className="relative mt-2 rounded-md shadow-sm max-w-xs">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <FiDollarSign className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                min="10"
                step="5"
                value={monthlyBudget}
                onChange={(e) => setMonthlyBudget(parseFloat(e.target.value) || 0)}
                className="block w-full rounded-md border-0 py-3 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                placeholder="0.00"
              />
            </div>
            
            <p className="mt-2 text-sm text-gray-500">
              How much would you like to spend on ammo each month?
            </p>
          </div>
          
          {/* Frequency */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              How often would you like to receive ammo?
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {frequencyOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFrequency(option.value as Frequency)}
                  className={`p-4 rounded-lg border-2 text-center transition-all ${
                    frequency === option.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <span className="block font-medium">{option.label}</span>
                  <span className="text-sm text-gray-500">
                    ~${(monthlyBudget / (option.value === 'monthly' ? 1 : option.value === 'biweekly' ? 2 : 4)).toFixed(2)} per order
                  </span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Caliber Allocation */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Allocate Your Budget
              </h3>
              <button
                type="button"
                onClick={toggleEqualAllocation}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                {equalAllocation ? 'Customize Allocation' : 'Use Equal Allocation'}
              </button>
            </div>
            
            <p className="text-sm text-gray-500 mb-4">
              Distribute your monthly budget across your selected calibers.
            </p>
            
            <div className="space-y-4">
              {selectedCalibers.map((caliber) => (
                <div key={caliber.id} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{caliber.name}</span>
                    <span className="text-gray-600">
                      ${calculateCaliberBudget(allocations[caliber.id] || 0)} per month
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={allocations[caliber.id] || 0}
                      onChange={(e) => handleAllocationChange(caliber.id, e.target.value)}
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="relative w-20">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={allocations[caliber.id] || 0}
                        onChange={(e) => handleAllocationChange(caliber.id, e.target.value)}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 text-right shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                      />
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <FiPercent className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="flex justify-between pt-2 border-t border-gray-200 text-sm font-medium">
                <span>Total Allocation</span>
                <span className={totalAllocation !== 100 ? 'text-red-600' : 'text-green-600'}>
                  {totalAllocation}%
                </span>
              </div>
              
              {totalAllocation !== 100 && (
                <div className="text-sm text-red-600 mt-2">
                  Total allocation must equal 100%
                </div>
              )}
            </div>
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
              disabled={totalAllocation !== 100 || monthlyBudget < 10}
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

export default SetupAutoStackStep;

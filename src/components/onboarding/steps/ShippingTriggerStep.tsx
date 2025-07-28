'use client';

import { useState, useEffect } from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { FiArrowLeft, FiArrowRight, FiTruck, FiPackage, FiCalendar, FiCheck } from 'react-icons/fi';

type TriggerType = 'round_count' | 'value_threshold' | 'time_interval' | 'manual';

const triggerOptions = [
  {
    id: 'round_count',
    title: 'Round Count',
    description: 'Ship when I reach a specific number of rounds',
    icon: <FiPackage className="w-6 h-6" />,
    input: {
      type: 'number',
      min: 100,
      step: 50,
      unit: 'rounds',
      placeholder: '500',
    },
  },
  {
    id: 'value_threshold',
    title: 'Value Threshold',
    description: 'Ship when my stockpile reaches a certain value',
    icon: <FiDollarSign className="w-6 h-6" />,
    input: {
      type: 'number',
      min: 50,
      step: 25,
      unit: 'dollars',
      placeholder: '250',
    },
  },
  {
    id: 'time_interval',
    title: 'Time Interval',
    description: 'Ship on a regular schedule',
    icon: <FiCalendar className="w-6 h-6" />,
    input: {
      type: 'select',
      options: [
        { value: '30', label: 'Every month' },
        { value: '60', label: 'Every 2 months' },
        { value: '90', label: 'Every 3 months' },
        { value: '180', label: 'Every 6 months' },
      ],
      unit: 'days',
    },
  },
  {
    id: 'manual',
    title: 'Manual Shipment',
    description: 'I\'ll request shipments manually',
    icon: <FiTruck className="w-6 h-6" />,
    input: null,
  },
];

const ShippingTriggerStep = () => {
  const { onboardingData, updateOnboardingData, goToNextStep, goToPreviousStep } = useOnboarding();
  
  // Initialize state with existing shipping trigger or defaults
  const [selectedTrigger, setSelectedTrigger] = useState<TriggerType>(
    onboardingData.shippingTrigger?.type || 'round_count'
  );
  
  const [inputValue, setInputValue] = useState<string>(
    onboardingData.shippingTrigger?.value?.toString() || '500'
  );
  
  const selectedOption = triggerOptions.find(option => option.id === selectedTrigger);
  const [isValid, setIsValid] = useState<boolean>(true);

  // Validate input when it changes
  useEffect(() => {
    if (selectedOption?.input?.type === 'number' && inputValue) {
      const numValue = parseFloat(inputValue);
      const minValue = selectedOption.input.min || 0;
      setIsValid(numValue >= minValue);
    } else if (selectedOption?.input?.type === 'select') {
      setIsValid(true);
    } else if (selectedOption?.id === 'manual') {
      setIsValid(true);
    }
  }, [inputValue, selectedTrigger, selectedOption]);

  // Handle trigger type change
  const handleTriggerChange = (triggerId: TriggerType) => {
    setSelectedTrigger(triggerId);
    const option = triggerOptions.find(opt => opt.id === triggerId);
    
    // Reset input value to default for the selected trigger type
    if (option?.input?.type === 'number') {
      setInputValue(option.input.placeholder);
    } else if (option?.input?.type === 'select') {
      setInputValue(option.input.options[0].value);
    } else {
      setInputValue('');
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValid) return;
    
    // Update onboarding data with shipping trigger
    updateOnboardingData({
      shippingTrigger: {
        type: selectedTrigger,
        value: selectedOption?.input ? parseFloat(inputValue) : undefined,
        unit: selectedOption?.input?.unit,
      },
    });
    
    goToNextStep();
  };

  // Format the trigger summary text
  const getTriggerSummary = () => {
    const option = triggerOptions.find(opt => opt.id === selectedTrigger);
    
    if (selectedTrigger === 'manual') {
      return 'I\'ll request shipments manually';
    }
    
    if (option?.input?.type === 'select') {
      const selectedOption = option.input.options.find(opt => opt.value === inputValue);
      return `Ship ${selectedOption?.label.toLowerCase()}`;
    }
    
    if (option?.input?.type === 'number') {
      return `Ship when I have ${inputValue} ${option.input.unit} in my stockpile`;
    }
    
    return 'Select a shipping trigger';
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">When Should We Ship Your Ammo?</h2>
        <p className="text-gray-600">
          Set your preferred shipping trigger to optimize your stockpile.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-6">
          {/* Trigger Type Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {triggerOptions.map((option) => (
              <div key={option.id} className="relative">
                <button
                  type="button"
                  onClick={() => handleTriggerChange(option.id as TriggerType)}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                    selectedTrigger === option.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-2 rounded-full text-blue-600 mr-3">
                      {option.icon}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{option.title}</h3>
                      <p className="text-sm text-gray-500">{option.description}</p>
                    </div>
                    {selectedTrigger === option.id && (
                      <div className="absolute top-2 right-2 text-blue-600">
                        <FiCheck className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                </button>
              </div>
            ))}
          </div>

          {/* Trigger Configuration */}
          {selectedOption?.input && (
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Configure {selectedOption.title}
              </h3>
              
              {selectedOption.input.type === 'number' && (
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-500">Ship when I have</span>
                    <input
                      type="number"
                      min={selectedOption.input.min}
                      step={selectedOption.input.step}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      className={`w-24 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        !isValid ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder={selectedOption.input.placeholder}
                    />
                    <span className="text-gray-500">{selectedOption.input.unit}</span>
                  </div>
                  {!isValid && (
                    <p className="mt-2 text-sm text-red-600">
                      Minimum {selectedOption.input.min} {selectedOption.input.unit} required
                    </p>
                  )}
                </div>
              )}
              
              {selectedOption.input.type === 'select' && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Shipping Frequency
                  </label>
                  <select
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                  >
                    {selectedOption.input.options.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              
              {selectedOption.id === 'manual' && (
                <div className="bg-blue-50 p-4 rounded-md">
                  <p className="text-sm text-blue-700">
                    You'll need to manually request shipments when you're ready to receive your ammo.
                    We'll notify you when it's time to restock based on your usage patterns.
                  </p>
                </div>
              )}
            </div>
          )}
          
          {/* Summary */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Your Shipping Preference</h3>
            <p className="text-gray-900 font-medium">
              {getTriggerSummary()}
            </p>
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
              disabled={!isValid}
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

export default ShippingTriggerStep;

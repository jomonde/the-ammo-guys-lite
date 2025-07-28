'use client';

import { useOnboarding } from '@/contexts/OnboardingContext';
import { FiArrowLeft, FiArrowRight, FiInfo } from 'react-icons/fi';

const PURPOSE_OPTIONS = [
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
    description: 'Stocking up for emergency situations',
    icon: '🏕️',
  },
  {
    id: 'all',
    title: 'All of the Above',
    description: 'A mix of different purposes',
    icon: '🔀',
  },
];

const SelectPurposeStep = () => {
  const { onboardingData, updateOnboardingData, goToNextStep, goToPreviousStep } = useOnboarding();
  const [selectedPurposes, setSelectedPurposes] = useState<Set<string>>(
    new Set(onboardingData.purposes.filter(p => p.selected).map(p => p.id))
  );
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  const togglePurpose = (purposeId: string) => {
    const newSelectedPurposes = new Set(selectedPurposes);
    
    if (purposeId === 'all') {
      // If "All of the Above" is selected, clear other selections
      newSelectedPurposes.clear();
      newSelectedPurposes.add('all');
    } else {
      // Toggle the selected purpose
      if (newSelectedPurposes.has(purposeId)) {
        newSelectedPurposes.delete(purposeId);
      } else {
        newSelectedPurposes.add(purposeId);
        // If selecting any specific purpose, remove "all" if it was selected
        newSelectedPurposes.delete('all');
      }
    }
    
    setSelectedPurposes(newSelectedPurposes);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update the onboarding data with selected purposes
    updateOnboardingData({
      purposes: PURPOSE_OPTIONS.map(option => ({
        id: option.id as any,
        label: option.title,
        selected: selectedPurposes.has(option.id),
      })),
    });
    
    goToNextStep();
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">What's Your Primary Use for This Ammo?</h2>
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
                    {purpose.id === 'all' && 'We\'ll help you build a versatile stockpile'}
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

'use client';

import { useOnboarding } from '@/contexts/OnboardingContext';
import { FiCheckCircle, FiEdit2, FiArrowLeft } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

const FinalReviewStep = () => {
  const { onboardingData, goToPreviousStep, submitOnboarding, isLoading, error } = useOnboarding();
  const router = useRouter();
  
  // Calculate summary data
  const selectedCalibers = onboardingData.calibers.filter(c => c.selected);
  const selectedPurposes = onboardingData.purposes.filter(p => p.selected);
  
  // Format frequency display
  const formatFrequency = (freq: string) => {
    switch (freq) {
      case 'weekly': return 'Weekly';
      case 'biweekly': return 'Every 2 Weeks';
      case 'monthly': return 'Monthly';
      default: return freq;
    }
  };
  
  // Format shipping trigger display
  const formatShippingTrigger = () => {
    const { type, value, unit } = onboardingData.shippingTrigger;
    
    switch (type) {
      case 'round_count':
        return `When I have ${value} ${unit} in my stockpile`;
      case 'value_threshold':
        return `When my stockpile value reaches $${value}`;
      case 'time_interval':
        const months = value ? Math.round(Number(value) / 30) : 0;
        return `Every ${months} month${months !== 1 ? 's' : ''}`;
      case 'manual':
        return 'I\'ll request shipments manually';
      default:
        return 'Not specified';
    }
  };
  
  // Handle edit action
  const handleEdit = (step: number) => {
    // In a real app, you would navigate back to the specific step
    // For this example, we'll just go to the previous step
    goToPreviousStep();
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitOnboarding();
    // The OnboardingContext will handle the redirect to the dashboard
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
          <FiCheckCircle className="h-6 w-6 text-green-600" />
        </div>
        <h2 className="mt-3 text-2xl font-bold text-gray-900">You're All Set!</h2>
        <p className="mt-2 text-gray-600">
          Review your selections below before we create your account.
        </p>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Your Ammo Stockpile Setup
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Here's a summary of your preferences.
          </p>
        </div>
        
        <div className="border-t border-gray-200">
          {/* Account Information */}
          <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-50">
            <div className="flex justify-between">
              <dt className="text-sm font-medium text-gray-500">Account</dt>
              <button
                type="button"
                onClick={() => handleEdit(2)}
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                <FiEdit2 className="inline-block mr-1" /> Edit
              </button>
            </div>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <div>{onboardingData.fullName}</div>
              <div className="text-gray-500">{onboardingData.email}</div>
            </dd>
          </div>
          
          {/* Selected Calibers */}
          <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-50">
            <div className="flex justify-between">
              <dt className="text-sm font-medium text-gray-500">Calibers</dt>
              <button
                type="button"
                onClick={() => handleEdit(3)}
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                <FiEdit2 className="inline-block mr-1" /> Edit
              </button>
            </div>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <div className="flex flex-wrap gap-2">
                {selectedCalibers.map(caliber => (
                  <span 
                    key={caliber.id} 
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {caliber.name}
                  </span>
                ))}
              </div>
            </dd>
          </div>
          
          {/* Purposes */}
          <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-50">
            <div className="flex justify-between">
              <dt className="text-sm font-medium text-gray-500">Intended Use</dt>
              <button
                type="button"
                onClick={() => handleEdit(4)}
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                <FiEdit2 className="inline-block mr-1" /> Edit
              </button>
            </div>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <div className="flex flex-wrap gap-2">
                {selectedPurposes.map(purpose => (
                  <span 
                    key={purpose.id} 
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                  >
                    {purpose.label}
                  </span>
                ))}
              </div>
            </dd>
          </div>
          
          {/* AutoStack Configuration */}
          <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-50">
            <div className="flex justify-between">
              <dt className="text-sm font-medium text-gray-500">AutoStack</dt>
              <button
                type="button"
                onClick={() => handleEdit(5)}
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                <FiEdit2 className="inline-block mr-1" /> Edit
              </button>
            </div>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 space-y-2">
              <div>
                <span className="font-medium">Budget:</span> ${onboardingData.monthlyBudget} per month
              </div>
              <div>
                <span className="font-medium">Frequency:</span> {formatFrequency(onboardingData.frequency)}
              </div>
              <div className="mt-2">
                <div className="font-medium mb-1">Allocation:</div>
                <div className="space-y-1">
                  {selectedCalibers
                    .filter(caliber => caliber.allocation && caliber.allocation > 0)
                    .sort((a, b) => (b.allocation || 0) - (a.allocation || 0))
                    .map(caliber => (
                      <div key={caliber.id} className="flex items-center">
                        <div className="w-20 text-sm text-gray-600">{caliber.name}</div>
                        <div className="flex-1">
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-600 rounded-full" 
                              style={{ width: `${caliber.allocation}%` }}
                            />
                          </div>
                        </div>
                        <div className="w-12 text-right text-sm font-medium text-gray-700">
                          {caliber.allocation}%
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </dd>
          </div>
          
          {/* Shipping Trigger */}
          <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-50">
            <div className="flex justify-between">
              <dt className="text-sm font-medium text-gray-500">Shipping</dt>
              <button
                type="button"
                onClick={() => handleEdit(6)}
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                <FiEdit2 className="inline-block mr-1" /> Edit
              </button>
            </div>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {formatShippingTrigger()}
            </dd>
          </div>
        </div>
      </div>
      
      {/* Terms and Conditions */}
      <div className="mt-6 bg-blue-50 p-4 rounded-lg">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h.01a1 1 0 100-2H10V9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Important Information</h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                By creating your account, you agree to our{' '}
                <a href="/terms" className="font-medium underline hover:text-blue-600">Terms of Service</a> and{' '}
                <a href="/privacy" className="font-medium underline hover:text-blue-600">Privacy Policy</a>. 
                You can update your preferences at any time in your account settings.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="mt-4 bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Form Actions */}
      <div className="mt-8 border-t border-gray-200 pt-6">
        <div className="flex justify-between">
          <button
            type="button"
            onClick={goToPreviousStep}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FiArrowLeft className="mr-2 h-4 w-4" />
            Back
          </button>
          
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Your Account...
              </>
            ) : (
              'Complete Setup & Create Account'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinalReviewStep;

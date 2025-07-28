'use client';

import { useOnboarding } from '@/contexts/OnboardingContext';
import { FiShield, FiPackage, FiClock, FiCheckCircle } from 'react-icons/fi';

const WelcomeStep = () => {
  const { goToNextStep } = useOnboarding();

  return (
    <div className="flex flex-col items-center">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-4">Build Your Stockpile the Smart Way</h2>
        <p className="text-gray-600 mb-8">
          Stay ready. Stack gradually. Automate your ammo reserve.
        </p>
      </div>

      <div className="w-full max-w-md space-y-6 mb-10">
        <div className="flex items-start">
          <div className="bg-blue-100 p-2 rounded-full mr-4">
            <FiShield className="text-blue-600 text-xl" />
          </div>
          <div>
            <h3 className="font-semibold">Stay Prepared</h3>
            <p className="text-sm text-gray-600">
              Maintain a consistent ammo supply without the hassle of tracking inventory.
            </p>
          </div>
        </div>

        <div className="flex items-start">
          <div className="bg-green-100 p-2 rounded-full mr-4">
            <FiPackage className="text-green-600 text-xl" />
          </div>
          <div>
            <h3 className="font-semibold">Automated Stocking</h3>
            <p className="text-sm text-gray-600">
              Set your preferences and let us handle the rest. Your stockpile grows automatically.
            </p>
          </div>
        </div>

        <div className="flex items-start">
          <div className="bg-purple-100 p-2 rounded-full mr-4">
            <FiClock className="text-purple-600 text-xl" />
          </div>
          <div>
            <h3 className="font-semibold">Save Time & Money</h3>
            <p className="text-sm text-gray-600">
              Get the best prices with bulk ordering and never overpay at the range again.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 w-full max-w-md">
        <button
          onClick={goToNextStep}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Get Started
        </button>
        
        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{' '}
          <a href="/login" className="text-blue-600 hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
};

export default WelcomeStep;

'use client';

import { ArrowRight } from 'lucide-react';

const steps = [
  {
    name: 'Set',
    description: 'Choose your calibers and preferred shipping frequency.',
    icon: '/icons/set-icon.svg', // Replace with actual icon
  },
  {
    name: 'Save',
    description: 'Build your stockpile with consistent, budget-friendly contributions.',
    icon: '/icons/save-icon.svg', // Replace with actual icon
  },
  {
    name: 'Ship',
    description: 'Request a shipment whenever you need it, no questions asked.',
    icon: '/icons/ship-icon.svg', // Replace with actual icon
  },
];

export default function HowItWorks() {
  return (
    <section className="py-16 bg-white sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Building your ammo stockpile has never been easier
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step.name} className="pt-6
                relative group hover:bg-gray-50 rounded-lg p-6 transition-all duration-200
                border border-gray-100 hover:border-indigo-200
              ">
                <div className="absolute -top-4 left-6 bg-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {step.name}
                  </h3>
                  <p className="mt-2 text-base text-gray-600">
                    {step.description}
                  </p>
                </div>
                <div className="mt-6">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center group-hover:bg-indigo-200 transition-colors duration-200">
                    <ArrowRight className="h-5 w-5 text-indigo-600" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

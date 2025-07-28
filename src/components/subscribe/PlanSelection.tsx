import { useState, useEffect } from 'react';
import { SubscriptionFormData, SubscriptionTier, SubscriptionFrequency } from '@/types/subscription';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/20/solid';

// Mock data - in a real app, this would come from an API
const SUBSCRIPTION_TIERS: SubscriptionTier[] = [
  {
    id: 'basic',
    name: 'Basic',
    description: 'Perfect for casual shooters',
    pricePerMonth: 29.99,
    features: [
      'Up to 100 rounds/month',
      'Free shipping',
      '5% member discount',
      'Email support',
    ],
    shippingIncluded: true,
    discount: 5,
    recommended: false,
    roundLimit: 100,
    shippingFrequency: 'monthly',
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'Great for regular range sessions',
    pricePerMonth: 49.99,
    features: [
      'Up to 250 rounds/month',
      'Free shipping',
      '10% member discount',
      'Priority support',
      'Early access to new stock',
    ],
    shippingIncluded: true,
    discount: 10,
    recommended: true,
    roundLimit: 250,
    shippingFrequency: 'monthly',
  },
  {
    id: 'elite',
    name: 'Elite',
    description: 'For the dedicated marksman',
    pricePerMonth: 99.99,
    features: [
      'Up to 600 rounds/month',
      'Free shipping',
      '15% member discount',
      '24/7 VIP support',
      'Early access to new stock',
      'Exclusive member events',
    ],
    shippingIncluded: true,
    discount: 15,
    recommended: false,
    roundLimit: 600,
    shippingFrequency: 'bimonthly',
  },
];

const FREQUENCIES: { value: SubscriptionFrequency; label: string }[] = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'bimonthly', label: 'Every 2 Months' },
  { value: 'quarterly', label: 'Quarterly' },
];

type PlanSelectionProps = {
  formData: SubscriptionFormData;
  updateFormData: (data: Partial<SubscriptionFormData>) => void;
  onNext: () => void;
  onBack: () => void;
};

export default function PlanSelection({ formData, updateFormData, onNext, onBack }: PlanSelectionProps) {
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier | null>(formData.subscriptionTier);
  const [frequency, setFrequency] = useState<SubscriptionFrequency>('monthly');
  const [isValid, setIsValid] = useState<boolean>(false);

  // Update form data when selection changes
  useEffect(() => {
    updateFormData({
      subscriptionTier: selectedTier,
      frequency
    });
    
    setIsValid(!!selectedTier);
  }, [selectedTier, frequency, updateFormData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      onNext();
    }
  };

  const calculatePrice = (tier: SubscriptionTier) => {
    // In a real app, this would be more sophisticated
    return tier.pricePerMonth;
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Choose Your Plan</h2>
        <p className="mt-1 text-sm text-gray-500">
          Select a subscription tier that matches your shooting needs.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Subscription Tier</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {SUBSCRIPTION_TIERS.map((tier) => (
                <div
                  key={tier.id}
                  onClick={() => setSelectedTier(tier)}
                  className={`relative rounded-lg border p-4 shadow-sm flex flex-col cursor-pointer transition-all ${
                    selectedTier?.id === tier.id
                      ? 'ring-2 ring-indigo-500 border-transparent transform scale-[1.02]'
                      : 'border-gray-300 hover:border-gray-400'
                  } ${tier.recommended ? 'border-indigo-500' : ''}`}
                >
                  {tier.recommended && (
                    <div className="absolute top-0 right-0 -mt-3 -mr-3">
                      <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        Recommended
                      </span>
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-gray-900">{tier.name}</h4>
                    <p className="mt-1 text-sm text-gray-500">{tier.description}</p>
                    
                    <div className="mt-4">
                      <p className="text-3xl font-extrabold text-gray-900">
                        ${calculatePrice(tier).toFixed(2)}
                        <span className="text-base font-medium text-gray-500">/month</span>
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        {tier.roundLimit} rounds included
                      </p>
                    </div>
                    
                    <ul className="mt-4 space-y-2">
                      {tier.features.map((feature) => (
                        <li key={feature} className="flex items-start">
                          <svg
                            className="h-5 w-5 text-green-500 flex-shrink-0"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="ml-2 text-sm text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mt-6">
                    <div
                      className={`block w-full py-2 px-4 border border-transparent rounded-md text-center text-sm font-medium ${
                        selectedTier?.id === tier.id
                          ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {selectedTier?.id === tier.id ? 'Selected' : 'Select Plan'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {selectedTier && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Shipping Frequency
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {FREQUENCIES.map((freq) => (
                  <div
                    key={freq.value}
                    onClick={() => setFrequency(freq.value)}
                    className={`relative rounded-lg border p-4 cursor-pointer transition-colors ${
                      frequency === freq.value
                        ? 'ring-2 ring-indigo-500 border-transparent bg-indigo-50'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-5 w-5 rounded-full border-2 flex items-center justify-center mr-3">
                        {frequency === freq.value && (
                          <div className="h-2.5 w-2.5 rounded-full bg-indigo-600" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{freq.label}</p>
                        <p className="text-xs text-gray-500">
                          {freq.value === 'monthly' && 'Shipment every month'}
                          {freq.value === 'bimonthly' && 'Shipment every 2 months'}
                          {freq.value === 'quarterly' && 'Shipment every 3 months'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 bg-gray-50 p-6 rounded-lg">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h4>
                <dl className="space-y-4">
                  <div className="flex items-center justify-between">
                    <dt className="text-sm text-gray-600">Subscription</dt>
                    <dd className="text-sm font-medium text-gray-900">
                      {selectedTier.name} Plan
                    </dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-sm text-gray-600">Shipping</dt>
                    <dd className="text-sm font-medium text-gray-900">
                      {selectedTier.shippingIncluded ? 'Free' : 'Calculated at checkout'}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-sm text-gray-600">Frequency</dt>
                    <dd className="text-sm font-medium text-gray-900">
                      {frequency === 'monthly' && 'Monthly'}
                      {frequency === 'bimonthly' && 'Every 2 Months'}
                      {frequency === 'quarterly' && 'Quarterly'}
                    </dd>
                  </div>
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <div className="flex items-center justify-between">
                      <dt className="text-base font-medium text-gray-900">Total</dt>
                      <dd className="text-2xl font-bold text-indigo-600">
                        ${calculatePrice(selectedTier).toFixed(2)}
                        <span className="text-sm font-normal text-gray-500">/month</span>
                      </dd>
                    </div>
                  </div>
                </dl>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <ArrowLeftIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500" aria-hidden="true" />
              Back
            </button>
            <button
              type="submit"
              disabled={!isValid}
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                isValid
                  ? 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              Continue to Payment
              <ArrowRightIcon className="ml-2 -mr-1 h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

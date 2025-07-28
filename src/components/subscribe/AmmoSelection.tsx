import { useState, useEffect } from 'react';
import { AmmoType, SubscriptionFormData } from '@/types/subscription';
import { ArrowRightIcon } from '@heroicons/react/20/solid';

// Mock data - in a real app, this would come from an API
const AMMO_TYPES: AmmoType[] = [
  {
    id: '9mm-115-fmj',
    name: '9mm Luger',
    caliber: '9mm',
    grain: 115,
    type: 'FMJ',
    pricePerRound: 0.35,
    image: 'https://via.placeholder.com/150',
    description: 'Full Metal Jacket - Great for target practice',
    features: [
      'Brass casing',
      'Non-corrosive',
      'Boxer primed',
      'Reliable ignition'
    ],
    inStock: true
  },
  {
    id: '223-55-fmj',
    name: '.223 Remington',
    caliber: '.223',
    grain: 55,
    type: 'FMJ',
    pricePerRound: 0.45,
    image: 'https://via.placeholder.com/150',
    description: 'Ideal for AR-15 platforms',
    features: [
      'Brass casing',
      'Reliable cycling',
      'Consistent velocity',
      'Great for training'
    ],
    inStock: true
  },
  // Add more ammo types as needed
];

type AmmoSelectionProps = {
  formData: SubscriptionFormData;
  updateFormData: (data: Partial<SubscriptionFormData>) => void;
  onNext: () => void;
};

export default function AmmoSelection({ formData, updateFormData, onNext }: AmmoSelectionProps) {
  const [selectedAmmo, setSelectedAmmo] = useState<AmmoType | null>(formData.ammoType);
  const [quantity, setQuantity] = useState<number>(formData.quantity || 100);
  const [isValid, setIsValid] = useState<boolean>(false);

  // Update form data when selection changes
  useEffect(() => {
    if (selectedAmmo) {
      updateFormData({
        ammoType: selectedAmmo,
        quantity
      });
    }
    
    setIsValid(!!selectedAmmo && quantity > 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAmmo, quantity]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      onNext();
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Choose Your Ammo</h2>
        <p className="mt-1 text-sm text-gray-500">
          Select your preferred caliber and quantity for your subscription.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Ammunition Type</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {AMMO_TYPES.map((ammo) => (
                <div
                  key={ammo.id}
                  onClick={() => setSelectedAmmo(ammo)}
                  className={`relative rounded-lg border bg-white p-4 shadow-sm flex items-start cursor-pointer transition-colors ${
                    selectedAmmo?.id === ammo.id
                      ? 'ring-2 ring-indigo-500 border-transparent'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="flex-shrink-0 h-12 w-12 rounded-md bg-gray-200 flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-500">{ammo.caliber}</span>
                  </div>
                  <div className="ml-4 flex-1">
                    <h4 className="text-sm font-medium text-gray-900">
                      {ammo.name} {ammo.grain}gr {ammo.type}
                    </h4>
                    <p className="mt-1 text-sm text-gray-500">
                      ${ammo.pricePerRound.toFixed(2)}/round
                    </p>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    {selectedAmmo?.id === ammo.id ? (
                      <div className="h-5 w-5 rounded-full bg-indigo-600 flex items-center justify-center">
                        <svg
                          className="h-3.5 w-3.5 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {selectedAmmo && (
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Quantity</h3>
                  <p className="text-sm text-gray-500">
                    How many rounds per shipment? (Min: 50, Max: 1000)
                  </p>
                </div>
                <div className="mt-1 sm:mt-0 sm:flex-shrink-0">
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={() => setQuantity((prev) => Math.max(50, prev - 50))}
                      className="px-3 py-1 border border-gray-300 rounded-l-md bg-gray-50 text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="50"
                      max="1000"
                      step="50"
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="w-20 text-center border-t border-b border-gray-300 py-1 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => setQuantity((prev) => Math.min(1000, prev + 50))}
                      className="px-3 py-1 border border-gray-300 rounded-r-md bg-gray-50 text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {selectedAmmo && (
                <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-900">Order Summary</h4>
                  <dl className="mt-2 space-y-2">
                    <div className="flex justify-between text-sm">
                      <dt className="text-gray-500">Ammo Type</dt>
                      <dd className="font-medium text-gray-900">
                        {selectedAmmo.name} {selectedAmmo.grain}gr {selectedAmmo.type}
                      </dd>
                    </div>
                    <div className="flex justify-between text-sm">
                      <dt className="text-gray-500">Quantity</dt>
                      <dd className="font-medium text-gray-900">{quantity} rounds</dd>
                    </div>
                    <div className="flex justify-between text-sm">
                      <dt className="text-gray-500">Price per round</dt>
                      <dd className="text-gray-700">${selectedAmmo.pricePerRound.toFixed(2)}</dd>
                    </div>
                    <div className="border-t border-gray-200 pt-2 mt-2">
                      <div className="flex justify-between text-base font-medium">
                        <dt>Estimated Total</dt>
                        <dd className="text-indigo-600">
                          ${(selectedAmmo.pricePerRound * quantity).toFixed(2)}
                        </dd>
                      </div>
                    </div>
                  </dl>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={!isValid}
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                isValid
                  ? 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              Continue to Plan Selection
              <ArrowRightIcon className="ml-2 -mr-1 h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

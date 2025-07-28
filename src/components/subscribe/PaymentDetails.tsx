import { useState, useEffect } from 'react';
import { SubscriptionFormData } from '@/types/subscription';
import { ArrowLeftIcon, ArrowRightIcon, LockClosedIcon } from '@heroicons/react/20/solid';

type PaymentDetailsProps = {
  formData: SubscriptionFormData;
  updateFormData: (data: Partial<SubscriptionFormData>) => void;
  onSubmit: () => void;
  onBack: () => void;
  isLoading: boolean;
};

export default function PaymentDetails({ formData, updateFormData, onSubmit, onBack, isLoading }: PaymentDetailsProps) {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'ach'>(formData.paymentMethod || 'card');
  const [cardDetails, setCardDetails] = useState(formData.cardDetails || {
    number: '',
    expiry: '',
    cvc: '',
    name: '',
  });
  const [billingAddress, setBillingAddress] = useState(formData.billingAddress || {
    line1: '',
    line2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'US',
  });
  const [isFormValid, setIsFormValid] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Validate form
  useEffect(() => {
    const newErrors: Record<string, string> = {};
    
    if (paymentMethod === 'card') {
      if (!cardDetails.number || !/^\d{16}$/.test(cardDetails.number.replace(/\s/g, ''))) {
        newErrors.cardNumber = 'Please enter a valid 16-digit card number';
      }
      if (!cardDetails.expiry || !/^\d{2}\/\d{2}$/.test(cardDetails.expiry)) {
        newErrors.expiry = 'Please enter a valid expiry date (MM/YY)';
      }
      if (!cardDetails.cvc || !/^\d{3,4}$/.test(cardDetails.cvc)) {
        newErrors.cvc = 'Please enter a valid CVC';
      }
      if (!cardDetails.name.trim()) {
        newErrors.cardName = 'Cardholder name is required';
      }
    }
    
    // Billing address validation
    if (!billingAddress.line1.trim()) {
      newErrors.line1 = 'Address line 1 is required';
    }
    if (!billingAddress.city.trim()) {
      newErrors.city = 'City is required';
    }
    if (!billingAddress.state.trim()) {
      newErrors.state = 'State is required';
    }
    if (!billingAddress.postalCode.trim() || !/^\d{5}(-\d{4})?$/.test(billingAddress.postalCode)) {
      newErrors.postalCode = 'Please enter a valid ZIP code';
    }
    
    setErrors(newErrors);
    setIsFormValid(Object.keys(newErrors).length === 0);
  }, [paymentMethod, cardDetails, billingAddress]);

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    value = value.replace(/(\d{4})(?=\d)/g, '$1 '); // Add space after every 4 digits
    setCardDetails({ ...cardDetails, number: value });
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    // Only allow digits and forward slash
    value = value.replace(/[^\d/]/g, '');
    // Auto-insert slash after 2 digits
    if (value.length === 3 && !value.includes('/')) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }
    // Limit to MM/YY format
    if (value.length > 5) return;
    setCardDetails({ ...cardDetails, expiry: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      updateFormData({
        paymentMethod,
        cardDetails,
        billingAddress,
      });
      onSubmit();
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Payment Information</h2>
        <p className="mt-1 text-sm text-gray-500">
          Enter your payment details to complete your subscription.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Payment Method Toggle */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Payment Method</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div
                onClick={() => setPaymentMethod('card')}
                className={`relative rounded-lg border p-4 cursor-pointer transition-colors ${
                  paymentMethod === 'card'
                    ? 'ring-2 ring-indigo-500 border-transparent bg-indigo-50'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full border-2 flex items-center justify-center mr-3">
                    {paymentMethod === 'card' && (
                      <div className="h-2.5 w-2.5 rounded-full bg-indigo-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Credit/Debit Card</p>
                    <div className="flex mt-1 space-x-2">
                      {['visa', 'mastercard', 'amex', 'discover'].map((type) => (
                        <div key={type} className="h-6 w-10 bg-gray-200 rounded flex items-center justify-center">
                          <span className="text-xs text-gray-500">{type}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div
                onClick={() => setPaymentMethod('ach')}
                className={`relative rounded-lg border p-4 cursor-pointer transition-colors ${
                  paymentMethod === 'ach'
                    ? 'ring-2 ring-indigo-500 border-transparent bg-indigo-50'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full border-2 flex items-center justify-center mr-3">
                    {paymentMethod === 'ach' && (
                      <div className="h-2.5 w-2.5 rounded-full bg-indigo-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Bank Account (ACH)</p>
                    <p className="mt-1 text-xs text-gray-500">Direct transfer from your bank</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {paymentMethod === 'card' ? (
            <>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Card Details</h3>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label htmlFor="card-number" className="block text-sm font-medium text-gray-700">
                      Card number
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <input
                        type="text"
                        id="card-number"
                        value={cardDetails.number}
                        onChange={handleCardNumberChange}
                        placeholder="0000 0000 0000 0000"
                        maxLength={19} // 16 digits + 3 spaces
                        className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                          errors.cardNumber ? 'border-red-300' : ''
                        }`}
                      />
                    </div>
                    {errors.cardNumber && (
                      <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="expiry" className="block text-sm font-medium text-gray-700">
                      Expiry date
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="expiry"
                        value={cardDetails.expiry}
                        onChange={handleExpiryChange}
                        placeholder="MM/YY"
                        className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                          errors.expiry ? 'border-red-300' : ''
                        }`}
                      />
                    </div>
                    {errors.expiry && (
                      <p className="mt-1 text-sm text-red-600">{errors.expiry}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="cvc" className="block text-sm font-medium text-gray-700">
                      CVC
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="cvc"
                        value={cardDetails.cvc}
                        onChange={(e) => setCardDetails({ ...cardDetails, cvc: e.target.value })}
                        placeholder="123"
                        maxLength={4}
                        className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                          errors.cvc ? 'border-red-300' : ''
                        }`}
                      />
                    </div>
                    {errors.cvc && (
                      <p className="mt-1 text-sm text-red-600">{errors.cvc}</p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="card-name" className="block text-sm font-medium text-gray-700">
                      Name on card
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="card-name"
                        value={cardDetails.name}
                        onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                        placeholder="John Smith"
                        className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                          errors.cardName ? 'border-red-300' : ''
                        }`}
                      />
                    </div>
                    {errors.cardName && (
                      <p className="mt-1 text-sm text-red-600">{errors.cardName}</p>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-yellow-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    ACH payment processing is not yet available. Please use a credit or debit card to complete your subscription.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Billing Address</h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="address-line1" className="block text-sm font-medium text-gray-700">
                  Address line 1
                </label>
                <input
                  type="text"
                  id="address-line1"
                  value={billingAddress.line1}
                  onChange={(e) => setBillingAddress({ ...billingAddress, line1: e.target.value })}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                    errors.line1 ? 'border-red-300' : ''
                  }`}
                />
                {errors.line1 && (
                  <p className="mt-1 text-sm text-red-600">{errors.line1}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="address-line2" className="block text-sm font-medium text-gray-700">
                  Address line 2 (optional)
                </label>
                <input
                  type="text"
                  id="address-line2"
                  value={billingAddress.line2}
                  onChange={(e) => setBillingAddress({ ...billingAddress, line2: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  value={billingAddress.city}
                  onChange={(e) => setBillingAddress({ ...billingAddress, city: e.target.value })}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                    errors.city ? 'border-red-300' : ''
                  }`}
                />
                {errors.city && (
                  <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                )}
              </div>

              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                  State / Province
                </label>
                <select
                  id="state"
                  value={billingAddress.state}
                  onChange={(e) => setBillingAddress({ ...billingAddress, state: e.target.value })}
                  className={`mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm ${
                    errors.state ? 'border-red-300' : ''
                  }`}
                >
                  <option value="">Select a state</option>
                  {[
                    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
                    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
                    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
                    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
                    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
                  ].map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
                {errors.state && (
                  <p className="mt-1 text-sm text-red-600">{errors.state}</p>
                )}
              </div>

              <div>
                <label htmlFor="postal-code" className="block text-sm font-medium text-gray-700">
                  ZIP / Postal code
                </label>
                <input
                  type="text"
                  id="postal-code"
                  value={billingAddress.postalCode}
                  onChange={(e) => setBillingAddress({ ...billingAddress, postalCode: e.target.value })}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                    errors.postalCode ? 'border-red-300' : ''
                  }`}
                />
                {errors.postalCode && (
                  <p className="mt-1 text-sm text-red-600">{errors.postalCode}</p>
                )}
              </div>

              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                  Country
                </label>
                <select
                  id="country"
                  value={billingAddress.country}
                  onChange={(e) => setBillingAddress({ ...billingAddress, country: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  disabled
                >
                  <option value="US">United States</option>
                </select>
              </div>
            </div>
          </div>

          <div className="rounded-md bg-blue-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-blue-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h2a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Secure Payment</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>
                    Your payment information is encrypted and secure. We don't store your credit card details.
                  </p>
                </div>
              </div>
            </div>
          </div>

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
              disabled={!isFormValid || isLoading}
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                isFormValid && !isLoading
                  ? 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                'Processing...'
              ) : (
                <>
                  Complete Subscription
                  <LockClosedIcon className="ml-2 -mr-1 h-5 w-5" aria-hidden="true" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

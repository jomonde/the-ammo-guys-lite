import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { SubscriptionFormData } from '@/types/subscription';
import { ArrowRightIcon } from '@heroicons/react/20/solid';

type ConfirmationProps = {
  formData: SubscriptionFormData;
  onComplete: () => void;
};

export default function Confirmation({ formData, onComplete }: ConfirmationProps) {
  // Calculate order total
  const calculateOrderTotal = () => {
    if (!formData.ammoType || !formData.subscriptionTier) return 0;
    return formData.ammoType.pricePerRound * formData.quantity;
  };

  // Format date for next shipment
  const getNextShipmentDate = () => {
    const today = new Date();
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    return nextMonth.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="text-center">
      <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
        <CheckCircleIcon className="h-10 w-10 text-green-600" aria-hidden="true" />
      </div>
      <h2 className="mt-3 text-2xl font-bold text-gray-900 sm:text-3xl">
        Subscription Confirmed!
      </h2>
      <p className="mt-2 text-lg text-gray-600">
        You&apos;re all set! Your subscription to The Ammo Guys is now active.
      </p>

      <div className="mt-10 bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Order Summary</h3>
          
          <dl className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <dt className="text-sm font-medium text-gray-500">Subscription</dt>
              <dd className="text-sm font-medium text-gray-900">
                {formData.subscriptionTier?.name} Plan
              </dd>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <dt className="text-sm font-medium text-gray-500">Ammunition</dt>
              <dd className="text-sm text-gray-900">
                {formData.quantity} rounds of {formData.ammoType?.name} {formData.ammoType?.grain}gr {formData.ammoType?.type}
              </dd>
            </div>
            
            <div className="flex items-center justify-between">
              <dt className="text-sm font-medium text-gray-500">Price per round</dt>
              <dd className="text-sm text-gray-900">
                ${formData.ammoType?.pricePerRound.toFixed(2)}
              </dd>
            </div>
            
            <div className="flex items-center justify-between">
              <dt className="text-sm font-medium text-gray-500">Shipping</dt>
              <dd className="text-sm text-gray-900">
                {formData.subscriptionTier?.shippingIncluded ? 'Free' : 'Calculated at checkout'}
              </dd>
            </div>
            
            <div className="flex items-center justify-between">
              <dt className="text-sm font-medium text-gray-500">Frequency</dt>
              <dd className="text-sm text-gray-900 capitalize">
                {formData.frequency}
              </dd>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <dt className="text-base font-medium text-gray-900">Total</dt>
              <dd className="text-base font-medium text-indigo-600">
                ${calculateOrderTotal().toFixed(2)} / month
              </dd>
            </div>
            
            <div className="pt-4 mt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Your first shipment is scheduled for <span className="font-medium text-gray-900">{getNextShipmentDate()}</span>.
              </p>
              <p className="mt-2 text-sm text-gray-500">
                You&apos;ll receive a confirmation email shortly with all the details of your subscription. If you don&apos;t see it, please check your spam folder.
              </p>
            </div>
          </dl>
        </div>
      </div>

      <div className="mt-10">
        <h3 className="text-lg font-medium text-gray-900">What&apos;s next?</h3>
        <p className="mt-2 text-sm text-gray-500">
          Get ready for your first shipment! Here&apos;s what you can do next:
        </p>
        
        <ul className="mt-6 space-y-3">
          <li className="flex items-start">
            <div className="flex-shrink-0 h-5 w-5 text-indigo-500">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="ml-3 text-sm text-gray-700">
              Check your email for order confirmation and tracking information
            </span>
          </li>
          <li className="flex items-start">
            <div className="flex-shrink-0 h-5 w-5 text-indigo-500">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="ml-3 text-sm text-gray-700">
              Download our mobile app to manage your subscription
            </span>
          </li>
          <li className="flex items-start">
            <div className="flex-shrink-0 h-5 w-5 text-indigo-500">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="ml-3 text-sm text-gray-700">
              Follow us on social media for shooting tips and exclusive offers
            </span>
          </li>
        </ul>
      </div>

      <div className="mt-10">
        <button
          type="button"
          onClick={onComplete}
          className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Go to Dashboard
          <ArrowRightIcon className="ml-2 -mr-1 h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

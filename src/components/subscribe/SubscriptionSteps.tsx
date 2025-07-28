import { CheckIcon } from '@heroicons/react/20/solid';

type Step = {
  id: string;
  name: string;
};

type SubscriptionStepsProps = {
  currentStep: number;
  steps: Step[];
};

export default function SubscriptionSteps({ currentStep, steps }: SubscriptionStepsProps) {
  return (
    <nav aria-label="Progress" className="mb-12">
      <ol className="flex items-center">
        {steps.map((step, stepIdx) => (
          <li
            key={step.name}
            className={`${stepIdx !== steps.length - 1 ? 'flex-1' : ''} relative`}
          >
            {stepIdx < currentStep - 1 ? (
              // Completed step
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-indigo-600" />
                </div>
                <div className="group relative flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-indigo-600">
                  <CheckIcon className="h-5 w-5 text-white" aria-hidden="true" />
                  <span className="sr-only">{step.name}</span>
                </div>
                <div className="mt-3">
                  <p className="text-sm font-medium text-gray-900">{step.name}</p>
                </div>
              </>
            ) : stepIdx === currentStep - 1 ? (
              // Current step
              <div className="flex flex-col items-center">
                <div
                  className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 border-indigo-600"
                  aria-current="step"
                >
                  <span className="text-indigo-600">{step.id}</span>
                </div>
                <div className="mt-3">
                  <p className="text-sm font-medium text-indigo-600">{step.name}</p>
                </div>
              </div>
            ) : (
              // Upcoming step
              <div className="flex flex-col items-center">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 border-gray-300">
                  <span className="text-gray-500">{step.id}</span>
                </div>
                <div className="mt-3">
                  <p className="text-sm font-medium text-gray-500">{step.name}</p>
                </div>
              </div>
            )}
            
            {stepIdx < steps.length - 1 && (
              <div className="absolute top-4 left-1/2 -ml-2 mt-0.5 h-0.5 w-full bg-gray-300" aria-hidden="true" />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

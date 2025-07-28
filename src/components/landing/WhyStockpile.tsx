'use client';

import { CheckCircleIcon } from '@heroicons/react/24/outline';

const benefits = [
  {
    name: 'Proactive',
    description: 'Build your stockpile before you need it, avoiding shortages and price spikes.',
  },
  {
    name: 'Affordable',
    description: 'Small, consistent contributions are easier on your budget than large purchases.',
  },
  {
    name: 'Consistent Access',
    description: 'Guaranteed access to ammo when you need it, without the hassle of searching.',
  },
  {
    name: 'Peace of Mind',
    description: 'Know you\'re always prepared, no matter what the future holds.',
  },
];

export default function WhyStockpile() {
  return (
    <section className="py-16 bg-white" id="why-stockpile">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Why The Stockpile Model Works
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-600 lg:mx-auto">
            A smarter way to ensure you always have what you need, when you need it.
          </p>
        </div>

        <div className="mt-16">
          <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            {benefits.map((benefit) => (
              <div key={benefit.name} className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                    <CheckCircleIcon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                    {benefit.name}
                  </p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-600">
                  {benefit.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex rounded-md shadow">
            <a
              href="/subscribe"
              className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50"
            >
              Start Your Stockpile Today
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

'use client';

import { popularCalibers } from '@/data/calibers';
import Link from 'next/link';

export default function PopularCalibers() {
  return (
    <section className="py-16 bg-gray-50" id="calibers">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Popular Calibers
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-600">
            We support a wide range of popular calibers
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {popularCalibers.map((caliber) => (
            <div 
              key={caliber.id}
              className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200"
            >
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">{caliber.name}</h3>
                <p className="mt-1 text-sm text-gray-600">{caliber.description}</p>
                <div className="mt-4">
                  <Link 
                    href="/subscribe"
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Subscribe to receive <span className="sr-only">{caliber.name}</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/subscribe"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            View All Calibers & Pricing
          </Link>
        </div>
      </div>
    </section>
  );
}

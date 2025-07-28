'use client';

import Link from 'next/link';
import { Button } from '../ui/button';

export default function Hero() {
  return (
    <section className="relative bg-gray-900 text-white">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-black/60" />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:flex lg:h-[600px] lg:items-center lg:px-8">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Build Your Ammo Stockpile the Smart Way
          </h1>
          <p className="mt-6 text-xl text-gray-300">
            Never be caught off guard again—subscribe, stack, and ship on your terms.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link href="/subscribe">
              <Button size="lg" className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700">
                Start My Stockpile
              </Button>
            </Link>
            <a
              href="#why-stockpile"
              className="flex items-center justify-center rounded-md border border-transparent bg-white px-8 py-3 text-base font-medium text-indigo-700 hover:bg-gray-100 md:py-4 md:px-10 md:text-lg"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

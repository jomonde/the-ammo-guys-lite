'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';

export default function EmailCapture() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('early_access_leads')
        .insert([{ email, created_at: new Date().toISOString() }]);

      if (error) throw error;
      
      setSubmitted(true);
      setEmail('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit. Please try again.');
      console.error('Error submitting email:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-indigo-700">
      <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
          <span className="block">Stay in the Loop</span>
          <span className="block">Get Early Access</span>
        </h2>
        
        {!submitted ? (
          <form onSubmit={handleSubmit} className="mt-8 sm:flex">
            <label htmlFor="email-address" className="sr-only">
              Email address
            </label>
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-3 border border-transparent text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-700 focus:ring-white rounded-md"
              placeholder="Enter your email"
            />
            <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3 sm:flex-shrink-0">
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-700 focus:ring-white ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Submitting...' : 'Get Updates'}
              </button>
            </div>
          </form>
        ) : (
          <div className="mt-8 p-4 bg-indigo-800 rounded-md">
            <p className="text-lg font-medium text-white">
              Thanks for signing up! We&apos;ll keep you updated.
            </p>
          </div>
        )}
        
        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md">
            <p>{error}</p>
          </div>
        )}
        
        <p className="mt-3 text-sm text-indigo-200">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </section>
  );
}

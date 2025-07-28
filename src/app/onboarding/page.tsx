import { OnboardingProvider } from '@/contexts/OnboardingContext';
import OnboardingFlow from '@/components/onboarding/OnboardingFlow';

export default function OnboardingPage() {
  return (
    <OnboardingProvider>
      <div className="min-h-screen bg-gray-50">
        <main className="container mx-auto px-4 py-12 max-w-4xl">
          <OnboardingFlow />
        </main>
      </div>
    </OnboardingProvider>
  );
}

import Hero from '@/components/landing/Hero';
import HowItWorks from '@/components/landing/HowItWorks';
import PopularCalibers from '@/components/landing/PopularCalibers';
import WhyStockpile from '@/components/landing/WhyStockpile';
import EmailCapture from '@/components/landing/EmailCapture';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <HowItWorks />
      <PopularCalibers />
      <WhyStockpile />
      <EmailCapture />
    </main>
  );
}

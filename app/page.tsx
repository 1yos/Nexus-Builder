import MarketingNavbar from '@/components/marketing/Navbar';
import Hero from '@/components/marketing/Hero';
import Features from '@/components/marketing/Features';
import TemplatesShowcase from '@/components/marketing/TemplatesShowcase';
import PricingPreview from '@/components/marketing/PricingPreview';
import Footer from '@/components/marketing/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <MarketingNavbar />
      <Hero />
      <Features />
      <TemplatesShowcase />
      <PricingPreview />
      <Footer />
    </main>
  );
}

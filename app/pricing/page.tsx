'use client';

import MarketingNavbar from '@/components/marketing/Navbar';
import Footer from '@/components/marketing/Footer';
import PricingPreview from '@/components/marketing/PricingPreview';
import { motion } from 'motion/react';
import { Check, HelpCircle } from 'lucide-react';
import Link from 'next/link';

const faqs = [
  {
    q: "Can I cancel my subscription at any time?",
    a: "Yes, you can cancel your subscription at any time from your account settings. You will continue to have access to your plan until the end of your billing cycle."
  },
  {
    q: "Do you offer a free trial?",
    a: "We offer a 14-day free trial for our Pro plan. No credit card is required to start your trial."
  },
  {
    q: "Can I use my own custom domain?",
    a: "Absolutely! Custom domains are available on our Pro and Team plans. We provide easy-to-follow instructions for connecting your domain."
  },
  {
    q: "Do you offer discounts for non-profits?",
    a: "Yes, we offer a 50% discount for registered non-profit organizations. Please contact our support team to apply."
  }
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-white">
      <MarketingNavbar />
      
      <div className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-zinc-900 mb-6">
              Plans for every stage of <br /> your business
            </h1>
            <p className="text-xl text-zinc-600 max-w-2xl mx-auto">
              Start for free and upgrade as you grow. No hidden fees, no surprises.
            </p>
          </div>

          <PricingPreview />

          {/* FAQ Section */}
          <div className="mt-32 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-zinc-900 mb-12 text-center">Frequently Asked Questions</h2>
            <div className="space-y-8">
              {faqs.map((faq, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-zinc-50 p-6 rounded-2xl border border-zinc-100"
                >
                  <div className="flex gap-4">
                    <HelpCircle className="w-6 h-6 text-blue-600 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-zinc-900 mb-2">{faq.q}</h3>
                      <p className="text-zinc-600 text-sm leading-relaxed">{faq.a}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Final CTA */}
          <div className="mt-32 bg-blue-600 rounded-[32px] p-12 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-white rounded-full blur-[100px]" />
              <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-white rounded-full blur-[100px]" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 relative z-10">Ready to build something amazing?</h2>
            <p className="text-blue-100 mb-10 max-w-xl mx-auto relative z-10">
              Join thousands of creators who are building their websites with Nexus. 
              Start your free project today.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
              <Link 
                href="/builder" 
                className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold hover:bg-blue-50 transition-all shadow-xl"
              >
                Get Started for Free
              </Link>
              <Link 
                href="/templates" 
                className="bg-blue-700 text-white border border-blue-500 px-8 py-4 rounded-xl font-bold hover:bg-blue-800 transition-all"
              >
                Explore Templates
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

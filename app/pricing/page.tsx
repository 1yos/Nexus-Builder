'use client';

import MarketingNavbar from '@/components/marketing/Navbar';
import Footer from '@/components/marketing/Footer';
import PricingPreview from '@/components/marketing/PricingPreview';
import { motion } from 'motion/react';
import { Check, Hexagon, Activity, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const faqs = [
  {
    q: "Can I sever my connection at any time?",
    a: "Yes, you can terminate your uplink at any time from your control panel. You will retain access to your current capacity until the cycle concludes."
  },
  {
    q: "Is there an initial evaluation period?",
    a: "We provide a 14-cycle evaluation phase for the RESONANCE tier. No energy credits are required to initiate."
  },
  {
    q: "Can I route through my own custom domain?",
    a: "Affirmative. Custom routing is available on RESONANCE and NEXUS tiers. We provide direct protocols for establishing the connection."
  },
  {
    q: "Are there reduced rates for collective entities?",
    a: "Yes, we offer a 50% reduction in energy exchange for verified non-profit collectives. Transmit a signal to our support nodes to apply."
  }
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-background selection:bg-[var(--accent-primary)]/30">
      <MarketingNavbar />
      
      <div className="pt-40 pb-32 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none -z-10">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[var(--accent-primary)]/5 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-[var(--accent-secondary)]/5 rounded-full blur-[150px]" />
          <div className="absolute inset-0 noise opacity-[0.03]" />
          
          {/* Grid lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-24"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface/50 border border-white/10 text-text-secondary text-[10px] font-black uppercase tracking-[0.3em] mb-8 backdrop-blur-md"
            >
              <Activity className="w-3 h-3 text-[var(--accent-primary)]" />
              RESOURCE ALLOCATION
            </motion.div>
            <h1 className="text-5xl md:text-8xl font-black text-text-primary mb-8 tracking-tighter leading-[0.9] uppercase">
              CAPACITY FOR EVERY <br /> STAGE OF YOUR OPERATION.
            </h1>
            <p className="text-text-secondary text-xl max-w-2xl mx-auto font-medium leading-relaxed">
              Initiate without cost and scale as required. <br />
              Transparent energy exchange protocols.
            </p>
          </motion.div>

          <PricingPreview />

          {/* FAQ Section */}
          <div className="mt-48 max-w-5xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <h2 className="text-4xl md:text-5xl font-black text-text-primary mb-6 tracking-tighter uppercase">DATA QUERIES</h2>
              <p className="text-text-secondary font-medium text-lg">Essential telemetry regarding NEXUS resource allocation.</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {faqs.map((faq, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5, borderColor: 'rgba(59,130,246,0.3)' }}
                  className="bg-surface/30 backdrop-blur-xl p-8 rounded-3xl border border-white/5 hover:border-[var(--accent-primary)]/30 transition-all duration-500 group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--accent-primary)]/5 blur-3xl rounded-full -mr-12 -mt-12 group-hover:bg-[var(--accent-primary)]/10 transition-colors" />
                  
                  <div className="flex gap-6 relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-background border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-500 group-hover:border-[var(--accent-primary)]/30">
                      <Hexagon className="w-7 h-7 text-text-secondary group-hover:text-[var(--accent-primary)] transition-colors" />
                    </div>
                    <div>
                      <h3 className="font-black text-text-primary mb-3 text-xl leading-tight tracking-tight uppercase">{faq.q}</h3>
                      <p className="text-text-secondary font-medium leading-relaxed">{faq.a}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Final CTA */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mt-48 bg-surface/30 backdrop-blur-xl border border-white/10 rounded-[3.5rem] p-16 md:p-24 text-center relative overflow-hidden shadow-2xl group"
          >
            {/* Animated Background for CTA */}
            <div className="absolute inset-0 pointer-events-none">
              <motion.div 
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.05, 0.1, 0.05],
                  rotate: [0, 45, 0]
                }}
                transition={{ duration: 15, repeat: Infinity }}
                className="absolute top-[-20%] left-[-10%] w-[80%] h-[80%] bg-[var(--accent-primary)] rounded-full blur-[150px]" 
              />
              <motion.div 
                animate={{ 
                  scale: [1.2, 1, 1.2],
                  opacity: [0.05, 0.1, 0.05],
                  rotate: [45, 0, 45]
                }}
                transition={{ duration: 18, repeat: Infinity }}
                className="absolute bottom-[-20%] right-[-10%] w-[80%] h-[80%] bg-[var(--accent-secondary)] rounded-full blur-[150px]" 
              />
              <div className="absolute inset-0 noise opacity-[0.05]" />
              
              {/* Scanline effect */}
              <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[size:100%_4px] pointer-events-none opacity-[0.05]" />
            </div>

            <div className="relative z-10">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/50 border border-white/10 text-text-secondary text-[10px] font-black uppercase tracking-[0.3em] mb-8"
              >
                <Hexagon className="w-3 h-3 text-[var(--accent-primary)]" />
                INITIATE SEQUENCE?
              </motion.div>
              
              <h2 className="text-4xl md:text-7xl font-black text-text-primary mb-8 tracking-tighter leading-[0.9] uppercase">
                READY TO CONSTRUCT <br /> YOUR REALITY?
              </h2>
              <p className="text-text-secondary text-xl mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
                Join the network of architects constructing digital entities with NEXUS. 
                Initialize your first node today.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-6">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link 
                    href="/builder" 
                    className="relative group/btn overflow-hidden bg-white text-black px-12 py-6 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-2 uppercase tracking-widest"
                  >
                    <div className="absolute inset-0 bg-accent-gradient opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500" />
                    <span className="relative z-10 group-hover/btn:text-white transition-colors">INITIALIZE FOR FREE</span>
                    <ArrowRight className="w-5 h-5 relative z-10 group-hover/btn:text-white transition-colors" />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link 
                    href="/templates" 
                    className="bg-surface/50 text-text-primary border border-white/10 px-12 py-6 rounded-2xl font-black text-lg hover:bg-white/5 transition-all backdrop-blur-sm uppercase tracking-widest"
                  >
                    ACCESS REPOSITORY
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

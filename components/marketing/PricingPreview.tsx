'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Hexagon, Activity } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

const plans = [
  {
    name: 'Standard Unit',
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: 'Basic synthesis for individual entities.',
    features: [
      '3 Active Constructs',
      'Standard Neural Engine',
      'Community Support',
      'NEXUS Subdomain'
    ],
    cta: 'Initialize',
    href: '/signup',
    highlighted: false
  },
  {
    name: 'Pro Core',
    monthlyPrice: 29,
    yearlyPrice: 24,
    description: 'Advanced creation for professional architects.',
    features: [
      'Unlimited Constructs',
      'Neural Engine v2.0',
      'Priority Uplink',
      'Custom Domain Node',
      'Advanced Analytics'
    ],
    cta: 'Upgrade Core',
    href: '/signup',
    highlighted: true
  },
  {
    name: 'Enterprise Matrix',
    monthlyPrice: 99,
    yearlyPrice: 79,
    description: 'Full-scale deployment for large networks.',
    features: [
      'Dedicated Matrix Server',
      'White-label Synthesis',
      '24/7 Neural Support',
      'Custom API Access',
      'SLA Guarantee'
    ],
    cta: 'Contact Nexus',
    href: '/signup',
    highlighted: false
  }
];

function PriceDisplay({ value }: { value: number | string }) {
  if (typeof value === 'string') return <span>{value}</span>;
  return <span>{value}</span>;
}

export default function PricingPreview() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section className="py-32 bg-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)]" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface/50 border border-border text-accent-highlight text-[8px] font-black uppercase tracking-[0.4em] mb-6"
          >
            Resource Allocation
          </motion.div>
          <h2 className="text-3xl md:text-5xl font-black text-text-primary mb-8 tracking-tighter uppercase">
            Select your <br />
            <span className="text-transparent bg-clip-text bg-accent-gradient drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]">Access Level.</span>
          </h2>
          
          {/* Toggle */}
          <div className="inline-flex items-center p-1 bg-surface border border-border rounded-xl">
            <button
              onClick={() => setIsYearly(false)}
              className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                !isYearly ? 'bg-accent-primary text-white shadow-lg shadow-accent-primary/20' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Cycle: Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                isYearly ? 'bg-accent-primary text-white shadow-lg shadow-accent-primary/20' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Cycle: Yearly
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className={`relative group p-8 rounded-3xl border transition-all duration-500 flex flex-col ${
                plan.highlighted 
                  ? 'bg-surface/40 border-accent-primary/50 shadow-[0_0_40px_rgba(59,130,246,0.1)]' 
                  : 'bg-surface/20 border-border hover:border-accent-primary/30'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-accent-primary text-white text-[8px] font-black uppercase tracking-[0.2em] rounded-full shadow-lg shadow-accent-primary/20">
                  Recommended Node
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-xl font-black text-text-primary uppercase tracking-tight mb-2">{plan.name}</h3>
                <p className="text-text-secondary text-xs leading-relaxed">{plan.description}</p>
              </div>

              <div className="mb-8 flex items-baseline gap-1">
                <span className="text-4xl font-black text-text-primary tracking-tighter">
                  ${isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                </span>
                <span className="text-text-secondary text-[10px] font-bold uppercase tracking-widest">/ cycle</span>
              </div>

              <div className="space-y-4 mb-10 flex-grow">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <div className="w-1 h-1 rounded-full bg-accent-primary shadow-[0_0_5px_rgba(59,130,246,1)]" />
                    <span className="text-xs text-text-secondary font-medium">{feature}</span>
                  </div>
                ))}
              </div>

              <Link 
                href={plan.href}
                className={`w-full py-4 rounded-xl text-[10px] font-black text-center uppercase tracking-[0.2em] transition-all duration-300 ${
                plan.highlighted
                  ? 'bg-accent-primary text-white hover:scale-[1.02] shadow-xl shadow-accent-primary/20'
                  : 'bg-surface border border-border text-text-primary hover:border-accent-primary hover:bg-accent-primary/5'
              }`}>
                {plan.cta}
              </Link>

              {/* Corner Accents */}
              <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-100 transition-opacity">
                <div className="w-8 h-8 border-t-2 border-r-2 border-accent-primary/30 rounded-tr-xl" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

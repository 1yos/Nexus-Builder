'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    price: '0',
    description: 'Perfect for personal projects and hobbies.',
    features: [
      '1 Project',
      'Basic Components',
      'Nexus Subdomain',
      'Community Support'
    ],
    cta: 'Get Started',
    href: '/signup',
    highlighted: false
  },
  {
    name: 'Pro',
    price: '19',
    description: 'Best for professionals and growing businesses.',
    features: [
      'Unlimited Projects',
      'Advanced Components',
      'Custom Domain',
      'Priority Support',
      'Remove Branding',
      'Analytics Integration'
    ],
    cta: 'Start Free Trial',
    href: '/signup',
    highlighted: true
  },
  {
    name: 'Team',
    price: '49',
    description: 'For agencies and design teams.',
    features: [
      'Everything in Pro',
      'Collaborative Editing',
      'Team Permissions',
      'Shared Components',
      'White-labeling'
    ],
    cta: 'Contact Sales',
    href: '/signup',
    highlighted: false
  }
];

export default function PricingPreview() {
  return (
    <section className="py-24 bg-zinc-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-zinc-600 max-w-2xl mx-auto">
            Choose the plan that fits your needs. All plans include our powerful visual builder.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative bg-white p-8 rounded-2xl border ${
                plan.highlighted ? 'border-blue-600 ring-4 ring-blue-50' : 'border-zinc-200'
              } flex flex-col`}
            >
              {plan.highlighted && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  Most Popular
                </span>
              )}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-zinc-900 mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-bold text-zinc-900">${plan.price}</span>
                  <span className="text-zinc-500">/month</span>
                </div>
                <p className="text-sm text-zinc-600">{plan.description}</p>
              </div>

              <ul className="space-y-4 mb-8 flex-grow">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-zinc-600">
                    <Check className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`w-full py-3 rounded-xl text-center font-semibold transition-all ${
                  plan.highlighted
                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200'
                    : 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200'
                }`}
              >
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { TEMPLATES } from '@/lib/templates';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export default function TemplatesShowcase() {
  const featuredTemplates = TEMPLATES.slice(0, 3);

  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">
              Start with a professional template
            </h2>
            <p className="text-zinc-600">
              Choose from our library of high-quality templates designed for startups, 
              portfolios, and businesses.
            </p>
          </div>
          <Link 
            href="/templates" 
            className="text-blue-600 font-semibold flex items-center gap-2 hover:gap-3 transition-all"
          >
            View all templates <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredTemplates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative"
            >
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-zinc-200 shadow-sm mb-4">
                <Image 
                  src={template.thumbnail}
                  alt={template.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <Link 
                    href={`/preview/${template.id}`}
                    className="bg-white text-zinc-900 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-zinc-100 transition-colors"
                  >
                    Preview
                  </Link>
                  <Link 
                    href={`/builder?template=${template.id}`}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Use Template
                  </Link>
                </div>
              </div>
              <h3 className="text-lg font-bold text-zinc-900">{template.name}</h3>
              <p className="text-sm text-zinc-500">{template.category}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

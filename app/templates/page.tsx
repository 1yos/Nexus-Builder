'use client';

import { useState } from 'react';
import MarketingNavbar from '@/components/marketing/Navbar';
import Footer from '@/components/marketing/Footer';
import { TEMPLATES } from '@/lib/templates';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, ArrowRight, ExternalLink } from 'lucide-react';

const categories = ['All', 'Landing Pages', 'Portfolio', 'Business', 'E-commerce', 'Blog'];

export default function TemplatesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredTemplates = TEMPLATES.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = activeCategory === 'All' || template.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <main className="min-h-screen bg-white">
      <MarketingNavbar />
      
      <div className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-4">
              Choose your starting point
            </h1>
            <p className="text-zinc-600 max-w-2xl mx-auto">
              Browse our collection of professionally designed templates and start building your dream website today.
            </p>
          </div>

          {/* Filters & Search */}
          <div className="flex flex-col md:flex-row gap-6 mb-12 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
              <input 
                type="text"
                placeholder="Search templates..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto no-scrollbar">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    activeCategory === category
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                      : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredTemplates.map((template) => (
                <motion.div
                  key={template.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="group"
                >
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-zinc-200 shadow-sm mb-4 bg-zinc-100">
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
                        className="bg-white text-zinc-900 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-zinc-100 transition-colors flex items-center gap-2"
                      >
                        Preview <ExternalLink className="w-4 h-4" />
                      </Link>
                      <Link 
                        href={`/builder?template=${template.id}`}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
                      >
                        Use Template
                      </Link>
                    </div>
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold text-zinc-900">{template.name}</h3>
                      <p className="text-sm text-zinc-500">{template.category}</p>
                    </div>
                    <div className="flex gap-1">
                      {template.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="text-[10px] uppercase tracking-wider font-bold text-zinc-400 bg-zinc-50 px-2 py-1 rounded border border-zinc-100">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-zinc-400" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 mb-2">No templates found</h3>
              <p className="text-zinc-500">Try adjusting your search or category filters.</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}

'use client';

import { useState } from 'react';
import MarketingNavbar from '@/components/marketing/Navbar';
import Footer from '@/components/marketing/Footer';
import { TEMPLATES } from '@/lib/templates';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ArrowRight, Compass, Activity, Layers, User } from 'lucide-react';

const categories = ['ALL', 'INTERFACE', 'ABSTRACT', 'MINIMAL'];

export default function TemplatesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('ALL');

  const filteredTemplates = TEMPLATES.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    let mappedCategory = 'ALL';
    if (template.category === 'Landing Pages') mappedCategory = 'INTERFACE';
    if (template.category === 'Portfolio') mappedCategory = 'MINIMAL';
    if (template.category === 'Business') mappedCategory = 'ABSTRACT';

    const matchesCategory = activeCategory === 'ALL' || mappedCategory === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <main className="min-h-screen bg-background selection:bg-accent-primary/30 pb-24 relative overflow-hidden">
      <MarketingNavbar />
      
      {/* Grid Background */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(var(--accent-primary) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      
      <div className="pt-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        
        {/* Header Section */}
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface/50 border border-border text-accent-highlight text-[8px] font-black uppercase tracking-[0.4em] mb-6"
          >
            Repository Access
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-black text-text-primary tracking-tighter leading-[0.9] uppercase">
            Neural <br />
            Structures.
          </h1>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-8 mb-16 items-end">
          <div className="w-full max-w-md">
            <span className="text-[8px] font-black text-accent-highlight uppercase tracking-[0.3em] mb-3 block">Search Repository</span>
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary group-focus-within:text-accent-primary transition-colors" />
              <input 
                type="text"
                placeholder="Scan for artifacts..."
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-surface/50 border border-border focus:border-accent-primary focus:outline-none transition-all text-xs font-black uppercase tracking-widest text-text-primary placeholder:text-text-secondary/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                  activeCategory === category
                    ? 'bg-accent-primary text-white shadow-lg shadow-accent-primary/20 border-accent-primary'
                    : 'bg-surface/50 text-text-secondary hover:text-text-primary border border-border'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredTemplates.map((template, index) => (
              <motion.div
                key={template.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group relative aspect-[3/4] rounded-3xl overflow-hidden border border-border bg-surface/30 transition-all duration-500 hover:border-accent-primary/50"
              >
                {/* Image Background */}
                <div className="absolute inset-0 z-0">
                  <Image 
                    src={template.thumbnail}
                    alt={template.name}
                    fill
                    className="object-cover opacity-30 group-hover:opacity-50 group-hover:scale-110 transition-all duration-1000"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                </div>
                
                {/* Content */}
                <div className="relative z-10 flex flex-col h-full p-8 justify-end">
                  <div className="mb-6">
                    <span className="text-[8px] font-black text-accent-highlight uppercase tracking-[0.3em] block mb-2 opacity-60">
                      Neural Structure // {template.category}
                    </span>
                    <h3 className="text-xl font-black text-white uppercase tracking-tight">{template.name}</h3>
                  </div>
                  
                  <div className="flex flex-col gap-3 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                    <Link 
                      href={`/builder?template=${template.id}`}
                      className="w-full bg-accent-primary text-white py-3 rounded-xl text-[10px] font-black hover:scale-105 transition-all flex items-center justify-center gap-2 uppercase tracking-widest shadow-lg shadow-accent-primary/20"
                    >
                      <Layers className="w-3 h-3" /> Initialize
                    </Link>
                    <Link 
                      href={`/preview/${template.id}`}
                      className="w-full bg-surface/80 backdrop-blur-md border border-border text-white py-3 rounded-xl text-[10px] font-black hover:bg-white hover:text-background transition-all flex items-center justify-center gap-2 uppercase tracking-widest"
                    >
                      <Compass className="w-3 h-3" /> Observe
                    </Link>
                  </div>
                </div>

                {/* Corner Accents */}
                <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-accent-highlight/20 group-hover:border-accent-primary/50 transition-colors" />
                <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-accent-highlight/20 group-hover:border-accent-primary/50 transition-colors" />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-32">
            <p className="text-text-secondary font-black text-[10px] uppercase tracking-widest opacity-50">No artifacts found in this sector.</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <Footer />

    </main>
  );
}

'use client';

import Link from 'next/link';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { TEMPLATES } from '@/lib/templates';
import Image from 'next/image';
import { ArrowRight, Eye, Hexagon, Layers, Compass } from 'lucide-react';
import { useRef, useState } from 'react';

function TemplateCard({ template, index }: { template: typeof TEMPLATES[0], index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-200, 200], [5, -5]), { stiffness: 100, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [-200, 200], [-5, 5]), { stiffness: 100, damping: 30 });

  function onMouseMove(e: React.MouseEvent) {
    const rect = cardRef.current?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      mouseX.set(x);
      mouseY.set(y);
    }
  }

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      onMouseMove={onMouseMove}
      onMouseLeave={() => { mouseX.set(0); mouseY.set(0); }}
      style={{ rotateX, rotateY, perspective: 1000 }}
      className="group relative"
    >
      <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-border bg-surface shadow-2xl transition-all duration-500 group-hover:border-accent-primary/50">
        <Image 
          src={template.thumbnail}
          alt={template.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-1000 ease-out opacity-40 group-hover:opacity-60"
          referrerPolicy="no-referrer"
        />
        
        {/* System Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
        
        {/* Hover Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-sm">
          <div className="flex flex-col gap-3 w-full max-w-[180px]">
            <Link 
              href={`/builder?template=${template.id}`}
              className="w-full bg-accent-primary text-white px-6 py-3 rounded-xl text-[10px] font-black hover:scale-105 transition-all shadow-xl shadow-accent-primary/20 flex items-center justify-center gap-2 uppercase tracking-widest"
            >
              <Hexagon className="w-3 h-3" /> Initialize
            </Link>
            <Link 
              href={`/preview/${template.id}`}
              className="w-full bg-surface/80 text-text-primary border border-border px-6 py-3 rounded-xl text-[10px] font-black hover:bg-white hover:text-background transition-all flex items-center justify-center gap-2 uppercase tracking-widest"
            >
              <Eye className="w-3 h-3" /> Observe
            </Link>
          </div>
        </div>

        {/* Corner Scanlines */}
        <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-accent-highlight/30" />
        <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-accent-highlight/30" />
        <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-accent-highlight/30" />
        <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-accent-highlight/30" />
      </div>
      
      <div className="mt-6 space-y-1 px-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-text-primary tracking-tight uppercase group-hover:text-accent-highlight transition-colors">
            {template.name}
          </h3>
          <span className="text-[8px] font-black text-accent-primary/50 uppercase tracking-widest">v1.0.4</span>
        </div>
        <p className="text-accent-highlight/60 font-bold uppercase text-[8px] tracking-[0.2em]">
          Neural Structure // {template.category}
        </p>
      </div>
    </motion.div>
  );
}

export default function TemplatesShowcase() {
  const featuredTemplates = TEMPLATES.slice(0, 3);

  return (
    <section className="py-32 bg-background relative overflow-hidden">
      {/* Grid Background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(var(--accent-primary) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-10">
          <div className="max-w-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface/50 border border-border text-accent-highlight text-[8px] font-black uppercase tracking-[0.4em] mb-6"
            >
              Repository Access
            </motion.div>
            <h2 className="text-3xl md:text-5xl font-black text-text-primary mb-6 tracking-tighter uppercase">
              Initialize with a <br /> 
              <span className="text-transparent bg-clip-text bg-accent-gradient drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]">Construct.</span>
            </h2>
          </div>
          
          <Link 
            href="/templates" 
            className="group relative px-8 py-4 bg-surface border border-border rounded-2xl text-text-primary font-black text-xs flex items-center gap-3 hover:border-accent-primary transition-all uppercase tracking-widest"
          >
            Access All Units
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {featuredTemplates.map((template, index) => (
            <TemplateCard key={template.id} template={template} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

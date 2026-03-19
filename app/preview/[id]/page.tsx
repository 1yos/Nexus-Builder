'use client';

import { useParams, useRouter } from 'next/navigation';
import { TEMPLATES } from '@/lib/templates';
import Link from 'next/link';
import { ChevronLeft, Monitor, Tablet, Smartphone, Hexagon, ExternalLink, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function TemplatePreviewPage() {
  const params = useParams();
  const router = useRouter();
  const template = TEMPLATES.find(t => t.id === params.id);
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  if (!template) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex flex-col items-center justify-center bg-background"
      >
        <h1 className="text-2xl font-black text-text-primary mb-4">Template not found</h1>
        <Link href="/templates" className="text-accent-primary hover:underline flex items-center gap-2 font-bold">
          <ChevronLeft className="w-4 h-4" /> Back to templates
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-screen flex flex-col bg-background overflow-hidden"
    >
      {/* Top Bar */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 100 }}
        className="h-20 bg-surface/50 backdrop-blur-xl border-b border-border flex items-center justify-between px-8 flex-shrink-0 z-50 shadow-2xl"
      >
        <div className="flex items-center gap-6">
          <motion.button 
            whileHover={{ scale: 1.1, x: -2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => router.back()}
            className="p-3 hover:bg-border rounded-2xl transition-all text-text-secondary hover:text-text-primary border border-transparent hover:border-border"
          >
            <ChevronLeft className="w-6 h-6" />
          </motion.button>
          
          <div className="h-8 w-px bg-border mx-2" />
          
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-black text-text-primary text-lg tracking-tight">
                {template.name}
              </h1>
              <Sparkles className="w-4 h-4 text-accent-primary animate-pulse" />
            </div>
            <p className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em]">
              {template.category}
            </p>
          </div>
        </div>

        {/* Device Switcher */}
        <div className="hidden md:flex items-center bg-background/50 p-1.5 rounded-2xl gap-1 border border-border">
          {[
            { id: 'desktop', icon: Monitor, label: 'Desktop' },
            { id: 'tablet', icon: Tablet, label: 'Tablet' },
            { id: 'mobile', icon: Smartphone, label: 'Mobile' }
          ].map((device) => (
            <motion.button 
              key={device.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewMode(device.id as any)}
              className={`px-4 py-2 rounded-xl transition-all relative flex items-center gap-2 ${
                viewMode === device.id 
                  ? 'text-text-primary' 
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {viewMode === device.id && (
                <motion.div 
                  layoutId="activeDevice"
                  className="absolute inset-0 bg-surface border border-border shadow-lg rounded-xl z-0"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <device.icon className="w-4 h-4 relative z-10" />
              <div className="text-[10px] font-black uppercase tracking-widest relative z-10">{device.label}</div>
            </motion.button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link 
              href={`/builder?template=${template.id}`}
              className="bg-accent-gradient text-white px-8 py-3 rounded-2xl text-sm font-black hover:shadow-2xl hover:shadow-accent-primary/30 transition-all flex items-center gap-2 group"
            >
              <Hexagon className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" /> 
              Use Template
            </Link>
          </motion.div>
        </div>
      </motion.header>

      {/* Preview Area */}
      <main className="flex-grow relative overflow-hidden p-6 md:p-12 flex justify-center bg-background">
        {/* Background Accents */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-accent-primary/5 rounded-full blur-[150px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent-primary/5 rounded-full blur-[150px]" />
        </div>

        <AnimatePresence mode="wait">
          <motion.div 
            key={viewMode}
            initial={{ opacity: 0, scale: 0.9, y: 40, filter: 'blur(20px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.9, y: 40, filter: 'blur(20px)' }}
            transition={{ type: "spring", damping: 25, stiffness: 150 }}
            className={`bg-surface shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden relative border border-border rounded-t-[2.5rem] md:rounded-[2.5rem] ${
              viewMode === 'desktop' ? 'w-full max-w-7xl' : 
              viewMode === 'tablet' ? 'w-[768px]' : 'w-[375px]'
            }`}
            style={{ height: '100%' }}
          >
            {/* Browser Chrome Mockup */}
            <div className="h-10 bg-surface border-b border-border flex items-center px-6 gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/30" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/30" />
                <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/30" />
              </div>
              <div className="flex-grow mx-10 bg-background/50 rounded-lg h-6 border border-border flex items-center px-4">
                <div className="w-2 h-2 rounded-full bg-text-secondary/20 mr-3" />
                <div className="w-32 h-1.5 bg-text-secondary/10 rounded-full" />
              </div>
            </div>

            {/* Iframe Mockup */}
            <div className="absolute inset-x-0 bottom-0 top-10">
              <iframe 
                src={`https://picsum.photos/seed/${template.id}/1920/1080`}
                className="w-full h-full border-none opacity-80 group-hover:opacity-100 transition-opacity"
                title={template.name}
              />
              
              {/* Overlay for premium feel */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent pointer-events-none" />
            </div>
            
            {/* Floating Info Badge */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="absolute bottom-8 right-8 bg-surface/80 backdrop-blur-xl border border-border p-4 rounded-2xl shadow-2xl hidden md:flex items-center gap-4"
            >
              <div className="p-3 bg-accent-gradient rounded-xl shadow-lg">
                <ExternalLink className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Live Preview</p>
                <p className="text-sm font-black text-text-primary">Interactive Mockup</p>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Sticky Mobile CTA */}
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 1.2, type: "spring" }}
        className="md:hidden fixed bottom-8 left-1/2 -translate-x-1/2 w-[calc(100%-4rem)] max-w-sm bg-surface/80 backdrop-blur-xl border border-border p-5 rounded-[2rem] shadow-2xl flex items-center justify-between gap-4 z-50"
      >
        <div>
          <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Ready to build?</p>
          <p className="text-sm font-black text-text-primary">Start with this template</p>
        </div>
        <motion.div whileTap={{ scale: 0.95 }}>
          <Link 
            href={`/builder?template=${template.id}`}
            className="bg-accent-gradient text-white px-6 py-3 rounded-xl text-xs font-black hover:shadow-2xl transition-all"
          >
            Use Now
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

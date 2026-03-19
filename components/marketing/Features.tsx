'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { 
  Activity, 
  Compass, 
  Layers, 
  Hexagon, 
  Crosshair,
  Sparkles
} from 'lucide-react';
import { useRef, useState } from 'react';

const features = [
  {
    title: 'Neural Engine',
    description: 'Construct digital realities through a direct-link interface. Low-level control, high-level results.',
    icon: Hexagon,
    color: 'text-accent-primary',
    glow: 'shadow-[0_0_20px_rgba(59,130,246,0.3)]',
    delay: 0
  },
  {
    title: 'Matrix Synthesis',
    description: 'Real-time structural manifestation. Zero latency between conceptualization and deployment.',
    icon: Activity,
    color: 'text-accent-secondary',
    glow: 'shadow-[0_0_20px_rgba(139,92,246,0.3)]',
    delay: 0.1
  },
  {
    title: 'Adaptive Core',
    description: 'Morphological optimization across all dimensions. Fluid structures for a fluid web.',
    icon: Sparkles,
    color: 'text-accent-highlight',
    glow: 'shadow-[0_0_20px_rgba(34,211,238,0.3)]',
    delay: 0.2
  }
];

function FeatureCard({ feature }: { feature: typeof features[0] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: feature.delay, duration: 0.8 }}
      whileHover={{ y: -10 }}
      className="group relative p-8 rounded-3xl border border-border bg-surface/30 backdrop-blur-md overflow-hidden transition-all duration-500"
    >
      {/* Background Glow */}
      <div className={`absolute -inset-24 opacity-0 group-hover:opacity-20 transition-opacity duration-700 blur-[60px] rounded-full bg-gradient-to-br from-accent-primary to-accent-secondary`} />

      {/* System Status Indicator */}
      <div className="absolute top-6 right-8 flex items-center gap-1.5">
        <div className="w-1 h-1 rounded-full bg-accent-highlight animate-pulse" />
        <span className="text-[7px] font-black text-accent-highlight/50 uppercase tracking-widest">Link Active</span>
      </div>

      {/* Icon */}
      <div className={`relative w-12 h-12 rounded-xl bg-background/50 border border-border flex items-center justify-center mb-6 group-hover:border-accent-primary/50 transition-colors duration-500 ${feature.glow}`}>
        <feature.icon className={`w-6 h-6 ${feature.color} group-hover:scale-110 transition-transform duration-500`} />
      </div>

      <h3 className="text-xl font-black text-text-primary mb-3 tracking-tight uppercase group-hover:text-accent-highlight transition-colors">
        {feature.title}
      </h3>
      
      <p className="text-text-secondary text-sm leading-relaxed font-medium opacity-80 group-hover:opacity-100 transition-opacity">
        {feature.description}
      </p>

      {/* Corner Accents */}
      <div className="absolute bottom-0 left-0 w-8 h-px bg-gradient-to-r from-accent-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute bottom-0 left-0 w-px h-8 bg-gradient-to-t from-accent-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.div>
  );
}

export default function Features() {
  return (
    <section className="py-32 relative overflow-hidden bg-background">
      {/* Background System Map */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-accent-primary/20 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-accent-secondary/20 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-accent-highlight/20 rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface/50 border border-border text-accent-highlight text-[8px] font-black uppercase tracking-[0.4em] mb-6"
          >
            Capabilities Matrix
          </motion.div>
          
          <h2 className="text-3xl md:text-5xl font-black text-text-primary mb-6 tracking-tighter uppercase">
            Design Without <br /> 
            Limits.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
}

'use client';

import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'motion/react';
import Link from 'next/link';
import { ArrowRight, Play, Sparkles, MousePointer2, Hexagon } from 'lucide-react';
import Image from 'next/image';
import { useRef, useMemo, useState, useEffect } from 'react';

const STATIC_PARTICLES = [
  { id: 0, left: '12%', top: '24%', duration: 3.2, delay: 0.5 },
  { id: 1, left: '45%', top: '15%', duration: 4.1, delay: 1.2 },
  { id: 2, left: '78%', top: '33%', duration: 2.8, delay: 0.8 },
  { id: 3, left: '23%', top: '67%', duration: 3.5, delay: 2.1 },
  { id: 4, left: '56%', top: '82%', duration: 4.5, delay: 1.5 },
  { id: 5, left: '89%', top: '45%', duration: 3.1, delay: 0.3 },
  { id: 6, left: '15%', top: '55%', duration: 2.9, delay: 2.5 },
  { id: 7, left: '34%', top: '12%', duration: 4.2, delay: 1.8 },
  { id: 8, left: '67%', top: '89%', duration: 3.8, delay: 0.1 },
  { id: 9, left: '92%', top: '21%', duration: 3.3, delay: 3.2 },
  { id: 10, left: '5%', top: '44%', duration: 4.0, delay: 0.9 },
  { id: 11, left: '38%', top: '76%', duration: 3.6, delay: 1.4 },
  { id: 12, left: '61%', top: '5%', duration: 2.7, delay: 2.7 },
  { id: 13, left: '82%', top: '61%', duration: 4.4, delay: 0.6 },
  { id: 14, left: '19%', top: '92%', duration: 3.9, delay: 1.1 },
  { id: 15, left: '52%', top: '38%', duration: 3.0, delay: 2.3 },
  { id: 16, left: '75%', top: '72%', duration: 4.3, delay: 0.4 },
  { id: 17, left: '95%', top: '95%', duration: 3.4, delay: 1.9 },
  { id: 18, left: '42%', top: '52%', duration: 2.6, delay: 2.8 },
  { id: 19, left: '10%', top: '10%', duration: 4.6, delay: 0.2 },
];

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-300, 300], [10, -10]), { stiffness: 100, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [-300, 300], [-10, 10]), { stiffness: 100, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      mouseX.set(x);
      mouseY.set(y);
    }
  };

  return (
    <section 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen pt-32 pb-20 overflow-hidden flex items-center justify-center selection:bg-accent-primary/30"
    >
      {/* Background System */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-background" />
        
        {/* Animated Grid */}
        <div 
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: `linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
            maskImage: 'radial-gradient(circle at 50% 50%, black, transparent 80%)'
          }}
        />

        {/* System Nodes & Particles */}
        <div className="absolute inset-0">
          {STATIC_PARTICLES.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute w-1 h-1 bg-accent-primary rounded-full opacity-20"
              animate={{
                opacity: [0.1, 0.4, 0.1],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                delay: particle.delay
              }}
              style={{
                left: particle.left,
                top: particle.top,
              }}
            />
          ))}
        </div>
        
        {/* Soft Radial Glows */}
        <motion.div 
          animate={{ 
            opacity: [0.3, 0.5, 0.3],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-accent-primary/10 rounded-full blur-[120px]"
        />
        <motion.div 
          animate={{ 
            opacity: [0.2, 0.4, 0.2],
            scale: [1.1, 1, 1.1],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-accent-secondary/10 rounded-full blur-[120px]"
        />

        {/* Noise Texture Overlay */}
        <div className="absolute inset-0 noise opacity-[0.03]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ opacity }}
          className="max-w-5xl mx-auto"
        >
          {/* Badge */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface/50 border border-border text-accent-highlight text-[9px] font-black uppercase tracking-[0.4em] mb-10 backdrop-blur-md"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-accent-highlight animate-pulse shadow-[0_0_8px_var(--accent-highlight)]" />
            System Status: Active
          </motion.div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-text-primary mb-8 tracking-tighter leading-[0.9] uppercase">
            The Nexus of <br />
            <span className="text-transparent bg-clip-text bg-accent-gradient drop-shadow-[0_0_30px_rgba(59,130,246,0.3)]">
              Creation
            </span>
          </h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-text-secondary text-base md:text-lg mb-12 max-w-xl mx-auto font-medium leading-relaxed tracking-wide"
          >
            Construct high-performance digital artifacts through a cyber-minimal interface. 
            Where thought becomes structural reality.
          </motion.p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-24">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative group"
            >
              <div className="absolute -inset-0.5 bg-accent-primary rounded-xl blur opacity-20 group-hover:opacity-50 transition duration-500" />
              <Link 
                href="/builder" 
                className="relative bg-surface border border-accent-primary/30 text-white px-10 py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] flex items-center gap-3 transition-all hover:border-accent-primary"
              >
                <Hexagon className="w-4 h-4 text-accent-primary" /> 
                Initialize Core
              </Link>
            </motion.div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-10 py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] border border-border text-text-primary flex items-center gap-3 transition-all bg-surface/30 backdrop-blur-md hover:bg-surface/50"
            >
              <Play className="w-4 h-4 fill-accent-highlight text-accent-highlight" /> 
              View Matrix
            </motion.button>
          </div>
        </motion.div>

        {/* Builder Preview with 3D Tilt */}
        <motion.div
          initial={{ opacity: 0, y: 100, rotateX: 15 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ delay: 0.6, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          style={{ rotateX, rotateY, perspective: 1200 }}
          className="relative max-w-5xl mx-auto group"
        >
          {/* Glow Effect */}
          <div className="absolute -inset-10 bg-accent-primary/10 rounded-[3rem] blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          
          <motion.div 
            className="relative bg-surface/80 backdrop-blur-2xl rounded-2xl border border-border shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden aspect-video"
          >
            {/* Browser Chrome */}
            <div className="h-10 bg-background/50 border-b border-border flex items-center px-4 gap-2">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-border" />
                <div className="w-2 h-2 rounded-full bg-border" />
                <div className="w-2 h-2 rounded-full bg-border" />
              </div>
              <div className="flex-grow mx-10 bg-background/30 rounded-md h-5 border border-border/50 flex items-center px-3">
                <div className="w-1.5 h-1.5 rounded-full bg-accent-highlight/30 mr-2" />
                <div className="w-24 h-1 bg-text-secondary/10 rounded-full" />
              </div>
            </div>

            {/* Mockup Content */}
            <div className="absolute inset-0 top-10 bg-background/20 p-6 grid grid-cols-12 gap-6">
              <div className="col-span-3 space-y-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="h-8 bg-surface/40 border border-border/50 rounded-lg" />
                ))}
              </div>
              <div className="col-span-9 relative bg-surface/20 border border-border/30 rounded-xl overflow-hidden group/canvas">
                <Image 
                  src="https://picsum.photos/seed/nexus/1200/800"
                  alt="Nexus Builder Mockup"
                  fill
                  className="object-cover opacity-20 grayscale transition-all duration-1000 group-hover/canvas:opacity-40 group-hover/canvas:grayscale-0"
                  referrerPolicy="no-referrer"
                />
                
                {/* System HUD Elements */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <div className="w-8 h-1 bg-accent-primary/50 rounded-full" />
                  <div className="w-4 h-1 bg-accent-secondary/50 rounded-full" />
                </div>
                
                {/* Floating Cursor Mockup */}
                <motion.div 
                  animate={{ 
                    x: [100, 400, 250, 100],
                    y: [150, 80, 250, 150]
                  }}
                  transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute z-20"
                >
                  <MousePointer2 className="w-4 h-4 text-accent-highlight fill-accent-highlight drop-shadow-[0_0_10px_var(--accent-highlight)]" />
                  <div className="ml-4 mt-2 bg-surface/90 backdrop-blur-md border border-accent-highlight/30 text-accent-highlight text-[7px] font-black uppercase tracking-[0.2em] px-2 py-1 rounded shadow-2xl">
                    Synthesizing...
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[8px] font-black text-text-secondary uppercase tracking-[0.4em]">DESCEND</span>
        <div className="w-px h-12 bg-gradient-to-b from-accent-primary to-transparent" />
      </motion.div>
    </section>
  );
}

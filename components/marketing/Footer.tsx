'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { Twitter, Github, Linkedin, Mail } from 'lucide-react';
import NexusLogo from './NexusLogo';

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border py-20 relative overflow-hidden">
      {/* Grid Background */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(var(--accent-primary) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-6 group">
              <NexusLogo className="w-8 h-8" />
              <div className="text-xl font-black text-text-primary tracking-tighter uppercase group-hover:text-accent-highlight transition-colors">Nexus</div>
            </Link>
            <p className="text-text-secondary text-xs leading-relaxed max-w-xs uppercase tracking-wider font-medium opacity-60">
              The next-generation neural synthesis platform for digital architects and creative networks.
            </p>
          </div>
          
          <div>
            <h4 className="text-[10px] font-black text-text-primary uppercase tracking-[0.3em] mb-6">System Nodes</h4>
            <ul className="space-y-4">
              {['Builder', 'Templates', 'Pricing', 'Dashboard'].map((item) => (
                <li key={item}>
                  <Link href={`/${item.toLowerCase()}`} className="text-text-secondary hover:text-accent-primary text-[10px] font-black uppercase tracking-widest transition-colors flex items-center gap-2 group">
                    <div className="w-1 h-1 rounded-full bg-border group-hover:bg-accent-primary transition-colors" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-black text-text-primary uppercase tracking-[0.3em] mb-6">Network</h4>
            <ul className="space-y-4">
              {['Documentation', 'API Reference', 'System Status', 'Changelog'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-text-secondary hover:text-accent-primary text-[10px] font-black uppercase tracking-widest transition-colors flex items-center gap-2 group">
                    <div className="w-1 h-1 rounded-full bg-border group-hover:bg-accent-primary transition-colors" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-black text-text-primary uppercase tracking-[0.3em] mb-6">Connect</h4>
            <div className="flex gap-4">
              {[Twitter, Github, Linkedin, Mail].map((Icon, i) => (
                <Link key={i} href="#" className="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center text-text-secondary hover:text-accent-primary hover:border-accent-primary transition-all">
                  <Icon className="w-4 h-4" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6">
            <p className="text-[8px] font-black text-text-secondary uppercase tracking-[0.2em]">
              © 2026 NEXUS CORE // ALL RIGHTS RESERVED
            </p>
            <div className="h-3 w-px bg-border" />
            <p className="text-[8px] font-black text-accent-primary uppercase tracking-[0.2em] animate-pulse">
              System Status: Optimal
            </p>
          </div>
          
          <div className="flex gap-8">
            <Link href="#" className="text-[8px] font-black text-text-secondary hover:text-text-primary uppercase tracking-[0.2em] transition-colors">Privacy Protocol</Link>
            <Link href="#" className="text-[8px] font-black text-text-secondary hover:text-text-primary uppercase tracking-[0.2em] transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

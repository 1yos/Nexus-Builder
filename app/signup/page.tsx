'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { Hexagon, Mail, Lock, ArrowRight, Chrome, User } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import NexusLogo from '@/components/marketing/NexusLogo';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate signup
    setTimeout(() => {
      router.push('/dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 selection:bg-accent-primary/30 relative overflow-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-accent-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent-secondary/5 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute inset-0 noise opacity-[0.03]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full relative z-10"
      >
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex flex-col items-center gap-4 mb-8 group">
            <NexusLogo className="w-16 h-16" />
            <div className="font-black text-4xl tracking-[0.4em] text-text-primary uppercase drop-shadow-[0_0_20px_rgba(59,130,246,0.4)]">NEXUS</div>
          </Link>
          <h1 className="text-3xl font-black text-text-primary tracking-tighter uppercase mb-2">INITIALIZE IDENTITY</h1>
          <p className="text-[10px] font-mono font-black text-text-secondary uppercase tracking-[0.3em] opacity-60">Construct your digital presence in the network</p>
        </div>

        <div className="bg-surface/30 backdrop-blur-3xl p-8 rounded-[2.5rem] border border-white/5 shadow-2xl shadow-black/50 relative overflow-hidden group">
          {/* Neon Glow Accents */}
          <div className="absolute top-0 left-0 w-48 h-48 bg-accent-secondary/5 blur-[80px] rounded-full -ml-24 -mt-24 group-hover:bg-accent-secondary/10 transition-colors duration-700" />
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-accent-primary/10 blur-[80px] rounded-full -mr-24 -mb-24" />
          
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="space-y-2">
              <label className="block text-[9px] font-mono font-black text-text-secondary uppercase tracking-[0.4em] ml-1">DESIGNATION</label>
              <div className="relative group/input">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary group-focus-within/input:text-accent-primary transition-colors duration-300" />
                <input 
                  type="text"
                  required
                  placeholder="Architect Name"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-white/5 bg-background/40 text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-primary/30 focus:border-accent-primary/50 transition-all placeholder:text-text-secondary/20 font-medium backdrop-blur-md"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-px bg-accent-primary group-focus-within/input:w-1/2 transition-all duration-500" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[9px] font-mono font-black text-text-secondary uppercase tracking-[0.4em] ml-1">COMMUNICATION VECTOR</label>
              <div className="relative group/input">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary group-focus-within/input:text-accent-primary transition-colors duration-300" />
                <input 
                  type="email"
                  required
                  placeholder="signal@network.com"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-white/5 bg-background/40 text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-primary/30 focus:border-accent-primary/50 transition-all placeholder:text-text-secondary/20 font-medium backdrop-blur-md"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-px bg-accent-primary group-focus-within/input:w-1/2 transition-all duration-500" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[9px] font-mono font-black text-text-secondary uppercase tracking-[0.4em] ml-1">ENCRYPTION KEY</label>
              <div className="relative group/input">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary group-focus-within/input:text-accent-primary transition-colors duration-300" />
                <input 
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-white/5 bg-background/40 text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-primary/30 focus:border-accent-primary/50 transition-all placeholder:text-text-secondary/20 font-medium backdrop-blur-md"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-px bg-accent-primary group-focus-within/input:w-1/2 transition-all duration-500" />
              </div>
            </div>

            <motion.button 
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full relative group/btn overflow-hidden bg-white text-black py-5 rounded-2xl font-black transition-all flex items-center justify-center gap-3 disabled:opacity-50 uppercase tracking-[0.2em] text-xs shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-accent-primary/20"
            >
              <div className="absolute inset-0 bg-accent-gradient opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10 group-hover/btn:text-white transition-colors">
                {isLoading ? 'ESTABLISHING LINK...' : 'INITIALIZE'}
              </div>
              <ArrowRight className="w-5 h-5 relative z-10 group-hover/btn:text-white transition-colors group-hover/btn:translate-x-1 transition-transform" />
            </motion.button>
          </form>

          <div className="relative my-10 z-10">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
            <div className="relative flex justify-center text-[9px] uppercase tracking-[0.4em] font-mono font-black text-text-secondary bg-transparent px-4 backdrop-blur-sm">OR BYPASS VIA</div>
          </div>

          <motion.button 
            whileHover={{ scale: 1.01, backgroundColor: 'rgba(255,255,255,0.08)' }}
            whileTap={{ scale: 0.99 }}
            className="w-full bg-white/5 border border-white/10 text-text-primary py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-[10px] relative z-10"
          >
            <Chrome className="w-4 h-4 text-accent-primary" /> GOOGLE PROTOCOL
          </motion.button>
        </div>

        <p className="text-center mt-10 text-[9px] font-mono font-black text-text-secondary uppercase tracking-[0.3em]">
          ALREADY CONNECTED? <Link href="/login" className="text-accent-primary hover:text-accent-highlight transition-colors">ESTABLISH LINK</Link>
        </p>
      </motion.div>
    </div>
  );
}

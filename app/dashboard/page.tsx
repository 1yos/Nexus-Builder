'use client';

import { Plus, Hexagon, Settings, Activity, Compass, Layers, User, ChevronRight, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'motion/react';
import MarketingNavbar from '@/components/marketing/Navbar';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background selection:bg-[var(--accent-primary)]/30 pb-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[var(--accent-primary)]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[var(--accent-secondary)]/5 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute inset-0 noise opacity-[0.02]" />
      </div>

      <MarketingNavbar />
      
      <main className="pt-32 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto relative">
        
        {/* Header Section */}
        <div className="mb-12">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 mb-4"
          >
            <div className="w-2 h-2 rounded-full bg-[var(--accent-primary)] animate-pulse shadow-[0_0_10px_var(--accent-primary)]" />
            <span className="text-[10px] font-black text-text-secondary uppercase tracking-[0.3em]">
              SYSTEM ONLINE // NODE_01
            </span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black text-text-primary tracking-tighter leading-[1] uppercase"
          >
            Welcome back,<br />
            <span className="text-gradient drop-shadow-[0_0_20px_rgba(59,130,246,0.3)]">OPERATOR_01</span>
          </motion.h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Neural Flow Status Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:col-span-2 bg-surface/30 backdrop-blur-xl border border-white/5 rounded-3xl p-8 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent-primary)]/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-[var(--accent-primary)]/10 transition-colors" />
            
            <div className="flex items-center gap-2 mb-8">
              <Activity className="w-4 h-4 text-[var(--accent-primary)]" />
              <span className="text-[10px] font-black text-text-secondary uppercase tracking-widest">NEURAL FLOW TELEMETRY</span>
            </div>
            
            <div className="flex justify-between items-end mb-8 relative z-10">
              <div>
                <span className="text-[10px] font-black text-text-secondary uppercase tracking-widest block mb-2">Total Resonance</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black text-text-primary tracking-tighter">84.2</span>
                  <span className="text-xl font-black text-[var(--accent-primary)]">%</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-black text-text-secondary uppercase tracking-widest block mb-2">Active Nodes</span>
                <span className="text-3xl font-black text-text-primary tracking-tighter">1,204</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden relative z-10">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '84.2%' }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="h-full bg-accent-gradient rounded-full relative"
              >
                <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent)] animate-[shimmer_2s_infinite]" />
              </motion.div>
            </div>
          </motion.div>

          {/* Rapid Access */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <Link href="/builder" className="block bg-surface/30 backdrop-blur-xl border border-white/5 rounded-2xl p-5 hover:border-[var(--accent-primary)]/30 transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[var(--accent-primary)]/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 border border-[var(--accent-primary)]/20">
                  <Hexagon className="w-6 h-6 text-[var(--accent-primary)]" />
                </div>
                <div>
                  <span className="text-[10px] font-black text-text-secondary uppercase tracking-widest block">INITIATE</span>
                  <span className="text-sm font-black text-text-primary uppercase tracking-tight">NEW FLOW</span>
                </div>
              </div>
            </Link>
            <Link href="/templates" className="block bg-surface/30 backdrop-blur-xl border border-white/5 rounded-2xl p-5 hover:border-[var(--accent-secondary)]/30 transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[var(--accent-secondary)]/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 border border-[var(--accent-secondary)]/20">
                  <Plus className="w-6 h-6 text-[var(--accent-secondary)]" />
                </div>
                <div>
                  <span className="text-[10px] font-black text-text-secondary uppercase tracking-widest block">EXPLORE</span>
                  <span className="text-sm font-black text-text-primary uppercase tracking-tight">REPOSITORY</span>
                </div>
              </div>
            </Link>
            <Link href="/settings" className="block bg-surface/30 backdrop-blur-xl border border-white/5 rounded-2xl p-5 hover:border-white/20 transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 border border-white/10">
                  <Settings className="w-6 h-6 text-text-secondary group-hover:text-text-primary transition-colors" />
                </div>
                <div>
                  <span className="text-[10px] font-black text-text-secondary uppercase tracking-widest block">CONFIGURE</span>
                  <span className="text-sm font-black text-text-primary uppercase tracking-tight">SYSTEM_CORE</span>
                </div>
              </div>
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Pulse Stream */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-surface/30 backdrop-blur-xl border border-white/5 rounded-3xl p-8 relative overflow-hidden group"
          >
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-xl font-black text-text-primary uppercase tracking-tight mb-1">Pulse Stream</h3>
                <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Real-time telemetrics</p>
              </div>
              <Activity className="w-5 h-5 text-[var(--accent-secondary)] animate-pulse" />
            </div>

            <div className="flex justify-center py-12">
              <div className="w-32 h-32 border border-dashed border-white/10 rounded-2xl flex items-center justify-center rotate-45 relative group-hover:border-[var(--accent-primary)]/30 transition-colors duration-700">
                <div className="w-14 h-14 bg-background border border-white/10 rounded-xl flex items-center justify-center -rotate-45 relative z-10 group-hover:border-[var(--accent-primary)]/50 transition-colors duration-700 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                  <Activity className="w-7 h-7 text-text-primary group-hover:text-[var(--accent-primary)] transition-colors" />
                </div>
                <div className="absolute inset-0 border border-[var(--accent-primary)]/20 rounded-2xl animate-[ping_3s_infinite]" />
                <div className="absolute inset-0 border border-[var(--accent-secondary)]/10 rounded-2xl animate-[ping_4s_infinite]" />
              </div>
            </div>

            <button className="w-full py-4 rounded-xl bg-background/50 border border-white/10 text-[10px] font-black text-text-secondary hover:text-text-primary hover:border-white/20 transition-all uppercase tracking-[0.2em]">
              EXPAND FEED
            </button>
          </motion.div>

          {/* Active Artifacts */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-surface/30 backdrop-blur-xl border border-white/5 rounded-3xl p-8"
          >
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-xl font-black text-text-primary uppercase tracking-tight mb-1">Active Artifacts</h3>
                <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Deployed structures</p>
              </div>
              <Link href="/templates" className="text-[10px] font-black text-[var(--accent-primary)] flex items-center gap-1 hover:brightness-125 transition-all uppercase tracking-widest">
                View All <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="space-y-4">
              <div className="bg-background/50 border border-white/5 rounded-2xl p-5 flex items-center justify-between group cursor-pointer hover:border-[var(--accent-primary)]/30 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[var(--accent-primary)]/10 flex items-center justify-center text-[var(--accent-primary)] font-black border border-[var(--accent-primary)]/20 group-hover:scale-110 transition-transform">
                    A
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-text-primary uppercase tracking-tight">Aether Engine</h4>
                    <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Last synced 4m ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-highlight)] shadow-[0_0_8px_var(--accent-highlight)]" />
                  <span className="text-[10px] font-black text-[var(--accent-highlight)] uppercase tracking-widest">OPTIMIZED</span>
                </div>
              </div>

              <div className="bg-background/50 border border-white/5 rounded-2xl p-5 flex items-center justify-between group cursor-pointer hover:border-[var(--accent-secondary)]/30 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[var(--accent-secondary)]/10 flex items-center justify-center text-[var(--accent-secondary)] font-black border border-[var(--accent-secondary)]/20 group-hover:scale-110 transition-transform">
                    N
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-text-primary uppercase tracking-tight">Nebula Mesh</h4>
                    <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Awaiting protocols</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
                  <span className="text-[10px] font-black text-yellow-500 uppercase tracking-widest">PENDING</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Empty State / Alerts */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="py-12 flex flex-col items-center text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-surface/30 border border-white/5 flex items-center justify-center mb-6 backdrop-blur-md">
            <EyeOff className="w-6 h-6 text-text-secondary" />
          </div>
          <h3 className="text-xl font-black text-text-primary mb-2 uppercase tracking-tight">The Void is Quiet</h3>
          <p className="text-[10px] font-black text-text-secondary max-w-[250px] uppercase tracking-widest leading-relaxed">
            No new alerts detected in your sector. Take this time to recalibrate your dashboard.
          </p>
        </motion.div>

      </main>

      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-surface/50 backdrop-blur-2xl border border-white/10 rounded-3xl px-8 py-4 flex items-center gap-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50">
        <Link href="/templates" className="flex flex-col items-center gap-1.5 text-text-secondary hover:text-[var(--accent-secondary)] transition-all group">
          <Compass className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="text-[8px] font-black uppercase tracking-[0.2em]">VOID</span>
        </Link>
        <Link href="/dashboard" className="flex flex-col items-center gap-1.5 text-[var(--accent-primary)] group">
          <Activity className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="text-[8px] font-black uppercase tracking-[0.2em]">PULSE</span>
        </Link>
        <Link href="#" className="flex flex-col items-center gap-1.5 text-text-secondary hover:text-white transition-all group">
          <Layers className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="text-[8px] font-black uppercase tracking-[0.2em]">FLOW</span>
        </Link>
        <Link href="/settings" className="flex flex-col items-center gap-1.5 text-text-secondary hover:text-white transition-all group">
          <User className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="text-[8px] font-black uppercase tracking-[0.2em]">AURA</span>
        </Link>
      </div>

    </div>
  );
}

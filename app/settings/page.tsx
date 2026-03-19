'use client';

import DashboardSidebar from '@/components/dashboard/Sidebar';
import { User, Lock, Bell, Palette, Shield, Trash2, Save } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'motion/react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />
      
      <main className="flex-grow p-8">
        <div className="max-w-4xl mx-auto">
          <header className="mb-10">
            <h1 className="text-4xl font-black text-text-primary uppercase tracking-tighter">Configuration</h1>
            <p className="text-text-secondary font-medium">Manage your entity parameters and network preferences.</p>
          </header>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Tabs */}
            <div className="w-full md:w-64 flex-shrink-0">
              <div className="bg-surface rounded-2xl border border-border p-2 space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${
                      activeTab === tab.id 
                        ? 'bg-accent-primary/10 text-accent-primary border border-accent-primary/20' 
                        : 'text-text-secondary hover:bg-white/5 hover:text-text-primary border border-transparent'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-grow space-y-8">
              {activeTab === 'profile' && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-surface rounded-2xl border border-border p-8"
                >
                  <h2 className="text-xl font-black text-text-primary mb-6 uppercase tracking-widest">Entity Data</h2>
                  <div className="space-y-6">
                    <div className="flex items-center gap-6 mb-8">
                      <div className="w-20 h-20 rounded-full bg-accent-primary/10 flex items-center justify-center text-accent-primary font-black text-2xl border border-accent-primary/20 shadow-[0_0_15px_rgba(178,141,255,0.2)]">
                        JD
                      </div>
                      <button className="text-[10px] font-black uppercase tracking-widest text-accent-primary hover:text-accent-primary/80 transition-colors">Modify Avatar</button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-text-secondary mb-2">Designation</label>
                        <input 
                          type="text" 
                          defaultValue="John Doe"
                          className="w-full px-4 py-3 rounded-xl border border-border bg-background text-text-primary focus:outline-none focus:border-accent-primary transition-all font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-text-secondary mb-2">Comm Link</label>
                        <input 
                          type="email" 
                          defaultValue="john@example.com"
                          className="w-full px-4 py-3 rounded-xl border border-border bg-background text-text-primary focus:outline-none focus:border-accent-primary transition-all font-bold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-text-secondary mb-2">Telemetry</label>
                      <textarea 
                        rows={4}
                        placeholder="Input entity parameters..."
                        className="w-full px-4 py-3 rounded-xl border border-border bg-background text-text-primary focus:outline-none focus:border-accent-primary transition-all resize-none font-bold"
                      />
                    </div>

                    <div className="pt-4 flex justify-end">
                      <button className="bg-accent-gradient text-white px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:shadow-2xl hover:shadow-accent-primary/30 transition-all flex items-center gap-2">
                        <Save className="w-4 h-4" /> Commit Changes
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'security' && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-surface rounded-2xl border border-border p-8"
                >
                  <h2 className="text-xl font-black text-text-primary mb-6 uppercase tracking-widest">Security Protocols</h2>
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <h3 className="font-black text-text-primary flex items-center gap-2 uppercase tracking-widest text-sm">
                        <Shield className="w-5 h-5 text-accent-secondary" /> Access Key
                      </h3>
                      <div className="grid grid-cols-1 gap-4">
                        <input 
                          type="password" 
                          placeholder="Current Key"
                          className="w-full px-4 py-3 rounded-xl border border-border bg-background text-text-primary focus:outline-none focus:border-accent-secondary transition-all font-bold"
                        />
                        <input 
                          type="password" 
                          placeholder="New Key"
                          className="w-full px-4 py-3 rounded-xl border border-border bg-background text-text-primary focus:outline-none focus:border-accent-secondary transition-all font-bold"
                        />
                      </div>
                      <button className="text-[10px] font-black uppercase tracking-widest text-accent-secondary hover:text-accent-secondary/80 transition-colors">Rotate Key</button>
                    </div>

                    <div className="pt-8 border-t border-border">
                      <h3 className="font-black text-red-500 mb-2 uppercase tracking-widest text-sm">Critical Actions</h3>
                      <p className="text-xs font-medium text-text-secondary mb-4">Termination of this entity is irreversible. All associated constructs will be purged from the network.</p>
                      <button className="bg-red-500/10 text-red-500 px-6 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-red-500/20 border border-red-500/20 transition-all flex items-center gap-2">
                        <Trash2 className="w-4 h-4" /> Terminate Entity
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

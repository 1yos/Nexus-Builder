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
    <div className="flex min-h-screen bg-zinc-50">
      <DashboardSidebar />
      
      <main className="flex-grow p-8">
        <div className="max-w-4xl mx-auto">
          <header className="mb-10">
            <h1 className="text-3xl font-bold text-zinc-900">Settings</h1>
            <p className="text-zinc-500">Manage your account and preferences.</p>
          </header>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Tabs */}
            <div className="w-full md:w-64 flex-shrink-0">
              <div className="bg-white rounded-2xl border border-zinc-200 p-2 space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      activeTab === tab.id 
                        ? 'bg-blue-50 text-blue-600' 
                        : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900'
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
                  className="bg-white rounded-2xl border border-zinc-200 p-8"
                >
                  <h2 className="text-xl font-bold text-zinc-900 mb-6">Profile Information</h2>
                  <div className="space-y-6">
                    <div className="flex items-center gap-6 mb-8">
                      <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-2xl">
                        JD
                      </div>
                      <button className="text-sm font-bold text-blue-600 hover:underline">Change Avatar</button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-zinc-700 mb-2">Full Name</label>
                        <input 
                          type="text" 
                          defaultValue="John Doe"
                          className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-zinc-700 mb-2">Email Address</label>
                        <input 
                          type="email" 
                          defaultValue="john@example.com"
                          className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-zinc-700 mb-2">Bio</label>
                      <textarea 
                        rows={4}
                        placeholder="Tell us about yourself..."
                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                      />
                    </div>

                    <div className="pt-4 flex justify-end">
                      <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center gap-2">
                        <Save className="w-4 h-4" /> Save Changes
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'security' && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-2xl border border-zinc-200 p-8"
                >
                  <h2 className="text-xl font-bold text-zinc-900 mb-6">Security Settings</h2>
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <h3 className="font-bold text-zinc-900 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-zinc-400" /> Password
                      </h3>
                      <div className="grid grid-cols-1 gap-4">
                        <input 
                          type="password" 
                          placeholder="Current Password"
                          className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        />
                        <input 
                          type="password" 
                          placeholder="New Password"
                          className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        />
                      </div>
                      <button className="text-sm font-bold text-blue-600 hover:underline">Change Password</button>
                    </div>

                    <div className="pt-8 border-t border-zinc-100">
                      <h3 className="font-bold text-red-600 mb-2">Danger Zone</h3>
                      <p className="text-sm text-zinc-500 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                      <button className="bg-red-50 text-red-600 px-6 py-3 rounded-xl font-bold hover:bg-red-100 transition-all flex items-center gap-2">
                        <Trash2 className="w-4 h-4" /> Delete Account
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

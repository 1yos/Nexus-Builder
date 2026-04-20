'use client';

import React, { useState, useEffect } from 'react';
import { MonitorDown, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js');
    }

    const handler = (e: any) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Show our custom install UI
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="fixed bottom-6 right-6 z-[100]"
      >
        <div className="bg-zinc-950/90 backdrop-blur-xl border border-zinc-800 rounded-2xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center gap-5 max-w-sm">
          <div className="relative group">
            <div className="absolute -inset-2 bg-blue-500/20 rounded-full blur-xl group-hover:bg-blue-500/30 transition-all" />
            <div className="relative w-14 h-14 bg-zinc-900 rounded-xl flex items-center justify-center border border-zinc-800 shadow-inner">
              <MonitorDown className="w-7 h-7 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <h4 className="text-[13px] font-bold text-zinc-100 tracking-tight uppercase">Desktop Application</h4>
            <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed font-medium">
              Install the NEXUS Neural Interface as a standalone desktop app for optimal performance.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={handleInstall}
                className="flex-1 px-4 py-2 bg-white text-black text-[11px] font-bold rounded-lg hover:bg-zinc-200 transition-all shadow-lg active:scale-95"
              >
                INSTALL NOW
              </button>
              <button
                onClick={() => setIsVisible(false)}
                className="px-4 py-2 bg-zinc-900 text-zinc-500 text-[11px] font-bold rounded-lg hover:text-zinc-300 transition-all border border-zinc-800 active:scale-95"
              >
                DISMISS
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

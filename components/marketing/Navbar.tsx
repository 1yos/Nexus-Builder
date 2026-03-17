'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { Zap } from 'lucide-react';

export default function MarketingNavbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                <Zap className="w-5 h-5 fill-current" />
              </div>
              <span className="font-bold text-xl tracking-tight">Nexus</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <Link href="/templates" className="text-sm font-medium text-zinc-600 hover:text-blue-600 transition-colors">
              Templates
            </Link>
            <Link href="/pricing" className="text-sm font-medium text-zinc-600 hover:text-blue-600 transition-colors">
              Pricing
            </Link>
            <Link href="/dashboard" className="text-sm font-medium text-zinc-600 hover:text-blue-600 transition-colors">
              Dashboard
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-zinc-600 hover:text-blue-600 transition-colors">
              Log in
            </Link>
            <Link 
              href="/builder" 
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

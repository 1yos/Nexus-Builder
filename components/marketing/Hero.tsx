'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowRight, Play } from 'lucide-react';
import Image from 'next/image';

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/50 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-10%] w-[30%] h-[30%] bg-indigo-100/50 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold mb-6 border border-blue-100">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            Now in Beta: AI-Powered Design
          </span>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-zinc-900 mb-6">
            Build Websites Visually <br />
            <span className="text-blue-600">— No Code Required</span>
          </h1>
          <p className="text-xl text-zinc-600 max-w-2xl mx-auto mb-10">
            Design, customize, and launch faster with our powerful drag-and-drop builder. 
            The most intuitive way to create professional websites.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link 
              href="/builder" 
              className="w-full sm:w-auto bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
            >
              Start Building <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              href="/templates" 
              className="w-full sm:w-auto bg-white text-zinc-900 border border-zinc-200 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-zinc-50 transition-all flex items-center justify-center gap-2"
            >
              Explore Templates
            </Link>
          </div>
        </motion.div>

        {/* Builder Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative max-w-5xl mx-auto"
        >
          <div className="relative rounded-2xl border border-zinc-200 shadow-2xl overflow-hidden bg-white">
            <div className="h-10 bg-zinc-50 border-b border-zinc-200 flex items-center px-4 gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="mx-auto bg-zinc-200 h-5 w-64 rounded-md" />
            </div>
            <div className="aspect-video relative bg-zinc-100">
              <Image 
                src="https://picsum.photos/seed/builder-ui/1200/800"
                alt="Builder UI Mockup"
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/5 flex items-center justify-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl cursor-pointer hover:scale-110 transition-transform">
                  <Play className="w-6 h-6 text-blue-600 fill-current ml-1" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Floating UI Elements */}
          <div className="absolute -top-6 -right-6 w-48 h-48 bg-white rounded-xl shadow-xl border border-zinc-100 p-4 hidden lg:block animate-bounce-slow">
            <div className="w-full h-2 bg-zinc-100 rounded mb-2" />
            <div className="w-2/3 h-2 bg-zinc-100 rounded mb-4" />
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-blue-500" />
                <div className="w-full h-2 bg-zinc-100 rounded" />
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-purple-500" />
                <div className="w-full h-2 bg-zinc-100 rounded" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

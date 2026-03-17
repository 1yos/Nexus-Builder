'use client';

import Link from 'next/link';
import { Zap, Twitter, Github, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-zinc-200 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-16">
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                <Zap className="w-5 h-5 fill-current" />
              </div>
              <span className="font-bold text-xl tracking-tight">Nexus</span>
            </Link>
            <p className="text-zinc-500 max-w-xs mb-6 leading-relaxed">
              The visual website builder for modern teams. 
              Design, build, and launch websites without writing a single line of code.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-400 hover:text-blue-600 hover:bg-blue-50 transition-all">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-400 hover:text-blue-600 hover:bg-blue-50 transition-all">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-400 hover:text-blue-600 hover:bg-blue-50 transition-all">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-zinc-900 mb-6">Product</h4>
            <ul className="space-y-4">
              <li><Link href="/builder" className="text-zinc-500 hover:text-blue-600 transition-colors">Builder</Link></li>
              <li><Link href="/templates" className="text-zinc-500 hover:text-blue-600 transition-colors">Templates</Link></li>
              <li><Link href="/pricing" className="text-zinc-500 hover:text-blue-600 transition-colors">Pricing</Link></li>
              <li><Link href="#" className="text-zinc-500 hover:text-blue-600 transition-colors">Changelog</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-zinc-900 mb-6">Resources</h4>
            <ul className="space-y-4">
              <li><Link href="#" className="text-zinc-500 hover:text-blue-600 transition-colors">Documentation</Link></li>
              <li><Link href="#" className="text-zinc-500 hover:text-blue-600 transition-colors">Tutorials</Link></li>
              <li><Link href="#" className="text-zinc-500 hover:text-blue-600 transition-colors">Blog</Link></li>
              <li><Link href="#" className="text-zinc-500 hover:text-blue-600 transition-colors">Community</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-zinc-900 mb-6">Company</h4>
            <ul className="space-y-4">
              <li><Link href="#" className="text-zinc-500 hover:text-blue-600 transition-colors">About</Link></li>
              <li><Link href="#" className="text-zinc-500 hover:text-blue-600 transition-colors">Careers</Link></li>
              <li><Link href="#" className="text-zinc-500 hover:text-blue-600 transition-colors">Privacy</Link></li>
              <li><Link href="#" className="text-zinc-500 hover:text-blue-600 transition-colors">Terms</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-zinc-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-zinc-400">
            © 2026 Nexus Inc. All rights reserved.
          </p>
          <div className="flex gap-8">
            <Link href="#" className="text-xs text-zinc-400 hover:text-zinc-600">Privacy Policy</Link>
            <Link href="#" className="text-xs text-zinc-400 hover:text-zinc-600">Terms of Service</Link>
            <Link href="#" className="text-xs text-zinc-400 hover:text-zinc-600">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

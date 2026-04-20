'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import NexusLogo from './NexusLogo';

export default function MarketingNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Templates', href: '/templates' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Dashboard', href: '/dashboard' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'py-3 bg-background/80 backdrop-blur-xl border-b border-border shadow-2xl shadow-black/20' 
          : 'py-6 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <NexusLogo className={isScrolled ? "w-8 h-8" : "w-10 h-10"} />
            <div className={`font-black tracking-[0.3em] uppercase text-text-primary transition-all duration-300 ${isScrolled ? "text-lg" : "text-xl"}`}>
              NexusBuilder
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-xs font-black uppercase tracking-widest transition-all relative group ${
                  pathname === link.href ? 'text-accent-primary' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {link.name}
                <motion.div 
                  className={`absolute -bottom-1 left-0 h-px bg-accent-primary transition-all ${
                    pathname === link.href ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </Link>
            ))}
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/builder"
                className="relative overflow-hidden bg-surface border border-border text-white px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg hover:shadow-accent-primary/20 transition-all group"
              >
                <div className="absolute inset-0 bg-accent-primary opacity-0 group-hover:opacity-10 transition-opacity" />
                <div className="relative z-10">Initiate</div>
              </Link>
            </motion.div>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-text-primary p-2"
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-surface border-b border-border overflow-hidden"
          >
            <div className="px-4 py-8 space-y-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block text-2xl font-black transition-colors ${
                    pathname === link.href ? 'text-accent-primary' : 'text-text-primary hover:text-accent-primary'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                href="/builder"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full bg-accent-gradient text-white text-center py-4 rounded-2xl font-black text-xl shadow-xl"
              >
                Get Started
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

'use client';

import DashboardSidebar from '@/components/dashboard/Sidebar';
import { Globe, Download, Link as LinkIcon, Check, ArrowRight, Hexagon, Shield, Server } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { useBuilderStore } from '@/store/useBuilderStore';
import { generateSiteCode } from '@/lib/codegen';
import JSZip from 'jszip';

export default function PublishPage() {
  const { pages, folders, globalComponents, tokens, collections, entries, codeOverrides } = useBuilderStore();
  const [isPublishing, setIsPublishing] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState<'html' | 'react' | 'nextjs'>('html');
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadName, setDownloadName] = useState<string>('');
  const [isInIframe, setIsInIframe] = useState(false);

  const [exportError, setExportError] = useState<string | null>(null);

  // Check if running in an iframe
  useState(() => {
    if (typeof window !== 'undefined') {
      setIsInIframe(window.self !== window.top);
    }
  });

  const handlePublish = () => {
    setIsPublishing(true);
    setTimeout(() => {
      setIsPublishing(false);
      setIsPublished(true);
    }, 2000);
  };

  const handleExport = async () => {
    if (pages.length === 0) {
      setExportError('No nodes to export. Initialize a construct first.');
      return;
    }

    setIsExporting(true);
    setDownloadUrl(null);
    setExportError(null);
    try {
      const zip = new JSZip();
      const siteCode = generateSiteCode(pages, folders, globalComponents, tokens, exportFormat, collections, entries, codeOverrides);

      Object.entries(siteCode).forEach(([filename, content]) => {
        zip.file(filename, content);
      });

      const blob = await zip.generateAsync({ type: 'blob' });
      
      const url = URL.createObjectURL(blob);
      const filename = `nexus-${exportFormat}-export.zip`;
      
      setDownloadUrl(url);
      setDownloadName(filename);
      
      // Attempt auto-download
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
    } catch (error) {
      console.error('Export failed:', error);
      setExportError('Extraction failed. Signal lost.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background selection:bg-[var(--accent-primary)]/30">
      <DashboardSidebar />
      
      <main className="flex-grow p-8 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--accent-primary)]/5 rounded-full blur-[120px] pointer-events-none -z-10" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[var(--accent-secondary)]/5 rounded-full blur-[120px] pointer-events-none -z-10" />
        <div className="absolute inset-0 noise opacity-[0.03] pointer-events-none -z-10" />

        <div className="max-w-4xl mx-auto relative z-10">
          <header className="mb-10">
            <h1 className="text-3xl font-black text-text-primary tracking-tight uppercase">DEPLOYMENT & EXTRACTION</h1>
            <p className="text-text-secondary font-medium">Broadcast your construct or extract the source matrix.</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Publish to Subdomain */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-surface/50 backdrop-blur-xl rounded-3xl border border-border p-8 flex flex-col shadow-2xl shadow-[var(--accent-primary)]/5 hover:border-[var(--accent-primary)]/30 transition-colors group"
            >
              <div className="w-12 h-12 bg-background rounded-xl flex items-center justify-center text-[var(--accent-primary)] mb-6 border border-border group-hover:border-[var(--accent-primary)]/50 transition-colors">
                <Globe className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-black text-text-primary mb-2 uppercase tracking-wide">BROADCAST TO NEXUS</h2>
              <p className="text-text-secondary text-sm mb-8 flex-grow font-medium">
                Establish an instant uplink on a free Nexus subdomain. 
                Includes encrypted transmission and global node distribution.
              </p>
              
              <div className="bg-background p-4 rounded-xl mb-8 border border-border">
                <div className="flex items-center gap-2 text-sm font-black text-text-secondary uppercase tracking-widest">
                  <div className="text-text-secondary/70">VECTOR:</div>
                  <div className="text-[var(--accent-primary)]">alpha-construct.nexus.network (MOCK)</div>
                </div>
              </div>

              <button 
                onClick={handlePublish}
                disabled={isPublishing || isPublished}
                className={`w-full py-4 rounded-xl font-black transition-all flex items-center justify-center gap-2 uppercase tracking-widest ${
                  isPublished 
                    ? 'bg-green-500/10 text-green-500 border border-green-500/20' 
                    : 'bg-accent-gradient text-white hover:shadow-lg hover:shadow-[var(--accent-primary)]/20'
                }`}
              >
                {isPublishing ? 'ESTABLISHING UPLINK...' : isPublished ? <><Check className="w-5 h-5" /> BROADCAST ACTIVE</> : 'INITIATE BROADCAST'}
              </button>
            </motion.div>

            {/* Export Code */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-surface/50 backdrop-blur-xl rounded-3xl border border-border p-8 flex flex-col shadow-2xl shadow-[var(--accent-secondary)]/5 hover:border-[var(--accent-secondary)]/30 transition-colors group"
            >
              <div className="w-12 h-12 bg-background rounded-xl flex items-center justify-center text-[var(--accent-secondary)] mb-6 border border-border group-hover:border-[var(--accent-secondary)]/50 transition-colors">
                <Download className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-black text-text-primary mb-2 uppercase tracking-wide">EXTRACT SOURCE MATRIX</h2>
              <p className="text-text-secondary text-sm mb-8 flex-grow font-medium">
                Download a pristine, production-ready bundle of HTML, CSS, and JavaScript. 
                Deploy to any external node.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-xs font-black text-text-secondary uppercase tracking-widest">
                  <Check className="w-4 h-4 text-[var(--accent-primary)]" /> OPTIMIZED ASSETS
                </div>
                <div className="flex items-center gap-3 text-xs font-black text-text-secondary uppercase tracking-widest">
                  <Check className="w-4 h-4 text-[var(--accent-primary)]" /> PRISTINE STRUCTURE
                </div>
                <div className="flex items-center gap-3 text-xs font-black text-text-secondary uppercase tracking-widest">
                  <Check className="w-4 h-4 text-[var(--accent-primary)]" /> ZERO DEPENDENCIES
                </div>
              </div>

              <div className="mb-6">
                <label className="text-[10px] font-black text-text-secondary/70 uppercase tracking-[0.2em] mb-3 block">EXTRACTION FORMAT</label>
                <div className="grid grid-cols-2 gap-2 bg-background p-1 rounded-xl border border-border">
                  <button 
                    onClick={() => setExportFormat('html')}
                    className={`py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${exportFormat === 'html' ? 'bg-surface shadow-sm text-[var(--accent-secondary)] border border-border' : 'text-text-secondary hover:text-text-primary'}`}
                  >
                    HTML/CSS
                  </button>
                  <button 
                    onClick={() => setExportFormat('react')}
                    className={`py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${exportFormat === 'react' ? 'bg-surface shadow-sm text-[var(--accent-secondary)] border border-border' : 'text-text-secondary hover:text-text-primary'}`}
                  >
                    REACT (VITE)
                  </button>
                  <button 
                    onClick={() => setExportFormat('nextjs')}
                    className={`py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${exportFormat === 'nextjs' ? 'bg-surface shadow-sm text-[var(--accent-secondary)] border border-border' : 'text-text-secondary hover:text-text-primary'} col-span-2`}
                  >
                    NEXT.JS (APP ROUTER)
                  </button>
                </div>
              </div>

              {isInIframe && (
                <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-xs text-yellow-500">
                  <p className="font-black mb-1 uppercase tracking-widest">ENVIRONMENT NOTICE</p>
                  <p className="font-medium">Extractions may be blocked in this preview. If the download fails, use the link below or open the interface in a new tab.</p>
                </div>
              )}

              {exportError && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-500">
                  <p className="font-black mb-1 uppercase tracking-widest">SYSTEM ERROR</p>
                  <p className="font-medium">{exportError}</p>
                </div>
              )}

              <button 
                onClick={handleExport}
                disabled={isExporting}
                className="w-full bg-surface border border-border text-text-primary py-4 rounded-xl font-black hover:bg-white/5 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mb-4 uppercase tracking-widest"
              >
                {isExporting ? 'COMPILING MATRIX...' : <><Download className="w-5 h-5" /> GENERATE ARCHIVE</>}
              </button>

              {downloadUrl && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-[var(--accent-secondary)]/10 border border-[var(--accent-secondary)]/20 rounded-xl flex flex-col items-center justify-center text-center gap-3"
                >
                  <div className="text-sm font-black text-[var(--accent-secondary)] uppercase tracking-widest">EXTRACTION READY</div>
                  <a 
                    href={downloadUrl} 
                    download={downloadName}
                    className="bg-[var(--accent-secondary)] text-white px-6 py-2 rounded-lg font-black text-xs hover:opacity-90 transition-all shadow-sm uppercase tracking-widest"
                  >
                    DOWNLOAD ARCHIVE
                  </a>
                </motion.div>
              )}
            </motion.div>

            {/* Custom Domain */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-surface/50 backdrop-blur-xl rounded-3xl border border-border p-8 md:col-span-2 shadow-2xl shadow-black/20"
            >
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="w-16 h-16 bg-background rounded-2xl flex items-center justify-center text-[var(--accent-primary)] flex-shrink-0 border border-border">
                  <Hexagon className="w-8 h-8" />
                </div>
                <div className="flex-grow">
                  <h2 className="text-xl font-black text-text-primary mb-2 uppercase tracking-wide">ESTABLISH CUSTOM VECTOR</h2>
                  <p className="text-text-secondary text-sm mb-0 font-medium">
                    Route through your own domain name (e.g., www.yourconstruct.com) for a professional presence. 
                    Available on RESONANCE and NEXUS tiers.
                  </p>
                </div>
                <Link 
                  href="/pricing"
                  className="bg-background text-text-primary px-8 py-4 rounded-xl font-black hover:bg-white/5 border border-border transition-all flex items-center gap-2 whitespace-nowrap uppercase tracking-widest text-sm"
                >
                  UPGRADE TO ROUTE <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Infrastructure Info */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4 p-4 bg-surface/50 backdrop-blur-xl rounded-2xl border border-border hover:border-[var(--accent-primary)]/30 transition-colors">
              <Hexagon className="w-5 h-5 text-[var(--accent-primary)]" />
              <div className="text-xs">
                <p className="font-black text-text-primary uppercase tracking-widest">GLOBAL CDN</p>
                <p className="text-text-secondary font-medium">Instantaneous propagation</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-surface/50 backdrop-blur-xl rounded-2xl border border-border hover:border-[var(--accent-secondary)]/30 transition-colors">
              <Shield className="w-5 h-5 text-[var(--accent-secondary)]" />
              <div className="text-xs">
                <p className="font-black text-text-primary uppercase tracking-widest">ENCRYPTED</p>
                <p className="text-text-secondary font-medium">Secure by default</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-surface/50 backdrop-blur-xl rounded-2xl border border-border hover:border-white/20 transition-colors">
              <Server className="w-5 h-5 text-text-primary" />
              <div className="text-xs">
                <p className="font-black text-text-primary uppercase tracking-widest">99.9% UPTIME</p>
                <p className="text-text-secondary font-medium">Unwavering stability</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

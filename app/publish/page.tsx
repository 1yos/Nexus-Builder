'use client';

import DashboardSidebar from '@/components/dashboard/Sidebar';
import { Globe, Download, Link as LinkIcon, Check, ArrowRight, Zap, Shield, Server } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { useBuilderStore } from '@/store/useBuilderStore';
import { generateSiteCode } from '@/lib/codegen';
import JSZip from 'jszip';

export default function PublishPage() {
  const { pages, folders } = useBuilderStore();
  const [isPublishing, setIsPublishing] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState<'html' | 'react'>('html');
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
      setExportError('No pages to export. Please build something first!');
      return;
    }

    setIsExporting(true);
    setDownloadUrl(null);
    setExportError(null);
    try {
      const zip = new JSZip();
      const siteCode = generateSiteCode(pages, folders, exportFormat);

      Object.entries(siteCode).forEach(([filename, content]) => {
        zip.file(filename, content);
      });

      const blob = await zip.generateAsync({ type: 'blob' });
      
      const url = URL.createObjectURL(blob);
      const filename = `nexus-site-${exportFormat}-export.zip`;
      
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
      setExportError('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-zinc-50">
      <DashboardSidebar />
      
      <main className="flex-grow p-8">
        <div className="max-w-4xl mx-auto">
          <header className="mb-10">
            <h1 className="text-3xl font-bold text-zinc-900">Publish & Export</h1>
            <p className="text-zinc-500">Launch your site to the world or download the source code.</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Publish to Subdomain */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-zinc-200 p-8 flex flex-col"
            >
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-6">
                <Globe className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-zinc-900 mb-2">Publish to Nexus</h2>
              <p className="text-zinc-500 text-sm mb-8 flex-grow">
                Launch your site instantly on a free Nexus subdomain. 
                Includes free SSL and global CDN.
              </p>
              
              <div className="bg-zinc-50 p-4 rounded-xl mb-8 border border-zinc-100">
                <div className="flex items-center gap-2 text-sm font-medium text-zinc-600">
                  <span className="text-zinc-400">URL:</span>
                  <span className="text-blue-600">my-awesome-startup.nexus.site</span>
                </div>
              </div>

              <button 
                onClick={handlePublish}
                disabled={isPublishing || isPublished}
                className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                  isPublished 
                    ? 'bg-green-50 text-green-600 border border-green-100' 
                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200'
                }`}
              >
                {isPublishing ? 'Publishing...' : isPublished ? <><Check className="w-5 h-5" /> Published</> : 'Publish Now'}
              </button>
            </motion.div>

            {/* Export Code */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl border border-zinc-200 p-8 flex flex-col"
            >
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 mb-6">
                <Download className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-zinc-900 mb-2">Export Source Code</h2>
              <p className="text-zinc-500 text-sm mb-8 flex-grow">
                Download a clean, production-ready bundle of HTML, CSS, and JavaScript. 
                Host it anywhere you like.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-xs text-zinc-500">
                  <Check className="w-4 h-4 text-green-500" /> Optimized Assets
                </div>
                <div className="flex items-center gap-3 text-xs text-zinc-500">
                  <Check className="w-4 h-4 text-green-500" /> Clean Code Structure
                </div>
                <div className="flex items-center gap-3 text-xs text-zinc-500">
                  <Check className="w-4 h-4 text-green-500" /> No Dependencies
                </div>
              </div>

              <div className="mb-6">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3 block">Export Format</label>
                <div className="grid grid-cols-2 gap-2 bg-zinc-100 p-1 rounded-xl">
                  <button 
                    onClick={() => setExportFormat('html')}
                    className={`py-2 rounded-lg text-xs font-bold transition-all ${exportFormat === 'html' ? 'bg-white shadow-sm text-blue-600' : 'text-zinc-500 hover:text-zinc-900'}`}
                  >
                    HTML/CSS
                  </button>
                  <button 
                    onClick={() => setExportFormat('react')}
                    className={`py-2 rounded-lg text-xs font-bold transition-all ${exportFormat === 'react' ? 'bg-white shadow-sm text-blue-600' : 'text-zinc-500 hover:text-zinc-900'}`}
                  >
                    React (TSX)
                  </button>
                </div>
              </div>

              {isInIframe && (
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-xs text-yellow-800">
                  <p className="font-bold mb-1">Preview Environment Notice</p>
                  <p>Downloads may be blocked in this preview. If the download doesn&apos;t start automatically, use the link below or open the app in a new tab.</p>
                </div>
              )}

              {exportError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800">
                  <p className="font-bold mb-1">Error</p>
                  <p>{exportError}</p>
                </div>
              )}

              <button 
                onClick={handleExport}
                disabled={isExporting}
                className="w-full bg-zinc-900 text-white py-4 rounded-xl font-bold hover:bg-zinc-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mb-4"
              >
                {isExporting ? 'Preparing Export...' : <><Download className="w-5 h-5" /> Generate ZIP</>}
              </button>

              {downloadUrl && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-green-50 border border-green-200 rounded-xl flex flex-col items-center justify-center text-center gap-3"
                >
                  <div className="text-sm font-bold text-green-800">Export Ready!</div>
                  <a 
                    href={downloadUrl} 
                    download={downloadName}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-green-700 transition-all shadow-sm"
                  >
                    Click Here to Download
                  </a>
                </motion.div>
              )}
            </motion.div>

            {/* Custom Domain */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl border border-zinc-200 p-8 md:col-span-2"
            >
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 flex-shrink-0">
                  <LinkIcon className="w-8 h-8" />
                </div>
                <div className="flex-grow">
                  <h2 className="text-xl font-bold text-zinc-900 mb-2">Connect Custom Domain</h2>
                  <p className="text-zinc-500 text-sm mb-0">
                    Use your own domain name (e.g., www.yourstartup.com) to give your site a professional look. 
                    Available on Pro and Team plans.
                  </p>
                </div>
                <Link 
                  href="/pricing"
                  className="bg-blue-50 text-blue-600 px-8 py-4 rounded-xl font-bold hover:bg-blue-100 transition-all flex items-center gap-2 whitespace-nowrap"
                >
                  Upgrade to Connect <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Infrastructure Info */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4 p-4 bg-zinc-100/50 rounded-2xl border border-zinc-100">
              <Zap className="w-5 h-5 text-yellow-600" />
              <div className="text-xs">
                <p className="font-bold text-zinc-900">Global CDN</p>
                <p className="text-zinc-500">Lightning fast loading</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-zinc-100/50 rounded-2xl border border-zinc-100">
              <Shield className="w-5 h-5 text-green-600" />
              <div className="text-xs">
                <p className="font-bold text-zinc-900">Free SSL</p>
                <p className="text-zinc-500">Secure by default</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-zinc-100/50 rounded-2xl border border-zinc-100">
              <Server className="w-5 h-5 text-blue-600" />
              <div className="text-xs">
                <p className="font-bold text-zinc-900">99.9% Uptime</p>
                <p className="text-zinc-500">Reliable hosting</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

'use client';

import { useParams, useRouter } from 'next/navigation';
import { TEMPLATES } from '@/lib/templates';
import Link from 'next/link';
import { ChevronLeft, Monitor, Tablet, Smartphone, Zap } from 'lucide-react';
import { useState } from 'react';

export default function TemplatePreviewPage() {
  const params = useParams();
  const router = useRouter();
  const template = TEMPLATES.find(t => t.id === params.id);
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  if (!template) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50">
        <h1 className="text-2xl font-bold mb-4">Template not found</h1>
        <Link href="/templates" className="text-blue-600 hover:underline">Back to templates</Link>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-zinc-100 overflow-hidden">
      {/* Top Bar */}
      <header className="h-16 bg-white border-b border-zinc-200 flex items-center justify-between px-6 flex-shrink-0 z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="p-2 hover:bg-zinc-100 rounded-lg transition-colors text-zinc-600"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="h-6 w-px bg-zinc-200 mx-2" />
          <div>
            <h1 className="font-bold text-zinc-900">{template.name}</h1>
            <p className="text-xs text-zinc-500">{template.category}</p>
          </div>
        </div>

        {/* Device Switcher */}
        <div className="hidden md:flex items-center bg-zinc-100 p-1 rounded-xl gap-1">
          <button 
            onClick={() => setViewMode('desktop')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'desktop' ? 'bg-white shadow-sm text-blue-600' : 'text-zinc-500 hover:text-zinc-900'}`}
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setViewMode('tablet')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'tablet' ? 'bg-white shadow-sm text-blue-600' : 'text-zinc-500 hover:text-zinc-900'}`}
          >
            <Tablet className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setViewMode('mobile')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'mobile' ? 'bg-white shadow-sm text-blue-600' : 'text-zinc-500 hover:text-zinc-900'}`}
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <Link 
            href={`/builder?template=${template.id}`}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Zap className="w-4 h-4 fill-current" /> Use Template
          </Link>
        </div>
      </header>

      {/* Preview Area */}
      <main className="flex-grow relative overflow-auto p-8 flex justify-center bg-zinc-200/50">
        <div 
          className={`bg-white shadow-2xl transition-all duration-500 overflow-hidden relative ${
            viewMode === 'desktop' ? 'w-full max-w-7xl' : 
            viewMode === 'tablet' ? 'w-[768px]' : 'w-[375px]'
          }`}
          style={{ minHeight: '100%' }}
        >
          {/* Iframe Mockup */}
          <div className="absolute inset-0">
            <iframe 
              src={`https://picsum.photos/seed/${template.id}/1920/1080`}
              className="w-full h-full border-none"
              title={template.name}
            />
          </div>
          
          {/* Overlay to prevent interaction if needed, or just let them scroll */}
          <div className="absolute inset-0 pointer-events-none" />
        </div>
      </main>

      {/* Sticky Mobile CTA */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-sm bg-white/90 backdrop-blur-md border border-zinc-200 p-4 rounded-2xl shadow-2xl flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Ready to build?</p>
          <p className="text-sm font-bold text-zinc-900">Start with this template</p>
        </div>
        <Link 
          href={`/builder?template=${template.id}`}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors"
        >
          Use Template
        </Link>
      </div>
    </div>
  );
}

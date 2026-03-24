'use client';

import React, { useState, useMemo } from 'react';
import { useBuilderStore } from '@/store/useBuilderStore';
import { Copy, Check, Code as CodeIcon, FileJson, FileCode } from 'lucide-react';
import { generateHTML, generateReact } from '@/lib/codegen';

export default function CodePanel() {
  const { pages, folders, activePageId, globalComponents } = useBuilderStore();
  const [activeTab, setActiveTab] = useState<'react' | 'html' | 'json'>('react');
  const [copied, setCopied] = useState(false);

  const currentPage = pages.find(p => p.id === activePageId);

  const code = useMemo(() => {
    if (!currentPage) return '';

    if (activeTab === 'json') return JSON.stringify(currentPage.elements, null, 2);
    if (activeTab === 'html') return generateHTML(currentPage.elements, pages, folders);
    return generateReact(currentPage.elements, pages, folders, globalComponents);
  }, [currentPage, activeTab, pages, folders, globalComponents]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950">
      <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CodeIcon className="w-4 h-4 text-accent-primary" />
          <h3 className="text-sm font-bold text-zinc-200">Live Code Mode</h3>
        </div>
        <button
          onClick={handleCopy}
          className="p-2 hover:bg-zinc-800 rounded-lg transition-all text-zinc-400 hover:text-white flex items-center gap-2 text-xs"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied!' : 'Copy Code'}
        </button>
      </div>

      <div className="flex p-2 gap-1 bg-zinc-900/50">
        <button
          onClick={() => setActiveTab('react')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-[10px] font-bold uppercase transition-all ${
            activeTab === 'react' ? 'bg-zinc-800 text-accent-primary' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <FileCode className="w-3 h-3" />
          React
        </button>
        <button
          onClick={() => setActiveTab('html')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-[10px] font-bold uppercase transition-all ${
            activeTab === 'html' ? 'bg-zinc-800 text-orange-400' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <CodeIcon className="w-3 h-3" />
          HTML
        </button>
        <button
          onClick={() => setActiveTab('json')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-[10px] font-bold uppercase transition-all ${
            activeTab === 'json' ? 'bg-zinc-800 text-accent-primary' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <FileJson className="w-3 h-3" />
          JSON
        </button>
      </div>

      <div className="flex-1 overflow-auto p-4 font-mono text-[11px] leading-relaxed text-zinc-400 selection:bg-accent-primary/30">
        <pre className="whitespace-pre-wrap">
          {code}
        </pre>
      </div>
    </div>
  );
}

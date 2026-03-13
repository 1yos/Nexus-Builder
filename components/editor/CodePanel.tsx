'use client';

import React, { useState, useMemo } from 'react';
import { useBuilderStore } from '@/store/useBuilderStore';
import { Copy, Check, Code as CodeIcon, FileJson, FileCode } from 'lucide-react';

export default function CodePanel() {
  const { pages, activePageId } = useBuilderStore();
  const [activeTab, setActiveTab] = useState<'react' | 'html' | 'json'>('react');
  const [copied, setCopied] = useState(false);

  const currentPage = pages.find(p => p.id === activePageId);

  const generateHTML = (elements: any[]): string => {
    return elements.map(el => {
      const styles = Object.entries(el.styles || {})
        .map(([k, v]) => `${k.replace(/[A-Z]/g, m => "-" + m.toLowerCase())}: ${v}`)
        .join('; ');
      
      const children = el.children ? generateHTML(el.children) : (el.props.text || '');
      
      return `<div style="${styles}">${children}</div>`;
    }).join('\n');
  };

  const generateReact = (elements: any[]): string => {
    const renderElement = (el: any, indent = 2): string => {
      const spaces = ' '.repeat(indent);
      const props = Object.entries(el.props || {})
        .filter(([k]) => k !== 'text')
        .map(([k, v]) => `${k}="${v}"`)
        .join(' ');
      
      const styleObj = JSON.stringify(el.styles || {}, null, 2).replace(/"([^"]+)":/g, '$1:');
      
      const children = el.children?.length 
        ? `\n${el.children.map((c: any) => renderElement(c, indent + 2)).join('\n')}\n${spaces}`
        : (el.props.text || '');

      return `${spaces}<${el.type} ${props} style={${styleObj}}>\n${spaces}  ${children}\n${spaces}</${el.type}>`;
    };

    return `import React from 'react';\n\nexport default function GeneratedPage() {\n  return (\n    <div className="min-h-screen bg-white">\n${elements.map(el => renderElement(el, 6)).join('\n')}\n    </div>\n  );\n}`;
  };

  const code = useMemo(() => {
    if (!currentPage) return '';
    if (activeTab === 'json') return JSON.stringify(currentPage.elements, null, 2);
    if (activeTab === 'html') return generateHTML(currentPage.elements);
    return generateReact(currentPage.elements);
  }, [currentPage, activeTab]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950">
      <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CodeIcon className="w-4 h-4 text-blue-400" />
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
            activeTab === 'react' ? 'bg-zinc-800 text-blue-400' : 'text-zinc-500 hover:text-zinc-300'
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
            activeTab === 'json' ? 'bg-zinc-800 text-purple-400' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <FileJson className="w-3 h-3" />
          JSON
        </button>
      </div>

      <div className="flex-1 overflow-auto p-4 font-mono text-[11px] leading-relaxed text-zinc-400 selection:bg-blue-500/30">
        <pre className="whitespace-pre-wrap">
          {code}
        </pre>
      </div>
    </div>
  );
}

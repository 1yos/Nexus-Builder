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
      
      let tag = 'div';
      const props: string[] = [];
      
      switch (el.type) {
        case 'heading':
          tag = `h${el.props.level || 1}`;
          break;
        case 'paragraph':
          tag = 'p';
          break;
        case 'button':
          tag = 'a';
          props.push(`href="${el.props.href || '#'}"`);
          break;
        case 'image':
          tag = 'img';
          props.push(`src="${el.props.src || ''}"`);
          props.push(`alt="${el.props.alt || ''}"`);
          break;
        case 'section':
          tag = 'section';
          break;
        case 'navbar':
          tag = 'nav';
          break;
        case 'footer':
          tag = 'footer';
          break;
      }
      
      const propsString = props.length > 0 ? ' ' + props.join(' ') : '';
      let children = el.children ? generateHTML(el.children) : (el.props.text || '');
      
      if (el.type === 'navbar') {
        const logo = el.props.logoType === 'image' 
          ? `<img src="${el.props.logoSrc}" alt="Logo" style="height: 32px;" />`
          : `<div style="font-weight: bold; font-size: 1.25rem;">${el.props.logoText || 'Nexus'}</div>`;
        
        const links = (el.props.links || []).map((link: any) => 
          `<a href="${link.href}" style="margin-left: 1.5rem; text-decoration: none; color: inherit;">${link.label}</a>`
        ).join('');
        
        children = `<div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">${logo}<div style="display: flex;">${links}</div></div>`;
      } else if (el.type === 'footer') {
        children = `<div>${el.props.copyright || ''}</div>`;
      }
      
      if (el.type === 'image') {
        return `<${tag} style="${styles}"${propsString} />`;
      }
      
      return `<${tag} style="${styles}"${propsString}>${children}</${tag}>`;
    }).join('\n');
  };

  const generateReact = (elements: any[]): string => {
    const renderElement = (el: any, indent = 2): string => {
      const spaces = ' '.repeat(indent);
      
      let tag = el.type;
      const props: string[] = [];
      
      switch (el.type) {
        case 'heading':
          tag = `h${el.props.level || 1}`;
          break;
        case 'paragraph':
          tag = 'p';
          break;
        case 'button':
          tag = 'a';
          props.push(`href="${el.props.href || '#'}"`);
          break;
        case 'image':
          tag = 'img';
          props.push(`src="${el.props.src || ''}"`);
          props.push(`alt="${el.props.alt || ''}"`);
          break;
        case 'section':
          tag = 'section';
          break;
        case 'navbar':
          tag = 'nav';
          break;
        case 'footer':
          tag = 'footer';
          break;
      }

      const otherProps = Object.entries(el.props || {})
        .filter(([k]) => !['text', 'level', 'href', 'src', 'alt', 'links', 'logoText', 'logoSrc', 'logoType', 'copyright'].includes(k))
        .map(([k, v]) => `${k}={${JSON.stringify(v)}}`)
        .join(' ');
      
      if (otherProps) props.push(otherProps);
      
      const propsString = props.length > 0 ? ' ' + props.join(' ') : '';
      const styleObj = JSON.stringify(el.styles || {}, null, 2)
        .replace(/"([^"]+)":/g, '$1:')
        .split('\n')
        .map((line, i) => i === 0 ? line : spaces + '    ' + line)
        .join('\n');
      
      let children = el.children?.length 
        ? `\n${el.children.map((c: any) => renderElement(c, indent + 2)).join('\n')}\n${spaces}`
        : (el.props.text || '');

      if (el.type === 'navbar') {
        const logo = el.props.logoType === 'image' 
          ? `<img src="${el.props.logoSrc}" alt="Logo" style={{ height: '32px' }} />`
          : `<div style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>{${JSON.stringify(el.props.logoText || 'Nexus')}}</div>`;
        
        const links = (el.props.links || []).map((link: any) => 
          `<a href="${link.href}" style={{ marginLeft: '1.5rem', textDecoration: 'none', color: 'inherit' }}>{${JSON.stringify(link.label)}}</a>`
        ).join('\n' + spaces + '          ');
        
        children = `\n${spaces}  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>\n${spaces}    ${logo}\n${spaces}    <div style={{ display: 'flex' }}>\n${spaces}      ${links}\n${spaces}    </div>\n${spaces}  </div>\n${spaces}`;
      } else if (el.type === 'footer') {
        children = `\n${spaces}  <div>{${JSON.stringify(el.props.copyright || '')}}</div>\n${spaces}`;
      }

      if (el.type === 'image') {
        return `${spaces}<${tag}${propsString} style={${styleObj}} />`;
      }

      return `${spaces}<${tag}${propsString} style={${styleObj}}>\n${spaces}  ${children}\n${spaces}</${tag}>`;
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

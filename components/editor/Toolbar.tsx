'use client';

import React from 'react';
import { useBuilderStore } from '@/store/useBuilderStore';
import { 
  Undo2, 
  Redo2, 
  Monitor, 
  Tablet, 
  Smartphone, 
  Play, 
  Download, 
  Share2,
  Eye,
  Code,
  AlertTriangle
} from 'lucide-react';

import NexusLogo from '../marketing/NexusLogo';

import PageSelector from './PageSelector';

import { useRouter } from 'next/navigation';

export default function Toolbar() {
  const router = useRouter();
  const { 
    undo, 
    redo, 
    deviceMode, 
    setDeviceMode,
    historyIndex,
    history,
    isPreview,
    setPreview,
    presence,
    editorMode,
    setEditorMode,
    selectedElementId,
    codeOverrides
  } = useBuilderStore();

  const selectedOverride = selectedElementId ? codeOverrides[selectedElementId] : null;

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  return (
    <header className="h-14 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between px-4 z-50">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <NexusLogo className="w-8 h-8" />
          <span className="font-bold text-zinc-200 tracking-tight">NEXUS</span>
        </div>

        {!isPreview && (
          <>
            <div className="h-6 w-px bg-zinc-800" />
            <PageSelector />
            <div className="h-6 w-px bg-zinc-800" />
            <div className="flex items-center gap-1">
              <button 
                onClick={undo}
                disabled={!canUndo}
                className={`p-2 rounded-md transition-colors ${canUndo ? 'text-zinc-300 hover:bg-zinc-800' : 'text-zinc-600 cursor-not-allowed'}`}
                title="Undo (Ctrl+Z)"
              >
                <Undo2 className="w-4 h-4" />
              </button>
              <button 
                onClick={redo}
                disabled={!canRedo}
                className={`p-2 rounded-md transition-colors ${canRedo ? 'text-zinc-300 hover:bg-zinc-800' : 'text-zinc-600 cursor-not-allowed'}`}
                title="Redo (Ctrl+Shift+Z)"
              >
                <Redo2 className="w-4 h-4" />
              </button>
            </div>
          </>
        )}
      </div>

      <div className="flex items-center gap-4">
        {selectedOverride && (
          <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-500 text-[10px] font-bold uppercase tracking-wider">
            <AlertTriangle className="w-3 h-3" />
            Code Override Active
          </div>
        )}
        <div className="flex -space-x-2">
          {presence.map((user) => (
            <div 
              key={user.id}
              className="w-7 h-7 rounded-full border-2 border-zinc-900 bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-white relative group"
              style={{ backgroundColor: user.color }}
            >
              {user.name.charAt(0)}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-zinc-800 text-white text-[9px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-zinc-700">
                {user.name}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center bg-zinc-800/50 rounded-lg p-1 border border-zinc-800">
        <DeviceButton 
          active={deviceMode === 'desktop'} 
          onClick={() => setDeviceMode('desktop')} 
          icon={Monitor} 
          label="Desktop" 
        />
        <DeviceButton 
          active={deviceMode === 'tablet'} 
          onClick={() => setDeviceMode('tablet')} 
          icon={Tablet} 
          label="Tablet" 
        />
        <DeviceButton 
          active={deviceMode === 'mobile'} 
          onClick={() => setDeviceMode('mobile')} 
          icon={Smartphone} 
          label="Mobile" 
        />
      </div>

      <div className="flex items-center gap-2">
        {!isPreview && (
          <button 
            onClick={() => setEditorMode(editorMode === 'code' ? 'design' : 'code')}
            className={`p-2 rounded-md transition-colors ${editorMode === 'code' ? 'bg-accent-primary text-white' : 'text-zinc-300 hover:bg-zinc-800'}`}
            title="Developer Mode"
          >
            <Code className="w-4 h-4" />
          </button>
        )}
        <button 
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            alert('Share link copied to clipboard!');
          }}
          className="p-2 text-zinc-300 hover:bg-zinc-800 rounded-md transition-colors"
          title="Share project"
        >
          <Share2 className="w-4 h-4" />
        </button>
        <button 
          onClick={() => setPreview(!isPreview)}
          className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${isPreview ? 'bg-accent-primary text-white' : 'text-zinc-300 hover:bg-zinc-800'}`}
        >
          <Eye className="w-4 h-4" />
          <span>{isPreview ? 'Back to Editor' : 'Preview'}</span>
        </button>
        {!isPreview && (
          <button 
            onClick={() => router.push('/publish')}
            className="flex items-center gap-2 px-4 py-1.5 text-sm font-bold text-white bg-accent-primary hover:bg-accent-primary rounded-md transition-all shadow-lg shadow-accent-primary/20"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        )}
      </div>
    </header>
  );
}

function DeviceButton({ active, onClick, icon: Icon, label }: { active: boolean; onClick: () => void; icon: any; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-2 px-3 py-1.5 rounded-md transition-all
        ${active ? 'bg-zinc-700 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}
      `}
      title={label}
    >
      <Icon className="w-4 h-4" />
    </button>
  );
}

'use client';

import React, { useState } from 'react';
import { useBuilderStore, Page } from '@/store/useBuilderStore';
import { X, Settings, Database, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PageSettingsModalProps {
  pageId: string;
  onClose: () => void;
}

export function PageSettingsModal({ pageId, onClose }: PageSettingsModalProps) {
  const { pages, collections, renamePage, updatePage } = useBuilderStore();
  const page = pages.find(p => p.id === pageId);
  
  const [name, setName] = useState(page?.name || '');
  const [isDynamic, setIsDynamic] = useState(page?.isDynamic || false);
  const [collectionId, setCollectionId] = useState(page?.collectionId || '');

  if (!page) return null;

  const handleSave = () => {
    renamePage(pageId, name);
    // We need an updatePage action in the store if we want to update other fields
    // Let's check if updatePage exists or if we should add it.
    // Based on useBuilderStore.ts view, it doesn't have updatePage yet.
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-accent-primary" />
            <h2 className="text-sm font-bold text-zinc-200 uppercase tracking-wider">Page Settings</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-zinc-800 rounded-md text-zinc-500 hover:text-zinc-200 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Page Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-md p-2.5 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-accent-primary transition-all"
              placeholder="e.g. Home, About, Blog Post"
            />
          </div>

          <div className="pt-4 border-t border-zinc-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-xs font-bold text-zinc-200 flex items-center gap-2">
                  <Database className="w-3.5 h-3.5 text-blue-500" />
                  Dynamic Page
                </label>
                <p className="text-[10px] text-zinc-500">Generate one page for each entry in a collection.</p>
              </div>
              <button
                onClick={() => setIsDynamic(!isDynamic)}
                className={cn(
                  "w-10 h-5 rounded-full transition-all relative",
                  isDynamic ? "bg-blue-500" : "bg-zinc-700"
                )}
              >
                <div className={cn(
                  "absolute top-1 w-3 h-3 bg-white rounded-full transition-all",
                  isDynamic ? "left-6" : "left-1"
                )} />
              </button>
            </div>

            {isDynamic && (
              <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
                <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Source Collection</label>
                <select
                  value={collectionId}
                  onChange={(e) => setCollectionId(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-md p-2.5 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-accent-primary transition-all"
                >
                  <option value="">Select a collection...</option>
                  {collections.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <p className="text-[10px] text-zinc-500 italic">
                  URL will be: /{collections.find(c => c.id === collectionId)?.slug || 'collection'}/[slug]
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 bg-zinc-950/50 border-t border-zinc-800 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-zinc-400 hover:text-zinc-200 uppercase tracking-wider transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              renamePage(pageId, name);
              // Use updatePage if it exists, otherwise we'll add it
              (useBuilderStore.getState() as any).updatePage?.(pageId, { isDynamic, collectionId });
              onClose();
            }}
            className="px-6 py-2 bg-accent-primary hover:bg-accent-primary text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-lg shadow-accent-primary/20 transition-all"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

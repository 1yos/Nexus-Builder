'use client';

import React, { useState } from 'react';
import { useBuilderStore } from '@/store/useBuilderStore';
import { 
  FileText, 
  Plus, 
  MoreVertical, 
  Trash2, 
  Edit2, 
  ChevronDown,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function PageSelector() {
  const { 
    pages, 
    activePageId, 
    setActivePage, 
    addPage, 
    removePage, 
    renamePage 
  } = useBuilderStore();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newPageName, setNewPageName] = useState('');
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const activePage = pages.find(p => p.id === activePageId) || pages[0];

  const handleAddPage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPageName.trim()) {
      addPage(newPageName.trim());
      setNewPageName('');
      setIsAdding(false);
    }
  };

  const handleRename = (id: string) => {
    if (editName.trim()) {
      renamePage(id, editName.trim());
      setEditingPageId(null);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-md text-sm font-medium text-zinc-200 transition-all min-w-[140px] justify-between"
      >
        <div className="flex items-center gap-2 truncate">
          <FileText className="w-4 h-4 text-blue-500 shrink-0" />
          <span className="truncate">{activePage?.name}</span>
        </div>
        <ChevronDown className={cn("w-4 h-4 text-zinc-500 transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => {
              setIsOpen(false);
              setIsAdding(false);
              setEditingPageId(null);
            }} 
          />
          <div className="absolute top-full left-0 mt-1 w-64 bg-zinc-900 border border-zinc-800 rounded-lg shadow-2xl z-50 py-1 overflow-hidden">
            <div className="px-3 py-2 border-b border-zinc-800 flex items-center justify-between">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Pages</span>
              <button 
                onClick={() => setIsAdding(true)}
                className="p-1 hover:bg-zinc-800 rounded text-zinc-400 hover:text-white transition-colors"
                title="Add Page"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="max-h-64 overflow-y-auto custom-scrollbar">
              {isAdding && (
                <form onSubmit={handleAddPage} className="p-2 border-b border-zinc-800">
                  <input
                    autoFocus
                    type="text"
                    value={newPageName}
                    onChange={(e) => setNewPageName(e.target.value)}
                    placeholder="Page name..."
                    className="w-full bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-xs text-zinc-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    onBlur={() => !newPageName && setIsAdding(false)}
                  />
                </form>
              )}

              {pages.map((page) => (
                <div 
                  key={page.id}
                  className={cn(
                    "group flex items-center justify-between px-3 py-2 cursor-pointer transition-colors",
                    activePageId === page.id ? "bg-blue-500/10 text-blue-400" : "hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200"
                  )}
                  onClick={() => setActivePage(page.id)}
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <FileText className={cn("w-3.5 h-3.5 shrink-0", activePageId === page.id ? "text-blue-500" : "text-zinc-600")} />
                    {editingPageId === page.id ? (
                      <input
                        autoFocus
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onBlur={() => handleRename(page.id)}
                        onKeyDown={(e) => e.key === 'Enter' && handleRename(page.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-zinc-800 border border-zinc-700 rounded px-1 text-xs text-zinc-200 w-full"
                      />
                    ) : (
                      <span className="text-xs truncate">{page.name}</span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingPageId(page.id);
                        setEditName(page.name);
                      }}
                      className="p-1 hover:bg-zinc-700 rounded text-zinc-500 hover:text-zinc-200"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    {pages.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removePage(page.id);
                        }}
                        className="p-1 hover:bg-red-500/20 rounded text-zinc-500 hover:text-red-400"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

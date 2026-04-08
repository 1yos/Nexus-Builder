'use client';

import React from 'react';
import { useBuilderStore, DesignToken } from '@/store/useBuilderStore';
import { 
  Palette, 
  Type, 
  Square, 
  Circle, 
  Plus, 
  Trash2, 
  Settings2,
  ChevronRight,
  Layout
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { v4 as uuidv4 } from 'uuid';

export default function ThemePanel() {
  const { tokens, addToken, updateToken, removeToken } = useBuilderStore();

  const tokenTypes = [
    { id: 'color', label: 'Colors', icon: Palette },
    { id: 'typography', label: 'Typography', icon: Type },
    { id: 'spacing', label: 'Spacing', icon: Layout },
    { id: 'radius', label: 'Radius', icon: Circle },
  ];

  const handleAddToken = (type: DesignToken['type']) => {
    const name = prompt(`Enter name for new ${type} token:`, `New ${type}`);
    if (!name) return;

    const defaultValue = type === 'color' ? '#3B82F6' : type === 'spacing' ? '1rem' : type === 'radius' ? '0.5rem' : '1rem';
    
    addToken({
      id: uuidv4(),
      name,
      type,
      value: defaultValue,
      ...(type === 'typography' ? {
        fontSize: '1rem',
        fontWeight: '400',
        fontFamily: 'Inter'
      } : {})
    });
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-zinc-900 overflow-hidden">
      <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-accent-primary" />
          <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-200">Design Tokens</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-8 custom-scrollbar">
        {tokenTypes.map((tokenType) => {
          const typeTokens = tokens.filter(t => t.type === tokenType.id);
          const Icon = tokenType.icon;

          return (
            <div key={tokenType.id} className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className="w-3.5 h-3.5 text-zinc-500" />
                  <h3 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">{tokenType.label}</h3>
                </div>
                <button 
                  onClick={() => handleAddToken(tokenType.id as any)}
                  className="p-1 hover:bg-zinc-800 rounded text-zinc-500 hover:text-accent-primary transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid gap-2">
                {typeTokens.map((token) => (
                  <div 
                    key={token.id}
                    className="group bg-zinc-800/50 border border-zinc-800 hover:border-zinc-700 rounded-xl p-3 transition-all"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <input 
                        type="text"
                        value={token.name}
                        onChange={(e) => updateToken(token.id, { name: e.target.value })}
                        className="bg-transparent border-none outline-none text-xs font-medium text-zinc-200 w-full"
                      />
                      <button 
                        onClick={() => removeToken(token.id)}
                        className="p-1 opacity-0 group-hover:opacity-100 hover:bg-red-500/10 text-zinc-600 hover:text-red-500 rounded transition-all"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>

                    {token.type === 'color' && (
                      <div className="flex items-center gap-3">
                        <div className="relative w-8 h-8 rounded-lg border border-zinc-700 overflow-hidden shrink-0">
                          <input 
                            type="color"
                            value={token.value}
                            onChange={(e) => updateToken(token.id, { value: e.target.value })}
                            className="absolute inset-0 w-[150%] h-[150%] -translate-x-1/4 -translate-y-1/4 cursor-pointer"
                          />
                        </div>
                        <input 
                          type="text"
                          value={token.value}
                          onChange={(e) => updateToken(token.id, { value: e.target.value })}
                          className="flex-1 bg-zinc-900/50 border border-zinc-700 rounded-md px-2 py-1.5 text-[10px] text-zinc-400 font-mono"
                        />
                      </div>
                    )}

                    {token.type === 'typography' && (
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <label className="text-[8px] text-zinc-600 uppercase font-bold">Size</label>
                            <input 
                              type="text"
                              value={token.fontSize}
                              onChange={(e) => updateToken(token.id, { fontSize: e.target.value })}
                              className="w-full bg-zinc-900/50 border border-zinc-700 rounded-md px-2 py-1 text-[10px] text-zinc-400"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[8px] text-zinc-600 uppercase font-bold">Weight</label>
                            <select 
                              value={token.fontWeight}
                              onChange={(e) => updateToken(token.id, { fontWeight: e.target.value })}
                              className="w-full bg-zinc-900/50 border border-zinc-700 rounded-md px-2 py-1 text-[10px] text-zinc-400"
                            >
                              <option value="300">Light</option>
                              <option value="400">Regular</option>
                              <option value="500">Medium</option>
                              <option value="600">SemiBold</option>
                              <option value="700">Bold</option>
                            </select>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[8px] text-zinc-600 uppercase font-bold">Family</label>
                          <input 
                            type="text"
                            value={token.fontFamily}
                            onChange={(e) => updateToken(token.id, { fontFamily: e.target.value })}
                            className="w-full bg-zinc-900/50 border border-zinc-700 rounded-md px-2 py-1 text-[10px] text-zinc-400"
                          />
                        </div>
                      </div>
                    )}

                    {(token.type === 'spacing' || token.type === 'radius') && (
                      <input 
                        type="text"
                        value={token.value}
                        onChange={(e) => updateToken(token.id, { value: e.target.value })}
                        className="w-full bg-zinc-900/50 border border-zinc-700 rounded-md px-2 py-1.5 text-[10px] text-zinc-400 font-mono"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

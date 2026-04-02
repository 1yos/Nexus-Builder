import React, { useState, useEffect } from 'react';
import { useBuilderStore } from '@/store/useBuilderStore';
import { TokenSelector } from './TokenSelector';

interface StyleInputProps {
  label: string;
  type: 'color' | 'font' | 'spacing' | 'radius' | 'typography';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isOverridden?: boolean;
  onClearOverride?: () => void;
}

export function StyleInput({ 
  label, 
  type, 
  value, 
  onChange, 
  placeholder,
  isOverridden,
  onClearOverride
}: StyleInputProps) {
  const { tokens } = useBuilderStore();
  const filteredTokens = tokens.filter(t => t.type === type);
  const isToken = value?.startsWith('var(--token-');
  
  // Resolve actual value for color picker if it's a token
  const resolvedValue = isToken 
    ? tokens.find(t => `var(--token-${t.id})` === value)?.value || value
    : value;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider flex items-center gap-1.5">
          {label}
          {isOverridden && (
            <span className="w-1 h-1 rounded-full bg-accent-primary animate-pulse" title="Overridden for this device" />
          )}
        </label>
        {isOverridden && onClearOverride && (
          <button 
            onClick={onClearOverride}
            className="text-[9px] text-accent-primary hover:underline font-bold uppercase tracking-tighter"
          >
            Reset
          </button>
        )}
      </div>
      <div className="flex flex-col gap-2">
        {filteredTokens.length > 0 && (
          <TokenSelector
            type={type}
            value={value || ''}
            onChange={(newValue) => {
              if (newValue) {
                onChange(newValue);
              } else {
                // If "Custom..." is selected, revert to resolved value or empty
                onChange(resolvedValue || '');
              }
            }}
          />
        )}
        
        {!isToken && (
          <div className="flex gap-2">
            {type === 'color' && (
              <div className="relative w-8 h-8 rounded-md border border-zinc-700 overflow-hidden shrink-0">
                <input
                  type="color"
                  value={value || '#000000'}
                  onChange={(e) => onChange(e.target.value)}
                  className="absolute inset-0 w-[150%] h-[150%] -translate-x-1/4 -translate-y-1/4 cursor-pointer"
                />
              </div>
            )}
            <input
              type={type === 'color' ? 'text' : 'text'}
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              className="flex-1 w-full bg-zinc-800 border border-zinc-700 rounded-md p-2 text-xs text-zinc-200 font-mono"
              placeholder={placeholder}
            />
          </div>
        )}
      </div>
    </div>
  );
}

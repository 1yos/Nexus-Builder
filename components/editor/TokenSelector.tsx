import React from 'react';
import { useBuilderStore } from '@/store/useBuilderStore';
import { ChevronDown } from 'lucide-react';

interface TokenSelectorProps {
  type: 'color' | 'font' | 'spacing' | 'radius' | 'typography';
  value: string;
  onChange: (value: string) => void;
}

export function TokenSelector({ type, value, onChange }: TokenSelectorProps) {
  const { tokens } = useBuilderStore();
  const filteredTokens = tokens.filter(t => t.type === type);
  
  if (filteredTokens.length === 0) return null;

  const isToken = value?.startsWith('var(--token-');
  const tokenId = isToken ? value.replace('var(--token-', '').replace(')', '') : '';

  return (
    <div className="relative w-full">
      <select
        value={tokenId}
        onChange={(e) => {
          if (e.target.value) {
            onChange(`var(--token-${e.target.value})`);
          } else {
            onChange(''); // Let parent handle custom fallback
          }
        }}
        className="w-full bg-zinc-800 border border-zinc-700 rounded-md p-2 text-xs text-zinc-200 appearance-none pr-8"
      >
        <option value="">Custom...</option>
        {filteredTokens.map(token => (
          <option key={token.id} value={token.id}>
            {token.name}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500 pointer-events-none" />
    </div>
  );
}

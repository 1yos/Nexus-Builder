'use client';

import React from 'react';
import { useBuilderStore } from '@/store/useBuilderStore';
import { COMPONENT_REGISTRY } from '@/lib/registry';
import { useDraggable } from '@dnd-kit/core';
import { LucideIcon } from 'lucide-react';

export default function LeftPanel() {
  return (
    <aside className="w-72 bg-zinc-900 border-r border-zinc-800 flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-zinc-800">
        <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Components</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <ComponentGroup title="Basic" types={['heading', 'paragraph', 'button', 'image', 'icon', 'divider', 'spacer']} />
        <ComponentGroup title="Layout" types={['section', 'container', 'grid', 'flex']} />
        <ComponentGroup title="Advanced" types={['navbar', 'hero', 'card', 'footer']} />
      </div>
    </aside>
  );
}

function ComponentGroup({ title, types }: { title: string; types: string[] }) {
  return (
    <div>
      <h3 className="text-[10px] font-semibold text-zinc-600 uppercase mb-3 px-1">{title}</h3>
      <div className="grid grid-cols-2 gap-2">
        {types.map((type) => (
          <DraggableComponent key={type} type={type as any} />
        ))}
      </div>
    </div>
  );
}

function DraggableComponent({ type }: { type: keyof typeof COMPONENT_REGISTRY }) {
  const component = COMPONENT_REGISTRY[type];
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `library-${type}`,
    data: {
      type,
      isLibraryItem: true,
    },
  });

  const Icon = component.icon as LucideIcon;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`
        flex flex-col items-center justify-center p-3 rounded-lg border border-zinc-800 bg-zinc-800/50 
        hover:bg-zinc-800 hover:border-zinc-700 transition-all cursor-grab active:cursor-grabbing
        ${isDragging ? 'opacity-50 ring-2 ring-blue-500' : ''}
      `}
    >
      <Icon className="w-5 h-5 text-zinc-400 mb-2" />
      <span className="text-[11px] text-zinc-300 font-medium">{component.label}</span>
    </div>
  );
}

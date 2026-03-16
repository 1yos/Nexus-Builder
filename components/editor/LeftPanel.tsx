'use client';

import React from 'react';
import { useBuilderStore, ElementInstance } from '@/store/useBuilderStore';
import { COMPONENT_REGISTRY } from '@/lib/registry';
import { useDraggable } from '@dnd-kit/core';
import { LucideIcon, Layers, Box, Search, ChevronRight, ChevronDown, Eye, EyeOff, Trash2, Copy, Lock, Unlock, Image as ImageIcon, Code as CodeIcon, ChevronUp, ArrowUpToLine, ArrowDownToLine } from 'lucide-react';
import { cn } from '@/lib/utils';
import CodePanel from './CodePanel';

export default function LeftPanel() {
  const { leftPanelTab, setLeftPanelTab } = useBuilderStore();

  return (
    <aside className="w-72 bg-zinc-900 border-r border-zinc-800 flex flex-col h-full overflow-hidden">
      <div className="flex border-b border-zinc-800">
        <button
          onClick={() => setLeftPanelTab('components')}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3 text-[11px] font-bold uppercase tracking-wider transition-colors",
            leftPanelTab === 'components' ? "text-blue-500 border-b-2 border-blue-500 bg-blue-500/5" : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50"
          )}
        >
          <Box className="w-3.5 h-3.5" />
          Components
        </button>
        <button
          onClick={() => setLeftPanelTab('layers')}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3 text-[11px] font-bold uppercase tracking-wider transition-colors",
            leftPanelTab === 'layers' ? "text-blue-500 border-b-2 border-blue-500 bg-blue-500/5" : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50"
          )}
        >
          <Layers className="w-3.5 h-3.5" />
          Layers
        </button>
        <button
          onClick={() => setLeftPanelTab('code')}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3 text-[11px] font-bold uppercase tracking-wider transition-colors",
            leftPanelTab === 'code' ? "text-emerald-500 border-b-2 border-emerald-500 bg-emerald-500/5" : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50"
          )}
        >
          <CodeIcon className="w-3.5 h-3.5" />
          Code
        </button>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        {leftPanelTab === 'components' && <ComponentsTab />}
        {leftPanelTab === 'layers' && <LayersTab />}
        {leftPanelTab === 'code' && <CodePanel />}
      </div>
    </aside>
  );
}

function ComponentsTab() {
  const [search, setSearch] = React.useState('');

  return (
    <>
      <div className="p-4 border-b border-zinc-800">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
          <input
            type="text"
            placeholder="Search components..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-md py-1.5 pl-9 pr-3 text-xs text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
        <ComponentGroup title="Layout" types={['section', 'container', 'grid', 'flex']} search={search} />
        <ComponentGroup title="Basic" types={['heading', 'paragraph', 'button', 'image', 'icon', 'divider', 'spacer']} search={search} />
        <ComponentGroup title="Advanced" types={['navbar', 'hero', 'card', 'pricing', 'features', 'footer']} search={search} />
      </div>
    </>
  );
}

function ComponentGroup({ title, types, search }: { title: string; types: string[]; search: string }) {
  const filteredTypes = types.filter(type => 
    COMPONENT_REGISTRY[type as keyof typeof COMPONENT_REGISTRY].label.toLowerCase().includes(search.toLowerCase())
  );

  if (filteredTypes.length === 0) return null;

  return (
    <div>
      <h3 className="text-[10px] font-bold text-zinc-500 uppercase mb-3 px-1 tracking-wider">{title}</h3>
      <div className="grid grid-cols-2 gap-2">
        {filteredTypes.map((type) => (
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

  const renderPreview = () => {
    switch (type) {
      case 'section':
        return <div className="w-full h-12 bg-zinc-800 rounded border border-zinc-700 flex flex-col gap-1 p-1"><div className="w-full h-1 bg-zinc-700 rounded-full" /><div className="w-full h-full bg-zinc-700/30 rounded" /></div>;
      case 'container':
        return <div className="w-full h-12 flex items-center justify-center"><div className="w-3/4 h-8 border-2 border-dashed border-zinc-700 rounded" /></div>;
      case 'heading':
        return <div className="w-full h-12 flex flex-col justify-center gap-1"><div className="w-full h-2 bg-zinc-700 rounded-full" /><div className="w-2/3 h-2 bg-zinc-700 rounded-full opacity-50" /></div>;
      case 'paragraph':
        return <div className="w-full h-12 flex flex-col justify-center gap-1"><div className="w-full h-1 bg-zinc-700 rounded-full" /><div className="w-full h-1 bg-zinc-700 rounded-full" /><div className="w-2/3 h-1 bg-zinc-700 rounded-full" /></div>;
      case 'button':
        return <div className="w-full h-12 flex items-center justify-center"><div className="w-full h-6 bg-blue-500/20 border border-blue-500/50 rounded flex items-center justify-center"><div className="w-8 h-1 bg-blue-500/50 rounded-full" /></div></div>;
      case 'image':
        return <div className="w-full h-12 bg-zinc-800 rounded border border-zinc-700 flex items-center justify-center"><ImageIcon className="w-4 h-4 text-zinc-600" /></div>;
      case 'navbar':
        return <div className="w-full h-12 flex flex-col gap-1"><div className="w-full h-3 bg-zinc-800 border border-zinc-700 rounded flex items-center justify-between px-1"><div className="w-2 h-1 bg-zinc-600 rounded-full" /><div className="flex gap-0.5"><div className="w-1 h-0.5 bg-zinc-600 rounded-full" /><div className="w-1 h-0.5 bg-zinc-600 rounded-full" /></div></div><div className="flex-1 bg-zinc-800/20 rounded" /></div>;
      case 'hero':
        return <div className="w-full h-12 bg-zinc-800 rounded border border-zinc-700 flex flex-col items-center justify-center gap-1 p-2"><div className="w-2/3 h-1.5 bg-zinc-700 rounded-full" /><div className="w-1/2 h-1 bg-zinc-700 rounded-full opacity-50" /><div className="w-1/3 h-2 bg-blue-500/30 rounded mt-1" /></div>;
      case 'card':
        return <div className="w-full h-12 flex items-center justify-center"><div className="w-full h-10 bg-zinc-800 border border-zinc-700 rounded p-1 flex flex-col gap-1"><div className="w-full h-3 bg-zinc-700 rounded-sm" /><div className="w-2/3 h-1 bg-zinc-700 rounded-full" /></div></div>;
      case 'pricing':
        return <div className="w-full h-12 flex gap-1 p-1"><div className="flex-1 bg-zinc-800 border border-zinc-700 rounded flex flex-col items-center p-1 gap-1"><div className="w-full h-1 bg-zinc-700 rounded-full" /><div className="w-1/2 h-2 bg-blue-500/20 rounded" /></div><div className="flex-1 bg-zinc-800 border border-zinc-700 rounded flex flex-col items-center p-1 gap-1 scale-110 z-10 shadow-xl"><div className="w-full h-1 bg-zinc-700 rounded-full" /><div className="w-1/2 h-2 bg-blue-500/40 rounded" /></div><div className="flex-1 bg-zinc-800 border border-zinc-700 rounded flex flex-col items-center p-1 gap-1"><div className="w-full h-1 bg-zinc-700 rounded-full" /><div className="w-1/2 h-2 bg-blue-500/20 rounded" /></div></div>;
      case 'features':
        return <div className="w-full h-12 grid grid-cols-3 gap-1 p-1"><div className="bg-zinc-800 rounded border border-zinc-700" /><div className="bg-zinc-800 rounded border border-zinc-700" /><div className="bg-zinc-800 rounded border border-zinc-700" /><div className="bg-zinc-800 rounded border border-zinc-700" /><div className="bg-zinc-800 rounded border border-zinc-700" /><div className="bg-zinc-800 rounded border border-zinc-700" /></div>;
      default:
        return <div className="w-full h-12 flex items-center justify-center"><Icon className="w-5 h-5 text-zinc-600" /></div>;
    }
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={cn(
        "flex flex-col p-2 rounded-xl border border-zinc-800 bg-zinc-900/50",
        "hover:bg-zinc-800 hover:border-zinc-700 transition-all cursor-grab active:cursor-grabbing group",
        isDragging && "opacity-50 ring-2 ring-blue-500"
      )}
    >
      <div className="mb-2 overflow-hidden rounded-lg bg-zinc-950/50 group-hover:bg-zinc-950 transition-colors">
        {renderPreview()}
      </div>
      <div className="flex items-center gap-2 px-1">
        <Icon className="w-3 h-3 text-zinc-500 group-hover:text-blue-500 transition-colors" />
        <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider group-hover:text-zinc-200 transition-colors">{component.label}</span>
      </div>
    </div>
  );
}

function LayersTab() {
  const { elements } = useBuilderStore();

  return (
    <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
      {elements.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-zinc-600 p-8 text-center">
          <Layers className="w-8 h-8 mb-3 opacity-20" />
          <p className="text-xs">No elements on this page yet.</p>
        </div>
      ) : (
        <div className="space-y-0.5">
          {elements.map((element) => (
            <LayerItem key={element.id} element={element} depth={0} />
          ))}
        </div>
      )}
    </div>
  );
}

function LayerItem({ element, depth }: { element: ElementInstance; depth: number }) {
  const { 
    selectedElementId, 
    hoveredElementId,
    selectElement, 
    setHoveredElementId,
    removeElement, 
    updateElement, 
    duplicateElement,
    moveElement
  } = useBuilderStore();
  const [isExpanded, setIsExpanded] = React.useState(true);
  const [isEditing, setIsEditing] = React.useState(false);
  const [tempName, setTempName] = React.useState(element.name || COMPONENT_REGISTRY[element.type].label);
  
  const isSelected = selectedElementId === element.id;
  const isHovered = hoveredElementId === element.id;
  const component = COMPONENT_REGISTRY[element.type];
  const Icon = component.icon as LucideIcon;
  const hasChildren = element.children && element.children.length > 0;

  const handleRename = () => {
    updateElement(element.id, { name: tempName });
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col">
      <div
        onClick={() => !element.locked && selectElement(element.id)}
        onMouseEnter={() => setHoveredElementId(element.id)}
        onMouseLeave={() => setHoveredElementId(null)}
        onDoubleClick={() => setIsEditing(true)}
        className={cn(
          "group flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-all relative",
          isSelected ? "bg-blue-600/20 text-blue-400" : isHovered ? "bg-zinc-800/50 text-zinc-200" : "hover:bg-zinc-800/30 text-zinc-400 hover:text-zinc-200",
          element.locked && "opacity-60 cursor-not-allowed"
        )}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
      >
        {isSelected && <div className="absolute left-0 top-1 bottom-1 w-0.5 bg-blue-500 rounded-full" />}
        {isHovered && !isSelected && <div className="absolute left-0 top-1 bottom-1 w-0.5 bg-zinc-600 rounded-full" />}
        
        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          {hasChildren ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className="p-0.5 hover:bg-zinc-700 rounded transition-colors"
            >
              {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </button>
          ) : (
            <div className="w-4" />
          )}
          <Icon className={cn("w-3.5 h-3.5 flex-shrink-0", isSelected ? "text-blue-400" : "text-zinc-500")} />
          
          {isEditing ? (
            <input
              autoFocus
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onBlur={handleRename}
              onKeyDown={(e) => e.key === 'Enter' && handleRename()}
              className="bg-zinc-800 text-[11px] font-medium px-1 rounded border border-blue-500 focus:outline-none w-full"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span className="text-[11px] font-medium truncate">
              {element.name || component.label}
            </span>
          )}
        </div>

        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              moveElement(element.id, 'up');
            }}
            className="p-1 hover:bg-zinc-700 rounded transition-colors text-zinc-500 hover:text-zinc-200"
            title="Move Up"
          >
            <ChevronUp className="w-3 h-3" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              moveElement(element.id, 'down');
            }}
            className="p-1 hover:bg-zinc-700 rounded transition-colors text-zinc-500 hover:text-zinc-200"
            title="Move Down"
          >
            <ChevronDown className="w-3 h-3" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              moveElement(element.id, 'top');
            }}
            className="p-1 hover:bg-zinc-700 rounded transition-colors text-zinc-500 hover:text-zinc-200"
            title="Move to Top"
          >
            <ArrowUpToLine className="w-3 h-3" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              moveElement(element.id, 'bottom');
            }}
            className="p-1 hover:bg-zinc-700 rounded transition-colors text-zinc-500 hover:text-zinc-200"
            title="Move to Bottom"
          >
            <ArrowDownToLine className="w-3 h-3" />
          </button>
          <div className="w-px h-3 bg-zinc-700 mx-0.5" />
          <button
            onClick={(e) => {
              e.stopPropagation();
              duplicateElement(element.id);
            }}
            className="p-1 hover:bg-zinc-700 rounded transition-colors text-zinc-500 hover:text-zinc-200"
            title="Duplicate"
          >
            <Copy className="w-3 h-3" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              updateElement(element.id, { locked: !element.locked });
            }}
            className={cn(
              "p-1 hover:bg-zinc-700 rounded transition-colors",
              element.locked ? "text-amber-500 opacity-100" : "text-zinc-500 hover:text-zinc-200"
            )}
            title={element.locked ? "Unlock" : "Lock"}
          >
            {element.locked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              updateElement(element.id, { styles: { ...element.styles, display: element.styles.display === 'none' ? undefined : 'none' } });
            }}
            className="p-1 hover:bg-zinc-700 rounded transition-colors text-zinc-500 hover:text-zinc-200"
            title={element.styles.display === 'none' ? "Show" : "Hide"}
          >
            {element.styles.display === 'none' ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              removeElement(element.id);
            }}
            className="p-1 hover:bg-zinc-700 rounded hover:text-red-400 transition-colors text-zinc-500"
            title="Delete"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {hasChildren && isExpanded && (
        <div className="flex flex-col">
          {element.children!.map((child) => (
            <LayerItem key={child.id} element={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

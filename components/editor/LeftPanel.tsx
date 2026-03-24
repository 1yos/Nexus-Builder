'use client';

import React from 'react';
import { useBuilderStore, ElementInstance } from '@/store/useBuilderStore';
import { v4 as uuidv4 } from 'uuid';
import { COMPONENT_REGISTRY } from '@/lib/registry';
import { useDraggable } from '@dnd-kit/core';
import { LucideIcon, Layers, Box, Search, ChevronRight, ChevronDown, Eye, EyeOff, Trash2, Copy, Lock, Unlock, Image as ImageIcon, Code as CodeIcon, ChevronUp, ArrowUpToLine, ArrowDownToLine, ChevronLeft, Palette, Plus, Group, Maximize2, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import CodePanel from './CodePanel';

export default function LeftPanel() {
  const { leftPanelTab, setLeftPanelTab, leftPanelCollapsed, setLeftPanelCollapsed } = useBuilderStore();

  if (leftPanelCollapsed) {
    return (
      <aside className="w-12 bg-zinc-900 border-r border-zinc-800 flex flex-col items-center py-4 h-full">
        <button
          onClick={() => setLeftPanelCollapsed(false)}
          className="p-2 hover:bg-zinc-800 rounded-md text-zinc-400 hover:text-zinc-200 transition-colors"
          title="Expand Sidebar"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
        <div className="flex-1 flex flex-col gap-4 mt-8">
          <button
            onClick={() => { setLeftPanelTab('components'); setLeftPanelCollapsed(false); }}
            className={cn("p-2 rounded-md transition-colors", leftPanelTab === 'components' ? "text-accent-primary bg-accent-primary/10" : "text-zinc-500 hover:text-zinc-300")}
          >
            <Box className="w-5 h-5" />
          </button>
          <button
            onClick={() => { setLeftPanelTab('layers'); setLeftPanelCollapsed(false); }}
            className={cn("p-2 rounded-md transition-colors", leftPanelTab === 'layers' ? "text-accent-primary bg-accent-primary/10" : "text-zinc-500 hover:text-zinc-300")}
          >
            <Layers className="w-5 h-5" />
          </button>
          <button
            onClick={() => { setLeftPanelTab('code'); setLeftPanelCollapsed(false); }}
            className={cn("p-2 rounded-md transition-colors", leftPanelTab === 'code' ? "text-emerald-500 bg-emerald-500/10" : "text-zinc-500 hover:text-zinc-300")}
          >
            <CodeIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => { setLeftPanelTab('tokens'); setLeftPanelCollapsed(false); }}
            className={cn("p-2 rounded-md transition-colors", leftPanelTab === 'tokens' ? "text-amber-500 bg-amber-500/10" : "text-zinc-500 hover:text-zinc-300")}
          >
            <Palette className="w-5 h-5" />
          </button>
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-72 bg-zinc-900 border-r border-zinc-800 flex flex-col h-full overflow-hidden relative group/sidebar">
      <button
        onClick={() => setLeftPanelCollapsed(true)}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-1 bg-zinc-800 border border-zinc-700 rounded-md text-zinc-400 hover:text-zinc-200 opacity-0 group-hover/sidebar:opacity-100 transition-opacity"
        title="Collapse Sidebar"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      <div className="grid grid-cols-4 border-b border-zinc-800">
        <button
          onClick={() => setLeftPanelTab('components')}
          className={cn(
            "flex flex-col items-center justify-center gap-1 py-2 text-[9px] font-bold uppercase tracking-tighter transition-colors overflow-hidden",
            leftPanelTab === 'components' ? "text-accent-primary border-b-2 border-accent-primary bg-accent-primary/5" : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50"
          )}
        >
          <Box className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate w-full text-center px-1">Components</span>
        </button>
        <button
          onClick={() => setLeftPanelTab('layers')}
          className={cn(
            "flex flex-col items-center justify-center gap-1 py-2 text-[9px] font-bold uppercase tracking-tighter transition-colors overflow-hidden",
            leftPanelTab === 'layers' ? "text-accent-primary border-b-2 border-accent-primary bg-accent-primary/5" : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50"
          )}
        >
          <Layers className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate w-full text-center px-1">Layers</span>
        </button>
        <button
          onClick={() => setLeftPanelTab('code')}
          className={cn(
            "flex flex-col items-center justify-center gap-1 py-2 text-[9px] font-bold uppercase tracking-tighter transition-colors overflow-hidden",
            leftPanelTab === 'code' ? "text-emerald-500 border-b-2 border-emerald-500 bg-emerald-500/5" : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50"
          )}
        >
          <CodeIcon className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate w-full text-center px-1">Code</span>
        </button>
        <button
          onClick={() => setLeftPanelTab('tokens')}
          className={cn(
            "flex flex-col items-center justify-center gap-1 py-2 text-[9px] font-bold uppercase tracking-tighter transition-colors overflow-hidden",
            leftPanelTab === 'tokens' ? "text-amber-500 border-b-2 border-amber-500 bg-amber-500/5" : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50"
          )}
        >
          <Palette className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate w-full text-center px-1">Tokens</span>
        </button>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        {leftPanelTab === 'components' && <ComponentsTab />}
        {leftPanelTab === 'layers' && <LayersTab />}
        {leftPanelTab === 'code' && <CodePanel />}
        {leftPanelTab === 'tokens' && <TokensTab />}
      </div>
    </aside>
  );
}

function ComponentsTab() {
  const [search, setSearch] = React.useState('');
  const { globalComponents } = useBuilderStore();

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
            className="w-full bg-zinc-800 border border-zinc-700 rounded-md py-1.5 pl-9 pr-3 text-xs text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-accent-primary transition-all"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
        {Object.keys(globalComponents).length > 0 && (
          <GlobalComponentGroup search={search} />
        )}
        <ComponentGroup title="Layout" types={['section', 'container', 'grid', 'flex']} search={search} />
        <ComponentGroup title="Basic" types={['heading', 'paragraph', 'button', 'image', 'icon', 'divider', 'spacer']} search={search} />
        <ComponentGroup title="Advanced" types={['navbar', 'hero', 'card', 'pricing', 'features', 'footer']} search={search} />
      </div>
    </>
  );
}

function GlobalComponentGroup({ search }: { search: string }) {
  const { globalComponents } = useBuilderStore();
  
  const filteredComponents = Object.entries(globalComponents).filter(([id, component]) => 
    (component.name || `Global ${component.type}`).toLowerCase().includes(search.toLowerCase())
  );

  if (filteredComponents.length === 0) return null;

  return (
    <div>
      <h3 className="text-[10px] font-bold text-accent-primary uppercase mb-3 px-1 tracking-wider flex items-center gap-1">
        <Globe className="w-3 h-3" />
        Saved Components
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {filteredComponents.map(([id, component]) => (
          <DraggableGlobalComponent key={id} id={id} component={component} />
        ))}
      </div>
    </div>
  );
}

function DraggableGlobalComponent({ id, component }: { id: string, component: ElementInstance }) {
  const { renameGlobalComponent, deleteGlobalComponent } = useBuilderStore();
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `global-${id}`,
    data: {
      type: component.type,
      isGlobal: true,
      globalId: id,
      isLibraryItem: true,
    },
  });

  const Icon = COMPONENT_REGISTRY[component.type as keyof typeof COMPONENT_REGISTRY]?.icon as LucideIcon || Box;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={cn(
        "flex flex-col p-2 rounded-xl border border-accent-primary/30 bg-accent-primary/5",
        "hover:bg-accent-primary/10 hover:border-accent-primary/50 transition-all cursor-grab active:cursor-grabbing group relative",
        isDragging && "opacity-50 ring-2 ring-accent-primary"
      )}
    >
      <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <button
          onClick={(e) => {
            e.stopPropagation();
            const newName = prompt('Rename component:', component.name || `Global ${component.type}`);
            if (newName) renameGlobalComponent(id, newName);
          }}
          className="p-1 bg-zinc-800 hover:bg-zinc-700 rounded text-zinc-400 hover:text-white"
          title="Rename"
        >
          <CodeIcon className="w-3 h-3" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (confirm('Are you sure you want to delete this component?')) {
              deleteGlobalComponent(id);
            }
          }}
          className="p-1 bg-zinc-800 hover:bg-red-500/20 rounded text-zinc-400 hover:text-red-400"
          title="Delete"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
      <div className="mb-2 overflow-hidden rounded-lg bg-zinc-950/50 group-hover:bg-zinc-950 transition-colors h-12 flex items-center justify-center">
        <Icon className="w-6 h-6 text-accent-primary/50" />
      </div>
      <div className="flex items-center gap-2 px-1">
        <Globe className="w-3 h-3 text-accent-primary group-hover:text-accent-primary transition-colors shrink-0" />
        <span className="text-[10px] text-zinc-300 font-bold uppercase tracking-wider group-hover:text-white transition-colors truncate">
          {component.name || `Global ${component.type}`}
        </span>
      </div>
    </div>
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
        return <div className="w-full h-12 flex items-center justify-center"><div className="w-full h-6 bg-accent-primary/20 border border-accent-primary/50 rounded flex items-center justify-center"><div className="w-8 h-1 bg-accent-primary/50 rounded-full" /></div></div>;
      case 'image':
        return <div className="w-full h-12 bg-zinc-800 rounded border border-zinc-700 flex items-center justify-center"><ImageIcon className="w-4 h-4 text-zinc-600" /></div>;
      case 'navbar':
        return <div className="w-full h-12 flex flex-col gap-1"><div className="w-full h-3 bg-zinc-800 border border-zinc-700 rounded flex items-center justify-between px-1"><div className="w-2 h-1 bg-zinc-600 rounded-full" /><div className="flex gap-0.5"><div className="w-1 h-0.5 bg-zinc-600 rounded-full" /><div className="w-1 h-0.5 bg-zinc-600 rounded-full" /></div></div><div className="flex-1 bg-zinc-800/20 rounded" /></div>;
      case 'hero':
        return <div className="w-full h-12 bg-zinc-800 rounded border border-zinc-700 flex flex-col items-center justify-center gap-1 p-2"><div className="w-2/3 h-1.5 bg-zinc-700 rounded-full" /><div className="w-1/2 h-1 bg-zinc-700 rounded-full opacity-50" /><div className="w-1/3 h-2 bg-accent-primary/30 rounded mt-1" /></div>;
      case 'card':
        return <div className="w-full h-12 flex items-center justify-center"><div className="w-full h-10 bg-zinc-800 border border-zinc-700 rounded p-1 flex flex-col gap-1"><div className="w-full h-3 bg-zinc-700 rounded-sm" /><div className="w-2/3 h-1 bg-zinc-700 rounded-full" /></div></div>;
      case 'pricing':
        return <div className="w-full h-12 flex gap-1 p-1"><div className="flex-1 bg-zinc-800 border border-zinc-700 rounded flex flex-col items-center p-1 gap-1"><div className="w-full h-1 bg-zinc-700 rounded-full" /><div className="w-1/2 h-2 bg-accent-primary/20 rounded" /></div><div className="flex-1 bg-zinc-800 border border-zinc-700 rounded flex flex-col items-center p-1 gap-1 scale-110 z-10 shadow-xl"><div className="w-full h-1 bg-zinc-700 rounded-full" /><div className="w-1/2 h-2 bg-accent-primary/40 rounded" /></div><div className="flex-1 bg-zinc-800 border border-zinc-700 rounded flex flex-col items-center p-1 gap-1"><div className="w-full h-1 bg-zinc-700 rounded-full" /><div className="w-1/2 h-2 bg-accent-primary/20 rounded" /></div></div>;
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
        isDragging && "opacity-50 ring-2 ring-accent-primary"
      )}
    >
      <div className="mb-2 overflow-hidden rounded-lg bg-zinc-950/50 group-hover:bg-zinc-950 transition-colors">
        {renderPreview()}
      </div>
      <div className="flex items-center gap-2 px-1">
        <Icon className="w-3 h-3 text-zinc-500 group-hover:text-accent-primary transition-colors" />
        <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider group-hover:text-zinc-200 transition-colors">{component.label}</span>
      </div>
    </div>
  );
}

function TokensTab() {
  const { tokens, addToken, updateToken, removeToken } = useBuilderStore();

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
        <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Design Tokens</h3>
        <button
          onClick={() => addToken({
            id: uuidv4(),
            name: 'New Token',
            value: '#000000',
            type: 'color',
            category: 'brand'
          })}
          className="p-1.5 bg-accent-primary hover:bg-accent-primary text-white rounded-md transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
        {['color', 'spacing', 'font-size'].map(type => {
          const filteredTokens = tokens.filter(t => t.type === type);
          if (filteredTokens.length === 0 && type !== 'color') return null;

          return (
            <div key={type} className="space-y-3">
              <h4 className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest px-1">{type}s</h4>
              <div className="space-y-2">
                {filteredTokens.map(token => (
                  <div key={token.id} className="group p-2 bg-zinc-800/50 border border-zinc-800 rounded-lg hover:border-zinc-700 transition-all space-y-2">
                    <div className="flex items-center justify-between">
                      <input
                        type="text"
                        value={token.name}
                        onChange={(e) => updateToken(token.id, { name: e.target.value })}
                        className="bg-transparent text-[11px] font-medium text-zinc-200 focus:outline-none w-2/3"
                      />
                      <button
                        onClick={() => removeToken(token.id)}
                        className="p-1 text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      {token.type === 'color' ? (
                        <div className="relative w-6 h-6 rounded border border-zinc-700 overflow-hidden shrink-0">
                          <input
                            type="color"
                            value={token.value}
                            onChange={(e) => updateToken(token.id, { value: e.target.value })}
                            className="absolute inset-0 w-[150%] h-[150%] -translate-x-1/4 -translate-y-1/4 cursor-pointer"
                          />
                        </div>
                      ) : null}
                      <input
                        type="text"
                        value={token.value}
                        onChange={(e) => updateToken(token.id, { value: e.target.value })}
                        className="flex-1 bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-[10px] text-zinc-400 font-mono"
                      />
                    </div>
                  </div>
                ))}
                {filteredTokens.length === 0 && (
                  <p className="text-[10px] text-zinc-600 italic px-1">No {type} tokens yet.</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LayersTab() {
  const { elements, groupElements } = useBuilderStore();
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="p-2 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
        <h3 className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider px-2">Layers</h3>
        {selectedIds.length >= 2 && (
          <button
            onClick={() => {
              groupElements(selectedIds);
              setSelectedIds([]);
            }}
            className="flex items-center gap-1.5 px-2 py-1 bg-accent-primary hover:bg-accent-primary text-white text-[9px] font-bold uppercase rounded transition-all"
          >
            <Group className="w-3 h-3" />
            Group ({selectedIds.length})
          </button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
        {elements.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-zinc-600 p-8 text-center">
            <Layers className="w-8 h-8 mb-3 opacity-20" />
            <p className="text-xs">No elements on this page yet.</p>
          </div>
        ) : (
          <div className="space-y-0.5">
            {elements.map((element) => (
              <LayerItem 
                key={element.id} 
                element={element} 
                depth={0} 
                selectedIds={selectedIds}
                toggleSelect={toggleSelect}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function LayerItem({ 
  element, 
  depth, 
  selectedIds, 
  toggleSelect 
}: { 
  element: ElementInstance; 
  depth: number;
  selectedIds: string[];
  toggleSelect: (id: string) => void;
}) {
  const { 
    selectedElementId, 
    hoveredElementId,
    selectElement, 
    setHoveredElementId,
    removeElement, 
    updateElement, 
    duplicateElement,
    moveElement,
    isolatedElementId,
    setIsolatedElementId
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
          isSelected ? "bg-accent-primary/20 text-accent-primary" : isHovered ? "bg-zinc-800/50 text-zinc-200" : "hover:bg-zinc-800/30 text-zinc-400 hover:text-zinc-200",
          element.locked && "opacity-60 cursor-not-allowed"
        )}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
      >
        {isSelected && <div className="absolute left-0 top-1 bottom-1 w-0.5 bg-accent-primary rounded-full" />}
        {isHovered && !isSelected && <div className="absolute left-0 top-1 bottom-1 w-0.5 bg-zinc-600 rounded-full" />}
        
        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          <input
            type="checkbox"
            checked={selectedIds.includes(element.id)}
            onChange={(e) => {
              e.stopPropagation();
              toggleSelect(element.id);
            }}
            className="w-3 h-3 rounded border-zinc-700 bg-zinc-800 text-accent-primary focus:ring-0 focus:ring-offset-0 transition-all opacity-0 group-hover:opacity-100 checked:opacity-100"
            onClick={(e) => e.stopPropagation()}
          />
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
          <Icon className={cn("w-3.5 h-3.5 flex-shrink-0", isSelected ? "text-accent-primary" : "text-zinc-500")} />
          
          {isEditing ? (
            <input
              autoFocus
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onBlur={handleRename}
              onKeyDown={(e) => e.key === 'Enter' && handleRename()}
              className="bg-zinc-800 text-[11px] font-medium px-1 rounded border border-accent-primary focus:outline-none w-full"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span className="text-[11px] font-medium truncate">
              {element.name || component.label}
            </span>
          )}
        </div>

        <div className={cn(
          "items-center gap-0.5 ml-auto shrink-0",
          isSelected ? "flex" : "hidden group-hover:flex"
        )}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsolatedElementId(element.id === isolatedElementId ? null : element.id);
            }}
            className={cn(
              "p-1 hover:bg-zinc-700 rounded transition-colors",
              isolatedElementId === element.id ? "text-accent-primary" : "text-zinc-500 hover:text-zinc-200"
            )}
            title="Isolate"
          >
            <Maximize2 className="w-3 h-3" />
          </button>
          <div className="w-px h-3 bg-zinc-700 mx-0.5" />
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
            <LayerItem 
              key={child.id} 
              element={child} 
              depth={depth + 1} 
              selectedIds={selectedIds}
              toggleSelect={toggleSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}

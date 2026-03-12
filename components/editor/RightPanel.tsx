'use client';

import React from 'react';
import { useBuilderStore } from '@/store/useBuilderStore';
import { COMPONENT_REGISTRY } from '@/lib/registry';
import { cn } from '@/lib/utils';
import { 
  Settings2, 
  Palette, 
  Layout as LayoutIcon, 
  Type as TypeIcon,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

export default function RightPanel() {
  const { selectedElementId, elements, updateElement, removeElement, pages, setActivePage } = useBuilderStore();
  
  const findElement = (items: any[], id: string): any => {
    for (const item of items) {
      if (item.id === id) return item;
      if (item.children) {
        const found = findElement(item.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const selectedElement = selectedElementId ? findElement(elements, selectedElementId) : null;

  if (!selectedElement) {
    return (
      <aside className="w-80 bg-zinc-900 border-l border-zinc-800 flex flex-col items-center justify-center p-8 text-center">
        <Settings2 className="w-12 h-12 text-zinc-700 mb-4" />
        <h3 className="text-zinc-400 font-medium">No element selected</h3>
        <p className="text-zinc-600 text-sm mt-2">Select an element on the canvas to edit its properties.</p>
      </aside>
    );
  }

  const handleStyleChange = (key: string, value: any) => {
    updateElement(selectedElement.id, {
      styles: { ...selectedElement.styles, [key]: value }
    });
  };

  const handlePropChange = (key: string, value: any) => {
    updateElement(selectedElement.id, {
      props: { ...selectedElement.props, [key]: value }
    });
  };

  const isLinkable = ['button', 'image', 'navbar'].includes(selectedElement.type);

  return (
    <aside className="w-80 bg-zinc-900 border-l border-zinc-800 flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-500/10 rounded">
            <Settings2 className="w-4 h-4 text-blue-500" />
          </div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-300">Properties</h2>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => removeElement(selectedElement.id)}
            className="p-1.5 hover:bg-red-500/10 text-zinc-500 hover:text-red-500 rounded transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
        {/* Content Section */}
        <PropertySection title="Content" icon={TypeIcon}>
          {selectedElement.props.text !== undefined && (
            <div className="space-y-1.5">
              <label className="text-[10px] text-zinc-500 uppercase font-bold">Text Content</label>
              <textarea
                value={selectedElement.props.text}
                onChange={(e) => handlePropChange('text', e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[80px]"
              />
            </div>
          )}
          {selectedElement.props.src !== undefined && (
            <div className="space-y-1.5">
              <label className="text-[10px] text-zinc-500 uppercase font-bold">Image URL</label>
              <input
                type="text"
                value={selectedElement.props.src}
                onChange={(e) => handlePropChange('src', e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          )}

          {/* Navbar Specific Controls */}
          {selectedElement.type === 'navbar' && (
            <div className="space-y-4 pt-2 border-t border-zinc-800 mt-2">
              <div className="space-y-1.5">
                <label className="text-[10px] text-zinc-500 uppercase font-bold">Logo Type</label>
                <select
                  value={selectedElement.props.logoType || 'text'}
                  onChange={(e) => handlePropChange('logoType', e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-sm text-zinc-200"
                >
                  <option value="text">Text</option>
                  <option value="image">Image</option>
                </select>
              </div>
              {selectedElement.props.logoType === 'text' ? (
                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-500 uppercase font-bold">Logo Text</label>
                  <input
                    type="text"
                    value={selectedElement.props.logoText || ''}
                    onChange={(e) => handlePropChange('logoText', e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-sm text-zinc-200"
                  />
                </div>
              ) : (
                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-500 uppercase font-bold">Logo Image URL</label>
                  <input
                    type="text"
                    value={selectedElement.props.logoSrc || ''}
                    onChange={(e) => handlePropChange('logoSrc', e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-sm text-zinc-200"
                  />
                </div>
              )}
            </div>
          )}

          {/* Link Controls */}
          {isLinkable && selectedElement.type !== 'navbar' && (
            <div className="space-y-4 pt-2 border-t border-zinc-800 mt-2">
              <div className="space-y-1.5">
                <label className="text-[10px] text-zinc-500 uppercase font-bold">Link Type</label>
                <select
                  value={selectedElement.props.linkType || 'external'}
                  onChange={(e) => handlePropChange('linkType', e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-sm text-zinc-200"
                >
                  <option value="external">External URL</option>
                  <option value="internal">Internal Page</option>
                </select>
              </div>
              {selectedElement.props.linkType === 'internal' ? (
                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-500 uppercase font-bold">Select Page</label>
                  <select
                    value={selectedElement.props.href || ''}
                    onChange={(e) => handlePropChange('href', e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-sm text-zinc-200"
                  >
                    <option value="">Select a page...</option>
                    {pages.map(page => (
                      <option key={page.id} value={page.id}>{page.name}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-500 uppercase font-bold">URL</label>
                  <input
                    type="text"
                    value={selectedElement.props.href || ''}
                    onChange={(e) => handlePropChange('href', e.target.value)}
                    placeholder="https://example.com"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-sm text-zinc-200"
                  />
                </div>
              )}
            </div>
          )}
        </PropertySection>

        {/* Typography Section */}
        <PropertySection title="Typography" icon={TypeIcon}>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[10px] text-zinc-500 uppercase font-bold">Size</label>
              <input
                type="text"
                value={selectedElement.styles.fontSize || ''}
                onChange={(e) => handleStyleChange('fontSize', e.target.value)}
                placeholder="16px"
                className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-sm text-zinc-200"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] text-zinc-500 uppercase font-bold">Weight</label>
              <select
                value={selectedElement.styles.fontWeight || '400'}
                onChange={(e) => handleStyleChange('fontWeight', e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-sm text-zinc-200"
              >
                <option value="300">Light</option>
                <option value="400">Regular</option>
                <option value="500">Medium</option>
                <option value="600">Semi-Bold</option>
                <option value="700">Bold</option>
              </select>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] text-zinc-500 uppercase font-bold">Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={selectedElement.styles.color || '#000000'}
                onChange={(e) => handleStyleChange('color', e.target.value)}
                className="w-8 h-8 bg-transparent border-none p-0 cursor-pointer"
              />
              <input
                type="text"
                value={selectedElement.styles.color || ''}
                onChange={(e) => handleStyleChange('color', e.target.value)}
                className="flex-1 bg-zinc-800 border border-zinc-700 rounded p-2 text-sm text-zinc-200 uppercase"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] text-zinc-500 uppercase font-bold">Alignment</label>
            <div className="flex bg-zinc-800 rounded p-1">
              {['left', 'center', 'right', 'justify'].map((align) => (
                <button
                  key={align}
                  onClick={() => handleStyleChange('textAlign', align)}
                  className={cn(
                    "flex-1 py-1 text-[10px] uppercase font-bold rounded transition-all",
                    selectedElement.styles.textAlign === align ? "bg-zinc-700 text-white" : "text-zinc-500 hover:text-zinc-300"
                  )}
                >
                  {align}
                </button>
              ))}
            </div>
          </div>
        </PropertySection>

        {/* Layout & Spacing Section */}
        <PropertySection title="Layout & Spacing" icon={LayoutIcon}>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[10px] text-zinc-500 uppercase font-bold">Width</label>
              <input
                type="text"
                value={selectedElement.styles.width || ''}
                onChange={(e) => handleStyleChange('width', e.target.value)}
                placeholder="auto"
                className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-sm text-zinc-200"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] text-zinc-500 uppercase font-bold">Height</label>
              <input
                type="text"
                value={selectedElement.styles.height || ''}
                onChange={(e) => handleStyleChange('height', e.target.value)}
                placeholder="auto"
                className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-sm text-zinc-200"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[10px] text-zinc-500 uppercase font-bold">Padding</label>
              <input
                type="text"
                value={selectedElement.styles.padding || ''}
                onChange={(e) => handleStyleChange('padding', e.target.value)}
                placeholder="1rem"
                className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-sm text-zinc-200"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] text-zinc-500 uppercase font-bold">Margin</label>
              <input
                type="text"
                value={selectedElement.styles.margin || ''}
                onChange={(e) => handleStyleChange('margin', e.target.value)}
                placeholder="0"
                className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-sm text-zinc-200"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] text-zinc-500 uppercase font-bold">Background Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={selectedElement.styles.backgroundColor || '#ffffff'}
                onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                className="w-8 h-8 bg-transparent border-none p-0 cursor-pointer"
              />
              <input
                type="text"
                value={selectedElement.styles.backgroundColor || ''}
                onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                className="flex-1 bg-zinc-800 border border-zinc-700 rounded p-2 text-sm text-zinc-200 uppercase"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] text-zinc-500 uppercase font-bold">Background Image URL</label>
            <input
              type="text"
              value={selectedElement.styles.backgroundImage || ''}
              onChange={(e) => handleStyleChange('backgroundImage', e.target.value)}
              placeholder="url('...')"
              className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-sm text-zinc-200"
            />
          </div>
          {selectedElement.styles.backgroundImage && (
            <div className="space-y-1.5">
              <label className="text-[10px] text-zinc-500 uppercase font-bold">BG Size</label>
              <select
                value={selectedElement.styles.backgroundSize || 'cover'}
                onChange={(e) => handleStyleChange('backgroundSize', e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-sm text-zinc-200"
              >
                <option value="cover">Cover</option>
                <option value="contain">Contain</option>
                <option value="auto">Auto</option>
              </select>
            </div>
          )}
        </PropertySection>

        {/* Borders Section */}
        <PropertySection title="Borders" icon={Palette}>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[10px] text-zinc-500 uppercase font-bold">Radius</label>
              <input
                type="text"
                value={selectedElement.styles.borderRadius || ''}
                onChange={(e) => handleStyleChange('borderRadius', e.target.value)}
                placeholder="0.5rem"
                className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-sm text-zinc-200"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] text-zinc-500 uppercase font-bold">Width</label>
              <input
                type="text"
                value={selectedElement.styles.borderWidth || ''}
                onChange={(e) => handleStyleChange('borderWidth', e.target.value)}
                placeholder="1px"
                className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-sm text-zinc-200"
              />
            </div>
          </div>
        </PropertySection>
      </div>
    </aside>
  );
}

function PropertySection({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(true);

  return (
    <div className="border-b border-zinc-800 pb-6 last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between mb-4 group"
      >
        <div className="flex items-center gap-2">
          <Icon className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
          <h3 className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">{title}</h3>
        </div>
        {isOpen ? <ChevronUp className="w-3.5 h-3.5 text-zinc-600" /> : <ChevronDown className="w-3.5 h-3.5 text-zinc-600" />}
      </button>
      {isOpen && <div className="space-y-4">{children}</div>}
    </div>
  );
}

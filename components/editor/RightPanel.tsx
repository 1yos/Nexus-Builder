'use client';

import React from 'react';
import { useBuilderStore, ComponentType } from '@/store/useBuilderStore';
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
  ChevronDown,
  Box,
  MousePointer2,
  Image as ImageIcon,
  Link as LinkIcon
} from 'lucide-react';

export default function RightPanel() {
  const { 
    selectedElementId, 
    elements, 
    updateElement, 
    removeElement, 
    pages, 
    rightPanelTab, 
    setRightPanelTab 
  } = useBuilderStore();
  
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
        <div className="w-16 h-16 bg-zinc-800/50 rounded-2xl flex items-center justify-center mb-6 border border-zinc-800">
          <MousePointer2 className="w-8 h-8 text-zinc-600" />
        </div>
        <h3 className="text-zinc-300 font-bold text-lg">No element selected</h3>
        <p className="text-zinc-500 text-sm mt-2 leading-relaxed">
          Select an element on the canvas to customize its content, style, and layout.
        </p>
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
      <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-blue-500/10 rounded-md border border-blue-500/20">
            {React.createElement(COMPONENT_REGISTRY[selectedElement.type as ComponentType].icon as any, { className: "w-3.5 h-3.5 text-blue-500" })}
          </div>
          <div>
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-zinc-200">
              {COMPONENT_REGISTRY[selectedElement.type as ComponentType].label}
            </h2>
            <p className="text-[9px] text-zinc-500 font-mono uppercase tracking-tighter">
              ID: {selectedElement.id.split('-')[0]}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => removeElement(selectedElement.id)}
            className="p-1.5 hover:bg-red-500/10 text-zinc-500 hover:text-red-500 rounded-md transition-all"
            title="Delete element"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="flex border-b border-zinc-800">
        <TabButton 
          active={rightPanelTab === 'content'} 
          onClick={() => setRightPanelTab('content')} 
          icon={TypeIcon} 
          label="Content" 
        />
        <TabButton 
          active={rightPanelTab === 'style'} 
          onClick={() => setRightPanelTab('style')} 
          icon={Palette} 
          label="Style" 
        />
        <TabButton 
          active={rightPanelTab === 'layout'} 
          onClick={() => setRightPanelTab('layout')} 
          icon={LayoutIcon} 
          label="Layout" 
        />
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
        {rightPanelTab === 'content' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-2 duration-200">
            {selectedElement.props.text !== undefined && (
              <PropertySection title="Text Content" icon={TypeIcon}>
                <textarea
                  value={selectedElement.props.text}
                  onChange={(e) => handlePropChange('text', e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-md p-2.5 text-xs text-zinc-200 focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[100px] resize-none"
                  placeholder="Enter text..."
                />
              </PropertySection>
            )}

            {selectedElement.props.src !== undefined && (
              <PropertySection title="Image Source" icon={ImageIcon}>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={selectedElement.props.src}
                    onChange={(e) => handlePropChange('src', e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-md p-2 text-xs text-zinc-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="https://images.unsplash.com/..."
                  />
                  <input
                    type="text"
                    value={selectedElement.props.alt || ''}
                    onChange={(e) => handlePropChange('alt', e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-md p-2 text-xs text-zinc-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Alt text"
                  />
                </div>
              </PropertySection>
            )}

            {isLinkable && (
              <PropertySection title="Link Settings" icon={LinkIcon}>
                <div className="space-y-3">
                  <div className="flex bg-zinc-800 rounded-md p-1 border border-zinc-700">
                    <button
                      onClick={() => handlePropChange('linkType', 'external')}
                      className={cn(
                        "flex-1 py-1.5 text-[10px] font-bold uppercase rounded transition-all",
                        selectedElement.props.linkType !== 'internal' ? "bg-zinc-700 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"
                      )}
                    >
                      External
                    </button>
                    <button
                      onClick={() => handlePropChange('linkType', 'internal')}
                      className={cn(
                        "flex-1 py-1.5 text-[10px] font-bold uppercase rounded transition-all",
                        selectedElement.props.linkType === 'internal' ? "bg-zinc-700 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"
                      )}
                    >
                      Internal
                    </button>
                  </div>

                  {selectedElement.props.linkType === 'internal' ? (
                    <select
                      value={selectedElement.props.href || ''}
                      onChange={(e) => handlePropChange('href', e.target.value)}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-md p-2 text-xs text-zinc-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="">Select a page...</option>
                      {pages.map(page => (
                        <option key={page.id} value={page.id}>{page.name}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={selectedElement.props.href || ''}
                      onChange={(e) => handlePropChange('href', e.target.value)}
                      placeholder="https://example.com"
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-md p-2 text-xs text-zinc-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  )}
                </div>
              </PropertySection>
            )}

            {selectedElement.type === 'navbar' && (
              <PropertySection title="Logo Settings" icon={Box}>
                <div className="space-y-3">
                  <select
                    value={selectedElement.props.logoType || 'text'}
                    onChange={(e) => handlePropChange('logoType', e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-md p-2 text-xs text-zinc-200"
                  >
                    <option value="text">Text Logo</option>
                    <option value="image">Image Logo</option>
                  </select>
                  {selectedElement.props.logoType === 'image' ? (
                    <input
                      type="text"
                      value={selectedElement.props.logoSrc || ''}
                      onChange={(e) => handlePropChange('logoSrc', e.target.value)}
                      placeholder="Logo URL"
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-md p-2 text-xs text-zinc-200"
                    />
                  ) : (
                    <input
                      type="text"
                      value={selectedElement.props.logoText || ''}
                      onChange={(e) => handlePropChange('logoText', e.target.value)}
                      placeholder="Logo Text"
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-md p-2 text-xs text-zinc-200"
                    />
                  )}
                </div>
              </PropertySection>
            )}
          </div>
        )}

        {rightPanelTab === 'style' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-2 duration-200">
            <PropertySection title="Typography" icon={TypeIcon}>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Size</label>
                  <input
                    type="text"
                    value={selectedElement.styles.fontSize || ''}
                    onChange={(e) => handleStyleChange('fontSize', e.target.value)}
                    placeholder="16px"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-md p-2 text-xs text-zinc-200"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Weight</label>
                  <select
                    value={selectedElement.styles.fontWeight || '400'}
                    onChange={(e) => handleStyleChange('fontWeight', e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-md p-2 text-xs text-zinc-200"
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
                <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Color</label>
                <div className="flex gap-2">
                  <div className="relative w-8 h-8 rounded-md border border-zinc-700 overflow-hidden">
                    <input
                      type="color"
                      value={selectedElement.styles.color || '#000000'}
                      onChange={(e) => handleStyleChange('color', e.target.value)}
                      className="absolute inset-0 w-[150%] h-[150%] -translate-x-1/4 -translate-y-1/4 cursor-pointer"
                    />
                  </div>
                  <input
                    type="text"
                    value={selectedElement.styles.color || ''}
                    onChange={(e) => handleStyleChange('color', e.target.value)}
                    className="flex-1 bg-zinc-800 border border-zinc-700 rounded-md p-2 text-xs text-zinc-200 uppercase font-mono"
                    placeholder="#000000"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Alignment</label>
                <div className="flex bg-zinc-800 rounded-md p-1 border border-zinc-700">
                  {['left', 'center', 'right', 'justify'].map((align) => (
                    <button
                      key={align}
                      onClick={() => handleStyleChange('textAlign', align)}
                      className={cn(
                        "flex-1 py-1 text-[10px] uppercase font-bold rounded transition-all",
                        selectedElement.styles.textAlign === align ? "bg-zinc-700 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"
                      )}
                    >
                      {align}
                    </button>
                  ))}
                </div>
              </div>
            </PropertySection>

            <PropertySection title="Appearance" icon={Palette}>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Background</label>
                  <div className="flex gap-2">
                    <div className="relative w-8 h-8 rounded-md border border-zinc-700 overflow-hidden">
                      <input
                        type="color"
                        value={selectedElement.styles.backgroundColor || '#ffffff'}
                        onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                        className="absolute inset-0 w-[150%] h-[150%] -translate-x-1/4 -translate-y-1/4 cursor-pointer"
                      />
                    </div>
                    <input
                      type="text"
                      value={selectedElement.styles.backgroundColor || ''}
                      onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                      className="flex-1 bg-zinc-800 border border-zinc-700 rounded-md p-2 text-xs text-zinc-200 uppercase font-mono"
                      placeholder="transparent"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Background Image</label>
                  <input
                    type="text"
                    value={selectedElement.styles.backgroundImage || ''}
                    onChange={(e) => handleStyleChange('backgroundImage', e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-md p-2 text-xs text-zinc-200"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Radius</label>
                    <input
                      type="text"
                      value={selectedElement.styles.borderRadius || ''}
                      onChange={(e) => handleStyleChange('borderRadius', e.target.value)}
                      placeholder="0px"
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-md p-2 text-xs text-zinc-200"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Opacity</label>
                    <input
                      type="number"
                      min="0"
                      max="1"
                      step="0.1"
                      value={selectedElement.styles.opacity ?? 1}
                      onChange={(e) => handleStyleChange('opacity', parseFloat(e.target.value))}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-md p-2 text-xs text-zinc-200"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Shadow</label>
                  <select
                    value={selectedElement.styles.boxShadow || 'none'}
                    onChange={(e) => handleStyleChange('boxShadow', e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-md p-2 text-xs text-zinc-200"
                  >
                    <option value="none">None</option>
                    <option value="0 1px 2px 0 rgb(0 0 0 / 0.05)">Small</option>
                    <option value="0 4px 6px -1px rgb(0 0 0 / 0.1)">Medium</option>
                    <option value="0 10px 15px -3px rgb(0 0 0 / 0.1)">Large</option>
                    <option value="0 20px 25px -5px rgb(0 0 0 / 0.1)">X-Large</option>
                  </select>
                </div>
              </div>
            </PropertySection>
          </div>
        )}

        {rightPanelTab === 'layout' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-2 duration-200">
            <PropertySection title="Dimensions" icon={Box}>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Width</label>
                  <input
                    type="text"
                    value={selectedElement.styles.width || ''}
                    onChange={(e) => handleStyleChange('width', e.target.value)}
                    placeholder="auto"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-md p-2 text-xs text-zinc-200"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Height</label>
                  <input
                    type="text"
                    value={selectedElement.styles.height || ''}
                    onChange={(e) => handleStyleChange('height', e.target.value)}
                    placeholder="auto"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-md p-2 text-xs text-zinc-200"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Max Width</label>
                <input
                  type="text"
                  value={selectedElement.styles.maxWidth || ''}
                  onChange={(e) => handleStyleChange('maxWidth', e.target.value)}
                  placeholder="none"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-md p-2 text-xs text-zinc-200"
                />
              </div>
            </PropertySection>

            <PropertySection title="Spacing" icon={LayoutIcon}>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Padding</label>
                  <input
                    type="text"
                    value={selectedElement.styles.padding || ''}
                    onChange={(e) => handleStyleChange('padding', e.target.value)}
                    placeholder="0px"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-md p-2 text-xs text-zinc-200"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Margin</label>
                  <input
                    type="text"
                    value={selectedElement.styles.margin || ''}
                    onChange={(e) => handleStyleChange('margin', e.target.value)}
                    placeholder="0px"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-md p-2 text-xs text-zinc-200"
                  />
                </div>
              </div>
            </PropertySection>

            {(selectedElement.type === 'flex' || selectedElement.type === 'grid' || selectedElement.styles.display === 'flex') && (
              <PropertySection title="Flex/Grid" icon={LayoutIcon}>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Gap</label>
                    <input
                      type="text"
                      value={selectedElement.styles.gap || ''}
                      onChange={(e) => handleStyleChange('gap', e.target.value)}
                      placeholder="0px"
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-md p-2 text-xs text-zinc-200"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Direction</label>
                    <select
                      value={selectedElement.styles.flexDirection || 'row'}
                      onChange={(e) => handleStyleChange('flexDirection', e.target.value)}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-md p-2 text-xs text-zinc-200"
                    >
                      <option value="row">Row</option>
                      <option value="column">Column</option>
                    </select>
                  </div>
                </div>
              </PropertySection>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}

function TabButton({ active, onClick, icon: Icon, label }: { active: boolean; onClick: () => void; icon: any; label: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex-1 flex flex-col items-center justify-center gap-1.5 py-3 transition-all relative",
        active ? "text-blue-500" : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50"
      )}
    >
      <Icon className="w-3.5 h-3.5" />
      <span className="text-[9px] font-bold uppercase tracking-wider">{label}</span>
      {active && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />}
    </button>
  );
}

function PropertySection({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(true);

  return (
    <div className="space-y-3">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between group"
      >
        <div className="flex items-center gap-2">
          <Icon className="w-3 h-3 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
          <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest group-hover:text-zinc-300 transition-colors">{title}</h3>
        </div>
        {isOpen ? <ChevronUp className="w-3 h-3 text-zinc-600" /> : <ChevronDown className="w-3 h-3 text-zinc-600" />}
      </button>
      {isOpen && <div className="space-y-4">{children}</div>}
    </div>
  );
}

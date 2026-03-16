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
  Link as LinkIcon,
  Sparkles,
  Navigation,
  Activity,
  Globe,
  Plus,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Maximize,
  Minimize,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function RightPanel() {
  const { 
    selectedElementId, 
    elements, 
    updateElement, 
    removeElement, 
    pages, 
    rightPanelTab, 
    setRightPanelTab,
    convertToGlobal,
    duplicateElement,
    rightPanelCollapsed,
    setRightPanelCollapsed,
    deviceMode
  } = useBuilderStore();

  if (rightPanelCollapsed) {
    return (
      <aside className="w-12 bg-zinc-900 border-l border-zinc-800 flex flex-col items-center py-4 h-full">
        <button
          onClick={() => setRightPanelCollapsed(false)}
          className="p-2 hover:bg-zinc-800 rounded-md text-zinc-400 hover:text-zinc-200 transition-colors"
          title="Expand Sidebar"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 flex flex-col gap-4 mt-8">
          <button
            onClick={() => { setRightPanelTab('style'); setRightPanelCollapsed(false); }}
            className={cn("p-2 rounded-md transition-colors", rightPanelTab === 'style' ? "text-blue-500 bg-blue-500/10" : "text-zinc-500 hover:text-zinc-300")}
          >
            <Palette className="w-5 h-5" />
          </button>
          <button
            onClick={() => { setRightPanelTab('content'); setRightPanelCollapsed(false); }}
            className={cn("p-2 rounded-md transition-colors", rightPanelTab === 'content' ? "text-blue-500 bg-blue-500/10" : "text-zinc-500 hover:text-zinc-300")}
          >
            <Settings2 className="w-5 h-5" />
          </button>
          <button
            onClick={() => { setRightPanelTab('layout'); setRightPanelCollapsed(false); }}
            className={cn("p-2 rounded-md transition-colors", rightPanelTab === 'layout' ? "text-blue-500 bg-blue-500/10" : "text-zinc-500 hover:text-zinc-300")}
          >
            <LayoutIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => { setRightPanelTab('animations'); setRightPanelCollapsed(false); }}
            className={cn("p-2 rounded-md transition-colors", rightPanelTab === 'animations' ? "text-blue-500 bg-blue-500/10" : "text-zinc-500 hover:text-zinc-300")}
          >
            <Activity className="w-5 h-5" />
          </button>
        </div>
      </aside>
    );
  }
  
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

  const getCurrentStyles = () => {
    if (!selectedElement) return {};
    const baseStyles = selectedElement.styles || {};
    if (deviceMode === 'desktop') return baseStyles;
    
    const responsive = selectedElement.responsiveStyles || {};
    if (deviceMode === 'tablet') {
      return { ...baseStyles, ...(responsive.tablet || {}) };
    }
    if (deviceMode === 'mobile') {
      return { ...baseStyles, ...(responsive.tablet || {}), ...(responsive.mobile || {}) };
    }
    return baseStyles;
  };

  const currentStyles = getCurrentStyles();

  if (!selectedElement) {
    return (
      <aside className="w-80 bg-zinc-900 border-l border-zinc-800 flex flex-col items-center justify-center p-8 text-center relative group/sidebar">
        <button
          onClick={() => setRightPanelCollapsed(true)}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-1 bg-zinc-800 border border-zinc-700 rounded-md text-zinc-400 hover:text-zinc-200 opacity-0 group-hover/sidebar:opacity-100 transition-opacity"
          title="Collapse Sidebar"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
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
    const { deviceMode } = useBuilderStore.getState();
    
    if (deviceMode === 'desktop') {
      updateElement(selectedElement.id, {
        styles: { ...selectedElement.styles, [key]: value }
      });
    } else {
      const responsiveStyles = selectedElement.responsiveStyles || {};
      const currentDeviceStyles = responsiveStyles[deviceMode] || {};
      
      updateElement(selectedElement.id, {
        responsiveStyles: {
          ...responsiveStyles,
          [deviceMode]: { ...currentDeviceStyles, [key]: value }
        }
      });
    }
  };

  const handlePropChange = (key: string, value: any) => {
    updateElement(selectedElement.id, {
      props: { ...selectedElement.props, [key]: value }
    });
  };

  const isLinkable = ['button', 'image', 'navbar'].includes(selectedElement.type);

  return (
    <aside className="w-80 bg-zinc-900 border-l border-zinc-800 flex flex-col h-full overflow-hidden relative group/sidebar">
      <button
        onClick={() => setRightPanelCollapsed(true)}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-1 bg-zinc-800 border border-zinc-700 rounded-md text-zinc-400 hover:text-zinc-200 opacity-0 group-hover/sidebar:opacity-100 transition-opacity"
        title="Collapse Sidebar"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

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
          {!selectedElement.isGlobal && (
            <button 
              onClick={() => convertToGlobal(selectedElement.id)}
              className="p-1.5 hover:bg-purple-500/10 text-zinc-500 hover:text-purple-500 rounded-md transition-all"
              title="Convert to Global Component"
            >
              <Globe className="w-3.5 h-3.5" />
            </button>
          )}
          <button 
            onClick={() => duplicateElement(selectedElement.id)}
            className="p-1.5 hover:bg-blue-500/10 text-zinc-500 hover:text-blue-500 rounded-md transition-all"
            title="Duplicate element"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
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
        <TabButton 
          active={rightPanelTab === 'animations'} 
          onClick={() => setRightPanelTab('animations')} 
          icon={Activity} 
          label="Animate" 
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

            {selectedElement.type === 'navbar' && (
              <PropertySection title="Navbar Settings" icon={Navigation}>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Logo Type</label>
                    <div className="flex bg-zinc-800 rounded-md p-1 border border-zinc-700">
                      {['text', 'image'].map((type) => (
                        <button
                          key={type}
                          onClick={() => handlePropChange('logoType', type)}
                          className={cn(
                            "flex-1 py-1 text-[10px] uppercase font-bold rounded transition-all",
                            selectedElement.props.logoType === type ? "bg-zinc-700 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"
                          )}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {selectedElement.props.logoType === 'text' ? (
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Logo Text</label>
                      <input
                        type="text"
                        value={selectedElement.props.logoText || ''}
                        onChange={(e) => handlePropChange('logoText', e.target.value)}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-md p-2 text-xs text-zinc-200"
                      />
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Logo Image URL</label>
                      <input
                        type="text"
                        value={selectedElement.props.logoSrc || ''}
                        onChange={(e) => handlePropChange('logoSrc', e.target.value)}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-md p-2 text-xs text-zinc-200"
                      />
                    </div>
                  )}

                  <div className="pt-4 border-t border-zinc-800">
                    <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider block mb-2">Mobile Menu</label>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Hamburger Color</label>
                        <div className="flex gap-2">
                          <div className="relative w-8 h-8 rounded-md border border-zinc-700 overflow-hidden shrink-0">
                            <input
                              type="color"
                              value={selectedElement.props.hamburgerColor || '#000000'}
                              onChange={(e) => handlePropChange('hamburgerColor', e.target.value)}
                              className="absolute inset-0 w-[150%] h-[150%] -translate-x-1/4 -translate-y-1/4 cursor-pointer"
                            />
                          </div>
                          <input
                            type="text"
                            value={selectedElement.props.hamburgerColor || ''}
                            onChange={(e) => handlePropChange('hamburgerColor', e.target.value)}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-md p-2 text-xs text-zinc-200 uppercase font-mono"
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Icon Size</label>
                        <input
                          type="number"
                          value={parseInt(selectedElement.props.hamburgerSize) || 24}
                          onChange={(e) => handlePropChange('hamburgerSize', parseInt(e.target.value))}
                          className="w-full bg-zinc-800 border border-zinc-700 rounded-md p-2 text-xs text-zinc-200"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </PropertySection>
            )}

            {COMPONENT_REGISTRY[selectedElement.type as ComponentType].variants && (
              <PropertySection title="Component Variant" icon={Sparkles}>
                <div className="grid grid-cols-2 gap-2">
                  {COMPONENT_REGISTRY[selectedElement.type as ComponentType].variants?.map(variant => (
                    <button
                      key={variant.id}
                      onClick={() => {
                        updateElement(selectedElement.id, { 
                          variant: variant.id,
                          styles: { ...selectedElement.styles, ...variant.styles },
                          props: { ...selectedElement.props, ...(variant.props || {}) }
                        });
                      }}
                      className={cn(
                        "px-3 py-2 text-[10px] font-bold uppercase rounded-lg border transition-all",
                        selectedElement.variant === variant.id 
                          ? "bg-purple-500/10 border-purple-500 text-purple-400" 
                          : "bg-zinc-800 border-zinc-700 text-zinc-500 hover:border-zinc-600"
                      )}
                    >
                      {variant.label}
                    </button>
                  ))}
                </div>
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
                    value={currentStyles.fontSize || ''}
                    onChange={(e) => handleStyleChange('fontSize', e.target.value)}
                    placeholder="16px"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-md p-2 text-xs text-zinc-200"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Weight</label>
                  <select
                    value={currentStyles.fontWeight || '400'}
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
                      value={currentStyles.color || '#000000'}
                      onChange={(e) => handleStyleChange('color', e.target.value)}
                      className="absolute inset-0 w-[150%] h-[150%] -translate-x-1/4 -translate-y-1/4 cursor-pointer"
                    />
                  </div>
                  <input
                    type="text"
                    value={currentStyles.color || ''}
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
                        currentStyles.textAlign === align ? "bg-zinc-700 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"
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
                        value={currentStyles.backgroundColor || '#ffffff'}
                        onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                        className="absolute inset-0 w-[150%] h-[150%] -translate-x-1/4 -translate-y-1/4 cursor-pointer"
                      />
                    </div>
                    <input
                      type="text"
                      value={currentStyles.backgroundColor || ''}
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
                    value={currentStyles.backgroundImage || ''}
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
                      value={currentStyles.borderRadius || ''}
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
                      value={currentStyles.opacity ?? 1}
                      onChange={(e) => handleStyleChange('opacity', parseFloat(e.target.value))}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-md p-2 text-xs text-zinc-200"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Shadow</label>
                  <select
                    value={currentStyles.boxShadow || 'none'}
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
                    value={currentStyles.width || ''}
                    onChange={(e) => handleStyleChange('width', e.target.value)}
                    placeholder="auto"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-md p-2 text-xs text-zinc-200"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Height</label>
                  <input
                    type="text"
                    value={currentStyles.height || ''}
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
                  value={currentStyles.maxWidth || ''}
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
                    value={currentStyles.padding || ''}
                    onChange={(e) => handleStyleChange('padding', e.target.value)}
                    placeholder="0px"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-md p-2 text-xs text-zinc-200"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Margin</label>
                  <input
                    type="text"
                    value={currentStyles.margin || ''}
                    onChange={(e) => handleStyleChange('margin', e.target.value)}
                    placeholder="0px"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-md p-2 text-xs text-zinc-200"
                  />
                </div>
              </div>
            </PropertySection>

            {(selectedElement.type === 'flex' || selectedElement.type === 'grid' || currentStyles.display === 'flex') && (
              <PropertySection title="Visual Layout Builder" icon={LayoutIcon}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Flex Direction</label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleStyleChange('flexDirection', 'row')}
                        className={cn(
                          "flex-1 p-2 rounded-lg border flex flex-col items-center gap-1 transition-all",
                          currentStyles.flexDirection === 'row' ? "bg-blue-500/10 border-blue-500 text-blue-400" : "bg-zinc-800 border-zinc-700 text-zinc-500"
                        )}
                      >
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-current rounded-sm" />
                          <div className="w-2 h-2 bg-current rounded-sm" />
                        </div>
                        <span className="text-[9px] font-bold">Row</span>
                      </button>
                      <button
                        onClick={() => handleStyleChange('flexDirection', 'column')}
                        className={cn(
                          "flex-1 p-2 rounded-lg border flex flex-col items-center gap-1 transition-all",
                          currentStyles.flexDirection === 'column' ? "bg-blue-500/10 border-blue-500 text-blue-400" : "bg-zinc-800 border-zinc-700 text-zinc-500"
                        )}
                      >
                        <div className="flex flex-col gap-1">
                          <div className="w-2 h-2 bg-current rounded-sm" />
                          <div className="w-2 h-2 bg-current rounded-sm" />
                        </div>
                        <span className="text-[9px] font-bold">Column</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Justify Content</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'flex-start', icon: AlignLeft, label: 'Start' },
                        { id: 'center', icon: AlignCenter, label: 'Center' },
                        { id: 'flex-end', icon: AlignRight, label: 'End' },
                        { id: 'space-between', icon: AlignJustify, label: 'Between' },
                        { id: 'space-around', icon: AlignJustify, label: 'Around' },
                        { id: 'space-evenly', icon: AlignJustify, label: 'Evenly' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={() => handleStyleChange('justifyContent', item.id)}
                          className={cn(
                            "p-2 rounded-lg border flex flex-col items-center gap-1 transition-all",
                            currentStyles.justifyContent === item.id ? "bg-blue-500/10 border-blue-500 text-blue-400" : "bg-zinc-800 border-zinc-700 text-zinc-500"
                          )}
                        >
                          <item.icon className="w-3.5 h-3.5" />
                          <span className="text-[8px] font-bold">{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Align Items</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'flex-start', icon: ArrowUp, label: 'Top' },
                        { id: 'center', icon: AlignCenter, label: 'Center' },
                        { id: 'flex-end', icon: ArrowDown, label: 'Bottom' },
                        { id: 'stretch', icon: Maximize, label: 'Stretch' },
                        { id: 'baseline', icon: AlignJustify, label: 'Baseline' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={() => handleStyleChange('alignItems', item.id)}
                          className={cn(
                            "p-2 rounded-lg border flex flex-col items-center gap-1 transition-all",
                            currentStyles.alignItems === item.id ? "bg-blue-500/10 border-blue-500 text-blue-400" : "bg-zinc-800 border-zinc-700 text-zinc-500"
                          )}
                        >
                          <item.icon className="w-3.5 h-3.5" />
                          <span className="text-[8px] font-bold">{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Gap</label>
                    <input
                      type="text"
                      value={currentStyles.gap || ''}
                      onChange={(e) => handleStyleChange('gap', e.target.value)}
                      placeholder="0px"
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-md p-2 text-xs text-zinc-200"
                    />
                  </div>
                </div>
              </PropertySection>
            )}
          </div>
        )}

        {rightPanelTab === 'animations' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-2 duration-200">
            <PropertySection title="Animation Timeline" icon={Activity}>
              <div className="space-y-4">
                <button
                  onClick={() => {
                    const newAnim = {
                      id: Math.random().toString(36).substr(2, 9),
                      type: 'fade',
                      duration: 0.5,
                      delay: 0,
                      ease: 'easeInOut'
                    };
                    updateElement(selectedElement.id, {
                      animations: [...(selectedElement.animations || []), newAnim]
                    });
                  }}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Animation
                </button>

                <div className="space-y-3">
                  {(selectedElement.animations || []).map((anim: any, index: number) => (
                    <div key={anim.id} className="p-3 bg-zinc-800 border border-zinc-700 rounded-xl space-y-3 relative group">
                      <button
                        onClick={() => {
                          const newAnims = selectedElement.animations.filter((a: any) => a.id !== anim.id);
                          updateElement(selectedElement.id, { animations: newAnims });
                        }}
                        className="absolute top-2 right-2 p-1 text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>

                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-blue-500/10 rounded flex items-center justify-center text-[10px] font-bold text-blue-400">
                          {index + 1}
                        </div>
                        <select
                          value={anim.type}
                          onChange={(e) => {
                            const newAnims = selectedElement.animations.map((a: any) => 
                              a.id === anim.id ? { ...a, type: e.target.value } : a
                            );
                            updateElement(selectedElement.id, { animations: newAnims });
                          }}
                          className="flex-1 bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-[10px] text-zinc-200"
                        >
                          <option value="fade">Fade In</option>
                          <option value="slide">Slide Up</option>
                          <option value="scale">Scale Up</option>
                          <option value="rotate">Rotate</option>
                          <option value="bounce">Bounce</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[9px] text-zinc-500 uppercase font-bold tracking-tighter">Duration (s)</label>
                          <input
                            type="number"
                            step="0.1"
                            value={anim.duration}
                            onChange={(e) => {
                              const newAnims = selectedElement.animations.map((a: any) => 
                                a.id === anim.id ? { ...a, duration: parseFloat(e.target.value) } : a
                              );
                              updateElement(selectedElement.id, { animations: newAnims });
                            }}
                            className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-[10px] text-zinc-200"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] text-zinc-500 uppercase font-bold tracking-tighter">Delay (s)</label>
                          <input
                            type="number"
                            step="0.1"
                            value={anim.delay}
                            onChange={(e) => {
                              const newAnims = selectedElement.animations.map((a: any) => 
                                a.id === anim.id ? { ...a, delay: parseFloat(e.target.value) } : a
                              );
                              updateElement(selectedElement.id, { animations: newAnims });
                            }}
                            className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-[10px] text-zinc-200"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </PropertySection>
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

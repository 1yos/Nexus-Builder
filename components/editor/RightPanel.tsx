'use client';

import React from 'react';
import { useBuilderStore, ComponentType, ElementInstance } from '@/store/useBuilderStore';
import { v4 as uuidv4 } from 'uuid';
import { COMPONENT_REGISTRY } from '@/lib/registry';
import { cn } from '@/lib/utils';
import { StyleInput } from './StyleInput';
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
    deviceMode,
    tokens,
    updateGlobalComponent,
    playingAnimationId,
    setPlayingAnimationId
  } = useBuilderStore();

  const [selectedState, setSelectedState] = React.useState<'default' | 'hover' | 'active' | 'focus'>('default');

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
            className={cn("p-2 rounded-md transition-colors", rightPanelTab === 'style' ? "text-accent-primary bg-accent-primary/10" : "text-zinc-500 hover:text-zinc-300")}
          >
            <Palette className="w-5 h-5" />
          </button>
          <button
            onClick={() => { setRightPanelTab('content'); setRightPanelCollapsed(false); }}
            className={cn("p-2 rounded-md transition-colors", rightPanelTab === 'content' ? "text-accent-primary bg-accent-primary/10" : "text-zinc-500 hover:text-zinc-300")}
          >
            <Settings2 className="w-5 h-5" />
          </button>
          <button
            onClick={() => { setRightPanelTab('layout'); setRightPanelCollapsed(false); }}
            className={cn("p-2 rounded-md transition-colors", rightPanelTab === 'layout' ? "text-accent-primary bg-accent-primary/10" : "text-zinc-500 hover:text-zinc-300")}
          >
            <LayoutIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => { setRightPanelTab('animations'); setRightPanelCollapsed(false); }}
            className={cn("p-2 rounded-md transition-colors", rightPanelTab === 'animations' ? "text-accent-primary bg-accent-primary/10" : "text-zinc-500 hover:text-zinc-300")}
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
    let stateStyles = {};
    if (selectedState === 'hover') stateStyles = selectedElement.hoverStyles || {};
    else if (selectedState === 'active') stateStyles = selectedElement.activeStyles || {};
    else if (selectedState === 'focus') stateStyles = selectedElement.focusStyles || {};

    const combinedBase = { ...baseStyles, ...stateStyles };
    if (deviceMode === 'desktop') return combinedBase;
    
    const responsive = selectedElement.responsiveStyles || {};
    if (deviceMode === 'tablet') {
      return { ...combinedBase, ...(responsive.tablet || {}) };
    }
    if (deviceMode === 'mobile') {
      return { ...combinedBase, ...(responsive.tablet || {}), ...(responsive.mobile || {}) };
    }
    return combinedBase;
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

    const styleKey = selectedState === 'default' ? 'styles' : `${selectedState}Styles`;
    
    if (deviceMode === 'desktop') {
      updateElement(selectedElement.id, {
        [styleKey]: { ...((selectedElement as any)[styleKey] || {}), [key]: value }
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

  const getAllElements = (items: ElementInstance[]): { id: string; name: string; type: string }[] => {
    let result: { id: string; name: string; type: string }[] = [];
    items.forEach(item => {
      result.push({ id: item.id, name: item.name || `${item.type} (${item.id.split('-')[0]})`, type: item.type });
      if (item.children) {
        result = [...result, ...getAllElements(item.children)];
      }
    });
    return result;
  };

  const allElements = getAllElements(elements);

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
          <div className="p-1.5 bg-accent-primary/10 rounded-md border border-accent-primary/20">
            {React.createElement(COMPONENT_REGISTRY[selectedElement.type as ComponentType].icon as any, { className: "w-3.5 h-3.5 text-accent-primary" })}
          </div>
          <div>
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-zinc-200">
              {COMPONENT_REGISTRY[selectedElement.type as ComponentType].label}
            </h2>
            <div className="flex items-center gap-1.5">
              <p className="text-[9px] text-zinc-500 font-mono uppercase tracking-tighter truncate max-w-[100px]">
                ID: {selectedElement.id}
              </p>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(selectedElement.id);
                  // Optional: show a toast or temporary icon change
                }}
                className="p-0.5 hover:bg-zinc-800 rounded text-zinc-600 hover:text-zinc-400 transition-colors"
                title="Copy full ID"
              >
                <Copy className="w-2.5 h-2.5" />
              </button>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {!selectedElement.isGlobal && (
            <button 
              onClick={() => {
                const name = prompt('Enter a name for this component:', selectedElement.name || `Global ${selectedElement.type}`);
                if (name) {
                  convertToGlobal(selectedElement.id, name);
                }
              }}
              className="p-1.5 hover:bg-accent-primary/10 text-zinc-500 hover:text-accent-primary rounded-md transition-all"
              title="Convert to Global Component"
            >
              <Globe className="w-3.5 h-3.5" />
            </button>
          )}
          <button 
            onClick={() => duplicateElement(selectedElement.id)}
            className="p-1.5 hover:bg-accent-primary/10 text-zinc-500 hover:text-accent-primary rounded-md transition-all"
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

      <div className="grid grid-cols-5 border-b border-zinc-800">
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
        <TabButton 
          active={rightPanelTab === 'interactions'} 
          onClick={() => setRightPanelTab('interactions')} 
          icon={MousePointer2} 
          label="Interactions" 
        />
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
        {rightPanelTab === 'content' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-2 duration-200">
            {selectedElement.isGlobal && (
              <PropertySection title="Global Component" icon={Box}>
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl space-y-2">
                  <p className="text-[10px] text-amber-200/70 leading-relaxed">
                    This is an instance of a global component. Editing styles here will update all instances.
                  </p>
                  {selectedElement.isMaster ? (
                    <div className="flex items-center gap-2 text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                      <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                      Master Instance
                    </div>
                  ) : (
                    <button 
                      onClick={() => {
                        // Logic to find and select master would go here
                        alert("Navigating to Master Component...");
                      }}
                      className="text-[10px] font-bold text-amber-400 uppercase hover:underline"
                    >
                      Go to Master
                    </button>
                  )}
                </div>
              </PropertySection>
            )}

            <PropertySection title="Component Settings" icon={Settings2}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Component Name</label>
                  <input
                    type="text"
                    value={selectedElement.name || ''}
                    onChange={(e) => updateElement(selectedElement.id, { name: e.target.value })}
                    placeholder={`${selectedElement.type} name...`}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-md p-2 text-xs text-zinc-200 focus:outline-none focus:ring-1 focus:ring-accent-primary"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Mark as Slot</label>
                  <button
                    onClick={() => updateElement(selectedElement.id, { isSlot: !selectedElement.isSlot })}
                    className={cn(
                      "w-10 h-5 rounded-full transition-all relative",
                      selectedElement.isSlot ? "bg-accent-primary" : "bg-zinc-700"
                    )}
                  >
                    <div className={cn(
                      "absolute top-1 w-3 h-3 bg-white rounded-full transition-all",
                      selectedElement.isSlot ? "left-6" : "left-1"
                    )} />
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Variants</label>
                    <button
                      onClick={() => {
                        const newVariant = {
                          id: uuidv4(),
                          name: `Variant ${((selectedElement.variants || []).length + 1)}`,
                          styles: { ...selectedElement.styles }
                        };
                        updateElement(selectedElement.id, {
                          variants: [...(selectedElement.variants || []), newVariant]
                        });
                      }}
                      className="p-1 hover:bg-zinc-800 rounded text-zinc-400 hover:text-zinc-200"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    {(selectedElement.variants || []).map((variant: any) => (
                      <div key={variant.id} className="flex items-center gap-2 p-2 bg-zinc-800 rounded-lg border border-zinc-700">
                        <input
                          type="text"
                          value={variant.name}
                          onChange={(e) => {
                            const newVariants = selectedElement.variants.map((v: any) => 
                              v.id === variant.id ? { ...v, name: e.target.value } : v
                            );
                            updateElement(selectedElement.id, { variants: newVariants });
                          }}
                          className="flex-1 bg-transparent text-[10px] text-zinc-200 focus:outline-none"
                        />
                        <button
                          onClick={() => updateElement(selectedElement.id, { activeVariantId: variant.id, styles: { ...variant.styles } })}
                          className={cn(
                            "px-2 py-1 rounded text-[9px] font-bold uppercase transition-all",
                            selectedElement.activeVariantId === variant.id ? "bg-accent-primary text-white" : "bg-zinc-700 text-zinc-400 hover:text-zinc-200"
                          )}
                        >
                          Apply
                        </button>
                        <button
                          onClick={() => {
                            const newVariants = selectedElement.variants.filter((v: any) => v.id !== variant.id);
                            updateElement(selectedElement.id, { variants: newVariants });
                          }}
                          className="p-1 text-zinc-600 hover:text-red-400"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </PropertySection>

            {selectedElement.props.text !== undefined && (
              <PropertySection title="Text Content" icon={TypeIcon}>
                <textarea
                  value={selectedElement.props.text}
                  onChange={(e) => handlePropChange('text', e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-md p-2.5 text-xs text-zinc-200 focus:outline-none focus:ring-1 focus:ring-accent-primary min-h-[100px] resize-none"
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

                  <div className="pt-4 border-t border-zinc-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Navbar Links</label>
                      <button
                        onClick={() => {
                          const newLink = { id: uuidv4(), label: 'New Link', href: '/', type: 'internal' };
                          handlePropChange('links', [...(selectedElement.props.links || []), newLink]);
                        }}
                        className="p-1 hover:bg-zinc-800 rounded text-zinc-400 hover:text-zinc-200"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <p className="text-[9px] text-zinc-500 italic">If empty, all pages will be shown automatically.</p>
                    <div className="space-y-2">
                      {(selectedElement.props.links || []).map((link: any, index: number) => (
                        <div key={link.id || `link-${index}`} className="p-2 bg-zinc-800 rounded-lg border border-zinc-700 space-y-2">
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={link.label}
                              onChange={(e) => {
                                const newLinks = [...selectedElement.props.links];
                                newLinks[index] = { ...link, label: e.target.value };
                                handlePropChange('links', newLinks);
                              }}
                              className="flex-1 bg-transparent text-[10px] text-zinc-200 focus:outline-none"
                              placeholder="Link Label"
                            />
                            <button
                              onClick={() => {
                                const newLinks = selectedElement.props.links.filter((l: any) => l.id !== link.id);
                                handlePropChange('links', newLinks);
                              }}
                              className="p-1 text-zinc-600 hover:text-red-400"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                          <div className="flex gap-2">
                            <select
                              value={link.type || 'internal'}
                              onChange={(e) => {
                                const newLinks = [...selectedElement.props.links];
                                newLinks[index] = { ...link, type: e.target.value };
                                handlePropChange('links', newLinks);
                              }}
                              className="bg-zinc-900 border border-zinc-700 rounded px-1 py-0.5 text-[9px] text-zinc-400"
                            >
                              <option value="internal">Page</option>
                              <option value="external">URL</option>
                            </select>
                            {link.type === 'internal' ? (
                              <select
                                value={link.href}
                                onChange={(e) => {
                                  const newLinks = [...selectedElement.props.links];
                                  newLinks[index] = { ...link, href: e.target.value };
                                  handlePropChange('links', newLinks);
                                }}
                                className="flex-1 bg-zinc-900 border border-zinc-700 rounded px-1 py-0.5 text-[9px] text-zinc-200"
                              >
                                <option value="">Select a page...</option>
                                {pages.map(p => (
                                  <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                              </select>
                            ) : (
                              <input
                                type="text"
                                value={link.href}
                                onChange={(e) => {
                                  const newLinks = [...selectedElement.props.links];
                                  newLinks[index] = { ...link, href: e.target.value };
                                  handlePropChange('links', newLinks);
                                }}
                                className="flex-1 bg-zinc-900 border border-zinc-700 rounded px-1 py-0.5 text-[9px] text-zinc-200"
                                placeholder="https://..."
                              />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-zinc-800">
                    <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider block mb-2">Mobile Menu</label>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <StyleInput
                          label="Hamburger Color"
                          type="color"
                          value={selectedElement.props.hamburgerColor || ''}
                          onChange={(val) => handlePropChange('hamburgerColor', val)}
                          placeholder="#000000"
                        />
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
                          ? "bg-accent-primary/10 border-accent-primary text-accent-primary" 
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
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-md p-2 text-xs text-zinc-200 focus:outline-none focus:ring-1 focus:ring-accent-primary"
                    placeholder="https://images.unsplash.com/..."
                  />
                  <input
                    type="text"
                    value={selectedElement.props.alt || ''}
                    onChange={(e) => handlePropChange('alt', e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-md p-2 text-xs text-zinc-200 focus:outline-none focus:ring-1 focus:ring-accent-primary"
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
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-md p-2 text-xs text-zinc-200 focus:outline-none focus:ring-1 focus:ring-accent-primary"
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
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-md p-2 text-xs text-zinc-200 focus:outline-none focus:ring-1 focus:ring-accent-primary"
                    />
                  )}
                </div>
              </PropertySection>
            )}
          </div>
        )}

        {rightPanelTab === 'style' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-2 duration-200">
            <div className="space-y-2">
              <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Visual State</label>
              <div className="flex bg-zinc-800 rounded-md p-1 border border-zinc-700">
                {['default', 'hover', 'active', 'focus'].map((state) => (
                  <button
                    key={state}
                    onClick={() => setSelectedState(state as any)}
                    className={cn(
                      "flex-1 py-1 text-[10px] uppercase font-bold rounded transition-all",
                      selectedState === state ? "bg-zinc-700 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"
                    )}
                  >
                    {state}
                  </button>
                ))}
              </div>
            </div>

            <PropertySection title="Typography" icon={TypeIcon}>
              <div className="grid grid-cols-2 gap-3">
                <StyleInput
                  label="Size"
                  type="font"
                  value={currentStyles.fontSize || ''}
                  onChange={(val) => handleStyleChange('fontSize', val)}
                  placeholder="16px"
                />
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
              <StyleInput
                label="Color"
                type="color"
                value={currentStyles.color || ''}
                onChange={(val) => handleStyleChange('color', val)}
                placeholder="#000000"
              />
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
                <StyleInput
                  label="Background"
                  type="color"
                  value={currentStyles.backgroundColor || ''}
                  onChange={(val) => handleStyleChange('backgroundColor', val)}
                  placeholder="transparent"
                />

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
                  <StyleInput
                    label="Radius"
                    type="radius"
                    value={currentStyles.borderRadius || ''}
                    onChange={(val) => handleStyleChange('borderRadius', val)}
                    placeholder="0px"
                  />
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
                <StyleInput
                  label="Padding"
                  type="spacing"
                  value={currentStyles.padding || ''}
                  onChange={(val) => handleStyleChange('padding', val)}
                  placeholder="0px"
                />
                <StyleInput
                  label="Margin"
                  type="spacing"
                  value={currentStyles.margin || ''}
                  onChange={(val) => handleStyleChange('margin', val)}
                  placeholder="0px"
                />
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
                          currentStyles.flexDirection === 'row' ? "bg-accent-primary/10 border-accent-primary text-accent-primary" : "bg-zinc-800 border-zinc-700 text-zinc-500"
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
                          currentStyles.flexDirection === 'column' ? "bg-accent-primary/10 border-accent-primary text-accent-primary" : "bg-zinc-800 border-zinc-700 text-zinc-500"
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
                            currentStyles.justifyContent === item.id ? "bg-accent-primary/10 border-accent-primary text-accent-primary" : "bg-zinc-800 border-zinc-700 text-zinc-500"
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
                            currentStyles.alignItems === item.id ? "bg-accent-primary/10 border-accent-primary text-accent-primary" : "bg-zinc-800 border-zinc-700 text-zinc-500"
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
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const newAnim = {
                        id: uuidv4(),
                        type: 'fade',
                        duration: 0.6,
                        delay: 0,
                        ease: 'easeOut',
                        trigger: 'load'
                      };
                      updateElement(selectedElement.id, {
                        animations: [...(selectedElement.animations || []), newAnim]
                      });
                    }}
                    className="flex-1 py-2 bg-accent-primary hover:bg-accent-primary text-white rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Animation
                  </button>
                  {selectedElement.animations && selectedElement.animations.length > 0 && (
                    <button
                      onClick={() => {
                        // Play the first load animation as a preview
                        const loadAnim = selectedElement.animations.find((a: any) => a.trigger === 'load' || !a.trigger);
                        if (loadAnim) setPlayingAnimationId(loadAnim.id);
                      }}
                      className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all border border-zinc-700"
                    >
                      <Activity className="w-3.5 h-3.5" />
                      Play All
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  {(selectedElement.animations || []).map((anim: any, index: number) => (
                    <div key={anim.id} className="p-3 bg-zinc-800 border border-zinc-700 rounded-xl space-y-3 relative group">
                      <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                        <button
                          onClick={() => setPlayingAnimationId(anim.id)}
                          className="p-1 text-zinc-400 hover:text-accent-primary hover:bg-accent-primary/10 rounded transition-all"
                          title="Preview Animation"
                        >
                          <Activity className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => {
                            const newAnims = selectedElement.animations.filter((a: any) => a.id !== anim.id);
                            updateElement(selectedElement.id, { animations: newAnims });
                          }}
                          className="p-1 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-all"
                          title="Delete Animation"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[9px] text-zinc-500 uppercase font-bold tracking-tighter">Type</label>
                        <select
                          value={anim.type}
                          onChange={(e) => {
                            const newAnims = selectedElement.animations.map((a: any) => 
                              a.id === anim.id ? { ...a, type: e.target.value } : a
                            );
                            updateElement(selectedElement.id, { animations: newAnims });
                          }}
                          className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1.5 text-[10px] text-zinc-200"
                        >
                          <option value="fade">Fade In</option>
                          <option value="slide-up">Slide Up</option>
                          <option value="slide-down">Slide Down</option>
                          <option value="slide-left">Slide Left</option>
                          <option value="slide-right">Slide Right</option>
                          <option value="scale">Scale Up</option>
                          <option value="rotate">Rotate In</option>
                          <option value="flip">Flip</option>
                          <option value="bounce">Bounce</option>
                          <option value="pulse">Pulse</option>
                          <option value="float">Float (Infinite)</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[9px] text-zinc-500 uppercase font-bold tracking-tighter">Trigger</label>
                          <select
                            value={anim.trigger || 'load'}
                            onChange={(e) => {
                              const newAnims = selectedElement.animations.map((a: any) => 
                                a.id === anim.id ? { ...a, trigger: e.target.value } : a
                              );
                              updateElement(selectedElement.id, { animations: newAnims });
                            }}
                            className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1.5 text-[10px] text-zinc-200"
                          >
                            <option value="load">On Load</option>
                            <option value="scroll">On Scroll</option>
                            <option value="hover">On Hover</option>
                            <option value="click">On Click</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] text-zinc-500 uppercase font-bold tracking-tighter">Easing</label>
                          <select
                            value={anim.ease || 'easeOut'}
                            onChange={(e) => {
                              const newAnims = selectedElement.animations.map((a: any) => 
                                a.id === anim.id ? { ...a, ease: e.target.value } : a
                              );
                              updateElement(selectedElement.id, { animations: newAnims });
                            }}
                            className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1.5 text-[10px] text-zinc-200"
                          >
                            <option value="linear">Linear</option>
                            <option value="easeIn">Ease In</option>
                            <option value="easeOut">Ease Out</option>
                            <option value="easeInOut">Ease In Out</option>
                            <option value="backIn">Back In</option>
                            <option value="backOut">Back Out</option>
                            <option value="anticipate">Anticipate</option>
                          </select>
                        </div>
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
                            className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1.5 text-[10px] text-zinc-200"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] text-zinc-500 uppercase font-bold tracking-tighter">Intensity</label>
                          <input
                            type="number"
                            step="0.1"
                            value={anim.intensity || 1}
                            onChange={(e) => {
                              const newAnims = selectedElement.animations.map((a: any) => 
                                a.id === anim.id ? { ...a, intensity: parseFloat(e.target.value) } : a
                              );
                              updateElement(selectedElement.id, { animations: newAnims });
                            }}
                            className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1.5 text-[10px] text-zinc-200"
                          />
                        </div>
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
                          className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1.5 text-[10px] text-zinc-200"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </PropertySection>
          </div>
        )}

        {rightPanelTab === 'interactions' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-2 duration-200">
            <PropertySection title="Interaction Logic" icon={MousePointer2}>
              <div className="space-y-4">
                <button
                  onClick={() => {
                    const newInteraction = {
                      id: uuidv4(),
                      trigger: 'click',
                      action: 'show',
                    };
                    updateElement(selectedElement.id, {
                      interactions: [...(selectedElement.interactions || []), newInteraction]
                    });
                  }}
                  className="w-full py-2 bg-accent-primary hover:bg-accent-primary text-white rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Interaction
                </button>

                <div className="space-y-3">
                  {(selectedElement.interactions || []).map((interaction: any) => (
                    <div key={interaction.id} className="p-3 bg-zinc-800 border border-zinc-700 rounded-xl space-y-3 relative group">
                      <button
                        onClick={() => {
                          const newInteractions = selectedElement.interactions.filter((i: any) => i.id !== interaction.id);
                          updateElement(selectedElement.id, { interactions: newInteractions });
                        }}
                        className="absolute top-2 right-2 p-1 text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>

                      <div className="space-y-2">
                        <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Trigger</label>
                        <select
                          value={interaction.trigger}
                          onChange={(e) => {
                            const newInteractions = selectedElement.interactions.map((i: any) => 
                              i.id === interaction.id ? { ...i, trigger: e.target.value } : i
                            );
                            updateElement(selectedElement.id, { interactions: newInteractions });
                          }}
                          className="w-full bg-zinc-900 border border-zinc-700 rounded-md p-2 text-xs text-zinc-200"
                        >
                          <option value="click">On Click</option>
                          <option value="hover">On Hover</option>
                          <option value="scroll">On Scroll</option>
                          <option value="load">On Load</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Action</label>
                        <select
                          value={interaction.action}
                          onChange={(e) => {
                            const newInteractions = selectedElement.interactions.map((i: any) => 
                              i.id === interaction.id ? { ...i, action: e.target.value } : i
                            );
                            updateElement(selectedElement.id, { interactions: newInteractions });
                          }}
                          className="w-full bg-zinc-900 border border-zinc-700 rounded-md p-2 text-xs text-zinc-200"
                        >
                          <option value="show">Show Element</option>
                          <option value="hide">Hide Element</option>
                          <option value="scroll-to">Scroll To</option>
                          <option value="navigate">Navigate to Page</option>
                          <option value="open-modal">Open Modal</option>
                        </select>
                      </div>

                      {['show', 'hide', 'scroll-to'].includes(interaction.action) && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Target Element</label>
                            <button 
                              onClick={() => {
                                const isManual = interaction.useManualId;
                                const newInteractions = selectedElement.interactions.map((i: any) => 
                                  i.id === interaction.id ? { ...i, useManualId: !isManual } : i
                                );
                                updateElement(selectedElement.id, { interactions: newInteractions });
                              }}
                              className="text-[8px] font-bold text-accent-primary uppercase hover:underline"
                            >
                              {interaction.useManualId ? 'Use List' : 'Manual ID'}
                            </button>
                          </div>
                          
                          {interaction.useManualId ? (
                            <input
                              type="text"
                              value={interaction.targetId || ''}
                              onChange={(e) => {
                                const newInteractions = selectedElement.interactions.map((i: any) => 
                                  i.id === interaction.id ? { ...i, targetId: e.target.value } : i
                                );
                                updateElement(selectedElement.id, { interactions: newInteractions });
                              }}
                              placeholder="Paste element ID here..."
                              className="w-full bg-zinc-900 border border-zinc-700 rounded-md p-2 text-xs text-zinc-200 focus:outline-none focus:ring-1 focus:ring-accent-primary"
                            />
                          ) : (
                            <select
                              value={interaction.targetId || ''}
                              onChange={(e) => {
                                const newInteractions = selectedElement.interactions.map((i: any) => 
                                  i.id === interaction.id ? { ...i, targetId: e.target.value } : i
                                );
                                updateElement(selectedElement.id, { interactions: newInteractions });
                              }}
                              className="w-full bg-zinc-900 border border-zinc-700 rounded-md p-2 text-xs text-zinc-200"
                            >
                              <option value="">Select element...</option>
                              <option value={selectedElement.id}>Self ({selectedElement.type})</option>
                              {allElements
                                .filter(el => el.id !== selectedElement.id)
                                .map(el => (
                                  <option key={el.id} value={el.id}>{el.name}</option>
                                ))
                              }
                            </select>
                          )}
                        </div>
                      )}

                      {interaction.action === 'navigate' && (
                        <div className="space-y-2">
                          <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Target Page</label>
                          <select
                            value={interaction.value || ''}
                            onChange={(e) => {
                              const newInteractions = selectedElement.interactions.map((i: any) => 
                                i.id === interaction.id ? { ...i, value: e.target.value } : i
                              );
                              updateElement(selectedElement.id, { interactions: newInteractions });
                            }}
                            className="w-full bg-zinc-900 border border-zinc-700 rounded-md p-2 text-xs text-zinc-200"
                          >
                            <option value="">Select page...</option>
                            {pages.map(page => (
                              <option key={page.id} value={page.id}>{page.name}</option>
                            ))}
                          </select>
                        </div>
                      )}
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
        "flex flex-col items-center justify-center gap-1 py-2.5 transition-all relative overflow-hidden",
        active ? "text-accent-primary" : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50"
      )}
    >
      <Icon className="w-3.5 h-3.5 shrink-0" />
      <span className="text-[8px] font-bold uppercase tracking-tighter truncate w-full text-center px-0.5">{label}</span>
      {active && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-primary" />}
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

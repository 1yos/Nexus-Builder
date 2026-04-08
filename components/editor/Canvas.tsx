'use client';

import React from 'react';
import NextImage from 'next/image';
import { useBuilderStore, ElementInstance } from '@/store/useBuilderStore';
import { useDroppable, useDraggable } from '@dnd-kit/core';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from 'motion/react';
import { COMPONENT_REGISTRY } from '@/lib/registry';
import { cn } from '@/lib/utils';
import { HTMLRenderer } from './HTMLRenderer';
import { 
  Trash2, 
  Copy, 
  Move, 
  Edit3, 
  Lock, 
  EyeOff, 
  Menu, 
  X, 
  ChevronUp, 
  ChevronDown, 
  ArrowUpToLine, 
  ArrowDownToLine,
  Activity,
  Shield,
  Smartphone,
  Star,
  CheckCircle,
  Clock,
  Heart,
  Globe,
  Layout,
  Plus,
  Type,
  Image as ImageIcon,
  MousePointer2,
  Navigation,
  LayoutTemplate,
  CreditCard,
  ListTodo,
  Square,
  Columns,
  Rows,
  Text as TextIcon
} from 'lucide-react';

const LUCIDE_ICONS: Record<string, any> = {
  Activity, Shield, Smartphone, Star, CheckCircle, Clock, Heart, Globe, Layout, Type, ImageIcon, MousePointer2, Navigation, LayoutTemplate, CreditCard, ListTodo, Square, Columns, Rows, TextIcon
};

const findElement = (items: ElementInstance[], id: string): ElementInstance | null => {
  for (const item of items) {
    if (item.id === id) return item;
    if (item.children) {
      const found = findElement(item.children, id);
      if (found) return found;
    }
  }
  return null;
};

export default function Canvas() {
  const { 
    elements, 
    deviceMode, 
    selectedElementId, 
    hoveredElementId,
    selectElement, 
    setHoveredElementId,
    isPreview, 
    zoom, 
    setZoom,
    pan,
    setPan,
    tokens,
    isolatedElementId,
    setIsolatedElementId,
    showOutlines,
    setShowOutlines,
    showEmptySlots,
    setShowEmptySlots,
    pages,
    folders,
    updateElement,
    collections,
    entries,
    setActivePage,
    activePageId,
    showGrid,
    copyElement,
    pasteElement,
    duplicateElement,
    removeElement,
    moveElement,
    clipboard
  } = useBuilderStore();

  const [contextMenu, setContextMenu] = React.useState<{ x: number, y: number, elementId: string } | null>(null);

  const handleContextMenu = (e: React.MouseEvent, elementId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY, elementId });
    selectElement(elementId);
  };

  React.useEffect(() => {
    const handleClick = () => setContextMenu(null);
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  const activePage = pages.find(p => p.id === activePageId);
  const isDynamicPage = activePage?.isDynamic;
  const dynamicCollectionId = activePage?.collectionId;
  const firstEntry = entries.find(e => e.collectionId === dynamicCollectionId);

  const elementsToRender = React.useMemo(() => {
    if (!isolatedElementId) return elements;
    
    const findInTree = (items: ElementInstance[], id: string): ElementInstance | null => {
      for (const item of items) {
        if (item.id === id) return item;
        if (item.children) {
          const found = findInTree(item.children, id);
          if (found) return found;
        }
      }
      return null;
    };
    
    const isolated = findInTree(elements, isolatedElementId);
    return isolated ? [isolated] : elements;
  }, [elements, isolatedElementId]);

  const tokenStyles = React.useMemo(() => {
    const styles: Record<string, string> = {};
    tokens.forEach(token => {
      if (token.type === 'typography') {
        styles[`--token-${token.id}-font-size`] = token.fontSize || 'inherit';
        styles[`--token-${token.id}-font-weight`] = token.fontWeight || 'inherit';
        styles[`--token-${token.id}-font-family`] = token.fontFamily || 'inherit';
      } else {
        styles[`--token-${token.id}`] = token.value;
      }
    });
    return styles;
  }, [tokens]);

  const { setNodeRef, isOver } = useDroppable({
    id: 'canvas-root',
    data: {
      isCanvas: true,
    },
    disabled: isPreview,
  });

  // Handle Zoom with Ctrl + Scroll
  React.useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        setZoom(Math.min(Math.max(zoom + delta, 0.25), 2));
      }
    };
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [zoom, setZoom]);

  // Handle Pan with Space + Drag
  const [isPanning, setIsPanning] = React.useState(false);
  React.useEffect(() => {
    const resizeObserverErr = (e: any) => {
      const message = e.message || (e.reason && e.reason.message) || '';
      if (typeof message === 'string' && (message.includes('ResizeObserver loop') || message.includes('ResizeObserver loop limit exceeded'))) {
        e.stopImmediatePropagation();
        e.preventDefault();
      }
    };
    window.addEventListener('error', resizeObserverErr, { capture: true });
    window.addEventListener('unhandledrejection', resizeObserverErr, { capture: true });
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') setIsPanning(true);
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') setIsPanning(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('error', resizeObserverErr, { capture: true });
      window.removeEventListener('unhandledrejection', resizeObserverErr, { capture: true });
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isPanning) {
      const startX = e.clientX - pan.x;
      const startY = e.clientY - pan.y;

      const handleMouseMove = (moveEvent: MouseEvent) => {
        setPan({
          x: moveEvent.clientX - startX,
          y: moveEvent.clientY - startY
        });
      };

      const handleMouseUp = () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };

      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
  };

  const getCanvasWidth = () => {
    switch (deviceMode) {
      case 'tablet': return '768px';
      case 'mobile': return '375px';
      default: return '100%';
    }
  };

  return (
    <main 
      className={cn(
        "flex-1 bg-zinc-950 overflow-hidden flex flex-col items-center custom-scrollbar relative",
        isPanning ? "cursor-grab active:cursor-grabbing" : "cursor-default"
      )}
      onMouseDown={handleMouseDown}
    >
      {!isPreview && (
        <div className="absolute top-4 left-4 z-40 flex items-center gap-2 bg-zinc-900/80 backdrop-blur-md border border-zinc-800 p-1 rounded-lg shadow-xl">
          <button 
            onClick={() => setShowOutlines(!showOutlines)}
            className={cn(
              "px-2 py-1 text-[9px] font-bold uppercase tracking-tighter rounded transition-all",
              showOutlines ? "bg-accent-primary text-white" : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            Outlines
          </button>
          <button 
            onClick={() => setShowEmptySlots(!showEmptySlots)}
            className={cn(
              "px-2 py-1 text-[9px] font-bold uppercase tracking-tighter rounded transition-all",
              showEmptySlots ? "bg-accent-primary text-white" : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            Slots
          </button>
        </div>
      )}

      <div 
        className="flex-1 w-full h-full overflow-auto flex flex-col items-center p-20 custom-scrollbar"
        style={{ 
          perspective: '1000px',
        }}
      >
        <motion.div
          layout
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          style={{ 
            width: getCanvasWidth(),
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'top center',
            ...tokenStyles
          }}
          className={cn(
            "min-h-[80vh] bg-white text-zinc-900 shadow-2xl transition-all relative",
            !isPreview && "rounded-sm",
            isOver && !isPreview && "ring-2 ring-accent-primary ring-inset"
          )}
          ref={setNodeRef}
          onClick={(e) => {
            if (isPreview) return;
            if (e.target === e.currentTarget) selectElement(null);
          }}
        >
          {!isPreview && (
            <>
              {/* 8px Grid Pattern */}
              <div 
                className={cn(
                  "absolute inset-0 pointer-events-none transition-opacity duration-300",
                  showGrid ? "opacity-[0.08]" : "opacity-0"
                )}
                style={{ 
                  backgroundImage: `
                    linear-gradient(to right, #000 1px, transparent 1px),
                    linear-gradient(to bottom, #000 1px, transparent 1px)
                  `,
                  backgroundSize: '20px 20px'
                }}
              />
              
              {/* Container Guides */}
              <div className="absolute inset-y-0 left-1/2 -translate-x-[600px] w-px bg-accent-primary/10 pointer-events-none hidden xl:block" />
              <div className="absolute inset-y-0 left-1/2 translate-x-[600px] w-px bg-accent-primary/10 pointer-events-none hidden xl:block" />
            </>
          )}

          <AnimatePresence>
            {isolatedElementId && (
              <div key="isolation-badge" className="absolute top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-3 py-1.5 bg-accent-primary text-white text-[10px] font-bold rounded-full shadow-lg">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                Isolation Mode
                <button 
                  onClick={() => setIsolatedElementId(null)}
                  className="ml-2 hover:text-accent-primary transition-colors"
                >
                  Exit
                </button>
              </div>
            )}
            {elementsToRender.length === 0 ? (
              <div key="empty-canvas" className="h-[70vh] flex flex-col items-center justify-center text-zinc-300 p-12 text-center">
                <div className="w-20 h-20 border-2 border-dashed border-zinc-200 rounded-2xl mb-6 flex items-center justify-center bg-zinc-50">
                  <div className="w-10 h-10 bg-accent-primary/10 rounded-full flex items-center justify-center">
                    <div className="w-4 h-4 bg-accent-primary rounded-sm rotate-45" />
                  </div>
                </div>
                <h3 className="text-zinc-900 font-bold text-2xl tracking-tight">Start your masterpiece</h3>
                <p className="text-zinc-500 text-sm mt-3 max-w-xs leading-relaxed">
                  Drag components from the left panel and drop them here. Use sections to organize your layout.
                </p>
              </div>
            ) : (
              <React.Fragment key="canvas-content">
                <DropIndicator key="drop-indicator-root-0" index={0} />
                {elementsToRender.map((element, idx) => (
                  <React.Fragment key={element.id}>
                    <RenderElement 
                      element={element} 
                      index={idx} 
                      onContextMenu={(e) => handleContextMenu(e, element.id)}
                    />
                    <DropIndicator index={idx + 1} />
                  </React.Fragment>
                ))}
              </React.Fragment>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
      {contextMenu && (
        <div 
          className="fixed z-[100] bg-zinc-900 border border-zinc-800 rounded-lg shadow-2xl py-1 min-w-[160px] backdrop-blur-md"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onClick={(e) => e.stopPropagation()}
        >
          <ContextMenuItem 
            icon={Copy} 
            label="Copy" 
            onClick={() => { copyElement(contextMenu.elementId); setContextMenu(null); }} 
          />
          <ContextMenuItem 
            icon={Copy} 
            label="Paste" 
            disabled={!clipboard}
            onClick={() => { pasteElement(); setContextMenu(null); }} 
          />
          <ContextMenuItem 
            icon={Copy} 
            label="Duplicate" 
            onClick={() => { duplicateElement(contextMenu.elementId); setContextMenu(null); }} 
          />
          <ContextMenuItem 
            icon={ArrowUpToLine} 
            label="Move to Top" 
            onClick={() => { moveElement(contextMenu.elementId, 'top'); setContextMenu(null); }} 
          />
          <ContextMenuItem 
            icon={ArrowDownToLine} 
            label="Move to Bottom" 
            onClick={() => { moveElement(contextMenu.elementId, 'bottom'); setContextMenu(null); }} 
          />
          <div className="h-px bg-zinc-800 my-1 mx-1" />
          <ContextMenuItem 
            icon={Lock} 
            label="Lock / Unlock" 
            onClick={() => { 
              const el = findElement(elements, contextMenu.elementId);
              if (el) updateElement(contextMenu.elementId, { locked: !el.locked });
              setContextMenu(null); 
            }} 
          />
          <ContextMenuItem 
            icon={Trash2} 
            label="Delete" 
            danger
            onClick={() => { removeElement(contextMenu.elementId); setContextMenu(null); }} 
          />
        </div>
      )}
    </main>
  );
}

function ContextMenuItem({ icon: Icon, label, onClick, danger, disabled }: { icon: any, label: string, onClick: () => void, danger?: boolean, disabled?: boolean }) {
  return (
    <button 
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        if (!disabled) onClick();
      }}
      className={cn(
        "w-full flex items-center gap-2 px-3 py-1.5 text-[11px] font-medium transition-colors",
        danger ? "text-red-400 hover:bg-red-500/10" : "text-zinc-300 hover:bg-zinc-800 hover:text-white",
        disabled && "opacity-30 cursor-not-allowed grayscale"
      )}
    >
      <Icon className="w-3.5 h-3.5" />
      {label}
    </button>
  );
}

function DropIndicator({ parentId, index }: { parentId?: string; index: number }) {
  const { isPreview } = useBuilderStore();
  const { setNodeRef, isOver } = useDroppable({
    id: `drop-indicator-${parentId || 'root'}-${index}`,
    data: {
      isDropIndicator: true,
      parentId,
      index,
    },
    disabled: isPreview,
  });

  if (isPreview) return null;

  return (
    <div 
      ref={setNodeRef}
      className={cn(
        "h-1.5 w-full transition-all duration-300 relative z-50",
        isOver ? "bg-accent-primary opacity-100 my-3 scale-y-125 shadow-[0_0_15px_var(--accent-primary)]" : "opacity-0 hover:opacity-20"
      )}
    >
      {isOver && (
        <div className="absolute -left-1 -top-1 w-3 h-3 bg-accent-primary rounded-full animate-ping opacity-75" />
      )}
    </div>
  );
}

function RenderElement({ 
  element, 
  index, 
  parentId, 
  onContextMenu 
}: { 
  element: ElementInstance; 
  index: number; 
  parentId?: string;
  onContextMenu?: (e: React.MouseEvent) => void;
}) {
  const { 
    selectElement, 
    selectedElementId, 
    hoveredElementId,
    setHoveredElementId,
    setActivePage, 
    pages, 
    isPreview, 
    updateElement,
    removeElement,
    duplicateElement,
    deviceMode,
    moveElement,
    elements,
    folders,
    showOutlines,
    showEmptySlots,
    playingAnimationId,
    setPlayingAnimationId,
    entries,
    collections
  } = useBuilderStore();
  
  const [isEditing, setIsEditing] = React.useState(false);
  const [textValue, setTextValue] = React.useState(element.props.text || '');
  const [openDropdownId, setOpenDropdownId] = React.useState<string | null>(null);

  React.useEffect(() => {
    const handleClickOutside = () => setOpenDropdownId(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);
  
  const isSelected = selectedElementId === element.id;
  const isHovered = hoveredElementId === element.id;
  const definition = COMPONENT_REGISTRY[element.type];

  const { setNodeRef, isOver } = useDroppable({
    id: element.id,
    data: {
      isContainer: definition.isContainer,
      element,
    },
    disabled: !definition.isContainer || isPreview || element.locked,
  });
  
  const { 
    attributes, 
    listeners, 
    setNodeRef: setDraggableRef, 
    isDragging 
  } = useDraggable({
    id: element.id,
    data: {
      type: element.type,
      element,
      isLibraryItem: false,
    },
    disabled: isPreview || element.locked,
  });

  const getBoundValue = () => {
    return null;
  };

  const boundValue = getBoundValue();

  const executeInteraction = (interaction: any) => {
    if (!interaction.targetId) return;
    
    if (interaction.action === 'show') {
      updateElement(interaction.targetId, { styles: { ...((findElement(elements, interaction.targetId) || {}).styles || {}), display: 'block' } });
    } else if (interaction.action === 'hide') {
      updateElement(interaction.targetId, { styles: { ...((findElement(elements, interaction.targetId) || {}).styles || {}), display: 'none' } });
    } else if (interaction.action === 'scroll-to') {
      const target = document.getElementById(interaction.targetId);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (isPreview) {
      const clickInteractions = element.interactions?.filter(i => i.trigger === 'click') || [];
      clickInteractions.forEach(executeInteraction);
      return;
    }
    if (element.locked) return;
    e.stopPropagation();
    selectElement(element.id);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    if (isPreview || element.locked) return;
    const editableTypes = ['heading', 'paragraph', 'button'];
    if (editableTypes.includes(element.type)) {
      e.stopPropagation();
      setIsEditing(true);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTextValue(e.target.value);
  };

  const handleTextBlur = () => {
    setIsEditing(false);
    updateElement(element.id, { props: { ...element.props, text: textValue } });
  };

  const handleLinkClick = (e: React.MouseEvent, href: string, type: string) => {
    const isInternalPage = pages.some(p => p.id === href);
    if (type === 'internal' || isInternalPage) {
      e.preventDefault();
      setActivePage(href);
    } else {
      e.preventDefault();
      if (isPreview && href && href !== '#') {
        window.open(href, '_blank');
      }
    }
  };

  const getMergedStyles = () => {
    const baseStyles = element.styles || {};
    if (isPreview || deviceMode === 'desktop') return baseStyles;
    
    const responsive = element.responsiveStyles || {};
    if (deviceMode === 'tablet') {
      return { ...baseStyles, ...(responsive.tablet || {}) };
    }
    if (deviceMode === 'mobile') {
      return { ...baseStyles, ...(responsive.tablet || {}), ...(responsive.mobile || {}) };
    }
    return baseStyles;
  };

  const style = {
    ...getMergedStyles(),
    backgroundImage: element.styles.backgroundImage ? `url(${element.styles.backgroundImage})` : undefined,
    pointerEvents: element.locked ? 'none' : undefined,
    opacity: isDragging ? 0.4 : undefined,
  } as React.CSSProperties;

  const actionButtons = !isPreview && isSelected && (
    <div className="absolute -top-10 right-0 flex items-center gap-1 bg-accent-primary p-1 rounded-lg shadow-xl shadow-accent-primary/40 z-[100]">
      <button 
        onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
        className="p-1.5 hover:bg-white/20 rounded transition-colors text-white"
        title="Edit Text"
      >
        <Edit3 className="w-3.5 h-3.5" />
      </button>
      <button 
        onClick={(e) => { e.stopPropagation(); duplicateElement(element.id); }}
        className="p-1.5 hover:bg-white/20 rounded transition-colors text-white"
        title="Duplicate"
      >
        <Copy className="w-3.5 h-3.5" />
      </button>
      <div className="w-px h-3 bg-white/20 mx-0.5" />
      <button 
        onClick={(e) => { e.stopPropagation(); moveElement(element.id, 'up'); }}
        className="p-1.5 hover:bg-white/20 rounded transition-colors text-white"
        title="Move Up"
      >
        <ChevronUp className="w-3.5 h-3.5" />
      </button>
      <button 
        onClick={(e) => { e.stopPropagation(); moveElement(element.id, 'down'); }}
        className="p-1.5 hover:bg-white/20 rounded transition-colors text-white"
        title="Move Down"
      >
        <ChevronDown className="w-3.5 h-3.5" />
      </button>
      <button 
        onClick={(e) => { e.stopPropagation(); moveElement(element.id, 'top'); }}
        className="p-1.5 hover:bg-white/20 rounded transition-colors text-white"
        title="Move to Top"
      >
        <ArrowUpToLine className="w-3.5 h-3.5" />
      </button>
      <button 
        onClick={(e) => { e.stopPropagation(); moveElement(element.id, 'bottom'); }}
        className="p-1.5 hover:bg-white/20 rounded transition-colors text-white"
        title="Move to Bottom"
      >
        <ArrowDownToLine className="w-3.5 h-3.5" />
      </button>
      <div className="w-px h-3 bg-white/20 mx-0.5" />
      <button 
        onClick={(e) => { e.stopPropagation(); removeElement(element.id); }}
        className="p-1.5 hover:bg-red-500 rounded transition-colors text-white"
        title="Delete"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );

  const badge = !isPreview && isSelected && (
    <div 
      className="absolute -top-6 left-0 flex items-center gap-1 cursor-grab active:cursor-grabbing"
      {...attributes}
      {...listeners}
    >
      <span className={cn(
        "text-[9px] font-bold px-2 py-0.5 rounded-t-sm uppercase tracking-widest flex items-center gap-1.5 shadow-lg shadow-accent-primary/20",
        element.isGlobal ? "bg-purple-600" : element.isMaster ? "bg-amber-600" : element.isSlot ? "bg-emerald-600" : "bg-accent-primary"
      )}>
        <Move className="w-2.5 h-2.5" />
        {element.isGlobal ? `Global: ${element.type}` : element.isMaster ? `Master: ${element.type}` : element.isSlot ? `Slot: ${element.type}` : element.type}
      </span>
      {element.locked && <Lock className="w-2.5 h-2.5 text-zinc-400" />}
    </div>
  );

  const renderChildren = () => {
    const isEmpty = !element.children || element.children.length === 0;
    
    if (isEmpty && element.isSlot && showEmptySlots && !isPreview) {
      return (
        <div className="w-full min-h-[100px] border-2 border-dashed border-emerald-500/30 rounded-lg flex flex-col items-center justify-center gap-2 bg-emerald-500/5 m-2">
          <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
            <Plus className="w-4 h-4 text-emerald-500" />
          </div>
          <span className="text-[10px] font-bold text-emerald-500/50 uppercase tracking-widest">Empty Slot</span>
        </div>
      );
    }

    if (isEmpty) return null;

    return (
      <React.Fragment key="children-list">
        <DropIndicator key={`drop-indicator-${element.id}-0`} parentId={element.id} index={0} />
        {element.children!.map((child, idx) => (
          <React.Fragment key={child.id}>
            <RenderElement element={child} index={idx} parentId={element.id} />
            <DropIndicator key={`drop-indicator-${element.id}-${idx + 1}`} parentId={element.id} index={idx + 1} />
          </React.Fragment>
        ))}
      </React.Fragment>
    );
  };

  const { scrollYProgress } = useScroll();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Pre-define transforms for scroll-progress and mouse-move
  const scrollOpacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const scrollScale = useTransform(scrollYProgress, [0, 1], [0.8, 1.2]);
  const mouseMoveX = useTransform(mouseX, [0, 1], [-20, 20]);
  const mouseMoveY = useTransform(mouseY, [0, 1], [-20, 20]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPreview) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mouseX.set(x);
    mouseY.set(y);
  };

  const getAnimationProps = () => {
    const animProps: any = {};
    let key: string | undefined;
    const isPlaying = (animId: string) => playingAnimationId === animId;

    // Handle scroll-progress and mouse-move interactions
    const scrollProgressInteractions = element.interactions?.filter(i => i.trigger === 'scroll-progress');
    const mouseMoveInteractions = element.interactions?.filter(i => i.trigger === 'mouse-move');

    if (isPreview && scrollProgressInteractions && scrollProgressInteractions.length > 0) {
      scrollProgressInteractions.forEach(interaction => {
        if (interaction.action === 'animate' && interaction.animationId) {
          const anim = element.animations?.find(a => a.id === interaction.animationId);
          if (anim) {
            Object.assign(animProps, { style: { ...animProps.style, opacity: scrollOpacity, scale: scrollScale } });
          }
        }
      });
    }

    if (isPreview && mouseMoveInteractions && mouseMoveInteractions.length > 0) {
      mouseMoveInteractions.forEach(interaction => {
        if (interaction.action === 'animate' && interaction.animationId) {
          const anim = element.animations?.find(a => a.id === interaction.animationId);
          if (anim) {
            Object.assign(animProps, { style: { ...animProps.style, x: mouseMoveX, y: mouseMoveY } });
          }
        }
      });
    }
    
    if ((isPreview || playingAnimationId) && element.animations && element.animations.length > 0) {
      // Group animations by trigger
      const loadAnims = element.animations.filter(a => a.trigger === 'load' || !a.trigger || isPlaying(a.id));
      const scrollAnims = element.animations.filter(a => a.trigger === 'scroll' && !isPlaying(a.id));
      const hoverAnims = element.animations.filter(a => a.trigger === 'hover' && !isPlaying(a.id));
      const clickAnims = element.animations.filter(a => a.trigger === 'click' && !isPlaying(a.id));

      const processAnim = (anim: any) => {
        const intensity = anim.intensity || 1;
        const transition = { 
          duration: anim.duration, 
          delay: isPlaying(anim.id) ? 0 : anim.delay, 
          ease: anim.ease as any,
          repeat: anim.repeat === 'infinity' ? Infinity : anim.repeat || 0,
          repeatType: "reverse"
        };
        
        let initial = {};
        let animate = {};
        let exit = {};
        
        switch (anim.type) {
          case 'fade':
            initial = { opacity: 0 };
            animate = { opacity: 1 };
            exit = { opacity: 0 };
            break;
          case 'slide-up':
            initial = { opacity: 0, y: 40 * intensity };
            animate = { opacity: 1, y: 0 };
            exit = { opacity: 0, y: -40 * intensity };
            break;
          case 'slide-down':
            initial = { opacity: 0, y: -40 * intensity };
            animate = { opacity: 1, y: 0 };
            exit = { opacity: 0, y: 40 * intensity };
            break;
          case 'slide-left':
            initial = { opacity: 0, x: 40 * intensity };
            animate = { opacity: 1, x: 0 };
            exit = { opacity: 0, x: -40 * intensity };
            break;
          case 'slide-right':
            initial = { opacity: 0, x: -40 * intensity };
            animate = { opacity: 1, x: 0 };
            exit = { opacity: 0, x: 40 * intensity };
            break;
          case 'scale':
            initial = { opacity: 0, scale: 0.5 / intensity };
            animate = { opacity: 1, scale: 1 };
            exit = { opacity: 0, scale: 0.5 / intensity };
            break;
          case 'rotate':
            initial = { opacity: 0, rotate: -180 * intensity };
            animate = { opacity: 1, rotate: 0 };
            exit = { opacity: 0, rotate: 180 * intensity };
            break;
          case 'bounce':
            animate = { y: [0, -20 * intensity, 0] };
            break;
          case 'flip':
            initial = { rotateY: 180 * intensity, opacity: 0 };
            animate = { rotateY: 0, opacity: 1 };
            exit = { rotateY: -180 * intensity, opacity: 0 };
            break;
          case 'pulse':
            animate = { scale: [1, 1 + (0.05 * intensity), 1] };
            break;
          case 'float':
            animate = { y: [0, -10 * intensity, 0] };
            transition.repeat = Infinity;
            transition.repeatType = "mirror";
            break;
        }
        return { initial, animate, exit, transition };
      };

      // If we are playing a specific animation, prioritize it as a load animation for preview
      const activeAnim = element.animations.find(a => isPlaying(a.id));
      if (activeAnim) {
        const { initial, animate, exit, transition } = processAnim(activeAnim);
        key = `playing-${activeAnim.id}`;
        Object.assign(animProps, { 
          initial, 
          animate, 
          exit,
          transition,
          onAnimationComplete: () => setPlayingAnimationId(null)
        });
        return { animProps, key };
      }

      // Apply load animations
      if (loadAnims.length > 0) {
        const { initial, animate, exit, transition } = processAnim(loadAnims[0]);
        Object.assign(animProps, { initial, animate, exit, transition });
      }

      // Apply scroll animations
      if (scrollAnims.length > 0) {
        const { initial, animate, transition } = processAnim(scrollAnims[0]);
        Object.assign(animProps, { 
          initial, 
          whileInView: animate, 
          viewport: { once: true, margin: "-100px" },
          transition 
        });
      }

      // Apply hover animations
      if (hoverAnims.length > 0) {
        const { animate, transition } = processAnim(hoverAnims[0]);
        Object.assign(animProps, { whileHover: animate, transition });
      }

      // Apply click animations
      if (clickAnims.length > 0) {
        const { animate, transition } = processAnim(clickAnims[0]);
        Object.assign(animProps, { whileTap: animate, transition });
      }
    }

    if (isPreview) {
      if (element.hoverStyles && !animProps.whileHover) animProps.whileHover = element.hoverStyles;
      if (element.activeStyles && !animProps.whileTap) animProps.whileTap = element.activeStyles;
      if (element.focusStyles && !animProps.whileFocus) animProps.whileFocus = element.focusStyles;
    }

    return { animProps, key };
  };

  const content = (() => {
    const { animProps, key: animKey } = getAnimationProps();

    const commonProps = {
      ref: (node: any) => {
        setNodeRef(node);
        setDraggableRef(node);
      },
      style: {
        ...style,
        ...(animProps.style || {})
      },
      onClick: handleClick,
      onDoubleClick: handleDoubleClick,
      onMouseEnter: () => {
        if (!isPreview) {
          setHoveredElementId(element.id);
        } else {
          const hoverInteractions = element.interactions?.filter(i => i.trigger === 'hover') || [];
          hoverInteractions.forEach(executeInteraction);
        }
      },
      onMouseLeave: () => !isPreview && setHoveredElementId(null),
      onContextMenu: (e: React.MouseEvent) => {
        if (isPreview) return;
        if (onContextMenu) onContextMenu(e);
      },
      onMouseMove: handleMouseMove,
      className: cn(
        "relative group transition-all duration-300",
        !isPreview && isSelected && "outline outline-2 outline-accent-primary outline-offset-[-2px] z-10 shadow-[0_0_20px_var(--accent-primary)]",
        !isPreview && !isSelected && isHovered && !element.locked && "outline outline-1 outline-accent-primary/50 outline-offset-[-1px] z-10",
        !isPreview && !isSelected && !isHovered && !element.locked && "hover:outline hover:outline-1 hover:outline-accent-primary/50 hover:outline-offset-[-1px]",
        !isPreview && isOver && definition.isContainer && "bg-accent-primary/5 ring-2 ring-accent-primary ring-inset",
        showOutlines && !isPreview && "outline outline-1 outline-accent-primary/20",
        element.locked && "opacity-80 cursor-not-allowed"
      ),
      ...attributes,
      ...listeners
    };

    // Handle component overrides (Developer Mode)
    const overrideCode = useBuilderStore.getState().componentOverrides[element.id];
    if (overrideCode && isPreview) {
      const template = `
        <!DOCTYPE html>
        <html>
          <head>
            <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
            <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
            <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
            <script src="https://cdn.tailwindcss.com"></script>
          </head>
          <body style="margin: 0; padding: 0; overflow: hidden;">
            <div id="root"></div>
            <script>
              const { useState, useEffect } = React;
              try {
                const code = \`${overrideCode.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`;
                const transpiled = Babel.transform(code, { presets: ['env', 'react'] }).code;
                const exports = {};
                const require = (module) => {
                  if (module === 'react') return React;
                  if (module === 'react-dom') return ReactDOM;
                  return {};
                };
                new Function('exports', 'require', 'React', transpiled)(exports, require, React);
                const Component = exports.default || exports;
                const root = ReactDOM.createRoot(document.getElementById('root'));
                root.render(React.createElement(Component));
              } catch (err) {
                document.getElementById('root').innerHTML = '<pre style="color:red; padding: 1rem; font-size: 12px;">' + err.message + '</pre>';
              }
            </script>
          </body>
        </html>
      `;
      return (
        <motion.div key={animKey || element.id} {...commonProps} {...animProps}>
          <HTMLRenderer 
            html={template}
            className="w-full h-full"
          />
        </motion.div>
      );
    }
    
    switch (element.type) {
      case 'section':
        return (
          <motion.section id={element.id} key={animKey || element.id} {...commonProps} {...animProps}>
            {badge}
            {actionButtons}
            {renderChildren()}
          </motion.section>
        );
      case 'container':
        return (
          <motion.div id={element.id} key={animKey || element.id} {...commonProps} {...animProps}>
            {badge}
            {actionButtons}
            {renderChildren()}
          </motion.div>
        );
      case 'heading':
        const Tag = motion[`h${element.props.level || 1}` as keyof typeof motion] as any;
        return (
          <Tag key={animKey || element.id} {...commonProps} {...animProps}>
            {badge}
            {actionButtons}
            {isEditing ? (
              <input
                autoFocus
                value={textValue}
                onChange={handleTextChange}
                onBlur={handleTextBlur}
                onKeyDown={(e) => e.key === 'Enter' && handleTextBlur()}
                className="bg-transparent border-none outline-none w-full text-inherit font-inherit"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              boundValue || element.props.text
            )}
          </Tag>
        );
      case 'paragraph':
        return (
          <motion.div key={animKey || element.id} {...commonProps} {...animProps}>
            {badge}
            {actionButtons}
            {isEditing ? (
              <textarea
                autoFocus
                value={textValue}
                onChange={handleTextChange}
                onBlur={handleTextBlur}
                className="bg-transparent border-none outline-none w-full text-inherit font-inherit resize-none"
                onClick={(e) => e.stopPropagation()}
                rows={3}
              />
            ) : (
              boundValue || element.props.text
            )}
          </motion.div>
        );
      case 'button':
        let buttonHref = element.props.href;
        return (
          <motion.a 
            key={animKey || element.id}
            href={buttonHref} 
            {...commonProps} 
            {...animProps}
            onClick={(e) => {
              handleClick(e);
              if (buttonHref) {
                handleLinkClick(e, buttonHref, element.props.linkType || 'external');
              }
            }}
          >
            {badge}
            {actionButtons}
            {isEditing ? (
              <input
                autoFocus
                value={textValue}
                onChange={handleTextChange}
                onBlur={handleTextBlur}
                onKeyDown={(e) => e.key === 'Enter' && handleTextBlur()}
                className="bg-transparent border-none outline-none w-full text-inherit font-inherit text-center"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              boundValue || element.props.text
            )}
          </motion.a>
        );
      case 'image':
        return (
          <motion.div 
            key={animKey || element.id}
            className="relative inline-block" 
            style={{ width: style.width, height: style.height }}
            {...animProps}
          >
            {badge}
            {actionButtons}
            <NextImage 
              src={boundValue || element.props.src || 'https://picsum.photos/seed/nexus/800/600'} 
              alt={element.props.alt || 'Image'} 
              fill
              className={cn(commonProps.className, "object-cover")}
              referrerPolicy="no-referrer"
            />
          </motion.div>
        );
      case 'collection-list':
        const collectionId = element.props.collectionId;
        let collectionEntries = entries.filter(e => e.collectionId === collectionId);
        
        if (element.props.sortBy) {
          collectionEntries.sort((a, b) => {
            const valA = a.data[element.props.sortBy];
            const valB = b.data[element.props.sortBy];
            if (valA < valB) return element.props.sortOrder === 'desc' ? 1 : -1;
            if (valA > valB) return element.props.sortOrder === 'desc' ? -1 : 1;
            return 0;
          });
        }

        if (element.props.limit > 0) {
          collectionEntries = collectionEntries.slice(0, element.props.limit);
        }
        
        if (!isPreview) {
          const templateEntry = collectionEntries[0] || { id: 'template', data: {} };
          return (
            <motion.div key={animKey || element.id} {...commonProps} {...animProps}>
              {badge}
              {actionButtons}
              {!collectionId && (
                <div className="p-4 text-center text-zinc-500 border-2 border-dashed border-zinc-700 rounded-md m-2 text-xs">
                  Select a collection in the right panel to bind data
                </div>
              )}
              {collectionId && (
                <React.Fragment>
                  {renderChildren()}
                </React.Fragment>
              )}
            </motion.div>
          );
        }

        return (
          <motion.div key={animKey || element.id} {...commonProps} {...animProps}>
            {badge}
            {actionButtons}
            {collectionEntries.map(entry => (
              <React.Fragment key={entry.id}>
                <div className="collection-item-wrapper" style={{ display: 'contents' }}>
                  {renderChildren()}
                </div>
              </React.Fragment>
            ))}
          </motion.div>
        );
      case 'grid':
        return (
          <motion.div key={animKey || element.id} {...commonProps} {...animProps}>
            {badge}
            {actionButtons}
            {renderChildren()}
          </motion.div>
        );
      case 'flex':
        return (
          <motion.div key={animKey || element.id} {...commonProps} {...animProps}>
            {badge}
            {actionButtons}
            {renderChildren()}
          </motion.div>
        );
      case 'icon':
        const IconComp = LUCIDE_ICONS[element.props.icon || 'Star'] || Star;
        return (
          <motion.div key={animKey || element.id} {...commonProps} {...animProps}>
            {badge}
            {actionButtons}
            <IconComp 
              size={
                style.fontSize 
                  ? String(typeof style.fontSize === 'number' ? style.fontSize * 16 : parseInt(String(style.fontSize)) * 16) 
                  : "32"
              } 
              color={style.color as string} 
            />
          </motion.div>
        );
      case 'divider':
        return (
          <motion.div key={animKey || element.id} {...commonProps} {...animProps}>
            {badge}
            {actionButtons}
            <div className="w-full h-px" style={{ backgroundColor: style.backgroundColor }} />
          </motion.div>
        );
      case 'spacer':
        return (
          <motion.div key={animKey || element.id} {...commonProps} {...animProps}>
            {badge}
            {actionButtons}
          </motion.div>
        );
      case 'html':
        return (
          <motion.div key={animKey || element.id} {...commonProps} {...animProps}>
            {badge}
            {actionButtons}
            <HTMLRenderer 
              html={element.props.htmlContent || ''} 
              className="w-full h-full"
              style={{ pointerEvents: isPreview ? 'auto' : 'none' }}
            />
          </motion.div>
        );
      case 'navbar':
        const isMobile = deviceMode === 'mobile' || deviceMode === 'tablet';
        const showHamburger = isMobile && element.props.mobileMenuType === 'hamburger';

        // Group pages by folder and sort by order
        const dynamicLinks = ([
          ...folders.map(folder => ({
            type: 'folder',
            id: folder.id,
            name: folder.name,
            order: folder.order,
            pages: pages.filter(p => p.folderId === folder.id).sort((a, b) => a.order - b.order)
          })),
          ...pages.filter(p => !p.folderId || !folders.find(f => f.id === p.folderId)).map(p => ({
            type: 'page',
            id: p.id,
            name: p.name,
            order: p.order,
            href: p.id
          }))
        ] as any[])
          .filter(item => item.type === 'page' || (item.type === 'folder' && item.pages.length > 0))
          .sort((a, b) => a.order - b.order);

        const groupedLinks = (element.props.links && element.props.links.length > 0)
          ? element.props.links.map((l: any, idx: number) => ({ ...l, type: 'page', name: l.label, id: l.id || `custom-${idx}` })) // Treat custom links as pages for simple rendering
          : dynamicLinks;

        return (
          <motion.nav 
            key={animKey || element.id} 
            {...commonProps} 
            {...animProps} 
            className={cn(commonProps.className, "relative w-full")}
            style={{
              ...style,
              display: 'flex',
            }}
          >
            {badge}
            {actionButtons}
            <div className="flex items-center justify-between w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full min-h-[64px]">
              <div className="flex items-center flex-shrink-0">
                {element.props.logoType === 'image' && element.props.logoSrc ? (
                  <div className="relative h-8 w-40">
                    <NextImage 
                      src={element.props.logoSrc} 
                      alt="Logo" 
                      fill 
                      className="object-contain object-left"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ) : (
                  <div className="font-bold text-xl tracking-tight">{element.props.logoText || 'NEXUS'}</div>
                )}
              </div>

              {showHamburger ? (
                <div className="flex items-center">
                  <button 
                    className="p-2 hover:bg-black/5 rounded-md transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      updateElement(element.id, { props: { ...element.props, showMobileMenu: !element.props.showMobileMenu } });
                    }}
                  >
                    {element.props.showMobileMenu ? (
                      <X size={element.props.hamburgerSize || 24} color={element.props.hamburgerColor || '#000'} />
                    ) : (
                      <Menu size={element.props.hamburgerSize || 24} color={element.props.hamburgerColor || '#000'} />
                    )}
                  </button>
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-8">
                  {groupedLinks.map((item: any, idx: number) => {
                    if (item.type === 'folder') {
                      const isOpen = openDropdownId === item.id;
                      const itemId = item.id || `folder-${idx}`;
                      return (
                        <div key={`nav-item-${itemId}`} className="relative">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenDropdownId(isOpen ? null : item.id);
                            }}
                            className={cn(
                              "flex items-center gap-1 text-sm font-medium hover:text-accent-primary cursor-pointer transition-colors",
                              isOpen && "text-accent-primary"
                            )}
                          >
                            {item.name}
                            <ChevronDown className={cn("w-3 h-3 transition-transform duration-200", isOpen && "rotate-180")} />
                          </button>
                          <AnimatePresence>
                            {isOpen && (
                              <motion.div 
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                transition={{ duration: 0.15, ease: "easeOut" }}
                                className="absolute top-full right-0 mt-2 w-56 bg-white/95 backdrop-blur-md border border-zinc-200 rounded-xl shadow-2xl z-[110] py-2 overflow-hidden"
                              >
                                {item.pages.map((page: any, pIdx: number) => (
                                  <a 
                                    key={page.id || `page-${pIdx}`} 
                                    href={page.id}
                                    className="block px-4 py-2.5 text-sm text-zinc-700 hover:bg-accent-primary/10 hover:text-accent-primary transition-colors"
                                    onClick={(e) => {
                                      handleLinkClick(e, page.id, 'internal');
                                      setOpenDropdownId(null);
                                    }}
                                  >
                                    {page.name}
                                  </a>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    }
                    const itemId = item.id || `page-${idx}`;
                    return (
                      <a 
                        key={`nav-item-${itemId}`} 
                        href={item.href}
                        className="text-sm font-medium hover:text-accent-primary cursor-pointer transition-colors"
                        onClick={(e) => handleLinkClick(e, item.href, item.type || 'internal')}
                      >
                        {item.name}
                      </a>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
              {showHamburger && element.props.showMobileMenu && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="absolute top-full left-0 right-0 bg-white border-b border-zinc-200 shadow-xl z-[100] overflow-hidden"
                  style={{ 
                    backgroundColor: style.backgroundColor,
                    color: style.color 
                  }}
                >
                  <div className="p-4 flex flex-col gap-2">
                    {groupedLinks.map((item: any, idx: number) => {
                      if (item.type === 'folder') {
                        const itemId = item.id || `folder-${idx}`;
                        return (
                          <div key={`nav-mobile-folder-${itemId}`} className="flex flex-col gap-1">
                            <div key="folder-title" className="text-xs font-bold text-zinc-400 uppercase tracking-wider px-4 py-2">
                              {item.name}
                            </div>
                            <div key="folder-pages" className="flex flex-col gap-1">
                              {item.pages.map((page: any, pIdx: number) => (
                                <a 
                                  key={page.id || `mobile-page-${pIdx}`} 
                                  href={page.id}
                                  className="text-base font-medium hover:text-accent-primary cursor-pointer py-3 px-8 rounded-lg hover:bg-black/5 transition-colors"
                                  onClick={(e) => {
                                    handleLinkClick(e, page.id, 'internal');
                                    updateElement(element.id, { props: { ...element.props, showMobileMenu: false } });
                                  }}
                                >
                                  {page.name}
                                </a>
                              ))}
                            </div>
                          </div>
                        );
                      }
                      const itemId = item.id || `page-${idx}`;
                      return (
                        <a 
                          key={`nav-mobile-item-${itemId}`} 
                          href={item.href}
                          className="text-base font-medium hover:text-accent-primary cursor-pointer py-3 px-4 rounded-lg hover:bg-black/5 transition-colors"
                          onClick={(e) => {
                            handleLinkClick(e, item.href, item.type || 'internal');
                            updateElement(element.id, { props: { ...element.props, showMobileMenu: false } });
                          }}
                        >
                          {item.name}
                        </a>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.nav>
        );
      case 'form':
        return (
          <motion.form 
            key={animKey || element.id} 
            {...commonProps} 
            {...animProps}
            onSubmit={(e) => {
              e.preventDefault();
              if (isPreview) {
                alert(element.props.successMessage || 'Form submitted!');
              }
            }}
          >
            {badge}
            {actionButtons}
            {renderChildren()}
          </motion.form>
        );
      case 'input':
        return (
          <motion.div key={animKey || element.id} {...commonProps} {...animProps}>
            {badge}
            {actionButtons}
            <input 
              type={element.props.type || 'text'}
              placeholder={element.props.placeholder}
              required={element.props.required}
              name={element.props.name}
              className="w-full bg-transparent border-none outline-none text-inherit placeholder:text-zinc-400"
              readOnly={!isPreview}
            />
          </motion.div>
        );
      case 'textarea':
        return (
          <motion.div key={animKey || element.id} {...commonProps} {...animProps}>
            {badge}
            {actionButtons}
            <textarea 
              placeholder={element.props.placeholder}
              required={element.props.required}
              name={element.props.name}
              rows={element.props.rows || 4}
              className="w-full bg-transparent border-none outline-none text-inherit placeholder:text-zinc-400 resize-none"
              readOnly={!isPreview}
            />
          </motion.div>
        );
      case 'select':
        return (
          <motion.div key={animKey || element.id} {...commonProps} {...animProps}>
            {badge}
            {actionButtons}
            <select 
              name={element.props.name}
              required={element.props.required}
              className="w-full bg-transparent border-none outline-none text-inherit appearance-none"
              disabled={!isPreview}
            >
              {element.props.options?.map((opt: any, idx: number) => (
                <option key={idx} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </motion.div>
        );
      case 'checkbox':
        return (
          <motion.div key={animKey || element.id} {...commonProps} {...animProps}>
            {badge}
            {actionButtons}
            <input 
              type="checkbox"
              name={element.props.name}
              required={element.props.required}
              defaultChecked={element.props.checked}
              className="w-4 h-4 rounded border-zinc-300 text-accent-primary focus:ring-accent-primary"
              disabled={!isPreview}
            />
            <span className="text-sm text-zinc-700">{element.props.label}</span>
          </motion.div>
        );
      case 'label':
        return (
          <motion.label key={animKey || element.id} {...commonProps} {...animProps}>
            {badge}
            {actionButtons}
            {isEditing ? (
              <input
                autoFocus
                value={textValue}
                onChange={handleTextChange}
                onBlur={handleTextBlur}
                onKeyDown={(e) => e.key === 'Enter' && handleTextBlur()}
                className="bg-transparent border-none outline-none w-full text-inherit font-inherit"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              element.props.text
            )}
          </motion.label>
        );
      case 'hero':
        return (
          <motion.div key={animKey || element.id} {...commonProps} {...animProps}>
            {badge}
            {actionButtons}
            {renderChildren()}
          </motion.div>
        );
      case 'card':
        return (
          <motion.div key={animKey || element.id} {...commonProps} {...animProps}>
            {badge}
            {actionButtons}
            {renderChildren()}
          </motion.div>
        );
      case 'footer':
        return (
          <motion.footer key={animKey || element.id} {...commonProps} {...animProps}>
            {badge}
            {actionButtons}
            <div>{element.props.copyright}</div>
          </motion.footer>
        );
      case 'pricing':
        return (
          <motion.div key={animKey || element.id} {...commonProps} {...animProps}>
            {badge}
            {actionButtons}
            {renderChildren()}
          </motion.div>
        );
      case 'features':
        return (
          <motion.div key={animKey || element.id} {...commonProps} {...animProps}>
            {badge}
            {actionButtons}
            {renderChildren()}
          </motion.div>
        );
      default:
        return <motion.div key={animKey || element.id} {...commonProps} {...animProps}>{badge}{actionButtons}{element.type}</motion.div>;
    }
  })();

  return content;
}

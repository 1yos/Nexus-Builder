'use client';

import React from 'react';
import { useBuilderStore, ElementInstance } from '@/store/useBuilderStore';
import { useDroppable, useDraggable } from '@dnd-kit/core';
import { motion, AnimatePresence } from 'framer-motion';
import { COMPONENT_REGISTRY } from '@/lib/registry';
import { cn } from '@/lib/utils';
import { Trash2, Copy, Move, Edit3, Lock, EyeOff, Menu, X, ChevronUp, ChevronDown, ArrowUpToLine, ArrowDownToLine } from 'lucide-react';

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
    setPan
  } = useBuilderStore();

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
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') setIsPanning(true);
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') setIsPanning(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
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
        <div className="absolute top-4 right-4 z-50 flex items-center gap-2 bg-zinc-900/80 backdrop-blur-md border border-zinc-800 p-1 rounded-lg shadow-xl">
          <button 
            onClick={() => setZoom(Math.max(zoom - 0.1, 0.25))}
            className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors"
          >
            -
          </button>
          <span className="text-[10px] font-bold text-zinc-300 min-w-[40px] text-center uppercase tracking-widest">
            {Math.round(zoom * 100)}%
          </span>
          <button 
            onClick={() => setZoom(Math.min(zoom + 0.1, 2))}
            className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors"
          >
            +
          </button>
          <div className="w-px h-4 bg-zinc-800 mx-1" />
          <button 
            onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
            className="px-2 py-1 text-[9px] font-bold text-zinc-500 hover:text-zinc-300 uppercase tracking-tighter"
          >
            Reset
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
            transformOrigin: 'top center'
          }}
          className={cn(
            "min-h-[80vh] bg-white shadow-2xl transition-all relative",
            !isPreview && "rounded-sm",
            isOver && !isPreview && "ring-2 ring-purple-500 ring-inset"
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
                className="absolute inset-0 pointer-events-none opacity-[0.03]"
                style={{ 
                  backgroundImage: `
                    linear-gradient(to right, #000 1px, transparent 1px),
                    linear-gradient(to bottom, #000 1px, transparent 1px)
                  `,
                  backgroundSize: '8px 8px'
                }}
              />
              
              {/* Container Guides */}
              <div className="absolute inset-y-0 left-1/2 -translate-x-[600px] w-px bg-purple-500/10 pointer-events-none hidden xl:block" />
              <div className="absolute inset-y-0 left-1/2 translate-x-[600px] w-px bg-purple-500/10 pointer-events-none hidden xl:block" />
            </>
          )}

          <AnimatePresence>
            {elements.length === 0 ? (
              <div className="h-[70vh] flex flex-col items-center justify-center text-zinc-300 p-12 text-center">
                <div className="w-20 h-20 border-2 border-dashed border-zinc-200 rounded-2xl mb-6 flex items-center justify-center bg-zinc-50">
                  <div className="w-10 h-10 bg-purple-500/10 rounded-full flex items-center justify-center">
                    <div className="w-4 h-4 bg-purple-500 rounded-sm rotate-45" />
                  </div>
                </div>
                <h3 className="text-zinc-900 font-bold text-2xl tracking-tight">Start your masterpiece</h3>
                <p className="text-zinc-500 text-sm mt-3 max-w-xs leading-relaxed">
                  Drag components from the left panel and drop them here. Use sections to organize your layout.
                </p>
              </div>
            ) : (
              <>
                <DropIndicator index={0} />
                {elements.map((element, idx) => (
                  <React.Fragment key={element.id}>
                    <RenderElement element={element} index={idx} />
                    <DropIndicator index={idx + 1} />
                  </React.Fragment>
                ))}
              </>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </main>
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
        isOver ? "bg-purple-500 opacity-100 my-3 scale-y-125 shadow-[0_0_15px_rgba(168,85,247,0.5)]" : "opacity-0 hover:opacity-20"
      )}
    >
      {isOver && (
        <div className="absolute -left-1 -top-1 w-3 h-3 bg-purple-500 rounded-full animate-ping opacity-75" />
      )}
    </div>
  );
}

function RenderElement({ element, index, parentId }: { element: ElementInstance; index: number; parentId?: string }) {
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
    moveElement
  } = useBuilderStore();
  
  const [isEditing, setIsEditing] = React.useState(false);
  const [textValue, setTextValue] = React.useState(element.props.text || '');
  
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

  const handleClick = (e: React.MouseEvent) => {
    if (isPreview || element.locked) return;
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
    if (type === 'internal') {
      e.preventDefault();
      setActivePage(href);
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

  const commonProps = {
    ref: (node: any) => {
      setNodeRef(node);
      setDraggableRef(node);
    },
    style,
    onClick: handleClick,
    onDoubleClick: handleDoubleClick,
    onMouseEnter: () => !isPreview && setHoveredElementId(element.id),
    onMouseLeave: () => !isPreview && setHoveredElementId(null),
    className: cn(
      "relative group transition-all duration-300",
      !isPreview && isSelected && "outline outline-2 outline-purple-500 outline-offset-[-2px] z-10 shadow-[0_0_20px_rgba(168,85,247,0.25)]",
      !isPreview && !isSelected && isHovered && !element.locked && "outline outline-1 outline-purple-400/50 outline-offset-[-1px] z-10",
      !isPreview && !isSelected && !isHovered && !element.locked && "hover:outline hover:outline-1 hover:outline-purple-400/50 hover:outline-offset-[-1px]",
      !isPreview && isOver && definition.isContainer && "bg-purple-500/5 ring-2 ring-purple-400 ring-inset",
      element.locked && "opacity-80 cursor-not-allowed"
    )
  };

  const actionButtons = !isPreview && isSelected && (
    <div className="absolute -top-10 right-0 flex items-center gap-1 bg-purple-600 p-1 rounded-lg shadow-xl shadow-purple-900/40 z-[100]">
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
      <span className="bg-purple-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-t-sm uppercase tracking-widest flex items-center gap-1.5 shadow-lg shadow-purple-900/20">
        <Move className="w-2.5 h-2.5" />
        {element.type}
      </span>
      {element.locked && <Lock className="w-2.5 h-2.5 text-zinc-400" />}
    </div>
  );

  const renderChildren = () => {
    if (!element.children) return null;
    return (
      <>
        <DropIndicator parentId={element.id} index={0} />
        {element.children.map((child, idx) => (
          <React.Fragment key={child.id}>
            <RenderElement element={child} index={idx} parentId={element.id} />
            <DropIndicator parentId={element.id} index={idx + 1} />
          </React.Fragment>
        ))}
      </>
    );
  };

  const getAnimationProps = () => {
    if (isPreview && element.animations && element.animations.length > 0) {
      const anim = element.animations[0];
      const transition = { duration: anim.duration, delay: anim.delay, ease: anim.ease as any };
      
      switch (anim.type) {
        case 'fade':
          return { initial: { opacity: 0 }, animate: { opacity: 1 }, transition };
        case 'slide':
          return { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition };
        case 'scale':
          return { initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 }, transition };
        case 'rotate':
          return { initial: { rotate: -10 }, animate: { rotate: 0 }, transition };
        case 'bounce':
          return { animate: { y: [0, -10, 0] }, transition: { duration: anim.duration, repeat: Infinity, ease: "easeInOut" as any } };
        default:
          return {};
      }
    }
    return {};
  };

  const content = (() => {
    const animProps = getAnimationProps();
    
    switch (element.type) {
      case 'section':
        return (
          <motion.section {...commonProps} {...animProps}>
            {badge}
            {actionButtons}
            {renderChildren()}
          </motion.section>
        );
      case 'container':
        return (
          <motion.div {...commonProps} {...animProps}>
            {badge}
            {actionButtons}
            {renderChildren()}
          </motion.div>
        );
      case 'heading':
        const Tag = motion[`h${element.props.level || 1}` as keyof typeof motion] as any;
        return (
          <Tag {...commonProps} {...animProps}>
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
          </Tag>
        );
      case 'paragraph':
        return (
          <motion.div {...commonProps} {...animProps}>
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
              element.props.text
            )}
          </motion.div>
        );
      case 'button':
        return (
          <motion.a 
            href={element.props.href} 
            {...commonProps} 
            {...animProps}
            onClick={(e) => {
              handleClick(e);
              handleLinkClick(e, element.props.href || '', element.props.linkType || 'external');
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
              element.props.text
            )}
          </motion.a>
        );
      case 'image':
        return (
          <motion.div 
            className="relative inline-block" 
            style={{ width: style.width, height: style.height }}
            {...animProps}
          >
            {badge}
            {actionButtons}
            <img src={element.props.src} alt={element.props.alt} {...commonProps} className={cn(commonProps.className, "w-full h-full object-cover")} />
          </motion.div>
        );
      case 'grid':
        return (
          <motion.div {...commonProps} {...animProps}>
            {badge}
            {actionButtons}
            {renderChildren()}
          </motion.div>
        );
      case 'flex':
        return (
          <motion.div {...commonProps} {...animProps}>
            {badge}
            {actionButtons}
            {renderChildren()}
          </motion.div>
        );
      case 'navbar':
        const navLinks = pages.map(p => ({ id: p.id, label: p.name, href: p.id, type: 'internal' }));
        const isMobile = deviceMode === 'mobile' || deviceMode === 'tablet';
        const showHamburger = isMobile && element.props.mobileMenuType === 'hamburger';

        return (
          <motion.nav {...commonProps} {...animProps} className={cn(commonProps.className, "relative")}>
            {badge}
            {actionButtons}
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-4">
                {element.props.logoType === 'image' && element.props.logoSrc ? (
                  <img src={element.props.logoSrc} alt="Logo" className="h-8 w-auto" />
                ) : (
                  <div className="font-bold text-xl">{element.props.logoText || 'Nexus'}</div>
                )}
              </div>

              {showHamburger ? (
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
              ) : (
                <div className="flex gap-6">
                  {navLinks.map((link: any) => (
                    <a 
                      key={link.id} 
                      href={link.href}
                      className="text-sm font-medium hover:text-blue-500 cursor-pointer"
                      onClick={(e) => handleLinkClick(e, link.href, link.type)}
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
              {showHamburger && element.props.showMobileMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 bg-white border-b border-zinc-200 p-4 shadow-xl z-[100] flex flex-col gap-2"
                  style={{ 
                    backgroundColor: style.backgroundColor,
                    color: style.color 
                  }}
                >
                  {navLinks.map((link: any) => (
                    <a 
                      key={link.id} 
                      href={link.href}
                      className="text-base font-medium hover:text-blue-500 cursor-pointer py-3 px-4 rounded-lg hover:bg-black/5 transition-colors"
                      onClick={(e) => {
                        handleLinkClick(e, link.href, link.type);
                        updateElement(element.id, { props: { ...element.props, showMobileMenu: false } });
                      }}
                    >
                      {link.label}
                    </a>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.nav>
        );
      case 'hero':
        return (
          <motion.div {...commonProps} {...animProps}>
            {badge}
            {actionButtons}
            {renderChildren()}
          </motion.div>
        );
      case 'card':
        return (
          <motion.div {...commonProps} {...animProps}>
            {badge}
            {actionButtons}
            {renderChildren()}
          </motion.div>
        );
      case 'footer':
        return (
          <motion.footer {...commonProps} {...animProps}>
            {badge}
            {actionButtons}
            <div>{element.props.copyright}</div>
          </motion.footer>
        );
      case 'pricing':
        return (
          <motion.div {...commonProps} {...animProps}>
            {badge}
            {actionButtons}
            {renderChildren()}
          </motion.div>
        );
      case 'features':
        return (
          <motion.div {...commonProps} {...animProps}>
            {badge}
            {actionButtons}
            {renderChildren()}
          </motion.div>
        );
      default:
        return <motion.div {...commonProps} {...animProps}>{badge}{actionButtons}{element.type}</motion.div>;
    }
  })();

  return content;
}

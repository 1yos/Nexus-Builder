'use client';

import React from 'react';
import { useBuilderStore, ElementInstance } from '@/store/useBuilderStore';
import { useDroppable } from '@dnd-kit/core';
import { motion, AnimatePresence } from 'framer-motion';
import { COMPONENT_REGISTRY } from '@/lib/registry';
import { cn } from '@/lib/utils';

export default function Canvas() {
  const { elements, deviceMode, selectedElementId, selectElement, isPreview } = useBuilderStore();
  const { setNodeRef, isOver } = useDroppable({
    id: 'canvas-root',
    data: {
      isCanvas: true,
    },
    disabled: isPreview,
  });

  const getCanvasWidth = () => {
    switch (deviceMode) {
      case 'tablet': return '768px';
      case 'mobile': return '375px';
      default: return '100%';
    }
  };

  return (
    <main className={cn(
      "flex-1 bg-zinc-950 overflow-auto flex flex-col items-center custom-scrollbar relative",
      !isPreview && "p-8"
    )}>
      {!isPreview && (
        <>
          {/* 8px Grid Pattern */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-[0.05]"
            style={{ 
              backgroundImage: `
                linear-gradient(to right, #fff 1px, transparent 1px),
                linear-gradient(to bottom, #fff 1px, transparent 1px)
              `,
              backgroundSize: '8px 8px'
            }}
          />
          {/* 40px Major Grid lines */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-[0.08]"
            style={{ 
              backgroundImage: `
                linear-gradient(to right, #fff 1px, transparent 1px),
                linear-gradient(to bottom, #fff 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px'
            }}
          />
          
          {/* Container Guides */}
          <div className="absolute inset-y-0 left-1/2 -translate-x-[600px] w-px bg-blue-500/20 pointer-events-none hidden xl:block" />
          <div className="absolute inset-y-0 left-1/2 translate-x-[600px] w-px bg-blue-500/20 pointer-events-none hidden xl:block" />
        </>
      )}
      
      <motion.div
        layout
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        style={{ width: getCanvasWidth() }}
        className={cn(
          "min-h-full bg-white shadow-2xl transition-all relative",
          !isPreview && "rounded-sm",
          isOver && !isPreview && "ring-2 ring-blue-500 ring-inset"
        )}
        ref={setNodeRef}
        onClick={(e) => {
          if (isPreview) return;
          if (e.target === e.currentTarget) selectElement(null);
        }}
      >
        <AnimatePresence>
          {elements.length === 0 ? (
            <div className="h-[70vh] flex flex-col items-center justify-center text-zinc-300 p-12 text-center">
              <div className="w-20 h-20 border-2 border-dashed border-zinc-200 rounded-2xl mb-6 flex items-center justify-center bg-zinc-50">
                <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-blue-500 rounded-sm rotate-45" />
                </div>
              </div>
              <h3 className="text-zinc-900 font-bold text-2xl tracking-tight">Start your masterpiece</h3>
              <p className="text-zinc-500 text-sm mt-3 max-w-xs leading-relaxed">
                Drag components from the left panel and drop them here. Use sections to organize your layout.
              </p>
              <div className="mt-8 flex gap-3">
                <div className="px-4 py-2 bg-zinc-100 rounded-lg text-xs font-bold text-zinc-400 uppercase tracking-widest">Section</div>
                <div className="px-4 py-2 bg-zinc-100 rounded-lg text-xs font-bold text-zinc-400 uppercase tracking-widest">Hero</div>
                <div className="px-4 py-2 bg-zinc-100 rounded-lg text-xs font-bold text-zinc-400 uppercase tracking-widest">Navbar</div>
              </div>
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
        "h-1.5 w-full transition-all duration-200 relative z-50",
        isOver ? "bg-blue-500 opacity-100 my-2 scale-y-150" : "opacity-0 hover:opacity-10"
      )}
    >
      {isOver && (
        <div className="absolute left-1/2 -translate-x-1/2 -top-1.5 bg-blue-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap">
          Insert Here
        </div>
      )}
    </div>
  );
}

function RenderElement({ element, index, parentId }: { element: ElementInstance; index: number; parentId?: string }) {
  const { selectElement, selectedElementId, setActivePage, pages, isPreview, updateElement } = useBuilderStore();
  const [isEditing, setIsEditing] = React.useState(false);
  const [textValue, setTextValue] = React.useState(element.props.text || '');
  
  const isSelected = selectedElementId === element.id;
  const definition = COMPONENT_REGISTRY[element.type];

  const { setNodeRef, isOver } = useDroppable({
    id: element.id,
    data: {
      isContainer: definition.isContainer,
      element,
    },
    disabled: !definition.isContainer || isPreview || element.locked,
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

  const style = {
    ...element.styles,
    backgroundImage: element.styles.backgroundImage ? `url(${element.styles.backgroundImage})` : undefined,
    pointerEvents: element.locked ? 'none' : undefined,
  } as React.CSSProperties;

  const commonProps = {
    ref: setNodeRef,
    style,
    onClick: handleClick,
    onDoubleClick: handleDoubleClick,
    className: cn(
      "relative group transition-all duration-200",
      !isPreview && isSelected && "outline outline-2 outline-blue-500 outline-offset-[-2px] z-10",
      !isPreview && !isSelected && !element.locked && "hover:outline hover:outline-1 hover:outline-blue-300 hover:outline-offset-[-1px]",
      !isPreview && isOver && definition.isContainer && "bg-blue-500/5 ring-2 ring-blue-400 ring-inset",
      element.locked && "opacity-80 cursor-not-allowed"
    )
  };

  const badge = !isPreview && isSelected && (
    <span className="absolute -top-6 left-0 bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-t-sm uppercase tracking-wider flex items-center gap-1.5">
      {element.type}
    </span>
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

  const content = (() => {
    switch (element.type) {
      case 'section':
        return (
          <section {...commonProps}>
            {badge}
            {renderChildren()}
          </section>
        );
      case 'container':
        return (
          <div {...commonProps}>
            {badge}
            {renderChildren()}
          </div>
        );
      case 'heading':
        const Tag = `h${element.props.level || 1}` as any;
        return (
          <Tag {...commonProps}>
            {badge}
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
          <div {...commonProps}>
            {badge}
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
          </div>
        );
      case 'button':
        return (
          <a 
            href={element.props.href} 
            {...commonProps} 
            onClick={(e) => {
              handleClick(e);
              handleLinkClick(e, element.props.href || '', element.props.linkType || 'external');
            }}
          >
            {badge}
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
          </a>
        );
      case 'image':
        return (
          <div className="relative inline-block" style={{ width: style.width, height: style.height }}>
            {badge}
            <img src={element.props.src} alt={element.props.alt} {...commonProps} className={cn(commonProps.className, "w-full h-full object-cover")} />
          </div>
        );
      case 'grid':
        return (
          <div {...commonProps}>
            {badge}
            {renderChildren()}
          </div>
        );
      case 'flex':
        return (
          <div {...commonProps}>
            {badge}
            {renderChildren()}
          </div>
        );
      case 'navbar':
        const navLinks = pages.map(p => ({ id: p.id, label: p.name, href: p.id, type: 'internal' }));
        return (
          <nav {...commonProps}>
            {badge}
            <div className="flex items-center gap-4">
              {element.props.logoType === 'image' && element.props.logoSrc ? (
                <img src={element.props.logoSrc} alt="Logo" className="h-8 w-auto" />
              ) : (
                <div className="font-bold text-xl">{element.props.logoText || 'Nexus'}</div>
              )}
            </div>
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
          </nav>
        );
      case 'hero':
        return (
          <div {...commonProps}>
            {badge}
            {renderChildren()}
          </div>
        );
      case 'card':
        return (
          <div {...commonProps}>
            {badge}
            {renderChildren()}
          </div>
        );
      case 'footer':
        return (
          <footer {...commonProps}>
            {badge}
            <div>{element.props.copyright}</div>
          </footer>
        );
      case 'pricing':
        return (
          <div {...commonProps}>
            {badge}
            {renderChildren()}
          </div>
        );
      case 'features':
        return (
          <div {...commonProps}>
            {badge}
            {renderChildren()}
          </div>
        );
      default:
        return <div {...commonProps}>{badge}{element.type}</div>;
    }
  })();

  return content;
}

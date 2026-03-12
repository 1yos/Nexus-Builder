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
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '24px 24px' }}
        />
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
            <div className="h-[60vh] flex flex-col items-center justify-center text-zinc-300 p-12 text-center">
              <div className="w-16 h-16 border-2 border-dashed border-zinc-200 rounded-xl mb-4 flex items-center justify-center">
                <div className="w-8 h-8 bg-zinc-100 rounded-full" />
              </div>
              <h3 className="text-zinc-400 font-medium text-lg">Your canvas is empty</h3>
              <p className="text-zinc-400 text-sm mt-2 max-w-xs">
                Drag and drop components from the left panel to start building your website.
              </p>
            </div>
          ) : (
            elements.map((element) => (
              <RenderElement key={element.id} element={element} />
            ))
          )}
        </AnimatePresence>
      </motion.div>
    </main>
  );
}

function RenderElement({ element }: { element: ElementInstance }) {
  const { selectElement, selectedElementId, setActivePage, pages, isPreview } = useBuilderStore();
  const isSelected = selectedElementId === element.id;
  const definition = COMPONENT_REGISTRY[element.type];

  const { setNodeRef, isOver } = useDroppable({
    id: element.id,
    data: {
      isContainer: definition.isContainer,
      element,
    },
    disabled: !definition.isContainer || isPreview,
  });

  const handleClick = (e: React.MouseEvent) => {
    if (isPreview) return;
    e.stopPropagation();
    selectElement(element.id);
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
  };

  const commonProps = {
    ref: setNodeRef,
    style,
    onClick: handleClick,
    className: cn(
      "relative group transition-all duration-200",
      !isPreview && isSelected && "outline outline-2 outline-blue-500 outline-offset-[-2px] z-10",
      !isPreview && !isSelected && "hover:outline hover:outline-1 hover:outline-blue-300 hover:outline-offset-[-1px]",
      !isPreview && isOver && definition.isContainer && "bg-blue-500/5 ring-2 ring-blue-400 ring-inset"
    )
  };

  const badge = !isPreview && isSelected && (
    <span className="absolute -top-6 left-0 bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-t-sm uppercase tracking-wider flex items-center gap-1.5">
      {element.type}
    </span>
  );

  switch (element.type) {
    case 'section':
      return (
        <section {...commonProps}>
          {badge}
          {element.children?.map(child => <RenderElement key={child.id} element={child} />)}
        </section>
      );
    case 'container':
      return (
        <div {...commonProps}>
          {badge}
          {element.children?.map(child => <RenderElement key={child.id} element={child} />)}
        </div>
      );
    case 'heading':
      const Tag = `h${element.props.level || 1}` as any;
      return <Tag {...commonProps}>{badge}{element.props.text}</Tag>;
    case 'paragraph':
      return <div {...commonProps}>{badge}{element.props.text}</div>;
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
          {element.props.text}
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
          {element.children?.map(child => <RenderElement key={child.id} element={child} />)}
        </div>
      );
    case 'flex':
      return (
        <div {...commonProps}>
          {badge}
          {element.children?.map(child => <RenderElement key={child.id} element={child} />)}
        </div>
      );
    case 'navbar':
      // Use dynamic links from pages if not manually overridden or by default as requested
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
          {element.children?.map(child => <RenderElement key={child.id} element={child} />)}
        </div>
      );
    case 'card':
      return (
        <div {...commonProps}>
          {badge}
          {element.children?.map(child => <RenderElement key={child.id} element={child} />)}
        </div>
      );
    case 'footer':
      return (
        <footer {...commonProps}>
          {badge}
          <div>{element.props.copyright}</div>
        </footer>
      );
    default:
      return <div {...commonProps}>{badge}{element.type}</div>;
  }
}

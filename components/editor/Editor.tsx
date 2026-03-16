'use client';

import React from 'react';
import { 
  DndContext, 
  DragOverlay, 
  useSensor, 
  useSensors, 
  PointerSensor, 
  DragEndEvent,
  DragStartEvent,
  defaultDropAnimationSideEffects
} from '@dnd-kit/core';
import { v4 as uuidv4 } from 'uuid';
import { useBuilderStore, ElementInstance, ComponentType } from '@/store/useBuilderStore';
import { COMPONENT_REGISTRY } from '@/lib/registry';
import LeftPanel from './LeftPanel';
import RightPanel from './RightPanel';
import Toolbar from './Toolbar';
import Canvas from './Canvas';
import { LucideIcon } from 'lucide-react';

export default function Editor() {
  const { addElement, elements, selectElement, isPreview } = useBuilderStore();
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [activeType, setActiveType] = React.useState<ComponentType | null>(null);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    if (isPreview) return;
    const { active } = event;
    setActiveId(active.id as string);
    setActiveType(active.data.current?.type);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    if (isPreview) return;
    const { active, over } = event;
    setActiveId(null);
    setActiveType(null);

    if (!over) return;

    const type = active.data.current?.type as ComponentType;
    const isLibraryItem = active.data.current?.isLibraryItem;
    const overId = over.id as string;
    const overData = over.data.current;

    if (isLibraryItem && type) {
      const definition = COMPONENT_REGISTRY[type];
      
      const createInstance = (def: any): ElementInstance => {
        const instance: ElementInstance = {
          id: uuidv4(),
          type: def.type,
          props: { ...def.props },
          styles: { ...def.styles },
          children: def.children || (COMPONENT_REGISTRY[def.type as ComponentType]?.isContainer ? [] : undefined),
        };

        if (def.children) {
          instance.children = def.children.map((child: any) => createInstance(child));
        } else if (COMPONENT_REGISTRY[def.type as ComponentType]?.defaultChildren) {
          instance.children = COMPONENT_REGISTRY[def.type as ComponentType]!.defaultChildren!.map((child: any) => createInstance(child));
        }

        return instance;
      };

      const newElement = createInstance({
        type,
        props: definition.defaultProps,
        styles: definition.defaultStyles,
      });

      if (overData?.isDropIndicator) {
        addElement(newElement, overData.parentId, overData.index);
      } else if (overId === 'canvas-root') {
        addElement(newElement);
      } else if (overData?.isContainer) {
        addElement(newElement, overId);
      } else {
        addElement(newElement);
      }
      
      selectElement(newElement.id);
    } else if (!isLibraryItem) {
      // Handle reordering existing element
      const elementId = active.id as string;
      const { moveElementTo, elements } = useBuilderStore.getState();
      
      if (overData?.isDropIndicator) {
        moveElementTo(elementId, overData.parentId || null, overData.index);
      } else if (overId === 'canvas-root') {
        moveElementTo(elementId, null, elements.length);
      } else if (overData?.isContainer) {
        moveElementTo(elementId, overId, 0);
      }
    }
  };

  if (!mounted) return null;

  return (
    <DndContext 
      sensors={sensors} 
      onDragStart={handleDragStart} 
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col h-screen bg-zinc-950 text-zinc-200 selection:bg-blue-500/30">
        <Toolbar />
        <div className="flex flex-1 overflow-hidden">
          {!isPreview && <LeftPanel />}
          <Canvas />
          {!isPreview && <RightPanel />}
        </div>
        
        {!isPreview && (
          <div className="h-8 bg-zinc-900 border-t border-zinc-800 flex items-center px-4 justify-between text-[10px] text-zinc-500 font-medium">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Ready</span>
              </div>
              <div className="h-3 w-px bg-zinc-800" />
              <span>{elements.length} Elements</span>
            </div>
            <div className="flex items-center gap-4">
              <span>Nexus v1.0.0</span>
            </div>
          </div>
        )}
      </div>

      <DragOverlay dropAnimation={{
        sideEffects: defaultDropAnimationSideEffects({
          styles: {
            active: {
              opacity: '0.5',
            },
          },
        }),
      }}>
        {activeType ? (
          <div className="flex flex-col items-center justify-center p-3 rounded-lg border border-blue-500 bg-zinc-800 shadow-2xl scale-105 rotate-3">
            {React.createElement(COMPONENT_REGISTRY[activeType].icon as LucideIcon, { className: "w-5 h-5 text-blue-500 mb-2" })}
            <span className="text-[11px] text-zinc-300 font-medium">{COMPONENT_REGISTRY[activeType].label}</span>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

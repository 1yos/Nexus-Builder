import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

export type ComponentType = 
  | 'section' | 'container' | 'grid' | 'flex'
  | 'heading' | 'paragraph' | 'button' | 'image' | 'icon' | 'divider' | 'spacer'
  | 'navbar' | 'hero' | 'card' | 'footer' | 'pricing' | 'features';

export interface Styles {
  fontSize?: string;
  fontWeight?: string;
  color?: string;
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundSize?: 'cover' | 'contain' | 'auto';
  backgroundPosition?: string;
  backgroundRepeat?: 'no-repeat' | 'repeat' | 'repeat-x' | 'repeat-y';
  padding?: string;
  margin?: string;
  borderRadius?: string;
  borderWidth?: string;
  borderColor?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  display?: 'block' | 'flex' | 'grid' | 'inline-block' | 'none';
  flexDirection?: 'row' | 'column';
  justifyContent?: string;
  alignItems?: string;
  gap?: string;
  width?: string;
  height?: string;
  maxWidth?: string;
  minHeight?: string;
  opacity?: number;
  boxShadow?: string;
  [key: string]: any;
}

export interface Animation {
  id: string;
  type: 'fade' | 'slide' | 'scale' | 'rotate' | 'bounce';
  duration: number;
  delay: number;
  ease: string;
}

export interface ElementInstance {
  id: string;
  type: ComponentType;
  name?: string;
  locked?: boolean;
  variant?: string;
  animations?: Animation[];
  isGlobal?: boolean;
  globalId?: string;
  props: {
    text?: string;
    src?: string;
    alt?: string;
    href?: string;
    icon?: string;
    [key: string]: any;
  };
  styles: Styles;
  responsiveStyles?: {
    tablet?: Styles;
    mobile?: Styles;
  };
  children?: ElementInstance[];
  parentId?: string;
}

export interface Page {
  id: string;
  name: string;
  elements: ElementInstance[];
}

export type DeviceMode = 'desktop' | 'tablet' | 'mobile';
export type EditorMode = 'design' | 'code';

export interface PresenceUser {
  id: string;
  name: string;
  color: string;
  x: number;
  y: number;
  lastActive: number;
}

interface BuilderState {
  pages: Page[];
  activePageId: string;
  elements: ElementInstance[]; // Convenience reference to active page elements
  selectedElementId: string | null;
  hoveredElementId: string | null;
  deviceMode: DeviceMode;
  editorMode: EditorMode;
  isPreview: boolean;
  leftPanelTab: 'components' | 'layers' | 'code';
  rightPanelTab: 'style' | 'content' | 'layout' | 'animations';
  leftPanelCollapsed: boolean;
  rightPanelCollapsed: boolean;
  history: Page[][];
  historyIndex: number;
  globalComponents: Record<string, ElementInstance>;
  presence: PresenceUser[];
  zoom: number;
  pan: { x: number; y: number };
  
  // Actions
  setElements: (elements: ElementInstance[]) => void;
  addElement: (element: ElementInstance, parentId?: string, index?: number) => void;
  removeElement: (id: string) => void;
  updateElement: (id: string, updates: Partial<ElementInstance>) => void;
  selectElement: (id: string | null) => void;
  setHoveredElementId: (id: string | null) => void;
  reorderElement: (id: string, targetId: string, position: 'before' | 'after' | 'inside') => void;
  moveElement: (id: string, direction: 'up' | 'down' | 'top' | 'bottom') => void;
  moveElementTo: (id: string, parentId: string | null, index: number) => void;
  setDeviceMode: (mode: DeviceMode) => void;
  setEditorMode: (mode: EditorMode) => void;
  setLeftPanelTab: (tab: 'components' | 'layers' | 'code') => void;
  setRightPanelTab: (tab: 'style' | 'content' | 'layout' | 'animations') => void;
  setLeftPanelCollapsed: (collapsed: boolean) => void;
  setRightPanelCollapsed: (collapsed: boolean) => void;
  setZoom: (zoom: number) => void;
  setPan: (pan: { x: number; y: number }) => void;
  
  // Page Actions
  addPage: (name: string) => void;
  removePage: (id: string) => void;
  setActivePage: (id: string) => void;
  renamePage: (id: string, name: string) => void;
  setPreview: (isPreview: boolean) => void;
  duplicateElement: (id: string) => void;

  // Global Components
  convertToGlobal: (id: string) => void;
  
  // Presence
  updatePresence: (user: Partial<PresenceUser>) => void;

  // History
  undo: () => void;
  redo: () => void;
  saveToHistory: () => void;
}

const initialPageId = uuidv4();
const initialPages: Page[] = [
  { id: initialPageId, name: 'Home', elements: [] }
];

export const useBuilderStore = create<BuilderState>()(
  persist(
    (set, get) => ({
      pages: initialPages,
      activePageId: initialPageId,
      elements: [],
      selectedElementId: null,
      hoveredElementId: null,
      deviceMode: 'desktop',
      editorMode: 'design',
      isPreview: false,
      leftPanelTab: 'components',
      rightPanelTab: 'style',
      leftPanelCollapsed: false,
      rightPanelCollapsed: false,
      history: [initialPages],
      historyIndex: 0,
      globalComponents: {},
      presence: [],
      zoom: 1,
      pan: { x: 0, y: 0 },

      setElements: (elements) => {
        const { pages, activePageId } = get();
        const newPages = pages.map(p => p.id === activePageId ? { ...p, elements } : p);
        set({ elements, pages: newPages });
      },

      addElement: (element, parentId, index) => {
        const { elements, pages, activePageId } = get();
        const newElements = [...elements];
        
        if (!parentId) {
          if (typeof index === 'number') {
            newElements.splice(index, 0, element);
          } else {
            newElements.push(element);
          }
        } else {
          const findAndAdd = (items: ElementInstance[]): boolean => {
            for (const item of items) {
              if (item.id === parentId) {
                if (!item.children) item.children = [];
                if (typeof index === 'number') {
                  item.children.splice(index, 0, element);
                } else {
                  item.children.push(element);
                }
                return true;
              }
              if (item.children && findAndAdd(item.children)) return true;
            }
            return false;
          };
          findAndAdd(newElements);
        }
        
        const newPages = pages.map(p => p.id === activePageId ? { ...p, elements: newElements } : p);
        set({ elements: newElements, pages: newPages });
        get().saveToHistory();
      },

      removeElement: (id) => {
        const { elements, pages, activePageId } = get();
        const filterItems = (items: ElementInstance[]): ElementInstance[] => {
          return items
            .filter((item) => item.id !== id)
            .map((item) => ({
              ...item,
              children: item.children ? filterItems(item.children) : undefined,
            }));
        };
        const newElements = filterItems(elements);
        const newPages = pages.map(p => p.id === activePageId ? { ...p, elements: newElements } : p);
        set({ elements: newElements, pages: newPages, selectedElementId: null });
        get().saveToHistory();
      },

      updateElement: (id, updates) => {
        const { elements, pages, activePageId } = get();
        const updateItems = (items: ElementInstance[]): ElementInstance[] => {
          return items.map((item) => {
            if (item.id === id) {
              return { ...item, ...updates };
            }
            if (item.children) {
              return { ...item, children: updateItems(item.children) };
            }
            return item;
          });
        };
        const newElements = updateItems(elements);
        const newPages = pages.map(p => p.id === activePageId ? { ...p, elements: newElements } : p);
        set({ elements: newElements, pages: newPages });
        get().saveToHistory();
      },

      selectElement: (id) => set({ selectedElementId: id }),
      
      setHoveredElementId: (id) => set({ hoveredElementId: id }),

      reorderElement: (id, targetId, position) => {
        const { elements, pages, activePageId } = get();
        
        // Deep clone elements to avoid mutation
        const newElements = JSON.parse(JSON.stringify(elements)) as ElementInstance[];
        
        let elementToMove: ElementInstance | undefined;
        
        // 1. Remove element from its current position
        const removeElementById = (items: ElementInstance[]): ElementInstance[] => {
          return items.filter(item => {
            if (item.id === id) {
              elementToMove = item;
              return false;
            }
            if (item.children) {
              item.children = removeElementById(item.children);
            }
            return true;
          });
        };
        
        const filteredElements = removeElementById(newElements);
        
        if (!elementToMove) return;

        // 2. Insert element at new position
        const insertElement = (items: ElementInstance[]): ElementInstance[] => {
          const result: ElementInstance[] = [];
          for (const item of items) {
            if (item.id === targetId) {
              if (position === 'before') {
                result.push(elementToMove!);
                result.push(item);
              } else if (position === 'after') {
                result.push(item);
                result.push(elementToMove!);
              } else if (position === 'inside') {
                if (!item.children) item.children = [];
                item.children.push(elementToMove!);
                result.push(item);
              }
            } else {
              if (item.children) {
                item.children = insertElement(item.children);
              }
              result.push(item);
            }
          }
          return result;
        };

        const finalElements = insertElement(filteredElements);
        
        // If targetId was null or not found in the loop above (e.g. moving to root)
        // This is a simplified version, real reordering might need more edge case handling
        
        const newPages = pages.map(p => p.id === activePageId ? { ...p, elements: finalElements } : p);
        set({ elements: finalElements, pages: newPages });
        get().saveToHistory();
      },

      moveElement: (id, direction) => {
        const { elements, pages, activePageId } = get();
        const newElements = JSON.parse(JSON.stringify(elements)) as ElementInstance[];
        
        const findAndMove = (items: ElementInstance[]): boolean => {
          const index = items.findIndex(item => item.id === id);
          if (index !== -1) {
            if (direction === 'up' && index > 0) {
              const temp = items[index];
              items[index] = items[index - 1];
              items[index - 1] = temp;
              return true;
            }
            if (direction === 'down' && index < items.length - 1) {
              const temp = items[index];
              items[index] = items[index + 1];
              items[index + 1] = temp;
              return true;
            }
            if (direction === 'top' && index > 0) {
              const [item] = items.splice(index, 1);
              items.unshift(item);
              return true;
            }
            if (direction === 'bottom' && index < items.length - 1) {
              const [item] = items.splice(index, 1);
              items.push(item);
              return true;
            }
            return false;
          }
          
          for (const item of items) {
            if (item.children && findAndMove(item.children)) return true;
          }
          return false;
        };
        
        if (findAndMove(newElements)) {
          const newPages = pages.map(p => p.id === activePageId ? { ...p, elements: newElements } : p);
          set({ elements: newElements, pages: newPages });
          get().saveToHistory();
        }
      },

      moveElementTo: (id, parentId, index) => {
        const { elements, pages, activePageId } = get();
        const newElements = JSON.parse(JSON.stringify(elements)) as ElementInstance[];
        
        let elementToMove: ElementInstance | undefined;
        
        // 1. Remove element from its current position
        const removeElementById = (items: ElementInstance[]): ElementInstance[] => {
          return items.filter(item => {
            if (item.id === id) {
              elementToMove = item;
              return false;
            }
            if (item.children) {
              item.children = removeElementById(item.children);
            }
            return true;
          });
        };
        
        const filteredElements = removeElementById(newElements);
        if (!elementToMove) return;

        // 2. Insert at new position
        if (!parentId) {
          filteredElements.splice(index, 0, elementToMove);
        } else {
          const findAndInsert = (items: ElementInstance[]): boolean => {
            for (const item of items) {
              if (item.id === parentId) {
                if (!item.children) item.children = [];
                item.children.splice(index, 0, elementToMove!);
                return true;
              }
              if (item.children && findAndInsert(item.children)) return true;
            }
            return false;
          };
          findAndInsert(filteredElements);
        }

        const newPages = pages.map(p => p.id === activePageId ? { ...p, elements: filteredElements } : p);
        set({ elements: filteredElements, pages: newPages });
        get().saveToHistory();
      },

      setDeviceMode: (mode) => set({ deviceMode: mode }),

      setEditorMode: (mode) => set({ editorMode: mode }),

      setLeftPanelTab: (tab) => set({ leftPanelTab: tab }),
      
      setRightPanelTab: (tab) => set({ rightPanelTab: tab }),

      setLeftPanelCollapsed: (collapsed) => set({ leftPanelCollapsed: collapsed }),

      setRightPanelCollapsed: (collapsed) => set({ rightPanelCollapsed: collapsed }),

      setZoom: (zoom) => set({ zoom }),
      
      setPan: (pan) => set({ pan }),

      convertToGlobal: (id) => {
        const { elements, globalComponents } = get();
        const findElement = (items: ElementInstance[]): ElementInstance | undefined => {
          for (const item of items) {
            if (item.id === id) return item;
            if (item.children) {
              const found = findElement(item.children);
              if (found) return found;
            }
          }
        };
        const element = findElement(elements);
        if (element) {
          const globalId = uuidv4();
          const newGlobalComponents = { ...globalComponents, [globalId]: JSON.parse(JSON.stringify(element)) };
          
          const updateElements = (items: ElementInstance[]): ElementInstance[] => {
            return items.map(item => {
              if (item.id === id) {
                return { ...item, isGlobal: true, globalId };
              }
              if (item.children) {
                return { ...item, children: updateElements(item.children) };
              }
              return item;
            });
          };
          
          const newElements = updateElements(elements);
          const { pages, activePageId } = get();
          const newPages = pages.map(p => p.id === activePageId ? { ...p, elements: newElements } : p);
          set({ globalComponents: newGlobalComponents, elements: newElements, pages: newPages });
          get().saveToHistory();
        }
      },

      updatePresence: (userData) => {
        const { presence } = get();
        const existing = presence.find(u => u.id === userData.id);
        if (existing) {
          set({
            presence: presence.map(u => u.id === userData.id ? { ...u, ...userData, lastActive: Date.now() } : u)
          });
        } else if (userData.id) {
          set({
            presence: [...presence, { 
              id: userData.id, 
              name: userData.name || 'Anonymous', 
              color: userData.color || '#3b82f6',
              x: userData.x || 0,
              y: userData.y || 0,
              lastActive: Date.now()
            }]
          });
        }
      },

      addPage: (name) => {
        const { pages } = get();
        const newPage: Page = { id: uuidv4(), name, elements: [] };
        const newPages = [...pages, newPage];
        set({ pages: newPages, activePageId: newPage.id, elements: [], selectedElementId: null });
        get().saveToHistory();
      },

      removePage: (id) => {
        const { pages, activePageId } = get();
        if (pages.length <= 1) return;
        const newPages = pages.filter(p => p.id !== id);
        const nextActiveId = activePageId === id ? newPages[0].id : activePageId;
        const nextElements = newPages.find(p => p.id === nextActiveId)?.elements || [];
        set({ pages: newPages, activePageId: nextActiveId, elements: nextElements, selectedElementId: null });
        get().saveToHistory();
      },

      setActivePage: (id) => {
        const { pages } = get();
        const page = pages.find(p => p.id === id);
        if (page) {
          set({ activePageId: id, elements: page.elements, selectedElementId: null });
        }
      },

      renamePage: (id, name) => {
        const { pages } = get();
        const newPages = pages.map(p => p.id === id ? { ...p, name } : p);
        set({ pages: newPages });
        get().saveToHistory();
      },

      setPreview: (isPreview) => set({ isPreview, selectedElementId: null }),
      
      duplicateElement: (id) => {
        const { elements, pages, activePageId } = get();
        
        const findAndDuplicate = (items: ElementInstance[]): { newItems: ElementInstance[], duplicated?: ElementInstance } => {
          let duplicated: ElementInstance | undefined;
          const newItems = items.flatMap(item => {
            if (item.id === id) {
              const clone = JSON.parse(JSON.stringify(item));
              const regenerateIds = (el: ElementInstance) => {
                el.id = uuidv4();
                if (el.children) el.children.forEach(regenerateIds);
              };
              regenerateIds(clone);
              duplicated = clone;
              return [item, clone];
            }
            if (item.children) {
              const result = findAndDuplicate(item.children);
              if (result.duplicated) {
                duplicated = result.duplicated;
                return [{ ...item, children: result.newItems }];
              }
            }
            return [item];
          });
          return { newItems, duplicated };
        };

        const { newItems, duplicated } = findAndDuplicate(elements);
        if (duplicated) {
          const newPages = pages.map(p => p.id === activePageId ? { ...p, elements: newItems } : p);
          set({ elements: newItems, pages: newPages, selectedElementId: duplicated.id });
          get().saveToHistory();
        }
      },

      saveToHistory: () => {
        const { pages, history, historyIndex } = get();
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(JSON.parse(JSON.stringify(pages)));
        set({
          history: newHistory,
          historyIndex: newHistory.length - 1,
        });
      },

      undo: () => {
        const { history, historyIndex, activePageId } = get();
        if (historyIndex > 0) {
          const prevPages = JSON.parse(JSON.stringify(history[historyIndex - 1])) as Page[];
          const activePage = prevPages.find(p => p.id === activePageId) || prevPages[0];
          set({
            pages: prevPages,
            activePageId: activePage.id,
            elements: activePage.elements,
            historyIndex: historyIndex - 1,
          });
        }
      },

      redo: () => {
        const { history, historyIndex, activePageId } = get();
        if (historyIndex < history.length - 1) {
          const nextPages = JSON.parse(JSON.stringify(history[historyIndex + 1])) as Page[];
          const activePage = nextPages.find(p => p.id === activePageId) || nextPages[0];
          set({
            pages: nextPages,
            activePageId: activePage.id,
            elements: activePage.elements,
            historyIndex: historyIndex + 1,
          });
        }
      },
    }),
    {
      name: 'nexus-builder-storage',
      partialize: (state) => ({ 
        pages: state.pages, 
        activePageId: state.activePageId,
        elements: state.elements 
      }),
    }
  )
);

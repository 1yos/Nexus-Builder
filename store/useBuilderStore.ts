import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

export type ComponentType = 
  | 'section' | 'container' | 'grid' | 'flex'
  | 'heading' | 'paragraph' | 'button' | 'image' | 'icon' | 'divider' | 'spacer'
  | 'navbar' | 'hero' | 'card' | 'footer';

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

export interface ElementInstance {
  id: string;
  type: ComponentType;
  props: {
    text?: string;
    src?: string;
    alt?: string;
    href?: string;
    icon?: string;
    [key: string]: any;
  };
  styles: Styles;
  children?: ElementInstance[];
  parentId?: string;
}

export interface Page {
  id: string;
  name: string;
  elements: ElementInstance[];
}

export type DeviceMode = 'desktop' | 'tablet' | 'mobile';

interface BuilderState {
  pages: Page[];
  activePageId: string;
  elements: ElementInstance[]; // Convenience reference to active page elements
  selectedElementId: string | null;
  deviceMode: DeviceMode;
  isPreview: boolean;
  history: Page[][];
  historyIndex: number;
  
  // Actions
  setElements: (elements: ElementInstance[]) => void;
  addElement: (element: ElementInstance, parentId?: string, index?: number) => void;
  removeElement: (id: string) => void;
  updateElement: (id: string, updates: Partial<ElementInstance>) => void;
  selectElement: (id: string | null) => void;
  setDeviceMode: (mode: DeviceMode) => void;
  
  // Page Actions
  addPage: (name: string) => void;
  removePage: (id: string) => void;
  setActivePage: (id: string) => void;
  renamePage: (id: string, name: string) => void;
  setPreview: (isPreview: boolean) => void;

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
      deviceMode: 'desktop',
      isPreview: false,
      history: [initialPages],
      historyIndex: 0,

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
      
      setDeviceMode: (mode) => set({ deviceMode: mode }),

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

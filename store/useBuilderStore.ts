import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

export type ComponentType = 
  | 'section' | 'container' | 'grid' | 'flex'
  | 'heading' | 'paragraph' | 'button' | 'image' | 'icon' | 'divider' | 'spacer'
  | 'navbar' | 'hero' | 'card' | 'footer' | 'pricing' | 'features' | 'collection-list' | 'html';

export interface Styles {
  typographyToken?: string;
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
  type: 'fade' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'scale' | 'rotate' | 'bounce' | 'flip' | 'pulse' | 'float';
  duration: number;
  delay: number;
  ease: string;
  trigger: 'load' | 'scroll' | 'hover' | 'click';
  repeat?: number | 'infinity';
}

export interface Interaction {
  id: string;
  trigger: 'click' | 'hover' | 'scroll' | 'load';
  action: 'show' | 'hide' | 'scroll-to' | 'navigate' | 'open-modal';
  targetId?: string;
  value?: string;
}

export interface CollectionField {
  id: string;
  name: string;
  type: 'text' | 'image' | 'richtext' | 'date' | 'number' | 'boolean';
  required: boolean;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  fields: CollectionField[];
}

export interface Entry {
  id: string;
  collectionId: string;
  data: Record<string, any>;
}

export interface DesignToken {
  id: string;
  name: string;
  type: 'color' | 'font' | 'spacing' | 'radius' | 'typography';
  value: string;
  category?: string;
  // For typography tokens
  fontSize?: string;
  fontWeight?: string;
  fontFamily?: string;
}

export interface ElementInstance {
  id: string;
  type: ComponentType;
  name?: string;
  locked?: boolean;
  variant?: string;
  animations?: Animation[];
  interactions?: Interaction[];
  isGlobal?: boolean;
  globalId?: string;
  isMaster?: boolean;
  isSlot?: boolean;
  boundField?: string;
  variants?: { id: string; name: string; styles: Styles }[];
  activeVariantId?: string;
  slots?: Record<string, ElementInstance[]>;
  props: {
    text?: string;
    src?: string;
    alt?: string;
    href?: string;
    icon?: string;
    [key: string]: any;
  };
  styles: Styles;
  hoverStyles?: Styles;
  activeStyles?: Styles;
  focusStyles?: Styles;
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
  folderId?: string;
  order: number;
  isDynamic?: boolean;
  collectionId?: string;
}

export interface Folder {
  id: string;
  name: string;
  order: number;
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

export interface HistoryState {
  pages: Page[];
  folders: Folder[];
}

interface BuilderState {
  pages: Page[];
  folders: Folder[];
  activePageId: string;
  elements: ElementInstance[]; // Convenience reference to active page elements
  selectedElementId: string | null;
  hoveredElementId: string | null;
  deviceMode: DeviceMode;
  editorMode: EditorMode;
  isPreview: boolean;
  leftPanelTab: 'components' | 'layers' | 'code' | 'tokens' | 'cms';
  rightPanelTab: 'style' | 'content' | 'layout' | 'animations' | 'interactions';
  leftPanelCollapsed: boolean;
  rightPanelCollapsed: boolean;
  history: HistoryState[];
  historyIndex: number;
  globalComponents: Record<string, ElementInstance>;
  componentOverrides: Record<string, string>;
  tokens: DesignToken[];
  collections: Collection[];
  entries: Entry[];
  presence: PresenceUser[];
  zoom: number;
  pan: { x: number; y: number };
  playingAnimationId: string | null;
  setPlayingAnimationId: (id: string | null) => void;
  setComponentOverride: (id: string, code: string) => void;
  
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
  setLeftPanelTab: (tab: 'components' | 'layers' | 'code' | 'tokens' | 'cms') => void;
  setRightPanelTab: (tab: 'style' | 'content' | 'layout' | 'animations' | 'interactions') => void;
  setLeftPanelCollapsed: (collapsed: boolean) => void;
  setRightPanelCollapsed: (collapsed: boolean) => void;
  isolatedElementId: string | null;
  setIsolatedElementId: (id: string | null) => void;
  groupElements: (elementIds: string[]) => void;
  setZoom: (zoom: number) => void;
  setPan: (pan: { x: number; y: number }) => void;
  showOutlines: boolean;
  setShowOutlines: (show: boolean) => void;
  
  // CMS Actions
  addCollection: (collection: Collection) => void;
  updateCollection: (id: string, updates: Partial<Collection>) => void;
  deleteCollection: (id: string) => void;
  addEntry: (entry: Entry) => void;
  updateEntry: (id: string, updates: Partial<Entry>) => void;
  deleteEntry: (id: string) => void;
  showEmptySlots: boolean;
  setShowEmptySlots: (show: boolean) => void;
  
  // Page Actions
  addPage: (name: string, folderId?: string) => void;
  removePage: (id: string) => void;
  setActivePage: (id: string) => void;
  renamePage: (id: string, name: string) => void;
  updatePage: (id: string, updates: Partial<Page>) => void;
  setPreview: (isPreview: boolean) => void;
  duplicateElement: (id: string) => void;
  loadTemplate: (elements: ElementInstance[]) => void;

  // Folder Actions
  addFolder: (name: string) => void;
  removeFolder: (id: string) => void;
  renameFolder: (id: string, name: string) => void;
  movePageToFolder: (pageId: string, folderId?: string) => void;
  reorderPages: (activeId: string, overId: string) => void;
  reorderFolders: (startIndex: number, endIndex: number) => void;
  reorderItems: (activeId: string, overId: string) => void;

  // Global Components
  convertToGlobal: (id: string, name?: string) => void;
  updateGlobalComponent: (globalId: string, updates: Partial<ElementInstance>) => void;
  renameGlobalComponent: (globalId: string, name: string) => void;
  deleteGlobalComponent: (globalId: string) => void;
  
  // Tokens
  addToken: (token: DesignToken) => void;
  updateToken: (id: string, updates: Partial<DesignToken>) => void;
  removeToken: (id: string) => void;
  
  // Presence
  updatePresence: (user: Partial<PresenceUser>) => void;

  // History
  undo: () => void;
  redo: () => void;
  saveToHistory: () => void;
}

const initialPageId = uuidv4();
const initialPages: Page[] = [
  { id: initialPageId, name: 'Home', elements: [], order: 0 }
];
const initialFolders: Folder[] = [];

export const useBuilderStore = create<BuilderState>()(
  persist(
    (set, get) => ({
      pages: initialPages,
      folders: initialFolders,
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
      history: [{ pages: initialPages, folders: initialFolders }],
      historyIndex: 0,
      globalComponents: {},
      componentOverrides: {},
      tokens: [],
      collections: [],
      entries: [],
      presence: [],
      zoom: 1,
      pan: { x: 0, y: 0 },
      playingAnimationId: null,
      setPlayingAnimationId: (id) => set({ playingAnimationId: id }),
      setComponentOverride: (id, code) => set(state => ({
        componentOverrides: { ...state.componentOverrides, [id]: code }
      })),

      addCollection: (collection) => set(state => ({ collections: [...state.collections, collection] })),
      updateCollection: (id, updates) => set(state => ({
        collections: state.collections.map(c => c.id === id ? { ...c, ...updates } : c)
      })),
      deleteCollection: (id) => set(state => ({
        collections: state.collections.filter(c => c.id !== id),
        entries: state.entries.filter(e => e.collectionId !== id) // Cascade delete entries
      })),
      addEntry: (entry) => set(state => ({ entries: [...state.entries, entry] })),
      updateEntry: (id, updates) => set(state => ({
        entries: state.entries.map(e => e.id === id ? { ...e, ...updates } : e)
      })),
      deleteEntry: (id) => set(state => ({
        entries: state.entries.filter(e => e.id !== id)
      })),

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
        const { elements, pages, activePageId, globalComponents } = get();
        
        let foundGlobalId: string | null = null;
        let updatedMaster: ElementInstance | null = null;

        const updateItems = (items: ElementInstance[], currentGlobalId: string | null): ElementInstance[] => {
          let changed = false;
          const newItems = items.map((item) => {
            const nextGlobalId = item.isGlobal ? item.globalId! : currentGlobalId;
            
            if (item.id === id) {
              changed = true;
              const updatedItem = { ...item, ...updates };
              if (nextGlobalId) {
                foundGlobalId = nextGlobalId;
                if (item.isGlobal && item.globalId === foundGlobalId) {
                  updatedMaster = updatedItem;
                }
              }
              return updatedItem;
            }
            if (item.children) {
              const newChildren = updateItems(item.children, nextGlobalId);
              if (newChildren !== item.children) {
                changed = true;
                const updatedItem = { ...item, children: newChildren };
                if (item.isGlobal && item.globalId === foundGlobalId) {
                  updatedMaster = updatedItem;
                }
                return updatedItem;
              }
            }
            return item;
          });
          return changed ? newItems : items;
        };
        
        const newElements = updateItems(elements, null);
        
        if (foundGlobalId && updatedMaster) {
          // Update the master component
          const newGlobalComponents = { ...globalComponents, [foundGlobalId]: updatedMaster };
          
          // Sync all instances across all pages
          const syncInstances = (items: ElementInstance[]): ElementInstance[] => {
            return items.map(item => {
              if (item.isGlobal && item.globalId === foundGlobalId) {
                return { ...item, children: updatedMaster!.children, styles: updatedMaster!.styles, props: updatedMaster!.props };
              }
              if (item.children) {
                return { ...item, children: syncInstances(item.children) };
              }
              return item;
            });
          };
          
          const newPages = pages.map(page => ({
            ...page,
            elements: syncInstances(page.id === activePageId ? newElements : page.elements)
          }));
          
          set({ elements: newPages.find(p => p.id === activePageId)!.elements, pages: newPages, globalComponents: newGlobalComponents });
        } else {
          const newPages = pages.map(p => p.id === activePageId ? { ...p, elements: newElements } : p);
          set({ elements: newElements, pages: newPages });
        }
        
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
      isolatedElementId: null,
      setIsolatedElementId: (id) => set({ isolatedElementId: id }),
  groupElements: (elementIds) => {
    const { elements, updateElement, removeElement } = get();
    if (elementIds.length < 2) return;

    // Find parent of the first element
    const findParent = (items: ElementInstance[], id: string): ElementInstance | null => {
      for (const item of items) {
        if (item.children?.some(child => child.id === id)) return item;
        if (item.children) {
          const found = findParent(item.children, id);
          if (found) return found;
        }
      }
      return null;
    };

    const parent = findParent(elements, elementIds[0]);
    const parentId = parent?.id;

    // Create new group container
    const newGroupId = uuidv4();
    const groupContainer: ElementInstance = {
      id: newGroupId,
      type: 'container',
      name: 'Group',
      props: {},
      styles: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        padding: '10px',
      },
      children: [],
      parentId: parentId
    };

    // Get the elements to be grouped
    const elementsToGroup: ElementInstance[] = [];
    const getElements = (items: ElementInstance[]) => {
      items.forEach(item => {
        if (elementIds.includes(item.id)) {
          elementsToGroup.push({ ...item, parentId: newGroupId });
        }
        if (item.children) getElements(item.children);
      });
    };
    getElements(elements);

    groupContainer.children = elementsToGroup;

    // Remove old elements and add group container
    // This is complex because we need to remove them from their parents
    // Simplification: just add the group to the root if no parent
    if (!parentId) {
      set(state => ({
        elements: [
          ...state.elements.filter(el => !elementIds.includes(el.id)),
          groupContainer
        ]
      }));
    } else {
      const updateChildren = (items: ElementInstance[]): ElementInstance[] => {
        return items.map(item => {
          if (item.id === parentId) {
            return {
              ...item,
              children: [
                ...(item.children || []).filter(child => !elementIds.includes(child.id)),
                groupContainer
              ]
            };
          }
          if (item.children) {
            return { ...item, children: updateChildren(item.children) };
          }
          return item;
        });
      };
      set(state => ({ elements: updateChildren(state.elements) }));
    }
  },

      setZoom: (zoom) => set({ zoom }),
      setPan: (pan) => set({ pan }),
      showOutlines: false,
      setShowOutlines: (show) => set({ showOutlines: show }),
      showEmptySlots: true,
      setShowEmptySlots: (show) => set({ showEmptySlots: show }),

      convertToGlobal: (id, name) => {
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
          const master = JSON.parse(JSON.stringify(element)) as ElementInstance;
          master.isMaster = true;
          master.globalId = globalId;
          master.name = name || element.name || `Global ${element.type}`;
          
          const newGlobalComponents = { ...globalComponents, [globalId]: master };
          
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

      renameGlobalComponent: (globalId, name) => {
        const { globalComponents } = get();
        if (!globalComponents[globalId]) return;
        
        const newGlobalComponents = {
          ...globalComponents,
          [globalId]: { ...globalComponents[globalId], name }
        };
        
        set({ globalComponents: newGlobalComponents });
        get().saveToHistory();
      },

      deleteGlobalComponent: (globalId) => {
        const { globalComponents, pages } = get();
        
        // Check if it's in use
        let inUse = false;
        const checkUsage = (items: ElementInstance[]) => {
          for (const item of items) {
            if (item.isGlobal && item.globalId === globalId) {
              inUse = true;
              return;
            }
            if (item.children) checkUsage(item.children);
          }
        };
        
        pages.forEach(p => checkUsage(p.elements));
        
        if (inUse) {
          alert('Cannot delete this component because it is currently in use on one or more pages. Please remove all instances first.');
          return;
        }
        
        const newGlobalComponents = { ...globalComponents };
        delete newGlobalComponents[globalId];
        
        set({ globalComponents: newGlobalComponents });
        get().saveToHistory();
      },

      updateGlobalComponent: (globalId, updates) => {
        const { globalComponents, pages } = get();
        const master = globalComponents[globalId];
        if (!master) return;

        const newMaster = { ...master, ...updates };
        const newGlobalComponents = { ...globalComponents, [globalId]: newMaster };

        // Sync all instances across all pages
        const syncInstances = (items: ElementInstance[]): ElementInstance[] => {
          return items.map(item => {
            if (item.isGlobal && item.globalId === globalId) {
              // Apply master updates to instance
              // For now, we sync styles and props that are in the updates
              const syncedItem = { ...item };
              if (updates.styles) syncedItem.styles = { ...item.styles, ...updates.styles };
              if (updates.props) syncedItem.props = { ...item.props, ...updates.props };
              if (updates.children) syncedItem.children = updates.children;
              return syncedItem;
            }
            if (item.children) {
              return { ...item, children: syncInstances(item.children) };
            }
            return item;
          });
        };

        const newPages = pages.map(page => ({
          ...page,
          elements: syncInstances(page.elements)
        }));

        const activePage = newPages.find(p => p.id === get().activePageId);
        
        set({ 
          globalComponents: newGlobalComponents, 
          pages: newPages,
          elements: activePage ? activePage.elements : get().elements
        });
        get().saveToHistory();
      },

      addToken: (token) => set(state => ({ tokens: [...state.tokens, token] })),
      
      updateToken: (id, updates) => set(state => ({
        tokens: state.tokens.map(t => t.id === id ? { ...t, ...updates } : t)
      })),
      
      removeToken: (id) => set(state => ({
        tokens: state.tokens.filter(t => t.id !== id)
      })),

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

      addPage: (name, folderId) => {
        const { pages } = get();
        const maxOrder = pages.length > 0 ? Math.max(...pages.map(p => p.order)) : -1;
        const newPage: Page = { id: uuidv4(), name, elements: [], folderId, order: maxOrder + 1 };
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

      updatePage: (id, updates) => {
        const { pages } = get();
        const newPages = pages.map(p => p.id === id ? { ...p, ...updates } : p);
        set({ pages: newPages });
        get().saveToHistory();
      },

      addFolder: (name) => {
        const { folders, pages } = get();
        const maxOrderPages = pages.length > 0 ? Math.max(...pages.map(p => p.order)) : -1;
        const maxOrderFolders = folders.length > 0 ? Math.max(...folders.map(f => f.order)) : -1;
        const maxOrder = Math.max(maxOrderPages, maxOrderFolders);
        
        const newFolder: Folder = { id: uuidv4(), name, order: maxOrder + 1 };
        set({ folders: [...folders, newFolder] });
        get().saveToHistory();
      },

      removeFolder: (id) => {
        const { folders, pages } = get();
        set({ 
          folders: folders.filter(f => f.id !== id),
          pages: pages.map(p => p.folderId === id ? { ...p, folderId: undefined } : p)
        });
        get().saveToHistory();
      },

      renameFolder: (id, name) => {
        const { folders } = get();
        set({ folders: folders.map(f => f.id === id ? { ...f, name } : f) });
        get().saveToHistory();
      },

      movePageToFolder: (pageId, folderId) => {
        const { pages, folders } = get();
        
        let newOrder = 0;
        if (folderId) {
          const folderPages = pages.filter(p => p.folderId === folderId);
          newOrder = folderPages.length > 0 ? Math.max(...folderPages.map(p => p.order)) + 1 : 0;
        } else {
          const topLevelItems = [
            ...folders.map(f => ({ order: f.order })),
            ...pages.filter(p => !p.folderId || !folders.find(f => f.id === p.folderId)).map(p => ({ order: p.order }))
          ];
          newOrder = topLevelItems.length > 0 ? Math.max(...topLevelItems.map(i => i.order)) + 1 : 0;
        }

        set({
          pages: pages.map(p => p.id === pageId ? { ...p, folderId, order: newOrder } : p)
        });
        get().saveToHistory();
      },

      reorderPages: (activeId, overId) => {
        const { pages } = get();
        const activePage = pages.find(p => p.id === activeId);
        const overPage = pages.find(p => p.id === overId);
        
        if (!activePage || !overPage || activePage.folderId !== overPage.folderId) return;

        const folderId = activePage.folderId;
        const folderPages = pages.filter(p => p.folderId === folderId).sort((a, b) => a.order - b.order);
        
        const oldIndex = folderPages.findIndex(p => p.id === activeId);
        const newIndex = folderPages.findIndex(p => p.id === overId);

        if (oldIndex !== -1 && newIndex !== -1) {
          const reorderedFolderPages = Array.from(folderPages);
          const [removed] = reorderedFolderPages.splice(oldIndex, 1);
          reorderedFolderPages.splice(newIndex, 0, removed);

          const updatedPages = pages.map(p => {
            if (p.folderId === folderId) {
              const newOrder = reorderedFolderPages.findIndex(rp => rp.id === p.id);
              return { ...p, order: newOrder };
            }
            return p;
          });

          set({ pages: updatedPages });
          get().saveToHistory();
        }
      },

      reorderFolders: (startIndex, endIndex) => {
        const { folders } = get();
        const newFolders = Array.from(folders);
        const [removed] = newFolders.splice(startIndex, 1);
        newFolders.splice(endIndex, 0, removed);
        
        // Update orders
        const updatedFolders = newFolders.map((f, i) => ({ ...f, order: i }));
        set({ folders: updatedFolders });
        get().saveToHistory();
      },

      reorderItems: (activeId, overId) => {
        const { pages, folders } = get();
        
        // This is a more complex reordering that handles intermingled pages and folders at the top level
        const allItems = [
          ...folders.map(f => ({ id: f.id, type: 'folder', order: f.order })),
          ...pages.filter(p => !p.folderId || !folders.find(f => f.id === p.folderId)).map(p => ({ id: p.id, type: 'page', order: p.order }))
        ].sort((a, b) => a.order - b.order);

        const activeIndex = allItems.findIndex(item => item.id === activeId);
        const overIndex = allItems.findIndex(item => item.id === overId);

        if (activeIndex !== -1 && overIndex !== -1) {
          const newItems = Array.from(allItems);
          const [removed] = newItems.splice(activeIndex, 1);
          newItems.splice(overIndex, 0, removed);

          // Update orders in the store
          const newPages = pages.map(p => {
            const itemIndex = newItems.findIndex(item => item.id === p.id && item.type === 'page');
            if (itemIndex !== -1) return { ...p, order: itemIndex };
            return p;
          });

          const newFolders = folders.map(f => {
            const itemIndex = newItems.findIndex(item => item.id === f.id && item.type === 'folder');
            if (itemIndex !== -1) return { ...f, order: itemIndex };
            return f;
          });

          set({ pages: newPages, folders: newFolders });
          get().saveToHistory();
        }
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
                if (el.variants) {
                  el.variants = el.variants.map(v => ({ ...v, id: uuidv4() }));
                }
                if (el.animations) {
                  el.animations = el.animations.map(a => ({ ...a, id: uuidv4() }));
                }
                if (el.interactions) {
                  el.interactions = el.interactions.map(i => ({ ...i, id: uuidv4() }));
                }
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

      loadTemplate: (templateElements) => {
        const { activePageId, pages } = get();
        const newPages = pages.map(p => p.id === activePageId ? { ...p, elements: templateElements } : p);
        set({ elements: templateElements, pages: newPages, selectedElementId: null });
        get().saveToHistory();
      },

      saveToHistory: () => {
        const { pages, folders, history, historyIndex } = get();
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(JSON.parse(JSON.stringify({ pages, folders })));
        set({
          history: newHistory,
          historyIndex: newHistory.length - 1,
        });
      },

      undo: () => {
        const { history, historyIndex, activePageId } = get();
        if (historyIndex > 0) {
          const prevState = JSON.parse(JSON.stringify(history[historyIndex - 1])) as HistoryState;
          const activePage = prevState.pages.find(p => p.id === activePageId) || prevState.pages[0];
          set({
            pages: prevState.pages,
            folders: prevState.folders,
            activePageId: activePage.id,
            elements: activePage.elements,
            historyIndex: historyIndex - 1,
          });
        }
      },

      redo: () => {
        const { history, historyIndex, activePageId } = get();
        if (historyIndex < history.length - 1) {
          const nextState = JSON.parse(JSON.stringify(history[historyIndex + 1])) as HistoryState;
          const activePage = nextState.pages.find(p => p.id === activePageId) || nextState.pages[0];
          set({
            pages: nextState.pages,
            folders: nextState.folders,
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

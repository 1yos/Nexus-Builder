'use client';

import React, { useState } from 'react';
import { useBuilderStore, Page, Folder as FolderType } from '@/store/useBuilderStore';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverEvent,
  defaultDropAnimationSideEffects,
  DropAnimation
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  FileText, 
  Plus, 
  MoreVertical, 
  Trash2, 
  Edit2, 
  ChevronDown,
  ChevronRight,
  Check,
  Folder,
  GripVertical,
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { PageSettingsModal } from './PageSettingsModal';

export default function PageSelector() {
  const { 
    pages, 
    folders,
    activePageId, 
    setActivePage, 
    addPage, 
    removePage, 
    renamePage,
    addFolder,
    removeFolder,
    renameFolder,
    movePageToFolder,
    reorderPages,
    reorderFolders,
    reorderItems
  } = useBuilderStore();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isAdding, setIsAdding] = useState<'page' | 'folder' | null>(null);
  const [newPageName, setNewPageName] = useState('');
  const [newFolderName, setNewFolderName] = useState('');
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});
  const [expandedUncategorized, setExpandedUncategorized] = useState(true);

  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [editFolderName, setEditFolderName] = useState('');
  const [settingsPageId, setSettingsPageId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const activePage = pages.find(p => p.id === activePageId) || pages[0];

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeCleanId = activeId.replace('page-', '').replace('folder-', '');
    const overCleanId = overId.replace('page-', '').replace('folder-', '');

    // Handle moving page to folder
    if (activeId.startsWith('page-') && overId.startsWith('folder-')) {
      movePageToFolder(activeCleanId, overCleanId);
      return;
    }

    // Handle reordering
    if (activeId !== overId) {
      const activePage = pages.find(p => p.id === activeCleanId);
      const overPage = pages.find(p => p.id === overCleanId);
      const overFolder = folders.find(f => f.id === overCleanId);

      const isTopLevelActive = activeId.startsWith('folder-') || (activeId.startsWith('page-') && (!activePage?.folderId || !folders.find(f => f.id === activePage.folderId)));
      const isTopLevelOver = overId.startsWith('folder-') || (overId.startsWith('page-') && (!overPage?.folderId || !folders.find(f => f.id === overPage.folderId)));

      // If dragging a nested page onto a top-level item, move it out of the folder
      if (activePage?.folderId && isTopLevelOver) {
        movePageToFolder(activeCleanId, undefined);
        reorderItems(activeCleanId, overCleanId);
        return;
      }

      // If dragging a page onto another page in a different folder, move it to that folder
      if (activeId.startsWith('page-') && overId.startsWith('page-') && activePage?.folderId !== overPage?.folderId) {
        movePageToFolder(activeCleanId, overPage?.folderId);
        // After moving, we might want to reorder it within the new folder
        // But for now, just moving it is a good start. 
        // To reorder, we'd need to wait for state update or do it in one action.
        return;
      }

      // Check if we are reordering top-level items (intermingled)
      if (isTopLevelActive && isTopLevelOver) {
        reorderItems(activeCleanId, overCleanId);
        return;
      }

      // Fallback for nested page reordering within same folder
      if (activeId.startsWith('page-') && overId.startsWith('page-')) {
        if (activePage?.folderId === overPage?.folderId) {
          reorderPages(activeCleanId, overCleanId);
        }
      }
    }
  };

  const PageItem = ({ page, depth = 0 }: { page: Page, depth?: number }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging
    } = useSortable({ id: `page-${page.id}` });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      paddingLeft: `${depth * 20 + 32}px`,
      opacity: isDragging ? 0.5 : 1,
    };

    return (
      <div 
        ref={setNodeRef}
        style={style}
        className={cn(
          "group flex items-center justify-between px-3 py-1.5 cursor-pointer text-sm text-zinc-400 hover:text-zinc-200",
          activePageId === page.id && "text-accent-primary font-medium",
          isDragging && "bg-zinc-800/50"
        )}
        onClick={() => setActivePage(page.id)}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-0.5 hover:bg-zinc-800 rounded opacity-0 group-hover:opacity-100 transition-opacity">
            <GripVertical className="w-3 h-3 text-zinc-600" />
          </div>
          {editingPageId === page.id ? (
            <input
              autoFocus
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onBlur={() => handleRename(page.id)}
              onKeyDown={(e) => e.key === 'Enter' && handleRename(page.id)}
              onClick={(e) => e.stopPropagation()}
              className="bg-zinc-800 border border-zinc-700 rounded px-1 text-xs text-zinc-200 w-full"
            />
          ) : (
            <span className="truncate">{page.name}</span>
          )}
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSettingsPageId(page.id);
            }}
            className="p-1 hover:bg-zinc-700 rounded text-zinc-500 hover:text-zinc-200"
            title="Page Settings"
          >
            <Settings className="w-3 h-3" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setEditingPageId(page.id);
              setEditName(page.name);
            }}
            className="p-1 hover:bg-zinc-700 rounded text-zinc-500 hover:text-zinc-200"
          >
            <Edit2 className="w-3 h-3" />
          </button>
          {pages.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                removePage(page.id);
              }}
              className="p-1 hover:bg-red-500/20 rounded text-zinc-500 hover:text-red-400"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    );
  };

  const FolderItem = ({ folder, onToggle }: { folder: FolderType, onToggle: (id: string) => void }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging
    } = useSortable({ id: `folder-${folder.id}` });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
    };

    return (
      <div ref={setNodeRef} style={style} className="group">
        <div 
          className="flex items-center justify-between px-3 py-2 text-sm text-zinc-200 cursor-pointer hover:bg-zinc-800/50"
          onClick={() => onToggle(folder.id)}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-0.5 hover:bg-zinc-800 rounded opacity-0 group-hover:opacity-100 transition-opacity">
              <GripVertical className="w-3 h-3 text-zinc-600" />
            </div>
            {editingFolderId === folder.id ? (
              <input
                autoFocus
                type="text"
                value={editFolderName}
                onChange={(e) => setEditFolderName(e.target.value)}
                onBlur={() => handleRenameFolder(folder.id)}
                onKeyDown={(e) => e.key === 'Enter' && handleRenameFolder(folder.id)}
                onClick={(e) => e.stopPropagation()}
                className="bg-zinc-800 border border-zinc-700 rounded px-1 text-xs text-zinc-200 w-full"
              />
            ) : (
              <div className="flex items-center gap-2">
                <span className="truncate font-medium">{folder.name}</span>
                <ChevronDown className={cn("w-3.5 h-3.5 text-zinc-500 transition-transform", !expandedFolders[folder.id] && "-rotate-90")} />
              </div>
            )}
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => {
                setEditingFolderId(folder.id);
                setEditFolderName(folder.name);
              }}
              className="p-1 hover:bg-zinc-700 rounded text-zinc-500 hover:text-zinc-200"
            >
              <Edit2 className="w-3 h-3" />
            </button>
            <button
              onClick={() => removeFolder(folder.id)}
              className="p-1 hover:bg-red-500/20 rounded text-zinc-500 hover:text-red-400"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>
        {expandedFolders[folder.id] && pages.filter(p => p.folderId === folder.id).map((page) => (
          <PageItem key={page.id} page={page} depth={1} />
        ))}
      </div>
    );
  };

  const toggleFolder = (id: string) => {
    setExpandedFolders(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleAddPage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPageName.trim()) {
      addPage(newPageName.trim());
      setNewPageName('');
      setIsAdding(null);
    }
  };

  const handleAddFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFolderName.trim()) {
      addFolder(newFolderName.trim());
      setNewFolderName('');
      setIsAdding(null);
    }
  };

  const handleRenameFolder = (id: string) => {
    if (editFolderName.trim()) {
      renameFolder(id, editFolderName.trim());
      setEditingFolderId(null);
    }
  };

  const handleRename = (id: string) => {
    if (editName.trim()) {
      renamePage(id, editName.trim());
      setEditingPageId(null);
    }
  };

  return (
      <div className="relative z-[70]">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-md text-sm font-medium text-zinc-200 transition-all min-w-[140px] justify-between"
        >
          <div className="flex items-center gap-2 truncate">
            <FileText className="w-4 h-4 text-accent-primary shrink-0" />
            <span className="truncate">{activePage?.name}</span>
          </div>
          <ChevronDown className={cn("w-4 h-4 text-zinc-500 transition-transform", isOpen && "rotate-180")} />
        </button>

        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => {
                setIsOpen(false);
                setIsAdding(null);
                setEditingPageId(null);
              }} 
            />
            <div className="absolute top-full left-0 mt-1 w-64 bg-zinc-900 border border-zinc-800 rounded-lg shadow-2xl z-[80] py-1 overflow-hidden">
            <div className="px-3 py-2 border-b border-zinc-800 flex items-center justify-between">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Pages</span>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setIsAdding('folder')}
                  className="p-1 hover:bg-zinc-800 rounded text-zinc-400 hover:text-white transition-colors"
                  title="Add Folder"
                >
                  <Folder className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => setIsAdding('page')}
                  className="p-1 hover:bg-zinc-800 rounded text-zinc-400 hover:text-white transition-colors"
                  title="Add Page"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="max-h-64 overflow-y-auto custom-scrollbar">
              {isAdding && (
                <form onSubmit={isAdding === 'page' ? handleAddPage : handleAddFolder} className="p-2 border-b border-zinc-800">
                  <input
                    autoFocus
                    type="text"
                    value={isAdding === 'page' ? newPageName : newFolderName}
                    onChange={(e) => isAdding === 'page' ? setNewPageName(e.target.value) : setNewFolderName(e.target.value)}
                    placeholder={`${isAdding === 'page' ? 'Page' : 'Folder'} name...`}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-xs text-zinc-200 focus:outline-none focus:ring-1 focus:ring-accent-primary"
                    onBlur={() => !(isAdding === 'page' ? newPageName : newFolderName) && setIsAdding(null)}
                  />
                </form>
              )}

              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={[
                    ...folders.map(f => ({ id: `folder-${f.id}`, order: f.order })),
                    ...pages.filter(p => !p.folderId || !folders.find(f => f.id === p.folderId)).map(p => ({ id: `page-${p.id}`, order: p.order }))
                  ]
                    .sort((a, b) => a.order - b.order)
                    .map(item => item.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {[
                    ...folders.map(f => ({ ...f, type: 'folder' as const })),
                    ...pages.filter(p => !p.folderId || !folders.find(f => f.id === p.folderId)).map(p => ({ ...p, type: 'page' as const }))
                  ]
                    .sort((a, b) => a.order - b.order)
                    .map((item) => (
                      item.type === 'folder' ? (
                        <FolderItem key={item.id} folder={item} onToggle={toggleFolder} />
                      ) : (
                        <PageItem key={item.id} page={item as Page} depth={0} />
                      )
                    ))}
                </SortableContext>
              </DndContext>
            </div>
          </div>
        </>
      )}
      {settingsPageId && (
        <PageSettingsModal 
          pageId={settingsPageId} 
          onClose={() => setSettingsPageId(null)} 
        />
      )}
    </div>
  );
}

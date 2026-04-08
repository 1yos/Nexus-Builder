'use client';

import React from 'react';
import { useBuilderStore } from '@/store/useBuilderStore';

export default function KeyboardShortcuts() {
  const { 
    selectedElementId, 
    removeElement, 
    duplicateElement, 
    undo, 
    redo, 
    copyElement, 
    pasteElement,
    selectElement,
    updateElement,
    elements
  } = useBuilderStore();

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input or textarea
      if (
        document.activeElement?.tagName === 'INPUT' || 
        document.activeElement?.tagName === 'TEXTAREA' ||
        (document.activeElement as HTMLElement)?.isContentEditable
      ) {
        return;
      }

      const isMod = e.metaKey || e.ctrlKey;

      // Undo: Cmd+Z
      if (isMod && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }

      // Redo: Cmd+Shift+Z or Cmd+Y
      if ((isMod && e.shiftKey && e.key === 'z') || (isMod && e.key === 'y')) {
        e.preventDefault();
        redo();
      }

      // Duplicate: Cmd+D
      if (isMod && e.key === 'd') {
        e.preventDefault();
        if (selectedElementId) duplicateElement(selectedElementId);
      }

      // Copy: Cmd+C
      if (isMod && e.key === 'c') {
        if (selectedElementId) {
          e.preventDefault();
          copyElement(selectedElementId);
        }
      }

      // Paste: Cmd+V
      if (isMod && e.key === 'v') {
        e.preventDefault();
        pasteElement();
      }

      // Delete: Delete or Backspace
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedElementId) {
          e.preventDefault();
          removeElement(selectedElementId);
        }
      }

      // Deselect: Escape
      if (e.key === 'Escape') {
        e.preventDefault();
        selectElement(null);
      }

      // Lock/Unlock: Cmd+L
      if (isMod && e.key === 'l') {
        e.preventDefault();
        if (selectedElementId) {
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
          const el = findElement(elements, selectedElementId);
          if (el) updateElement(selectedElementId, { locked: !el.locked });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElementId, removeElement, duplicateElement, undo, redo, copyElement, pasteElement, selectElement, updateElement, elements]);

  return null;
}

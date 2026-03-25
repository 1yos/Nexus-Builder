'use client';

import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { transform } from 'sucrase';
import { useBuilderStore, ElementInstance } from '@/store/useBuilderStore';
import { generateComponentCode } from '@/lib/codegen';
import { X, Play, Save, AlertTriangle, Code, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DeveloperMode() {
  const { 
    selectedElementId, 
    elements, 
    pages, 
    folders, 
    globalComponents, 
    codeOverrides, 
    updateCodeOverride, 
    removeCodeOverride,
    setEditorMode
  } = useBuilderStore();

  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  // Find the selected element
  const findElement = (items: ElementInstance[], id: string): ElementInstance | undefined => {
    for (const item of items) {
      if (item.id === id) return item;
      if (item.children) {
        const found = findElement(item.children, id);
        if (found) return found;
      }
    }
  };

  const selectedElement = selectedElementId ? findElement(elements, selectedElementId) : null;

  useEffect(() => {
    if (selectedElementId && selectedElement) {
      const override = codeOverrides[selectedElementId];
      const targetCode = override ? override.code : generateComponentCode(selectedElement, pages, folders, globalComponents);
      const targetError = override ? (override.error || null) : null;
      
      const timer = setTimeout(() => {
        setCode(targetCode);
        setError(targetError);
        setIsDirty(false);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [selectedElementId, selectedElement, pages, folders, globalComponents, codeOverrides]);

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value);
      setIsDirty(true);
    }
  };

  const handleSave = () => {
    if (!selectedElementId) return;

    try {
      // Transpile code
      const transpiled = transform(code, {
        transforms: ['typescript', 'jsx'],
        production: false,
      }).code;

      updateCodeOverride(selectedElementId, code, transpiled, null);
      setError(null);
      setIsDirty(false);
    } catch (err: any) {
      setError(err.message);
      updateCodeOverride(selectedElementId, code, undefined, err.message);
    }
  };

  const handleReset = () => {
    if (!selectedElementId) return;
    if (confirm('Are you sure you want to reset the code? This will remove all your custom changes and revert to the visual builder code.')) {
      removeCodeOverride(selectedElementId);
      const initialCode = generateComponentCode(selectedElement!, pages, folders, globalComponents);
      setCode(initialCode);
      setError(null);
      setIsDirty(false);
    }
  };

  if (!selectedElementId || !selectedElement) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-zinc-500 bg-zinc-950 p-8 text-center">
        <Code className="w-12 h-12 mb-4 opacity-20" />
        <h3 className="text-zinc-300 font-bold text-lg">No component selected</h3>
        <p className="text-sm mt-2 max-w-xs">
          Select a component on the canvas and click &quot;Edit Code&quot; to start customizing it.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-zinc-950 border-l border-zinc-800">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-zinc-900/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent-primary/10 flex items-center justify-center">
            <Code className="w-4 h-4 text-accent-primary" />
          </div>
          <div>
            <h3 className="text-zinc-200 font-bold text-sm">
              {selectedElement.name || selectedElement.type}
            </h3>
            <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-medium">
              Developer Mode
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isDirty && (
            <span className="text-[10px] text-amber-500 font-bold uppercase tracking-widest animate-pulse mr-2">
              Unsaved Changes
            </span>
          )}
          <button 
            onClick={handleReset}
            className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 transition-colors"
            title="Reset to Visual Code"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 px-3 py-1.5 bg-accent-primary hover:bg-accent-primary/90 text-white text-xs font-bold rounded-lg transition-all shadow-lg shadow-accent-primary/20"
          >
            <Save className="w-3.5 h-3.5" />
            Save & Run
          </button>
          <button 
            onClick={() => setEditorMode('design')}
            className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 relative overflow-hidden">
        <Editor
          height="100%"
          defaultLanguage="typescript"
          theme="vs-dark"
          value={code}
          onChange={handleEditorChange}
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            lineNumbers: 'on',
            roundedSelection: false,
            scrollBeyondLastLine: false,
            readOnly: false,
            automaticLayout: true,
            padding: { top: 16, bottom: 16 },
            fontFamily: 'JetBrains Mono, monospace',
          }}
        />
      </div>

      {/* Footer / Error Console */}
      {error && (
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="p-4 bg-red-500/10 border-t border-red-500/20"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-red-500 font-bold text-xs uppercase tracking-wider">Compilation Error</h4>
              <pre className="text-xs text-red-400 mt-1 whitespace-pre-wrap font-mono leading-relaxed">
                {error}
              </pre>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { useBuilderStore, ElementInstance } from '@/store/useBuilderStore';
import { GoogleGenAI } from "@google/genai";
import { Sparkles, Loader2, Send, Wand2, History, Trash2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY as string });

export default function AIPanel() {
  const [prompt, setPrompt] = useState('');
  const { addElement, isAiGenerating, setAiGenerating } = useBuilderStore();
  const [history, setHistory] = useState<{prompt: string, timestamp: number}[]>([]);

  const generateLayout = async () => {
    if (!prompt.trim() || isAiGenerating) return;

    setAiGenerating(true);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `You are a website builder AI. Generate a JSON structure for a website section based on the user's prompt: "${prompt}".
        
        The structure must follow this TypeScript interface:
        interface ElementInstance {
          type: 'section' | 'container' | 'grid' | 'flex' | 'heading' | 'paragraph' | 'button' | 'image' | 'icon' | 'divider' | 'spacer';
          props: Record<string, any>;
          styles: Record<string, any>;
          children?: ElementInstance[];
        }
        
        Rules:
        1. Return ONLY the JSON for a single root 'section' element.
        2. Use modern, clean Tailwind-like styles in the styles object.
        3. Ensure the hierarchy is logical (Section > Container > Grid/Flex > Content).
        4. Do not include IDs in the JSON, I will generate them.
        5. Use high-quality placeholder images from picsum.photos if needed.
        6. Make it look professional and startup-ready.`,
        config: {
          responseMimeType: "application/json"
        }
      });

      if (!response.text) {
        throw new Error("AI failed to generate content");
      }

      const result = JSON.parse(response.text);
      
      // Recursively add IDs
      const prepareElement = (el: any): ElementInstance => {
        return {
          ...el,
          id: uuidv4(),
          children: el.children?.map(prepareElement)
        };
      };

      const newElement = prepareElement(result);
      addElement(newElement);
      
      setHistory([{ prompt, timestamp: Date.now() }, ...history.slice(0, 9)]);
      setPrompt('');
    } catch (error) {
      console.error('AI Generation failed:', error);
    } finally {
      setAiGenerating(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-zinc-900 overflow-hidden">
      <div className="p-4 border-b border-zinc-800">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-purple-500/10 rounded-lg">
            <Sparkles className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-zinc-100">AI Assistant</h2>
            <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-medium">Smart Layout Engine</p>
          </div>
        </div>

        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the section you want to build... (e.g. 'A dark hero section for a crypto startup with a 3D image')"
            className="w-full h-32 bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all resize-none"
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), generateLayout())}
          />
          <button
            onClick={generateLayout}
            disabled={!prompt.trim() || isAiGenerating}
            className="absolute bottom-3 right-3 p-2 bg-purple-600 hover:bg-purple-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white rounded-lg transition-all shadow-lg shadow-purple-900/20"
          >
            {isAiGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-zinc-400">
            <History className="w-4 h-4" />
            <span className="text-[11px] font-bold uppercase tracking-widest">Recent Prompts</span>
          </div>
          {history.length > 0 && (
            <button onClick={() => setHistory([])} className="text-zinc-600 hover:text-zinc-400 transition-colors">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-12 h-12 bg-zinc-800/50 rounded-full flex items-center justify-center mb-4 border border-zinc-700/50">
              <Wand2 className="w-6 h-6 text-zinc-600" />
            </div>
            <p className="text-xs text-zinc-500 max-w-[180px]">
              Try asking for a hero section, pricing table, or a contact form.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((item, i) => (
              <div 
                key={i}
                onClick={() => setPrompt(item.prompt)}
                className="p-3 bg-zinc-800/30 border border-zinc-800 rounded-xl hover:border-purple-500/30 hover:bg-zinc-800/50 transition-all cursor-pointer group"
              >
                <p className="text-xs text-zinc-300 line-clamp-2 mb-2 group-hover:text-zinc-100 transition-colors">
                  {item.prompt}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-[9px] text-zinc-600 font-mono">
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <Sparkles className="w-3 h-3 text-purple-500/0 group-hover:text-purple-500/50 transition-all" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 bg-zinc-950/50 border-t border-zinc-800">
        <div className="flex items-center gap-3 p-3 bg-purple-500/5 border border-purple-500/10 rounded-xl">
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
          <p className="text-[10px] text-purple-300/80 leading-relaxed">
            AI Layout Engine is active. Describe your vision and let the assistant build it for you.
          </p>
        </div>
      </div>
    </div>
  );
}

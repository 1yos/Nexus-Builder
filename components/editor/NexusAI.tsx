'use client';

import React from 'react';
import { useBuilderStore } from '@/store/useBuilderStore';
import { 
  Sparkles, 
  Wand2, 
  Type, 
  Palette, 
  Layout, 
  Send,
  Loader2,
  CheckCircle2,
  RefreshCcw
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || 'dummy-key' });

interface Message {
  role: 'user' | 'assistant';
  content: string;
  result?: any;
}

export default function NexusAI() {
  const [prompt, setPrompt] = React.useState('');
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [messages, setMessages] = React.useState<Message[]>([
    { role: 'assistant', content: "Hello! I'm Nexus AI. How can I help you design your site today?" }
  ]);
  const { addElement, selectedElementId, updateElement, elements } = useBuilderStore();
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleGenerate = async () => {
    if (!prompt || !process.env.NEXT_PUBLIC_GEMINI_API_KEY) return;
    
    const userMessage: Message = { role: 'user', content: prompt };
    setMessages(prev => [...prev, userMessage]);
    setPrompt('');
    setIsGenerating(true);

    try {
      const response = await genAI.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `
          You are Nexus AI, a design assistant for a website builder.
          The user wants to: ${prompt}
          
          If they want to generate a section, return a JSON object representing the element structure.
          The element structure should follow this format:
          {
            "type": "section" | "flex" | "grid" | "text" | "button" | "image" | "card",
            "name": "Descriptive Name",
            "props": { ... },
            "styles": { ... },
            "children": [ ... ]
          }
          
          If they want to refine styles of the selected element (ID: ${selectedElementId}), return a JSON object with the new styles.
          
          Return ONLY the JSON object.
        `
      });
      
      const text = response.text;
      if (!text) throw new Error("No response from AI");
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      let resultData = null;
      if (jsonMatch) {
        resultData = JSON.parse(jsonMatch[0]);
      }

      const assistantMessage: Message = { 
        role: 'assistant', 
        content: resultData ? "I've generated a design for you. Would you like to apply it?" : "I've processed your request. How else can I help?",
        result: resultData
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("AI Generation Error:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I encountered an error while processing your request." }]);
    } finally {
      setIsGenerating(false);
    }
  };

  const applyResult = (result: any) => {
    if (!result) return;
    
    if (result.type && !selectedElementId) {
      addElement(result);
    } else if (selectedElementId) {
      updateElement(selectedElementId, {
        styles: { ...elements.find(e => e.id === selectedElementId)?.styles, ...result.styles },
        props: { ...elements.find(e => e.id === selectedElementId)?.props, ...result.props }
      });
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-zinc-900 overflow-hidden">
      <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-accent-primary animate-pulse" />
          <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-200">Nexus AI</h2>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={cn(
              "flex flex-col max-w-[85%] gap-2",
              msg.role === 'user' ? "ml-auto items-end" : "items-start"
            )}
          >
            <div className={cn(
              "p-3 rounded-2xl text-xs leading-relaxed shadow-sm",
              msg.role === 'user' 
                ? "bg-accent-primary text-white rounded-tr-none" 
                : "bg-zinc-800 text-zinc-200 border border-zinc-700 rounded-tl-none"
            )}>
              {msg.content}
            </div>
            {msg.result && (
              <div className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl p-3 space-y-3">
                <div className="flex items-center gap-2 text-[10px] font-bold text-accent-primary uppercase tracking-wider">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Ready to apply
                </div>
                <button
                  onClick={() => applyResult(msg.result)}
                  className="w-full py-2 bg-accent-primary text-white rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-accent-primary transition-all"
                >
                  Apply Design
                </button>
              </div>
            )}
          </div>
        ))}
        {isGenerating && (
          <div className="flex items-center gap-2 text-zinc-500 text-[10px] font-medium animate-pulse">
            <Loader2 className="w-3 h-3 animate-spin" />
            Nexus is thinking...
          </div>
        )}
      </div>

      <div className="p-4 border-t border-zinc-800 space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <QuickAction 
            icon={Layout} 
            label="New Section" 
            onClick={() => setPrompt("Generate a modern landing page section for a tech startup")} 
          />
          <QuickAction 
            icon={Palette} 
            label="Refine Styles" 
            onClick={() => setPrompt("Make the selected element look more premium")} 
          />
        </div>

        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleGenerate())}
            placeholder="Ask Nexus AI..."
            className="w-full h-20 bg-zinc-800 border border-zinc-700 rounded-xl p-3 pr-12 text-xs text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-accent-primary transition-all resize-none"
          />
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt}
            className="absolute bottom-3 right-3 p-2 bg-accent-primary hover:bg-accent-primary text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        {!process.env.NEXT_PUBLIC_GEMINI_API_KEY && (
          <p className="text-[9px] text-amber-500/70 text-center">
            API key missing. Nexus AI is in demo mode.
          </p>
        )}
      </div>
    </div>
  );
}

function QuickAction({ icon: Icon, label, onClick }: { icon: any; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-2 p-3 bg-zinc-800/50 border border-zinc-800 rounded-xl hover:bg-zinc-800 hover:border-zinc-700 transition-all group"
    >
      <Icon className="w-4 h-4 text-zinc-500 group-hover:text-accent-primary transition-colors" />
      <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-tighter group-hover:text-zinc-300 transition-colors">{label}</span>
    </button>
  );
}

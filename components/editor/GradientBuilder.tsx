'use client';

import React from 'react';
import { Plus, Trash2, MoveHorizontal, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GradientStop {
  color: string;
  position: number;
}

interface GradientBuilderProps {
  value: string;
  onChange: (value: string) => void;
}

export default function GradientBuilder({ value, onChange }: GradientBuilderProps) {
  const [type, setType] = React.useState<'linear' | 'radial'>('linear');
  const [angle, setAngle] = React.useState(180);
  const [stops, setStops] = React.useState<GradientStop[]>([
    { color: '#3b82f6', position: 0 },
    { color: '#8b5cf6', position: 100 }
  ]);

  // Parse existing value if possible
  React.useEffect(() => {
    if (value && value.includes('gradient')) {
      // Very basic parsing for now
      if (value.startsWith('radial-gradient')) setType('radial');
      else setType('linear');
    }
  }, [value]);

  const updateGradient = (newStops: GradientStop[], newAngle: number, newType: 'linear' | 'radial') => {
    const sortedStops = [...newStops].sort((a, b) => a.position - b.position);
    const stopsStr = sortedStops.map(s => `${s.color} ${s.position}%`).join(', ');
    const newValue = newType === 'linear' 
      ? `linear-gradient(${newAngle}deg, ${stopsStr})`
      : `radial-gradient(circle, ${stopsStr})`;
    onChange(newValue);
  };

  const handleAddStop = () => {
    const newStops = [...stops, { color: '#ffffff', position: 50 }];
    setStops(newStops);
    updateGradient(newStops, angle, type);
  };

  const handleRemoveStop = (index: number) => {
    if (stops.length <= 2) return;
    const newStops = stops.filter((_, i) => i !== index);
    setStops(newStops);
    updateGradient(newStops, angle, type);
  };

  const handleStopChange = (index: number, updates: Partial<GradientStop>) => {
    const newStops = stops.map((s, i) => i === index ? { ...s, ...updates } : s);
    setStops(newStops);
    updateGradient(newStops, angle, type);
  };

  return (
    <div className="space-y-4 p-3 bg-zinc-800/50 rounded-xl border border-zinc-800">
      <div className="flex items-center justify-between">
        <div className="flex bg-zinc-900 p-0.5 rounded-lg border border-zinc-800">
          <button
            onClick={() => { setType('linear'); updateGradient(stops, angle, 'linear'); }}
            className={cn(
              "px-3 py-1 text-[9px] font-bold uppercase rounded-md transition-all",
              type === 'linear' ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            Linear
          </button>
          <button
            onClick={() => { setType('radial'); updateGradient(stops, angle, 'radial'); }}
            className={cn(
              "px-3 py-1 text-[9px] font-bold uppercase rounded-md transition-all",
              type === 'radial' ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            Radial
          </button>
        </div>
        {type === 'linear' && (
          <div className="flex items-center gap-2">
            <RotateCcw className="w-3 h-3 text-zinc-500" />
            <input
              type="number"
              value={angle}
              onChange={(e) => { setAngle(Number(e.target.value)); updateGradient(stops, Number(e.target.value), type); }}
              className="w-12 bg-zinc-900 border border-zinc-800 rounded px-1.5 py-0.5 text-[10px] text-zinc-300 focus:outline-none focus:ring-1 focus:ring-accent-primary"
            />
          </div>
        )}
      </div>

      <div className="relative h-6 rounded-lg border border-zinc-700 overflow-hidden mb-8" style={{ background: value }}>
        <div className="absolute inset-0 flex items-center px-1">
          {stops.map((stop, idx) => (
            <div
              key={idx}
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-white shadow-lg cursor-pointer z-10"
              style={{ left: `${stop.position}%`, backgroundColor: stop.color, transform: 'translate(-50%, -50%)' }}
            />
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {stops.map((stop, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <input
              type="color"
              value={stop.color}
              onChange={(e) => handleStopChange(idx, { color: e.target.value })}
              className="w-6 h-6 rounded border-none bg-transparent cursor-pointer"
            />
            <div className="flex-1 flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="100"
                value={stop.position}
                onChange={(e) => handleStopChange(idx, { position: Number(e.target.value) })}
                className="flex-1 accent-accent-primary h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-[10px] text-zinc-500 w-6 text-right">{stop.position}%</span>
            </div>
            <button
              onClick={() => handleRemoveStop(idx)}
              disabled={stops.length <= 2}
              className="p-1 text-zinc-600 hover:text-red-400 disabled:opacity-30"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={handleAddStop}
        className="w-full py-1.5 flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-[10px] font-bold uppercase text-zinc-400 hover:text-zinc-200 transition-all"
      >
        <Plus className="w-3 h-3" />
        Add Stop
      </button>
    </div>
  );
}

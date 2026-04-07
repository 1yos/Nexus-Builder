'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { useBuilderStore } from '@/store/useBuilderStore';
import { 
  Image as ImageIcon, 
  Video, 
  File, 
  Upload, 
  Search, 
  X, 
  Trash2, 
  ExternalLink,
  Plus,
  MoreVertical,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function AssetManager() {
  const { assets, addAsset, removeAsset } = useBuilderStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'image' | 'video' | 'file'>('all');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || asset.type === filter;
    return matchesSearch && matchesFilter;
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setIsUploading(true);
    
    // Simulate upload for now
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        let type: 'image' | 'video' | 'file' = 'file';
        if (file.type.startsWith('image/')) type = 'image';
        else if (file.type.startsWith('video/')) type = 'video';

        addAsset({
          name: file.name,
          url: url,
          type: type,
          size: file.size,
        });
      };
      reader.readAsDataURL(file);
    });

    setTimeout(() => {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full bg-zinc-900 text-zinc-100">
      <div className="p-4 border-b border-zinc-800">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">Assets</h2>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="p-1.5 bg-accent-primary hover:bg-accent-primary/90 rounded-md text-white transition-colors"
          >
            <Plus size={16} />
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            className="hidden" 
            multiple 
            accept="image/*,video/*,.pdf,.doc,.docx"
          />
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
          <input 
            type="text"
            placeholder="Search assets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-800 border-none rounded-md py-2 pl-9 pr-4 text-xs focus:ring-1 focus:ring-accent-primary outline-none"
          />
        </div>

        <div className="flex gap-1">
          {(['all', 'image', 'video', 'file'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-3 py-1 rounded-full text-[10px] font-medium capitalize transition-colors",
                filter === f ? "bg-accent-primary text-white" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {filteredAssets.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-zinc-500 gap-2">
            <Upload size={32} strokeWidth={1.5} />
            <p className="text-xs">No assets found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredAssets.map((asset) => (
              <AssetCard key={asset.id} asset={asset} onRemove={() => removeAsset(asset.id)} />
            ))}
          </div>
        )}
      </div>

      {isUploading && (
        <div className="p-4 border-t border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-accent-primary/20 flex items-center justify-center">
              <Upload size={14} className="text-accent-primary animate-bounce" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-medium">Uploading assets...</p>
              <div className="w-full h-1 bg-zinc-800 rounded-full mt-1 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="h-full bg-accent-primary"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AssetCard({ asset, onRemove }: { asset: any, onRemove: () => void }) {
  const [isHovered, setIsHovered] = useState(false);

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="group relative bg-zinc-800 rounded-lg overflow-hidden border border-zinc-700/50 hover:border-accent-primary/50 transition-all"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="aspect-square bg-zinc-950 flex items-center justify-center overflow-hidden">
        {asset.type === 'image' ? (
          <Image 
            src={asset.url} 
            alt={asset.name} 
            fill 
            className="object-cover" 
            referrerPolicy="no-referrer"
          />
        ) : asset.type === 'video' ? (
          <Video size={24} className="text-zinc-600" />
        ) : (
          <File size={24} className="text-zinc-600" />
        )}
      </div>

      <div className="p-2">
        <p className="text-[10px] font-medium truncate text-zinc-300">{asset.name}</p>
        <p className="text-[9px] text-zinc-500">{formatSize(asset.size)}</p>
      </div>

      <AnimatePresence>
        {isHovered && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 flex items-center justify-center gap-2"
          >
            <button 
              onClick={() => window.open(asset.url, '_blank')}
              className="p-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-md text-zinc-300 transition-colors"
              title="View original"
            >
              <ExternalLink size={14} />
            </button>
            <button 
              onClick={onRemove}
              className="p-1.5 bg-red-500/20 hover:bg-red-500 rounded-md text-red-400 hover:text-white transition-all"
              title="Delete"
            >
              <Trash2 size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

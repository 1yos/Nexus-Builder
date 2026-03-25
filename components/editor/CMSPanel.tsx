import React, { useState } from 'react';
import { useBuilderStore, Collection, CollectionField, Entry } from '@/store/useBuilderStore';
import { Plus, Trash2, Edit2, ChevronLeft, Database, FileText, Image as ImageIcon, Type, Calendar, Hash, ToggleLeft } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export function CMSPanel() {
  const { collections, entries, addCollection, updateCollection, deleteCollection, addEntry, updateEntry, deleteEntry } = useBuilderStore();
  const [activeCollectionId, setActiveCollectionId] = useState<string | null>(null);
  const [editingCollectionId, setEditingCollectionId] = useState<string | null>(null);
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);

  const activeCollection = collections.find(c => c.id === activeCollectionId);
  const collectionEntries = entries.filter(e => e.collectionId === activeCollectionId);

  const handleCreateCollection = () => {
    const newCollection: Collection = {
      id: uuidv4(),
      name: 'New Collection',
      slug: 'new-collection',
      fields: [
        { id: uuidv4(), name: 'Title', type: 'text', required: true }
      ]
    };
    addCollection(newCollection);
    setEditingCollectionId(newCollection.id);
  };

  const handleCreateEntry = () => {
    if (!activeCollection) return;
    const newEntry: Entry = {
      id: uuidv4(),
      collectionId: activeCollection.id,
      data: {}
    };
    addEntry(newEntry);
    setEditingEntryId(newEntry.id);
  };

  const getFieldIcon = (type: string) => {
    switch (type) {
      case 'text': return <Type className="w-3 h-3" />;
      case 'richtext': return <FileText className="w-3 h-3" />;
      case 'image': return <ImageIcon className="w-3 h-3" />;
      case 'date': return <Calendar className="w-3 h-3" />;
      case 'number': return <Hash className="w-3 h-3" />;
      case 'boolean': return <ToggleLeft className="w-3 h-3" />;
      default: return <Type className="w-3 h-3" />;
    }
  };

  if (editingEntryId && activeCollection) {
    const entry = entries.find(e => e.id === editingEntryId);
    if (!entry) return null;

    return (
      <div className="flex flex-col h-full bg-zinc-900 text-zinc-200">
        <div className="flex items-center gap-2 p-3 border-b border-zinc-800">
          <button onClick={() => setEditingEntryId(null)} className="p-1 hover:bg-zinc-800 rounded">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <h3 className="text-xs font-bold uppercase tracking-wider">Edit Entry</h3>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {activeCollection.fields.map(field => (
            <div key={field.id} className="space-y-1.5">
              <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider flex items-center gap-1">
                {getFieldIcon(field.type)}
                {field.name}
                {field.required && <span className="text-red-500">*</span>}
              </label>
              {field.type === 'text' || field.type === 'number' || field.type === 'date' ? (
                <input
                  type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
                  value={entry.data[field.name] || ''}
                  onChange={(e) => updateEntry(entry.id, { data: { ...entry.data, [field.name]: e.target.value } })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-md p-2 text-xs text-zinc-200"
                />
              ) : field.type === 'image' ? (
                <input
                  type="text"
                  placeholder="Image URL..."
                  value={entry.data[field.name] || ''}
                  onChange={(e) => updateEntry(entry.id, { data: { ...entry.data, [field.name]: e.target.value } })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-md p-2 text-xs text-zinc-200"
                />
              ) : field.type === 'boolean' ? (
                <input
                  type="checkbox"
                  checked={entry.data[field.name] || false}
                  onChange={(e) => updateEntry(entry.id, { data: { ...entry.data, [field.name]: e.target.checked } })}
                  className="w-4 h-4 rounded border-zinc-700 bg-zinc-800"
                />
              ) : (
                <textarea
                  value={entry.data[field.name] || ''}
                  onChange={(e) => updateEntry(entry.id, { data: { ...entry.data, [field.name]: e.target.value } })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-md p-2 text-xs text-zinc-200 min-h-[100px]"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (editingCollectionId) {
    const collection = collections.find(c => c.id === editingCollectionId);
    if (!collection) return null;

    return (
      <div className="flex flex-col h-full bg-zinc-900 text-zinc-200">
        <div className="flex items-center gap-2 p-3 border-b border-zinc-800">
          <button onClick={() => setEditingCollectionId(null)} className="p-1 hover:bg-zinc-800 rounded">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <h3 className="text-xs font-bold uppercase tracking-wider">Edit Collection</h3>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Name</label>
              <input
                type="text"
                value={collection.name}
                onChange={(e) => {
                  const name = e.target.value;
                  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                  updateCollection(collection.id, { name, slug });
                }}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-md p-2 text-xs text-zinc-200"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Slug</label>
              <input
                type="text"
                value={collection.slug}
                onChange={(e) => updateCollection(collection.id, { slug: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-md p-2 text-xs text-zinc-200 font-mono"
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Fields</h4>
              <button
                onClick={() => {
                  const newField: CollectionField = { id: uuidv4(), name: 'New Field', type: 'text', required: false };
                  updateCollection(collection.id, { fields: [...collection.fields, newField] });
                }}
                className="p-1 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
            <div className="space-y-2">
              {collection.fields.map((field, idx) => (
                <div key={field.id} className="p-2 bg-zinc-800/50 border border-zinc-800 rounded-lg space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={field.name}
                      onChange={(e) => {
                        const newFields = [...collection.fields];
                        newFields[idx].name = e.target.value;
                        updateCollection(collection.id, { fields: newFields });
                      }}
                      className="flex-1 bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-[11px] text-zinc-200"
                    />
                    <button
                      onClick={() => {
                        const newFields = collection.fields.filter(f => f.id !== field.id);
                        updateCollection(collection.id, { fields: newFields });
                      }}
                      className="p-1 text-zinc-500 hover:text-red-400"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={field.type}
                      onChange={(e) => {
                        const newFields = [...collection.fields];
                        newFields[idx].type = e.target.value as any;
                        updateCollection(collection.id, { fields: newFields });
                      }}
                      className="flex-1 bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-[10px] text-zinc-400"
                    >
                      <option value="text">Text</option>
                      <option value="richtext">Rich Text</option>
                      <option value="image">Image</option>
                      <option value="date">Date</option>
                      <option value="number">Number</option>
                      <option value="boolean">Boolean</option>
                    </select>
                    <label className="flex items-center gap-1 text-[10px] text-zinc-400">
                      <input
                        type="checkbox"
                        checked={field.required}
                        onChange={(e) => {
                          const newFields = [...collection.fields];
                          newFields[idx].required = e.target.checked;
                          updateCollection(collection.id, { fields: newFields });
                        }}
                        className="rounded border-zinc-700 bg-zinc-900"
                      />
                      Required
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeCollection) {
    return (
      <div className="flex flex-col h-full bg-zinc-900 text-zinc-200">
        <div className="flex items-center justify-between p-3 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <button onClick={() => setActiveCollectionId(null)} className="p-1 hover:bg-zinc-800 rounded">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <h3 className="text-xs font-bold uppercase tracking-wider truncate max-w-[120px]">{activeCollection.name}</h3>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setEditingCollectionId(activeCollection.id)}
              className="p-1 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded"
              title="Edit Collection"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleCreateEntry}
              className="p-1 text-accent-primary hover:bg-accent-primary/10 rounded"
              title="Add Entry"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
          {collectionEntries.length === 0 ? (
            <div className="p-4 text-center text-zinc-500 text-xs">
              No entries yet. Create one to get started.
            </div>
          ) : (
            collectionEntries.map(entry => (
              <div key={entry.id} className="group flex items-center justify-between p-2 hover:bg-zinc-800/50 rounded-md cursor-pointer" onClick={() => setEditingEntryId(entry.id)}>
                <span className="text-xs text-zinc-300 truncate">
                  {entry.data[activeCollection.fields[0]?.name] || 'Untitled'}
                </span>
                <button
                  onClick={(e) => { e.stopPropagation(); deleteEntry(entry.id); }}
                  className="p-1 text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-zinc-900 text-zinc-200">
      <div className="flex items-center justify-between p-3 border-b border-zinc-800">
        <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
          <Database className="w-3.5 h-3.5" />
          CMS
        </h3>
        <button
          onClick={handleCreateCollection}
          className="p-1 text-accent-primary hover:bg-accent-primary/10 rounded"
          title="Add Collection"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
        {collections.length === 0 ? (
          <div className="p-4 text-center text-zinc-500 text-xs">
            No collections yet. Create one to manage dynamic content.
          </div>
        ) : (
          collections.map(collection => (
            <div key={collection.id} className="group flex items-center justify-between p-2 hover:bg-zinc-800/50 rounded-md cursor-pointer" onClick={() => setActiveCollectionId(collection.id)}>
              <div className="flex items-center gap-2">
                <Database className="w-3.5 h-3.5 text-zinc-500" />
                <span className="text-xs text-zinc-300">{collection.name}</span>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => { e.stopPropagation(); setEditingCollectionId(collection.id); }}
                  className="p-1 text-zinc-500 hover:text-zinc-300"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); deleteCollection(collection.id); }}
                  className="p-1 text-zinc-500 hover:text-red-400"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

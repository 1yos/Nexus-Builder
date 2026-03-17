'use client';

import DashboardSidebar from '@/components/dashboard/Sidebar';
import { Plus, MoreVertical, Edit2, Trash2, ExternalLink, Clock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';

const projects = [
  {
    id: 'proj-1',
    name: 'My Awesome Startup',
    lastEdited: '2 hours ago',
    thumbnail: 'https://picsum.photos/seed/proj1/800/600',
    status: 'Published'
  },
  {
    id: 'proj-2',
    name: 'Portfolio 2026',
    lastEdited: 'Yesterday',
    thumbnail: 'https://picsum.photos/seed/proj2/800/600',
    status: 'Draft'
  },
  {
    id: 'proj-3',
    name: 'Client: Digital Agency',
    lastEdited: '3 days ago',
    thumbnail: 'https://picsum.photos/seed/proj3/800/600',
    status: 'Draft'
  }
];

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-zinc-50">
      <DashboardSidebar />
      
      <main className="flex-grow p-8">
        <div className="max-w-6xl mx-auto">
          <header className="flex justify-between items-center mb-10">
            <div>
              <h1 className="text-3xl font-bold text-zinc-900">My Projects</h1>
              <p className="text-zinc-500">Manage and edit your websites.</p>
            </div>
            <Link 
              href="/builder"
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" /> Create New Project
            </Link>
          </header>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white rounded-2xl border border-zinc-200 overflow-hidden group hover:shadow-xl transition-all"
              >
                <div className="relative aspect-video bg-zinc-100 overflow-hidden">
                  <Image 
                    src={project.thumbnail}
                    alt={project.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 right-3">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                      project.status === 'Published' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-zinc-100 text-zinc-600'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <Link 
                      href={`/builder?id=${project.id}`}
                      className="bg-white text-zinc-900 px-4 py-2 rounded-lg text-sm font-bold hover:bg-zinc-100 transition-colors flex items-center gap-2"
                    >
                      <Edit2 className="w-4 h-4" /> Edit
                    </Link>
                  </div>
                </div>
                
                <div className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-zinc-900 truncate pr-4">{project.name}</h3>
                    <button className="p-1 hover:bg-zinc-100 rounded-md transition-colors text-zinc-400">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-zinc-500">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {project.lastEdited}
                    </div>
                    <div className="flex gap-2">
                      <button className="hover:text-blue-600 transition-colors">
                        <ExternalLink className="w-4 h-4" />
                      </button>
                      <button className="hover:text-red-600 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Empty State / Create New Card */}
            <Link 
              href="/builder"
              className="border-2 border-dashed border-zinc-200 rounded-2xl flex flex-col items-center justify-center p-8 hover:border-blue-400 hover:bg-blue-50/30 transition-all group min-h-[280px]"
            >
              <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center mb-4 group-hover:bg-blue-100 group-hover:scale-110 transition-all">
                <Plus className="w-6 h-6 text-zinc-400 group-hover:text-blue-600" />
              </div>
              <p className="font-bold text-zinc-900">Create New Project</p>
              <p className="text-sm text-zinc-500">Start from scratch or a template</p>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

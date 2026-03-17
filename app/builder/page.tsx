import Editor from '@/components/editor/Editor';
import { Suspense } from 'react';

export default function BuilderPage() {
  return (
    <main className="min-h-screen">
      <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading Builder...</div>}>
        <Editor />
      </Suspense>
    </main>
  );
}

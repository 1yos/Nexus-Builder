'use client';

import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { useBuilderStore } from '@/store/useBuilderStore';
import * as Babel from '@babel/standalone';

const PREVIEW_TEMPLATE = `
<!DOCTYPE html>
<html>
  <head>
    <script>
      const suppressError = (e) => {
        const message = e.message || (e.reason && e.reason.message) || '';
        if (typeof message === 'string' && (message.includes('ResizeObserver loop') || message.includes('ResizeObserver loop limit exceeded'))) {
          e.stopImmediatePropagation();
          e.preventDefault();
        }
      };
      window.addEventListener('error', suppressError, { capture: true });
      window.addEventListener('unhandledrejection', suppressError, { capture: true });
      
      const originalOnerror = window.onerror;
      window.onerror = function(msg, url, line, col, error) {
        if (typeof msg === 'string' && (msg.includes('ResizeObserver loop') || msg.includes('ResizeObserver loop limit exceeded'))) {
          return true;
        }
        if (originalOnerror) {
          return originalOnerror(msg, url, line, col, error);
        }
      };
      
      const originalConsoleError = console.error;
      console.error = (...args) => {
        if (args.length > 0 && typeof args[0] === 'string' && args[0].includes('ResizeObserver loop')) {
          return;
        }
        originalConsoleError.apply(console, args);
      };
    </script>
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body>
    <div id="root"></div>
    <script>
      const { useState, useEffect } = React;
      
      let root = null;
      window.renderComponent = (code) => {
        try {
          const transpiled = Babel.transform(code, { presets: ['env', 'react'] }).code;
          const exports = {};
          const require = (module) => {
            if (module === 'react') return React;
            if (module === 'react-dom') return ReactDOM;
            return {};
          };
          new Function('exports', 'require', 'React', transpiled)(exports, require, React);
          const Component = exports.default || exports;
          if (!Component) throw new Error('No default export found');
          if (!root) {
            root = ReactDOM.createRoot(document.getElementById('root'));
          }
          root.render(React.createElement(Component));
        } catch (err) {
          if (root) {
            root.unmount();
            root = null;
          }
          document.getElementById('root').innerHTML = '<pre style="color:red; padding: 1rem;">' + err.message + '</pre>';
        }
      };
    </script>
  </body>
</html>
`;

export default function DeveloperMode() {
  const { selectedElementId, componentOverrides, setComponentOverride } = useBuilderStore();
  const [code, setCode] = useState('');
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const isIframeLoaded = useRef(false);

  useEffect(() => {
    if (selectedElementId) {
      const savedCode = componentOverrides[selectedElementId] || `
export default function CustomComponent() {
  return (
    <div className="p-4 bg-blue-500 text-white rounded">
      Hello from Custom Component!
    </div>
  );
}
`;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCode(savedCode);
    }
  }, [selectedElementId, componentOverrides]);

  const latestCode = useRef(code);
  useEffect(() => {
    latestCode.current = code;
  }, [code]);

  useEffect(() => {
    if (iframeRef.current) {
      const iframe = iframeRef.current;
      if (!iframe.srcdoc) {
        iframe.onload = () => {
          isIframeLoaded.current = true;
          (iframe.contentWindow as any)?.renderComponent(latestCode.current);
        };
        iframe.srcdoc = PREVIEW_TEMPLATE;
      } else if (isIframeLoaded.current) {
        (iframe.contentWindow as any)?.renderComponent(code);
      }
    }
  }, [code]);

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined && selectedElementId) {
      setCode(value);
      setComponentOverride(selectedElementId, value);
    }
  };

  if (!selectedElementId) {
    return <div className="flex-1 p-4 text-zinc-500 flex items-center justify-center">Select a component to edit code.</div>;
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden min-w-0">
      <div className="p-2 bg-amber-100 text-amber-800 text-xs font-bold border-b border-amber-200">
        Warning: Editing code will break visual sync for this component.
      </div>
      <div className="flex flex-1 overflow-hidden min-w-0 min-h-0">
        <div className="w-1/2 border-r border-zinc-800 h-full min-w-0">
          <Editor
            height="100%"
            defaultLanguage="javascript"
            value={code}
            onChange={handleEditorChange}
            theme="vs-dark"
            options={{ minimap: { enabled: false } }}
          />
        </div>
        <div className="w-1/2 bg-white h-full min-w-0">
          <iframe
            ref={iframeRef}
            className="w-full h-full"
            title="preview"
          />
        </div>
      </div>
    </div>
  );
}

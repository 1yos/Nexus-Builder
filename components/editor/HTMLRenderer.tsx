import React, { useEffect, useState } from 'react';

export function HTMLRenderer({ html, className, style }: { html: string, className?: string, style?: React.CSSProperties }) {
  const [debouncedHtml, setDebouncedHtml] = useState(html);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedHtml(html);
    }, 500);
    return () => clearTimeout(timer);
  }, [html]);

  return (
    <iframe
      srcDoc={debouncedHtml}
      className={className}
      style={{ border: 'none', width: '100%', height: '100%', ...style }}
      sandbox="allow-scripts allow-same-origin allow-popups"
      title="HTML Content"
    />
  );
}

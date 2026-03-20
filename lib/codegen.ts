import { ElementInstance, Page, Folder } from "@/store/useBuilderStore";

/**
 * Generates a clean HTML string for a list of elements.
 */
export function generateHTML(elements: ElementInstance[], pages: Page[], folders: Folder[], isStaticExport = false): string {
  return elements.map(el => {
    const styles = Object.entries(el.styles || {})
      .map(([k, v]) => `${k.replace(/[A-Z]/g, m => "-" + m.toLowerCase())}: ${v}`)
      .join('; ');
    
    let tag = 'div';
    const props: string[] = [];
    
    const getHref = (href: string) => {
      if (!isStaticExport || !href || !href.startsWith('/')) return href || '#';
      if (href === '/') return 'index.html';
      // Use the page name for the filename to match generateSiteCode
      const targetPage = pages.find(p => p.id === href.substring(1));
      if (targetPage) {
        const baseName = targetPage.name.toLowerCase().replace(/\s+/g, '-');
        return baseName === 'home' ? 'index.html' : `${baseName}.html`;
      }
      return href.substring(1).toLowerCase().replace(/\s+/g, '-') + '.html';
    };
    
    switch (el.type) {
      case 'heading':
        tag = `h${el.props.level || 1}`;
        break;
      case 'paragraph':
        tag = 'p';
        break;
      case 'button':
        tag = 'a';
        props.push(`href="${getHref(el.props.href || '#')}"`);
        break;
      case 'image':
        tag = 'img';
        props.push(`src="${el.props.src || ''}"`);
        props.push(`alt="${el.props.alt || ''}"`);
        break;
      case 'section':
        tag = 'section';
        break;
      case 'navbar':
        tag = 'nav';
        break;
      case 'footer':
        tag = 'footer';
        break;
      case 'icon':
        tag = 'span';
        break;
      case 'divider':
        tag = 'hr';
        break;
      case 'spacer':
        tag = 'div';
        break;
    }
    
    const propsString = props.length > 0 ? ' ' + props.join(' ') : '';
    let children = el.children ? generateHTML(el.children, pages, folders, isStaticExport) : (el.props.text || '');
    
    if (el.type === 'navbar') {
      const logo = el.props.logoType === 'image' 
        ? `<img src="${el.props.logoSrc}" alt="Logo" style="height: 32px;" />`
        : `<div style="font-weight: bold; font-size: 1.25rem;">${el.props.logoText || 'NEXUS'}</div>`;
      
      // Dynamic links from pages and folders
      const dynamicLinks = ([
        ...folders.map(folder => ({
          type: 'folder',
          id: folder.id,
          name: folder.name,
          order: folder.order,
          pages: pages.filter(p => p.folderId === folder.id).sort((a, b) => a.order - b.order).map(p => ({
            ...p,
            href: p.id === 'index' ? '/' : `/${p.id}`
          }))
        })),
        ...pages.filter(p => !p.folderId || !folders.find(f => f.id === p.folderId)).map(p => ({
          type: 'page',
          id: p.id,
          name: p.name,
          order: p.order,
          href: p.id === 'index' ? '/' : `/${p.id}`
        }))
      ] as any[])
        .filter(item => item.type === 'page' || (item.type === 'folder' && item.pages.length > 0))
        .sort((a, b) => a.order - b.order);

      const groupedLinks = (el.props.links && el.props.links.length > 0)
        ? el.props.links.map((l: any) => ({ ...l, type: 'page', name: l.label }))
        : dynamicLinks;

      const links = groupedLinks.map((item: any) => {
        if (item.type === 'folder') {
          return item.pages.map((p: any) => 
            `<a href="${getHref(p.href)}" style="margin-left: 1.5rem; text-decoration: none; color: inherit;">${p.name}</a>`
          ).join('');
        }
        return `<a href="${getHref(item.href)}" style="margin-left: 1.5rem; text-decoration: none; color: inherit;">${item.name}</a>`;
      }).join('');
      
      children = `<div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">${logo}<div style="display: flex;">${links}</div></div>`;
    } else if (el.type === 'footer') {
      children = `<div>${el.props.copyright || ''}</div>`;
    } else if (el.type === 'icon') {
      const iconName = (el.props.icon || 'star').toLowerCase().replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
      children = `<i data-lucide="${iconName}" style="width: 24px; height: 24px; color: ${el.styles?.color || 'inherit'};"></i>`;
    } else if (el.type === 'divider' || el.type === 'spacer') {
      children = '';
    }
    
    if (el.type === 'image' || el.type === 'divider') {
      return `<${tag} style="${styles}"${propsString} />`;
    }
    
    return `<${tag} style="${styles}"${propsString}>${children}</${tag}>`;
  }).join('\n');
}

/**
 * Generates a React component string for a list of elements.
 */
export function generateReact(elements: ElementInstance[], pages: Page[], folders: Folder[], componentName = 'GeneratedPage'): string {
  const renderElement = (el: any, indent = 2): string => {
    const spaces = ' '.repeat(indent);
    
    let tag = el.type;
    const props: string[] = [];
    
    const getReactHref = (href: string) => {
      if (!href || !href.startsWith('/')) return href || '#';
      if (href === '/') return '/';
      const pageId = href.substring(1);
      const targetPage = pages.find(p => p.id === pageId);
      if (targetPage) {
        const baseName = targetPage.name.toLowerCase().replace(/\s+/g, '-');
        return baseName === 'home' ? '/' : `/${baseName}`;
      }
      return `/${pageId.toLowerCase().replace(/\s+/g, '-')}`;
    };

    switch (el.type) {
      case 'heading':
        tag = `h${el.props.level || 1}`;
        break;
      case 'paragraph':
        tag = 'p';
        break;
      case 'button':
        if (el.props.linkType === 'internal') {
          tag = 'Link';
          props.push(`to="${getReactHref(el.props.href || '/')}"`);
        } else {
          tag = 'a';
          props.push(`href="${el.props.href || '#'}"`);
        }
        break;
      case 'image':
        tag = 'img';
        props.push(`src="${el.props.src || ''}"`);
        props.push(`alt="${el.props.alt || ''}"`);
        break;
      case 'section':
        tag = 'section';
        break;
      case 'navbar':
        tag = 'nav';
        break;
      case 'footer':
        tag = 'footer';
        break;
      case 'icon':
        tag = 'div';
        break;
      case 'divider':
        tag = 'div';
        break;
      case 'spacer':
        tag = 'div';
        break;
    }

    const otherProps = Object.entries(el.props || {})
      .filter(([k]) => !['text', 'level', 'href', 'src', 'alt', 'links', 'logoText', 'logoSrc', 'logoType', 'copyright', 'icon'].includes(k))
      .map(([k, v]) => `${k}={${JSON.stringify(v)}}`)
      .join(' ');
    
    if (otherProps) props.push(otherProps);
    
    const propsString = props.length > 0 ? ' ' + props.join(' ') : '';
    const styleObj = JSON.stringify(el.styles || {}, null, 2)
      .replace(/"([^"]+)":/g, '$1:')
      .split('\n')
      .map((line, i) => i === 0 ? line : spaces + '    ' + line)
      .join('\n');
    
    let children = el.children?.length 
      ? `\n${el.children.map((c: any) => renderElement(c, indent + 2)).join('\n')}\n${spaces}`
      : (el.props.text || '');

    if (el.type === 'navbar') {
      const logo = el.props.logoType === 'image' 
        ? `<img src="${el.props.logoSrc}" alt="Logo" style={{ height: '32px' }} />`
        : `<div style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>{${JSON.stringify(el.props.logoText || 'NEXUS')}}</div>`;
      
      // Dynamic links from pages and folders
      const dynamicLinks = ([
        ...folders.map(folder => ({
          type: 'folder',
          id: folder.id,
          name: folder.name,
          order: folder.order,
          pages: pages.filter(p => p.folderId === folder.id).sort((a, b) => a.order - b.order).map(p => ({
            ...p,
            href: p.id === 'index' ? '/' : `/${p.id}`
          }))
        })),
        ...pages.filter(p => !p.folderId || !folders.find(f => f.id === p.folderId)).map(p => ({
          type: 'page',
          id: p.id,
          name: p.name,
          order: p.order,
          href: p.id === 'index' ? '/' : `/${p.id}`
        }))
      ] as any[])
        .filter(item => item.type === 'page' || (item.type === 'folder' && item.pages.length > 0))
        .sort((a, b) => a.order - b.order);

      const groupedLinks = (el.props.links && el.props.links.length > 0)
        ? el.props.links.map((l: any) => ({ ...l, name: l.label, type: l.type || 'internal' }))
        : dynamicLinks;

      const links = groupedLinks.flatMap((item: any) => {
        if (item.type === 'folder') {
          return item.pages.map((p: any) => 
            `<Link to="${getReactHref(p.href)}" style={{ marginLeft: '1.5rem', textDecoration: 'none', color: 'inherit' }}>{${JSON.stringify(p.name)}}</Link>`
          );
        }
        if (item.type === 'internal' || item.type === 'page') {
          return [`<Link to="${getReactHref(item.href)}" style={{ marginLeft: '1.5rem', textDecoration: 'none', color: 'inherit' }}>{${JSON.stringify(item.name)}}</Link>`];
        }
        return [`<a href="${item.href}" style={{ marginLeft: '1.5rem', textDecoration: 'none', color: 'inherit' }}>{${JSON.stringify(item.name)}}</a>`];
      }).join('\n' + spaces + '          ');
      
      children = `\n${spaces}  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>\n${spaces}    ${logo}\n${spaces}    <div style={{ display: 'flex' }}>\n${spaces}      ${links}\n${spaces}    </div>\n${spaces}  </div>\n${spaces}`;
    } else if (el.type === 'footer') {
      children = `\n${spaces}  <div>{${JSON.stringify(el.props.copyright || '')}}</div>\n${spaces}`;
    } else if (el.type === 'icon') {
      const iconName = el.props.icon || 'Star';
      children = `\n${spaces}  {React.createElement((Icons as any)['${iconName}'] || Icons.HelpCircle, { size: 32, style: { color: '${el.styles?.color || 'inherit'}' } })}\n${spaces}`;
    } else if (el.type === 'divider') {
      children = `\n${spaces}  <div style={{ width: '100%', height: '1px', backgroundColor: '${el.styles?.backgroundColor || '#e5e7eb'}' }} />\n${spaces}`;
    } else if (el.type === 'spacer') {
      children = '';
    }

    if (el.type === 'image') {
      return `${spaces}<${tag}${propsString} style={${styleObj}} />`;
    }

    return `${spaces}<${tag}${propsString} style={${styleObj}}>\n${spaces}  ${children}\n${spaces}</${tag}>`;
  };

  return `import React from 'react';
import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';

export default function ${componentName}() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0A0A0F', color: '#FFFFFF' }}>
${elements.map(el => renderElement(el, 6)).join('\n')}
    </div>
  );
}`;
}

/**
 * Generates a full HTML document string for a page.
 */
export function generateFullHTML(page: Page, pages: Page[], folders: Folder[]): string {
  const content = generateHTML(page.elements, pages, folders, true);
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${page.name}</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.5; color: #FFFFFF; background-color: #0A0A0F; }
        a { text-decoration: none; color: inherit; }
        img { max-width: 100%; height: auto; }
        [data-lucide] { display: inline-block; vertical-align: middle; }
    </style>
</head>
<body>
    <div class="min-h-screen">
        ${content}
    </div>
    <script src="https://unpkg.com/lucide@latest"></script>
    <script>
      lucide.createIcons();
    </script>
</body>
</html>`;
}

/**
 * Generates the entire site structure as a record of filenames and content.
 */
export function generateSiteCode(pages: Page[], folders: Folder[], format: 'html' | 'react' = 'html'): Record<string, string> {
  const site: Record<string, string> = {};
  
  if (format === 'html') {
    pages.forEach(page => {
      const baseName = page.name.toLowerCase().replace(/\s+/g, '-');
      const filename = baseName === 'home' ? 'index.html' : `${baseName}.html`;
      site[filename] = generateFullHTML(page, pages, folders);
    });
  } else {
    // React Project Structure
    site['package.json'] = JSON.stringify({
      name: "nexus-exported-site",
      private: true,
      version: "0.0.0",
      type: "module",
      scripts: {
        "dev": "vite",
        "build": "tsc && vite build",
        "preview": "vite preview"
      },
      dependencies: {
        "react": "^18.2.0",
        "react-dom": "^18.2.0",
        "react-router-dom": "^6.14.2",
        "lucide-react": "^0.284.0"
      },
      devDependencies: {
        "@types/react": "^18.2.15",
        "@types/react-dom": "^18.2.7",
        "@vitejs/plugin-react": "^4.0.3",
        "typescript": "^5.0.2",
        "vite": "^4.4.5"
      }
    }, null, 2);

    site['tsconfig.json'] = JSON.stringify({
      compilerOptions: {
        target: "ESNext",
        useDefineForClassFields: true,
        lib: ["DOM", "DOM.Iterable", "ESNext"],
        allowJs: false,
        skipLibCheck: true,
        esModuleInterop: false,
        allowSyntheticDefaultImports: true,
        strict: true,
        forceConsistentCasingInFileNames: true,
        module: "ESNext",
        moduleResolution: "Node",
        resolveJsonModule: true,
        isolatedModules: true,
        noEmit: true,
        jsx: "react-jsx"
      },
      include: ["src"]
    }, null, 2);

    site['vite.config.ts'] = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})`;

    site['index.html'] = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>NEXUS Exported Site</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`;

    site['src/main.tsx'] = `import React from 'react'
import ReactDom from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDom.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`;

    site['src/index.css'] = `* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.5; color: #FFFFFF; background-color: #0A0A0F; }
a { text-decoration: none; color: inherit; }
img { max-width: 100%; height: auto; }`;

    // Generate pages as components
    const pageComponents: { name: string; path: string; component: string }[] = [];
    pages.forEach(page => {
      const baseName = page.name.toLowerCase().replace(/\s+/g, '-');
      const componentName = page.name.replace(/\s+/g, '');
      const path = baseName === 'home' ? '/' : `/${baseName}`;
      const filename = `src/pages/${componentName}.tsx`;
      site[filename] = generateReact(page.elements, pages, folders, componentName);
      pageComponents.push({ name: componentName, path, component: componentName });
    });

    // App.tsx with routing
    site['src/App.tsx'] = `import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
${pageComponents.map(p => `import ${p.name} from './pages/${p.name}';`).join('\n')}

function App() {
  return (
    <Router>
      <Routes>
        ${pageComponents.map(p => `<Route path="${p.path}" element={<${p.name} />} />`).join('\n        ')}
      </Routes>
    </Router>
  );
}

export default App;`;
  }
  
  return site;
}

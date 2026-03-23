import { ElementInstance, Page, Folder } from "@/store/useBuilderStore";

/**
 * Helper to generate a URL-friendly slug from a string
 */
export function getSlug(name: string): string {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  return slug || 'page';
}

/**
 * Helper to generate a valid React component name from a string
 */
export function getComponentName(name: string): string {
  const cleanName = name.replace(/[^a-zA-Z0-9 ]/g, '');
  let compName = cleanName.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
  if (/^[0-9]/.test(compName)) {
    compName = 'Page' + compName;
  }
  return compName || 'GeneratedPage';
}

/**
 * Helper to determine if a page is the home page
 */
export function isHomePage(page: Page, pages: Page[]): boolean {
  const homePageByName = pages.find(p => p.name.toLowerCase() === 'home');
  if (homePageByName) {
    return page.id === homePageByName.id;
  }
  return pages.length > 0 && pages[0].id === page.id;
}

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
      if (!isStaticExport || !href) return href || '#';
      if (href === '/') return 'index.html';
      
      // Handle both '/pageId' and 'pageId' formats
      const pageId = href.startsWith('/') ? href.substring(1) : href;
      const targetPage = pages.find(p => p.id === pageId);
      
      if (targetPage) {
        if (isHomePage(targetPage, pages)) return 'index.html';
        return `${getSlug(targetPage.name)}.html`;
      }
      
      if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('#')) {
        return href;
      }
      
      return getSlug(pageId) + '.html';
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
            href: isHomePage(p, pages) ? '/' : `/${getSlug(p.name)}`
          }))
        })),
        ...pages.filter(p => !p.folderId || !folders.find(f => f.id === p.folderId)).map(p => ({
          type: 'page',
          id: p.id,
          name: p.name,
          order: p.order,
          href: isHomePage(p, pages) ? '/' : `/${getSlug(p.name)}`
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

function stylesToTailwind(styles: Record<string, string>): string {
  const classes: string[] = [];
  for (const [key, value] of Object.entries(styles)) {
    if (!value) continue;
    
    const kebabKey = key.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
    
    if (key === 'display') {
      classes.push(value);
      continue;
    }
    if (key === 'flexDirection') {
      if (value === 'row') classes.push('flex-row');
      if (value === 'column') classes.push('flex-col');
      if (value === 'row-reverse') classes.push('flex-row-reverse');
      if (value === 'column-reverse') classes.push('flex-col-reverse');
      continue;
    }
    if (key === 'justifyContent') {
      if (value === 'flex-start') classes.push('justify-start');
      if (value === 'flex-end') classes.push('justify-end');
      if (value === 'center') classes.push('justify-center');
      if (value === 'space-between') classes.push('justify-between');
      if (value === 'space-around') classes.push('justify-around');
      if (value === 'space-evenly') classes.push('justify-evenly');
      continue;
    }
    if (key === 'alignItems') {
      if (value === 'flex-start') classes.push('items-start');
      if (value === 'flex-end') classes.push('items-end');
      if (value === 'center') classes.push('items-center');
      if (value === 'baseline') classes.push('items-baseline');
      if (value === 'stretch') classes.push('items-stretch');
      continue;
    }
    if (key === 'textAlign') {
      if (value === 'left') classes.push('text-left');
      if (value === 'center') classes.push('text-center');
      if (value === 'right') classes.push('text-right');
      if (value === 'justify') classes.push('text-justify');
      continue;
    }
    if (key === 'fontWeight') {
      if (value === '100') classes.push('font-thin');
      if (value === '200') classes.push('font-extralight');
      if (value === '300') classes.push('font-light');
      if (value === '400' || value === 'normal') classes.push('font-normal');
      if (value === '500') classes.push('font-medium');
      if (value === '600') classes.push('font-semibold');
      if (value === '700' || value === 'bold') classes.push('font-bold');
      if (value === '800') classes.push('font-extrabold');
      if (value === '900') classes.push('font-black');
      continue;
    }
    
    let prefix = '';
    if (key === 'backgroundColor') prefix = 'bg';
    else if (key === 'color') prefix = 'text';
    else if (key === 'fontSize') prefix = 'text';
    else if (key === 'padding') prefix = 'p';
    else if (key === 'paddingTop') prefix = 'pt';
    else if (key === 'paddingRight') prefix = 'pr';
    else if (key === 'paddingBottom') prefix = 'pb';
    else if (key === 'paddingLeft') prefix = 'pl';
    else if (key === 'margin') prefix = 'm';
    else if (key === 'marginTop') prefix = 'mt';
    else if (key === 'marginRight') prefix = 'mr';
    else if (key === 'marginBottom') prefix = 'mb';
    else if (key === 'marginLeft') prefix = 'ml';
    else if (key === 'width') prefix = 'w';
    else if (key === 'height') prefix = 'h';
    else if (key === 'maxWidth') prefix = 'max-w';
    else if (key === 'minHeight') prefix = 'min-h';
    else if (key === 'borderRadius') prefix = 'rounded';
    else if (key === 'border') prefix = 'border';
    else if (key === 'gap') prefix = 'gap';
    else if (key === 'boxShadow') prefix = 'shadow';
    else prefix = kebabKey;
    
    const formattedValue = value.replace(/\s+/g, '_');
    
    if (['bg', 'text', 'p', 'pt', 'pr', 'pb', 'pl', 'm', 'mt', 'mr', 'mb', 'ml', 'w', 'h', 'max-w', 'min-h', 'rounded', 'border', 'gap', 'shadow'].includes(prefix)) {
      classes.push(`${prefix}-[${formattedValue}]`);
    } else {
      classes.push(`[${kebabKey}:${formattedValue}]`);
    }
  }
  return classes.join(' ');
}

/**
 * Generates a React component string for a list of elements.
 */
export function generateReact(elements: ElementInstance[], pages: Page[], folders: Folder[], componentName = 'GeneratedPage', framework: 'react' | 'nextjs' = 'react', isPage = true, extractedComponents: string[] = []): string {
  const renderElement = (el: any, indent = 2): string => {
    const spaces = ' '.repeat(indent);
    
    let tag = el.type;
    const props: string[] = [];
    
    const getReactHref = (href: string) => {
      if (!href) return '#';
      if (href === '/') return '/';
      
      // Handle both '/pageId' and 'pageId' formats
      const pageId = href.startsWith('/') ? href.substring(1) : href;
      const targetPage = pages.find(p => p.id === pageId);
      
      if (targetPage) {
        if (isHomePage(targetPage, pages)) return '/';
        return `/${getSlug(targetPage.name)}`;
      }
      
      // If it's an external link or starts with http/mailto/tel, return as is
      if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('#')) {
        return href;
      }
      
      return href.startsWith('/') ? href : `/${href}`;
    };

    const getAnimationProps = (el: any) => {
      if (!el.animations || el.animations.length === 0) return '';
      
      const anim = el.animations[0];
      const intensity = anim.intensity || 1;
      const transition = `{ duration: ${anim.duration}, delay: ${anim.delay}, ease: "${anim.ease}", repeat: ${anim.repeat === 'infinity' ? 'Infinity' : anim.repeat || 0}, repeatType: "reverse" }`;
      
      let initial = '{}';
      let animate = '{}';
      
      switch (anim.type) {
        case 'fade':
          initial = '{ opacity: 0 }';
          animate = '{ opacity: 1 }';
          break;
        case 'slide-up':
          initial = `{ opacity: 0, y: ${40 * intensity} }`;
          animate = '{ opacity: 1, y: 0 }';
          break;
        case 'slide-down':
          initial = `{ opacity: 0, y: ${-40 * intensity} }`;
          animate = '{ opacity: 1, y: 0 }';
          break;
        case 'slide-left':
          initial = `{ opacity: 0, x: ${40 * intensity} }`;
          animate = '{ opacity: 1, x: 0 }';
          break;
        case 'slide-right':
          initial = `{ opacity: 0, x: ${-40 * intensity} }`;
          animate = '{ opacity: 1, x: 0 }';
          break;
        case 'scale':
          initial = `{ opacity: 0, scale: ${0.5 / intensity} }`;
          animate = '{ opacity: 1, scale: 1 }';
          break;
        case 'rotate':
          initial = `{ opacity: 0, rotate: ${-180 * intensity} }`;
          animate = '{ opacity: 1, rotate: 0 }';
          break;
      }
      
      if (anim.trigger === 'scroll') {
        return ` initial={${initial}} whileInView={${animate}} viewport={{ once: true, margin: "-100px" }} transition={${transition}}`;
      }
      
      return ` initial={${initial}} animate={${animate}} transition={${transition}}`;
    };

    const getInteractionProps = (el: any) => {
      let iProps = '';
      if (el.hoverStyles) iProps += ` whileHover={${JSON.stringify(el.hoverStyles)}}`;
      if (el.activeStyles) iProps += ` whileTap={${JSON.stringify(el.activeStyles)}}`;
      if (el.focusStyles) iProps += ` whileFocus={${JSON.stringify(el.focusStyles)}}`;
      return iProps;
    };

    if (el.type === 'navbar' && extractedComponents.includes('Navbar')) {
      return `${spaces}<Navbar />`;
    }
    if (el.type === 'footer' && extractedComponents.includes('Footer')) {
      return `${spaces}<Footer />`;
    }

    let isMotion = true;
    switch (el.type) {
      case 'heading':
        tag = `motion.h${el.props.level || 1}`;
        break;
      case 'paragraph':
        tag = 'motion.p';
        break;
      case 'button':
        if (el.props.linkType === 'internal') {
          tag = 'motion.div'; // Wrap Link in motion.div
          props.push(`onClick={() => window.location.href = "${getReactHref(el.props.href || '/')}"}`);
          props.push(`className="cursor-pointer"`);
        } else {
          tag = 'motion.a';
          props.push(`href="${el.props.href || '#'}"`);
        }
        break;
      case 'image':
        tag = 'motion.img';
        props.push(`src="${el.props.src || ''}"`);
        props.push(`alt="${el.props.alt || ''}"`);
        break;
      case 'section':
      case 'hero':
      case 'footer':
      case 'navbar':
        tag = `motion.${el.type === 'navbar' ? 'nav' : el.type === 'hero' ? 'section' : el.type}`;
        break;
      case 'container':
      case 'grid':
      case 'flex':
      case 'card':
      case 'pricing':
      case 'features':
      case 'icon':
      case 'divider':
      case 'spacer':
        tag = 'motion.div';
        break;
      default:
        tag = 'motion.div';
    }

    props.push(getAnimationProps(el));
    props.push(getInteractionProps(el));

    const otherProps = Object.entries(el.props || {})
      .filter(([k]) => !['text', 'level', 'href', 'src', 'alt', 'links', 'logoText', 'logoSrc', 'logoType', 'copyright', 'icon'].includes(k))
      .map(([k, v]) => `${k}={${JSON.stringify(v)}}`)
      .join(' ');
    
    if (otherProps) props.push(otherProps);
    
    const propsString = props.length > 0 ? ' ' + props.join(' ') : '';
    
    let styleProp = '';
    if (framework === 'nextjs') {
      const tailwindClasses = stylesToTailwind(el.styles || {});
      if (tailwindClasses) {
        styleProp = ` className="${tailwindClasses}"`;
      }
    } else {
      const styleObj = JSON.stringify(el.styles || {}, null, 2)
        .replace(/"([^"]+)":/g, '$1:')
        .split('\n')
        .map((line, i) => i === 0 ? line : spaces + '    ' + line)
        .join('\n');
      styleProp = ` style={${styleObj}}`;
    }
    
    let children = el.children?.length 
      ? `\n${el.children.map((c: any) => renderElement(c, indent + 2)).join('\n')}\n${spaces}`
      : (el.props.text || '');

    if (el.type === 'navbar') {
      const logoHref = getReactHref('/');
      const logo = el.props.logoType === 'image' 
        ? (framework === 'nextjs' ? `<Link href="${logoHref}"><div className="relative h-8 w-40"><img src="${el.props.logoSrc}" alt="Logo" className="h-8 w-auto object-contain cursor-pointer" /></div></Link>` : `<Link to="${logoHref}"><div style={{ height: '32px', width: '160px', position: 'relative' }}><img src="${el.props.logoSrc}" alt="Logo" style={{ height: '32px', width: 'auto', objectFit: 'contain', cursor: 'pointer' }} /></div></Link>`)
        : (framework === 'nextjs' ? `<Link href="${logoHref}"><div className="font-bold text-xl cursor-pointer tracking-tight">{${JSON.stringify(el.props.logoText || 'NEXUS')}}</div></Link>` : `<Link to="${logoHref}"><div style={{ fontWeight: 'bold', fontSize: '1.25rem', cursor: 'pointer', letterSpacing: '-0.025em' }}>{${JSON.stringify(el.props.logoText || 'NEXUS')}}</div></Link>`);
      
      // Dynamic links from pages and folders
      const dynamicLinks = ([
        ...folders.map(folder => ({
          type: 'folder',
          id: folder.id,
          name: folder.name,
          order: folder.order,
          pages: pages.filter(p => p.folderId === folder.id).sort((a, b) => a.order - b.order).map(p => ({
            ...p,
            href: isHomePage(p, pages) ? '/' : `/${getSlug(p.name)}`
          }))
        })),
        ...pages.filter(p => !p.folderId || !folders.find(f => f.id === p.folderId)).map(p => ({
          type: 'page',
          id: p.id,
          name: p.name,
          order: p.order,
          href: isHomePage(p, pages) ? '/' : `/${getSlug(p.name)}`
        }))
      ] as any[])
        .filter(item => item.type === 'page' || (item.type === 'folder' && item.pages.length > 0))
        .sort((a, b) => a.order - b.order);

      const groupedLinks = (el.props.links && el.props.links.length > 0)
        ? el.props.links.map((l: any) => ({ ...l, name: l.label, type: l.type || 'internal' }))
        : dynamicLinks;

      const desktopLinks = groupedLinks.flatMap((item: any) => {
        const linkProps = framework === 'nextjs' ? `className="text-sm font-medium hover:text-blue-600 transition-colors"` : `style={{ fontSize: '0.875rem', fontWeight: '500', textDecoration: 'none', color: 'inherit' }}`;
        if (item.type === 'folder') {
          return [
            `<div className="relative group">`,
            `  <button className="flex items-center gap-1 text-sm font-medium hover:text-blue-600 transition-colors">`,
            `    {${JSON.stringify(item.name)}}`,
            `    <Icons.ChevronDown className="w-3 h-3 group-hover:rotate-180 transition-transform" />`,
            `  </button>`,
            `  <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-[110] py-2">`,
            ...item.pages.map((p: any) => 
              `    <Link ${framework === 'nextjs' ? 'href' : 'to'}="${getReactHref(p.href)}" className="block px-4 py-2.5 text-sm hover:bg-gray-50 hover:text-blue-600 transition-colors">{${JSON.stringify(p.name)}}</Link>`
            ),
            `  </div>`,
            `</div>`
          ];
        }
        if (item.type === 'internal' || item.type === 'page') {
          return [`<Link ${framework === 'nextjs' ? 'href' : 'to'}="${getReactHref(item.href)}" ${linkProps}>{${JSON.stringify(item.name)}}</Link>`];
        }
        return [`<a href="${item.href}" ${linkProps}>{${JSON.stringify(item.name)}}</a>`];
      }).join('\n' + spaces + '          ');

      const mobileLinks = groupedLinks.flatMap((item: any) => {
        if (item.type === 'folder') {
          return [
            `<div className="flex flex-col gap-1">`,
            `  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider px-4 py-2">{${JSON.stringify(item.name)}}</div>`,
            ...item.pages.map((p: any) => 
              `  <Link ${framework === 'nextjs' ? 'href' : 'to'}="${getReactHref(p.href)}" className="px-8 py-3 text-base font-medium hover:bg-gray-50 rounded-lg transition-colors">{${JSON.stringify(p.name)}}</Link>`
            ),
            `</div>`
          ];
        }
        if (item.type === 'internal' || item.type === 'page') {
          return [`<Link ${framework === 'nextjs' ? 'href' : 'to'}="${getReactHref(item.href)}" className="px-4 py-3 text-base font-medium hover:bg-gray-50 rounded-lg transition-colors">{${JSON.stringify(item.name)}}</Link>`];
        }
        return [`<a href="${item.href}" className="px-4 py-3 text-base font-medium hover:bg-gray-50 rounded-lg transition-colors">{${JSON.stringify(item.name)}}</a>`];
      }).join('\n' + spaces + '          ');
      
      const containerProps = framework === 'nextjs' ? `className="flex justify-between items-center w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full min-h-[64px]"` : `style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '0 1rem', height: '100%', minHeight: '64px' }}`;
      const linksContainerProps = framework === 'nextjs' ? `className="hidden md:flex items-center gap-8"` : `style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}`;
      
      const hSize = parseInt(String(el.props.hamburgerSize)) || 24;
      const hColor = el.props.hamburgerColor || '#000';
      const showHamburger = el.props.mobileMenuType === 'hamburger';

      children = `\n${spaces}  <div ${containerProps}>\n${spaces}    <div className="flex items-center flex-shrink-0">\n${spaces}      ${logo}\n${spaces}    </div>\n${spaces}    <div ${linksContainerProps}>\n${spaces}      ${desktopLinks}\n${spaces}    </div>\n${spaces}    ${showHamburger ? `<div className="md:hidden flex items-center">\n${spaces}      <button className="p-2 hover:bg-black/5 rounded-md transition-colors" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>\n${spaces}        {isMobileMenuOpen ? <Icons.X size={${hSize}} color="${hColor}" /> : <Icons.Menu size={${hSize}} color="${hColor}" />}\n${spaces}      </button>\n${spaces}    </div>` : ''}\n${spaces}  </div>\n${spaces}  ${showHamburger ? `<AnimatePresence>\n${spaces}    {isMobileMenuOpen && (\n${spaces}      <motion.div \n${spaces}        initial={{ opacity: 0, height: 0 }} \n${spaces}        animate={{ opacity: 1, height: 'auto' }} \n${spaces}        exit={{ opacity: 0, height: 0 }}\n${spaces}        className="md:hidden border-t border-gray-100 overflow-hidden shadow-xl"\n${spaces}        style={{ backgroundColor: ${JSON.stringify(el.styles.backgroundColor || '#ffffff')}, color: ${JSON.stringify(el.styles.color || '#000000')} }}\n${spaces}      >\n${spaces}        <div className="p-4 flex flex-col gap-2">\n${spaces}          ${mobileLinks}\n${spaces}        </div>\n${spaces}      </motion.div>\n${spaces}    )}\n${spaces}  </AnimatePresence>` : ''}\n${spaces}`;
    } else if (el.type === 'footer') {
      children = `\n${spaces}  <div>{${JSON.stringify(el.props.copyright || '')}}</div>\n${spaces}`;
    } else if (el.type === 'icon') {
      const iconName = el.props.icon || 'Star';
      const iconProps = framework === 'nextjs' ? (el.styles?.color ? `className="text-[${el.styles.color.replace(/\s+/g, '_')}]"` : '') : `style={{ color: '${el.styles?.color || 'inherit'}' }}`;
      children = `\n${spaces}  {React.createElement((Icons as any)['${iconName}'] || Icons.HelpCircle, { size: 32, ${iconProps} })}\n${spaces}`;
    } else if (el.type === 'divider') {
      const dividerProps = framework === 'nextjs' ? `className="w-full h-px bg-[${(el.styles?.backgroundColor || '#e5e7eb').replace(/\s+/g, '_')}]"` : `style={{ width: '100%', height: '1px', backgroundColor: '${el.styles?.backgroundColor || '#e5e7eb'}' }}`;
      children = `\n${spaces}  <div ${dividerProps} />\n${spaces}`;
    } else if (el.type === 'spacer') {
      children = '';
    }

    if (el.type === 'image') {
      return `${spaces}<${tag}${propsString}${styleProp} />`;
    }

    return `${spaces}<${tag}${propsString}${styleProp}>\n${spaces}  ${children}\n${spaces}</${tag}>`;
  };

  const linkImport = framework === 'nextjs' ? `import Link from 'next/link';` : `import { Link } from 'react-router-dom';`;
  const motionImport = `import { motion, AnimatePresence } from 'framer-motion';`;

  const rootProps = framework === 'nextjs' 
    ? `className="min-h-screen bg-white text-zinc-900"`
    : `className="min-h-screen" style={{ backgroundColor: '#ffffff', color: '#18181b' }}`;

  const componentImports = extractedComponents.map(c => 
    framework === 'nextjs' ? `import ${c} from '@/components/${c}';` : `import ${c} from '../components/${c}';`
  ).join('\n');

  if (!isPage) {
    return `'use client';
import React, { useState } from 'react';
${linkImport}
${motionImport}
import * as Icons from 'lucide-react';

export default function ${componentName}() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  return (
    <>
${elements.map(el => renderElement(el, 6)).join('\n')}
    </>
  );
}`;
  }

  return `'use client';
import React, { useState } from 'react';
${linkImport}
${motionImport}
import * as Icons from 'lucide-react';
${componentImports}

export default function ${componentName}() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div ${rootProps}>
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
export function generateSiteCode(pages: Page[], folders: Folder[], format: 'html' | 'react' | 'nextjs' = 'html'): Record<string, string> {
  const site: Record<string, string> = {};
  
  if (format === 'html') {
    pages.forEach(page => {
      const baseName = getSlug(page.name);
      const filename = isHomePage(page, pages) ? 'index.html' : `${baseName}.html`;
      site[filename] = generateFullHTML(page, pages, folders);
    });
  } else if (format === 'react') {
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

    // Extract reusable components
    const componentsToExtract = ['navbar', 'footer'];
    const extractedComponents: string[] = [];
    
    for (const page of pages) {
      for (const el of page.elements) {
        if (componentsToExtract.includes(el.type)) {
          const compName = el.type === 'navbar' ? 'Navbar' : 'Footer';
          if (!extractedComponents.includes(compName)) {
            extractedComponents.push(compName);
            site[`src/components/${compName}.tsx`] = generateReact([el], pages, folders, compName, 'react', false);
          }
        }
      }
    }

    // Generate pages as components
    const pageComponents: { name: string; path: string; component: string }[] = [];
    pages.forEach(page => {
      const componentName = getComponentName(page.name);
      const slug = getSlug(page.name);
      const path = isHomePage(page, pages) ? '/' : `/${slug}`;
      const filename = `src/pages/${componentName}.tsx`;
      site[filename] = generateReact(page.elements, pages, folders, componentName, 'react', true, extractedComponents);
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
  } else if (format === 'nextjs') {
    // Next.js Project Structure
    site['package.json'] = JSON.stringify({
      name: "nexus-exported-site",
      private: true,
      version: "0.0.0",
      scripts: {
        "dev": "next dev",
        "build": "next build",
        "start": "next start",
        "lint": "next lint"
      },
      dependencies: {
        "react": "^18.2.0",
        "react-dom": "^18.2.0",
        "next": "14.2.3",
        "lucide-react": "^0.284.0",
        "framer-motion": "^11.0.8",
        "clsx": "^2.1.0",
        "tailwind-merge": "^2.2.1"
      },
      devDependencies: {
        "@types/node": "^20",
        "@types/react": "^18",
        "@types/react-dom": "^18",
        "autoprefixer": "^10.4.19",
        "postcss": "^8.4.38",
        "tailwindcss": "^3.4.3",
        "typescript": "^5"
      }
    }, null, 2);

    site['tsconfig.json'] = JSON.stringify({
      compilerOptions: {
        lib: ["dom", "dom.iterable", "esnext"],
        allowJs: true,
        skipLibCheck: true,
        strict: true,
        noEmit: true,
        esModuleInterop: true,
        module: "esnext",
        moduleResolution: "bundler",
        resolveJsonModule: true,
        isolatedModules: true,
        jsx: "preserve",
        incremental: true,
        plugins: [
          {
            name: "next"
          }
        ],
        paths: {
          "@/*": ["./*"]
        }
      },
      include: ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
      exclude: ["node_modules"]
    }, null, 2);

    site['next.config.js'] = `/** @type {import('next').NextConfig} */
const nextConfig = {};
module.exports = nextConfig;`;

    site['tailwind.config.js'] = `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};`;

    site['postcss.config.js'] = `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};`;

    site['.gitignore'] = `# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*

# local env files
.env*.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts`;

    site['README.md'] = `# Nexus Exported Site

This is a Next.js project exported from Nexus Builder.

## How to run locally

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

3. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
`;

    site['app/globals.css'] = `@tailwind base;
@tailwind components;
@tailwind utilities;

* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.5; color: #FFFFFF; background-color: #0A0A0F; }
a { text-decoration: none; color: inherit; }
img { max-width: 100%; height: auto; }`;

    site['app/layout.tsx'] = `import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NEXUS Exported Site",
  description: "Generated by Nexus Builder",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}`;

    site['lib/utils.ts'] = `import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}`;

    // Extract reusable components
    const componentsToExtract = ['navbar', 'footer'];
    const extractedComponents: string[] = [];
    
    for (const page of pages) {
      for (const el of page.elements) {
        if (componentsToExtract.includes(el.type)) {
          const compName = el.type === 'navbar' ? 'Navbar' : 'Footer';
          if (!extractedComponents.includes(compName)) {
            extractedComponents.push(compName);
            site[`components/${compName}.tsx`] = generateReact([el], pages, folders, compName, 'nextjs', false);
          }
        }
      }
    }

    // Generate pages
    pages.forEach(page => {
      const componentName = getComponentName(page.name);
      const slug = getSlug(page.name);
      const path = isHomePage(page, pages) ? 'app/page.tsx' : `app/${slug}/page.tsx`;
      site[path] = generateReact(page.elements, pages, folders, componentName, 'nextjs', true, extractedComponents);
    });
  }
  
  return site;
}

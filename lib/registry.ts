import { ComponentType, ElementInstance, Styles } from "@/store/useBuilderStore";
import { 
  Type, 
  Layout, 
  Image as ImageIcon, 
  Square, 
  Type as TextIcon, 
  MousePointer2, 
  Columns, 
  Rows,
  Layers,
  LayoutTemplate,
  CreditCard,
  ListTodo,
  MessageSquare,
  Navigation
} from "lucide-react";

export interface ComponentVariant {
  id: string;
  label: string;
  styles: Styles;
  props?: any;
}

export interface ComponentDefinition {
  type: ComponentType;
  label: string;
  icon: any;
  defaultProps: any;
  defaultStyles: Styles;
  isContainer?: boolean;
  variants?: ComponentVariant[];
}

export const COMPONENT_REGISTRY: Record<ComponentType, ComponentDefinition> = {
  section: {
    type: 'section',
    label: 'Section',
    icon: Layout,
    isContainer: true,
    defaultProps: {},
    defaultStyles: {
      padding: '4rem 2rem',
      backgroundColor: '#ffffff',
      display: 'block',
      width: '100%',
    },
    variants: [
      { id: 'light', label: 'Light', styles: { backgroundColor: '#ffffff', color: '#111827' } },
      { id: 'dark', label: 'Dark', styles: { backgroundColor: '#111827', color: '#ffffff' } },
      { id: 'accent', label: 'Accent', styles: { backgroundColor: '#3b82f6', color: '#ffffff' } },
    ]
  },
  container: {
    type: 'container',
    label: 'Container',
    icon: Square,
    isContainer: true,
    defaultProps: {},
    defaultStyles: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 1rem',
      display: 'block',
    },
  },
  grid: {
    type: 'grid',
    label: 'Grid',
    icon: Columns,
    isContainer: true,
    defaultProps: { columns: 3 },
    defaultStyles: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '1.5rem',
      padding: '1rem 0',
    },
  },
  flex: {
    type: 'flex',
    label: 'Flexbox',
    icon: Rows,
    isContainer: true,
    defaultProps: {},
    defaultStyles: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '1rem',
      padding: '1rem 0',
    },
  },
  heading: {
    type: 'heading',
    label: 'Heading',
    icon: Type,
    defaultProps: { text: 'New Heading', level: 1 },
    defaultStyles: {
      fontSize: '2.5rem',
      fontWeight: '700',
      color: '#111827',
      marginBottom: '1rem',
    },
    variants: [
      { id: 'h1', label: 'H1', styles: { fontSize: '3.5rem', fontWeight: '800' } },
      { id: 'h2', label: 'H2', styles: { fontSize: '2.5rem', fontWeight: '700' } },
      { id: 'h3', label: 'H3', styles: { fontSize: '1.875rem', fontWeight: '600' } },
      { id: 'display', label: 'Display', styles: { fontSize: '5rem', fontWeight: '900', letterSpacing: '-0.05em' } },
    ]
  },
  paragraph: {
    type: 'paragraph',
    label: 'Paragraph',
    icon: TextIcon,
    defaultProps: { text: 'Start typing your content here...' },
    defaultStyles: {
      fontSize: '1rem',
      lineHeight: '1.6',
      color: '#4b5563',
      marginBottom: '1rem',
    },
    variants: [
      { id: 'lead', label: 'Lead', styles: { fontSize: '1.25rem', color: '#374151' } },
      { id: 'small', label: 'Small', styles: { fontSize: '0.875rem', color: '#6b7280' } },
    ]
  },
  button: {
    type: 'button',
    label: 'Button',
    icon: MousePointer2,
    defaultProps: { text: 'Click Me', href: '#', linkType: 'external' },
    defaultStyles: {
      padding: '0.75rem 1.5rem',
      backgroundColor: '#3b82f6',
      color: '#ffffff',
      borderRadius: '0.5rem',
      fontWeight: '600',
      display: 'inline-block',
      textAlign: 'center',
    },
    variants: [
      { id: 'primary', label: 'Primary', styles: { backgroundColor: '#3b82f6', color: '#ffffff', border: 'none' } },
      { id: 'secondary', label: 'Secondary', styles: { backgroundColor: '#111827', color: '#ffffff', border: 'none' } },
      { id: 'outline', label: 'Outline', styles: { backgroundColor: 'transparent', color: '#3b82f6', border: '2px solid #3b82f6' } },
      { id: 'ghost', label: 'Ghost', styles: { backgroundColor: 'transparent', color: '#3b82f6', border: 'none' } },
    ]
  },
  image: {
    type: 'image',
    label: 'Image',
    icon: ImageIcon,
    defaultProps: { src: 'https://picsum.photos/seed/builder/800/600', alt: 'Placeholder' },
    defaultStyles: {
      width: '100%',
      height: 'auto',
      borderRadius: '0.5rem',
      display: 'block',
    },
  },
  icon: {
    type: 'icon',
    label: 'Icon',
    icon: Layers,
    defaultProps: { icon: 'Star' },
    defaultStyles: {
      fontSize: '2rem',
      color: '#3b82f6',
    },
  },
  divider: {
    type: 'divider',
    label: 'Divider',
    icon: Square,
    defaultProps: {},
    defaultStyles: {
      height: '1px',
      backgroundColor: '#e5e7eb',
      margin: '2rem 0',
      width: '100%',
    },
  },
  spacer: {
    type: 'spacer',
    label: 'Spacer',
    icon: Square,
    defaultProps: {},
    defaultStyles: {
      height: '2rem',
      width: '100%',
    },
  },
  navbar: {
    type: 'navbar',
    label: 'Navbar',
    icon: Navigation,
    defaultProps: { 
      logoType: 'text',
      logoText: 'Nexus', 
      logoSrc: '',
      links: [
        { id: '1', label: 'Home', href: '/', type: 'internal' },
        { id: '2', label: 'About', href: '/about', type: 'internal' },
        { id: '3', label: 'Contact', href: '/contact', type: 'internal' }
      ],
      mobileMenuType: 'hamburger',
      hamburgerColor: '#111827',
      hamburgerSize: '24px',
      showMobileMenu: false // State for editor preview
    },
    defaultStyles: {
      padding: '1rem 2rem',
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e5e7eb',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
    },
  },
  hero: {
    type: 'hero',
    label: 'Hero',
    icon: LayoutTemplate,
    isContainer: true,
    defaultProps: {},
    defaultStyles: {
      padding: '8rem 2rem',
      backgroundColor: '#f9fafb',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
  },
  card: {
    type: 'card',
    label: 'Card',
    icon: CreditCard,
    isContainer: true,
    defaultProps: {},
    defaultStyles: {
      padding: '1.5rem',
      backgroundColor: '#ffffff',
      borderRadius: '0.75rem',
      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      border: '1px solid #f3f4f6',
    },
  },
  footer: {
    type: 'footer',
    label: 'Footer',
    icon: Layout,
    defaultProps: { copyright: '© 2026 Nexus Builder' },
    defaultStyles: {
      padding: '4rem 2rem',
      backgroundColor: '#111827',
      color: '#ffffff',
      textAlign: 'center',
    },
  },
  pricing: {
    type: 'pricing',
    label: 'Pricing',
    icon: CreditCard,
    isContainer: true,
    defaultProps: {},
    defaultStyles: {
      padding: '4rem 2rem',
      backgroundColor: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '2rem',
    },
  },
  features: {
    type: 'features',
    label: 'Features',
    icon: ListTodo,
    isContainer: true,
    defaultProps: {},
    defaultStyles: {
      padding: '4rem 2rem',
      backgroundColor: '#f9fafb',
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '2rem',
    },
  },
};

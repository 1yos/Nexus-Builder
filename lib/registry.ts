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
  defaultChildren?: any[];
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
    defaultProps: { text: 'Craft Your Vision', level: 1 },
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
    defaultProps: { text: 'This is a sample paragraph. You can edit this text to describe your product, share your story, or provide important information to your visitors. Make it engaging and clear.' },
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
    defaultProps: { text: 'Get Started', href: '#', linkType: 'external' },
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
    defaultProps: { icon: 'Zap' },
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
      links: [],
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
    defaultChildren: [
      {
        type: 'heading',
        props: { text: 'Build Something Amazing', level: 1 },
        styles: { fontSize: '4rem', fontWeight: '800', marginBottom: '1.5rem', color: '#111827' }
      },
      {
        type: 'paragraph',
        props: { text: 'The most powerful website builder for creative professionals. Drag, drop, and launch your next big idea in minutes.' },
        styles: { fontSize: '1.25rem', color: '#4b5563', maxWidth: '600px', marginBottom: '2.5rem' }
      },
      {
        type: 'button',
        props: { text: 'Start Building Now', href: '#' },
        styles: { padding: '1rem 2rem', backgroundColor: '#3b82f6', color: '#ffffff', borderRadius: '0.5rem', fontWeight: '700' }
      }
    ]
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
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem'
    },
    defaultChildren: [
      {
        type: 'image',
        props: { src: 'https://picsum.photos/seed/card/400/250', alt: 'Card Image' },
        styles: { borderRadius: '0.5rem', width: '100%' }
      },
      {
        type: 'heading',
        props: { text: 'Feature Title', level: 3 },
        styles: { fontSize: '1.25rem', fontWeight: '700', color: '#111827' }
      },
      {
        type: 'paragraph',
        props: { text: 'A brief description of this feature or service that highlights its main benefits.' },
        styles: { fontSize: '0.875rem', color: '#6b7280' }
      }
    ]
  },
  footer: {
    type: 'footer',
    label: 'Footer',
    icon: Layout,
    defaultProps: { copyright: '© 2026 Nexus Builder. All rights reserved.' },
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
    defaultChildren: [
      {
        type: 'heading',
        props: { text: 'Simple, Transparent Pricing', level: 2 },
        styles: { fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }
      },
      {
        type: 'paragraph',
        props: { text: 'Choose the plan that works best for you and your team.' },
        styles: { color: '#6b7280', marginBottom: '3rem' }
      },
      {
        type: 'grid',
        props: { columns: 3 },
        styles: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', width: '100%', maxWidth: '1000px' },
        children: [
          {
            type: 'card',
            styles: { padding: '2rem', border: '1px solid #e5e7eb', borderRadius: '1rem', textAlign: 'center' },
            children: [
              { type: 'heading', props: { text: 'Free', level: 3 }, styles: { fontSize: '1.5rem', fontWeight: '700' } },
              { type: 'heading', props: { text: '$0', level: 4 }, styles: { fontSize: '2.5rem', fontWeight: '800', margin: '1rem 0' } },
              { type: 'paragraph', props: { text: 'Perfect for hobbyists' }, styles: { fontSize: '0.875rem', color: '#6b7280', marginBottom: '1.5rem' } },
              { type: 'button', props: { text: 'Choose Free' }, styles: { width: '100%', backgroundColor: '#f3f4f6', color: '#111827' } }
            ]
          },
          {
            type: 'card',
            styles: { padding: '2rem', border: '2px solid #3b82f6', borderRadius: '1rem', textAlign: 'center', position: 'relative' },
            children: [
              { type: 'heading', props: { text: 'Pro', level: 3 }, styles: { fontSize: '1.5rem', fontWeight: '700', color: '#3b82f6' } },
              { type: 'heading', props: { text: '$19', level: 4 }, styles: { fontSize: '2.5rem', fontWeight: '800', margin: '1rem 0' } },
              { type: 'paragraph', props: { text: 'For growing businesses' }, styles: { fontSize: '0.875rem', color: '#6b7280', marginBottom: '1.5rem' } },
              { type: 'button', props: { text: 'Go Pro' }, styles: { width: '100%', backgroundColor: '#3b82f6', color: '#ffffff' } }
            ]
          },
          {
            type: 'card',
            styles: { padding: '2rem', border: '1px solid #e5e7eb', borderRadius: '1rem', textAlign: 'center' },
            children: [
              { type: 'heading', props: { text: 'Enterprise', level: 3 }, styles: { fontSize: '1.5rem', fontWeight: '700' } },
              { type: 'heading', props: { text: '$49', level: 4 }, styles: { fontSize: '2.5rem', fontWeight: '800', margin: '1rem 0' } },
              { type: 'paragraph', props: { text: 'Advanced features' }, styles: { fontSize: '0.875rem', color: '#6b7280', marginBottom: '1.5rem' } },
              { type: 'button', props: { text: 'Contact Sales' }, styles: { width: '100%', backgroundColor: '#f3f4f6', color: '#111827' } }
            ]
          }
        ]
      }
    ]
  },
  features: {
    type: 'features',
    label: 'Features',
    icon: ListTodo,
    isContainer: true,
    defaultProps: {},
    defaultStyles: {
      padding: '6rem 2rem',
      backgroundColor: '#f9fafb',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    defaultChildren: [
      {
        type: 'heading',
        props: { text: 'Everything you need to succeed', level: 2 },
        styles: { fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem', textAlign: 'center' }
      },
      {
        type: 'paragraph',
        props: { text: 'Our platform provides all the tools you need to build, launch, and grow your online presence.' },
        styles: { color: '#6b5563', marginBottom: '4rem', textAlign: 'center', maxWidth: '600px' }
      },
      {
        type: 'grid',
        props: { columns: 3 },
        styles: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '3rem', width: '100%', maxWidth: '1200px' },
        children: [
          {
            type: 'flex',
            styles: { flexDirection: 'column', alignItems: 'flex-start', gap: '1rem' },
            children: [
              { type: 'icon', props: { icon: 'Zap' }, styles: { fontSize: '2rem', color: '#3b82f6' } },
              { type: 'heading', props: { text: 'Lightning Fast', level: 3 }, styles: { fontSize: '1.25rem', fontWeight: '700' } },
              { type: 'paragraph', props: { text: 'Optimized for speed and performance out of the box.' }, styles: { fontSize: '0.875rem', color: '#6b7280' } }
            ]
          },
          {
            type: 'flex',
            styles: { flexDirection: 'column', alignItems: 'flex-start', gap: '1rem' },
            children: [
              { type: 'icon', props: { icon: 'Shield' }, styles: { fontSize: '2rem', color: '#3b82f6' } },
              { type: 'heading', props: { text: 'Secure by Default', level: 3 }, styles: { fontSize: '1.25rem', fontWeight: '700' } },
              { type: 'paragraph', props: { text: 'Enterprise-grade security to keep your data safe.' }, styles: { fontSize: '0.875rem', color: '#6b7280' } }
            ]
          },
          {
            type: 'flex',
            styles: { flexDirection: 'column', alignItems: 'flex-start', gap: '1rem' },
            children: [
              { type: 'icon', props: { icon: 'Smartphone' }, styles: { fontSize: '2rem', color: '#3b82f6' } },
              { type: 'heading', props: { text: 'Fully Responsive', level: 3 }, styles: { fontSize: '1.25rem', fontWeight: '700' } },
              { type: 'paragraph', props: { text: 'Looks great on every device, from mobile to desktop.' }, styles: { fontSize: '0.875rem', color: '#6b7280' } }
            ]
          }
        ]
      }
    ]
  },
};

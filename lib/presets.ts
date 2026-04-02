import { ElementInstance } from '@/store/useBuilderStore';
import { v4 as uuidv4 } from 'uuid';

export interface Preset {
  id: string;
  name: string;
  category: 'Hero' | 'Features' | 'Pricing' | 'Testimonials' | 'Footer';
  element: Partial<ElementInstance>;
}

export const PRESETS: Preset[] = [
  {
    id: 'hero-modern',
    name: 'Modern Hero',
    category: 'Hero',
    element: {
      id: uuidv4(),
      type: 'section',
      props: {},
      styles: {
        padding: '80px 20px',
        backgroundColor: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: '24px'
      },
      children: [
        {
          id: uuidv4(),
          type: 'heading',
          props: { text: 'Build something amazing' },
          styles: { fontSize: '48px', fontWeight: '800', color: '#111827', maxWidth: '800px' }
        },
        {
          id: uuidv4(),
          type: 'paragraph',
          props: { text: 'The most powerful website builder for modern teams. Create, iterate, and deploy in record time.' },
          styles: { fontSize: '18px', color: '#4b5563', maxWidth: '600px' }
        },
        {
          id: uuidv4(),
          type: 'flex',
          props: {},
          styles: { display: 'flex', gap: '12px', justifyContent: 'center' },
          children: [
            {
              id: uuidv4(),
              type: 'button',
              props: { text: 'Get Started' },
              styles: { padding: '12px 24px', backgroundColor: '#3b82f6', color: '#ffffff', borderRadius: '8px', fontWeight: '600' }
            },
            {
              id: uuidv4(),
              type: 'button',
              props: { text: 'Learn More' },
              styles: { padding: '12px 24px', backgroundColor: '#f3f4f6', color: '#111827', borderRadius: '8px', fontWeight: '600' }
            }
          ]
        }
      ]
    }
  },
  {
    id: 'features-grid',
    name: 'Feature Grid',
    category: 'Features',
    element: {
      id: uuidv4(),
      type: 'section',
      props: {},
      styles: { padding: '60px 20px', backgroundColor: '#f9fafb' },
      children: [
        {
          id: uuidv4(),
          type: 'grid',
          props: {},
          styles: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' },
          children: [
            {
              id: uuidv4(),
              type: 'card',
              props: {},
              styles: { padding: '24px', backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' },
              children: [
                { id: uuidv4(), type: 'icon', props: { icon: 'Zap' }, styles: { color: '#3b82f6', marginBottom: '16px' } },
                { id: uuidv4(), type: 'heading', props: { text: 'Fast Performance' }, styles: { fontSize: '18px', fontWeight: '700', marginBottom: '8px' } },
                { id: uuidv4(), type: 'paragraph', props: { text: 'Optimized for speed and efficiency.' }, styles: { fontSize: '14px', color: '#6b7280' } }
              ]
            },
            {
              id: uuidv4(),
              type: 'card',
              props: {},
              styles: { padding: '24px', backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' },
              children: [
                { id: uuidv4(), type: 'icon', props: { icon: 'Shield' }, styles: { color: '#10b981', marginBottom: '16px' } },
                { id: uuidv4(), type: 'heading', props: { text: 'Secure by Default' }, styles: { fontSize: '18px', fontWeight: '700', marginBottom: '8px' } },
                { id: uuidv4(), type: 'paragraph', props: { text: 'Your data is always protected.' }, styles: { fontSize: '14px', color: '#6b7280' } }
              ]
            },
            {
              id: uuidv4(),
              type: 'card',
              props: {},
              styles: { padding: '24px', backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' },
              children: [
                { id: uuidv4(), type: 'icon', props: { icon: 'Smartphone' }, styles: { color: '#f59e0b', marginBottom: '16px' } },
                { id: uuidv4(), type: 'heading', props: { text: 'Fully Responsive' }, styles: { fontSize: '18px', fontWeight: '700', marginBottom: '8px' } },
                { id: uuidv4(), type: 'paragraph', props: { text: 'Looks great on any device.' }, styles: { fontSize: '14px', color: '#6b7280' } }
              ]
            }
          ]
        }
      ]
    }
  }
];

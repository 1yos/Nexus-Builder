import { ElementInstance } from '@/store/useBuilderStore';
import { v4 as uuidv4 } from 'uuid';

export const STARTUP_TEMPLATE: ElementInstance[] = [
  {
    id: uuidv4(),
    type: 'navbar',
    props: {
      logoText: 'NEXUS',
      links: []
    },
    styles: {
      backgroundColor: '#ffffff',
      padding: '20px 0'
    }
  },
  {
    id: uuidv4(),
    type: 'hero',
    props: {
      title: 'Launch Your Startup Faster',
      subtitle: 'The ultimate platform to build, manage, and scale your business with ease.',
      ctaText: 'Get Started',
      image: 'https://picsum.photos/seed/startup-hero/1200/800'
    },
    styles: {
      padding: '100px 0',
      textAlign: 'center'
    }
  },
  {
    id: uuidv4(),
    type: 'features',
    props: {
      title: 'Our Features',
      items: [
        { title: 'Fast Performance', description: 'Lightning fast load times for your users.' },
        { title: 'Secure by Default', description: 'Top-notch security for your data.' },
        { title: 'Easy Integration', description: 'Connect with your favorite tools.' }
      ]
    },
    styles: {
      padding: '80px 0',
      backgroundColor: '#f9fafb'
    }
  },
  {
    id: uuidv4(),
    type: 'footer',
    props: {
      text: '© 2026 NEXUS Startup. All rights reserved.'
    },
    styles: {
      padding: '40px 0',
      textAlign: 'center',
      borderTop: '1px solid #e5e7eb'
    }
  }
];

export const PORTFOLIO_TEMPLATE: ElementInstance[] = [
  {
    id: uuidv4(),
    type: 'hero',
    props: {
      title: "Hi, I'm a Creative Designer",
      subtitle: 'Crafting beautiful digital experiences for brands worldwide.',
      ctaText: 'View My Work',
      image: 'https://picsum.photos/seed/portfolio-hero/1200/800'
    },
    styles: {
      padding: '120px 0',
      backgroundColor: '#000000',
      color: '#ffffff'
    }
  },
  {
    id: uuidv4(),
    type: 'grid',
    props: {
      columns: 3
    },
    styles: {
      padding: '80px 0',
      gap: '20px'
    },
    children: [
      { id: uuidv4(), type: 'image', props: { src: 'https://picsum.photos/seed/work1/400/400' }, styles: { borderRadius: '12px' } },
      { id: uuidv4(), type: 'image', props: { src: 'https://picsum.photos/seed/work2/400/400' }, styles: { borderRadius: '12px' } },
      { id: uuidv4(), type: 'image', props: { src: 'https://picsum.photos/seed/work3/400/400' }, styles: { borderRadius: '12px' } }
    ]
  }
];

export const TEMPLATE_DATA: Record<string, ElementInstance[]> = {
  startup: STARTUP_TEMPLATE,
  portfolio: PORTFOLIO_TEMPLATE,
  saas: STARTUP_TEMPLATE, // Reusing for demo
  agency: PORTFOLIO_TEMPLATE, // Reusing for demo
  ecommerce: STARTUP_TEMPLATE, // Reusing for demo
  blog: PORTFOLIO_TEMPLATE // Reusing for demo
};

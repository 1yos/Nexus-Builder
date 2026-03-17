export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  thumbnail: string;
  tags: string[];
}

export const TEMPLATES: Template[] = [
  {
    id: 'startup',
    name: 'Startup Landing',
    description: 'A clean, modern landing page for your next big idea.',
    category: 'Landing Pages',
    thumbnail: 'https://picsum.photos/seed/startup/800/600',
    tags: ['Modern', 'Clean', 'SaaS']
  },
  {
    id: 'portfolio',
    name: 'Creative Portfolio',
    description: 'Showcase your work with style and elegance.',
    category: 'Portfolio',
    thumbnail: 'https://picsum.photos/seed/portfolio/800/600',
    tags: ['Creative', 'Minimal', 'Dark']
  },
  {
    id: 'saas',
    name: 'SaaS Product',
    description: 'Convert visitors into customers with this high-converting template.',
    category: 'Business',
    thumbnail: 'https://picsum.photos/seed/saas/800/600',
    tags: ['Business', 'Conversion', 'Professional']
  },
  {
    id: 'agency',
    name: 'Digital Agency',
    description: 'A bold template for agencies that want to stand out.',
    category: 'Business',
    thumbnail: 'https://picsum.photos/seed/agency/800/600',
    tags: ['Bold', 'Agency', 'Dynamic']
  },
  {
    id: 'ecommerce',
    name: 'E-commerce Store',
    description: 'Start selling your products online today.',
    category: 'E-commerce',
    thumbnail: 'https://picsum.photos/seed/shop/800/600',
    tags: ['Shop', 'Retail', 'Clean']
  },
  {
    id: 'blog',
    name: 'Personal Blog',
    description: 'Share your thoughts with the world.',
    category: 'Blog',
    thumbnail: 'https://picsum.photos/seed/blog/800/600',
    tags: ['Writing', 'Simple', 'Content']
  }
];

'use client';

import { motion } from 'motion/react';
import { 
  MousePointer2, 
  Zap, 
  Smartphone, 
  Layers, 
  Palette, 
  Globe 
} from 'lucide-react';

const features = [
  {
    title: 'Drag & Drop Builder',
    description: 'Intuitive interface to build pages by simply dragging components onto the canvas.',
    icon: MousePointer2,
    color: 'text-blue-600',
    bg: 'bg-blue-50'
  },
  {
    title: 'Real-time Editing',
    description: 'See your changes instantly as you make them. No more refreshing or waiting.',
    icon: Zap,
    color: 'text-yellow-600',
    bg: 'bg-yellow-50'
  },
  {
    title: 'Responsive Design',
    description: 'Every site you build is automatically optimized for mobile, tablet, and desktop.',
    icon: Smartphone,
    color: 'text-green-600',
    bg: 'bg-green-50'
  },
  {
    title: 'Component System',
    description: 'Reusable components and global styles to keep your design consistent.',
    icon: Layers,
    color: 'text-purple-600',
    bg: 'bg-purple-50'
  },
  {
    title: 'Design Freedom',
    description: 'Full control over typography, colors, spacing, and layout without writing CSS.',
    icon: Palette,
    color: 'text-pink-600',
    bg: 'bg-pink-50'
  },
  {
    title: 'One-Click Publish',
    description: 'Launch your site to a custom domain or our global CDN in seconds.',
    icon: Globe,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50'
  }
];

export default function Features() {
  return (
    <section className="py-24 bg-zinc-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">
            Everything you need to build <br /> professional websites
          </h2>
          <p className="text-zinc-600 max-w-2xl mx-auto">
            Powerful features that give you the flexibility of code with the speed of a visual builder.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-8 rounded-2xl border border-zinc-200 hover:shadow-xl transition-all group"
            >
              <div className={`w-12 h-12 ${feature.bg} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 mb-3">{feature.title}</h3>
              <p className="text-zinc-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

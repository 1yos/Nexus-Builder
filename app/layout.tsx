import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import InstallPWA from '@/components/editor/InstallPWA';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: {
    default: 'NexusBuilder - Pro Neural Interface Builder',
    template: '%s | NexusBuilder',
  },
  description: 'Construct high-performance digital entities with NexusBuilder. The ultimate cyber-minimalist website builder for the future.',
  keywords: ['nexusbuilder', 'nexus', 'website builder', 'no-code', 'neural interface', 'web design', 'saas builder'],
  metadataBase: new URL('https://nexusbuilder.netlify.app/'),
  alternates: {
    canonical: '/',
  },
  verification: {
    google: 'google22fda73a84d0473f',
  },
  openGraph: {
    title: 'NexusBuilder - Pro Neural Interface Builder',
    description: 'The ultimate cyber-minimalist website builder.',
    url: 'https://nexusbuilder.netlify.app/',
    siteName: 'NexusBuilder',
    images: [
      {
        url: 'https://picsum.photos/seed/nexus/1200/630',
        width: 1200,
        height: 630,
        alt: 'NexusBuilder interface preview',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NexusBuilder - Pro Neural Interface Builder',
    description: 'Construct high-performance digital entities with NexusBuilder.',
    images: ['https://picsum.photos/seed/nexus/1200/630'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} font-sans`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3b82f6" />
        <link rel="apple-touch-icon" href="https://picsum.photos/seed/nexus/192/192" />
      </head>
      <body suppressHydrationWarning className="antialiased">
        <script
          dangerouslySetInnerHTML={{
            __html: `
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
            `,
          }}
        />
        <Providers>
          {children}
          <InstallPWA />
        </Providers>
      </body>
    </html>
  );
}

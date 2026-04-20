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
  title: 'NEXUS - Neural Interface Builder',
  description: 'Construct digital entities with NEXUS.',
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

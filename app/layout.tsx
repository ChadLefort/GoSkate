import '@/styles/globals.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Metadata } from 'next';
import { Link } from '@nextui-org/link';
import clsx from 'clsx';
import type { Viewport } from 'next';
import { IconHeart } from '@tabler/icons-react';

import { siteConfig } from '@/config/site';
import { fontSans } from '@/config/fonts';
import { Navbar } from '@/components/navbar';

import { Providers } from './providers';

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,

  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={clsx(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable
        )}
      >
        <Providers
          themeProps={{ attribute: 'class', defaultTheme: 'dark', children }}
        >
          <div className="relative flex flex-col h-screen">
            <Navbar />
            <main className="container mx-auto max-w-10xl py-16 px-6 flex flex-col flex-grow">
              {children}
            </main>
            <footer className="w-full flex items-center justify-center py-3">
              <Link
                isExternal
                className="flex items-center gap-1 text-current"
                href="https://chadlefort.com"
                title="Chad Lefort's Portfolio"
              >
                <span className="text-default-600 flex">
                  Made with <IconHeart className="text-red-500 m-1" size={16} />{' '}
                  by
                </span>
                <p className="text-primary">Chad Lefort</p>
              </Link>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}

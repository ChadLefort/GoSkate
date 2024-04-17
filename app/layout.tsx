import '@/styles/globals.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { Metadata } from 'next';
import { Link } from '@nextui-org/link';
import clsx from 'clsx';
import type { Viewport } from 'next';
import { IconHeart } from '@tabler/icons-react';
import { auth } from '@clerk/nextjs/server';

import { siteConfig } from '@/config/site';
import { fontSans } from '@/config/fonts';
import { Navbar } from '@/components/navbar';
import { getUserById } from '@/actions/user-actions';
import type { User } from '@/types/user';
import { Providers } from '@/app/providers';
import { Toaster } from '@/components/toaster';

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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { userId } = auth();
  let user: User | undefined;

  if (userId) {
    user = await getUserById(userId);
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={clsx('min-h-screen bg-background font-sans antialiased', fontSans.variable)}>
        <Providers themeProps={{ attribute: 'class', defaultTheme: 'dark', children }}>
          <div className="relative flex h-screen flex-col">
            <Navbar user={user} />
            <main className="max-w-10xl container mx-auto flex flex-grow flex-col px-6 py-16">{children}</main>
            <footer className="flex w-full items-center justify-center py-3">
              <Link
                isExternal
                className="flex items-center gap-1 text-current"
                href="https://chadlefort.com"
                title="Chad Lefort's Portfolio"
              >
                <span className="flex text-default-600">
                  Made with <IconHeart className="m-1 text-red-500" size={16} /> by
                </span>
                <p className="text-primary">Chad Lefort</p>
              </Link>
            </footer>
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}

'use client';

import * as React from 'react';
import { NextUIProvider } from '@nextui-org/system';
import { useRouter } from 'next/navigation';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { ThemeProviderProps } from 'next-themes/dist/types';

import { Clerk as ClerkProvider } from '@/app/clerk';

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();

  return (
    <NextUIProvider navigate={router.push} className="text">
      <NextThemesProvider {...themeProps}>
        <ClerkProvider>{children}</ClerkProvider>
      </NextThemesProvider>
    </NextUIProvider>
  );
}

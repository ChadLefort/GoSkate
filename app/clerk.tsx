'use client';

import * as React from 'react';
import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { button as buttonStyles, link as linkStyles } from '@nextui-org/theme';
import { useTheme } from 'next-themes';
import clsx from 'clsx';

import { PRIMARY_BRAND_COLOR } from '@/config';

export interface ProvidersProps {
  children: React.ReactNode;
}

export function Clerk({ children }: ProvidersProps) {
  const { theme } = useTheme();

  return (
    <ClerkProvider
      appearance={{
        baseTheme: theme === 'dark' ? dark : undefined,
        variables: {
          colorPrimary: PRIMARY_BRAND_COLOR,
          fontSize: '14px',
        },
        elements: {
          otpCodeFieldInput:
            'tap-highlight-transparent shadow-sm px-2 bg-default-100 data-[hover=true]:bg-default-200 group-data-[focus=true]:bg-default-100 min-h-unit-10 rounded-medium flex-col items-start justify-center gap-0 transition-background motion-reduce:transition-none !duration-150 outline-none group-data-[focus-visible=true]:z-10 group-data-[focus-visible=true]:ring-2 group-data-[focus-visible=true]:ring-focus group-data-[focus-visible=true]:ring-offset-2 group-data-[focus-visible=true]:ring-offset-background h-14 py-2',
          formFieldInput:
            'tap-highlight-transparent shadow-sm px-3 bg-default-100 data-[hover=true]:bg-default-200 group-data-[focus=true]:bg-default-100 min-h-unit-10 rounded-medium flex-col items-start justify-center gap-0 transition-background motion-reduce:transition-none !duration-150 outline-none group-data-[focus-visible=true]:z-10 group-data-[focus-visible=true]:ring-2 group-data-[focus-visible=true]:ring-focus group-data-[focus-visible=true]:ring-offset-2 group-data-[focus-visible=true]:ring-offset-background h-14 py-2',
          formButtonPrimary: clsx(
            buttonStyles({
              size: 'lg',
            })
          ),
          socialButtonsIconButton: buttonStyles({
            size: 'sm',
          }),
          badge: 'text-default-500',
          userButtonPopoverActionButton: clsx(
            linkStyles({
              color: 'foreground',
              size: 'sm',
            }),
            'data-[active=true]:text-primary hover:text-primary active:text-primary focus:text-primary'
          ),
          button: clsx(
            linkStyles({
              color: 'foreground',
              size: 'sm',
            })
          ),
          button__danger: clsx(
            linkStyles({
              color: 'danger',
              size: 'sm',
            }),
            'data-[active=true]:text-danger-400 hover:text-danger-400 active:text-danger-400 focus:text-danger-400'
          ),
        },
      }}
    >
      {children}
    </ClerkProvider>
  );
}

'use client';

import { useTheme } from 'next-themes';
import { Toaster as Sonner } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

export const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-default group-[.toaster]:text-foreground group-[.toaster]:border-0 group-[.toaster]:shadow-small group-[.toaster]:rounded-large',
          description: 'group-[.toast]:text-muted-foreground',
          actionButton: 'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
          cancelButton: 'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
          success: 'group toast group-[.toaster]:bg-success group-[.toaster]:text-success-foreground',
          info: 'group toast group-[.toaster]:bg-blue-500',
          warning: 'group toast group-[.toaster]:bg-warning group-[.toaster]:text-warning-foreground',
          error: 'group toast group-[.toaster]:bg-danger group-[.toaster]:text-danger-foreground',
        },
      }}
      {...props}
    />
  );
};

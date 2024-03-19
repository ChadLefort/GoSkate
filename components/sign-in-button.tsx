'use client';

import NextLink from 'next/link';
import { Button } from '@nextui-org/button';
import { usePathname } from 'next/navigation';

export const SignInButton = () => {
  const pathname = usePathname();

  return (
    <Button size="md" variant="shadow">
      {pathname === '/sign-in' ? (
        <NextLink href="/sign-up">Sign Up</NextLink>
      ) : (
        <NextLink href="/sign-in">Sign In</NextLink>
      )}
    </Button>
  );
};

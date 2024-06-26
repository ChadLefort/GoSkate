'use client';

import NextLink from 'next/link';
import { Button } from '@nextui-org/button';
import { usePathname } from 'next/navigation';

export const SignInButton = () => {
  const pathname = usePathname();

  return pathname === '/sign-in' ? (
    <NextLink href="/sign-up">
      <Button size="md">Sign Up</Button>
    </NextLink>
  ) : (
    <NextLink href="/sign-in">
      <Button size="md">Sign In</Button>
    </NextLink>
  );
};

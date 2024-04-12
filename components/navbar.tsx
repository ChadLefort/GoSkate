'use client';

import {
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Navbar as NextUINavbar,
} from '@nextui-org/navbar';
import { Link } from '@nextui-org/link';
import { link as linkStyles } from '@nextui-org/theme';
import clsx from 'clsx';
import NextLink from 'next/link';
import { useClerk, UserButton, useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { IconMedal } from '@tabler/icons-react';
import { Popover, PopoverContent, PopoverTrigger } from '@nextui-org/popover';

import { siteConfig } from '@/config/site';
import { ThemeSwitch } from '@/components/theme-switch';
import { Logo } from '@/components/icons';
import { getUserById, type User } from '@/actions/user-actions';

import { SignInButton } from './sign-in-button';
import { Search } from './search';

export const Navbar = () => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const clerkUser = useUser();
  const { signOut } = useClerk();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuToggle = () => setIsMenuOpen(!isMenuOpen);
  const handleSignOut = () => {
    handleMenuToggle();
    signOut(() => router.push('/'));
  };

  useEffect(() => {
    const fetchUser = async (id: string) => {
      const user = await getUserById(id);
      user && setUser(user);
    };

    if (clerkUser.isSignedIn) {
      fetchUser(clerkUser.user.id);
    }
  }, [clerkUser.isSignedIn, clerkUser.user?.id]);

  return (
    <NextUINavbar isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen} maxWidth="2xl" position="sticky" isBordered>
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="max-w-fit gap-3">
          <NextLink className="flex items-center justify-start gap-1" href="/">
            <Logo className="pr mr-2" />
            <p className="font-bold text-inherit">GoSkate</p>
          </NextLink>
        </NavbarBrand>
        <ul className="ml-2 hidden justify-start gap-4 lg:flex">
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href}>
              <Link
                className={clsx(
                  linkStyles({ color: 'foreground' }),
                  'data-[active=true]:font-medium data-[active=true]:text-primary'
                )}
                color="foreground"
                href={item.href}
              >
                {item.label}
              </Link>
            </NavbarItem>
          ))}
        </ul>
      </NavbarContent>

      <NavbarContent className="hidden basis-1/5 sm:flex sm:basis-full" justify="end">
        <NavbarItem className="hidden gap-2 sm:flex">
          <ThemeSwitch />
        </NavbarItem>
        <NavbarItem className="hidden lg:flex">
          <Search />
        </NavbarItem>
        {clerkUser.isSignedIn ? (
          <>
            <UserButton afterSignOutUrl="/" />
            {user?.premium ? (
              <Popover placement="bottom">
                <PopoverTrigger>
                  <IconMedal />
                </PopoverTrigger>

                <PopoverContent>
                  <div className="px-1 py-2">
                    <div className="text-small font-bold">Premium User</div>
                    <div className="text-tiny">Thanks for the support!</div>
                  </div>
                </PopoverContent>
              </Popover>
            ) : null}
          </>
        ) : clerkUser.isLoaded ? (
          <SignInButton />
        ) : null}
      </NavbarContent>

      <NavbarContent className="basis-1 pl-4 sm:hidden" justify="end">
        <ThemeSwitch />
        <NavbarMenuToggle aria-label={isMenuOpen ? 'Close menu' : 'Open menu'} />
      </NavbarContent>

      <NavbarMenu>
        <Search />
        <div className="mx-4 mt-2 flex flex-col gap-2">
          <>
            {siteConfig.navMenuItems.map((item, index) => (
              <NavbarMenuItem key={`${item}-${index}`}>
                <Link
                  className={clsx(
                    linkStyles({ color: 'foreground' }),
                    'data-[active=true]:font-medium data-[active=true]:text-primary'
                  )}
                  color="foreground"
                  href={item.href}
                  size="lg"
                  onClick={handleMenuToggle}
                >
                  {item.label}
                </Link>
              </NavbarMenuItem>
            ))}

            {clerkUser.isSignedIn ? (
              <>
                <NavbarMenuItem>
                  <Link
                    className={clsx(
                      linkStyles({ color: 'foreground' }),
                      'data-[active=true]:font-medium data-[active=true]:text-primary'
                    )}
                    color="foreground"
                    size="lg"
                    href="/user-profile"
                    onClick={handleMenuToggle}
                  >
                    User Profile
                  </Link>
                </NavbarMenuItem>
                <NavbarMenuItem>
                  <Link
                    className={clsx(
                      linkStyles({ color: 'foreground' }),
                      'data-[active=true]:font-medium data-[active=true]:text-primary'
                    )}
                    color="foreground"
                    size="lg"
                    onClick={handleSignOut}
                  >
                    Sign Out
                  </Link>
                </NavbarMenuItem>
              </>
            ) : clerkUser.isLoaded ? (
              <NavbarMenuItem>
                <Link
                  className={clsx(
                    linkStyles({ color: 'foreground' }),
                    'data-[active=true]:font-medium data-[active=true]:text-primary'
                  )}
                  color="foreground"
                  size="lg"
                  href="/sign-in"
                  onClick={handleMenuToggle}
                >
                  Sign In
                </Link>
              </NavbarMenuItem>
            ) : null}
          </>
        </div>
      </NavbarMenu>
    </NextUINavbar>
  );
};

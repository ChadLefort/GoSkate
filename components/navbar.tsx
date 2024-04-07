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
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IconMedal } from '@tabler/icons-react';
import { Popover, PopoverContent, PopoverTrigger } from '@nextui-org/popover';

import { siteConfig } from '@/config/site';
import { ThemeSwitch } from '@/components/theme-switch';
import { Logo } from '@/components/icons';

import { SignInButton } from './sign-in-button';
import { Search } from './search';

export const Navbar = () => {
  const router = useRouter();
  const { user } = useUser();
  const { signOut } = useClerk();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuToggle = () => setIsMenuOpen(!isMenuOpen);
  const handleSignOut = () => {
    handleMenuToggle();
    signOut(() => router.push('/'));
  };

  return (
    <NextUINavbar
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      maxWidth="2xl"
      position="sticky"
      isBordered
    >
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <Logo className="mr-2 pr" />
            <p className="font-bold text-inherit">GoSkate</p>
          </NextLink>
        </NavbarBrand>
        <ul className="hidden lg:flex gap-4 justify-start ml-2">
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href}>
              <Link
                className={clsx(
                  linkStyles({ color: 'foreground' }),
                  'data-[active=true]:text-primary data-[active=true]:font-medium'
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

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-2">
          <ThemeSwitch />
        </NavbarItem>
        <NavbarItem className="hidden lg:flex">
          <Search />
        </NavbarItem>
        {user ? (
          <>
            <UserButton afterSignOutUrl="/" />
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
          </>
        ) : (
          <SignInButton />
        )}
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <ThemeSwitch />
        <NavbarMenuToggle
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        />
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
                    'data-[active=true]:text-primary data-[active=true]:font-medium'
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

            {user ? (
              <>
                <NavbarMenuItem>
                  <Link
                    className={clsx(
                      linkStyles({ color: 'foreground' }),
                      'data-[active=true]:text-primary data-[active=true]:font-medium'
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
                      'data-[active=true]:text-primary data-[active=true]:font-medium'
                    )}
                    color="foreground"
                    size="lg"
                    onClick={handleSignOut}
                  >
                    Sign Out
                  </Link>
                </NavbarMenuItem>
              </>
            ) : (
              <NavbarMenuItem>
                <Link
                  className={clsx(
                    linkStyles({ color: 'foreground' }),
                    'data-[active=true]:text-primary data-[active=true]:font-medium'
                  )}
                  color="foreground"
                  size="lg"
                  href="/sign-in"
                  onClick={handleMenuToggle}
                >
                  Sign In
                </Link>
              </NavbarMenuItem>
            )}
          </>
        </div>
      </NavbarMenu>
    </NextUINavbar>
  );
};

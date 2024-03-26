export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: 'GoSkate',
  description: 'Go out there and skate!',
  navItems: [
    {
      label: 'Home',
      href: '/',
    },
    {
      label: 'Spots',
      href: '/spots',
    },
    {
      label: 'About',
      href: '/about',
    },
  ],
  navMenuItems: [
    {
      label: 'Home',
      href: '/',
    },
    {
      label: 'Spots',
      href: '/spots',
    },
    {
      label: 'About',
      href: '/about',
    },
  ],
  links: {
    twitter: 'https://twitter.com/getnextui',
    discord: 'https://discord.gg/9b6yyZKmH4',
  },
};

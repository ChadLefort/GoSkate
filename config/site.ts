export type SiteConfig = typeof siteConfig;

const nav = [
  {
    label: 'Spots',
    href: '/spots',
  },
  {
    label: 'About',
    href: '/about',
  },
  {
    label: 'Donate',
    href: '/donate',
  },
];

export const siteConfig = {
  name: 'GoSkate',
  description: 'Go out there and skate!',
  navItems: [...nav],
  navMenuItems: [...nav],
  links: {
    twitter: 'https://twitter.com/getnextui',
    discord: 'https://discord.gg/9b6yyZKmH4',
  },
};

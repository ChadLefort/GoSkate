import { nextui } from '@nextui-org/theme';
import { withUt } from 'uploadthing/tw';

export default withUt({
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  darkMode: 'class',
  plugins: [
    nextui({
      themes: {
        light: {
          colors: {
            background: '#FFFFFF',
            foreground: '#11181C',
            primary: '#A1A1AA',
          },
        },
        dark: {
          colors: {
            background: '#111111',
            foreground: '#ECEDEE',
            primary: '#52525B',
          },
        },
      },
    }),
  ],
});

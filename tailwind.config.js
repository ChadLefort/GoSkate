import {nextui} from '@nextui-org/theme';

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [    nextui({
    themes: {
      light: {
        colors: {
          primary: {
            DEFAULT: "#A1A1AA",
            foreground: "#000000",
          },
          focus: "#A1A1AA",
        },
      },
      dark: {
        colors: {
          primary: {
            DEFAULT: "#52525B",
            foreground: "#000000",
          },
          focus: "#52525B",
        },
      },
    },
  }),],
}

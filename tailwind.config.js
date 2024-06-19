/** @type {import('tailwindcss').Config} */
import withMT from "@material-tailwind/react/utils/withMT";
import colors from 'tailwindcss/colors';

module.exports = withMT({
  content: [
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        transparent: 'transparent',
        slate: colors.slate,
        current: 'currentColor',
        rednormal: '#ff0000',
        googleGreen: '#34A853',
        googleRed: '#EA4335',
        googleYellow: '#FBBC05',
        googleBlue: '#4285F4',
        lightBlue: '#E2EBF9',
      },
    },
  },
  plugins: [],
});

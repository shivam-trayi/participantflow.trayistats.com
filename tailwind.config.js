/** @type {import('tailwindcss').Config} */
const colors = require('./src/theme/colors');
const typography = require('./src/theme/typography');

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: colors,
      fontFamily: typography.fontFamily
    },
  },
  plugins: [],
}

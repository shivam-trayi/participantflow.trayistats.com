/** @type {import('tailwindcss').Config} */
const colors = require('./src/theme/colors');
const typography = require('./src/theme/typography');
const { themeColors } = require('./src/theme/themeConfig');

module.exports = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
                        colors: {
        ...colors,
        brand: {
          from: 'rgb(var(--brand-from) / <alpha-value>)',
          to: 'rgb(var(--brand-to) / <alpha-value>)',
          hoverFrom: 'rgb(var(--brand-hoverFrom) / <alpha-value>)',
          hoverTo: 'rgb(var(--brand-hoverTo) / <alpha-value>)',
          bgFrom: 'rgb(var(--brand-bgFrom) / <alpha-value>)',
          bgVia: 'rgb(var(--brand-bgVia) / <alpha-value>)',
          bgTo: 'rgb(var(--brand-bgTo) / <alpha-value>)',
        },
        brandButton: {
          from: 'rgb(var(--brandButton-from) / <alpha-value>)',
          to: 'rgb(var(--brandButton-to) / <alpha-value>)',
          hoverFrom: 'rgb(var(--brandButton-hoverFrom) / <alpha-value>)',
          hoverTo: 'rgb(var(--brandButton-hoverTo) / <alpha-value>)',
        },
        brandCard: {
          selectedBg: 'rgb(var(--brandCard-selectedBg) / <alpha-value>)',
          selectedBorder: 'rgb(var(--brandCard-selectedBorder) / <alpha-value>)',
          selectedText: 'rgb(var(--brandCard-selectedText) / <alpha-value>)',
          unselectedBorderHover: 'rgb(var(--brandCard-unselectedBorderHover) / <alpha-value>)',
          unselectedBgHover: 'rgb(var(--brandCard-unselectedBgHover) / <alpha-value>)',
        },
        brandLoader: {
          text: 'rgb(var(--brandLoader-text) / <alpha-value>)',
        },
        brandAlert: {
          from: 'rgb(var(--brandAlert-from) / <alpha-value>)',
          to: 'rgb(var(--brandAlert-to) / <alpha-value>)',
          iconBg: 'rgb(var(--brandAlert-iconBg) / <alpha-value>)',
          iconColor: 'rgb(var(--brandAlert-iconColor) / <alpha-value>)',
        }
      },
      fontFamily: typography.fontFamily
    },
  },
  plugins: [],
}

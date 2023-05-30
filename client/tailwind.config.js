const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      backgroundImage: {
        'hero-pattern': "url('assets/images/blob-scene-haikei.png')",
      },
      colors: {
        primary: '#14b8a6',
        secondary: '#00ABE4',
        action: '#2997FF',
        ...colors,
      },
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */

import primeUI from 'tailwindcss-primeui'

export default {
  content: [],
  darkMode: false, 
  theme: {
    extend: {},
  },
  plugins: [primeUI],
  content: [
    // Example content paths...
    './public/**/*.html',
    './src/**/*.{js,jsx,ts,tsx,vue}',
  ],
}


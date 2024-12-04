/** @type {import('tailwindcss').Config} */
export default {
  content: [],
  darkMode: false, 
  theme: {
    extend: {},
  },
  plugins: [require('tailwindcss-primeui')],
  content: [
    // Example content paths...
    './public/**/*.html',
    './src/**/*.{js,jsx,ts,tsx,vue}',
  ],
}


/** @type {import('tailwindcss').Config} */

import primeUI from 'tailwindcss-primeui'

export default {
  content: [],
  darkMode: false, 
  theme: {
    extend: {
      colors:{
        CustomMain:'#E6F8F8',
        CustomLightSecondary: '#57A2A2',
        CustomDarkSecondary: '#2C7878',
        CustomLightAccent: '#90CDCD',
        CustomDarkAccent: '#2C7878',
        ReallyDark: '#023333'
      }
    },
  },
  plugins: [primeUI],
  content: [
    // Example content paths...
    './public/**/*.html',
    './src/**/*.{js,jsx,ts,tsx,vue}',
  ],
}


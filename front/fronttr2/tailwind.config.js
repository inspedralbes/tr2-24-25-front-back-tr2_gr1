/** @type {import('tailwindcss').Config} */

import primeUI from 'tailwindcss-primeui'

export default {
  content: ['./public/**/*.html',
    './src/**/*.{js,jsx,ts,tsx,vue}',],
  safelist: [
    'bg-CustomMain',
    'bg-CustomLightSecondary',
    'bg-CustomDarkSecondary',
    'bg-CustomLightAccent',
    'bg-CustomDarkAccent',
    'bg-ReallyDark',
    'text-CustomMain',
    'text-CustomLightSecondary',
    'text-CustomDarkSecondary',
    'text-CustomLightAccent',
    'text-CustomDarkAccent',
    'text-ReallyDark',
    'border-CustomMain',
    'border-CustomLightSecondary',
    'border-CustomDarkSecondary',
    'border-CustomLightAccent',
    'border-CustomDarkAccent',
    'border-ReallyDark',
    'hover:bg-CustomMain',
    'hover:bg-CustomLightSecondary',
    'hover:bg-CustomDarkSecondary',
    'hover:bg-CustomLightAccent',
    'hover:bg-CustomDarkAccent',
    'hover:bg-ReallyDark',
    'hover:text-CustomMain',
    'hover:text-CustomLightSecondary',
    'hover:text-CustomDarkSecondary',
    'hover:text-CustomLightAccent',
    'hover:text-CustomDarkAccent',
    'hover:text-ReallyDark',
    'hover:border-CustomMain',
    'hover:border-CustomLightSecondary',
    'hover:border-CustomDarkSecondary',
    'hover:border-CustomLightAccent',
    'hover:border-CustomDarkAccent',
    'hover:border-ReallyDark',
  ],
  darkMode: 'class', // Asegúrate de que darkMode esté habilitado correctamente
  theme: {
    extend: {
      colors: {
        CustomMain: '#E6F8F8',
        CustomLightSecondary: '#57A2A2',
        CustomDarkSecondary: '#2C7878',
        CustomLightAccent: '#90CDCD',
        CustomDarkAccent: '#2C7878',
        ReallyDark: '#023333',
        surface: {
          0: '#ffffff',  // Color para 'surface-0'
          50: '#f5f5f5', // Color para 'surface-50'
          300: '#cccccc', 
          700: '#2d2d2d', // Color para 'surface-700'
          950: '#121212', // Color para 'surface-950'
        }
      }
    },
  },
  plugins: [primeUI],
}

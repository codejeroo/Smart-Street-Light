/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Caraga Region Color Scheme - O72F5F, 1261AO, 3895D3, 58CCED
        'caraga-burgundy': {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#O72F5F', // Main burgundy
          600: '#be185d',
          700: '#9d174d',
          800: '#831843',
          900: '#500724',
        },
        'caraga-navy': {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#1261A0', // Main navy
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        'caraga-blue': {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#3895D3', // Main blue
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        'caraga-cyan': {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#58CCED', // Main cyan
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
        },
        'dark': {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
          950: '#030712',
        },
        'primary': {
          50: '#f0fdff',
          100: '#ccfbff',
          200: '#99f6ff',
          300: '#4deded',
          400: '#3895D3',
          500: '#1261A0',
          600: '#0097a7',
          700: '#006064',
          800: '#004d40',
          900: '#003d33',
        },
        'accent': {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#58CCED',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-gentle': 'bounce 2s infinite',
      },
      gridTemplateColumns: {
        'dashboard': 'repeat(auto-fit, minmax(400px, 1fr))',
        'metrics': 'repeat(auto-fit, minmax(150px, 1fr))',
        'economic': 'repeat(auto-fit, minmax(120px, 1fr))',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}
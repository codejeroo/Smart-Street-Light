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
        // AetherSense Color Scheme - Advanced monitoring system colors
        'aethersense': {
          'primary': '#3895D3',     // Main blue
          'secondary': '#58CCED',   // Cyan accent
          'dark': '#1261A0',        // Dark blue
          'accent': '#0072F5',      // Bright blue
        },
        // Dark theme colors for consistency
        'dark': {
          '700': '#374151',   // gray-700
          '800': '#1f2937',   // gray-800
          '900': '#111827',   // gray-900
          '950': '#030712',   // gray-950
        },
        // Legacy Caraga Region Color Scheme (Fixed mapping)
        'caraga-burgundy': '#DC2626', // Red for offline/errors
        'caraga-navy': '#1261A0',     // Dark blue for offline
        'caraga-blue': '#3895D3',     // Primary blue
        'caraga-cyan': '#10B981',     // Green for online status
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-gentle': 'bounce 2s infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      gridTemplateColumns: {
        'dashboard': 'repeat(auto-fit, minmax(400px, 1fr))',
        'metrics': 'repeat(auto-fit, minmax(150px, 1fr))',
      },
    },
  },
  plugins: [],
}
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#5C4A6E',
          light: '#7862A0',
          dark: '#3E3050',
          foreground: '#FDFAF5',
        },
        accent: {
          DEFAULT: '#C9A96E',
          light: '#DFC08A',
          dark: '#A88040',
          foreground: '#1E160E',
        },
        surface: {
          DEFAULT: '#F5F0E8',
          card: '#FDFAF5',
          elevated: '#FFFFFF',
        },
        border: {
          DEFAULT: '#D2C3AA',
          subtle: '#E4DAC8',
          strong: '#B8A88A',
        },
        muted: {
          DEFAULT: '#8A7A6A',
          light: '#B0A090',
          foreground: '#6A5A4A',
        },
        success: '#3A6A4A',
        warning: '#8A6010',
        danger: '#8A3028',
        info: '#3A6A9A',
      },
      borderRadius: {
        sm: '6px',
        DEFAULT: '8px',
        md: '10px',
        lg: '12px',
        xl: '16px',
        '2xl': '20px',
      },
      boxShadow: {
        card: '0 1px 4px rgba(30, 22, 14, 0.08), 0 0 0 1px rgba(210, 195, 170, 0.5)',
        elevated: '0 4px 16px rgba(30, 22, 14, 0.10), 0 1px 4px rgba(30, 22, 14, 0.06)',
        modal: '0 20px 60px rgba(30, 22, 14, 0.18), 0 4px 16px rgba(30, 22, 14, 0.10)',
        dropdown: '0 8px 24px rgba(30, 22, 14, 0.12), 0 2px 8px rgba(30, 22, 14, 0.08)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out forwards',
        'slide-up': 'slideUp 0.25s ease-out forwards',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
      },
    },
  },
  plugins: [],
};
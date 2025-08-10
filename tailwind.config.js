/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      screens: {
        'xs': '475px',
      },
      colors: {
        // Your beautiful custom palette
        'brown-primary': '#74493D',
        'orange-primary': '#D26426',
        'green-primary': '#3c603c',
        'cream-primary': '#FFF7ED',
        'white-primary': '#FFFFFF',
        // Dark mode colors - Improved aesthetics
        'dark-bg': '#0f1419',           // Rich dark blue-gray
        'dark-card': '#1d2327',         // Slightly lighter card  
        'dark-text': '#e2e8f0',         // Soft white
        'dark-text-secondary': '#94a3b8', // Muted gray
        'dark-border': '#374151',       // Subtle borders
        'dark-hover': '#252a31',        // Hover states
        // Extended palette for gradients and variations
        brown: {
          50: '#fdf7f4',
          100: '#f8e8e1',
          200: '#f0d0c2',
          300: '#e5b09b',
          400: '#d88c73',
          500: '#c96a4f',
          600: '#b85540',
          700: '#974436',
          800: '#74493D',
          900: '#5a3329',
        },
        orange: {
          50: '#fef6f1',
          100: '#fcebde',
          200: '#f7d5bc',
          300: '#f1b890',
          400: '#ea9562',
          500: '#D26426',
          600: '#c55620',
          700: '#a4461b',
          800: '#843818',
          900: '#6b2e15',
        },
        green: {
          50: '#f0f7f0',
          100: '#dcebdc',
          200: '#bad7ba',
          300: '#92bc92',
          400: '#6da06d',
          500: '#4a7f4a',
          600: '#3c603c',
          700: '#2f4c2f',
          800: '#263a26',
          900: '#1f2e1f',
        },
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'bounce-slow': 'bounce 2s infinite',
        'gradient-xy': 'gradient-xy 15s ease infinite',
        'fade-in-up': 'fade-in-up 0.6s ease-out',
        'slide-in-right': 'slide-in-right 0.6s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'gradient-xy': {
          '0%, 100%': {
            'background-size': '400% 400%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        },
        'fade-in-up': {
          '0%': {
            opacity: '0',
            transform: 'translateY(30px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        'slide-in-right': {
          '0%': {
            opacity: '0',
            transform: 'translateX(30px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)'
          }
        }
      },
      backgroundImage: {
        'gradient-warm': 'linear-gradient(135deg, #FFF7ED 0%, #f8e8e1 25%, #f0d0c2 50%, #e5b09b 75%, #D26426 100%)',
        'gradient-earth': 'linear-gradient(135deg, #3c603c 0%, #4a7f4a 25%, #74493D 50%, #D26426 75%, #ea9562 100%)',
        'gradient-dark': 'linear-gradient(135deg, #0f1419 0%, #1d2327 25%, #252a31 50%, #1d2327 75%, #0f1419 100%)',
        'gradient-dark-card': 'linear-gradient(135deg, #1d2327 0%, #252a31 50%, #1d2327 100%)',
      }
    },
  },
  plugins: [],
}

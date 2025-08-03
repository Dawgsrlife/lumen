/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'lumen-primary': '#FBBF24',
        'lumen-secondary': '#8B5CF6',
        'lumen-dark': '#1F2937',
        'lumen-light': '#F9FAFB',
        'lumen-gradient-start': '#FEF3C7',
        'lumen-gradient-end': '#F3E8FF',
        'lumen-text-primary': '#2D3748',
        'lumen-text-secondary': '#4A5568',
        'lumen-text-muted': '#718096',
      },
      fontFamily: {
        'iowan': ['Iowan Old Style', 'serif'],
        'inter': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'gradient-shift': 'gradientShift 3s ease infinite',
        'gradient-rotate': 'gradientRotate 4s linear infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 3s ease-in-out infinite',
        'pulse-rainbow': 'pulse-rainbow 2s ease-in-out infinite',
        'stain-flow': 'stainFlow 8s ease-in-out infinite',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
} 
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
        space: {
          950: '#06080b',
          900: '#0b0e14',
          850: '#101520',
          800: '#161c2b',
          700: '#232c42',
        },
        namgang: {
          DEFAULT: '#38bdf8',
          glow: '#0284c7',
        },
        yudeung: {
          DEFAULT: '#f59e0b',
          glow: '#d97706',
        },
      },
      fontFamily: {
        sans: ['Pretendard', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'Roboto', 'sans-serif'],
        serif: ['Nanum Myeongjo', 'serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
}

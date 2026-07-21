/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: '#075e54', light: '#13b48f', accent: '#00a884', deep: '#053f38' },
        ink: '#0d1b1e', muted: '#5d7169', line: '#e2ebe8', cream: '#f7faf9',
      },
      fontFamily: { sans: ['Inter', 'Segoe UI', 'system-ui', 'sans-serif'] },
      boxShadow: {
        soft: '0 1px 2px rgba(13,27,30,.04), 0 8px 30px rgba(13,27,30,.07)',
        lift: '0 12px 40px rgba(7,94,84,.18)',
      },
      animation: { float: 'float 6s ease-in-out infinite' },
      keyframes: { float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } } },
    },
  },
  plugins: [],
};

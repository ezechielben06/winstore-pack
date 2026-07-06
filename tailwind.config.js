// 📄 tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '375px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      colors: {
        feminine: {
          primary: '#E91E8C',
          secondary: '#F5A0C7',
          light: '#FFF0F6',
          accent: '#FCE4EC',
          dark: '#880E4F',
        },
        masculine: {
          primary: '#1A237E',
          secondary: '#3949AB',
          light: '#E8EAF6',
          accent: '#C5CAE9',
          dark: '#0D1445',
        },
        gold: '#D4AF37',
        goldLight: '#F5E6A3',
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
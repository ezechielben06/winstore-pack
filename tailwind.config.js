/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
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
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
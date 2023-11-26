/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#1d1d1d',
        'secondary' : '#919191',
        'theme' : '#3ec250',
        'primary-dark':'#171717',
        'danger' : '#FF5E5E',
        'success' : '#4ADE80',
        'warning' : '#FFC700',
        'info' : '#00C2FF',
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar')({ noCompatible: true })
  ],
}
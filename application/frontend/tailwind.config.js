/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          500: '#1DB954',
          600: '#1AA34A',
          700: '#168D40'
        },
        gray: {
          700: '#282828',
          800: '#181818',
          900: '#121212'
        }
      }
    },
  },
  plugins: [],
}
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#172554",
      },
      width: {
        '112': '28rem',
      }
    },
  },
  plugins: [],
}
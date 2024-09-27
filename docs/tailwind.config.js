/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./script.js", 
    "./public/**/*.{html,js}", 
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Helvetica", "sans-serif"],
      },
    },
  },
  plugins: [],
};


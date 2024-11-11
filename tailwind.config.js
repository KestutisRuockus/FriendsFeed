/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bgColor: '#d2e5d0' ,
        hover: '#dcbaa9' ,
        primary: '#65463e' ,
        secondary: '#aad6a0' 
      }
    },
    animation: {
      'fade-in': 'fadeIn 0.5s ease-out',
    },
    keyframes: {
      fadeIn: {
        '0%': { opacity: 0 },
        '100%': { opacity: 1 },
      },
    },
  },
  plugins: [],
}
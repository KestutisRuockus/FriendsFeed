/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bgColor: "#B7C68B",
        bgColorSecondary: "#B3A580",
        bgColorExtra: "#382E1C",
        hover: "#BED661",
        primary: "#2C2416",
        secondary: "#F4F0CB",
        extraColor: "#DED29E",
      },
    },
    animation: {
      "fade-in": "fadeIn 0.5s ease-out",
    },
    keyframes: {
      fadeIn: {
        "0%": { opacity: 0 },
        "100%": { opacity: 1 },
      },
    },
  },
  plugins: [],
};

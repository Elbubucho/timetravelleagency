/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        gold: {
          400: "#e5c07b",
          500: "#d4af37",
          600: "#b8932d",
        },
        ink: {
          900: "#0a0a0f",
          800: "#111118",
          700: "#1a1a25",
          600: "#2a2a38",
        },
      },
      fontFamily: {
        serif: ["'Playfair Display'", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

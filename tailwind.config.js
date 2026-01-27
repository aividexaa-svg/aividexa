/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      /* 🔹 KEEP ONLY BADGE ANIMATION (SAFE) */
      keyframes: {
        badgeSlide: {
          "0%": {
            opacity: 0,
            transform: "translateY(-10px) scale(0.9)",
          },
          "100%": {
            opacity: 1,
            transform: "translateY(0) scale(1)",
          },
        },
      },

      animation: {
        badgeSlide: "badgeSlide 0.45s cubic-bezier(0.22,1,0.36,1)",
      },
    },
  },

  plugins: [],
};

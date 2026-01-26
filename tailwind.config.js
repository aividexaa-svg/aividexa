/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
     keyframes: {
  'rail-down': {
    '0%': {
      transform: 'translateY(-60%)',
      opacity: 0,
    },
    '20%': {
      opacity: 1,
    },
    '100%': {
      transform: 'translateY(60%)',
      opacity: 0,
    },
  },

  'center-ripple': {
  '0%': {
    transform: 'scale(0.6)',
    opacity: 0,
  },
  '40%': {
    opacity: 0.9,
  },
  '100%': {
    transform: 'scale(1.6)',
    opacity: 0,
  },
},

'center-glow': {
  '0%': {
    opacity: 0,
    transform: 'scale(0.8)',
  },
  '40%': {
    opacity: 0.7,
  },
  '100%': {
    opacity: 0,
    transform: 'scale(1.4)',
  },
},




  'energy-left': {
    '0%': { transform: 'translateX(0%)', opacity: 0 },
    '30%': { opacity: 1 },
    '100%': { transform: 'translateX(120%)', opacity: 0 },
  },

  'energy-right': {
    '0%': { transform: 'translateX(0%)', opacity: 0 },
    '30%': { opacity: 1 },
    '100%': { transform: 'translateX(-120%)', opacity: 0 },
  },

  'to-center-left': {
    '0%': { transform: 'translateX(0%)', opacity: 0 },
    '30%': { opacity: 1 },
    '100%': { transform: 'translateX(120%)', opacity: 0 },
  },

  'to-center-right': {
    '0%': { transform: 'translateX(0%)', opacity: 0 },
    '30%': { opacity: 1 },
    '100%': { transform: 'translateX(-120%)', opacity: 0 },
  },

  'rail-hit': {
    '0%, 70%': { opacity: 0, transform: 'scale(0.6)' },
    '75%': { opacity: 1, transform: 'scale(1.6)' },
    '100%': { opacity: 0, transform: 'scale(0.6)' },
  },
},

    
animation: {
  'rail-down': 'rail-down 2.4s ease-in-out infinite',
  'energy-left': 'energy-left 2.4s ease-in-out infinite',
  'energy-right': 'energy-right 2.4s ease-in-out infinite',
  'to-center-left': 'to-center-left 2.4s ease-in-out infinite',
  'to-center-right': 'to-center-right 2.4s ease-in-out infinite',
  'rail-hit': 'rail-hit 2.4s ease-in-out infinite',
  'center-ripple': 'center-ripple 2.4s ease-out infinite',
  'center-glow': 'center-glow 2.4s ease-out infinite',
},
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

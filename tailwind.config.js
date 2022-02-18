
const colors = require("tailwindcss/colors");

module.exports = {
  purge: ["./public/**/*.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    screens: {
      sm: "480px",
      md: "768px",
      lg: "976px",
      xl: "1440px",
      
    },
    colors: {
      black: colors.black,
      white: colors.white,
      gray: colors.gray,
      emerald: colors.emerald,
      indigo: colors.indigo,
      yellow: colors.yellow,
      red: colors.red,
    },
    fontFamily: {
      sans: ["Graphik", "sans-serif"],
      serif: ["Merriweather", "serif"],
    },
    extend: {
      spacing: {
        128: "32rem",
        144: "36rem",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      backgroundImage: {
        main: "url('/images/woodenTable.jpg')",
        board: "url('/images/wood2.jpg')"
      },
      gridTemplateColumns: {
        'fluid': 'repeat(auto-fit, minmax(auto, 10rem)); place-content: center; place-items: center',
        'medium': 'repeat(auto-fit, minmax(7rem, auto)); place-content: center; place-items: center',
        'reduced': 'repeat(auto-fit, minmax(5rem, auto)); place-content: center; place-items: center'
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};

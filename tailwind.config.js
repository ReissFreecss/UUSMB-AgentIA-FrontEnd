/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#CB842E",
        secondary: "#FFCC00",
        greyPrimary: "#F5F5F5",
        alert: "#FF4C4C",
        parchment: {
          50: "#f8f6ee",
          100: "#ede8d0",
          200: "#dfd3a9",
          300: "#ccb878",
          400: "#bc9e53",
          500: "#ad8b45",
          600: "#956f39",
          700: "#785430",
          800: "#65462e",
          900: "#573c2c",
          950: "#322016",
        },
        "brandy-punch": {
          50: "#fcf8ee",
          100: "#f5ebd0",
          200: "#ebd59c",
          300: "#e0ba69",
          400: "#d9a446",
          500: "#cb842e",
          600: "#b86927",
          700: "#994e24",
          800: "#7d3e23",
          900: "#673420",
          950: "#3b190d",
        },
      },
      keyframes: {
        "scale-in": {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        "scale-in": "scale-in 0.2s ease-out",
      },
    },
  },
  plugins: [],
};

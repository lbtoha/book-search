/** @type {import('tailwindcss').Config} */

import plugin from "tailwindcss/plugin";
export default {
  content: ["./*.html", "./src/**/*.html"],
  theme: {
    extend: {
      container: {
        center: true,
        screens: {
          xs: "480px",
          sm: "576px",
          md: "768px",
          lg: "992px",
          xl: "1200px",
          xxl: "1400px",
          "3xl": "1600px",
          "4xl": "1800px",
        },
      },

      screens: {
        xs: "480px",
        sm: "576px",
        md: "768px",
        lg: "992px",
        xl: "1200px",
        xxl: "1400px",
        "3xl": "1600px",
        "4xl": "1800px",
      },

      colors: {
        primary: "#363aed",
        secondary: "#37d279",
        tertiary: "#ffbe46",
        "bg-1": "#f9f9fe",
        "bg-2": "#f5f5fe",
        "btn-bg": "#efeffd",
        border: "#c2c7d0",
        "neutral-700": "#243757",
        "primary-light": "#ececfd",
        "secondary-light": "#eafbf1",
        "secondary-500": "#22804a",
        dark: "#091e42",
      },

      backgroundImage: {
        "hero-pattern": "linear-gradient(256deg, #CBF1D3 2.16%, #FFEFD7 109.64%)",
      },

      fontFamily: {
        inter: ["var(--body-font)"],
      },
      boxShadow: {
        custom1: "0px 6px 30px 0px rgba(0, 0, 0, 0.04)",
        custom2: "0px 6px 30px 0px rgba(0, 0, 0, 0.06)",
        custom3: "0px 6px 30px 0px rgba(0, 0, 0, 0.08)",
      },

      spacing: {
        15: "60px",
        18: "72px",
        25: "100px",
        30: "120px",
      },

      keyframes: {
        "custom-pulse": {
          "0%": { opacity: "0.2" },
          "100%": { opacity: "1" },
        },
      },

      animation: {
        "spin-slow": "spin 10s linear infinite",
        "custom-pulse": "custom-pulse 6s ease-in-out infinite alternate-reverse;",
      },
    },
  },
  plugins: [
    plugin(function ({ addComponents }) {
      addComponents({
        ".theme-transition-3": {
          transition: "all 0.3s ease-in-out",
        },
        ".theme-transition-10": {
          transition: "all 1s ease-in-out",
        },
        ".theme-transition-4": {
          transition: "all 0.4s ease-in-out",
        },
        ".theme-transition-6": {
          transition: "all 0.6s ease-in-out",
        },
        ".theme-transition-8": {
          transition: "all 0.8s ease-in-out",
        },
      });
    }),
  ],
};

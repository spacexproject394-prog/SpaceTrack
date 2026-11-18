/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        background: "#f8fafc",
        foreground: "#1e293b",
        card: "#ffffff",
        border: "#e2e8f0",
        primary: "#5E2A52",
        "primary-dark": "#4A2140",
        muted: "#64748b",
        accent: "#D4A017",
      },
      borderRadius: {
        xl: "0.9rem",
      },
    },
  },
  plugins: [],
};

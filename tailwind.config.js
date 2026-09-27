/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#111311",
        ground: "#E9EFEA",
        paper: "#F3F6F3",
        mint: "#C5EBC3",
        "mint-deep": "#2F5A3A",
        muted: "#4A524C",
      },
      fontFamily: {
        display: ['"Archivo"', "system-ui", "sans-serif"],
        sans: ['"Archivo"', "system-ui", "sans-serif"],
        mono: ['"Martian Mono"', "ui-monospace", "monospace"],
      },
      transitionTimingFunction: {
        expo: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

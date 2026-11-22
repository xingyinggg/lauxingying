/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        sky: "#A9E4FB",
        "sky-deep": "#17475C",
        styrofoam: "#FAF8F2",
        shade: "#E4E0D5",
        rice: "#FFFFFF",
        curry: "#F0A21C",
        sambal: "#D8372E",
        kangkong: "#2F8F3E",
        "kangkong-deep": "#1F6F33",
        "bag-red": "#E5484D",
        "bag-blue": "#3B7DDD",
        grape: "#7B4FD1",
        table: "#F28A4B",
        steel: "#C5CCD2",
        ink: "#1C1B19",
        "ink-soft": "#4A4742",
      },
      fontFamily: {
        display: ['"M PLUS Rounded 1c"', "system-ui", "sans-serif"],
        sans: ['"Schibsted Grotesk"', "system-ui", "sans-serif"],
        mono: ['"Sometype Mono"', "ui-monospace", "monospace"],
      },
      transitionTimingFunction: {
        expo: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

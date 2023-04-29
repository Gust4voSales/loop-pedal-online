/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      animation: {
        "pulse-fast": "pulse 1.5s linear infinite",
        "spin-slow": "spin 1.5s linear infinite",
        "fade-bottom": "fade-bottom .8s cubic-bezier(0.390, 0.575, 0.565, 1.000) both",
      },
      keyframes: {
        "fade-bottom": {
          "0%": { opacity: 0, transform: "translateY(50px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
  daisyui: {
    themes: ["dark"], // night, winter
  },
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      animation: {
        "pulse-fast": "pulse 1.5s linear infinite",
        "spin-slow": "spin 1.5s linear infinite",
        "fade-bottom": "fade-bottom .8s cubic-bezier(0.390, 0.575, 0.565, 1.000) both",
        "slide-bottom": "slide-bottom .5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both",
        "slide-top": "slide-top .5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both",
        blur: "blur 1s ease both",
      },
      keyframes: {
        "fade-bottom": {
          "0%": { opacity: 0, transform: "translateY(100px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        "slide-bottom": {
          "0%": { opacity: 0, transform: "translateY(1000px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        "slide-top": {
          "0%": { opacity: 0, transform: "translateY(-1000px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        blur: {
          "0%": { filter: "blur(10px)" },
          "100%": { filter: "blur(0)" },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
  daisyui: {
    themes: ["dark"], // night, winter
  },
};

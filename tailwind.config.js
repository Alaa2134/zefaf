/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        gold: {
          50: "#fdf9ed",
          100: "#faf0c7",
          200: "#f5e08a",
          300: "#eec64a",
          400: "#e7af26",
          500: "#d4961c",
          600: "#b67616",
          700: "#925616",
          800: "#79451a",
          900: "#673a1c",
        },
        rose: {
          50: "#fef2f4",
          100: "#fde6ea",
          200: "#fbd0d8",
          300: "#f7aab9",
          400: "#f17a93",
          500: "#e64d72",
          600: "#d22a58",
          700: "#b11d47",
          800: "#931c42",
          900: "#7c1c3d",
        },
        ink: {
          50: "#f6f6f7",
          100: "#e1e3e5",
          200: "#c3c6cc",
          300: "#9ea2ab",
          400: "#787d88",
          500: "#5d626d",
          600: "#494d56",
          700: "#3c4047",
          800: "#33363c",
          900: "#1a1c20",
        },
      },
      fontFamily: {
        sans: ["var(--font-cairo)", "system-ui", "sans-serif"],
        display: ["var(--font-amiri)", "serif"],
        script: ["var(--font-aref)", "serif"],
      },
      keyframes: {
        "float-up": {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
        "heart-beat": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.15)" },
        },
        "spin-slow": {
          to: { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "float-up": "float-up 0.7s ease-out forwards",
        shimmer: "shimmer 2s linear infinite",
        "heart-beat": "heart-beat 1.4s ease-in-out infinite",
        "spin-slow": "spin-slow 20s linear infinite",
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #d4961c 0%, #f5e08a 50%, #d4961c 100%)",
        "rose-gradient": "linear-gradient(135deg, #d22a58 0%, #f7aab9 50%, #d22a58 100%)",
      },
    },
  },
  plugins: [],
};

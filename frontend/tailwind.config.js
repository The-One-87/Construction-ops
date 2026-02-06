/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}", "./lib/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        frosted: "rgba(255,255,255,0.08)",
        "frosted-strong": "rgba(255,255,255,0.18)",
        sapphire: "#3b82f6",
        gold: "#f5c542"
      },
      boxShadow: {
        acrylic: "0 20px 40px -12px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)",
        rim: "inset 2px 2px 6px rgba(255,255,255,0.15), inset -2px -2px 6px rgba(0,0,0,0.25)",
        vignette: "inset 0 0 120px 40px rgba(0,0,0,0.6)",
      },
      backdropBlur: { xl: "32px", "2xl": "48px" },
    },
  },
  plugins: [],
};

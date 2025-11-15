/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          pink: "#FF005C",
          purple: "#7B2CBF",
          dark: "#0F0F1A"
        }
      },
      boxShadow: {
        card: "0 20px 50px -20px rgba(15, 15, 26, 0.45)"
      },
      backdropBlur: {
        xs: "2px"
      }
    }
  },
  plugins: []
};

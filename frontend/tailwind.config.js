/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"], // 👈 importantísimo
  theme: {
    extend: {
      colors: {
        brand: {
          navy: "#0B1220",
          blue: "#2E90FA",
          blueDark: "#1570EF",
          sky: "#84CAFF",
          text: "#F8FAFC",
          muted: "#94A3B8",
        },
      },
    },
  },
  plugins: [],
};

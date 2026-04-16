/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Inter", "Pretendard", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 24px 60px rgba(33, 37, 41, 0.14)",
      },
    },
  },
  plugins: [],
};

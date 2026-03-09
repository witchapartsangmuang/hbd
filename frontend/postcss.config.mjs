const config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: "#ec4899",
      },
    },
  },
  plugins: ["@tailwindcss/postcss"],
};

export default config;



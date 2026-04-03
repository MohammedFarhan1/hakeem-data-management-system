import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0F172A",
        mist: "#E2E8F0",
        linen: "#F8F6F1",
        saffron: "#E9A319",
        forest: "#0F5C4D",
        coral: "#D45D48",
        tide: "#DDEBE5"
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        serif: ["var(--font-serif)"]
      },
      boxShadow: {
        float: "0 24px 60px rgba(15, 23, 42, 0.14)"
      },
      backgroundImage: {
        grid: "linear-gradient(rgba(15, 23, 42, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(15, 23, 42, 0.05) 1px, transparent 1px)"
      }
    }
  },
  plugins: []
};

export default config;

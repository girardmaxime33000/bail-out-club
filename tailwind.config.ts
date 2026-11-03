import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0a0a0b",
        vault: "#111113",
        edge: "#26262b",
        gold: { DEFAULT: "#d4a64a", soft: "#e8c982", deep: "#8a6a24" },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      letterSpacing: { wider2: "0.25em" },
    },
  },
  plugins: [],
};
export default config;

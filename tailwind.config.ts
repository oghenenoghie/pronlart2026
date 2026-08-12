import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0B0A08",
        gesso: "#F4F1EA",
        ash: "#A8A39A",
        gilt: "#B08D57",
        line: "rgba(244,241,234,0.12)",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        quiet: ["var(--font-quiet)"],
      },
      fontSize: {
        "display-xl": ["clamp(3rem, 8vw, 7rem)", { lineHeight: "1.05" }],
        "display-lg": ["clamp(2rem, 5vw, 4rem)", { lineHeight: "1.1" }],
        h2: ["clamp(1.5rem, 3vw, 2.25rem)", { lineHeight: "1.2" }],
        lede: ["1.25rem", { lineHeight: "1.7" }],
        label: ["0.75rem", { letterSpacing: "0.18em", lineHeight: "1" }],
        placard: ["0.875rem", { lineHeight: "1.5" }],
      },
    },
  },
  plugins: [],
};
export default config;

import type { Config } from "tailwindcss";

// Fire & Night design tokens.
// Fire (#E85A1E) is accent-only: active states, CTAs, and milestones.
// Gold (#D4A847) is reserved for milestone completion.
// Alive (#3AB060) is reserved for completed states.
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        void: "#0D0D0D",
        carbon: "#141414",
        cinder: "#1E1E1E",
        ash: "#3A3A3A",
        smoke: "#6A6A6A",
        bone: "#F0ECE4",
        fire: "#E85A1E",
        ember: "#C04010",
        gold: "#D4A847",
        alive: "#3AB060",
      },
      fontFamily: {
        display: ["var(--font-bebas)", "Impact", "sans-serif"],
        nav: ["var(--font-syne)", "Inter", "sans-serif"],
        body: ["var(--font-dm-sans)", "Inter", "sans-serif"],
      },
      letterSpacing: {
        wider2: "0.12em",
        wider3: "0.18em",
        wider4: "0.28em",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};

export default config;

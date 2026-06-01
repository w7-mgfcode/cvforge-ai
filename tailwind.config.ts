import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        workspace: {
          bg: "#0F172A",
          card: "#1E293B",
          border: "#334155",
          accent: "#2563EB",
          accentHover: "#1D4ED8",
        },
        dossier: {
          primary: "#0F172A",
          secondary: "#1E3A8A",
          accent: "#EA580C",
          text: "#1E293B",
          muted: "#475569",
          light: "#F8FAFC",
          tint: "#F0F4F8",
          border: "#E2E8F0",
        },
      },
      fontFamily: {
        montserrat: ["var(--font-montserrat)", "sans-serif"],
        inter: ["var(--font-inter)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;

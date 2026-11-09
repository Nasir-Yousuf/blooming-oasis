import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: "#183D32",
        botanical: "#547B55",
        sage: "#A8B99A",
        cream: "#F7F5EF",
        offwhite: "#FEFDF9",
        terracotta: "#C98568",
        charcoal: "#252B27",
        // Extended harmonious shades
        "forest-dark": "#102821",
        "forest-light": "#215344",
        "sage-light": "#E9EFE6",
        "sage-muted": "#CCD7C3",
        "cream-light": "#FAF9F5",
        "terracotta-dark": "#B26B4D",
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Playfair Display", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Plus Jakarta Sans", "Inter", "sans-serif"],
      },
      boxShadow: {
        soft: "0 10px 30px -10px rgba(24, 61, 50, 0.08)",
        card: "0 14px 40px -15px rgba(24, 61, 50, 0.12)",
        elevated: "0 25px 60px -20px rgba(24, 61, 50, 0.18)",
      },
      borderRadius: {
        botanical: "1.25rem",
      },
    },
  },
  plugins: [],
};

export default config;

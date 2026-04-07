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
        background: "var(--background)",
        foreground: "var(--foreground)",
        celeste: {
          DEFAULT: "#75AADB",
          light: "#9bc6e8",
          dark: "#4b89c6",
        },
        blanco: "#FFFFFF",
        dorado: {
          DEFAULT: "#D4AF37",
          light: "#F3E5AB",
          dark: "#AA8C2C",
        },
        papel: {
          DEFAULT: "#F4F1EA",
          oscuro: "#E6E2D3",
        }
      },
    },
  },
  plugins: [],
};
export default config;

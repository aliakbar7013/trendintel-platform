import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#08090d",
        surface: "#0f1118",
        "surface-raised": "#161922",
        "surface-card": "#1a1e2a",
        "surface-border": "#272e3f",
        brand: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
        },
        cyber: {
          cyan: "#00f0ff",
          emerald: "#10b981",
          violet: "#8b5cf6",
          rose: "#f43f5e",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "100%",
            color: "#cbd5e1",
            h2: {
              color: "#f8fafc",
              fontWeight: "700",
              marginTop: "2em",
              marginBottom: "0.8em",
              lineHeight: "1.3",
            },
            h3: {
              color: "#e2e8f0",
              fontWeight: "600",
              marginTop: "1.6em",
              marginBottom: "0.6em",
              lineHeight: "1.4",
            },
            p: {
              lineHeight: "1.8",
              marginBottom: "1.25em",
            },
            blockquote: {
              color: "#94a3b8",
              borderLeftColor: "#f59e0b",
              backgroundColor: "rgba(15, 23, 42, 0.6)",
              padding: "1rem 1.25rem",
              borderRadius: "0.375rem",
              fontStyle: "normal",
            },
            a: {
              color: "#fbbf24",
              textDecoration: "underline",
              "&:hover": {
                color: "#f59e0b",
              },
            },
            strong: {
              color: "#f8fafc",
            },
            ul: {
              listStyleType: "disc",
            },
            li: {
              marginTop: "0.35em",
              marginBottom: "0.35em",
            },
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;

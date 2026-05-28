import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#ea2804",
        "primary-deep": "#c01f00",
        "primary-bg": "rgba(234,40,4,0.08)",
        "on-primary": "#ffffff",
        "ink": "#171717",
        "body": "#4d4d4d",
        "muted": "#888888",
        "ash": "#a1a1a1",
        "stone": "#bbbbbb",
        "hairline": "#ebebeb",
        "canvas": "#fafafa",
        "surface-card": "#ffffff",
        "surface-soft": "#f5f5f5",
        "surface-dark": "#171717",
        "success": "#0070f3",
        "success-bg": "#e8f3ff",
        "warning": "#f5a623",
        "warning-bg": "#ffefcf",
        "danger": "#ee0000",
        "danger-bg": "#f7d4d6",
        "info": "#7928ca",
        "info-bg": "#f0edf8",
        "sidebar": "#ffffff",
        "sidebar-foreground": "#171717",
        "sidebar-primary": "#ea2804",
        "sidebar-primary-foreground": "#ffffff",
        "sidebar-accent": "#f5f5f5",
        "sidebar-accent-foreground": "#171717",
        "sidebar-border": "#ebebeb",
        "sidebar-ring": "#ea2804",
        "chart-1": "#ea2804",
        "chart-2": "#0070f3",
        "chart-3": "#f5a623",
        "chart-4": "#7928ca",
        "chart-5": "#171717",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "Menlo", "monospace"],
      },
      borderRadius: {
        xs: "4px",
        sm: "6px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        full: "9999px",
      },
      boxShadow: {
        card: "0 0 0 1px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.04)",
        elevated:
          "0 0 0 1px rgba(0,0,0,0.04), 0 2px 4px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.04)",
        modal:
          "0 0 0 1px rgba(0,0,0,0.04), 0 8px 16px rgba(0,0,0,0.06), 0 24px 48px rgba(0,0,0,0.08)",
      },
    },
  },
  plugins: [],
};

export default config;

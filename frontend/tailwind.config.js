/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        "bg-primary": "var(--bg-primary)",
        "bg-secondary": "var(--bg-secondary)",
        "bg-tertiary": "var(--bg-tertiary)",
        "bg-code": "var(--bg-code)",
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        "text-muted": "var(--text-muted)",
        "accent-primary": "var(--accent-primary)",
        "accent-secondary": "var(--accent-secondary)",
        "accent-tertiary": "var(--accent-tertiary)",
        "accent-hover": "var(--accent-hover)",
        border: "var(--border)",
        success: "var(--success)",
        warning: "var(--warning)",
        error: "var(--error)",
        info: "var(--info)",
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "Cascadia Code", "monospace"],
      },
      borderRadius: {
        DEFAULT: "4px",
      },
      keyframes: {
        "slide-down": {
          "0%": { transform: "translateY(-16px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "value-flash": {
          "0%": { color: "var(--accent-primary)", fontWeight: "700" },
          "100%": { color: "var(--text-primary)" },
        },
        "badge-pulse": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
      },
      animation: {
        "slide-down": "slide-down 0.3s ease",
        "fade-in": "fade-in 0.2s ease",
        "value-flash": "value-flash 0.6s ease",
        "badge-pulse": "badge-pulse 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
}

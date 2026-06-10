/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        black: "#030303",
        navy: "#0B0C10",
        glass: "var(--color-glass)",
        "glass-border": "var(--color-glass-border)",
        "glass-border-hover": "var(--color-glass-border-hover)",
        brandPrimary: "var(--color-primary)",
        brandPrimaryHover: "var(--color-primary-hover)",
        brandPrimaryGlow: "var(--color-primary-glow)",
        cyanAccent: "var(--color-accent-cyan)",
        cyanAccentHover: "var(--color-accent-cyan-hover)",
        danger: "var(--color-danger)",
        dangerHover: "var(--color-danger-hover)",
        dangerGlow: "var(--color-danger-glow)",
        themeBg: "var(--color-bg-primary)",
        themeSurface: "var(--color-bg-secondary)",
        themeText: "var(--color-text-primary)",
        themeTextSecondary: "var(--color-text-secondary)",
        themeTextMuted: "var(--color-text-muted)",
      },
      backgroundColor: {
        glass: "var(--color-glass)",
      },
      borderColor: {
        glass: "var(--color-glass-border)",
      },
      backdropBlur: {
        glass: "20px",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-in",
        "slide-in": "slideIn 0.2s ease-out",
        "pulse-soft": "pulseSoft 2s ease-in-out infinite",
        typing: "typing 0.6s steps(3, end) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideIn: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "1" },
        },
        typing: {
          "0%": { content: '"."' },
          "33%": { content: '".."' },
          "66%": { content: '"..."' },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(31, 38, 135, 0.2)",
        "glow-soft": "0 0 40px rgba(100, 84, 240, 0.15)",
      },
    },
  },
  darkMode: "class",
  plugins: [],
};

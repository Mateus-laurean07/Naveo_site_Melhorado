/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Geist"', '"Inter"', '"Helvetica Neue"', "sans-serif"],
        sans: ['"Inter"', "-apple-system", "BlinkMacSystemFont", '"Helvetica Neue"', "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
      },
      colors: {
        bg: {
          DEFAULT: "#ffffff",
          soft: "#f6f7f9",      // off-white sutil
          1: "#f0f2f5",         // mais escuro
          card: "#ffffff",
          dark: "#0a0a0c",      // dark sections (CTA final, hero dark variants)
          dark2: "#14161a",
        },
        ink: {
          DEFAULT: "#0a0a0c",   // near-black
          1: "#1f2125",
          dim: "#52555c",        // gray 600
          faint: "#7a7d84",      // gray 500
          mute: "#a8acb3",       // gray 400
          line: "#e5e7eb",       // gray 200
        },
        accent: {
          DEFAULT: "#1e54e0",   // azul vibrante Base-style
          hover: "#3b6ff1",
          dark: "#1842b8",
          warm: "#f97316",      // orange warm para toques
          bg: "#eef2ff",         // light blue tint for accent backgrounds
        },
        line: {
          DEFAULT: "#e5e7eb",
          mid: "#d1d5db",
          strong: "#9ca3af",
        },
      },
      maxWidth: {
        container: "1440px",
        content: "1180px",
        prose: "680px",
      },
      animation: {
        "marquee": "marquee 60s linear infinite",
        "fade-up": "fadeUp 0.7s ease-out forwards",
      },
      keyframes: {
        marquee: { "0%": { transform: "translateX(0)" }, "100%": { transform: "translateX(-50%)" } },
        fadeUp: { "0%": { opacity: "0", transform: "translateY(24px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
      },
      boxShadow: {
        soft: "0 1px 2px rgba(10, 10, 12, 0.04), 0 0 0 1px rgba(10, 10, 12, 0.04)",
        card: "0 4px 24px rgba(10, 10, 12, 0.06), 0 1px 2px rgba(10, 10, 12, 0.04)",
        lg: "0 24px 60px rgba(10, 10, 12, 0.12), 0 4px 12px rgba(10, 10, 12, 0.05)",
      },
    },
  },
  plugins: [],
};

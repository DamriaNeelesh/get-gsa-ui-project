import type { Config } from "tailwindcss";
import forms from "@tailwindcss/forms";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/hooks/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: "#0B182F",
          subtle: "#F3F5FB",
        },
        accent: {
          DEFAULT: "#4566F2",
          muted: "#E7ECFF",
          ring: "rgba(69, 102, 242, 0.35)",
        },
        neutral: {
          50: "#F9FAFB",
          100: "#F3F4F6",
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#4B5563",
          700: "#374151",
          800: "#1F2937",
          900: "#111827",
        },
        success: {
          DEFAULT: "#0FA958",
          muted: "#DCFCE7",
        },
        warning: {
          DEFAULT: "#F59E0B",
          muted: "#FEF3C7",
        },
        danger: {
          DEFAULT: "#EF4444",
          muted: "#FEE2E2",
        },
      },
      boxShadow: {
        card: "0 10px 30px -12px rgba(10, 24, 47, 0.25)",
        subtle: "0 1px 3px rgba(15, 23, 42, 0.08), 0 1px 2px rgba(15, 23, 42, 0.12)",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Inter", "system-ui", "sans-serif"],
      },
      keyframes: {
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        shimmer: "shimmer 1.6s ease-in-out infinite",
      },
    },
  },
  plugins: [forms()],
};

export default config;


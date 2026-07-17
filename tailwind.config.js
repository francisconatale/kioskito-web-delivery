/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "oklch(var(--border) / <alpha-value>)",
        input: "oklch(var(--input) / <alpha-value>)",
        ring: "oklch(var(--ring) / <alpha-value>)",
        background: "var(--color-neutral-50)",
        foreground: "var(--color-neutral-900)",
        primary: {
          DEFAULT: "var(--color-primary-700)",
          foreground: "var(--color-white, #FFFFFF)",
          900: "var(--color-primary-900)",
          700: "var(--color-primary-700)",
          500: "var(--color-primary-500)",
          200: "var(--color-primary-200)",
          100: "var(--color-primary-100)",
        },
        neutral: {
          900: "var(--color-neutral-900)",
          600: "var(--color-neutral-600)",
          200: "var(--color-neutral-200)",
          50: "var(--color-neutral-50)",
        },
        amber: {
          500: "var(--color-amber-500)",
        },
        success: {
          500: "var(--color-success-500)",
          100: "var(--color-success-100)",
        },
        error: {
          500: "var(--color-error-500)",
        },
        secondary: {
          DEFAULT: "oklch(var(--secondary) / <alpha-value>)",
          foreground: "oklch(var(--secondary-foreground) / <alpha-value>)",
        },
        destructive: {
          DEFAULT: "oklch(var(--destructive) / <alpha-value>)",
          foreground: "oklch(var(--destructive-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "oklch(var(--muted) / <alpha-value>)",
          foreground: "oklch(var(--muted-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "oklch(var(--accent) / <alpha-value>)",
          foreground: "oklch(var(--accent-foreground) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "oklch(var(--popover) / <alpha-value>)",
          foreground: "oklch(var(--popover-foreground) / <alpha-value>)",
        },
        card: {
          DEFAULT: "oklch(var(--card) / <alpha-value>)",
          foreground: "oklch(var(--card-foreground) / <alpha-value>)",
        },
      },
      fontFamily: {
        sans: ["var(--font-body)", "Sora", "sans-serif"],
        display: ["var(--font-display)", "Sora", "sans-serif"],
        mono: ["var(--font-mono)", "IBM Plex Mono", "monospace"],
      },
      borderRadius: {
        lg: "var(--radius-lg)",
        md: "var(--radius-md)",
        sm: "var(--radius-sm)",
        full: "var(--radius-full)",
      },
      boxShadow: {
        card: "0 2px 8px rgba(22, 40, 58, 0.08)",
        modal: "0 8px 24px rgba(22, 40, 58, 0.16)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}


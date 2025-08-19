import type { Config } from "tailwindcss"

// all in fixtures is set to tailwind v3 as interims solutions

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Nueva paleta de colores personalizada
        magenta: {
          DEFAULT: "#F522A4",
          light: "#FF4DB8",
          dark: "#D41A8A",
        },
        zafiro: {
          DEFAULT: "#4D20EE",
          light: "#6B3DFF",
          dark: "#3A18B8",
        },
        amatista: {
          DEFAULT: "#6733BA",
          light: "#8A4CD9",
          dark: "#4F2690",
        },
        oro: {
          DEFAULT: "#E7D31A",
          light: "#F0E04D",
          dark: "#D4C215",
        },
        negro: {
          DEFAULT: "#1A1A1A",
          light: "#2A2A2A",
          dark: "#0A0A0A",
        },
        blanco: {
          DEFAULT: "#E5E5E5",
          light: "#FFFFFF",
          dark: "#CCCCCC",
        },
        // Colores del sistema (manteniendo compatibilidad)
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: "#F522A4", // Magenta Imperial como color primario
        secondary: "#4D20EE", // Zafiro Eléctrico como color secundario
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "#6733BA", // Amatista como acento
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        black: "#1A1A1A", // Negro Ceniza
        white: "#E5E5E5", // Blanco Platino
        gray: {
          50: "#f9fafb",
          100: "#f3f4f6",
          200: "#e5e7eb",
          300: "#d1d5db",
          400: "#9ca3af",
          500: "#6b7280",
          600: "#4b5563",
          700: "#374151",
          800: "#1f2937",
          900: "#111827",
          DEFAULT: "#A6A6A6",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      fontFamily: {
        balgin: ["var(--font-inter)", "sans-serif"],
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, #F522A4 0%, #4D20EE 100%)",
        "gradient-secondary": "linear-gradient(135deg, #6733BA 0%, #4D20EE 100%)",
        "gradient-accent": "linear-gradient(135deg, #E7D31A 0%, #F522A4 100%)",
      },
    },
  },
  plugins: [],
}
export default config

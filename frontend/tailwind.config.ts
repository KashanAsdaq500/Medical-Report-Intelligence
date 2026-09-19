import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Deep Medical Navy & Slate-Blues for Trust, Authority, and Clean Healthcare Aesthetics
        clinical: {
          50: "#f0f6fa",
          100: "#e0edf5",
          200: "#c2dbe9",
          300: "#93c0db",
          400: "#5e9fc9",
          500: "#3982b3",
          600: "#276896",
          700: "#20547b",
          800: "#1d4666",
          900: "#1b3c55",
          950: "#0e2436",
        },
        navy: {
          50: "#f4f6fa",
          100: "#e8ecf4",
          200: "#cfd9e8",
          300: "#a6bad7",
          400: "#7596c1",
          500: "#4f75aa",
          600: "#3c5c8e",
          700: "#314b74",
          800: "#1e314d",
          900: "#0f1d30",
          950: "#091220",
        },
        // Secondary Calm Clinical Teal for Healthcare / Technology Accent
        teal: {
          50: "#f0fdfa",
          100: "#ccfbf1",
          200: "#99f6e4",
          300: "#5eead4",
          400: "#2dd4bf",
          500: "#14b8a6",
          600: "#0d9488",
          700: "#0f766e",
          800: "#115e59",
          900: "#134e4a",
          950: "#042f2e",
        },
        // Clinical Neutral Background and Card Surfaces
        surface: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          800: "#1e293b",
          900: "#0f172a",
        },
      },
      boxShadow: {
        medical: "0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 1px 2px -1px rgba(15, 23, 42, 0.03)",
        "medical-md": "0 4px 12px -2px rgba(15, 23, 42, 0.06), 0 2px 6px -2px rgba(15, 23, 42, 0.03)",
        "medical-lg": "0 12px 24px -4px rgba(15, 23, 42, 0.08), 0 4px 8px -4px rgba(15, 23, 42, 0.03)",
      },
    },
  },
  plugins: [],
};
export default config;

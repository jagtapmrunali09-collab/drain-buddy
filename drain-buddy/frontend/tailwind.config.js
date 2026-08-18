/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#F4F8FA",
        surface: "#FFFFFF",
        ink: "#0F2430",
        subink: "#4C6470",
        line: "#DCE7EA",
        teal: {
          50: "#EAF6F6",
          100: "#CFEBEA",
          300: "#6FBFBE",
          500: "#0E7C86",
          600: "#0B6670",
          700: "#095159",
        },
        indigo: {
          500: "#1B3A6B",
          600: "#152E56",
          700: "#102341",
        },
        amber: {
          100: "#FCEACB",
          400: "#F2A20C",
          500: "#D98A05",
        },
        danger: {
          100: "#FBDEDE",
          500: "#D64545",
          600: "#B93A3A",
        },
        success: {
          100: "#DFF3E6",
          500: "#2E9E5B",
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(15,36,48,0.04), 0 8px 24px -12px rgba(15,36,48,0.12)",
        pop: "0 10px 30px -10px rgba(14,124,134,0.35)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      backgroundImage: {
        "pipe-line":
          "repeating-linear-gradient(90deg, transparent 0 10px, #CFEBEA 10px 12px)",
      },
    },
  },
  plugins: [],
};

module.exports = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "#F8FAFC",
          dark: "#0B1220",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          dark: "#0F172A",
        },
        primary: "#6366F1",
        success: "#10B981",
      },
      fontFamily: {
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
      },
      borderRadius: {
        xl: "0.9rem",
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
      boxShadow: {
        "soft-card": "0 18px 45px rgba(15, 23, 42, 0.08)",
        "soft-sm": "0 8px 25px rgba(15, 23, 42, 0.06)",
      },
    },
  },
  plugins: [],
};

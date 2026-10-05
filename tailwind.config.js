/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F4F3EF",
        ink: "#0B0B0B",
        charcoal: "#171917",
        audit: { 50:"#ECFDF5",100:"#D1FAE5",500:"#0B7A4B",600:"#0A6B42",700:"#084F31",900:"#0A2E1E" },
        line: "#111111",
      },
      fontFamily: {
        sans: ["Inter", "Manrope", "system-ui", "sans-serif"],
        display: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      borderRadius: { xl2: "1.25rem", xl3: "1.75rem" },
      boxShadow: { card: "4px 4px 0 0 #0B0B0B", cardSm: "2px 2px 0 0 #0B0B0B" },
    },
  },
  plugins: [],
};

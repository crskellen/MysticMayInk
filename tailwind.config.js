/** @type {import('tailwindcss').Config} */
// Color, type, and glow values live in src/index.css.

const channel = (name) => `rgb(var(--mystic-${name}) / <alpha-value>)`;

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mystic: {
          bg: channel("bg"),
          card: channel("card"),
          text: channel("text"),
          muted: channel("muted"),
          sage: channel("sage"),
          gold: channel("gold"),
          silver: channel("silver"),
        }
      },
      fontFamily: {
        serif: "var(--font-display)",
        sans: "var(--font-body)",
      },
      boxShadow: {
        "gold-glow": "var(--shadow-gold-glow)",
      },
    },
  },
  plugins: [],
}

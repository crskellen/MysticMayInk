/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mystic: {
          bg: '#121212',       // Matte Charcoal Background
          card: '#1A1A1A',     // Slightly lighter charcoal for containers
          text: '#F5F5F5',     // Off-white for high legibility text
          muted: '#A3A3A3',    // Muted grey for captions/dates
          sage: '#6B7F6D',     // Earthy Muted Green for ferns/botanical elements
          gold: '#D4AF37',     // Antique Gold accent for links, highlights, buttons
          silver: '#C0C0C0',   // Celestial Silver accent
        }
      },
      fontFamily: {
        serif: ['Cinzel', 'Playfair Display', 'serif'], // Mystical/Elegant headers
        sans: ['Inter', 'system-ui', 'sans-serif'],     // Modern/Clean body
      },
      boxShadow: {
        'gold-glow': '0 0 15px rgba(214, 175, 55, 0.15)', // Subtle mystical card highlight
      }
    },
  },
  plugins: [],
}
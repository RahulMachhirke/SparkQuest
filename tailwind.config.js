/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          sky: '#8ECAE6',      // Light sky blue
          teal: '#219EBC',     // Vibrant cerulean / ocean blue
          navy: '#023047',     // Deep Prussian navy
          yellow: '#FFB703',   // Warm honey / amber yellow
          orange: '#FB8500',   // High-energy orange
          dark: '#011826',     // Ultra-dark background
          card: '#032537',     // Card surface
          border: '#0d4a6b',   // Border highlight
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['Fira Code', 'JetBrains Mono', 'Consolas', 'monospace']
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-short': 'bounce 0.6s ease infinite',
      }
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'spark-sky': '#8ECAE6',
        'spark-teal': '#219EBC',
        'spark-navy': '#023047',
        'spark-amber': '#FFB703',
        'spark-orange': '#FB8500',
        'spark-midnight': '#011826',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['"Fira Code"', 'monospace'],
      }
    },
  },
  plugins: [],
}

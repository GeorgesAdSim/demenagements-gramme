/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'gramme-blue': '#0c2094',
        'gramme-yellow': '#fff200',
        'gramme-dark-blue': '#0d1c78',
        'gramme-white': '#ffffff',
        'gramme-gray': '#f5f5f5',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

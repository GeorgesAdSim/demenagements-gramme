/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy:       '#132073',
        yellow:     '#F0B800',
        offwhite:   '#F4F2EE',
        muted:      '#85868C',
        'footer-bg':'#0D1020',
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        'pulse-cta': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(240,184,0,0)' },
          '50%':       { boxShadow: '0 0 0 8px rgba(240,184,0,0.25)' },
        },
      },
      animation: {
        'pulse-cta': 'pulse-cta 3s ease-in-out infinite',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

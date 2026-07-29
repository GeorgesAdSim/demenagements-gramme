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
        // Animé via transform, qui est composité par le GPU. La version
        // précédente animait box-shadow : PageSpeed la signalait comme
        // « animation non composée », car elle force un recalcul de peinture
        // à chaque image sur le thread principal.
        'pulse-cta': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%':       { transform: 'scale(1.02)' },
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

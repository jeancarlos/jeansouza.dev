import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#3e3353',
          text: '#f2b8d4',
          dot: '#75688c',
          from: '#e84545',
          to: '#b33a73',
        },
      },
      fontFamily: {
        sans: ['var(--font-poppins)', 'sans-serif'],
        body: ['var(--font-roboto)', 'sans-serif'],
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(to right, #e84545, #b33a73)',
      },
    },
  },
  plugins: [typography],
}

export default config

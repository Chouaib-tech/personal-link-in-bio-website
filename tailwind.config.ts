import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0E0E10',
        paper: '#EBE9E5',
        accent: { DEFAULT: '#FF4D1F', deep: '#B3120F' },
      },
      fontFamily: {
        sans: ['var(--font-jakarta)', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      backgroundImage: {
        'accent-gradient': 'linear-gradient(150deg, #FF4D1F 0%, #D92B17 50%, #B3120F 100%)',
      },
    },
  },
  plugins: [],
}
export default config

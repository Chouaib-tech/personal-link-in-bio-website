import type { Config } from 'tailwindcss'

const v = (name: string) => `rgb(var(--${name}) / <alpha-value>)`

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Theme tokens live in app/globals.css (dark / light)
        canvas: v('base'),
        panel: v('panel'),
        ink: v('ink'),
        muted: v('muted'),
        line: 'var(--line)',
        brass: { DEFAULT: '#c79551', hi: '#d4a568', text: v('brass-text') },
        forest: '#101b17',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        sans: ['var(--font-jakarta)', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config

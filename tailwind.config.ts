import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#ffffff',
        surface: '#f6f6f6',
        'surface-2': '#ededed',
        brand: '#0f0f0f',
        muted: '#5f5f5f',
        line: '#dadada',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        xl2: '32px',
        xl: '24px',
        lg: '18px',
        md: '12px',
      },
      boxShadow: {
        card: '0 20px 60px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
}

export default config

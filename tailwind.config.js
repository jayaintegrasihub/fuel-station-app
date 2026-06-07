/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0e2233',
          2: '#15334b',
          3: '#234c6e',
        },
        blue: {
          50: '#eaf3fb',
          100: '#d4e6f6',
          DEFAULT: '#2f80c2',
          600: '#2670ad',
          700: '#1f5f96',
        },
        page: { DEFAULT: '#eceff3', 2: '#e3e8ee' },
        surface: { DEFAULT: '#ffffff', 2: '#f6f8fb' },
        ink: {
          DEFAULT: '#0e2233',
          2: '#46596a',
          3: '#7c8b99',
        },
        line: { DEFAULT: '#d7dee6', 2: '#e6ebf1' },
        amber: { DEFAULT: '#e0922f', bg: '#fcf1e1' },
        green: { DEFAULT: '#1e9e63', bg: '#e4f4ec' },
        red: { DEFAULT: '#d24a4a', bg: '#fbeaea' },
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', '-apple-system', '"Segoe UI"', 'Roboto', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', '"SF Mono"', 'Menlo', 'monospace'],
      },
      borderRadius: {
        sm: '6px',
        DEFAULT: '10px',
        lg: '14px',
      },
      boxShadow: {
        sm: '0 1px 2px rgba(14,34,51,0.08)',
        DEFAULT: '0 2px 8px rgba(14,34,51,0.08), 0 1px 2px rgba(14,34,51,0.06)',
        lg: '0 12px 40px rgba(14,34,51,0.18)',
        header: '0 1px 0 rgba(255,255,255,0.06), 0 2px 12px rgba(0,0,0,0.18)',
      },
    },
  },
  plugins: [],
}

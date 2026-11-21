/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#090d14',
        surface: {
          1: '#0e1420',
          2: '#141d2e',
          3: '#1a263c',
        },
        border: {
          subtle: '#1a2333',
          muted: '#232f44',
        },
        accent: {
          DEFAULT: '#2ea043',
          hover: '#3fb950',
          muted: '#238636',
          tint: 'rgba(46, 160, 67, 0.12)',
        },
        content: {
          primary: '#f0f6fc',
          secondary: '#8b949e',
          muted: '#626c79',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      transitionTimingFunction: {
        'taste': 'cubic-bezier(0.23, 1, 0.32, 1)',
      }
    },
  },
  plugins: [],
}

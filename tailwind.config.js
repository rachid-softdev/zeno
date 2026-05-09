/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'bg-base': '#080B10',
        'bg-surface': '#0F1420',
        'bg-elevated': '#161D2E',
        'bg-hover': '#1C2438',
        'border-subtle': '#1E2A40',
        'border-active': '#2D3F5C',
        'accent-primary': '#3B82F6',
        'accent-secondary': '#10B981',
        'accent-warning': '#F59E0B',
        'accent-danger': '#EF4444',
        'text-primary': '#F0F4FF',
        'text-secondary': '#8B9CC4',
        'text-muted': '#4A5878',
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
        mono: ['"DM Mono"', 'ui-monospace', 'monospace'],
      },
      animation: {
        'pulse-ring': 'pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s ease-in-out infinite',
        'count-up': 'count-up 0.3s ease-out',
      },
      keyframes: {
        'pulse-ring': {
          '0%': { boxShadow: '0 0 0 0 rgba(59, 130, 246, 0.4)' },
          '70%': { boxShadow: '0 0 0 10px rgba(59, 130, 246, 0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(59, 130, 246, 0)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

/** @type {import('tailwindcss').Config} */
export default {
  prefix: "tw-",
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        protega: {
          500: '#2563EB',
          600: '#1E3A8A',
          700: '#1E40AF',
          800: '#1E3A8A'
        },
        cyan: {
          400: '#22D3EE'
        }
      },
      animation: {
        'pulse': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
};
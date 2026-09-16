/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  safelist: [
    // Dynamic category colors
    ...['emerald', 'orange', 'sky', 'violet', 'amber', 'rose', 'teal', 'indigo', 'slate'].flatMap((c) => [
      `bg-${c}-100`,
      `bg-${c}-500`,
      `bg-${c}-900/30`,
      `text-${c}-400`,
      `text-${c}-600`,
    ]),
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
      },
    },
  },
  plugins: [],
};

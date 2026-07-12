/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Materio primary purple
        primary: {
          50:  '#f3f0ff',
          100: '#e9e4ff',
          200: '#d4ccff',
          300: '#b9a9ff',
          400: '#9b7dff',
          500: '#7367f0',
          600: '#6554e8',
          700: '#5844d4',
          800: '#4938ab',
          900: '#3d3188',
        },
        // Dark sidebar
        sidebar: {
          DEFAULT: '#2f3349',
          dark:    '#25293c',
          deeper: '#1e2235',
        },
        // Card / surface
        surface: {
          DEFAULT: '#2f3349',
          light:   '#3a3f58',
          card:    '#383c51',
        },
        // Text
        muted: '#a8aab7',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 6px 0 rgba(67,89,113,.12)',
        'card-hover': '0 4px 16px 0 rgba(67,89,113,.2)',
      },
      borderRadius: {
        xl: '0.75rem',
        '2xl': '1rem',
      },
    },
  },
  plugins: [],
}

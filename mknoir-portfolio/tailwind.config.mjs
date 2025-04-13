/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{js,ts,jsx,tsx}'],
    theme: {
      extend: {
        colors: {
          background: '#0F2027', // Midnight Carbon
          foreground: '#FBFFFE', // Contrast Light
          surface: '#203A43',    // Molecular Grey-Blue
          surfaceDeep: '#2C5364', // Deep Hydroxide
          accent: {
            primary: '#5DD39E',   // Neon Protein Green
            secondary: '#2C5364', // Optional: deeper shade for hover
          },
          textMuted: '#A0AEC0', // You can adjust this to something like #8FA6B9 for softer text
        },
      },
    },
    plugins: [],
  }
  
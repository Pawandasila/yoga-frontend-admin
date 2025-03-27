/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./index.html",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      backgroundColor: {
        dark: {
          primary: '#1a1a1a',
          secondary: '#2d2d2d',
          accent: '#3d3d3d'
        }
      },
      textColor: {
        dark: {
          primary: '#ffffff',
          secondary: '#b3b3b3',
          accent: '#808080'
        }
      },
      borderColor: {
        dark: {
          primary: '#404040',
          secondary: '#333333'
        }
      }
    },
  },
  plugins: [],
}
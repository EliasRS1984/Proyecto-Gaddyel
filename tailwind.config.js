/** @type {import('tailwindcss').Config} */
export default {
  // ✅ DARK MODE: Detectar preferencia del navegador (prefers-color-scheme)
  // Tailwind genera media queries @media (prefers-color-scheme: dark)
  // Esto respeta la configuración de dark mode del navegador/sistema operativo
  darkMode: 'media',
  
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        purple: {
          500: "#a855f7",
          700: "#7e22ce",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
}

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      'gaddyel-frontend.loca.lt',
      '.loca.lt',
      '.ngrok.io',
      '.ngrok-free.app'
    ]
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Separar vendors grandes en chunks independientes
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-sentry': ['@sentry/react'],
          'vendor-helmet': ['react-helmet-async'],
          // Context providers en chunk separado
          'app-context': [
            './src/Context/CartContext.jsx',
            './src/Context/AuthContext.jsx',
            './src/Context/OrderContext.jsx'
          ]
        }
      }
    },
    // Aumentar límite para evitar warning (solo si es necesario)
    chunkSizeWarningLimit: 600
  }
})


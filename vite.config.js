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
  }
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Proxy vers l'API Express (port 3000) qui n'a pas CORS activé.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/login': 'http://localhost:3000',
      '/signup': 'http://localhost:3000',
      '/menu': 'http://localhost:3000',
      '/reservations': 'http://localhost:3000',
      '/my-reservations': 'http://localhost:3000',
    },
  },
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Base real de la API. Se puede sobreescribir con VITE_FUEL_API_BASE en un .env
const API_BASE = process.env.VITE_FUEL_API_BASE || 'https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: API_BASE,
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})

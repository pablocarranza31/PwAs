import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',   // Asegura que Vite escuche en todas las interfaces
    port: process.env.PORT || 5173,  // Usa el puerto de Render o 5173 como fallback
    allowedHosts: ['pwas-idb9.onrender.com'],  // Agrega el host de Render a los permitidos
  },
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    // Forward API calls to the local auth backend (backend/, default port 4000).
    proxy: {
      '/api': 'http://127.0.0.1:4000',
    },
  },
})

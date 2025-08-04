import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    terserOptions: {
      compress: {
        // Menghapus console.log di mode produksi
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
})

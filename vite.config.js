// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    proxy: {
      '/api': 'http://localhost', // Przekierowanie zapytań /api na serwer PHP (XAMPP)
    }
  },
  optimizeDeps: {
    exclude: ['search-worker-entry'] // Replace this with the actual dependency causing the issue
  }
})
import { defineConfig } from 'vite'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          // Keep the whole React ecosystem in one chunk to avoid cross-chunk
          // initialization-order issues.
          if (/[\\/](react|react-dom|react-router|react-router-dom|scheduler|react-helmet-async)[\\/]/.test(id))
            return 'react-vendor'
          if (id.includes('@supabase')) return 'supabase'
          if (/[\\/](gsap|motion|aos)[\\/]/.test(id)) return 'anim'
        },
      },
    },
  },
})

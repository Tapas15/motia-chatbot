import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'build'
  },
  root: '.',
  publicDir: 'public',
  server: {
    proxy: {
      '/chat': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    },
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      'motia-chatbot.onrender.com'
    ],
    cors: true
  }
})

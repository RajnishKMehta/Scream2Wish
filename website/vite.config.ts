import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  base: '/Scream2Wish/',
  publicDir: path.resolve(__dirname, '../assets/images'),

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  server: {
    port: 5173,
    host: true,
    allowedHosts: true,
  },

  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
})
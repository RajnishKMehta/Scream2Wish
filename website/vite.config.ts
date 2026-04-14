import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  base: '/Scream2Wish/',
  publicDir: path.resolve(__dirname, '../assets'),

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@root': path.resolve(__dirname, '../'),
      '@cmp': path.resolve(__dirname, './src/components'),
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
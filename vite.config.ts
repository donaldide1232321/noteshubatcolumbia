import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig({
  
  base: './',

  plugins: [react()],

  resolve: {
    alias: {
      
      '@': path.resolve(__dirname, 'src'),
    },
  },

  
  build: {
    outDir: 'dist',
    rollupOptions: {
      
      input: {
        main: path.resolve(__dirname, 'index.html'),
      },
    },
  },
})

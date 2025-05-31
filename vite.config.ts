import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig({
  // Use a relative base so asset URLs become "./assets/..." instead of "/assets/..."
  base: './',

  plugins: [react()],

  resolve: {
    alias: {
      // Preserve your "@/…" import paths pointing at /src
      '@': path.resolve(__dirname, 'src'),
    },
  },

  // The following is optional—but ensures your 404 fallback also works nicely
  build: {
    outDir: 'dist',
    rollupOptions: {
      // If you have multiple HTML entrypoints, list them here. Otherwise ignore.
      input: {
        main: path.resolve(__dirname, 'index.html'),
      },
    },
  },
})

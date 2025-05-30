import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig(({ mode }: { mode: string }) => ({
  base: '/',
  server: {
    host: "::",
    port: 8080,
    strictPort: true,
    proxy: {},
    middlewareMode: false,
    historyApiFallback: true
  },
  preview: {
    port: 8080,
    strictPort: true,
    proxy: {},
    middlewareMode: false,
    historyApiFallback: true
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@radix-ui/react-icons', '@radix-ui/react-slot']
        }
      }
    },
    outDir: 'dist'
  },
  plugins: [
    react(),
    {
      name: 'copy-redirect-files',
      closeBundle() {
        // Ensure the redirect files are copied to the build directory
        const redirectFiles = [
          '_redirects',
          '.htaccess',
          'netlify.toml',
          'web.config',
          'vercel.json',
          '_routes.json',
          'route-fix.js',
          '404.html'
        ];
        
        redirectFiles.forEach(file => {
          const srcPath = resolve(__dirname, 'public', file);
          const destPath = resolve(__dirname, 'dist', file);
          
          if (fs.existsSync(srcPath)) {
            fs.copyFileSync(srcPath, destPath);
            console.log(`Copied ${file} to dist directory`);
          }
        });
      }
    }
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
}));

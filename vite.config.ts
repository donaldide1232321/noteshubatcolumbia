import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig(({ mode }: { mode: string }) => ({
  base: mode === 'production' && process.env.DEPLOY_TARGET === 'github' ? '/noteshubatcolumbia/' : '/',
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
      name: 'github-pages-setup',
      closeBundle() {
        // Create a .nojekyll file to prevent GitHub Pages from ignoring files that begin with an underscore
        fs.writeFileSync(resolve(__dirname, 'dist', '.nojekyll'), '');
        console.log('Created .nojekyll file');
        
        // Copy custom 404.html from public to dist if it exists
        const customNotFoundPath = resolve(__dirname, 'public', '404.html');
        const distNotFoundPath = resolve(__dirname, 'dist', '404.html');
        
        if (fs.existsSync(customNotFoundPath)) {
          fs.copyFileSync(customNotFoundPath, distNotFoundPath);
          console.log('Copied custom 404.html to dist');
        } else {
          // If no custom 404.html exists, copy index.html to 404.html
          const indexPath = resolve(__dirname, 'dist', 'index.html');
          if (fs.existsSync(indexPath)) {
            fs.copyFileSync(indexPath, distNotFoundPath);
            console.log('Copied index.html to 404.html');
          }
        }
        
        // Use the template index.html if available
        const templatePath = resolve(__dirname, 'public', 'index.html.template');
        const distIndexPath = resolve(__dirname, 'dist', 'index.html');
        
        if (fs.existsSync(templatePath) && fs.existsSync(distIndexPath)) {
          // Read the template and the built index.html
          const template = fs.readFileSync(templatePath, 'utf8');
          const distIndex = fs.readFileSync(distIndexPath, 'utf8');
          
          // Extract the script tags from the built index.html
          const scriptTags = [];
          const styleLinks = [];
          
          // Extract script tags
          const scriptRegex = /<script[^>]*src="[^"]*"[^>]*><\/script>/g;
          let scriptMatch;
          while ((scriptMatch = scriptRegex.exec(distIndex)) !== null) {
            scriptTags.push(scriptMatch[0]);
          }
          
          // Extract style links
          const styleRegex = /<link[^>]*rel="stylesheet"[^>]*>/g;
          let styleMatch;
          while ((styleMatch = styleRegex.exec(distIndex)) !== null) {
            styleLinks.push(styleMatch[0]);
          }
          
          // Extract modulepreload links
          const preloadRegex = /<link[^>]*rel="modulepreload"[^>]*>/g;
          let preloadMatch;
          while ((preloadMatch = preloadRegex.exec(distIndex)) !== null) {
            styleLinks.push(preloadMatch[0]);
          }
          
          // Insert the scripts and styles into the template
          let updatedTemplate = template.replace('</head>', styleLinks.join('\\n') + '\\n' + scriptTags.join('\\n') + '\\n</head>');
          
          // Fix any absolute paths to use the base path
          updatedTemplate = updatedTemplate
            .replace(/src="\//g, `src="/noteshubatcolumbia/`)
            .replace(/href="\//g, `href="/noteshubatcolumbia/`)
            .replace(/src="\/noteshubatcolumbia\/noteshubatcolumbia\//g, `src="/noteshubatcolumbia/`)
            .replace(/href="\/noteshubatcolumbia\/noteshubatcolumbia\//g, `href="/noteshubatcolumbia/`);
          
          // Write the updated template to the dist index.html
          fs.writeFileSync(distIndexPath, updatedTemplate);
          console.log('Used template index.html and fixed paths');
        } else {
          // Fallback to the old method
          const hashRouterPath = resolve(__dirname, 'public', 'hash-router.js');
          
          if (fs.existsSync(hashRouterPath) && fs.existsSync(distIndexPath)) {
            const hashRouterScript = fs.readFileSync(hashRouterPath, 'utf8');
            const distIndex = fs.readFileSync(distIndexPath, 'utf8');
            
            // Insert the script into the head of the dist index.html
            const updatedIndex = distIndex.replace(/<head>([\s\S]*?)<\/head>/, 
              `<head>$1<script type="text/javascript">${hashRouterScript}</script></head>`);
            
            // Fix any absolute paths to use the base path
            const fixedIndex = updatedIndex
              .replace(/src="\//g, `src="/noteshubatcolumbia/`)
              .replace(/href="\//g, `href="/noteshubatcolumbia/`)
              .replace(/src="\/noteshubatcolumbia\/noteshubatcolumbia\//g, `src="/noteshubatcolumbia/`)
              .replace(/href="\/noteshubatcolumbia\/noteshubatcolumbia\//g, `href="/noteshubatcolumbia/`);
            
            fs.writeFileSync(distIndexPath, fixedIndex);
            console.log('Added hash router script and fixed paths in index.html');
          }
        }
      }
    }
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
}));

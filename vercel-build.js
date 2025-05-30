const fs = require('fs');
const path = require('path');

// Ensure the .vercel/output directory exists
const outputDir = path.join(__dirname, '.vercel', 'output');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Create the config.json file
const configPath = path.join(outputDir, 'config.json');
const config = {
  version: 3,
  routes: [
    {
      handle: "filesystem"
    },
    {
      src: "/(.*)",
      dest: "/index.html"
    }
  ]
};

fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
console.log('Created Vercel config at', configPath);

// Copy index.html to 404.html
const distDir = path.join(__dirname, 'dist');
const indexPath = path.join(distDir, 'index.html');
const notFoundPath = path.join(distDir, '404.html');

if (fs.existsSync(indexPath)) {
  fs.copyFileSync(indexPath, notFoundPath);
  console.log('Copied index.html to 404.html');
} else {
  console.error('Could not find index.html in dist directory');
}
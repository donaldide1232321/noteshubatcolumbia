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
      src: "/browse",
      dest: "/index.html"
    },
    {
      src: "/upload",
      dest: "/index.html"
    },
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
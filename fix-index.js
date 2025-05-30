const fs = require('fs');
const path = require('path');

// Path to docs directory
const docsDir = path.join(__dirname, 'docs');
const indexPath = path.join(docsDir, 'index.html');

// Function to remove browse and upload directories
function removeDirectories() {
  const dirsToRemove = ['browse', 'upload'];
  
  dirsToRemove.forEach(dir => {
    const dirPath = path.join(docsDir, dir);
    if (fs.existsSync(dirPath)) {
      console.log(`Removing ${dir} directory...`);
      fs.rmSync(dirPath, { recursive: true, force: true });
      console.log(`${dir} directory removed.`);
    }
  });
}

// Function to fix paths in index.html
function fixIndexHtml() {
  if (fs.existsSync(indexPath)) {
    console.log('Fixing index.html...');
    
    // Read the file
    let indexContent = fs.readFileSync(indexPath, 'utf8');
    
    // Check if CNAME file exists to determine if we're using a custom domain
    const cnameExists = fs.existsSync(path.join(docsDir, 'CNAME'));
    
    if (cnameExists) {
      // For custom domain, use root-relative paths
      const cname = fs.readFileSync(path.join(docsDir, 'CNAME'), 'utf8').trim();
      console.log(`Custom domain detected: ${cname}`);
      
      // Fix absolute paths for custom domain
      indexContent = indexContent
        .replace(/src="\/noteshubatcolumbia\//g, 'src="/')
        .replace(/href="\/noteshubatcolumbia\//g, 'href="/')
        .replace(/window\.location\.replace\('\/noteshubatcolumbia/g, 'window.location.replace(\'');
    } else {
      // For GitHub Pages, use the subpath
      console.log('Using GitHub Pages subpath');
      
      // Fix absolute paths for GitHub Pages
      indexContent = indexContent
        .replace(/src="\//g, 'src="/noteshubatcolumbia/')
        .replace(/href="\//g, 'href="/noteshubatcolumbia/')
        .replace(/src="\/noteshubatcolumbia\/noteshubatcolumbia\//g, 'src="/noteshubatcolumbia/')
        .replace(/href="\/noteshubatcolumbia\/noteshubatcolumbia\//g, 'href="/noteshubatcolumbia/');
    }
    
    // Write the fixed content back to the file
    fs.writeFileSync(indexPath, indexContent);
    
    console.log('index.html fixed.');
  } else {
    console.log('index.html not found.');
  }
}

// Check if docs directory exists
if (fs.existsSync(docsDir)) {
  console.log('Fixing GitHub Pages deployment...');
  
  // Remove browse and upload directories
  removeDirectories();
  
  // Fix paths in index.html
  fixIndexHtml();
  
  console.log('GitHub Pages deployment fixed.');
} else {
  console.log('Docs directory not found.');
}
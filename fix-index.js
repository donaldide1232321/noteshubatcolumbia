const fs = require('fs');
const path = require('path');


const docsDir = path.join(__dirname, 'docs');
const indexPath = path.join(docsDir, 'index.html');


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


function fixIndexHtml() {
  if (fs.existsSync(indexPath)) {
    console.log('Fixing index.html...');
    
    
    let indexContent = fs.readFileSync(indexPath, 'utf8');
    
    
    const cnameExists = fs.existsSync(path.join(docsDir, 'CNAME'));
    
    if (cnameExists) {
      
      const cname = fs.readFileSync(path.join(docsDir, 'CNAME'), 'utf8').trim();
      console.log(`Custom domain detected: ${cname}`);
      
      
      indexContent = indexContent
        .replace(/src="\/noteshubatcolumbia\//g, 'src="/')
        .replace(/href="\/noteshubatcolumbia\//g, 'href="/')
        .replace(/window\.location\.replace\('\/noteshubatcolumbia/g, 'window.location.replace(\'');
    } else {
      
      console.log('Using GitHub Pages subpath');
      
      
      indexContent = indexContent
        .replace(/src="\//g, 'src="/noteshubatcolumbia/')
        .replace(/href="\//g, 'href="/noteshubatcolumbia/')
        .replace(/src="\/noteshubatcolumbia\/noteshubatcolumbia\//g, 'src="/noteshubatcolumbia/')
        .replace(/href="\/noteshubatcolumbia\/noteshubatcolumbia\//g, 'href="/noteshubatcolumbia/');
    }
    
    
    fs.writeFileSync(indexPath, indexContent);
    
    console.log('index.html fixed.');
  } else {
    console.log('index.html not found.');
  }
}


if (fs.existsSync(docsDir)) {
  console.log('Fixing GitHub Pages deployment...');
  
  
  removeDirectories();
  
  
  fixIndexHtml();
  
  console.log('GitHub Pages deployment fixed.');
} else {
  console.log('Docs directory not found.');
}

// This script helps with hash-based routing for GitHub Pages
// It ensures that direct navigation to routes works correctly and handles page refreshes

(function() {
  // Get the current path and hash
  var path = window.location.pathname;
  var hash = window.location.hash;
  
  // If we have a hash route already, we're good
  if (hash.startsWith('#/')) {
    return;
  }
  
  // Check for specific routes in the path
  if (path.includes('/browse')) {
    window.location.replace('/noteshubatcolumbia/#/browse');
  } else if (path.includes('/upload')) {
    window.location.replace('/noteshubatcolumbia/#/upload');
  }
})();
// This script ensures proper routing on Vercel with HashRouter
(function() {
  // Execute immediately, don't wait for window.onload
  // Check if we're on a direct route
  const path = window.location.pathname;
  
  // If we're on a route that should be handled by the SPA router
  // and we're not already using hash routing
  if ((path === '/browse' || path === '/upload') && !window.location.hash) {
    // Redirect to the hash-based route
    window.location.replace('/#' + path);
  }
})();
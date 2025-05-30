// This script helps with client-side routing on Vercel
(function() {
  // Check if this is a direct navigation to a route
  const path = window.location.pathname;
  
  // If we're on a route that should be handled by the SPA router
  if (path === '/browse' || path === '/upload') {
    // Store the current path in sessionStorage
    sessionStorage.setItem('redirectPath', path);
    
    // Check if we're already on the index page
    if (window.location.href.indexOf('/index.html') === -1) {
      // Redirect to the index page
      window.location.href = '/';
    }
  }
  
  // When the page loads, check if we need to navigate to a specific route
  window.addEventListener('DOMContentLoaded', function() {
    const redirectPath = sessionStorage.getItem('redirectPath');
    if (redirectPath) {
      // Clear the stored path
      sessionStorage.removeItem('redirectPath');
      
      // Use history API to update the URL without reloading
      window.history.replaceState(null, '', redirectPath);
    }
  });
})();
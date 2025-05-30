// This script handles client-side routing for SPAs
(function() {
  // Check if this is a direct navigation to a route
  const path = window.location.pathname;
  const isDirectNavigation = ['/browse', '/upload'].includes(path);
  
  if (isDirectNavigation && !window.location.search.includes('_redirected=true')) {
    // Add a query parameter to prevent infinite redirects
    window.location.href = window.location.pathname + '?_redirected=true';
  }
})();
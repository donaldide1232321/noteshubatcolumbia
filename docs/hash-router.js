
(function() {
  // Get the current path and hash
  var path = window.location.pathname;
  var hash = window.location.hash;
  
  if (hash.startsWith('#/')) {
    return;
  }
  
  if (path.includes('/browse')) {
    window.location.replace('/noteshubatcolumbia/#/browse');
  } else if (path.includes('/upload')) {
    window.location.replace('/noteshubatcolumbia/#/upload');
  }
})();

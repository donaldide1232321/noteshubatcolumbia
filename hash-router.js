
(function() {
  // get current path and hash
  var path = window.location.pathname;
  var hash = window.location.hash;
  
  // if we have a hash route already, we good
  if (hash.startsWith('#/')) {
    return;
  }
  
  // check for specific routes in the path
  if (path.includes('/browse')) {
    window.location.replace('/noteshubatcolumbia/#/browse');
  } else if (path.includes('/upload')) {
    window.location.replace('/noteshubatcolumbia/#/upload');
  }
})();

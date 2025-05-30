module.exports = {
  rewrites: [
    { source: '/browse', destination: '/index.html' },
    { source: '/upload', destination: '/index.html' },
    { source: '/(.*)', destination: '/index.html' }
  ],
  cleanUrls: true,
  trailingSlash: false
};
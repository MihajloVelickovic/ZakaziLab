const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/msLogin',
    createProxyMiddleware({
      target: 'http://localhost:1738',
      changeOrigin: true,
      secure: false,
    })
  );
};
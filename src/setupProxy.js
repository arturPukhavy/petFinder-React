const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api/v1', // Proxy all requests starting with /api/v1
    createProxyMiddleware({
      target: 'http://localhost:3000/api/v1', // Backend server
      changeOrigin: true, // Adjust the origin header to match the target
      logLevel: 'debug', // Add logging to debug requests
    })
  );
};
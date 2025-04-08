const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { createProxyMiddleware } = require('http-proxy-middleware');

const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);

// Initialize Next.js
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  console.log('Next.js app prepared');
  console.log('API_URL:', process.env.API_URL);

  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      const { pathname } = parsedUrl;

      console.log(`Request: ${req.method} ${pathname}`);

      // Handle API routes - proxy them to backend
      if (pathname.startsWith('/api/')) {
        console.log(`Proxying request to: ${process.env.API_URL}${pathname}`);

        // Create proxy on-demand
        const apiProxy = createProxyMiddleware({
          target: process.env.API_URL,
          changeOrigin: true,
          pathRewrite: { '^/api': '/api' },
          logLevel: 'debug',
        });

        return apiProxy(req, res, () => {
          // This is the fallback if proxy doesn't handle the request
          handle(req, res, parsedUrl);
        });
      }

      // Let Next.js handle all other routes
      return handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling request:', err);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});

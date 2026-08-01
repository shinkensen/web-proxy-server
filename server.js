const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const DOMAIN = process.env.DOMAIN || 'proxy.dev7.xyz';

// Security middleware with relaxed CSP for proxy functionality
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Enable CORS
app.use(cors());

// Compression
app.use(compression());

// Serve static files (frontend)
app.use(express.static(path.join(__dirname, 'public')));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', domain: DOMAIN, timestamp: new Date().toISOString() });
});

// Proxy endpoint - handles the actual proxying
app.use('/proxy', createProxyMiddleware({
  router: (req) => {
    // Extract target URL from query parameter or path
    const targetUrl = req.query.url || req.headers['x-proxy-url'];
    if (!targetUrl) {
      return 'http://example.com'; // fallback
    }
    
    try {
      const url = new URL(targetUrl);
      return `${url.protocol}//${url.host}`;
    } catch (e) {
      return 'http://example.com';
    }
  },
  changeOrigin: true,
  secure: false,
  followRedirects: true,
  pathRewrite: (path, req) => {
    const targetUrl = req.query.url || req.headers['x-proxy-url'];
    if (!targetUrl) return path;
    
    try {
      const url = new URL(targetUrl);
      return url.pathname + url.search + url.hash;
    } catch (e) {
      return path;
    }
  },
  onProxyReq: (proxyReq, req, res) => {
    // Remove problematic headers
    proxyReq.removeHeader('x-proxy-url');
    
    // Set proper user agent
    proxyReq.setHeader('User-Agent', req.headers['user-agent'] || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
  },
  onProxyRes: (proxyRes, req, res) => {
    // Modify response headers for CORS
    proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
    proxyRes.headers['Access-Control-Allow-Headers'] = '*';
    
    // Remove CSP headers that might block proxy functionality
    delete proxyRes.headers['content-security-policy'];
    delete proxyRes.headers['x-frame-options'];
  },
  onError: (err, req, res) => {
    console.error('Proxy error:', err.message);
    res.status(500).json({
      error: 'Proxy error',
      message: err.message
    });
  }
}));

// API endpoint to fetch proxied content
app.get('/api/fetch', async (req, res) => {
  const targetUrl = req.query.url;
  
  if (!targetUrl) {
    return res.status(400).json({ error: 'URL parameter is required' });
  }
  
  try {
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    const contentType = response.headers.get('content-type');
    const body = await response.text();
    
    res.set('Content-Type', contentType);
    res.send(body);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Catch all - serve index.html for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server - bind to 0.0.0.0 to accept external connections
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Proxy server running on port ${PORT}`);
  console.log(`🌐 Domain: ${DOMAIN}`);
  console.log(`📡 Proxy endpoint: http://localhost:${PORT}/proxy`);
  console.log(`💻 Frontend: http://localhost:${PORT}`);
  console.log(`🌍 Accessible at: http://${DOMAIN}:${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

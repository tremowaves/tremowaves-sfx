const express = require('express');
const compression = require('compression');
const expressStaticGzip = require('express-static-gzip');
const path = require('path');
const app = express();

// Server Configuration
const SERVER_CONFIG = {
  hostname: process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost',
  port: process.env.PORT || 3000,
  isProduction: process.env.NODE_ENV === 'production'
};

// Trust proxy - important for HTTPS behind Apache 2.4.63
app.enable('trust proxy');

// Force HTTPS in production
if (SERVER_CONFIG.isProduction) {
  app.use((req, res, next) => {
    if (req.secure) {
      next();
    } else {
      res.redirect('https://' + req.headers.host + req.url);
    }
  });
}

// Enable compression - running on x86_64 architecture
app.use(compression());

// Security headers for Stellar18 hosting
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Base path for production
const BASE_PATH = process.env.NODE_ENV === 'production' ? '/app/sfxman' : '';

// Serve static files from root directory with caching
app.use(BASE_PATH, express.static(__dirname, {
  maxAge: '1y',
  etag: true
}));

// Serve compressed files from dist directory
app.use(BASE_PATH + '/dist', expressStaticGzip('dist', {
  enableBrotli: true,
  orderPreference: ['br', 'gz'],
  serveStatic: {
    maxAge: '1y',
    etag: true
  }
}));

// Main routes
app.get([
  '/',
  '/sfxman',
  '/sfxman/*',
  '/app/sfxman',
  '/app/sfxman/*'
], (req, res) => {
  // Log the request path for debugging
  console.log('Request path:', req.path);
  console.log('Base URL:', req.baseUrl);
  console.log('Original URL:', req.originalUrl);
  
  res.sendFile(path.join(__dirname, 'index.html'));
});

// API routes if any
app.get(BASE_PATH + '/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    env: process.env.NODE_ENV,
    base_path: BASE_PATH
  });
});

// Cache control headers
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'public, max-age=31536000');
  next();
});

// Error handling
app.use((err, req, res, next) => {
  console.error(`Error on ${req.method} ${req.path}: ${err.stack}`);
  res.status(500).send('Internal Server Error');
});

// Handle 404
app.use((req, res) => {
  console.log('404 for path:', req.path);
  res.status(404).sendFile(path.join(__dirname, '404.html'));
});

// Start server
app.listen(SERVER_CONFIG.port, SERVER_CONFIG.hostname, () => {
  console.log(`Server Information:`);
  console.log(`- Environment: ${process.env.NODE_ENV}`);
  console.log(`- Host: ${SERVER_CONFIG.hostname}`);
  console.log(`- Port: ${SERVER_CONFIG.port}`);
  console.log(`- Base Path: ${BASE_PATH}`);
  console.log(`- Full URL: http${process.env.NODE_ENV === 'production' ? 's' : ''}://${SERVER_CONFIG.hostname}:${SERVER_CONFIG.port}${BASE_PATH}`);
  console.log(`- Apache Version: 2.4.63`);
  console.log(`- Architecture: x86_64`);
  console.log(`- OS: Linux`);
}); 
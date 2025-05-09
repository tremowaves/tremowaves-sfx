const express = require('express');
const compression = require('compression');
const expressStaticGzip = require('express-static-gzip');
const path = require('path');
const app = express();

// Server Configuration
const SERVER_CONFIG = {
  hostname: process.env.NODE_ENV === 'production' ? '198.54.115.78' : 'localhost',
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

// Serve static files from root directory
app.use(express.static(__dirname));

// Serve compressed files from dist directory
app.use('/dist', expressStaticGzip('dist', {
  enableBrotli: true,
  orderPreference: ['br', 'gz'],
  serveStatic: {
    maxAge: '1y',
    etag: true
  }
}));

// Serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Cache control headers
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'public, max-age=31536000');
  next();
});

// Error handling with server info
app.use((err, req, res, next) => {
  console.error(`Error on server201 (Stellar18): ${err.stack}`);
  res.status(500).send('Internal Server Error');
});

// Start server
app.listen(SERVER_CONFIG.port, SERVER_CONFIG.hostname, () => {
  console.log(`Server Information:`);
  console.log(`- Environment: ${process.env.NODE_ENV}`);
  console.log(`- Host: ${SERVER_CONFIG.hostname}`);
  console.log(`- Port: ${SERVER_CONFIG.port}`);
  console.log(`- Apache Version: 2.4.63`);
  console.log(`- Architecture: x86_64`);
  console.log(`- OS: Linux`);
}); 
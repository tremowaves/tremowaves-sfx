const express = require('express');
const compression = require('compression');
const expressStaticGzip = require('express-static-gzip');
const path = require('path');

const app = express();

// Trust proxy - important for HTTPS
app.enable('trust proxy');

// Force HTTPS in production
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.secure) {
      next();
    } else {
      res.redirect('https://' + req.headers.host + req.url);
    }
  });
}

// Use the port provided by Namecheap environment
const PORT = process.env.PORT || 4000;

// Set production mode
process.env.NODE_ENV = 'production';

// Enable compression
app.use(compression());

// Serve static files from root directory with caching
app.use(express.static(path.join(__dirname), {
  maxAge: '1y',
  etag: true
}));

// Serve compressed files from dist directory
app.use('/dist', expressStaticGzip(path.join(__dirname, 'dist'), {
  enableBrotli: true,
  orderPreference: ['br', 'gz'],
  serveStatic: {
    maxAge: '1y',
    etag: true
  }
}));

// Cache control headers
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'public, max-age=31536000');
  next();
});

// Main route - should be after static files
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling
app.use((err, req, res, next) => {
  console.error(`Error on ${req.method} ${req.path}: ${err.stack}`);
  res.status(500).send('Internal Server Error');
});

// Log when server starts
const hostname = process.env.NODE_ENV === 'production' ? '0.0.0.0' : '127.0.0.1';
app.listen(PORT, hostname, () => {
  console.log('\nServer Information:');
  console.log(`- Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`- Host: ${hostname}`);
  console.log(`- Port: ${PORT}`);
  if (process.env.NODE_ENV === 'production') {
    console.log(`- Production URL: https://tremowaves.com/app/sfxman`);
  } else {
    console.log(`- Local URL: http://${hostname}:${PORT}`);
  }
}); 
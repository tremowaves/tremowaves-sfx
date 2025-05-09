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
    if (req.secure || req.headers['x-forwarded-proto'] === 'https') {
      next();
    } else {
      res.redirect('https://' + req.headers.host + req.url);
    }
  });
}

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

// Start server
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '127.0.0.1';

app.listen(PORT, HOST, () => {
  console.log('\nServer Information:');
  console.log(`- Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`- Host: ${HOST}`);
  console.log(`- Port: ${PORT}`);
  if (process.env.NODE_ENV === 'production') {
    console.log(`- Production URL: https://tremowaves.com/app/sfxman`);
  } else {
    console.log(`- Local URL: http://${HOST}:${PORT}`);
  }
}); 
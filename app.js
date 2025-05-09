const express = require('express');
const compression = require('compression');
const expressStaticGzip = require('express-static-gzip');
const path = require('path');
const app = express();

// Trust proxy - important for HTTPS behind Apache
app.enable('trust proxy');

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

// Main route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling
app.use((err, req, res, next) => {
  console.error(`Error on ${req.method} ${req.path}: ${err.stack}`);
  res.status(500).send('Internal Server Error');
});

// Start server
const port = process.env.PORT || 3000;
const hostname = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';

app.listen(port, hostname, () => {
  console.log(`Server Information:`);
  console.log(`- Environment: ${process.env.NODE_ENV}`);
  console.log(`- Host: ${hostname}`);
  console.log(`- Port: ${port}`);
  console.log(`- URL: https://tremowaves.com/app/sfxman`);
});
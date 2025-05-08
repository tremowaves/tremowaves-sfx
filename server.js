const express = require('express');
const compression = require('compression');
const expressStaticGzip = require('express-static-gzip');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable compression
app.use(compression());

// Serve static files with gzip compression
app.use(expressStaticGzip('dist', {
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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 
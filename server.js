const express = require('express');
const compression = require('compression');
const expressStaticGzip = require('express-static-gzip');
const path = require('path');

const app = express();

// Trust proxy - important for HTTPS
app.enable('trust proxy');

// Force HTTPS
app.use((req, res, next) => {
  if (req.secure) {
    next();
  } else {
    res.redirect('https://' + req.headers.host + req.url);
  }
});

const PORT = process.env.PORT || 4000;

// Enable compression
app.use(compression());

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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Access your app at https://tremowaves.com/our-app/sfxman`);
});
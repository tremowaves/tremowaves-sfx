const express = require('express');
const compression = require('compression');
const expressStaticGzip = require('express-static-gzip');
const path = require('path');
const rateLimit = require('express-rate-limit');

// Environment configuration with fallbacks
const config = {
  port: process.env.PORT || 3000,
  host: process.env.HOST || '127.0.0.1',
  env: process.env.NODE_ENV || 'development',
  trustProxy: process.env.TRUST_PROXY === 'true',
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
  rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  cacheDuration: process.env.CACHE_DURATION || '31536000',
  productionUrl: process.env.PRODUCTION_URL || 'https://tremowaves.com/app/sfxman'
};

const app = express();

// Trust proxy configuration
if (config.trustProxy) {
  app.enable('trust proxy');
}

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMax,
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Force HTTPS in production
if (config.env === 'production') {
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
  maxAge: config.cacheDuration,
  etag: true
}));

// Serve compressed files from dist directory
app.use('/dist', expressStaticGzip(path.join(__dirname, 'dist'), {
  enableBrotli: true,
  orderPreference: ['br', 'gz'],
  serveStatic: {
    maxAge: config.cacheDuration,
    etag: true
  }
}));

// Cache control headers
app.use((req, res, next) => {
  res.setHeader('Cache-Control', `public, max-age=${config.cacheDuration}`);
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
app.listen(config.port, config.host, () => {
  console.log('\nServer Information:');
  console.log(`- Environment: ${config.env}`);
  console.log(`- Host: ${config.host}`);
  console.log(`- Port: ${config.port}`);
  if (config.env === 'production') {
    console.log(`- Production URL: ${config.productionUrl}`);
  } else {
    console.log(`- Local URL: http://${config.host}:${config.port}`);
  }
});

// Export the app for Passenger
module.exports = app; 
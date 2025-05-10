const cache = (duration) => {
  return (req, res, next) => {
    // Skip caching for non-GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Set cache headers
    res.setHeader('Cache-Control', `public, max-age=${duration}`);
    res.setHeader('Expires', new Date(Date.now() + duration * 1000).toUTCString());
    res.setHeader('Vary', 'Accept-Encoding');

    next();
  };
};

module.exports = cache; 
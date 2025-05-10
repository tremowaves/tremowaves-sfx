const express = require('express');
const router = express.Router();
const path = require('path');

// Serve the main application
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

// API routes
router.get('/api/presets', (req, res) => {
  // TODO: Implement preset listing
  res.json({ presets: [] });
});

router.post('/api/generate', (req, res) => {
  // TODO: Implement sound generation
  res.json({ success: true });
});

// Error handling
router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

module.exports = router; 
# Tremowaves SFX Generator

A powerful 8-bit sound effects generator based on sfxr, allowing you to create retro-style sound effects for games and applications.

## Features

- Generate 8-bit style sound effects
- Multiple sound presets
- Real-time sound generation
- Export to WAV format
- RESTful API for integration
- Modern web interface

## Installation

```bash
# Clone the repository
git clone https://github.com/tremowaves/tremowaves-sfx.git
cd tremowaves-sfx

# Install dependencies
npm install

# Set up environment
npm run setup
```

## Development

```bash
# Start development server
npm run serve

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Lint code
npm run lint

# Build for production
npm run build
```

## API Documentation

### Endpoints

#### GET /api/presets
Returns a list of available sound presets.

#### POST /api/generate
Generates a new sound effect based on provided parameters.

Request body:
```json
{
  "waveType": "square",
  "frequency": 440,
  "attackTime": 0.1,
  "sustainTime": 0.2,
  "sustainPunch": 0.3,
  "decayTime": 0.4
}
```

## Environment Variables

- `PORT` - Server port (default: 3000)
- `HOST` - Server host (default: 127.0.0.1)
- `NODE_ENV` - Environment (development/production)
- `TRUST_PROXY` - Enable trust proxy (default: false)
- `RATE_LIMIT_WINDOW_MS` - Rate limit window (default: 900000)
- `RATE_LIMIT_MAX_REQUESTS` - Max requests per window (default: 100)
- `CACHE_DURATION` - Cache duration in seconds (default: 31536000)

## Project Structure

```
tremowaves-sfx/
├── app.js              # Main application file
├── middleware/         # Express middleware
├── routes/            # API routes
├── public/            # Static files
├── dist/              # Built files
├── tests/             # Test files
└── package.json       # Project configuration
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue in the GitHub repository or contact us at support@tremowaves.com.

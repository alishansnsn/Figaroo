# Figaroo Backend API

Backend server for the Figaroo AI-powered UI Component Generator.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
# Install dependencies
npm install

# Copy environment variables
cp env.example .env

# Edit .env with your configuration
# Add your OpenRouter API key
```

### Development
```bash
# Start development server
npm run dev

# Server will run on http://localhost:5000
```

### Production
```bash
# Build the project
npm run build

# Start production server
npm start
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── controllers/     # Request handlers
│   ├── services/        # Business logic
│   ├── middleware/      # Express middleware
│   ├── routes/          # API routes
│   └── utils/           # Utility functions
├── dist/                # Compiled JavaScript
├── package.json
├── tsconfig.json
└── nodemon.json
```

## 🔧 Environment Variables

Create a `.env` file with:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# OpenRouter API Configuration
OPENROUTER_API_KEY=your_openrouter_api_key_here
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Security
JWT_SECRET=your_jwt_secret_here
```

## 📡 API Endpoints

### Health Check
- `GET /health` - Server health status

### AI Component Generation
- `POST /api/ai/generate-component` - Generate component from prompt
- `GET /api/ai/models` - Get available AI models

### Components (Placeholder)
- `GET /api/components` - Get all components
- `POST /api/components` - Create component
- `PUT /api/components/:id` - Update component
- `DELETE /api/components/:id` - Delete component

## 🔒 Security Features

- **Helmet.js** - Security headers
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - API request throttling
- **Input Validation** - Request data validation
- **Error Handling** - Centralized error management

## 🛠️ Development

### Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start production server
- `npm run clean` - Remove compiled files

### Adding New Routes
1. Create controller in `src/controllers/`
2. Create route file in `src/routes/`
3. Import and use in `src/server.ts`

## 🔄 Next Steps

1. **Database Integration** - Add Supabase/PostgreSQL
2. **Authentication** - Implement user management
3. **File Storage** - Add component export/import
4. **Real-time Features** - WebSocket integration
5. **Monitoring** - Add logging and metrics 
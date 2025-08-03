#!/bin/bash

echo "🚀 Setting up Lumen Hackathon Environment..."

# Check if Node 20 is being used
NODE_VERSION=$(node --version)
echo "📦 Node version: $NODE_VERSION"

if [[ ! $NODE_VERSION =~ ^v20 ]]; then
    echo "⚠️  Warning: Node 20 is recommended. Current version: $NODE_VERSION"
    echo "💡 Run 'nvm use 20' to switch to Node 20"
fi

# Create backend .env file if it doesn't exist
if [ ! -f "backend/.env" ]; then
    echo "📝 Creating backend .env file..."
    cat > backend/.env << EOF
# Server Configuration
PORT=5001
NODE_ENV=development

# Hackathon Mode Configuration
HACKATHON_MODE=true

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/lumen-hackathon

# JWT Configuration
JWT_SECRET=hackathon-jwt-secret-key
JWT_EXPIRES_IN=7d

# Clerk Configuration
CLERK_SECRET_KEY=sk_test_your-clerk-secret-key
CLERK_PUBLISHABLE_KEY=pk_test_your-clerk-publishable-key

# Google AI Configuration
GOOGLE_AI_API_KEY=your-google-ai-api-key

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS Configuration
CORS_ORIGIN=http://localhost:5173

# Logging
LOG_LEVEL=info
EOF
    echo "✅ Backend .env file created"
else
    echo "✅ Backend .env file already exists"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install
cd backend && npm install && cd ..

# Build backend
echo "🔨 Building backend..."
cd backend && npm run build && cd ..

echo "✅ Setup complete!"
echo ""
echo "🎯 To start the application:"
echo "   npm run dev"
echo ""
echo "📊 This will start:"
echo "   - Frontend: http://localhost:5173"
echo "   - Backend:  http://localhost:5001"
echo ""
echo "🔍 Health checks:"
echo "   - Frontend: http://localhost:5173"
echo "   - Backend:  http://localhost:5001/health"
echo "   - API:      http://localhost:5001/api/health"
echo ""
echo "💡 The backend will run in hackathon mode with mock data"
echo "💡 No MongoDB connection required for hackathon demo" 
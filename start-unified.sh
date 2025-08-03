#!/bin/bash

# Lumen Unified Development Server Startup Script

echo "🚀 Starting Lumen Unified Development Environment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 20 or higher."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo "❌ Node.js version 20 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  No .env file found. Creating from template..."
    cp env.example .env
    echo "📝 Please edit .env file with your configuration before continuing."
    echo "   Required: MONGODB_URI, GOOGLE_AI_API_KEY, CLERK_SECRET_KEY"
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Install backend dependencies if needed
if [ ! -d "backend/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd backend && npm install && cd ..
fi

# Build backend TypeScript
echo "🔨 Building backend TypeScript..."
cd backend && npm run build && cd ..

echo "🎯 Starting unified development server..."
echo "   - Frontend (Vite): http://localhost:5173"
echo "   - Unified Server: http://localhost:3000"
echo "   - API: http://localhost:3000/api"
echo "   - Health Check: http://localhost:3000/health"
echo ""
echo "Press Ctrl+C to stop all servers"

# Start the unified development environment
npm run dev 
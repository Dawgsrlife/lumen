#!/bin/bash

# Lumen Full Stack Startup Script
# This script starts both the frontend and backend servers with Node 20

echo "🚀 Starting Lumen Full Stack Application..."
echo "=========================================="

# Function to cleanup background processes on exit
cleanup() {
    echo -e "\n🛑 Shutting down servers..."
    kill $FRONTEND_PID $BACKEND_PID 2>/dev/null
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Source nvm if it exists
if [ -s "$HOME/.nvm/nvm.sh" ]; then
    source "$HOME/.nvm/nvm.sh"
elif [ -s "/usr/local/nvm/nvm.sh" ]; then
    source "/usr/local/nvm/nvm.sh"
fi

# Ensure Node 20 is used for this project
echo "📦 Checking Node version..."
CURRENT_NODE=$(node --version 2>/dev/null || echo "unknown")
REQUIRED_NODE="v20"

if [[ ! $CURRENT_NODE == $REQUIRED_NODE* ]]; then
    echo "❌ Wrong Node version detected: $CURRENT_NODE"
    echo "🔧 Attempting to switch to Node 20..."
    
    # Check if nvm is available
    if command -v nvm &> /dev/null; then
        nvm use 20
        if [ $? -ne 0 ]; then
            echo "❌ Failed to switch to Node 20. Please run: nvm install 20 && nvm use 20"
            exit 1
        fi
    else
        echo "❌ nvm not found. Please install nvm or switch to Node 20 manually"
        echo "💡 You can install nvm with: curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash"
        echo "💡 Or manually switch to Node 20 and run this script again"
        exit 1
    fi
fi

echo "✅ Using Node version: $(node --version)"

# Start Backend Server
echo -e "\n🔧 Starting Backend Server..."
cd backend

# Ensure backend uses Node 20
if [ -f .nvmrc ]; then
    echo "📦 Backend .nvmrc found, ensuring correct Node version..."
    nvm use 20 2>/dev/null || echo "⚠️ Could not switch Node version, continuing..."
fi

npm run build
node dist/server.js &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Check if backend is running
if curl -s http://localhost:5001/health > /dev/null; then
    echo "✅ Backend server is running on http://localhost:5001"
else
    echo "❌ Backend server failed to start"
    exit 1
fi

# Start Frontend Server
echo -e "\n🎨 Starting Frontend Server..."

# Ensure frontend uses Node 20
if [ -f .nvmrc ]; then
    echo "📦 Frontend .nvmrc found, ensuring correct Node version..."
    nvm use 20 2>/dev/null || echo "⚠️ Could not switch Node version, continuing..."
fi

npm run dev &
FRONTEND_PID=$!

# Wait a moment for frontend to start
sleep 5

# Check if frontend is running
if curl -s http://localhost:5173 > /dev/null 2>&1; then
    echo "✅ Frontend server is running on http://localhost:5173"
elif curl -s http://localhost:5174 > /dev/null 2>&1; then
    echo "✅ Frontend server is running on http://localhost:5174"
else
    echo "❌ Frontend server failed to start"
    exit 1
fi

echo -e "\n🎉 Both servers are running!"
echo "=========================================="
echo "🌐 Frontend: http://localhost:5173 (or 5174)"
echo "🔧 Backend:  http://localhost:5001"
echo "📊 Health:   http://localhost:5001/health"
echo "🎙️ Voice Chat: ws://localhost:5001/ws/voice-chat"
echo -e "\n💡 Press Ctrl+C to stop both servers"
echo "=========================================="

# Keep script running
wait 
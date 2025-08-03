#!/bin/bash

# Simple Lumen Startup Script (No nvm required)
# This script starts both servers without Node version checking

echo "🚀 Starting Lumen Full Stack Application (Simple Mode)..."
echo "=========================================="

# Function to cleanup background processes on exit
cleanup() {
    echo -e "\n🛑 Shutting down servers..."
    kill $FRONTEND_PID $BACKEND_PID 2>/dev/null
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

echo "📦 Current Node version: $(node --version)"

# Start Backend Server
echo -e "\n🔧 Starting Backend Server..."
cd backend
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
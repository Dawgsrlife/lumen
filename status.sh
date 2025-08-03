#!/bin/bash

echo "🚀 Lumen Unified Development Environment Status"
echo "================================================"

# Check if servers are running
echo "📊 Server Status:"
if lsof -i :3000 > /dev/null 2>&1; then
    echo "✅ Unified Server: Running on port 3000"
else
    echo "❌ Unified Server: Not running"
fi

if lsof -i :5173 > /dev/null 2>&1; then
    echo "✅ Vite Dev Server: Running on port 5173"
else
    echo "❌ Vite Dev Server: Not running"
fi

echo ""

# Test API endpoints
echo "🔧 API Endpoints:"
if curl -s http://127.0.0.1:3000/health > /dev/null 2>&1; then
    echo "✅ Health Check: Working"
else
    echo "❌ Health Check: Failed"
fi

if curl -s http://127.0.0.1:3000/api/emotions > /dev/null 2>&1; then
    echo "✅ Emotions API: Working (requires auth)"
else
    echo "❌ Emotions API: Failed"
fi

echo ""

# Test frontend
echo "🌐 Frontend Access:"
if curl -s http://127.0.0.1:3000/ | grep -q "html"; then
    echo "✅ Unified Frontend: Working (proxied to Vite)"
else
    echo "❌ Unified Frontend: Failed"
fi

if curl -s http://127.0.0.1:5173/ | grep -q "html"; then
    echo "✅ Direct Vite: Working"
else
    echo "❌ Direct Vite: Failed"
fi

echo ""
echo "🎯 Access URLs:"
echo "   Frontend: http://localhost:3000"
echo "   API: http://localhost:3000/api"
echo "   Health: http://localhost:3000/health"
echo "   Vite Direct: http://localhost:5173"
echo ""
echo "💡 To start servers: npm run dev"
echo "💡 To test setup: npm run test:unified" 
#!/bin/bash

BACKEND_URL="http://localhost:5001"
FRONTEND_URL="http://localhost:5173"

echo "🧪 Testing Lumen Hackathon Setup..."
echo ""

# Test backend health
echo "Testing Backend Health Check..."
if curl -s "$BACKEND_URL/health" | grep -q '"success":true'; then
    echo "✅ Backend Health Check: SUCCESS"
else
    echo "❌ Backend Health Check: FAILED"
fi

# Test API health
echo "Testing API Health Check..."
if curl -s "$BACKEND_URL/api/health" | grep -q '"success":true'; then
    echo "✅ API Health Check: SUCCESS"
else
    echo "❌ API Health Check: FAILED"
fi

# Test frontend
echo "Testing Frontend Server..."
if curl -s "$FRONTEND_URL" | grep -q "html"; then
    echo "✅ Frontend Server: SUCCESS"
else
    echo "❌ Frontend Server: FAILED"
fi

# Test emotions API with auth
echo "Testing Emotions API with Auth..."
if curl -s -H "Authorization: Bearer demo123" "$BACKEND_URL/api/emotions" | grep -q '"success":true'; then
    echo "✅ Emotions API with Auth: SUCCESS"
else
    echo "❌ Emotions API with Auth: FAILED"
fi

echo ""
echo "📊 Test Summary:"
echo "   Backend:  $BACKEND_URL"
echo "   Frontend: $FRONTEND_URL"
echo ""
echo "🔧 Manual Testing:"
echo "   curl $BACKEND_URL/health"
echo "   curl -H \"Authorization: Bearer demo123\" $BACKEND_URL/api/emotions"
echo "   open $FRONTEND_URL" 
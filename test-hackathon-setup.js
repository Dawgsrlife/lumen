#!/usr/bin/env node

import fetch from 'node-fetch';

const BACKEND_URL = 'http://localhost:5001';
const FRONTEND_URL = 'http://localhost:5173';

async function testEndpoint(url, description) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(`✅ ${description}: ${response.status} - ${data.success ? 'SUCCESS' : 'FAILED'}`);
    return true;
  } catch (error) {
    console.log(`❌ ${description}: ${error.message}`);
    return false;
  }
}

async function testAPIWithAuth() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/emotions`, {
      headers: {
        'Authorization': 'Bearer demo123'
      }
    });
    const data = await response.json();
    console.log(`✅ Emotions API with auth: ${response.status} - ${data.success ? 'SUCCESS' : 'FAILED'}`);
    return true;
  } catch (error) {
    console.log(`❌ Emotions API with auth: ${error.message}`);
    return false;
  }
}

async function runTests() {
  console.log('🧪 Testing Lumen Hackathon Setup...\n');

  const tests = [
    testEndpoint(`${BACKEND_URL}/health`, 'Backend Health Check'),
    testEndpoint(`${BACKEND_URL}/api/health`, 'API Health Check'),
    testEndpoint(`${FRONTEND_URL}`, 'Frontend Server'),
    testAPIWithAuth()
  ];

  const results = await Promise.all(tests);
  const passed = results.filter(Boolean).length;
  const total = results.length;

  console.log(`\n📊 Test Results: ${passed}/${total} passed`);
  
  if (passed === total) {
    console.log('🎉 All tests passed! Hackathon setup is working correctly.');
    console.log('\n🌐 Access your application:');
    console.log(`   Frontend: ${FRONTEND_URL}`);
    console.log(`   Backend:  ${BACKEND_URL}`);
    console.log('\n🔧 Test API endpoints:');
    console.log(`   curl ${BACKEND_URL}/health`);
    console.log(`   curl -H "Authorization: Bearer demo123" ${BACKEND_URL}/api/emotions`);
  } else {
    console.log('⚠️  Some tests failed. Check the logs above.');
  }
}

runTests().catch(console.error); 
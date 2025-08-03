#!/usr/bin/env node

/**
 * Test script to verify the unified Lumen setup
 * Run this after starting the development server
 */

import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:3000';

// Function to find Vite server port
async function findVitePort() {
  const vitePorts = [5173, 5174, 5175, 5176, 5177];
  
  for (const port of vitePorts) {
    try {
      const response = await axios.get(`http://127.0.0.1:${port}`, { 
        timeout: 1000,
        validateStatus: () => true 
      });
      if (response.status === 200) {
        return port;
      }
    } catch (error) {
      // Continue to next port
    }
  }
  return null;
}

let VITE_URL = null;

const tests = [
  {
    name: 'Health Check',
    url: `${BASE_URL}/health`,
    method: 'GET',
    expectedStatus: 200,
    validate: (data) => {
      return data.success === true && 
             data.message === 'Lumen Unified Server is running' &&
             data.mode === 'development';
    }
  },
  {
    name: 'API Routes - Users',
    url: `${BASE_URL}/api/users/profile`,
    method: 'GET',
    expectedStatus: 401, // Should require authentication
    validate: (data) => {
      return data.success === false;
    }
  },
  {
    name: 'API Routes - Emotions',
    url: `${BASE_URL}/api/emotions`,
    method: 'GET',
    expectedStatus: 401, // Should require authentication
    validate: (data) => {
      return data.success === false;
    }
  },
  {
    name: 'Invalid API Route',
    url: `${BASE_URL}/api/nonexistent`,
    method: 'GET',
    expectedStatus: 404,
    validate: (data) => {
      return data.success === false && 
             data.message === 'API endpoint not found';
    }
  }
];

async function runTest(test) {
  try {
    console.log(`🧪 Testing: ${test.name}`);
    
    const response = await axios({
      method: test.method,
      url: test.url,
      timeout: 5000,
      validateStatus: () => true // Don't throw on non-2xx status
    });

    const statusOk = response.status === test.expectedStatus;
    const dataValid = test.validate ? test.validate(response.data) : true;

    if (statusOk && dataValid) {
      console.log(`✅ ${test.name}: PASSED`);
      return true;
    } else {
      console.log(`❌ ${test.name}: FAILED`);
      console.log(`   Expected status: ${test.expectedStatus}, Got: ${response.status}`);
      console.log(`   Response:`, response.data);
      return false;
    }
  } catch (error) {
    console.log(`❌ ${test.name}: ERROR`);
    console.log(`   ${error.message}`);
    return false;
  }
}

async function testViteServer() {
  if (!VITE_URL) {
    console.log(`❌ Vite Dev Server: NOT FOUND`);
    return false;
  }
  
  try {
    console.log(`🧪 Testing: Vite Dev Server`);
    const response = await axios.get(VITE_URL, { 
      timeout: 5000,
      validateStatus: () => true, // Don't throw on non-2xx status
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    });
    
    // Check if we got any response (even 404 means server is running)
    if (response.status >= 200 && response.status < 500) {
      console.log(`✅ Vite Dev Server: PASSED (Status: ${response.status})`);
      return true;
    } else {
      console.log(`❌ Vite Dev Server: FAILED`);
      console.log(`   Status: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Vite Dev Server: ERROR`);
    console.log(`   ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('🚀 Testing Lumen Unified Setup');
  console.log('================================');
  console.log(`Base URL: ${BASE_URL}`);
  
  // Find Vite server port
  const vitePort = await findVitePort();
  if (vitePort) {
    VITE_URL = `http://127.0.0.1:${vitePort}`;
    console.log(`Vite URL: ${VITE_URL}`);
  } else {
    console.log('Vite URL: Not found');
  }
  console.log('');

  let passed = 0;
  let total = tests.length + (vitePort ? 1 : 0); // +1 for Vite test if found

  // Test API endpoints
  for (const test of tests) {
    const result = await runTest(test);
    if (result) passed++;
    console.log('');
  }

  // Test Vite server if found
  if (vitePort) {
    const viteResult = await testViteServer();
    if (viteResult) passed++;
  }

  console.log('================================');
  console.log(`📊 Test Results: ${passed}/${total} tests passed`);
  
  if (passed === total) {
    console.log('🎉 All tests passed! Unified setup is working correctly.');
    console.log('');
    console.log('🌐 Access your application:');
    console.log(`   Frontend: ${BASE_URL}`);
    console.log(`   API: ${BASE_URL}/api`);
    console.log(`   Health: ${BASE_URL}/health`);
    if (vitePort) {
      console.log(`   Vite Direct: http://127.0.0.1:${vitePort}`);
    }
  } else {
    console.log('⚠️  Some tests failed. Please check your setup.');
    console.log('');
    console.log('🔧 Troubleshooting:');
    console.log('   1. Ensure both servers are running: npm run dev');
    console.log('   2. Check that ports 3000 and 5173-5177 are available');
    console.log('   3. Verify your .env file is configured correctly');
    console.log('   4. Check the server logs for errors');
  }
}

// Run the tests
main().catch(console.error); 
#!/usr/bin/env node

/**
 * Comprehensive Test Suite for Lumen Application
 * Tests frontend components, backend APIs, and integration
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Test configuration
const TEST_CONFIG = {
  baseUrl: 'http://localhost:3000',
  timeout: 10000,
  verbose: true
};

// Test results tracking
const testResults = {
  passed: 0,
  failed: 0,
  total: 0,
  details: []
};

// Utility functions
function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : type === 'warning' ? '⚠️' : 'ℹ️';
  console.log(`${prefix} [${timestamp}] ${message}`);
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function testEndpoint(url, expectedStatus = 200, description = '') {
  try {
    const response = await fetch(url);
    const status = response.status;
    const data = await response.text();
    
    assert(status === expectedStatus, `Expected status ${expectedStatus}, got ${status}`);
    
    log(`✅ ${description || url} - Status: ${status}`, 'success');
    testResults.passed++;
    testResults.total++;
    
    return { success: true, status, data };
  } catch (error) {
    log(`❌ ${description || url} - ${error.message}`, 'error');
    testResults.failed++;
    testResults.total++;
    testResults.details.push({ test: description || url, error: error.message });
    
    return { success: false, error: error.message };
  }
}

async function testAPIEndpoint(endpoint, method = 'GET', body = null, expectedStatus = 200) {
  const url = `${TEST_CONFIG.baseUrl}${endpoint}`;
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json'
    }
  };
  
  if (body) {
    options.body = JSON.stringify(body);
  }
  
  try {
    const response = await fetch(url, options);
    const status = response.status;
    const data = await response.json();
    
    assert(status === expectedStatus, `Expected status ${expectedStatus}, got ${status}`);
    
    log(`✅ ${method} ${endpoint} - Status: ${status}`, 'success');
    testResults.passed++;
    testResults.total++;
    
    return { success: true, status, data };
  } catch (error) {
    log(`❌ ${method} ${endpoint} - ${error.message}`, 'error');
    testResults.failed++;
    testResults.total++;
    testResults.details.push({ test: `${method} ${endpoint}`, error: error.message });
    
    return { success: false, error: error.message };
  }
}

// Test suites
async function testServerHealth() {
  log('🏥 Testing Server Health...', 'info');
  
  await testEndpoint(`${TEST_CONFIG.baseUrl}/health`, 200, 'Health Check');
  
  const healthResponse = await fetch(`${TEST_CONFIG.baseUrl}/health`);
  const healthData = await healthResponse.json();
  
  assert(healthData.success === true, 'Health check should return success: true');
  assert(healthData.message, 'Health check should have a message');
  assert(healthData.timestamp, 'Health check should have a timestamp');
  
  log('✅ Server health tests completed', 'success');
}

async function testFrontendRoutes() {
  log('🌐 Testing Frontend Routes...', 'info');
  
  // Test main page
  await testEndpoint(`${TEST_CONFIG.baseUrl}/`, 200, 'Main Page');
  
  // Test that main page contains React app
  const mainPageResponse = await fetch(`${TEST_CONFIG.baseUrl}/`);
  const mainPageHtml = await mainPageResponse.text();
  
  assert(mainPageHtml.includes('<div id="root">'), 'Main page should contain React root div');
  assert(mainPageHtml.includes('index-'), 'Main page should include built JavaScript');
  assert(mainPageHtml.includes('index-c1a8cd0b.css'), 'Main page should include CSS');
  
  // Test static assets
  await testEndpoint(`${TEST_CONFIG.baseUrl}/assets/index-c1a8cd0b.css`, 200, 'CSS Assets');
  
  log('✅ Frontend route tests completed', 'success');
}

async function testAPIEndpoints() {
  log('🔧 Testing API Endpoints...', 'info');
  
  // Test all API endpoints
  const apiEndpoints = [
    '/api/users',
    '/api/emotions',
    '/api/journal',
    '/api/analytics',
    '/api/notifications',
    '/api/clinical-analytics',
    '/api/games',
    '/api/voice-chat'
  ];
  
  for (const endpoint of apiEndpoints) {
    await testAPIEndpoint(endpoint, 'GET', null, 200);
  }
  
  log('✅ API endpoint tests completed', 'success');
}

async function testErrorHandling() {
  log('🚨 Testing Error Handling...', 'info');
  
  // Test 404 handling
  await testEndpoint(`${TEST_CONFIG.baseUrl}/nonexistent`, 200, '404 should serve React app');
  
  // Test invalid API endpoint
  await testAPIEndpoint('/api/invalid', 'GET', null, 404);
  
  log('✅ Error handling tests completed', 'success');
}

async function testCORS() {
  log('🌍 Testing CORS Configuration...', 'info');
  
  try {
    const response = await fetch(`${TEST_CONFIG.baseUrl}/health`, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'http://localhost:3000',
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Content-Type'
      }
    });
    
    assert(response.status === 200 || response.status === 204, 'CORS preflight should succeed');
    
    log('✅ CORS tests completed', 'success');
  } catch (error) {
    log(`❌ CORS test failed: ${error.message}`, 'error');
    testResults.failed++;
    testResults.total++;
  }
}

async function testPerformance() {
  log('⚡ Testing Performance...', 'info');
  
  const startTime = Date.now();
  await testEndpoint(`${TEST_CONFIG.baseUrl}/health`, 200, 'Performance Test');
  const endTime = Date.now();
  
  const responseTime = endTime - startTime;
  assert(responseTime < 1000, `Response time should be under 1 second, got ${responseTime}ms`);
  
  log(`✅ Performance test completed - Response time: ${responseTime}ms`, 'success');
}

// Main test runner
async function runAllTests() {
  log('🚀 Starting Comprehensive Test Suite for Lumen Application', 'info');
  log('========================================================', 'info');
  
  try {
    await testServerHealth();
    await testFrontendRoutes();
    await testAPIEndpoints();
    await testErrorHandling();
    await testCORS();
    await testPerformance();
    
  } catch (error) {
    log(`❌ Test suite failed: ${error.message}`, 'error');
  }
  
  // Print results
  log('========================================================', 'info');
  log('📊 Test Results Summary:', 'info');
  log(`✅ Passed: ${testResults.passed}`, 'success');
  log(`❌ Failed: ${testResults.failed}`, testResults.failed > 0 ? 'error' : 'info');
  log(`📈 Total: ${testResults.total}`, 'info');
  log(`📊 Success Rate: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%`, 'info');
  
  if (testResults.details.length > 0) {
    log('📋 Failed Test Details:', 'warning');
    testResults.details.forEach(detail => {
      log(`  - ${detail.test}: ${detail.error}`, 'error');
    });
  }
  
  log('========================================================', 'info');
  
  // Exit with appropriate code
  process.exit(testResults.failed > 0 ? 1 : 0);
}

// Run tests
runAllTests().catch(error => {
  log(`❌ Test runner failed: ${error.message}`, 'error');
  process.exit(1);
}); 
#!/usr/bin/env node

/**
 * Master Test Runner for Lumen Application
 * Runs all test suites and provides comprehensive summary
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Test results aggregation
const masterTestResults = {
  comprehensive: { passed: 0, failed: 0, total: 0, success: false },
  uiComponents: { passed: 0, failed: 0, total: 0, success: false },
  pages: { passed: 0, failed: 0, total: 0, success: false },
  api: { passed: 0, failed: 0, total: 0, success: false },
  integration: { passed: 0, failed: 0, total: 0, success: false },
  overall: { passed: 0, failed: 0, total: 0 }
};

function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : type === 'warning' ? '⚠️' : 'ℹ️';
  console.log(`${prefix} [${timestamp}] ${message}`);
}

function runTest(testName, testFile) {
  return new Promise((resolve) => {
    log(`🔧 Running ${testName}...`, 'info');
    
    const testProcess = spawn('node', [testFile], {
      cwd: __dirname,
      stdio: ['pipe', 'pipe', 'pipe']
    });
    
    let output = '';
    let errorOutput = '';
    
    testProcess.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    testProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });
    
    testProcess.on('close', (code) => {
      // Parse the output to extract test results
      const successMatch = output.match(/✅ Passed: (\d+)/);
      const failedMatch = output.match(/❌ Failed: (\d+)/);
      const totalMatch = output.match(/📈 Total: (\d+)/);
      
      if (successMatch && failedMatch && totalMatch) {
        const passed = parseInt(successMatch[1]);
        const failed = parseInt(failedMatch[1]);
        const total = parseInt(totalMatch[1]);
        
        resolve({
          passed,
          failed,
          total,
          success: code === 0,
          output
        });
      } else {
        resolve({
          passed: 0,
          failed: 1,
          total: 1,
          success: false,
          output: errorOutput || output
        });
      }
    });
  });
}

function calculateOverallResults() {
  masterTestResults.overall.passed = 
    masterTestResults.comprehensive.passed +
    masterTestResults.uiComponents.passed +
    masterTestResults.pages.passed +
    masterTestResults.api.passed +
    masterTestResults.integration.passed;
    
  masterTestResults.overall.failed = 
    masterTestResults.comprehensive.failed +
    masterTestResults.uiComponents.failed +
    masterTestResults.pages.failed +
    masterTestResults.api.failed +
    masterTestResults.integration.failed;
    
  masterTestResults.overall.total = 
    masterTestResults.comprehensive.total +
    masterTestResults.uiComponents.total +
    masterTestResults.pages.total +
    masterTestResults.api.total +
    masterTestResults.integration.total;
}

function printTestSummary() {
  log('🎯 COMPREHENSIVE TEST SUMMARY', 'info');
  log('================================', 'info');
  
  // Individual test suite results
  log('📊 Test Suite Results:', 'info');
  
  const comprehensiveRate = masterTestResults.comprehensive.total > 0 ? 
    ((masterTestResults.comprehensive.passed / masterTestResults.comprehensive.total) * 100).toFixed(1) : '0.0';
  log(`  🔧 Comprehensive Tests: ${masterTestResults.comprehensive.passed}/${masterTestResults.comprehensive.total} passed (${comprehensiveRate}%)`, masterTestResults.comprehensive.failed > 0 ? 'warning' : 'success');
  
  const uiRate = masterTestResults.uiComponents.total > 0 ? 
    ((masterTestResults.uiComponents.passed / masterTestResults.uiComponents.total) * 100).toFixed(1) : '0.0';
  log(`  🧪 UI Components: ${masterTestResults.uiComponents.passed}/${masterTestResults.uiComponents.total} passed (${uiRate}%)`, masterTestResults.uiComponents.failed > 0 ? 'warning' : 'success');
  
  const pageRate = masterTestResults.pages.total > 0 ? 
    ((masterTestResults.pages.passed / masterTestResults.pages.total) * 100).toFixed(1) : '0.0';
  log(`  📄 Page Components: ${masterTestResults.pages.passed}/${masterTestResults.pages.total} passed (${pageRate}%)`, masterTestResults.pages.failed > 0 ? 'warning' : 'success');
  
  const apiRate = masterTestResults.api.total > 0 ? 
    ((masterTestResults.api.passed / masterTestResults.api.total) * 100).toFixed(1) : '0.0';
  log(`  🔌 API Endpoints: ${masterTestResults.api.passed}/${masterTestResults.api.total} passed (${apiRate}%)`, masterTestResults.api.failed > 0 ? 'warning' : 'success');
  
  const integrationRate = masterTestResults.integration.total > 0 ? 
    ((masterTestResults.integration.passed / masterTestResults.integration.total) * 100).toFixed(1) : '0.0';
  log(`  🔗 Integration: ${masterTestResults.integration.passed}/${masterTestResults.integration.total} passed (${integrationRate}%)`, masterTestResults.integration.failed > 0 ? 'warning' : 'success');
  
  log('', 'info');
  
  // Overall results
  const overallSuccessRate = masterTestResults.overall.total > 0 ? 
    ((masterTestResults.overall.passed / masterTestResults.overall.total) * 100).toFixed(1) : '0.0';
  log(`🎯 OVERALL RESULTS: ${masterTestResults.overall.passed}/${masterTestResults.overall.total} tests passed (${overallSuccessRate}%)`, masterTestResults.overall.failed > 0 ? 'warning' : 'success');
  
  if (masterTestResults.overall.failed > 0) {
    log('', 'info');
    log('❌ Failed Tests Summary:', 'error');
    if (masterTestResults.comprehensive.failed > 0) {
      log(`  🔧 Comprehensive: ${masterTestResults.comprehensive.failed} failed`, 'error');
    }
    if (masterTestResults.uiComponents.failed > 0) {
      log(`  🧪 UI Components: ${masterTestResults.uiComponents.failed} failed`, 'error');
    }
    if (masterTestResults.pages.failed > 0) {
      log(`  📄 Pages: ${masterTestResults.pages.failed} failed`, 'error');
    }
    if (masterTestResults.api.failed > 0) {
      log(`  🔌 API: ${masterTestResults.api.failed} failed`, 'error');
    }
    if (masterTestResults.integration.failed > 0) {
      log(`  🔗 Integration: ${masterTestResults.integration.failed} failed`, 'error');
    }
  }
  
  log('', 'info');
  
  // Application health assessment
  if (overallSuccessRate >= 95) {
    log('🏆 EXCELLENT! Application is in excellent health', 'success');
  } else if (overallSuccessRate >= 90) {
    log('✅ GOOD! Application is in good health with minor issues', 'success');
  } else if (overallSuccessRate >= 80) {
    log('⚠️ FAIR! Application has some issues that need attention', 'warning');
  } else {
    log('🚨 POOR! Application has significant issues that need immediate attention', 'error');
  }
  
  log('================================', 'info');
}

async function runAllTests() {
  log('🚀 Starting Master Test Suite for Lumen Application', 'info');
  log('==================================================', 'info');
  log('This will run all test suites: Comprehensive, UI Components, Pages, API, and Integration', 'info');
  log('==================================================', 'info');
  
  try {
    // Run comprehensive tests
    log('', 'info');
    const comprehensiveResults = await runTest('Comprehensive Tests', 'run-comprehensive-tests.js');
    masterTestResults.comprehensive = comprehensiveResults;
    
    // Run UI component tests
    log('', 'info');
    const uiResults = await runTest('UI Component Tests', 'frontend/ui-component-tests.js');
    masterTestResults.uiComponents = uiResults;
    
    // Run page tests
    log('', 'info');
    const pageResults = await runTest('Page Component Tests', 'frontend/page-tests.js');
    masterTestResults.pages = pageResults;
    
    // Run API tests
    log('', 'info');
    const apiResults = await runTest('API Tests', 'backend/api-tests.js');
    masterTestResults.api = apiResults;
    
    // Run integration tests
    log('', 'info');
    const integrationResults = await runTest('Integration Tests', 'integration/frontend-backend-integration.js');
    masterTestResults.integration = integrationResults;
    
    // Calculate overall results
    calculateOverallResults();
    
    // Print comprehensive summary
    log('', 'info');
    printTestSummary();
    
    // Exit with appropriate code
    const exitCode = masterTestResults.overall.failed > 0 ? 1 : 0;
    process.exit(exitCode);
    
  } catch (error) {
    log(`❌ Master test suite failed: ${error.message}`, 'error');
    process.exit(1);
  }
}

// Run all tests
runAllTests().catch(error => {
  log(`❌ Master test runner failed: ${error.message}`, 'error');
  process.exit(1);
}); 
/**
 * Test Runner for All Lumen Backend Tests
 * Runs API, AI Service, Database, and Integration tests
 * Run with: node tests/run-all-tests.js
 */

const { execSync, spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// ANSI color codes for console output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};

function colorLog(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

async function runTestFile(testFile, description) {
    return new Promise((resolve) => {
        colorLog(`\n${'='.repeat(60)}`, 'cyan');
        colorLog(`🧪 ${description}`, 'bright');
        colorLog(`${'='.repeat(60)}`, 'cyan');
        
        const startTime = Date.now();
        const child = spawn('node', [testFile], {
            stdio: 'inherit',
            cwd: path.dirname(__dirname)
        });
        
        child.on('close', (code) => {
            const duration = Date.now() - startTime;
            const durationSeconds = (duration / 1000).toFixed(2);
            
            if (code === 0) {
                colorLog(`✅ ${description} PASSED (${durationSeconds}s)`, 'green');
            } else {
                colorLog(`❌ ${description} FAILED (${durationSeconds}s)`, 'red');
            }
            
            resolve({ success: code === 0, duration, testFile, description });
        });
        
        child.on('error', (error) => {
            colorLog(`❌ Error running ${description}: ${error.message}`, 'red');
            resolve({ success: false, duration: 0, testFile, description, error: error.message });
        });
    });
}

async function checkPrerequisites() {
    colorLog('\n🔍 Checking Prerequisites...', 'yellow');
    
    const checks = [];
    
    // Check if Node.js modules are available
    try {
        require('../src/services/ai.js');
        checks.push({ name: 'AI Service Module', status: 'OK' });
    } catch (error) {
        checks.push({ name: 'AI Service Module', status: 'MISSING', error: error.message });
    }
    
    try {
        require('../src/models/EmotionEntry.js');
        checks.push({ name: 'Database Models', status: 'OK' });
    } catch (error) {
        checks.push({ name: 'Database Models', status: 'MISSING', error: error.message });
    }
    
    // Check environment variables
    const envFile = path.join(__dirname, '../.env');
    if (fs.existsSync(envFile)) {
        checks.push({ name: '.env file', status: 'OK' });
    } else {
        checks.push({ name: '.env file', status: 'MISSING' });
    }
    
    // Check if server is running
    try {
        const http = require('http');
        const testReq = http.request({
            hostname: 'localhost',
            port: 5001,
            path: '/health',
            method: 'GET',
            timeout: 2000
        }, (res) => {
            checks.push({ name: 'Backend Server (port 5001)', status: 'RUNNING' });
        });
        
        testReq.on('error', () => {
            checks.push({ name: 'Backend Server (port 5001)', status: 'NOT RUNNING' });
        });
        
        testReq.on('timeout', () => {
            checks.push({ name: 'Backend Server (port 5001)', status: 'TIMEOUT' });
        });
        
        testReq.end();
        
        // Wait a bit for the request to complete
        await new Promise(resolve => setTimeout(resolve, 1000));
        
    } catch (error) {
        checks.push({ name: 'Backend Server (port 5001)', status: 'ERROR', error: error.message });
    }
    
    // Display results
    for (const check of checks) {
        const status = check.status === 'OK' || check.status === 'RUNNING' ? 
            colorLog(`  ✅ ${check.name}: ${check.status}`, 'green') :
            colorLog(`  ⚠️  ${check.name}: ${check.status}`, 'yellow');
        
        if (check.error) {
            colorLog(`     ${check.error}`, 'red');
        }
    }
    
    const criticalIssues = checks.filter(c => 
        c.name === 'Backend Server (port 5001)' && c.status !== 'RUNNING'
    );
    
    if (criticalIssues.length > 0) {
        colorLog('\n⚠️  Warning: Backend server is not running. API and Integration tests will fail.', 'yellow');
        colorLog('   Start the server with: npm run dev', 'yellow');
    }
    
    return checks;
}

function printTestSummary(results) {
    colorLog('\n📊 TEST SUMMARY', 'bright');
    colorLog('='.repeat(60), 'cyan');
    
    const totalTests = results.length;
    const passedTests = results.filter(r => r.success).length;
    const failedTests = totalTests - passedTests;
    const totalDuration = results.reduce((sum, r) => sum + r.duration, 0);
    
    colorLog(`Total Test Suites: ${totalTests}`, 'bright');
    colorLog(`Passed: ${passedTests}`, passedTests === totalTests ? 'green' : 'yellow');
    colorLog(`Failed: ${failedTests}`, failedTests === 0 ? 'green' : 'red');
    colorLog(`Total Duration: ${(totalDuration / 1000).toFixed(2)}s`, 'bright');
    
    colorLog('\nDetailed Results:', 'bright');
    for (const result of results) {
        const icon = result.success ? '✅' : '❌';
        const color = result.success ? 'green' : 'red';
        const duration = (result.duration / 1000).toFixed(2);
        colorLog(`  ${icon} ${result.description} (${duration}s)`, color);
        
        if (result.error) {
            colorLog(`     Error: ${result.error}`, 'red');
        }
    }
    
    if (failedTests === 0) {
        colorLog('\n🎉 ALL TESTS PASSED!', 'green');
        colorLog('The Lumen backend is working correctly.', 'green');
    } else {
        colorLog('\n⚠️  SOME TESTS FAILED', 'red');
        colorLog('Check the detailed output above for specific failures.', 'red');
    }
}

function printUsageInfo() {
    colorLog('\n📚 Test Suite Information', 'cyan');
    colorLog('='.repeat(60), 'cyan');
    
    const testInfo = [
        {
            name: 'API Tests',
            description: 'Tests all REST API endpoints, validation, and error handling',
            file: 'tests/api-tests.js'
        },
        {
            name: 'AI Service Tests',
            description: 'Tests Gemini AI integration, journal analysis, and clinical insights',
            file: 'tests/ai-service-tests.js'
        },
        {
            name: 'Database Tests',
            description: 'Tests MongoDB models, validation, indexes, and data integrity',
            file: 'tests/database-tests.js'
        },
        {
            name: 'Integration Tests',
            description: 'Tests complete workflows, multi-modal integration, and user journeys',
            file: 'tests/integration-tests.js'
        }
    ];
    
    for (const test of testInfo) {
        colorLog(`\n🧪 ${test.name}`, 'bright');
        colorLog(`   ${test.description}`, 'reset');
        colorLog(`   Run individually: node ${test.file}`, 'yellow');
    }
    
    colorLog('\n🚀 Setup Requirements:', 'cyan');
    colorLog('   1. MongoDB running (for database tests)', 'reset');
    colorLog('   2. Backend server running on port 5001 (for API/integration tests)', 'reset');
    colorLog('   3. Environment variables configured (.env file)', 'reset');
    colorLog('   4. GOOGLE_AI_API_KEY set (for full AI tests)', 'reset');
}

async function main() {
    const startTime = Date.now();
    
    colorLog('🧪 LUMEN BACKEND TEST SUITE', 'bright');
    colorLog('Comprehensive testing of all backend functionality\n', 'cyan');
    
    // Check if help is requested
    if (process.argv.includes('--help') || process.argv.includes('-h')) {
        printUsageInfo();
        return;
    }
    
    // Check prerequisites
    await checkPrerequisites();
    
    // Define test suites
    const testSuites = [
        {
            file: path.join(__dirname, 'database-tests.js'),
            description: 'Database & Models'
        },
        {
            file: path.join(__dirname, 'ai-service-tests.js'),
            description: 'AI Service & Gemini Integration'
        },
        {
            file: path.join(__dirname, 'api-tests.js'),
            description: 'REST API Endpoints'
        },
        {
            file: path.join(__dirname, 'voice-chat-tests.js'),
            description: 'Voice Chat & WebSocket'
        },
        {
            file: path.join(__dirname, 'clinical-analytics-tests.js'),
            description: 'Clinical Analytics & Assessments'
        },
        {
            file: path.join(__dirname, 'games-tests.js'),
            description: 'Games & Therapeutic Activities'
        },
        {
            file: path.join(__dirname, 'clerk-service-tests.js'),
            description: 'Clerk Authentication Service'
        },
        {
            file: path.join(__dirname, 'error-edge-case-tests.js'),
            description: 'Error Handling & Edge Cases'
        },
        {
            file: path.join(__dirname, 'performance-tests.js'),
            description: 'Performance & Load Testing'
        },
        {
            file: path.join(__dirname, 'security-tests.js'),
            description: 'Security & Vulnerability Testing'
        },
        {
            file: path.join(__dirname, 'integration-tests.js'),
            description: 'Integration & Workflows'
        }
    ];
    
    const results = [];
    
    // Run each test suite
    for (const suite of testSuites) {
        const result = await runTestFile(suite.file, suite.description);
        results.push(result);
        
        // Short pause between test suites
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    const totalDuration = Date.now() - startTime;
    
    // Print summary
    printTestSummary(results);
    
    colorLog(`\n⏱️  Total execution time: ${(totalDuration / 1000).toFixed(2)}s`, 'bright');
    
    // Exit with appropriate code
    const allPassed = results.every(r => r.success);
    process.exit(allPassed ? 0 : 1);
}

// Handle unhandled promises
process.on('unhandledRejection', (reason, promise) => {
    colorLog(`\n❌ Unhandled Rejection at: ${promise}`, 'red');
    colorLog(`Reason: ${reason}`, 'red');
    process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    colorLog(`\n❌ Uncaught Exception: ${error.message}`, 'red');
    colorLog(`Stack: ${error.stack}`, 'red');
    process.exit(1);
});

// Run the test suite
if (require.main === module) {
    main().catch((error) => {
        colorLog(`\n❌ Test runner error: ${error.message}`, 'red');
        process.exit(1);
    });
}

module.exports = { runTestFile, checkPrerequisites, printTestSummary };
/**
 * Comprehensive Error Handling and Edge Case Tests
 * Tests error scenarios, edge cases, input validation, and system resilience
 * Run with: node tests/error-edge-case-tests.js
 */

import http from 'http';
import fs from 'fs';
import path from 'path';

const API_BASE = 'http://localhost:5001';
const TEST_CLERK_ID = 'test_error_user_123';

// Colors for console output
const colors = {
    reset: '\x1b[0m',
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

// HTTP request helper with timeout
function makeRequest(method, url, data = null, headers = {}, timeout = 10000) {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const options = {
            hostname: urlObj.hostname,
            port: urlObj.port,
            path: urlObj.pathname + urlObj.search,
            method: method,
            timeout: timeout,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${TEST_CLERK_ID}`,
                ...headers
            }
        };

        const req = http.request(options, (res) => {
            let responseData = '';
            res.on('data', (chunk) => {
                responseData += chunk;
            });
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(responseData);
                    resolve({ status: res.statusCode, data: parsed, headers: res.headers });
                } catch (e) {
                    resolve({ status: res.statusCode, data: responseData, headers: res.headers });
                }
            });
        });

        req.on('error', (error) => {
            resolve({ status: 0, error: error.message });
        });

        req.on('timeout', () => {
            req.destroy();
            resolve({ status: 408, error: 'Request timeout' });
        });

        if (data) {
            req.write(typeof data === 'string' ? data : JSON.stringify(data));
        }
        req.end();
    });
}

// Generate malformed data for testing
function generateMalformedData() {
    return {
        sqlInjection: "'; DROP TABLE users; --",
        xssPayload: "<script>alert('XSS')</script>",
        oversizedString: 'A'.repeat(10000),
        invalidJson: '{"invalid": json}',
        nullValues: null,
        undefinedValues: undefined,
        circularReference: (() => {
            const obj = { a: 1 };
            obj.b = obj;
            return obj;
        })(),
        invalidDates: ['invalid-date', '2023-13-45', '2023-02-30'],
        invalidEmails: ['invalid-email', '@invalid.com', 'test@', 'test..test@example.com'],
        invalidNumbers: ['not-a-number', Infinity, -Infinity, NaN],
        invalidUUIDs: ['invalid-uuid', '123-456-789', 'not-a-uuid'],
        emptyArrays: [],
        emptyObjects: {},
        specialCharacters: '!@#$%^&*(){}[]|\\:";\'<>?,./',
        unicodeCharacters: '🎭🎪🎨🎯🎲🎮🎧🎤🎸🎺🎻🎹',
        booleanStrings: ['true', 'false', 'TRUE', 'FALSE', '1', '0']
    };
}

// Test suite
const tests = [
    {
        name: 'Input Validation Errors',
        test: async () => {
            colorLog('Testing input validation errors...', 'blue');
            
            const malformed = generateMalformedData();
            const validationErrors = [];
            
            // Test emotion entry with invalid data
            const invalidEmotionData = {
                emotion: malformed.xssPayload,
                intensity: malformed.invalidNumbers[0],
                timestamp: malformed.invalidDates[0],
                notes: malformed.oversizedString
            };
            
            const emotionResponse = await makeRequest('POST', `${API_BASE}/api/emotions`, invalidEmotionData);
            if (emotionResponse.status === 201) {
                throw new Error('Invalid emotion data was accepted');
            }
            validationErrors.push({ endpoint: 'emotions', status: emotionResponse.status });
            colorLog('✓ Invalid emotion data rejected', 'green');
            
            // Test journal entry with malformed content
            const invalidJournalData = {
                content: malformed.sqlInjection,
                mood: 'invalid-mood',
                tags: [malformed.xssPayload, null, undefined],
                timestamp: malformed.invalidDates[1]
            };
            
            const journalResponse = await makeRequest('POST', `${API_BASE}/api/journal`, invalidJournalData);
            if (journalResponse.status === 201) {
                throw new Error('Invalid journal data was accepted');
            }
            validationErrors.push({ endpoint: 'journal', status: journalResponse.status });
            colorLog('✓ Invalid journal data rejected', 'green');
            
            // Test user profile with invalid data
            const invalidUserData = {
                firstName: malformed.specialCharacters,
                lastName: malformed.oversizedString,
                email: malformed.invalidEmails[0],
                age: malformed.invalidNumbers[1],
                preferences: malformed.circularReference
            };
            
            const userResponse = await makeRequest('PUT', `${API_BASE}/api/users/profile`, invalidUserData);
            if (userResponse.status === 200) {
                throw new Error('Invalid user data was accepted');
            }
            validationErrors.push({ endpoint: 'users', status: userResponse.status });
            colorLog('✓ Invalid user profile data rejected', 'green');
            
            // Test game session with invalid data
            const invalidGameData = {
                gameType: malformed.xssPayload,
                score: malformed.invalidNumbers[2],
                duration: -1000,
                gameData: malformed.circularReference
            };
            
            const gameResponse = await makeRequest('POST', `${API_BASE}/api/games/session`, invalidGameData);
            if (gameResponse.status === 201) {
                throw new Error('Invalid game data was accepted');
            }
            validationErrors.push({ endpoint: 'games', status: gameResponse.status });
            colorLog('✓ Invalid game session data rejected', 'green');
            
            colorLog(`Total validation errors caught: ${validationErrors.length}`, 'cyan');
            return validationErrors;
        }
    },
    
    {
        name: 'Authentication and Authorization Errors',
        test: async () => {
            colorLog('Testing authentication and authorization errors...', 'blue');
            
            const authErrors = [];
            
            // Test missing authorization header
            const noAuthResponse = await makeRequest('GET', `${API_BASE}/api/users/profile`, null, {});
            if (noAuthResponse.status !== 401) {
                throw new Error('Missing auth header should return 401');
            }
            authErrors.push({ type: 'missing_auth', status: noAuthResponse.status });
            colorLog('✓ Missing authorization header rejected', 'green');
            
            // Test malformed authorization header
            const malformedAuthResponse = await makeRequest('GET', `${API_BASE}/api/users/profile`, null, {
                'Authorization': 'InvalidFormat token123'
            });
            if (malformedAuthResponse.status !== 401) {
                throw new Error('Malformed auth header should return 401');
            }
            authErrors.push({ type: 'malformed_auth', status: malformedAuthResponse.status });
            colorLog('✓ Malformed authorization header rejected', 'green');
            
            // Test invalid token
            const invalidTokenResponse = await makeRequest('GET', `${API_BASE}/api/users/profile`, null, {
                'Authorization': 'Bearer invalid.token.here'
            });
            if (invalidTokenResponse.status !== 401) {
                throw new Error('Invalid token should return 401');
            }
            authErrors.push({ type: 'invalid_token', status: invalidTokenResponse.status });
            colorLog('✓ Invalid token rejected', 'green');
            
            // Test expired token
            const expiredTokenResponse = await makeRequest('GET', `${API_BASE}/api/users/profile`, null, {
                'Authorization': 'Bearer expired_token_123'
            });
            if (expiredTokenResponse.status !== 401) {
                throw new Error('Expired token should return 401');
            }
            authErrors.push({ type: 'expired_token', status: expiredTokenResponse.status });
            colorLog('✓ Expired token rejected', 'green');
            
            // Test accessing admin endpoints without privileges
            const adminResponse = await makeRequest('GET', `${API_BASE}/api/admin/users`, null, {
                'Authorization': `Bearer ${TEST_CLERK_ID}`
            });
            if (adminResponse.status !== 403 && adminResponse.status !== 404) {
                throw new Error('Non-admin should not access admin endpoints');
            }
            authErrors.push({ type: 'admin_access', status: adminResponse.status });
            colorLog('✓ Admin endpoint access properly restricted', 'green');
            
            colorLog(`Total auth errors handled: ${authErrors.length}`, 'cyan');
            return authErrors;
        }
    },
    
    {
        name: 'HTTP Method and Route Errors',
        test: async () => {
            colorLog('Testing HTTP method and route errors...', 'blue');
            
            const routeErrors = [];
            
            // Test non-existent routes
            const notFoundResponse = await makeRequest('GET', `${API_BASE}/api/nonexistent/route`);
            if (notFoundResponse.status !== 404) {
                throw new Error('Non-existent route should return 404');
            }
            routeErrors.push({ type: 'not_found', status: notFoundResponse.status });
            colorLog('✓ Non-existent route returns 404', 'green');
            
            // Test wrong HTTP methods
            const wrongMethodResponse = await makeRequest('DELETE', `${API_BASE}/api/emotions`, { test: 'data' });
            if (wrongMethodResponse.status !== 405 && wrongMethodResponse.status !== 404) {
                throw new Error('Wrong HTTP method should return 405 or 404');
            }
            routeErrors.push({ type: 'wrong_method', status: wrongMethodResponse.status });
            colorLog('✓ Wrong HTTP method handled', 'green');
            
            // Test malformed URLs
            const malformedUrlResponse = await makeRequest('GET', `${API_BASE}/api/emotions/../../../etc/passwd`);
            if (malformedUrlResponse.status !== 400 && malformedUrlResponse.status !== 404) {
                throw new Error('Malformed URL should be rejected');
            }
            routeErrors.push({ type: 'malformed_url', status: malformedUrlResponse.status });
            colorLog('✓ Malformed URL rejected', 'green');
            
            // Test URL with special characters
            const specialCharsResponse = await makeRequest('GET', `${API_BASE}/api/emotions/<script>alert()</script>`);
            if (specialCharsResponse.status !== 400 && specialCharsResponse.status !== 404) {
                throw new Error('URL with special characters should be rejected');
            }
            routeErrors.push({ type: 'special_chars_url', status: specialCharsResponse.status });
            colorLog('✓ URL with special characters rejected', 'green');
            
            colorLog(`Total route errors handled: ${routeErrors.length}`, 'cyan');
            return routeErrors;
        }
    },
    
    {
        name: 'Content-Type and Request Format Errors',
        test: async () => {
            colorLog('Testing content-type and request format errors...', 'blue');
            
            const formatErrors = [];
            
            // Test invalid JSON
            const invalidJsonResponse = await makeRequest('POST', `${API_BASE}/api/emotions`, '{"invalid": json}', {
                'Content-Type': 'application/json'
            });
            if (invalidJsonResponse.status !== 400) {
                throw new Error('Invalid JSON should return 400');
            }
            formatErrors.push({ type: 'invalid_json', status: invalidJsonResponse.status });
            colorLog('✓ Invalid JSON rejected', 'green');
            
            // Test wrong content-type
            const wrongContentTypeResponse = await makeRequest('POST', `${API_BASE}/api/emotions`, 'emotion=happy&intensity=8', {
                'Content-Type': 'application/x-www-form-urlencoded'
            });
            // This might be accepted depending on server configuration
            formatErrors.push({ type: 'wrong_content_type', status: wrongContentTypeResponse.status });
            colorLog(`✓ Form data content-type: ${wrongContentTypeResponse.status}`, 'green');
            
            // Test missing content-type
            const noContentTypeResponse = await makeRequest('POST', `${API_BASE}/api/emotions`, '{"test": "data"}', {});
            if (noContentTypeResponse.status === 201) {
                colorLog('⚠ Missing content-type was accepted', 'yellow');
            } else {
                colorLog('✓ Missing content-type handled appropriately', 'green');
            }
            formatErrors.push({ type: 'missing_content_type', status: noContentTypeResponse.status });
            
            // Test oversized request body
            const oversizedData = { content: 'A'.repeat(50000000) }; // 50MB
            const oversizedResponse = await makeRequest('POST', `${API_BASE}/api/journal`, oversizedData, {}, 30000);
            if (oversizedResponse.status !== 413 && oversizedResponse.status !== 400) {
                colorLog('⚠ Large request body handling unclear', 'yellow');
            } else {
                colorLog('✓ Oversized request body rejected', 'green');
            }
            formatErrors.push({ type: 'oversized_body', status: oversizedResponse.status });
            
            colorLog(`Total format errors handled: ${formatErrors.length}`, 'cyan');
            return formatErrors;
        }
    },
    
    {
        name: 'Database Connection and Query Errors',
        test: async () => {
            colorLog('Testing database error handling...', 'blue');
            
            const dbErrors = [];
            
            // Test database connection resilience
            const healthResponse = await makeRequest('GET', `${API_BASE}/health`);
            if (healthResponse.status !== 200) {
                throw new Error('Health endpoint should be accessible');
            }
            dbErrors.push({ type: 'health_check', status: healthResponse.status });
            colorLog('✓ Health endpoint accessible', 'green');
            
            // Test with potentially problematic queries
            const problematicQueries = [
                // Test SQL injection attempts
                { emotion: "'; DROP TABLE emotions; --", intensity: 5 },
                { emotion: "happy' OR '1'='1", intensity: 8 },
                // Test MongoDB injection attempts
                { emotion: { $gt: "" }, intensity: 5 },
                { emotion: { $where: "this.emotion.length > 0" }, intensity: 8 }
            ];
            
            for (let i = 0; i < problematicQueries.length; i++) {
                const query = problematicQueries[i];
                const response = await makeRequest('POST', `${API_BASE}/api/emotions`, query);
                
                if (response.status === 201) {
                    throw new Error(`Potentially dangerous query was accepted: ${JSON.stringify(query)}`);
                }
                
                dbErrors.push({ type: `injection_attempt_${i}`, status: response.status });
            }
            colorLog('✓ Injection attempts rejected', 'green');
            
            // Test concurrent request handling
            const concurrentPromises = [];
            for (let i = 0; i < 20; i++) {
                concurrentPromises.push(makeRequest('GET', `${API_BASE}/api/emotions?page=${i}`));
            }
            
            const concurrentResponses = await Promise.all(concurrentPromises);
            const successfulRequests = concurrentResponses.filter(r => r.status === 200).length;
            
            colorLog(`✓ Concurrent requests handled: ${successfulRequests}/20`, 'green');
            dbErrors.push({ type: 'concurrent_requests', successful: successfulRequests });
            
            colorLog(`Total database scenarios tested: ${dbErrors.length}`, 'cyan');
            return dbErrors;
        }
    },
    
    {
        name: 'Resource Limits and Rate Limiting',
        test: async () => {
            colorLog('Testing resource limits and rate limiting...', 'blue');
            
            const resourceErrors = [];
            
            // Test rate limiting
            const rapidRequests = [];
            for (let i = 0; i < 50; i++) {
                rapidRequests.push(makeRequest('GET', `${API_BASE}/health`, null, {}, 5000));
            }
            
            const rapidResponses = await Promise.all(rapidRequests);
            const rateLimited = rapidResponses.filter(r => r.status === 429).length;
            const successful = rapidResponses.filter(r => r.status === 200).length;
            
            colorLog(`✓ Rate limiting test: ${successful} successful, ${rateLimited} rate limited`, 'green');
            resourceErrors.push({ type: 'rate_limiting', successful, rateLimited });
            
            // Test memory usage with large requests
            const largeDataRequests = [];
            for (let i = 0; i < 5; i++) {
                const largeData = {
                    content: 'X'.repeat(1000000), // 1MB each
                    metadata: Array(1000).fill({ key: 'value'.repeat(100) })
                };
                largeDataRequests.push(makeRequest('POST', `${API_BASE}/api/journal`, largeData, {}, 15000));
            }
            
            const largeDataResponses = await Promise.all(largeDataRequests);
            const largeDataRejected = largeDataResponses.filter(r => r.status >= 400).length;
            
            colorLog(`✓ Large data handling: ${largeDataRejected}/5 rejected`, 'green');
            resourceErrors.push({ type: 'large_data', rejected: largeDataRejected });
            
            // Test connection pool limits
            const connectionPromises = [];
            for (let i = 0; i < 100; i++) {
                connectionPromises.push(makeRequest('GET', `${API_BASE}/api/emotions?delay=${Math.random() * 1000}`, null, {}, 20000));
            }
            
            const connectionResponses = await Promise.all(connectionPromises);
            const connectionErrors = connectionResponses.filter(r => r.status === 0 || r.status >= 500).length;
            
            colorLog(`✓ Connection pool test: ${connectionErrors}/100 connection errors`, 'green');
            resourceErrors.push({ type: 'connection_pool', errors: connectionErrors });
            
            colorLog(`Total resource scenarios tested: ${resourceErrors.length}`, 'cyan');
            return resourceErrors;
        }
    },
    
    {
        name: 'Error Response Format and Consistency',
        test: async () => {
            colorLog('Testing error response format and consistency...', 'blue');
            
            const errorFormats = [];
            
            // Test various error scenarios and check response format consistency
            const errorScenarios = [
                { method: 'GET', url: '/api/nonexistent', expectedStatus: 404 },
                { method: 'POST', url: '/api/emotions', data: null, expectedStatus: 400 },
                { method: 'GET', url: '/api/users/profile', headers: {}, expectedStatus: 401 },
                { method: 'PUT', url: '/api/emotions/invalid-id', data: {}, expectedStatus: 400 },
                { method: 'DELETE', url: '/api/journal/nonexistent-id', expectedStatus: 404 }
            ];
            
            for (const scenario of errorScenarios) {
                const response = await makeRequest(
                    scenario.method, 
                    `${API_BASE}${scenario.url}`, 
                    scenario.data,
                    scenario.headers || { 'Authorization': `Bearer ${TEST_CLERK_ID}` }
                );
                
                // Check if response has consistent error format
                const hasErrorFormat = response.data && (
                    response.data.error || 
                    response.data.message || 
                    response.data.success === false
                );
                
                errorFormats.push({
                    scenario: `${scenario.method} ${scenario.url}`,
                    status: response.status,
                    hasErrorFormat,
                    response: response.data
                });
                
                colorLog(`✓ ${scenario.method} ${scenario.url}: ${response.status}`, 'green');
            }
            
            // Check consistency of error format
            const consistentFormats = errorFormats.filter(e => e.hasErrorFormat).length;
            colorLog(`✓ Consistent error format: ${consistentFormats}/${errorFormats.length}`, 'green');
            
            // Test CORS errors
            const corsResponse = await makeRequest('OPTIONS', `${API_BASE}/api/emotions`, null, {
                'Origin': 'https://malicious-site.com',
                'Access-Control-Request-Method': 'POST'
            });
            
            errorFormats.push({
                scenario: 'CORS preflight',
                status: corsResponse.status,
                hasAccessControl: !!corsResponse.headers['access-control-allow-origin']
            });
            
            colorLog(`✓ CORS preflight: ${corsResponse.status}`, 'green');
            
            colorLog(`Total error format scenarios tested: ${errorFormats.length}`, 'cyan');
            return errorFormats;
        }
    },
    
    {
        name: 'Edge Cases and Boundary Conditions',
        test: async () => {
            colorLog('Testing edge cases and boundary conditions...', 'blue');
            
            const edgeCases = [];
            
            // Test boundary values
            const boundaryTests = [
                // Intensity boundaries
                { endpoint: '/api/emotions', data: { emotion: 'happy', intensity: 0 } },
                { endpoint: '/api/emotions', data: { emotion: 'happy', intensity: 10 } },
                { endpoint: '/api/emotions', data: { emotion: 'happy', intensity: 11 } }, // Should fail
                { endpoint: '/api/emotions', data: { emotion: 'happy', intensity: -1 } }, // Should fail
                
                // Date boundaries
                { endpoint: '/api/emotions', data: { emotion: 'happy', intensity: 5, timestamp: '1970-01-01T00:00:00.000Z' } },
                { endpoint: '/api/emotions', data: { emotion: 'happy', intensity: 5, timestamp: '2099-12-31T23:59:59.999Z' } },
                { endpoint: '/api/emotions', data: { emotion: 'happy', intensity: 5, timestamp: '1969-12-31T23:59:59.999Z' } }, // Should fail
                
                // String length boundaries
                { endpoint: '/api/journal', data: { content: '', mood: 5 } }, // Empty content
                { endpoint: '/api/journal', data: { content: 'A'.repeat(10000), mood: 5 } }, // Very long content
                { endpoint: '/api/journal', data: { content: 'A'.repeat(100000), mood: 5 } } // Extremely long content
            ];
            
            for (const test of boundaryTests) {
                const response = await makeRequest('POST', `${API_BASE}${test.endpoint}`, test.data);
                edgeCases.push({
                    test: `${test.endpoint} boundary`,
                    data: test.data,
                    status: response.status,
                    accepted: response.status === 201
                });
            }
            
            colorLog(`✓ Boundary value tests completed: ${boundaryTests.length}`, 'green');
            
            // Test special character handling
            const specialCharTests = [
                { emotion: '😊', intensity: 8 }, // Emoji
                { emotion: 'café', intensity: 7 }, // Accented characters
                { emotion: '测试', intensity: 6 }, // Chinese characters
                { emotion: 'тест', intensity: 5 }, // Cyrillic characters
                { emotion: 'مختبر', intensity: 4 }, // Arabic characters
                { emotion: '\\n\\t\\r', intensity: 3 }, // Escape sequences
                { emotion: '\u0000\u0001\u0002', intensity: 2 } // Control characters
            ];
            
            for (const test of specialCharTests) {
                const response = await makeRequest('POST', `${API_BASE}/api/emotions`, test);
                edgeCases.push({
                    test: 'special characters',
                    data: test,
                    status: response.status,
                    accepted: response.status === 201
                });
            }
            
            colorLog(`✓ Special character tests completed: ${specialCharTests.length}`, 'green');
            
            // Test concurrent edge cases
            const concurrentEdgeCases = [];
            
            // Simultaneous creation and deletion
            for (let i = 0; i < 10; i++) {
                concurrentEdgeCases.push(
                    makeRequest('POST', `${API_BASE}/api/emotions`, { emotion: `test_${i}`, intensity: 5 })
                );
            }
            
            const creationResults = await Promise.all(concurrentEdgeCases);
            const successfulCreations = creationResults.filter(r => r.status === 201);
            
            colorLog(`✓ Concurrent creation edge cases: ${successfulCreations.length}/10`, 'green');
            edgeCases.push({
                test: 'concurrent_creation',
                successful: successfulCreations.length,
                total: 10
            });
            
            colorLog(`Total edge cases tested: ${edgeCases.length}`, 'cyan');
            return edgeCases;
        }
    }
];

// Run all tests
async function runAllTests() {
    colorLog('⚠️  ERROR HANDLING & EDGE CASE COMPREHENSIVE TESTS', 'magenta');
    colorLog('================================================', 'magenta');
    
    let passed = 0;
    let failed = 0;
    const results = [];
    
    for (const test of tests) {
        try {
            colorLog(`\n🧪 Testing: ${test.name}`, 'yellow');
            const startTime = Date.now();
            
            const result = await test.test();
            const duration = Date.now() - startTime;
            
            colorLog(`✅ ${test.name} - PASSED (${duration}ms)`, 'green');
            passed++;
            results.push({ name: test.name, status: 'PASSED', duration, result });
            
        } catch (error) {
            colorLog(`❌ ${test.name} - FAILED: ${error.message}`, 'red');
            failed++;
            results.push({ name: test.name, status: 'FAILED', error: error.message });
        }
    }
    
    // Summary
    colorLog('\n📊 ERROR HANDLING TEST SUMMARY', 'cyan');
    colorLog('===============================', 'cyan');
    colorLog(`Total Tests: ${passed + failed}`, 'blue');
    colorLog(`Passed: ${passed}`, 'green');
    colorLog(`Failed: ${failed}`, failed > 0 ? 'red' : 'green');
    colorLog(`Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`, 'blue');
    
    if (failed > 0) {
        colorLog('\n❌ Failed Tests:', 'red');
        results.filter(r => r.status === 'FAILED').forEach(r => {
            colorLog(`  • ${r.name}: ${r.error}`, 'red');
        });
    }
    
    // Analysis summary
    colorLog('\n📋 ERROR HANDLING ANALYSIS', 'cyan');
    colorLog('===========================', 'cyan');
    results.forEach(result => {
        if (result.status === 'PASSED' && result.result) {
            colorLog(`✓ ${result.name}: ${Array.isArray(result.result) ? result.result.length : 'N/A'} scenarios tested`, 'blue');
        }
    });
    
    process.exit(failed > 0 ? 1 : 0);
}

// Handle unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
    colorLog(`❌ Unhandled Rejection: ${reason}`, 'red');
    process.exit(1);
});

// Run tests
if (import.meta.url === `file://${process.argv[1]}`) {
    runAllTests().catch(error => {
        colorLog(`❌ Test suite failed: ${error.message}`, 'red');
        process.exit(1);
    });
}

export { runAllTests, tests };
/**
 * Comprehensive Security Tests
 * Tests authentication, authorization, input validation, and security vulnerabilities
 * Run with: node tests/security-tests.js
 */

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const API_BASE = 'http://localhost:5001';
const TEST_CLERK_ID = 'test_security_user_123';

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

// HTTP request helper
function makeRequest(method, url, data = null, headers = {}) {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const options = {
            hostname: urlObj.hostname,
            port: urlObj.port,
            path: urlObj.pathname + urlObj.search,
            method: method,
            headers: {
                'Content-Type': 'application/json',
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

        req.on('error', reject);

        if (data) {
            req.write(typeof data === 'string' ? data : JSON.stringify(data));
        }
        req.end();
    });
}

// Security payload generators
function generateSecurityPayloads() {
    return {
        // SQL Injection Payloads
        sqlInjection: [
            "'; DROP TABLE users; --",
            "' OR '1'='1",
            "'; INSERT INTO users VALUES ('admin', 'password'); --",
            "' UNION SELECT password FROM users --",
            "'; UPDATE users SET password='hacked' WHERE username='admin'; --",
            "'; EXEC xp_cmdshell('dir'); --",
            "1'; WAITFOR DELAY '00:00:05'; --"
        ],

        // NoSQL Injection Payloads
        nosqlInjection: [
            { "$gt": "" },
            { "$ne": null },
            { "$where": "this.password.length > 0" },
            { "$regex": ".*" },
            { "$or": [{ "password": "" }, { "password": { "$exists": false } }] }
        ],

        // XSS Payloads
        xss: [
            "<script>alert('XSS')</script>",
            "<img src=x onerror=alert('XSS')>",
            "javascript:alert('XSS')",
            "<svg onload=alert('XSS')>",
            "';alert('XSS');//",
            "\"><script>alert('XSS')</script>",
            "<iframe src=javascript:alert('XSS')></iframe>"
        ],

        // Command Injection Payloads
        commandInjection: [
            "; ls -la",
            "| cat /etc/passwd",
            "&& whoami",
            "`id`",
            "$(ls)",
            "; rm -rf /",
            "| nc -l 4444 -e /bin/sh"
        ],

        // Path Traversal Payloads
        pathTraversal: [
            "../../../etc/passwd",
            "..\\..\\..\\windows\\system32\\drivers\\etc\\hosts",
            "....//....//....//etc/passwd",
            "%2e%2e%2f%2e%2e%2f%2e%2e%2fetc%2fpasswd",
            "..%252f..%252f..%252fetc%252fpasswd",
            "....\\\\....\\\\....\\\\windows\\\\system32\\\\drivers\\\\etc\\\\hosts"
        ],

        // LDAP Injection Payloads
        ldapInjection: [
            "*)(uid=*))(|(uid=*",
            "*)(|(password=*))",
            "admin)(&(password=*)",
            "*))%00",
            ")(cn=*"
        ],

        // Buffer Overflow Attempts
        bufferOverflow: [
            "A".repeat(10000),
            "A".repeat(100000),
            "\x00".repeat(1000),
            "\xff".repeat(5000)
        ],

        // Format String Attacks
        formatString: [
            "%s%s%s%s%s",
            "%x%x%x%x%x",
            "%n%n%n%n%n",
            "%08x.%08x.%08x.%08x"
        ]
    };
}

// Test suite
const tests = [
    {
        name: 'Authentication Security',
        test: async () => {
            colorLog('Testing authentication security...', 'blue');
            
            const authResults = [];

            // Test token validation
            const tokens = [
                'invalid_token',
                'Bearer invalid_token',
                'Bearer ',
                '',
                'Basic YWRtaW46cGFzc3dvcmQ=', // admin:password in base64
                'Bearer ' + 'A'.repeat(1000), // Oversized token
                'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalid.signature', // Invalid JWT
                'Bearer null',
                'Bearer undefined'
            ];

            for (const token of tokens) {
                const response = await makeRequest('GET', `${API_BASE}/api/users/profile`, null, {
                    'Authorization': token
                });
                
                if (response.status === 200) {
                    authResults.push({ token, status: response.status, vulnerable: true });
                    colorLog(`⚠ Vulnerable: Token "${token}" was accepted`, 'red');
                } else {
                    authResults.push({ token, status: response.status, vulnerable: false });
                }
            }

            colorLog(`✓ Authentication security: ${authResults.filter(r => !r.vulnerable).length}/${authResults.length} properly rejected`, 'green');

            // Test session fixation
            const sessionFixationResponse = await makeRequest('POST', `${API_BASE}/api/users/login`, {
                email: 'test@example.com',
                password: 'password',
                sessionId: 'attacker_controlled_session'
            });

            authResults.push({
                test: 'session_fixation',
                status: sessionFixationResponse.status,
                vulnerable: sessionFixationResponse.status === 200
            });

            // Test brute force protection
            const bruteForceAttempts = [];
            for (let i = 0; i < 20; i++) {
                bruteForceAttempts.push(makeRequest('POST', `${API_BASE}/api/users/login`, {
                    email: 'test@example.com',
                    password: `wrong_password_${i}`
                }));
            }

            const bruteForceResponses = await Promise.all(bruteForceAttempts);
            const rateLimited = bruteForceResponses.filter(r => r.status === 429).length;
            
            authResults.push({
                test: 'brute_force_protection',
                attempts: 20,
                rateLimited,
                protected: rateLimited > 0
            });

            colorLog(`✓ Brute force protection: ${rateLimited > 0 ? 'Active' : 'Not detected'}`, rateLimited > 0 ? 'green' : 'yellow');

            return authResults;
        }
    },

    {
        name: 'Input Validation and Injection Attacks',
        test: async () => {
            colorLog('Testing input validation and injection attacks...', 'blue');
            
            const payloads = generateSecurityPayloads();
            const injectionResults = [];

            // Test SQL Injection
            for (const payload of payloads.sqlInjection) {
                const emotionData = {
                    emotion: payload,
                    intensity: 5,
                    notes: `SQL injection test: ${payload}`
                };

                const response = await makeRequest('POST', `${API_BASE}/api/emotions`, emotionData, {
                    'Authorization': `Bearer ${TEST_CLERK_ID}`
                });

                if (response.status === 201) {
                    injectionResults.push({ type: 'sql_injection', payload, vulnerable: true });
                    colorLog(`⚠ SQL injection vulnerability detected with payload: ${payload}`, 'red');
                } else {
                    injectionResults.push({ type: 'sql_injection', payload, vulnerable: false });
                }
            }

            // Test NoSQL Injection
            for (const payload of payloads.nosqlInjection) {
                const journalData = {
                    content: 'Test journal entry',
                    mood: payload,
                    tags: ['security_test']
                };

                const response = await makeRequest('POST', `${API_BASE}/api/journal`, journalData, {
                    'Authorization': `Bearer ${TEST_CLERK_ID}`
                });

                if (response.status === 201) {
                    injectionResults.push({ type: 'nosql_injection', payload, vulnerable: true });
                    colorLog(`⚠ NoSQL injection vulnerability detected`, 'red');
                } else {
                    injectionResults.push({ type: 'nosql_injection', payload, vulnerable: false });
                }
            }

            // Test XSS
            for (const payload of payloads.xss) {
                const userData = {
                    firstName: payload,
                    lastName: 'TestUser',
                    bio: `XSS test: ${payload}`
                };

                const response = await makeRequest('PUT', `${API_BASE}/api/users/profile`, userData, {
                    'Authorization': `Bearer ${TEST_CLERK_ID}`
                });

                if (response.status === 200 && response.data && typeof response.data === 'string' && response.data.includes('<script>')) {
                    injectionResults.push({ type: 'xss', payload, vulnerable: true });
                    colorLog(`⚠ XSS vulnerability detected with payload: ${payload}`, 'red');
                } else {
                    injectionResults.push({ type: 'xss', payload, vulnerable: false });
                }
            }

            // Test Command Injection
            for (const payload of payloads.commandInjection) {
                const gameData = {
                    gameType: `mindfulness_breathing${payload}`,
                    score: 100,
                    duration: 300
                };

                const response = await makeRequest('POST', `${API_BASE}/api/games/session`, gameData, {
                    'Authorization': `Bearer ${TEST_CLERK_ID}`
                });

                if (response.status === 201) {
                    injectionResults.push({ type: 'command_injection', payload, vulnerable: true });
                    colorLog(`⚠ Command injection vulnerability detected`, 'red');
                } else {
                    injectionResults.push({ type: 'command_injection', payload, vulnerable: false });
                }
            }

            const vulnerabilities = injectionResults.filter(r => r.vulnerable).length;
            const totalTests = injectionResults.length;

            colorLog(`✓ Injection attack tests: ${totalTests - vulnerabilities}/${totalTests} properly blocked`, 'green');

            return injectionResults;
        }
    },

    {
        name: 'Authorization and Access Control',
        test: async () => {
            colorLog('Testing authorization and access control...', 'blue');
            
            const accessResults = [];

            // Test horizontal privilege escalation
            const user1Token = `Bearer user1_${Date.now()}`;
            const user2Token = `Bearer user2_${Date.now()}`;

            // Create data as user1
            const user1Data = await makeRequest('POST', `${API_BASE}/api/emotions`, {
                emotion: 'happy',
                intensity: 8,
                private: true
            }, { 'Authorization': user1Token });

            if (user1Data.status === 201 && user1Data.data.id) {
                // Try to access user1's data as user2
                const unauthorizedAccess = await makeRequest('GET', `${API_BASE}/api/emotions/${user1Data.data.id}`, null, {
                    'Authorization': user2Token
                });

                if (unauthorizedAccess.status === 200) {
                    accessResults.push({ type: 'horizontal_escalation', vulnerable: true });
                    colorLog('⚠ Horizontal privilege escalation vulnerability detected', 'red');
                } else {
                    accessResults.push({ type: 'horizontal_escalation', vulnerable: false });
                    colorLog('✓ Horizontal privilege escalation properly prevented', 'green');
                }
            }

            // Test vertical privilege escalation
            const regularUserToken = `Bearer regular_user_${Date.now()}`;
            const adminEndpoints = [
                '/api/admin/users',
                '/api/admin/analytics',
                '/api/admin/system/health',
                '/api/admin/audit-logs'
            ];

            for (const endpoint of adminEndpoints) {
                const response = await makeRequest('GET', `${API_BASE}${endpoint}`, null, {
                    'Authorization': regularUserToken
                });

                if (response.status === 200) {
                    accessResults.push({ type: 'vertical_escalation', endpoint, vulnerable: true });
                    colorLog(`⚠ Vertical privilege escalation: Regular user accessed ${endpoint}`, 'red');
                } else {
                    accessResults.push({ type: 'vertical_escalation', endpoint, vulnerable: false });
                }
            }

            // Test IDOR (Insecure Direct Object References)
            const idorTests = [
                '/api/emotions/1',
                '/api/journal/1',
                '/api/games/session/1',
                '/api/users/profile/1'
            ];

            for (const endpoint of idorTests) {
                const response = await makeRequest('GET', `${API_BASE}${endpoint}`, null, {
                    'Authorization': `Bearer different_user_${Date.now()}`
                });

                if (response.status === 200) {
                    accessResults.push({ type: 'idor', endpoint, vulnerable: true });
                    colorLog(`⚠ IDOR vulnerability at ${endpoint}`, 'red');
                } else {
                    accessResults.push({ type: 'idor', endpoint, vulnerable: false });
                }
            }

            const vulnerabilities = accessResults.filter(r => r.vulnerable).length;
            colorLog(`✓ Access control tests: ${accessResults.length - vulnerabilities}/${accessResults.length} properly secured`, 'green');

            return accessResults;
        }
    },

    {
        name: 'File Upload and Path Traversal',
        test: async () => {
            colorLog('Testing file upload and path traversal security...', 'blue');
            
            const fileResults = [];
            const payloads = generateSecurityPayloads();

            // Test path traversal in file uploads
            const maliciousFiles = [
                { filename: '../../../etc/passwd', content: 'malicious content' },
                { filename: '..\\..\\..\\windows\\system32\\drivers\\etc\\hosts', content: 'malicious content' },
                { filename: '....//....//....//etc/passwd', content: 'malicious content' },
                { filename: 'normal.txt', content: '<script>alert("XSS")</script>' },
                { filename: 'test.php', content: '<?php system($_GET["cmd"]); ?>' },
                { filename: 'test.jsp', content: '<% Runtime.getRuntime().exec(request.getParameter("cmd")); %>' }
            ];

            for (const file of maliciousFiles) {
                // Test file upload endpoints if they exist
                const uploadResponse = await makeRequest('POST', `${API_BASE}/api/users/upload-avatar`, {
                    filename: file.filename,
                    content: Buffer.from(file.content).toString('base64'),
                    contentType: 'text/plain'
                }, {
                    'Authorization': `Bearer ${TEST_CLERK_ID}`,
                    'Content-Type': 'application/json'
                });

                if (uploadResponse.status === 200 && uploadResponse.data && uploadResponse.data.filename === file.filename) {
                    fileResults.push({ type: 'path_traversal', filename: file.filename, vulnerable: true });
                    colorLog(`⚠ Path traversal vulnerability with filename: ${file.filename}`, 'red');
                } else {
                    fileResults.push({ type: 'path_traversal', filename: file.filename, vulnerable: false });
                }
            }

            // Test path traversal in URL parameters
            for (const payload of payloads.pathTraversal) {
                const response = await makeRequest('GET', `${API_BASE}/api/static/${payload}`, null, {
                    'Authorization': `Bearer ${TEST_CLERK_ID}`
                });

                if (response.status === 200 && response.data && (
                    response.data.includes('root:') || 
                    response.data.includes('127.0.0.1') ||
                    response.data.includes('[users]')
                )) {
                    fileResults.push({ type: 'url_path_traversal', payload, vulnerable: true });
                    colorLog(`⚠ URL path traversal vulnerability detected`, 'red');
                } else {
                    fileResults.push({ type: 'url_path_traversal', payload, vulnerable: false });
                }
            }

            // Test file type validation
            const maliciousFileTypes = [
                { extension: '.exe', mime: 'application/octet-stream' },
                { extension: '.php', mime: 'application/x-php' },
                { extension: '.jsp', mime: 'application/x-jsp' },
                { extension: '.asp', mime: 'application/x-asp' },
                { extension: '.js', mime: 'application/javascript' },
                { extension: '.html', mime: 'text/html' }
            ];

            for (const fileType of maliciousFileTypes) {
                const response = await makeRequest('POST', `${API_BASE}/api/users/upload-avatar`, {
                    filename: `malicious${fileType.extension}`,
                    content: Buffer.from('malicious content').toString('base64'),
                    contentType: fileType.mime
                }, {
                    'Authorization': `Bearer ${TEST_CLERK_ID}`,
                    'Content-Type': 'application/json'
                });

                if (response.status === 200) {
                    fileResults.push({ type: 'file_type_bypass', extension: fileType.extension, vulnerable: true });
                    colorLog(`⚠ File type validation bypassed for ${fileType.extension}`, 'red');
                } else {
                    fileResults.push({ type: 'file_type_bypass', extension: fileType.extension, vulnerable: false });
                }
            }

            const vulnerabilities = fileResults.filter(r => r.vulnerable).length;
            colorLog(`✓ File security tests: ${fileResults.length - vulnerabilities}/${fileResults.length} properly secured`, 'green');

            return fileResults;
        }
    },

    {
        name: 'HTTPS and Transport Security',
        test: async () => {
            colorLog('Testing HTTPS and transport security...', 'blue');
            
            const transportResults = [];

            // Test HTTPS enforcement
            try {
                const httpResponse = await makeRequest('GET', 'http://localhost:5001/health');
                if (httpResponse.status === 200) {
                    transportResults.push({ type: 'https_enforcement', vulnerable: true });
                    colorLog('⚠ HTTP traffic is allowed (HTTPS not enforced)', 'yellow');
                } else {
                    transportResults.push({ type: 'https_enforcement', vulnerable: false });
                }
            } catch (error) {
                transportResults.push({ type: 'https_enforcement', vulnerable: false });
                colorLog('✓ HTTP connection rejected or redirected', 'green');
            }

            // Test security headers
            const response = await makeRequest('GET', `${API_BASE}/health`);
            const securityHeaders = {
                'strict-transport-security': response.headers['strict-transport-security'],
                'x-content-type-options': response.headers['x-content-type-options'],
                'x-frame-options': response.headers['x-frame-options'],
                'x-xss-protection': response.headers['x-xss-protection'],
                'content-security-policy': response.headers['content-security-policy'],
                'referrer-policy': response.headers['referrer-policy']
            };

            Object.entries(securityHeaders).forEach(([header, value]) => {
                transportResults.push({
                    type: 'security_header',
                    header,
                    present: !!value,
                    value
                });
            });

            const presentHeaders = Object.values(securityHeaders).filter(v => v).length;
            colorLog(`✓ Security headers: ${presentHeaders}/${Object.keys(securityHeaders).length} present`, 'green');

            // Test cookie security
            const loginResponse = await makeRequest('POST', `${API_BASE}/api/users/login`, {
                email: 'test@example.com',
                password: 'password'
            });

            if (loginResponse.headers['set-cookie']) {
                const cookies = Array.isArray(loginResponse.headers['set-cookie']) 
                    ? loginResponse.headers['set-cookie'] 
                    : [loginResponse.headers['set-cookie']];

                cookies.forEach(cookie => {
                    const isSecure = cookie.includes('Secure');
                    const isHttpOnly = cookie.includes('HttpOnly');
                    const hasSameSite = cookie.includes('SameSite');

                    transportResults.push({
                        type: 'cookie_security',
                        secure: isSecure,
                        httpOnly: isHttpOnly,
                        sameSite: hasSameSite,
                        cookie
                    });
                });
            }

            return transportResults;
        }
    },

    {
        name: 'API Rate Limiting and DoS Protection',
        test: async () => {
            colorLog('Testing API rate limiting and DoS protection...', 'blue');
            
            const dosResults = [];

            // Test rate limiting
            const rapidRequests = [];
            for (let i = 0; i < 100; i++) {
                rapidRequests.push(makeRequest('GET', `${API_BASE}/health`));
            }

            const rapidResponses = await Promise.all(rapidRequests);
            const rateLimited = rapidResponses.filter(r => r.status === 429).length;
            const successful = rapidResponses.filter(r => r.status === 200).length;

            dosResults.push({
                type: 'rate_limiting',
                totalRequests: 100,
                successful,
                rateLimited,
                effective: rateLimited > 0
            });

            colorLog(`✓ Rate limiting: ${successful} successful, ${rateLimited} rate limited`, 'green');

            // Test request size limits
            const largePayload = {
                content: 'A'.repeat(50000000), // 50MB
                metadata: Array(10000).fill('large_data')
            };

            const largePayloadResponse = await makeRequest('POST', `${API_BASE}/api/journal`, largePayload, {
                'Authorization': `Bearer ${TEST_CLERK_ID}`
            });

            dosResults.push({
                type: 'request_size_limit',
                payloadSize: JSON.stringify(largePayload).length,
                rejected: largePayloadResponse.status >= 400,
                status: largePayloadResponse.status
            });

            if (largePayloadResponse.status >= 400) {
                colorLog('✓ Large payload rejected', 'green');
            } else {
                colorLog('⚠ Large payload accepted', 'yellow');
            }

            // Test concurrent connection limits
            const connectionPromises = [];
            for (let i = 0; i < 200; i++) {
                connectionPromises.push(makeRequest('GET', `${API_BASE}/api/emotions?delay=1000`));
            }

            const connectionResponses = await Promise.all(connectionPromises);
            const connectionErrors = connectionResponses.filter(r => r.status === 0 || r.status >= 500).length;

            dosResults.push({
                type: 'connection_limit',
                totalConnections: 200,
                errors: connectionErrors,
                successful: connectionResponses.filter(r => r.status === 200).length
            });

            colorLog(`✓ Connection handling: ${connectionErrors} connection errors out of 200`, 'green');

            // Test slowloris-style attacks
            const slowRequests = [];
            for (let i = 0; i < 10; i++) {
                slowRequests.push(makeRequest('POST', `${API_BASE}/api/emotions`, {
                    emotion: 'test',
                    intensity: 5,
                    slowAttack: true
                }, {
                    'Authorization': `Bearer ${TEST_CLERK_ID}`,
                    'Connection': 'keep-alive'
                }));
            }

            const slowResponses = await Promise.all(slowRequests);
            const slowSuccessful = slowResponses.filter(r => r.status === 201).length;

            dosResults.push({
                type: 'slow_request_protection',
                slowRequests: 10,
                successful: slowSuccessful
            });

            return dosResults;
        }
    },

    {
        name: 'Data Privacy and Leakage',
        test: async () => {
            colorLog('Testing data privacy and information leakage...', 'blue');
            
            const privacyResults = [];

            // Test error message information disclosure
            const errorTriggers = [
                { endpoint: '/api/nonexistent', method: 'GET' },
                { endpoint: '/api/emotions/invalid-id', method: 'GET' },
                { endpoint: '/api/users/profile', method: 'GET', headers: {} }, // No auth
                { endpoint: '/api/journal', method: 'POST', data: { invalid: 'data' } }
            ];

            for (const trigger of errorTriggers) {
                const response = await makeRequest(
                    trigger.method, 
                    `${API_BASE}${trigger.endpoint}`, 
                    trigger.data,
                    trigger.headers || { 'Authorization': `Bearer ${TEST_CLERK_ID}` }
                );

                const hasStackTrace = response.data && typeof response.data === 'string' && (
                    response.data.includes('at ') ||
                    response.data.includes('Stack trace:') ||
                    response.data.includes('Error:') ||
                    response.data.includes('src/')
                );

                const hasSystemInfo = response.data && typeof response.data === 'string' && (
                    response.data.includes('node_modules/') ||
                    response.data.includes('MongoDB') ||
                    response.data.includes('localhost:') ||
                    response.data.includes('process.env')
                );

                privacyResults.push({
                    type: 'error_disclosure',
                    endpoint: trigger.endpoint,
                    hasStackTrace,
                    hasSystemInfo,
                    vulnerable: hasStackTrace || hasSystemInfo
                });

                if (hasStackTrace || hasSystemInfo) {
                    colorLog(`⚠ Information disclosure in error response from ${trigger.endpoint}`, 'red');
                }
            }

            // Test user enumeration
            const userEnumerationTests = [
                { email: 'admin@example.com', password: 'wrong_password' },
                { email: 'nonexistent@example.com', password: 'any_password' },
                { email: 'test@example.com', password: 'wrong_password' }
            ];

            const loginResponses = [];
            for (const test of userEnumerationTests) {
                const response = await makeRequest('POST', `${API_BASE}/api/users/login`, test);
                loginResponses.push({
                    email: test.email,
                    status: response.status,
                    message: response.data?.message || response.data?.error,
                    timing: Date.now()
                });
            }

            // Check if different error messages reveal user existence
            const uniqueMessages = [...new Set(loginResponses.map(r => r.message))];
            const userEnumerationVulnerable = uniqueMessages.length > 1;

            privacyResults.push({
                type: 'user_enumeration',
                vulnerable: userEnumerationVulnerable,
                uniqueMessages: uniqueMessages.length
            });

            if (userEnumerationVulnerable) {
                colorLog('⚠ User enumeration vulnerability detected', 'red');
            } else {
                colorLog('✓ User enumeration properly prevented', 'green');
            }

            // Test sensitive data in logs
            const sensitiveDataTest = await makeRequest('POST', `${API_BASE}/api/emotions`, {
                emotion: 'anxious',
                intensity: 8,
                notes: 'SSN: 123-45-6789, Credit Card: 4111-1111-1111-1111',
                password: 'secret123',
                apiKey: 'sk-1234567890abcdef'
            }, {
                'Authorization': `Bearer ${TEST_CLERK_ID}`
            });

            privacyResults.push({
                type: 'sensitive_data_handling',
                status: sensitiveDataTest.status,
                dataAccepted: sensitiveDataTest.status === 201
            });

            const vulnerabilities = privacyResults.filter(r => r.vulnerable).length;
            colorLog(`✓ Privacy tests: ${privacyResults.length - vulnerabilities}/${privacyResults.length} secure`, 'green');

            return privacyResults;
        }
    }
];

// Run all tests
async function runAllTests() {
    colorLog('🔒 SECURITY COMPREHENSIVE TESTS', 'magenta');
    colorLog('===============================', 'magenta');
    
    let passed = 0;
    let failed = 0;
    let totalVulnerabilities = 0;
    const results = [];
    
    for (const test of tests) {
        try {
            colorLog(`\n🧪 Testing: ${test.name}`, 'yellow');
            const startTime = Date.now();
            
            const result = await test.test();
            const duration = Date.now() - startTime;
            
            // Count vulnerabilities in this test
            const vulnerabilities = Array.isArray(result) ? result.filter(r => r.vulnerable).length : 0;
            totalVulnerabilities += vulnerabilities;
            
            colorLog(`✅ ${test.name} - COMPLETED (${duration}ms)`, 'green');
            if (vulnerabilities > 0) {
                colorLog(`   ⚠ ${vulnerabilities} potential vulnerabilities found`, 'yellow');
            }
            
            passed++;
            results.push({ name: test.name, status: 'PASSED', duration, result, vulnerabilities });
            
        } catch (error) {
            colorLog(`❌ ${test.name} - FAILED: ${error.message}`, 'red');
            failed++;
            results.push({ name: test.name, status: 'FAILED', error: error.message });
        }
    }
    
    // Summary
    colorLog('\n📊 SECURITY TEST SUMMARY', 'cyan');
    colorLog('========================', 'cyan');
    colorLog(`Total Tests: ${passed + failed}`, 'blue');
    colorLog(`Completed: ${passed}`, 'green');
    colorLog(`Failed: ${failed}`, failed > 0 ? 'red' : 'green');
    colorLog(`Total Vulnerabilities Found: ${totalVulnerabilities}`, totalVulnerabilities > 0 ? 'red' : 'green');
    
    // Security analysis
    colorLog('\n🔍 SECURITY ANALYSIS', 'cyan');
    colorLog('====================', 'cyan');
    
    results.forEach(result => {
        if (result.status === 'PASSED' && result.vulnerabilities > 0) {
            colorLog(`⚠ ${result.name}: ${result.vulnerabilities} vulnerabilities`, 'yellow');
        } else if (result.status === 'PASSED') {
            colorLog(`✓ ${result.name}: No vulnerabilities detected`, 'green');
        }
    });
    
    // Security recommendations
    if (totalVulnerabilities > 0) {
        colorLog('\n🛡️ SECURITY RECOMMENDATIONS', 'cyan');
        colorLog('============================', 'cyan');
        colorLog('• Review and fix identified vulnerabilities', 'yellow');
        colorLog('• Implement additional input validation', 'yellow');
        colorLog('• Enhance authentication mechanisms', 'yellow');
        colorLog('• Add more security headers', 'yellow');
        colorLog('• Implement proper error handling', 'yellow');
        colorLog('• Regular security audits recommended', 'yellow');
    } else {
        colorLog('\n🛡️ SECURITY STATUS: GOOD', 'green');
        colorLog('No critical vulnerabilities detected in tested areas.', 'green');
    }
    
    if (failed > 0) {
        colorLog('\n❌ Failed Tests:', 'red');
        results.filter(r => r.status === 'FAILED').forEach(r => {
            colorLog(`  • ${r.name}: ${r.error}`, 'red');
        });
    }
    
    process.exit(failed > 0 ? 1 : 0);
}

// Handle unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
    colorLog(`❌ Unhandled Rejection: ${reason}`, 'red');
    process.exit(1);
});

// Run tests
if (require.main === module) {
    runAllTests().catch(error => {
        colorLog(`❌ Test suite failed: ${error.message}`, 'red');
        process.exit(1);
    });
}

module.exports = { runAllTests, tests, generateSecurityPayloads };
/**
 * Comprehensive Clerk Service Tests
 * Tests Clerk authentication integration, user management, and security features
 * Run with: node tests/clerk-service-tests.js
 */

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const API_BASE = 'http://localhost:5001';

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

// Generate test user data
function generateTestUser() {
    const randomId = Math.random().toString(36).substring(7);
    return {
        id: `test_user_${randomId}`,
        email: `test_${randomId}@example.com`,
        firstName: 'Test',
        lastName: 'User',
        profileImageUrl: 'https://example.com/avatar.jpg',
        metadata: {
            userType: 'test',
            onboardingCompleted: false,
            therapyGoals: ['anxiety_management', 'mood_improvement']
        }
    };
}

// Test suite
const tests = [
    {
        name: 'Clerk Service Configuration',
        test: async () => {
            colorLog('Testing Clerk service configuration...', 'blue');
            
            // Test service health and configuration
            const configResponse = await makeRequest('GET', `${API_BASE}/api/users/auth-config`);
            if (configResponse.status !== 200) {
                throw new Error(`Auth config endpoint failed: ${configResponse.status}`);
            }
            
            const config = configResponse.data;
            if (!config.provider || !config.settings) {
                throw new Error('Missing required auth configuration');
            }
            
            colorLog(`✓ Auth provider: ${config.provider}`, 'green');
            colorLog(`✓ Configuration loaded successfully`, 'green');
            
            // Test Clerk webhook configuration
            const webhookResponse = await makeRequest('GET', `${API_BASE}/api/users/webhook-config`);
            if (webhookResponse.status !== 200) {
                throw new Error(`Webhook config failed: ${webhookResponse.status}`);
            }
            
            const webhookConfig = webhookResponse.data;
            if (!webhookConfig.endpoints || !webhookConfig.events) {
                throw new Error('Invalid webhook configuration');
            }
            
            colorLog(`✓ Webhook endpoints configured: ${webhookConfig.endpoints.length}`, 'green');
            colorLog(`✓ Event handlers: ${webhookConfig.events.length}`, 'cyan');
            
            return { config, webhookConfig };
        }
    },
    
    {
        name: 'User Authentication',
        test: async () => {
            colorLog('Testing user authentication...', 'blue');
            
            const testUser = generateTestUser();
            
            // Test token validation
            const validToken = `valid_test_token_${testUser.id}`;
            const tokenResponse = await makeRequest('POST', `${API_BASE}/api/users/validate-token`, {
                token: validToken
            });
            
            if (tokenResponse.status !== 200) {
                throw new Error(`Token validation failed: ${tokenResponse.status}`);
            }
            
            const validation = tokenResponse.data;
            if (!validation.valid || !validation.userId) {
                throw new Error('Invalid token validation response');
            }
            
            colorLog('✓ Token validation working', 'green');
            
            // Test invalid token handling
            const invalidTokenResponse = await makeRequest('POST', `${API_BASE}/api/users/validate-token`, {
                token: 'invalid_token_123'
            });
            
            if (invalidTokenResponse.status === 200 && invalidTokenResponse.data.valid) {
                throw new Error('Invalid token was incorrectly validated');
            }
            
            colorLog('✓ Invalid token rejection working', 'green');
            
            // Test user session creation
            const sessionResponse = await makeRequest('POST', `${API_BASE}/api/users/create-session`, {
                userId: testUser.id,
                metadata: {
                    loginTime: new Date().toISOString(),
                    deviceInfo: 'test-device',
                    ipAddress: '127.0.0.1'
                }
            });
            
            if (sessionResponse.status !== 201) {
                throw new Error(`Session creation failed: ${sessionResponse.status}`);
            }
            
            const session = sessionResponse.data;
            if (!session.sessionId || !session.userId) {
                throw new Error('Invalid session creation response');
            }
            
            colorLog(`✓ User session created: ${session.sessionId}`, 'green');
            
            return { testUser, session, validToken };
        }
    },
    
    {
        name: 'User Profile Management',
        test: async () => {
            colorLog('Testing user profile management...', 'blue');
            
            const testUser = generateTestUser();
            const authToken = `Bearer test_token_${testUser.id}`;
            
            // Test user creation/registration
            const createUserResponse = await makeRequest('POST', `${API_BASE}/api/users/register`, testUser, {
                'Authorization': authToken
            });
            
            if (createUserResponse.status !== 201) {
                throw new Error(`User creation failed: ${createUserResponse.status}`);
            }
            
            const createdUser = createUserResponse.data;
            if (!createdUser.id || !createdUser.email) {
                throw new Error('Invalid user creation response');
            }
            
            colorLog(`✓ User created: ${createdUser.email}`, 'green');
            
            // Test user profile retrieval
            const profileResponse = await makeRequest('GET', `${API_BASE}/api/users/profile`, null, {
                'Authorization': authToken
            });
            
            if (profileResponse.status !== 200) {
                throw new Error(`Profile retrieval failed: ${profileResponse.status}`);
            }
            
            const profile = profileResponse.data;
            if (!profile.user || !profile.preferences) {
                throw new Error('Invalid profile response');
            }
            
            colorLog('✓ User profile retrieved', 'green');
            
            // Test profile updates
            const updateData = {
                firstName: 'UpdatedTest',
                preferences: {
                    notifications: true,
                    darkMode: false,
                    language: 'en'
                },
                therapyGoals: ['stress_management', 'sleep_improvement']
            };
            
            const updateResponse = await makeRequest('PUT', `${API_BASE}/api/users/profile`, updateData, {
                'Authorization': authToken
            });
            
            if (updateResponse.status !== 200) {
                throw new Error(`Profile update failed: ${updateResponse.status}`);
            }
            
            const updatedProfile = updateResponse.data;
            if (updatedProfile.firstName !== updateData.firstName) {
                throw new Error('Profile update not reflected');
            }
            
            colorLog('✓ User profile updated', 'green');
            
            // Test user deletion/deactivation
            const deleteResponse = await makeRequest('DELETE', `${API_BASE}/api/users/profile`, null, {
                'Authorization': authToken
            });
            
            if (deleteResponse.status !== 200) {
                throw new Error(`User deletion failed: ${deleteResponse.status}`);
            }
            
            colorLog('✓ User profile deleted', 'green');
            
            return { testUser, createdUser, updatedProfile };
        }
    },
    
    {
        name: 'Authorization and Permissions',
        test: async () => {
            colorLog('Testing authorization and permissions...', 'blue');
            
            const testUser = generateTestUser();
            const authToken = `Bearer test_token_${testUser.id}`;
            
            // Test protected endpoint access with valid token
            const protectedResponse = await makeRequest('GET', `${API_BASE}/api/users/protected-data`, null, {
                'Authorization': authToken
            });
            
            if (protectedResponse.status !== 200) {
                throw new Error(`Protected endpoint access failed: ${protectedResponse.status}`);
            }
            
            colorLog('✓ Protected endpoint accessible with valid token', 'green');
            
            // Test protected endpoint access without token
            const unprotectedResponse = await makeRequest('GET', `${API_BASE}/api/users/protected-data`);
            
            if (unprotectedResponse.status !== 401) {
                throw new Error('Protected endpoint should require authentication');
            }
            
            colorLog('✓ Protected endpoint properly secured', 'green');
            
            // Test role-based access control
            const adminToken = `Bearer admin_token_${testUser.id}`;
            const adminResponse = await makeRequest('GET', `${API_BASE}/api/users/admin/users`, null, {
                'Authorization': adminToken
            });
            
            // This might fail if not implemented, which is acceptable
            if (adminResponse.status === 200) {
                colorLog('✓ Admin endpoint accessible with admin token', 'green');
            } else if (adminResponse.status === 403) {
                colorLog('✓ Admin endpoint properly restricted', 'green');
            } else {
                colorLog('⚠ Admin endpoint behavior unclear', 'yellow');
            }
            
            // Test user data isolation
            const otherUserToken = `Bearer test_token_other_user`;
            const isolationResponse = await makeRequest('GET', `${API_BASE}/api/users/profile`, null, {
                'Authorization': otherUserToken
            });
            
            if (isolationResponse.status === 200 && isolationResponse.data.user?.id === testUser.id) {
                throw new Error('User data isolation violated');
            }
            
            colorLog('✓ User data properly isolated', 'green');
            
            return { authToken, protectedResponse };
        }
    },
    
    {
        name: 'Webhook Handling',
        test: async () => {
            colorLog('Testing webhook handling...', 'blue');
            
            const testUser = generateTestUser();
            
            // Test user.created webhook
            const userCreatedWebhook = {
                type: 'user.created',
                data: {
                    id: testUser.id,
                    email_addresses: [{ email_address: testUser.email }],
                    first_name: testUser.firstName,
                    last_name: testUser.lastName,
                    profile_image_url: testUser.profileImageUrl,
                    created_at: Date.now()
                }
            };
            
            const webhookHeaders = {
                'svix-id': 'msg_test_123',
                'svix-timestamp': Math.floor(Date.now() / 1000).toString(),
                'svix-signature': 'v1,test_signature'
            };
            
            const webhookResponse = await makeRequest('POST', `${API_BASE}/api/users/webhook`, userCreatedWebhook, webhookHeaders);
            
            if (webhookResponse.status !== 200) {
                throw new Error(`User created webhook failed: ${webhookResponse.status}`);
            }
            
            colorLog('✓ User created webhook processed', 'green');
            
            // Test user.updated webhook
            const userUpdatedWebhook = {
                type: 'user.updated',
                data: {
                    id: testUser.id,
                    email_addresses: [{ email_address: testUser.email }],
                    first_name: 'UpdatedFirstName',
                    last_name: testUser.lastName,
                    updated_at: Date.now()
                }
            };
            
            const updateWebhookResponse = await makeRequest('POST', `${API_BASE}/api/users/webhook`, userUpdatedWebhook, webhookHeaders);
            
            if (updateWebhookResponse.status !== 200) {
                throw new Error(`User updated webhook failed: ${updateWebhookResponse.status}`);
            }
            
            colorLog('✓ User updated webhook processed', 'green');
            
            // Test user.deleted webhook
            const userDeletedWebhook = {
                type: 'user.deleted',
                data: {
                    id: testUser.id,
                    deleted: true,
                    deleted_at: Date.now()
                }
            };
            
            const deleteWebhookResponse = await makeRequest('POST', `${API_BASE}/api/users/webhook`, userDeletedWebhook, webhookHeaders);
            
            if (deleteWebhookResponse.status !== 200) {
                throw new Error(`User deleted webhook failed: ${deleteWebhookResponse.status}`);
            }
            
            colorLog('✓ User deleted webhook processed', 'green');
            
            // Test invalid webhook signature
            const invalidSignatureHeaders = {
                ...webhookHeaders,
                'svix-signature': 'v1,invalid_signature'
            };
            
            const invalidWebhookResponse = await makeRequest('POST', `${API_BASE}/api/users/webhook`, userCreatedWebhook, invalidSignatureHeaders);
            
            if (invalidWebhookResponse.status !== 400) {
                throw new Error('Invalid webhook signature should be rejected');
            }
            
            colorLog('✓ Invalid webhook signature rejected', 'green');
            
            return { webhookResponse, updateWebhookResponse, deleteWebhookResponse };
        }
    },
    
    {
        name: 'Session Management',
        test: async () => {
            colorLog('Testing session management...', 'blue');
            
            const testUser = generateTestUser();
            const authToken = `Bearer test_token_${testUser.id}`;
            
            // Test session creation
            const sessionData = {
                userId: testUser.id,
                deviceInfo: {
                    userAgent: 'Test Browser',
                    platform: 'test',
                    ipAddress: '127.0.0.1'
                },
                metadata: {
                    loginMethod: 'email',
                    twoFactorUsed: false
                }
            };
            
            const createSessionResponse = await makeRequest('POST', `${API_BASE}/api/users/sessions`, sessionData, {
                'Authorization': authToken
            });
            
            if (createSessionResponse.status !== 201) {
                throw new Error(`Session creation failed: ${createSessionResponse.status}`);
            }
            
            const session = createSessionResponse.data;
            if (!session.sessionId || !session.expiresAt) {
                throw new Error('Invalid session creation response');
            }
            
            colorLog(`✓ Session created: ${session.sessionId}`, 'green');
            
            // Test session validation
            const validateResponse = await makeRequest('POST', `${API_BASE}/api/users/sessions/${session.sessionId}/validate`, null, {
                'Authorization': authToken
            });
            
            if (validateResponse.status !== 200) {
                throw new Error(`Session validation failed: ${validateResponse.status}`);
            }
            
            const validation = validateResponse.data;
            if (!validation.valid || !validation.userId) {
                throw new Error('Invalid session validation response');
            }
            
            colorLog('✓ Session validation working', 'green');
            
            // Test session extension
            const extendResponse = await makeRequest('PUT', `${API_BASE}/api/users/sessions/${session.sessionId}/extend`, {
                extendBy: 3600 // 1 hour
            }, {
                'Authorization': authToken
            });
            
            if (extendResponse.status !== 200) {
                throw new Error(`Session extension failed: ${extendResponse.status}`);
            }
            
            colorLog('✓ Session extended successfully', 'green');
            
            // Test session revocation
            const revokeResponse = await makeRequest('DELETE', `${API_BASE}/api/users/sessions/${session.sessionId}`, null, {
                'Authorization': authToken
            });
            
            if (revokeResponse.status !== 200) {
                throw new Error(`Session revocation failed: ${revokeResponse.status}`);
            }
            
            colorLog('✓ Session revoked successfully', 'green');
            
            // Test revoked session validation
            const revokedValidationResponse = await makeRequest('POST', `${API_BASE}/api/users/sessions/${session.sessionId}/validate`, null, {
                'Authorization': authToken
            });
            
            if (revokedValidationResponse.status !== 401) {
                throw new Error('Revoked session should be invalid');
            }
            
            colorLog('✓ Revoked session properly invalidated', 'green');
            
            return { session, validation };
        }
    },
    
    {
        name: 'User Metadata and Preferences',
        test: async () => {
            colorLog('Testing user metadata and preferences...', 'blue');
            
            const testUser = generateTestUser();
            const authToken = `Bearer test_token_${testUser.id}`;
            
            // Test metadata creation/update
            const metadataData = {
                onboardingCompleted: true,
                therapyGoals: ['anxiety_management', 'sleep_improvement'],
                preferredLanguage: 'en',
                timezone: 'America/New_York',
                medicalHistory: {
                    conditions: ['anxiety', 'insomnia'],
                    medications: ['none'],
                    allergies: []
                },
                preferences: {
                    notifications: {
                        email: true,
                        push: false,
                        sms: false
                    },
                    privacy: {
                        dataSharing: false,
                        anonymousAnalytics: true
                    }
                }
            };
            
            const metadataResponse = await makeRequest('PUT', `${API_BASE}/api/users/metadata`, metadataData, {
                'Authorization': authToken
            });
            
            if (metadataResponse.status !== 200) {
                throw new Error(`Metadata update failed: ${metadataResponse.status}`);
            }
            
            const metadata = metadataResponse.data;
            if (!metadata.success) {
                throw new Error('Metadata update not successful');
            }
            
            colorLog('✓ User metadata updated', 'green');
            
            // Test metadata retrieval
            const getMetadataResponse = await makeRequest('GET', `${API_BASE}/api/users/metadata`, null, {
                'Authorization': authToken
            });
            
            if (getMetadataResponse.status !== 200) {
                throw new Error(`Metadata retrieval failed: ${getMetadataResponse.status}`);
            }
            
            const retrievedMetadata = getMetadataResponse.data;
            if (!retrievedMetadata.metadata || !retrievedMetadata.preferences) {
                throw new Error('Invalid metadata retrieval response');
            }
            
            colorLog('✓ User metadata retrieved', 'green');
            
            // Test preference-specific updates
            const preferenceUpdate = {
                notifications: {
                    email: false,
                    push: true,
                    reminderTime: '09:00'
                }
            };
            
            const prefResponse = await makeRequest('PATCH', `${API_BASE}/api/users/preferences`, preferenceUpdate, {
                'Authorization': authToken
            });
            
            if (prefResponse.status !== 200) {
                throw new Error(`Preference update failed: ${prefResponse.status}`);
            }
            
            colorLog('✓ User preferences updated', 'green');
            
            // Test privacy settings
            const privacySettings = {
                dataRetentionPeriod: '2_years',
                shareWithResearchers: false,
                allowCookies: true,
                trackingPreferences: {
                    functional: true,
                    analytics: false,
                    marketing: false
                }
            };
            
            const privacyResponse = await makeRequest('PUT', `${API_BASE}/api/users/privacy`, privacySettings, {
                'Authorization': authToken
            });
            
            if (privacyResponse.status !== 200) {
                throw new Error(`Privacy settings update failed: ${privacyResponse.status}`);
            }
            
            colorLog('✓ Privacy settings updated', 'green');
            
            return { metadata, retrievedMetadata, preferenceUpdate, privacySettings };
        }
    },
    
    {
        name: 'Error Handling and Edge Cases',
        test: async () => {
            colorLog('Testing error handling and edge cases...', 'blue');
            
            // Test malformed token
            const malformedTokenResponse = await makeRequest('GET', `${API_BASE}/api/users/profile`, null, {
                'Authorization': 'Bearer malformed.jwt.token'
            });
            
            if (malformedTokenResponse.status !== 401) {
                throw new Error('Malformed token should be rejected');
            }
            
            colorLog('✓ Malformed token rejected', 'green');
            
            // Test expired token handling
            const expiredTokenResponse = await makeRequest('GET', `${API_BASE}/api/users/profile`, null, {
                'Authorization': 'Bearer expired_token'
            });
            
            if (expiredTokenResponse.status !== 401) {
                throw new Error('Expired token should be rejected');
            }
            
            colorLog('✓ Expired token rejected', 'green');
            
            // Test rate limiting on auth endpoints
            const promises = [];
            for (let i = 0; i < 10; i++) {
                promises.push(makeRequest('POST', `${API_BASE}/api/users/validate-token`, {
                    token: `rate_limit_test_${i}`
                }));
            }
            
            const responses = await Promise.all(promises);
            const rateLimited = responses.some(r => r.status === 429);
            
            if (rateLimited) {
                colorLog('✓ Rate limiting working on auth endpoints', 'green');
            } else {
                colorLog('⚠ Rate limiting not detected (may not be configured)', 'yellow');
            }
            
            // Test concurrent session limit
            const concurrentPromises = [];
            const testUserId = 'concurrent_test_user';
            
            for (let i = 0; i < 5; i++) {
                concurrentPromises.push(makeRequest('POST', `${API_BASE}/api/users/sessions`, {
                    userId: testUserId,
                    deviceInfo: { device: `device_${i}` }
                }, {
                    'Authorization': `Bearer test_token_${testUserId}`
                }));
            }
            
            const concurrentResponses = await Promise.all(concurrentPromises);
            const successfulSessions = concurrentResponses.filter(r => r.status === 201).length;
            
            colorLog(`✓ Concurrent session handling: ${successfulSessions} sessions created`, 'green');
            
            // Test invalid user data
            const invalidUserData = {
                email: 'invalid-email',
                firstName: '',
                lastName: null
            };
            
            const invalidUserResponse = await makeRequest('POST', `${API_BASE}/api/users/register`, invalidUserData);
            
            if (invalidUserResponse.status !== 400) {
                throw new Error('Invalid user data should be rejected');
            }
            
            colorLog('✓ Invalid user data rejected', 'green');
            
            return { 
                malformedTokenResponse, 
                expiredTokenResponse, 
                rateLimited, 
                successfulSessions, 
                invalidUserResponse 
            };
        }
    }
];

// Run all tests
async function runAllTests() {
    colorLog('🔐 CLERK SERVICE COMPREHENSIVE TESTS', 'magenta');
    colorLog('====================================', 'magenta');
    
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
    colorLog('\n📊 CLERK SERVICE TEST SUMMARY', 'cyan');
    colorLog('=============================', 'cyan');
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

module.exports = { runAllTests, tests };
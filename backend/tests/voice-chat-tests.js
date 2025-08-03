/**
 * Comprehensive Voice Chat Tests
 * Tests WebSocket connections, audio processing, and real-time communication
 * Run with: node tests/voice-chat-tests.js
 */

const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');
const http = require('http');

const API_BASE = 'http://localhost:5001';
const WS_BASE = 'ws://localhost:5001';
const TEST_USER_ID = 'test_voice_user_123';

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
                'Authorization': `Bearer ${TEST_USER_ID}`,
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
                    resolve({ status: res.statusCode, data: parsed });
                } catch (e) {
                    resolve({ status: res.statusCode, data: responseData });
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

// Create test audio buffer
function createTestAudioBuffer() {
    const sampleRate = 44100;
    const duration = 2; // 2 seconds
    const samples = sampleRate * duration;
    const buffer = Buffer.alloc(samples * 2); // 16-bit samples
    
    // Generate a simple sine wave
    for (let i = 0; i < samples; i++) {
        const sample = Math.sin(2 * Math.PI * 440 * i / sampleRate) * 32767;
        buffer.writeInt16LE(sample, i * 2);
    }
    
    return buffer;
}

// Test suite
const tests = [
    {
        name: 'Voice Chat HTTP Endpoints',
        test: async () => {
            colorLog('Testing voice chat configuration endpoint...', 'blue');
            
            const configResponse = await makeRequest('GET', `${API_BASE}/api/voice-chat/config`);
            if (configResponse.status !== 200) {
                throw new Error(`Config endpoint failed: ${configResponse.status}`);
            }
            
            colorLog('✓ Voice chat config endpoint working', 'green');
            
            // Test supported formats endpoint
            const formatsResponse = await makeRequest('GET', `${API_BASE}/api/voice-chat/supported-formats`);
            if (formatsResponse.status !== 200) {
                throw new Error(`Supported formats endpoint failed: ${formatsResponse.status}`);
            }
            
            colorLog('✓ Supported formats endpoint working', 'green');
            
            // Test session creation
            const sessionData = {
                sessionType: 'therapy',
                duration: 30,
                topic: 'anxiety_management'
            };
            
            const sessionResponse = await makeRequest('POST', `${API_BASE}/api/voice-chat/session`, sessionData);
            if (sessionResponse.status !== 201) {
                throw new Error(`Session creation failed: ${sessionResponse.status}`);
            }
            
            colorLog('✓ Voice chat session creation working', 'green');
            return sessionResponse.data.sessionId;
        }
    },
    
    {
        name: 'WebSocket Connection',
        test: async () => {
            return new Promise((resolve, reject) => {
                colorLog('Testing WebSocket connection...', 'blue');
                
                const ws = new WebSocket(`${WS_BASE}/ws/voice-chat`);
                let connected = false;
                
                const timeout = setTimeout(() => {
                    if (!connected) {
                        ws.close();
                        reject(new Error('WebSocket connection timeout'));
                    }
                }, 10000);
                
                ws.on('open', () => {
                    connected = true;
                    clearTimeout(timeout);
                    colorLog('✓ WebSocket connection established', 'green');
                    
                    // Test authentication
                    ws.send(JSON.stringify({
                        type: 'auth',
                        token: TEST_USER_ID
                    }));
                });
                
                ws.on('message', (data) => {
                    try {
                        const message = JSON.parse(data);
                        if (message.type === 'auth_success') {
                            colorLog('✓ WebSocket authentication successful', 'green');
                            ws.close();
                            resolve();
                        } else if (message.type === 'auth_error') {
                            ws.close();
                            reject(new Error(`Authentication failed: ${message.error}`));
                        }
                    } catch (e) {
                        // Binary data or non-JSON message
                        colorLog('✓ Received binary/non-JSON message', 'green');
                    }
                });
                
                ws.on('error', (error) => {
                    clearTimeout(timeout);
                    reject(new Error(`WebSocket error: ${error.message}`));
                });
                
                ws.on('close', () => {
                    if (connected) {
                        colorLog('✓ WebSocket connection closed properly', 'green');
                    }
                });
            });
        }
    },
    
    {
        name: 'Audio Processing',
        test: async () => {
            return new Promise((resolve, reject) => {
                colorLog('Testing audio processing...', 'blue');
                
                const ws = new WebSocket(`${WS_BASE}/ws/voice-chat`);
                let authenticated = false;
                
                const timeout = setTimeout(() => {
                    ws.close();
                    reject(new Error('Audio processing test timeout'));
                }, 15000);
                
                ws.on('open', () => {
                    // Authenticate first
                    ws.send(JSON.stringify({
                        type: 'auth',
                        token: TEST_USER_ID
                    }));
                });
                
                ws.on('message', (data) => {
                    try {
                        const message = JSON.parse(data);
                        
                        if (message.type === 'auth_success') {
                            authenticated = true;
                            colorLog('✓ Authenticated for audio test', 'green');
                            
                            // Send test audio data
                            const audioBuffer = createTestAudioBuffer();
                            ws.send(JSON.stringify({
                                type: 'audio_start',
                                format: 'wav',
                                sampleRate: 44100,
                                channels: 1
                            }));
                            
                            // Send audio in chunks
                            const chunkSize = 1024;
                            for (let i = 0; i < audioBuffer.length; i += chunkSize) {
                                const chunk = audioBuffer.slice(i, i + chunkSize);
                                ws.send(chunk);
                            }
                            
                            ws.send(JSON.stringify({
                                type: 'audio_end'
                            }));
                            
                        } else if (message.type === 'transcription') {
                            colorLog('✓ Received transcription from audio processing', 'green');
                            clearTimeout(timeout);
                            ws.close();
                            resolve();
                            
                        } else if (message.type === 'error') {
                            clearTimeout(timeout);
                            ws.close();
                            reject(new Error(`Audio processing error: ${message.error}`));
                        }
                        
                    } catch (e) {
                        // Ignore binary data
                    }
                });
                
                ws.on('error', (error) => {
                    clearTimeout(timeout);
                    reject(new Error(`Audio WebSocket error: ${error.message}`));
                });
            });
        }
    },
    
    {
        name: 'Real-time AI Response',
        test: async () => {
            return new Promise((resolve, reject) => {
                colorLog('Testing real-time AI response...', 'blue');
                
                const ws = new WebSocket(`${WS_BASE}/ws/voice-chat`);
                let receivedResponse = false;
                
                const timeout = setTimeout(() => {
                    ws.close();
                    reject(new Error('AI response test timeout'));
                }, 20000);
                
                ws.on('open', () => {
                    ws.send(JSON.stringify({
                        type: 'auth',
                        token: TEST_USER_ID
                    }));
                });
                
                ws.on('message', (data) => {
                    try {
                        const message = JSON.parse(data);
                        
                        if (message.type === 'auth_success') {
                            // Send a test message for AI processing
                            ws.send(JSON.stringify({
                                type: 'message',
                                text: 'I have been feeling anxious lately and need some guidance.',
                                context: 'therapy_session'
                            }));
                            
                        } else if (message.type === 'ai_response') {
                            colorLog('✓ Received AI response from voice chat', 'green');
                            if (message.response && message.response.length > 0) {
                                colorLog(`   Response: ${message.response.substring(0, 100)}...`, 'cyan');
                                receivedResponse = true;
                            }
                            
                        } else if (message.type === 'audio_response') {
                            colorLog('✓ Received audio response from AI', 'green');
                            clearTimeout(timeout);
                            ws.close();
                            resolve();
                            
                        } else if (message.type === 'processing_complete') {
                            if (receivedResponse) {
                                clearTimeout(timeout);
                                ws.close();
                                resolve();
                            }
                        }
                        
                    } catch (e) {
                        // Ignore binary data
                    }
                });
                
                ws.on('error', (error) => {
                    clearTimeout(timeout);
                    reject(new Error(`AI response WebSocket error: ${error.message}`));
                });
            });
        }
    },
    
    {
        name: 'Session Management',
        test: async () => {
            colorLog('Testing voice chat session management...', 'blue');
            
            // Create a session
            const sessionData = {
                sessionType: 'guided_meditation',
                duration: 15,
                topic: 'stress_relief'
            };
            
            const createResponse = await makeRequest('POST', `${API_BASE}/api/voice-chat/session`, sessionData);
            if (createResponse.status !== 201) {
                throw new Error(`Session creation failed: ${createResponse.status}`);
            }
            
            const sessionId = createResponse.data.sessionId;
            colorLog(`✓ Created voice chat session: ${sessionId}`, 'green');
            
            // Get session details
            const getResponse = await makeRequest('GET', `${API_BASE}/api/voice-chat/session/${sessionId}`);
            if (getResponse.status !== 200) {
                throw new Error(`Get session failed: ${getResponse.status}`);
            }
            
            colorLog('✓ Retrieved session details', 'green');
            
            // Update session
            const updateData = {
                status: 'in_progress',
                notes: 'User responding well to guided meditation'
            };
            
            const updateResponse = await makeRequest('PUT', `${API_BASE}/api/voice-chat/session/${sessionId}`, updateData);
            if (updateResponse.status !== 200) {
                throw new Error(`Session update failed: ${updateResponse.status}`);
            }
            
            colorLog('✓ Updated session status', 'green');
            
            // End session
            const endResponse = await makeRequest('POST', `${API_BASE}/api/voice-chat/session/${sessionId}/end`);
            if (endResponse.status !== 200) {
                throw new Error(`End session failed: ${endResponse.status}`);
            }
            
            colorLog('✓ Ended session successfully', 'green');
            
            return sessionId;
        }
    },
    
    {
        name: 'Error Handling',
        test: async () => {
            colorLog('Testing voice chat error handling...', 'blue');
            
            // Test invalid session ID
            const invalidResponse = await makeRequest('GET', `${API_BASE}/api/voice-chat/session/invalid_id`);
            if (invalidResponse.status === 200) {
                throw new Error('Should have failed with invalid session ID');
            }
            colorLog('✓ Invalid session ID handled correctly', 'green');
            
            // Test WebSocket with invalid auth
            return new Promise((resolve, reject) => {
                const ws = new WebSocket(`${WS_BASE}/ws/voice-chat`);
                
                const timeout = setTimeout(() => {
                    ws.close();
                    reject(new Error('Error handling test timeout'));
                }, 10000);
                
                ws.on('open', () => {
                    ws.send(JSON.stringify({
                        type: 'auth',
                        token: 'invalid_token'
                    }));
                });
                
                ws.on('message', (data) => {
                    try {
                        const message = JSON.parse(data);
                        if (message.type === 'auth_error') {
                            colorLog('✓ Invalid WebSocket auth handled correctly', 'green');
                            clearTimeout(timeout);
                            ws.close();
                            resolve();
                        }
                    } catch (e) {
                        // Ignore
                    }
                });
                
                ws.on('error', (error) => {
                    clearTimeout(timeout);
                    colorLog('✓ WebSocket error handled correctly', 'green');
                    resolve();
                });
            });
        }
    }
];

// Run all tests
async function runAllTests() {
    colorLog('🎙️  VOICE CHAT COMPREHENSIVE TESTS', 'magenta');
    colorLog('=====================================', 'magenta');
    
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
    colorLog('\n📊 VOICE CHAT TEST SUMMARY', 'cyan');
    colorLog('==========================', 'cyan');
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
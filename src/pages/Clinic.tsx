import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useClerkUser } from '../hooks/useClerkUser';
import { LoadingSpinner, Button, Card } from '../components/ui';
import { apiService } from '../services/api';

interface VoiceMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  audioData?: string;
}

interface VoiceSession {
  sessionId: string;
  isActive: boolean;
  emotion: string;
  intensity: number;
}

const Clinic: React.FC = () => {
  const { user } = useClerkUser();
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState<VoiceMessage[]>([]);
  const [currentSession, setCurrentSession] = useState<VoiceSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [textInput, setTextInput] = useState('');

  const wsRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Set up authentication token when user is available
  useEffect(() => {
    if (user?.id) {
      apiService.setClerkUserId(user.id);
    }
  }, [user]);

  // Initialize voice session
  const initializeSession = async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      // Get user's recent emotion for context
      const emotionResponse = await apiService.getEmotionEntries({ limit: 1 });
      const recentEmotion = emotionResponse.emotions[0];

      const sessionData = {
        emotion: recentEmotion?.emotion || 'neutral',
        intensity: recentEmotion?.intensity || 5
      };

      const data = await apiService.startVoiceChatSession(sessionData.emotion, sessionData.intensity);

      setCurrentSession({
        sessionId: data.sessionId,
        isActive: true,
        emotion: sessionData.emotion,
        intensity: sessionData.intensity
      });

      // Connect to WebSocket
      connectWebSocket(data.sessionId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize session');
    } finally {
      setIsLoading(false);
    }
  };

  // Connect to WebSocket for real-time communication
  const connectWebSocket = (sessionId: string) => {
    const wsUrl = `${import.meta.env.VITE_API_URL?.replace('http', 'ws') || 'ws://localhost:5001'}/ws/voice-chat/${sessionId}`;
    
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      addMessage({
        id: 'system-1',
        text: 'Voice therapy session connected. You can start speaking or type your message.',
        isUser: false,
        timestamp: new Date()
      });
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        switch (data.type) {
          case 'response':
            if (data.text) {
              addMessage({
                id: `ai-${Date.now()}`,
                text: data.text,
                isUser: false,
                timestamp: new Date()
              });
            }
            break;
          case 'connected':
            addMessage({
              id: 'system-2',
              text: 'Therapeutic AI assistant ready. I\'m here to help you with evidence-based techniques.',
              isUser: false,
              timestamp: new Date()
            });
            break;
          case 'error':
            setError(data.message);
            break;
        }
      } catch (err) {
        console.error('WebSocket message error:', err);
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
      addMessage({
        id: 'system-3',
        text: 'Session ended. You can start a new session when ready.',
        isUser: false,
        timestamp: new Date()
      });
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setError('Connection error. Please try again.');
    };
  };

  // Add message to chat
  const addMessage = (message: VoiceMessage) => {
    setMessages(prev => [...prev, message]);
  };

  // Start recording audio
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      audioContextRef.current = new AudioContext();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      
      const processor = audioContextRef.current.createScriptProcessor(4096, 1, 1);
      
      processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        const audioData = new Int16Array(inputData.length);
        
        for (let i = 0; i < inputData.length; i++) {
          audioData[i] = Math.max(-32768, Math.min(32767, inputData[i] * 32768));
        }
        
        // Send audio data to WebSocket
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({
            type: 'audio',
            audioData: Buffer.from(audioData.buffer).toString('base64'),
            mimeType: 'audio/pcm;rate=16000'
          }));
        }
      };
      
      source.connect(processor);
      processor.connect(audioContextRef.current.destination);
      
      setIsRecording(true);
      
      // Send activity start
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          type: 'activityStart'
        }));
      }
      
    } catch (err) {
      console.error('Error starting recording:', err);
      setError('Failed to access microphone. Please check permissions.');
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    
    setIsRecording(false);
    
    // Send activity end
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'activityEnd'
      }));
    }
  };

  // Send text message
  const sendTextMessage = () => {
    if (!textInput.trim() || !wsRef.current) return;

    const message: VoiceMessage = {
      id: `user-${Date.now()}`,
      text: textInput,
      isUser: true,
      timestamp: new Date()
    };

    addMessage(message);
    
    // Send to WebSocket
    wsRef.current.send(JSON.stringify({
      type: 'text',
      text: textInput
    }));

    setTextInput('');
  };

  // End session
  const endSession = async () => {
    if (!currentSession) return;

    try {
      await apiService.endVoiceChatSession(currentSession.sessionId);

      if (wsRef.current) {
        wsRef.current.close();
      }

      setCurrentSession(null);
      setIsConnected(false);
      
      addMessage({
        id: 'system-4',
        text: 'Session saved. Your conversation has been recorded for future reference.',
        isUser: false,
        timestamp: new Date()
      });

    } catch (err) {
      console.error('Error ending session:', err);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  if (!user) {
    return <LoadingSpinner size="lg" className="mt-20" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-light text-gray-900 mb-4">
            AI Therapy Clinic
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Connect with an AI therapist trained in evidence-based techniques including CBT, DBT, and mindfulness.
            Share your thoughts through voice or text for personalized therapeutic support.
          </p>
        </motion.div>

        {/* Session Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-400'}`} />
                <span className="text-sm font-medium text-gray-700">
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
                {currentSession && (
                  <span className="text-sm text-gray-500">
                    • {currentSession.emotion} (intensity: {currentSession.intensity}/10)
                  </span>
                )}
              </div>
              
              <div className="flex space-x-2">
                {!currentSession ? (
                  <Button
                    onClick={initializeSession}
                    loading={isLoading}
                    disabled={isLoading}
                  >
                    Start Session
                  </Button>
                ) : (
                  <Button
                    onClick={endSession}
                    variant="outline"
                    disabled={!isConnected}
                  >
                    End Session
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Error Display */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg"
            >
              <p className="text-red-700 text-sm">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Messages */}
          <div className="lg:col-span-2">
            <Card className="h-96 flex flex-col">
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-medium text-gray-900">Therapeutic Conversation</h3>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <div className="text-4xl mb-4">🧠</div>
                    <p>Start a session to begin your therapeutic conversation</p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                          message.isUser
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                        <p className={`text-xs mt-1 ${
                          message.isUser ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </motion.div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
            </Card>
          </div>

          {/* Controls */}
          <div className="space-y-4">
            {/* Voice Controls */}
            <Card className="p-4">
              <h3 className="font-medium text-gray-900 mb-4">Voice Controls</h3>
              <div className="space-y-3">
                <Button
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={!isConnected}
                  variant={isRecording ? 'outline' : 'primary'}
                  className="w-full"
                >
                  {isRecording ? (
                    <>
                      <span className="animate-pulse">🔴</span>
                      Stop Recording
                    </>
                  ) : (
                    <>
                      🎤
                      Start Recording
                    </>
                  )}
                </Button>
                

              </div>
            </Card>

            {/* Text Input */}
            <Card className="p-4">
              <h3 className="font-medium text-gray-900 mb-4">Text Message</h3>
              <div className="space-y-3">
                <textarea
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendTextMessage()}
                  placeholder="Type your message here..."
                  className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  disabled={!isConnected}
                />
                <Button
                  onClick={sendTextMessage}
                  disabled={!isConnected || !textInput.trim()}
                  className="w-full"
                >
                  Send Message
                </Button>
              </div>
            </Card>

            {/* Session Info */}
            {currentSession && (
              <Card className="p-4">
                <h3 className="font-medium text-gray-900 mb-4">Session Info</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={isConnected ? 'text-green-600' : 'text-gray-500'}>
                      {isConnected ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Emotion:</span>
                    <span className="text-gray-900 capitalize">{currentSession.emotion}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Intensity:</span>
                    <span className="text-gray-900">{currentSession.intensity}/10</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Messages:</span>
                    <span className="text-gray-900">{messages.length}</span>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Clinic; 
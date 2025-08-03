import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card, Button, LoadingSpinner } from './ui';
import { useClerkUser } from '../hooks/useClerkUser';
import type { EmotionType } from '../types';

interface VoiceChatStepProps {
  onComplete: () => void;
  onSkip?: () => void;
  selectedEmotion?: EmotionType;
  gameCompleted?: string;
}

interface VoiceMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  audioData?: string;
}

const VoiceChatStep: React.FC<VoiceChatStepProps> = ({ 
  onComplete, 
  onSkip, 
  selectedEmotion = 'happy',
  gameCompleted = null 
}) => {
  const { user } = useClerkUser();
  const [messages, setMessages] = useState<VoiceMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [textInput, setTextInput] = useState('');
  const [sessionStarted, setSessionStarted] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize voice session
  const initializeSession = async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      console.log('VoiceChatStep: Initializing session for user:', user.id);
      
      // Generate a simple session ID for now
      const newSessionId = `voice_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setSessionId(newSessionId);
      setSessionStarted(true);

      // Add welcome message
      addMessage({
        id: 'welcome-1',
        text: `Great job completing the ${gameCompleted || 'game'}! I'm here to talk about your ${selectedEmotion} experience. How are you feeling right now?`,
        isUser: false,
        timestamp: new Date()
      });

      // Simulate connection and add therapeutic message
      setTimeout(() => {
        simulateConnection();
        setTimeout(() => {
          addMessage({
            id: 'therapy-1',
            text: `It sounds like you experienced ${selectedEmotion} during the activity. That's completely valid. Can you tell me more about what made you feel this way?`,
            isUser: false,
            timestamp: new Date()
          });
        }, 1000);
      }, 1500);
      
    } catch (err) {
      console.error('VoiceChatStep: Error initializing session:', err);
      setError(err instanceof Error ? err.message : 'Failed to initialize voice chat');
    } finally {
      setIsLoading(false);
    }
  };

  // Simulate connection for UI purposes
  const simulateConnection = () => {
    setIsConnected(true);
    addMessage({
      id: 'system-1',
      text: 'Voice therapy session ready. You can type your thoughts and I\'ll respond as your AI therapist.',
      isUser: false,
      timestamp: new Date()
    });
  };

  // Add message to chat
  const addMessage = (message: VoiceMessage) => {
    setMessages(prev => [...prev, message]);
  };

  // Send text message
  const sendTextMessage = () => {
    if (!textInput.trim()) return;

    const userMessage: VoiceMessage = {
      id: `user-${Date.now()}`,
      text: textInput.trim(),
      isUser: true,
      timestamp: new Date()
    };

    addMessage(userMessage);

    // Generate AI response based on emotion
    setTimeout(() => {
      let aiResponse = "";
      
      if (textInput.toLowerCase().includes('sad') || textInput.toLowerCase().includes('upset')) {
        aiResponse = "I understand you're feeling sad. That's a natural emotion, and it's important to acknowledge it. What do you think might help you feel a bit better right now?";
      } else if (textInput.toLowerCase().includes('angry') || textInput.toLowerCase().includes('frustrated')) {
        aiResponse = "It sounds like you're experiencing some anger or frustration. These feelings are valid. Have you tried any breathing exercises when you feel this way?";
      } else if (textInput.toLowerCase().includes('happy') || textInput.toLowerCase().includes('good')) {
        aiResponse = "I'm glad to hear you're feeling positive! What specific things contributed to this happy feeling?";
      } else if (textInput.toLowerCase().includes('anxious') || textInput.toLowerCase().includes('worried')) {
        aiResponse = "Anxiety can be challenging to deal with. Let's focus on the present moment. Can you name three things you can see around you right now?";
      } else {
        const responses = [
          "Thank you for sharing that with me. How does expressing this make you feel?",
          "I appreciate your openness. Can you tell me more about what you're experiencing?",
          "That's very insightful. What do you think this feeling is trying to tell you?",
          "I hear you. Sometimes it helps to explore these feelings further. What comes to mind when you think about this?",
          "Your feelings are valid and important. How would you like to process this further?"
        ];
        aiResponse = responses[Math.floor(Math.random() * responses.length)];
      }

      addMessage({
        id: `ai-${Date.now()}`,
        text: aiResponse,
        isUser: false,
        timestamp: new Date()
      });
    }, 1000 + Math.random() * 2000); // Random delay between 1-3 seconds

    setTextInput('');
    setIsConnected(true); // Set as connected for UI purposes
  };

  // Complete session
  const handleComplete = async () => {
    console.log('VoiceChatStep: Completing session');
    
    // Close WebSocket if exists
    if (wsRef.current) {
      wsRef.current.close();
    }

    // Log session completion for now (could save to localStorage or other storage)
    if (messages.length > 1) {
      console.log('VoiceChatStep: Session completed with', messages.length, 'messages');
      console.log('User responses:', messages.filter(m => m.isUser).map(m => m.text));
    }

    onComplete();
  };

  const handleSkip = () => {
    // Close WebSocket
    if (wsRef.current) {
      wsRef.current.close();
    }
    
    if (onSkip) {
      onSkip();
    } else {
      onComplete();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-4xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="p-8 bg-white/90 backdrop-blur-sm shadow-xl">
          {/* Header */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="text-6xl mb-4">🎙️</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Voice Reflection
            </h2>
            <p className="text-gray-600 text-lg">
              Let's talk about your {selectedEmotion} experience with our AI therapist
            </p>
          </motion.div>

          {!sessionStarted ? (
            /* Start Session */
            <motion.div
              className="text-center space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <p className="text-gray-700 text-lg">
                Ready to reflect on your experience with voice therapy?
              </p>
              
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                  {error}
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={initializeSession}
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700"
                >
                  {isLoading ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Starting Session...
                    </>
                  ) : (
                    'Start Voice Therapy'
                  )}
                </Button>
                
                <Button
                  onClick={handleSkip}
                  disabled={isLoading}
                  variant="outline"
                  className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Skip for Now
                </Button>
              </div>
            </motion.div>
          ) : (
            /* Chat Interface */
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              {/* Messages */}
              <div className="bg-gray-50 rounded-lg p-4 h-64 overflow-y-auto">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`mb-4 ${message.isUser ? 'text-right' : 'text-left'}`}
                  >
                    <div
                      className={`inline-block p-3 rounded-lg max-w-xs ${
                        message.isUser
                          ? 'bg-blue-500 text-white'
                          : 'bg-white text-gray-800 border'
                      }`}
                    >
                      {message.text}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendTextMessage()}
                  placeholder="Type your thoughts here..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={!isConnected}
                />
                <Button
                  onClick={sendTextMessage}
                  disabled={!textInput.trim() || !isConnected}
                  className="bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50"
                >
                  Send
                </Button>
              </div>

              {/* Status */}
              <div className="text-center text-sm text-gray-500">
                {isConnected ? (
                  <span className="text-green-600">✓ Connected</span>
                ) : (
                  <span className="text-red-600">✗ Disconnected</span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={handleComplete}
                  className="flex-1 bg-gradient-to-r from-green-500 to-blue-600 text-white hover:from-green-600 hover:to-blue-700"
                >
                  Complete Session
                </Button>
                
                <Button
                  onClick={handleSkip}
                  variant="outline"
                  className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  End Early
                </Button>
              </div>
            </motion.div>
          )}
        </Card>
      </motion.div>
    </div>
  );
};

export default VoiceChatStep;
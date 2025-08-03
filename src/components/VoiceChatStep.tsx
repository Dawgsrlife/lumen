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
  const [isListening, setIsListening] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<any>(null);

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
      
      // Start the session
      setSessionStarted(true);

      // Add welcome message
      addMessage({
        id: 'welcome-1',
        text: `Great job completing the ${gameCompleted || 'game'}! I'm here to talk about your ${selectedEmotion} experience. How are you feeling right now?`,
        isUser: false,
        timestamp: new Date()
      });

      // Initialize microphone and add therapeutic message
      setTimeout(async () => {
        await initializeMicrophone();
        setTimeout(() => {
          addMessage({
            id: 'therapy-1',
            text: `It sounds like you experienced ${selectedEmotion} during the activity. That's completely valid. Feel free to record a voice message or type about what made you feel this way.`,
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

  // Initialize microphone recording (works in all browsers)
  const initializeMicrophone = async () => {
    try {
      // Try to get microphone access first
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Create MediaRecorder for audio recording
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        handleAudioRecording(audioBlob);
        audioChunksRef.current = [];
      };
      
      setIsConnected(true);
      addMessage({
        id: 'system-1',
        text: '🎤 Voice therapy session ready! Press and hold the microphone button to record your voice, or type your message below.',
        isUser: false,
        timestamp: new Date()
      });
      
    } catch (error) {
      console.error('Microphone access denied:', error);
      setIsConnected(true); // Allow text-only mode
      addMessage({
        id: 'system-1',
        text: '💬 Voice therapy session ready! Microphone access was denied, but you can type your messages below.',
        isUser: false,
        timestamp: new Date()
      });
    }
  };

  // Handle audio recording completion
  const handleAudioRecording = (audioBlob: Blob) => {
    // Create audio URL for playback
    const audioUrl = URL.createObjectURL(audioBlob);
    
    // Show recorded message
    addMessage({
      id: `user-${Date.now()}`,
      text: `🎤 [Voice message recorded - ${Math.round(audioBlob.size / 1024)}KB]`,
      isUser: true,
      timestamp: new Date(),
      audioData: audioUrl
    });
    
    // Simulate processing the audio and generate response
    setTimeout(() => {
      const responses = [
        "I can hear the emotion in your voice. Thank you for sharing that with me. What stands out most about that experience?",
        "Your voice tells me this is really important to you. I appreciate you opening up. How are you feeling as you talk about this?",
        "I hear you, and I want you to know that what you're experiencing is completely valid. What would help you process this further?",
        "Thank you for trusting me with your thoughts. Sometimes speaking our feelings aloud helps us understand them better. What else comes to mind?",
        "I can sense the sincerity in your voice. Your willingness to share shows real courage. What aspect of this would you like to explore more?"
      ];
      
      const response = responses[Math.floor(Math.random() * responses.length)];
      
      addMessage({
        id: `ai-${Date.now()}`,
        text: response,
        isUser: false,
        timestamp: new Date()
      });
    }, 2000);
  };

  // Start voice recording
  const startRecording = () => {
    console.log('Starting audio recording...');
    
    if (!mediaRecorderRef.current) {
      console.log('MediaRecorder not available');
      addMessage({
        id: `system-${Date.now()}`,
        text: "Microphone not available. Please allow microphone access or use the text input below.",
        isUser: false,
        timestamp: new Date()
      });
      return;
    }

    try {
      if (mediaRecorderRef.current.state === 'inactive') {
        audioChunksRef.current = [];
        mediaRecorderRef.current.start();
        setIsRecording(true);
        setIsListening(true);
        console.log('Recording started');
      }
    } catch (error) {
      console.error('Error starting recording:', error);
      setIsRecording(false);
      setIsListening(false);
    }
  };

  // Stop voice recording
  const stopRecording = () => {
    console.log('Stopping audio recording...');
    
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      try {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
        setIsListening(false);
        console.log('Recording stopped');
      } catch (error) {
        console.error('Error stopping recording:', error);
      }
    }
  };

  // Generate AI response based on input
  const generateAIResponse = (input: string) => {
    setTimeout(() => {
      let aiResponse = "";
      
      if (input.toLowerCase().includes('overwhelmed') || input.toLowerCase().includes('difficult')) {
        aiResponse = "I hear that you're feeling overwhelmed. That's completely understandable - processing difficult emotions can be challenging. Take a deep breath with me. What specific part feels most overwhelming right now?";
      } else if (input.toLowerCase().includes('challenging') || input.toLowerCase().includes('rewarding')) {
        aiResponse = "It sounds like you had a meaningful experience - both challenging and rewarding. Often the most growth happens when we face difficulties. What made it feel rewarding for you?";
      } else if (input.toLowerCase().includes('not sure') || input.toLowerCase().includes('process')) {
        aiResponse = "It's okay not to have all the answers right away. Processing experiences takes time. Sometimes it helps to just sit with the feelings without judgment. What comes up when you don't try to analyze it?";
      } else if (input.toLowerCase().includes('unexpected') || input.toLowerCase().includes('mixed')) {
        aiResponse = "Unexpected emotions can be surprising, can't they? Mixed feelings are actually very normal - we rarely feel just one thing at a time. Can you describe what those different emotions feel like in your body?";
      } else if (input.toLowerCase().includes('learned') || input.toLowerCase().includes('reflect')) {
        aiResponse = "Self-reflection is such a valuable skill. It takes courage to look inward and learn about ourselves. What insight stands out most to you from this experience?";
      } else {
        const responses = [
          "Thank you for sharing that with me. I can hear the emotion in your voice. How does it feel to put those feelings into words?",
          "I appreciate your openness in sharing this. Sometimes speaking our experiences aloud helps us understand them better. What else are you noticing?",
          "That sounds like a meaningful experience. Your willingness to explore these feelings shows real strength. What would you like to explore further?",
          "I hear you, and I want you to know that whatever you're feeling is valid. How can we work together to help you process this?",
          "Your voice tells me this is important to you. Sometimes our emotions after an activity can teach us a lot about ourselves. What do you think yours might be telling you?"
        ];
        aiResponse = responses[Math.floor(Math.random() * responses.length)];
      }

      addMessage({
        id: `ai-${Date.now()}`,
        text: aiResponse,
        isUser: false,
        timestamp: new Date()
      });
    }, 1500 + Math.random() * 1000); // Random delay between 1.5-2.5 seconds
  };

  // Add message to chat
  const addMessage = (message: VoiceMessage) => {
    setMessages(prev => [...prev, message]);
  };

  // Send text message
  const sendTextMessage = () => {
    if (!textInput.trim()) return;

    const messageText = textInput.trim();
    
    const userMessage: VoiceMessage = {
      id: `user-${Date.now()}`,
      text: `💬 ${messageText}`,
      isUser: true,
      timestamp: new Date()
    };

    addMessage(userMessage);
    generateAIResponse(messageText);
    setTextInput('');
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

              {/* Voice Input */}
              <div className="flex justify-center mb-4">
                <Button
                  onClick={() => {
                    console.log('Microphone button clicked! isRecording:', isRecording);
                    if (isRecording) {
                      stopRecording();
                    } else {
                      startRecording();
                    }
                  }}
                  disabled={!isConnected}
                  className={`w-20 h-20 rounded-full text-2xl ${
                    isRecording 
                      ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                      : 'bg-blue-500 hover:bg-blue-600'
                  } text-white shadow-lg disabled:opacity-50 cursor-pointer`}
                >
                  {isRecording ? '⏹️' : '🎤'}
                </Button>
              </div>
              
              {/* Debug info */}
              <div className="text-center text-xs text-gray-400 mb-2">
                Debug: Recording: {isRecording ? 'Yes' : 'No'} | Connected: {isConnected ? 'Yes' : 'No'} | Microphone: {mediaRecorderRef.current ? 'Available' : 'Not Available'}
              </div>
              
              {/* Test button */}
              <div className="flex justify-center mb-4">
                <Button
                  onClick={() => {
                    console.log('Test button clicked!');
                    addMessage({
                      id: `test-${Date.now()}`,
                      text: "🎤 This is a test message to verify the interface is working",
                      isUser: true,
                      timestamp: new Date()
                    });
                    generateAIResponse("This is a test message to verify the interface is working");
                  }}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                >
                  Test Voice Input
                </Button>
              </div>
              
              {isListening && (
                <div className="text-center mb-4">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <span className="text-red-500 font-medium">🎤 Recording your voice...</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Click the microphone again to stop recording</p>
                </div>
              )}
              
              {!isListening && mediaRecorderRef.current && (
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-600">🎤 Press and hold the microphone to record your voice message</p>
                </div>
              )}

              {/* Text Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendTextMessage()}
                  placeholder="Or type your thoughts here..."
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
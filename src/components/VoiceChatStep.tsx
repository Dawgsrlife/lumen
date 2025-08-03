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

      // Initialize speech recognition and add therapeutic message
      setTimeout(() => {
        initializeSpeechRecognition();
        setTimeout(() => {
          addMessage({
            id: 'therapy-1',
            text: `It sounds like you experienced ${selectedEmotion} during the activity. That's completely valid. Feel free to speak or type about what made you feel this way.`,
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

  // Initialize speech recognition directly (better approach)
  const initializeSpeechRecognition = () => {
    console.log('🎤 Initializing speech recognition...');
    try {
      // Check if speech recognition is available
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        throw new Error('Speech recognition not supported in this browser');
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        console.log('🎤 Speech recognition started');
        setIsListening(true);
        setIsRecording(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        const confidence = event.results[0][0].confidence;
        console.log('🎤 Speech recognized:', transcript, 'Confidence:', confidence);
        
        // Add user message with actual transcript
        addMessage({
          id: `user-${Date.now()}`,
          text: `🎤 "${transcript}"`,
          isUser: true,
          timestamp: new Date()
        });
        
        // Generate AI response based on actual speech
        generateAIResponse(transcript);
      };

      recognition.onerror = (event: any) => {
        console.error('🎤 Speech recognition error:', event.error);
        setIsListening(false);
        setIsRecording(false);
        
        if (event.error === 'no-speech') {
          addMessage({
            id: `system-${Date.now()}`,
            text: "I didn't hear anything clearly. Please try speaking again or use the text input below.",
            isUser: false,
            timestamp: new Date()
          });
        } else if (event.error === 'not-allowed') {
          addMessage({
            id: `system-${Date.now()}`,
            text: "Microphone access was denied. Please enable microphone permissions and refresh the page, or use text input.",
            isUser: false,
            timestamp: new Date()
          });
        } else {
          addMessage({
            id: `system-${Date.now()}`,
            text: `Speech recognition error: ${event.error}. Please try again or use text input.`,
            isUser: false,
            timestamp: new Date()
          });
        }
      };

      recognition.onend = () => {
        console.log('🎤 Speech recognition ended');
        setIsRecording(false);
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      
      setIsConnected(true);
      addMessage({
        id: 'system-1',
        text: '🎤 Voice therapy session ready! Click the microphone button to speak, or type your message below.',
        isUser: false,
        timestamp: new Date()
      });
      
      console.log('🎤 Speech recognition initialization complete!');
      
    } catch (error) {
      console.error('🎤 Speech recognition initialization failed:', error);
      setIsConnected(true); // Allow text-only mode
      addMessage({
        id: 'system-1',
        text: `💬 Voice therapy session ready! Speech recognition failed (${error.message}), but you can type your messages below.`,
        isUser: false,
        timestamp: new Date()
      });
    }
  };

  // Handle audio recording completion
  const handleAudioRecording = async (audioBlob: Blob) => {
    console.log('🎤 Processing audio recording...');
    
    // Create audio URL for playback
    const audioUrl = URL.createObjectURL(audioBlob);
    
    // Show initial message while transcribing
    const tempMessageId = `user-temp-${Date.now()}`;
    addMessage({
      id: tempMessageId,
      text: `🎤 [Processing voice message...]`,
      isUser: true,
      timestamp: new Date(),
      audioData: audioUrl
    });
    
    try {
      // Use Web Speech API for transcription
      const transcription = await transcribeAudio(audioBlob);
      
      if (transcription && transcription.trim()) {
        // Update message with transcription
        setMessages(prev => prev.map(msg => 
          msg.id === tempMessageId 
            ? { ...msg, text: `🎤 "${transcription}"` }
            : msg
        ));
        
        // Generate AI response based on actual transcription
        generateAIResponse(transcription);
      } else {
        // No transcription detected
        setMessages(prev => prev.map(msg => 
          msg.id === tempMessageId 
            ? { ...msg, text: `🎤 [Voice recorded but no speech detected - please try speaking more clearly or use text input]` }
            : msg
        ));
      }
    } catch (error) {
      console.error('🎤 Transcription failed:', error);
      
      // Update message with error
      setMessages(prev => prev.map(msg => 
        msg.id === tempMessageId 
          ? { ...msg, text: `🎤 [Voice recorded but transcription failed - please use text input: ${error.message}]` }
          : msg
      ));
    }
  };

  // Transcribe audio using Web Speech API
  const transcribeAudio = (audioBlob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      try {
        // Check if speech recognition is available
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        
        if (!SpeechRecognition) {
          reject(new Error('Speech recognition not supported in this browser'));
          return;
        }

        // Create audio element to play the recorded audio
        const audio = new Audio(URL.createObjectURL(audioBlob));
        const recognition = new SpeechRecognition();
        
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        recognition.maxAlternatives = 1;

        let transcription = '';
        
        recognition.onresult = (event: any) => {
          console.log('🎤 Speech recognition result:', event.results);
          if (event.results && event.results[0]) {
            transcription = event.results[0][0].transcript;
            console.log('🎤 Transcribed text:', transcription);
          }
        };

        recognition.onerror = (event: any) => {
          console.error('🎤 Speech recognition error:', event.error);
          reject(new Error(`Speech recognition failed: ${event.error}`));
        };

        recognition.onend = () => {
          console.log('🎤 Speech recognition ended, transcription:', transcription);
          resolve(transcription);
        };

        // Start recognition and play audio simultaneously
        recognition.start();
        audio.play().catch(err => {
          console.warn('🎤 Audio playback failed (but continuing with recognition):', err);
        });
        
      } catch (error) {
        console.error('🎤 Error setting up transcription:', error);
        reject(error);
      }
    });
  };

  // Start speech recognition
  const startRecording = () => {
    console.log('🎤 START SPEECH RECOGNITION BUTTON CLICKED');
    console.log('🎤 Recognition available:', !!recognitionRef.current);
    
    if (!recognitionRef.current) {
      console.log('🎤 Speech recognition not available - trying to reinitialize');
      initializeSpeechRecognition();
      setTimeout(() => {
        if (recognitionRef.current) {
          startRecording();
        }
      }, 500);
      return;
    }

    try {
      console.log('🎤 Starting speech recognition...');
      recognitionRef.current.start();
      console.log('🎤 Speech recognition started successfully!');
    } catch (error) {
      console.error('🎤 Error starting speech recognition:', error);
      setIsRecording(false);
      setIsListening(false);
      addMessage({
        id: `system-${Date.now()}`,
        text: `Speech recognition failed: ${error.message}. Please try again or use text input.`,
        isUser: false,
        timestamp: new Date()
      });
    }
  };

  // Stop speech recognition
  const stopRecording = () => {
    console.log('🎤 Stopping speech recognition...');
    
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        console.log('🎤 Speech recognition stopped');
      } catch (error) {
        console.error('🎤 Error stopping speech recognition:', error);
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
                Debug: Recording: {isRecording ? 'Yes' : 'No'} | Connected: {isConnected ? 'Yes' : 'No'} | Speech Recognition: {recognitionRef.current ? 'Available' : 'Not Available'}
              </div>
              
              {/* Test button and microphone test */}
              <div className="flex justify-center gap-2 mb-4">
                <Button
                  onClick={() => {
                    console.log('🧪 Test chat interface button clicked!');
                    addMessage({
                      id: `test-${Date.now()}`,
                      text: "🎤 This is a test message to verify the interface is working",
                      isUser: true,
                      timestamp: new Date()
                    });
                    generateAIResponse("This is a test message to verify the interface is working");
                  }}
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded text-sm"
                >
                  🧪 Test Chat
                </Button>
                
                <Button
                  onClick={async () => {
                    console.log('🔧 Test microphone access button clicked!');
                    try {
                      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                      console.log('✅ Microphone access successful!', stream);
                      addMessage({
                        id: `mic-test-${Date.now()}`,
                        text: "✅ Microphone access granted! You can now use voice recording.",
                        isUser: false,
                        timestamp: new Date()
                      });
                      stream.getTracks().forEach(track => track.stop());
                    } catch (error) {
                      console.error('❌ Microphone access failed:', error);
                      addMessage({
                        id: `mic-error-${Date.now()}`,
                        text: `❌ Microphone access failed: ${error.message}`,
                        isUser: false,
                        timestamp: new Date()
                      });
                    }
                  }}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded text-sm"
                >
                  🔧 Test Mic
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
              
              {!isListening && recognitionRef.current && (
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-600">🎤 Click the microphone to start speaking</p>
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
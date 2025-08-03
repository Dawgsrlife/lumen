import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { chatbotService } from '../services/chatbot';
import type { ChatMessage, ChatContext } from '../services/chatbot';

export default function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userAnalytics, setUserAnalytics] = useState<any>(null);
  const [recentEmotions, setRecentEmotions] = useState([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initialize with welcome message
    const welcomeMessage: ChatMessage = {
      id: 'welcome',
      role: 'assistant',
      content: "Hi there! I'm Lumi, your AI companion here in Lumen. I'm here to listen, support, and chat with you about anything on your mind. How are you feeling today?",
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);

    // Fetch user context data
    fetchUserContext();
  }, []);

  const fetchUserContext = async () => {
    try {
      // In a real app, these would be API calls
      // For now, we'll use mock data or empty arrays
      setUserAnalytics(null);
      setRecentEmotions([]);
    } catch (error) {
      console.error('Failed to fetch user context:', error);
    }
  };

  const buildChatContext = (): ChatContext => {
    return {
      userAnalytics,
      recentEmotions,
      currentMood: undefined, // Would come from recent emotion entry
      conversationHistory: messages
    };
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const context = buildChatContext();
      const response = await chatbotService.generateResponse(inputMessage.trim(), context);
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Failed to get chatbot response:', error);
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm sorry, I'm having trouble responding right now. But I'm still here to listen whenever you're ready.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="bg-gradient-to-br from-yellow-50 to-purple-50 p-6">
      {/* Fixed-Size Chat Container */}
      <div className="max-w-4xl mx-auto">
        <Card className="h-[700px] flex flex-col overflow-hidden">
          {/* Messages Area - Fixed height with scroll */}
          <div className="h-[600px] overflow-y-auto px-4 pt-16 pb-4 space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-3 max-w-[80%] ${
                    message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}>
                    {/* Avatar */}
                    <div className={`p-2 rounded-full ${
                      message.role === 'user' 
                        ? 'bg-purple-100 text-purple-600' 
                        : 'bg-yellow-100 text-yellow-600'
                    }`}>
                      {message.role === 'user' ? (
                        <User className="h-4 w-4" />
                      ) : (
                        <Bot className="h-4 w-4" />
                      )}
                    </div>

                    {/* Message Bubble */}
                    <div className={`p-3 rounded-2xl ${
                      message.role === 'user'
                        ? 'bg-purple-600 text-white rounded-br-sm'
                        : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                    }`}>
                      <p className="whitespace-pre-wrap">{message.content}</p>
                      <p className={`text-xs mt-2 ${
                        message.role === 'user' ? 'text-purple-200' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Loading Indicator */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-full bg-yellow-100 text-yellow-600">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="bg-gray-100 p-3 rounded-2xl rounded-bl-sm">
                    <LoadingSpinner size="sm" />
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Fixed Input Area - Always at bottom, fixed height */}
          <div className="h-[100px] border-t bg-white p-4 flex flex-col justify-center">
            <div className="relative">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder="Share what's on your mind..."
                className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-yellow-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="h-4 w-4 hover:cursor-pointer" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Lumi is here to listen and support you. For urgent concerns, please contact a mental health professional.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
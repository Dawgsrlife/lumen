import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { chatbotService } from '../services/chatbot';
import type { ChatMessage, ChatContext } from '../services/chatbot';

export default function Chat() {
  const { user } = useUser();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userAnalytics, setUserAnalytics] = useState<any>(null);
  const [recentEmotions, setRecentEmotions] = useState([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [isAtBottom, setIsAtBottom] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const isBottom = scrollTop + clientHeight >= scrollHeight - 10; // 10px threshold
    setIsAtBottom(isBottom);
    
    // Calculate unread messages
    if (!isBottom) {
      const scrollPercentage = scrollTop / (scrollHeight - clientHeight);
      const totalMessages = messages.length;
      const unread = Math.ceil(totalMessages * (1 - scrollPercentage));
      setUnreadCount(unread);
    } else {
      setUnreadCount(0);
    }
  };

  useEffect(() => {
    // Only auto-scroll if user is already at the bottom
    if (isAtBottom) {
      scrollToBottom();
    }
  }, [messages, isAtBottom]);

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

  // Global keyboard listener for Enter key to focus input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-6xl mx-auto px-8 py-16">
        {/* Header Section */}
        <div className="mb-8">
          <div className="mb-4"></div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Chat with Lumi
            </h1>
            <p className="text-xl text-gray-600">
              Your compassionate AI companion
            </p>
          </motion.div>
          <div className="mb-4"></div>
        </div>

        {/* Chat Container */}
        <div className="max-w-4xl mx-auto">
          <Card className="h-[600px] flex flex-col overflow-hidden bg-white/80 backdrop-blur-sm border border-gray-100 relative">
            {/* Messages Area */}
            <div 
              className="flex-1 overflow-y-auto px-6 pt-6 pb-4 space-y-4 chat-scrollbar"
              onScroll={handleScroll}
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: '#e5e7eb #f9fafb'
              }}
            >
              <div className="mb-4"></div>
              
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
                      {/* Avatar - Simplified */}
                      <div className={`p-2 rounded-full ${
                        message.role === 'user' 
                          ? 'bg-gray-100 text-gray-600' 
                          : 'bg-gray-200 text-gray-700'
                      }`}>
                        {message.role === 'user' ? (
                          user?.imageUrl ? (
                            <img 
                              src={user.imageUrl} 
                              alt="Profile" 
                              className="w-4 h-4 rounded-full object-cover"
                            />
                          ) : (
                            <User className="h-4 w-4" />
                          )
                        ) : (
                          <Bot className="h-4 w-4" />
                        )}
                      </div>

                      {/* Message Bubble - Simplified */}
                      <div className={`p-4 rounded-2xl ${
                        message.role === 'user'
                          ? 'bg-gray-900 text-white rounded-br-sm'
                          : 'bg-gray-50 text-gray-800 rounded-bl-sm border border-gray-100'
                      }`}>
                        <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
                        <div className="mb-2"></div>
                        <p className={`text-xs ${
                          message.role === 'user' ? 'text-gray-300' : 'text-gray-500'
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

              {/* Loading Indicator - Simplified */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-full bg-gray-200 text-gray-700">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="bg-gray-50 p-4 rounded-2xl rounded-bl-sm border border-gray-100">
                      <LoadingSpinner size="sm" />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
              
              {/* Scroll to bottom button - Strategic Color Placement #1 */}
              {!isAtBottom && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={scrollToBottom}
                  className="absolute bottom-20 right-6 w-12 h-12 bg-gradient-to-r from-yellow-400 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer flex items-center justify-center group"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg className="w-5 h-5 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </motion.button>
              )}

              {/* Scroll indicator - Simplified */}
              {!isAtBottom && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute bottom-32 right-6 bg-gray-900 text-white text-xs px-3 py-1 rounded-full shadow-lg"
                >
                  {unreadCount > 0 ? `${unreadCount} new` : 'New messages'}
                </motion.div>
              )}
            </div>

            {/* Input Area - Simplified */}
            <div className="border-t border-gray-100 bg-white p-6">
              <div className="mb-4"></div>
              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleInputKeyDown}
                  placeholder="Share what's on your mind... (Press Enter to focus)"
                  className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-500/50 focus:border-gray-500 bg-gray-50/50 transition-all cursor-pointer"
                  disabled={isLoading}
                />
                {/* Send Button - Strategic Color Placement #2 */}
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 bg-gradient-to-r from-yellow-400 to-purple-600 text-white rounded-lg hover:from-yellow-500 hover:to-purple-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
              <div className="mb-4"></div>
              <p className="text-xs text-gray-500 text-center">
                Lumi is here to listen and support you. For urgent concerns, please contact a mental health professional.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
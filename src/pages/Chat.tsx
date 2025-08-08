import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, Bot, User } from "lucide-react";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { chatbotService } from "../services/chatbot";
import type { ChatMessage, ChatContext } from "../services/chatbot";
import { useClerkUser } from "../hooks/useClerkUser";

export default function Chat() {
  const { user } = useClerkUser();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [recentEmotions, setRecentEmotions] = useState([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  };

  useEffect(() => {
    const timer = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timer);
  }, [messages]);

  // Global keyboard listener for focusing chat input
  useEffect(() => {
    const handleGlobalKeyPress = (e: KeyboardEvent) => {
      // Only focus input if:
      // 1. Enter key is pressed
      // 2. No modifier keys are held
      // 3. The target is not already an input/textarea
      // 4. The input exists and is not already focused
      if (
        e.key === "Enter" &&
        !e.ctrlKey &&
        !e.altKey &&
        !e.metaKey &&
        !(e.target instanceof HTMLInputElement) &&
        !(e.target instanceof HTMLTextAreaElement) &&
        inputRef.current &&
        document.activeElement !== inputRef.current
      ) {
        e.preventDefault();
        inputRef.current.focus();
      }
    };

    document.addEventListener("keydown", handleGlobalKeyPress);
    return () => document.removeEventListener("keydown", handleGlobalKeyPress);
  }, []);

  useEffect(() => {
    // Initialize with welcome message
    const welcomeMessage: ChatMessage = {
      id: "welcome",
      role: "assistant",
      content:
        "Hi there! I'm Lumi, your AI companion here in Lumen. I'm here to listen, support, and chat with you about anything on your mind. How are you feeling today?",
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);

    // Fetch user context data
    fetchUserContext();
  }, []);

  const fetchUserContext = async () => {
    try {
      // In a real app, these would be API calls
      // For now, we'll use mock data or empty arrays
      setRecentEmotions([]);
    } catch (error) {
      console.error("Failed to fetch user context:", error);
    }
  };

  const buildChatContext = (): ChatContext => {
    return {
      userAnalytics: undefined, // Type issue - using undefined for now
      recentEmotions,
      currentMood: undefined, // Would come from recent emotion entry
      conversationHistory: messages,
    };
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: inputMessage.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const context = buildChatContext();
      const response = await chatbotService.generateResponse(
        inputMessage.trim(),
        context
      );

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Failed to get chatbot response:", error);

      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "I'm sorry, I'm having trouble responding right now. But I'm still here to listen whenever you're ready.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-blue-50/30 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-r from-purple-200/20 to-blue-200/20 rounded-full blur-xl"
        />
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 120, 0],
            rotate: [0, -180, -360],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-1/2 -right-20 w-32 h-32 bg-gradient-to-r from-yellow-200/20 to-orange-200/20 rounded-full blur-xl"
        />
        <motion.div
          animate={{
            x: [0, 60, 0],
            y: [0, -60, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-20 left-1/4 w-24 h-24 bg-gradient-to-r from-green-200/20 to-teal-200/20 rounded-full blur-xl"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8 lg:px-12">
        {/* Sophisticated Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center mb-6">
            <motion.div
              animate={{
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 via-orange-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl shadow-purple-500/25">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-xl">
                  🤖
                </div>
              </div>
              <motion.div
                animate={{
                  scale: [0.8, 1.2, 0.8],
                  opacity: [0.3, 0.7, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 bg-gradient-to-br from-yellow-400 via-orange-500 to-purple-600 rounded-full blur-md"
              />
            </motion.div>
          </div>

          <h1 className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-slate-800 via-purple-700 to-blue-800 bg-clip-text text-transparent mb-4">
            Chat with Lumi
          </h1>
          <p className="text-xl text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
            Your compassionate AI companion, here to listen, understand, and
            support you on your wellness journey
          </p>
        </motion.div>

        {/* Main Chat Container */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-5xl mx-auto"
        >
          <div className="relative bg-white/40 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl shadow-slate-900/10 overflow-hidden">
            {/* Chat Header Bar */}
            <div className="flex items-center justify-between p-6 border-b border-white/20 bg-white/20">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-red-400 rounded-full shadow-sm" />
                <div className="w-3 h-3 bg-yellow-400 rounded-full shadow-sm" />
                <div className="w-3 h-3 bg-green-400 rounded-full shadow-sm" />
              </div>
              <div className="flex items-center space-x-2 text-slate-700">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm font-medium">Lumi is online</span>
              </div>
            </div>

            {/* Messages Container */}
            <div className="h-[600px] flex flex-col">
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-300/50 scrollbar-track-transparent">
                <AnimatePresence mode="popLayout">
                  {messages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.95 }}
                      transition={{
                        duration: 0.4,
                        delay: index * 0.1,
                        ease: "easeOut",
                      }}
                      className={`flex ${
                        message.role === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`flex items-end space-x-3 max-w-[85%] ${
                          message.role === "user"
                            ? "flex-row-reverse space-x-reverse"
                            : ""
                        }`}
                      >
                        {/* Avatar */}
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.2 }}
                          className="flex-shrink-0"
                        >
                          {message.role === "user" ? (
                            <div className="relative">
                              <img
                                src={user?.imageUrl || ""}
                                alt="You"
                                className="w-10 h-10 rounded-full object-cover shadow-lg border-2 border-white/50"
                              />
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                <User className="w-2 h-2 text-white" />
                              </div>
                            </div>
                          ) : (
                            <div className="relative">
                              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 via-orange-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                                <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-sm">
                                  🤖
                                </div>
                              </div>
                              <motion.div
                                animate={{
                                  scale: [1, 1.2, 1],
                                  opacity: [0.5, 0.8, 0.5],
                                }}
                                transition={{
                                  duration: 2,
                                  repeat: Infinity,
                                  ease: "easeInOut",
                                }}
                                className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center"
                              >
                                <Bot className="w-2 h-2 text-white" />
                              </motion.div>
                            </div>
                          )}
                        </motion.div>

                        {/* Message Bubble */}
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                          className={`relative group ${
                            message.role === "user"
                              ? "bg-gradient-to-br from-slate-800 to-slate-900 text-white shadow-xl shadow-slate-900/25"
                              : "bg-white/80 backdrop-blur-sm text-slate-800 shadow-lg shadow-slate-500/10 border border-white/30"
                          } rounded-2xl px-6 py-4 max-w-md`}
                        >
                          {/* Message Content */}
                          <div className="relative z-10">
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">
                              {message.content}
                            </p>
                            <div className="flex items-center justify-between mt-3">
                              <span
                                className={`text-xs ${
                                  message.role === "user"
                                    ? "text-slate-300"
                                    : "text-slate-500"
                                } font-medium`}
                              >
                                {message.timestamp.toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                              {message.role === "assistant" && (
                                <motion.div
                                  animate={{
                                    rotate: [0, 10, -10, 0],
                                  }}
                                  transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                  }}
                                >
                                  <Sparkles className="w-3 h-3 text-yellow-500" />
                                </motion.div>
                              )}
                            </div>
                          </div>

                          {/* Message Glow Effect */}
                          <div
                            className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                              message.role === "user"
                                ? "bg-gradient-to-br from-slate-700/20 to-slate-900/20"
                                : "bg-gradient-to-br from-white/30 to-white/10"
                            }`}
                          />
                        </motion.div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Typing Indicator */}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="flex justify-start"
                  >
                    <div className="flex items-end space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 via-orange-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-sm">
                          🤖
                        </div>
                      </div>
                      <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-lg border border-white/30">
                        <div className="flex space-x-1">
                          <motion.div
                            animate={{ y: [0, -5, 0] }}
                            transition={{
                              duration: 0.6,
                              repeat: Infinity,
                              delay: 0,
                            }}
                            className="w-2 h-2 bg-slate-400 rounded-full"
                          />
                          <motion.div
                            animate={{ y: [0, -5, 0] }}
                            transition={{
                              duration: 0.6,
                              repeat: Infinity,
                              delay: 0.2,
                            }}
                            className="w-2 h-2 bg-slate-400 rounded-full"
                          />
                          <motion.div
                            animate={{ y: [0, -5, 0] }}
                            transition={{
                              duration: 0.6,
                              repeat: Infinity,
                              delay: 0.4,
                            }}
                            className="w-2 h-2 bg-slate-400 rounded-full"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="border-t border-white/20 bg-white/20 backdrop-blur-sm p-6">
                <div className="flex items-end space-x-4">
                  <div className="flex-1 relative">
                    <motion.input
                      ref={inputRef}
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyDown={handleInputKeyDown}
                      placeholder="Share what's on your mind... Lumi is here to listen"
                      className="w-full px-6 py-4 bg-white/60 backdrop-blur-sm border border-white/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 text-slate-800 placeholder-slate-500 shadow-lg resize-none"
                      disabled={isLoading}
                      whileFocus={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    />

                    {/* Input Enhancement Indicator */}
                    <motion.div
                      animate={{
                        opacity: inputMessage.trim() ? 1 : 0,
                        scale: inputMessage.trim() ? 1 : 0.8,
                      }}
                      className="absolute right-16 top-1/2 transform -translate-y-1/2"
                    >
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    </motion.div>
                  </div>

                  <motion.button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isLoading}
                    className="relative group p-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 overflow-hidden"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.div
                      animate={isLoading ? { rotate: 360 } : {}}
                      transition={{
                        duration: 1,
                        repeat: isLoading ? Infinity : 0,
                      }}
                    >
                      {isLoading ? (
                        <LoadingSpinner size="sm" />
                      ) : (
                        <Send className="w-5 h-5" />
                      )}
                    </motion.div>

                    {/* Button Glow Effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-400 opacity-0 group-hover:opacity-30 transition-opacity duration-300 rounded-2xl"
                      animate={{
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  </motion.button>
                </div>

                {/* Help Text */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="mt-4 text-center"
                >
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Press Enter to send • Lumi responds with empathy and
                    understanding •
                    <span className="text-purple-600 font-medium">
                      {" "}
                      All conversations are private and secure
                    </span>
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

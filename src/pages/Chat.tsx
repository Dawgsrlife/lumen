import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, User } from "lucide-react";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import {
  chatbotService,
  type ChatMessage,
  type ChatContext,
} from "../services/chatbot";

export function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hi there! I'm Lumi, your friendly wellness companion. I'm here to listen, support, and chat about whatever's on your mind. How are you feeling today? 🌟",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

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
      const context: ChatContext = {
        conversationHistory: messages.slice(-5),
      };

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
      console.error("Chat error:", error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
      {/* Soft background gradient - matching our app aesthetic */}
      <motion.div
        className="absolute inset-0 bg-gradient-radial from-yellow-400/5 via-purple-600/8 to-transparent blur-3xl"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1.2, opacity: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-8">
        {/* Clean Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-8"
        >
          {/* Cute Bunny-Fox Lumi Mascot */}
          <motion.div
            className="inline-block mb-6"
            animate={{
              y: [-2, 2, -2],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="relative">
              {/* Main head circle */}
              <div className="w-16 h-16 bg-gradient-to-br from-orange-300 via-amber-200 to-yellow-300 rounded-full relative shadow-lg">
                {/* Bunny ears */}
                <div className="absolute -top-3 left-3 w-3 h-6 bg-gradient-to-t from-orange-300 to-orange-200 rounded-full transform -rotate-12" />
                <div className="absolute -top-3 right-3 w-3 h-6 bg-gradient-to-t from-orange-300 to-orange-200 rounded-full transform rotate-12" />
                {/* Inner ears */}
                <div className="absolute -top-2 left-4 w-1.5 h-3 bg-pink-200 rounded-full transform -rotate-12" />
                <div className="absolute -top-2 right-4 w-1.5 h-3 bg-pink-200 rounded-full transform rotate-12" />

                {/* Face features */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    {/* Eyes */}
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="w-2 h-2 bg-gray-800 rounded-full" />
                      <div className="w-2 h-2 bg-gray-800 rounded-full" />
                    </div>
                    {/* Nose */}
                    <div className="w-1 h-1 bg-pink-400 rounded-full mx-auto mb-1" />
                    {/* Smile */}
                    <div className="w-3 h-1.5 border-b-2 border-gray-600 rounded-b-full mx-auto" />
                  </div>
                </div>

                {/* Fox tail curl (small) */}
                <div className="absolute -right-2 top-1 w-3 h-3 bg-gradient-to-br from-orange-400 to-amber-300 rounded-full" />
              </div>

              {/* Soft glow */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-full blur-lg scale-125"
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>
          </motion.div>

          <h1
            className="text-3xl md:text-4xl font-light text-gray-900 mb-4 leading-tight tracking-tight"
            style={{ fontFamily: "Playfair Display, Georgia, serif" }}
          >
            Chat with Lumi
          </h1>
          <p className="text-lg text-gray-600 font-light">
            Your compassionate AI companion
          </p>
        </motion.div>

        {/* Clean Chat Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white/60 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg overflow-hidden"
        >
          {/* Messages Area */}
          <div className="h-[500px] overflow-y-auto p-6 space-y-4">
            <AnimatePresence mode="popLayout">
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`flex items-start space-x-3 max-w-[80%] ${
                      message.role === "user"
                        ? "flex-row-reverse space-x-reverse"
                        : ""
                    }`}
                  >
                    {/* Avatar */}
                    <div className="flex-shrink-0 mt-1">
                      {message.role === "user" ? (
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-white" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 bg-gradient-to-br from-orange-300 to-yellow-300 rounded-full flex items-center justify-center relative">
                          {/* Mini bunny ears */}
                          <div className="absolute -top-1 left-1.5 w-1 h-2 bg-orange-300 rounded-full transform -rotate-12" />
                          <div className="absolute -top-1 right-1.5 w-1 h-2 bg-orange-300 rounded-full transform rotate-12" />
                          {/* Simple face */}
                          <div className="text-xs">🦊</div>
                        </div>
                      )}
                    </div>

                    {/* Message Bubble */}
                    <div
                      className={`px-4 py-3 rounded-2xl ${
                        message.role === "user"
                          ? "bg-gradient-to-r from-yellow-400 to-purple-600 text-white"
                          : "bg-white/80 text-gray-800 border border-gray-200"
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </p>
                      <span
                        className={`text-xs mt-2 block ${
                          message.role === "user"
                            ? "text-white/70"
                            : "text-gray-500"
                        }`}
                      >
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing Indicator */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex justify-start"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-300 to-yellow-300 rounded-full flex items-center justify-center relative mt-1">
                    <div className="absolute -top-1 left-1.5 w-1 h-2 bg-orange-300 rounded-full transform -rotate-12" />
                    <div className="absolute -top-1 right-1.5 w-1 h-2 bg-orange-300 rounded-full transform rotate-12" />
                    <div className="text-xs">🦊</div>
                  </div>
                  <div className="bg-white/80 px-4 py-3 rounded-2xl border border-gray-200">
                    <div className="flex space-x-1">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          delay: 0,
                        }}
                        className="w-2 h-2 bg-gray-400 rounded-full"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          delay: 0.2,
                        }}
                        className="w-2 h-2 bg-gray-400 rounded-full"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          delay: 0.4,
                        }}
                        className="w-2 h-2 bg-gray-400 rounded-full"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 p-4 bg-white/40">
            <div className="flex items-center space-x-3">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder="Type a message..."
                disabled={isLoading}
                className="flex-1 px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-transparent text-gray-900 placeholder-gray-500"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="px-4 py-3 bg-gradient-to-r from-yellow-400 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Chat;

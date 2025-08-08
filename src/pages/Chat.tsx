import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send } from "lucide-react";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { chatbotService } from "../services/chatbot";
import type { ChatMessage, ChatContext } from "../services/chatbot";
import { useClerkUser } from "../hooks/useClerkUser";
import ChatMascot from "../components/ui/ChatMascot";

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.05),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.8),transparent_50%)]" />

      <div className="relative z-10 max-w-5xl mx-auto px-8 py-20">
        {/* Enhanced Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            className="text-3xl md:text-4xl font-light text-gray-900 mb-4 tracking-wide"
            style={{ fontFamily: "Playfair Display, Georgia, serif" }}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Chat with Lumi
          </motion.h1>

          <motion.div
            className="w-16 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent mx-auto mb-6"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 64, opacity: 1 }}
            transition={{ delay: 0.4, duration: 1.0, ease: "easeOut" }}
          />

          <motion.p
            className="text-lg text-gray-600 font-light"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            Your compassionate AI companion for mindful conversations
          </motion.p>
        </motion.div>

        {/* Elegant Chat Container */}
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-slate-200/60 min-h-[700px] flex flex-col overflow-hidden">
            {/* Messages Area - Flexible height with scroll */}
            <div
              className="flex-1 overflow-y-auto px-8 pt-8 pb-4 space-y-6"
              style={{ minHeight: "500px" }}
            >
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`flex items-start space-x-3 max-w-[80%] ${
                        message.role === "user"
                          ? "flex-row-reverse space-x-reverse"
                          : ""
                      }`}
                    >
                      {/* Avatar */}
                      {message.role === "user" ? (
                        <img
                          src={user?.imageUrl || ""}
                          alt="You"
                          className="h-8 w-8 rounded-full object-cover bg-gray-200"
                        />
                      ) : (
                        <div className="h-8 w-8 flex items-center justify-center rounded-full bg-gradient-to-r from-yellow-400 to-purple-600">
                          <ChatMascot size="sm" />
                        </div>
                      )}

                      {/* Message Bubble */}
                      <div
                        className={`px-6 py-4 rounded-2xl max-w-md ${
                          message.role === "user"
                            ? "bg-gradient-to-r from-slate-800 to-slate-700 text-white rounded-br-md shadow-lg"
                            : "bg-white border border-slate-200/60 text-gray-800 rounded-bl-md shadow-sm"
                        }`}
                      >
                        <p className="whitespace-pre-wrap text-sm leading-relaxed font-light">
                          {message.content}
                        </p>
                        <p
                          className={`text-xs mt-3 font-light ${
                            message.role === "user"
                              ? "text-slate-300"
                              : "text-slate-500"
                          }`}
                        >
                          {message.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
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
                    <div className="h-8 w-8 flex items-center justify-center rounded-full bg-gradient-to-r from-yellow-400 to-purple-600">
                      <ChatMascot size="sm" />
                    </div>
                    <div className="bg-white border border-slate-200/60 px-6 py-4 rounded-2xl rounded-bl-md shadow-sm">
                      <LoadingSpinner size="sm" />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Refined Input Area */}
            <div className="border-t border-slate-200/60 bg-white/95 backdrop-blur-sm p-8">
              <div className="relative mb-4">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleInputKeyDown}
                  placeholder="Press Enter to focus, then share what's on your mind..."
                  className="w-full px-6 py-4 pr-14 border border-slate-200/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-400/50 focus:border-slate-400 bg-slate-50/50 transition-all font-light text-gray-800 placeholder-slate-400"
                  disabled={isLoading}
                />
                <motion.button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2.5 text-slate-400 hover:text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer rounded-full hover:bg-slate-100"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Send className="h-5 w-5" />
                </motion.button>
              </div>
              <div className="text-center px-4">
                <p className="text-xs text-slate-500 leading-relaxed">
                  Press Enter anywhere to focus chat • Lumi is here to listen
                  and support you • For urgent concerns, please contact a mental
                  health professional.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, MessageCircle, Clock } from "lucide-react";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { chatbotService } from "../services/chatbot";
import type { ChatMessage, ChatContext } from "../services/chatbot";
import { useClerkUser } from "../hooks/useClerkUser";
import ChatMascot from "../components/ui/ChatMascot";

// Modern animation variants for better performance
const messageVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 500,
      damping: 30,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.2 },
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function Chat() {
  const { user } = useClerkUser();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [recentEmotions, setRecentEmotions] = useState([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Optimized scroll behavior
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  }, []);

  useEffect(() => {
    const timer = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timer);
  }, [messages, scrollToBottom]);

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100/50">
      {/* Modern geometric background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(99,102,241,0.03),transparent_70%),radial-gradient(circle_at_75%_75%,rgba(168,162,158,0.05),transparent_70%)]" />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-6xl">
        {/* Clean, minimal header */}
        <motion.header
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Chat with Lumi
            </h1>
          </div>
          <p className="text-slate-600 text-sm">
            Your AI wellness companion • Available 24/7
          </p>
        </motion.header>

        {/* Main chat interface */}
        <motion.div
          className="max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Chat container with modern glass morphism */}
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 overflow-hidden">
            {/* Messages area with better scroll handling */}
            <div className="h-[65vh] overflow-y-auto overflow-x-hidden">
              <div className="p-6 space-y-4">
                <AnimatePresence mode="popLayout">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      variants={messageVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      layout
                      className={`flex ${
                        message.role === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      {/* Message bubble with improved design */}
                      <div
                        className={`
                          flex items-start gap-3 max-w-[85%] sm:max-w-[75%]
                          ${message.role === "user" ? "flex-row-reverse" : ""}
                        `}
                      >
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                          {message.role === "user" ? (
                            <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-white/50">
                              <img
                                src={user?.imageUrl || ""}
                                alt="You"
                                className="w-full h-full object-cover bg-slate-200"
                              />
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center ring-2 ring-white/50">
                              <ChatMascot size="sm" />
                            </div>
                          )}
                        </div>

                        {/* Message content */}
                        <div className="flex flex-col gap-1">
                          <div
                            className={`
                              px-4 py-3 rounded-2xl relative
                              ${
                                message.role === "user"
                                  ? "bg-slate-900 text-white rounded-br-md shadow-sm"
                                  : "bg-white/90 text-slate-800 border border-slate-200/50 rounded-bl-md shadow-sm"
                              }
                            `}
                          >
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">
                              {message.content}
                            </p>
                          </div>

                          {/* Timestamp */}
                          <div
                            className={`
                            flex items-center gap-1 text-xs text-slate-500
                            ${message.role === "user" ? "justify-end" : "justify-start"}
                          `}
                          >
                            <Clock className="w-3 h-3" />
                            {message.timestamp.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Typing indicator */}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex justify-start"
                  >
                    <div className="flex items-start gap-3 max-w-[75%]">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center ring-2 ring-white/50">
                        <ChatMascot size="sm" />
                      </div>
                      <div className="bg-white/90 border border-slate-200/50 px-4 py-3 rounded-2xl rounded-bl-md shadow-sm">
                        <LoadingSpinner size="sm" />
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input area with modern styling */}
            <div className="border-t border-slate-200/50 bg-white/80 backdrop-blur-sm p-4">
              <div className="flex items-end gap-3">
                <div className="flex-1 relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={handleInputKeyDown}
                    placeholder="Share what's on your mind..."
                    className="
                      w-full px-4 py-3 rounded-xl border border-slate-200/60 
                      focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50
                      bg-white/80 backdrop-blur-sm text-slate-800 placeholder-slate-500
                      text-sm transition-all duration-200
                      disabled:opacity-50 disabled:cursor-not-allowed
                    "
                    disabled={isLoading}
                  />
                </div>

                <motion.button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="
                    p-3 rounded-xl bg-slate-900 text-white 
                    hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed
                    transition-all duration-200 flex items-center justify-center
                    shadow-sm hover:shadow-md
                  "
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Send className="w-4 h-4" />
                </motion.button>
              </div>

              {/* Helper text */}
              <p className="text-xs text-slate-500 mt-3 text-center">
                Press Enter to send • Lumi is here to support your wellness
                journey
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useClerkUser } from "../hooks/useClerkUser";
import { apiService } from "../services/api";
import type { JournalEntry } from "../types";

const CheckIns: React.FC = () => {
  const { user } = useClerkUser();
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);
  const entriesPerPage = 10;

  // Convert emotion entry to journal entry format for display
  const emotionToJournal = (emotion: any): JournalEntry => ({
    id: emotion._id || emotion.id || '',
    title: `${emotion.emotion.charAt(0).toUpperCase() + emotion.emotion.slice(1)} Check-in`,
    content: emotion.context || 'No reflection provided',
    mood: emotion.intensity,
    tags: [emotion.emotion],
    isPrivate: false,
    createdAt: emotion.createdAt || new Date().toISOString(),
    updatedAt: emotion.updatedAt || emotion.createdAt || new Date().toISOString(),
    userId: emotion.userId || '',
  });

  useEffect(() => {
    const fetchCheckIns = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        console.log('CheckIns: Fetching emotion entries for page:', currentPage);
        
        // Fetch emotion entries (which contain the check-in data)
        const response = await apiService.getEmotionEntries({
          page: currentPage,
          limit: entriesPerPage,
        });

        console.log('CheckIns: Emotion entries response:', response);
        
        // Convert emotion entries to journal entry format for display
        const convertedEntries = response.emotions.map(emotionToJournal);
        console.log('CheckIns: Converted entries:', convertedEntries);
        
        setJournalEntries(convertedEntries);
        setTotalEntries(response.pagination?.total || response.emotions.length);
      } catch (error) {
        console.error("Error fetching check-ins:", error);
        // Fallback to empty array on error
        setJournalEntries([]);
        setTotalEntries(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCheckIns();
  }, [user, currentPage]);

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const totalPages = Math.ceil(totalEntries / entriesPerPage);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Authentication Required
          </h1>
          <p className="text-gray-600 mb-8 text-lg">
            Please sign in to view your check-ins
          </p>
          <Link
            to="/sign-in"
            className="px-8 py-4 bg-gray-900 text-white rounded-xl font-semibold shadow-lg hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 cursor-pointer"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto px-8 py-16">
        {/* Beautiful Header */}
        <motion.div
          className="text-center mb-16 flex flex-col items-center justify-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <motion.h1
            className="text-5xl lg:text-6xl font-bold leading-tight text-gray-900 mb-6 text-center"
            style={{ fontFamily: "Playfair Display, Georgia, serif" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Your Check-In History
          </motion.h1>
          <div className="mb-6"></div>

          <motion.p
            className="text-xl leading-relaxed text-gray-600 max-w-3xl mx-auto font-light text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            A journey through your thoughts and reflections
          </motion.p>
          <div className="mt-6"></div>

          <motion.div
            className="mt-6 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <p className="text-lg font-semibold text-gray-900">
              {totalEntries} Total Check-ins
            </p>
          </motion.div>
        </motion.div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg">Loading your check-ins...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Check-ins List */}
            <div className="space-y-8 mb-16">
              {journalEntries.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-center py-20"
                >
                  <div className="text-6xl mb-12">📝</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-8">
                    No check-ins yet
                  </h3>
                  <div className="mb-8"></div>
                  <p className="text-gray-600 mb-16 text-lg mx-auto">
                    Start your journey by logging your first emotion
                  </p>
                  <div className="mb-16"></div>
                  <Link
                    to="/flow?manual=true"
                    className="inline-block px-8 py-4 bg-gray-900 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
                  >
                    💭 Log Your First Emotion
                  </Link>
                </motion.div>
              ) : (
                journalEntries.map((entry, index) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300"
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-6">
                          <h3 className="text-xl font-bold text-gray-900 flex-1">
                            {entry.title}
                          </h3>
                          {entry.mood && (
                            <div className="flex items-center gap-2 bg-yellow-50 px-3 py-2 rounded-lg">
                              <span className="text-sm font-medium text-yellow-700">
                                Mood: {entry.mood}/10
                              </span>
                              <div className="flex">
                                {Array.from({
                                  length: Math.floor(entry.mood / 2),
                                }).map((_, i) => (
                                  <span
                                    key={i}
                                    className="text-yellow-500 text-lg"
                                  >
                                    ⭐
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        <p className="text-gray-700 mb-6 leading-relaxed text-lg">
                          {entry.content.length > 200
                            ? `${entry.content.substring(0, 200)}...`
                            : entry.content}
                        </p>

                        {entry.tags && entry.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {entry.tags.map((tag, tagIndex) => (
                              <span
                                key={tagIndex}
                                className="px-3 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="text-right md:text-left md:min-w-[200px]">
                        <p className="text-sm text-gray-500 mb-3">
                          {formatDate(entry.createdAt)}
                        </p>
                        {entry.isPrivate && (
                          <span className="inline-flex items-center gap-1 px-3 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm">
                            🔒 Private
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex justify-center items-center gap-4 mb-16 mt-8"
              >
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg hover:bg-white hover:shadow-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                <span className="px-4 py-2 bg-gray-900 text-white rounded-lg font-semibold">
                  {currentPage} of {totalPages}
                </span>

                <button
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg hover:bg-white hover:shadow-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CheckIns;

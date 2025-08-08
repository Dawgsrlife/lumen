import React, { useState } from "react";
import { Button } from "./ui";
import { apiService } from "../services/api";
import { aiService } from "../services/ai";
import { useClerkUser } from "../hooks/useClerkUser";
import type { EmotionType } from "../types";

interface JournalingStepProps {
  onComplete: () => void;
  onSkip?: () => void;
  selectedEmotion?: EmotionType;
  gameCompleted?: string;
}

const JournalingStep: React.FC<JournalingStepProps> = ({
  onComplete,
  onSkip,
  selectedEmotion = "happy",
}) => {
  const { user } = useClerkUser();
  const [journalEntry, setJournalEntry] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!journalEntry.trim()) {
      setError("Please share your thoughts before continuing.");
      return;
    }

    if (!user) {
      setError("User not authenticated.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      // First, analyze the reflection with AI
      const aiAnalysis = await aiService.analyzeJournalReflection(
        journalEntry.trim(),
        selectedEmotion
      );

      // Submit journal entry to MongoDB with AI insights
      await apiService.createJournalEntry({
        title: `Daily Reflection - ${selectedEmotion}`,
        content: journalEntry.trim(),
        emotionEntryId: undefined,
        mood: aiAnalysis.moodScore, // Use AI-calculated mood score
        tags: [selectedEmotion, "daily-reflection", "ai-analyzed"],
        isPrivate: false,
        aiInsights: {
          emotionalInsight: aiAnalysis.emotionalInsight,
          suggestedActions: aiAnalysis.suggestedActions,
          emotionAccuracy: aiAnalysis.emotionAccuracy,
          analysisTimestamp: new Date().toISOString(),
        },
      });

      // Create emotion entry with more accurate intensity based on AI analysis
      const adjustedIntensity = Math.round(
        (aiAnalysis.moodScore / 10) * (aiAnalysis.emotionAccuracy / 10) * 10
      );

      await apiService.createEmotionEntry({
        emotion: selectedEmotion,
        intensity: Math.min(10, Math.max(1, adjustedIntensity)),
        context: "daily-check-in-with-ai-analysis",
        surveyResponses: [],
        aiAnalysis: {
          moodScore: aiAnalysis.moodScore,
          emotionAccuracy: aiAnalysis.emotionAccuracy,
          insight: aiAnalysis.emotionalInsight,
        },
      });

      onComplete();
    } catch (error: unknown) {
      console.error("Error submitting journal entry:", error);

      // If API is unavailable, still complete the flow
      if (
        (error as Error & { code?: string })?.code === "ERR_NETWORK" ||
        (error as Error & { code?: string })?.code === "ECONNABORTED"
      ) {
        console.log("API unavailable, completing flow without saving");
        onComplete();
      } else {
        setError("Failed to save your reflection. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    if (onSkip) {
      onSkip();
    } else {
      onComplete();
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="max-w-lg w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            How are you feeling now?
          </h1>
          <p className="text-gray-600 mb-2">
            Take a moment to reflect on your experience.
          </p>
        </div>

        {/* Journal Input */}
        <div className="mb-6">
          <label
            htmlFor="journal-entry"
            className="block text-sm font-medium text-gray-700 mb-3"
          >
            Your Reflection
          </label>
          <textarea
            id="journal-entry"
            value={journalEntry}
            onChange={(e) => setJournalEntry(e.target.value)}
            placeholder="Share your thoughts and feelings..."
            className="w-full h-32 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
            disabled={isSubmitting}
          />
          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !journalEntry.trim()}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting
              ? "Saving... (this may take 5-10 seconds)"
              : "Save & Continue"}
          </Button>

          <Button
            onClick={handleSkip}
            disabled={isSubmitting}
            variant="outline"
            className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Skip for Now
          </Button>
        </div>

        {/* Encouraging Message */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Your reflections help track your emotional journey.
          </p>
        </div>
      </div>
    </div>
  );
};

export default JournalingStep;

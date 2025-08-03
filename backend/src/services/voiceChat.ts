/**
 * Voice Chat Service - Hackathon Version
 * Simplified implementation for hackathon demo with comprehensive database integration
 */

import { EmotionEntryModel } from '../models/EmotionEntry.js';
import { GameSessionModel } from '../models/GameSession.js';
import { JournalEntryModel } from '../models/JournalEntry.js';
import { VoiceSessionModel } from '../models/VoiceSession.js';
import type { EmotionEntry, GameSession } from '../types/index.js';

// Therapeutic mode mapping based on emotions
const THERAPEUTIC_MODES: Record<string, {
  primaryApproach: string;
  techniques: string[];
  sessionGoals: string[];
  systemPrompt: string;
}> = {
  anger: {
    primaryApproach: 'DBT Distress Tolerance & Emotion Regulation',
    techniques: ['STOP technique', 'Grounding exercises', 'Opposite action', 'Radical acceptance'],
    sessionGoals: ['Immediate emotional regulation', 'Identify anger triggers', 'Learn healthy expression'],
    systemPrompt: 'Focus on distress tolerance and emotion regulation. Help identify triggers and teach healthy coping mechanisms.'
  },
  frustration: {
    primaryApproach: 'DBT Distress Tolerance & Problem-Solving',
    techniques: ['STOP technique', 'Problem-solving therapy', 'Mindfulness', 'Self-soothing'],
    sessionGoals: ['Reduce frustration intensity', 'Develop problem-solving skills', 'Practice patience'],
    systemPrompt: 'Combine distress tolerance with practical problem-solving. Validate feelings while promoting constructive approaches.'
  },
  stress: {
    primaryApproach: 'CBT Stress Management & Relaxation',
    techniques: ['Progressive muscle relaxation', 'Cognitive restructuring', 'Time management', 'Mindfulness'],
    sessionGoals: ['Identify stress sources', 'Learn relaxation techniques', 'Develop coping strategies'],
    systemPrompt: 'Focus on stress identification and management. Teach relaxation and cognitive restructuring techniques.'
  },
  anxiety: {
    primaryApproach: 'CBT Exposure & Cognitive Restructuring',
    techniques: ['Exposure hierarchy', 'Cognitive restructuring', 'Breathing exercises', 'Grounding'],
    sessionGoals: ['Reduce anxiety symptoms', 'Challenge anxious thoughts', 'Build coping confidence'],
    systemPrompt: 'Use exposure therapy principles and cognitive restructuring. Help challenge anxious thoughts systematically.'
  },
  sad: {
    primaryApproach: 'CBT Behavioral Activation & Thought Reframing',
    techniques: ['Behavioral activation', 'Cognitive restructuring', 'Self-compassion', 'Gratitude practice'],
    sessionGoals: ['Increase positive activities', 'Challenge negative thoughts', 'Build self-compassion'],
    systemPrompt: 'Focus on behavioral activation and cognitive restructuring. Help identify and challenge depressive thoughts.'
  },
  loneliness: {
    primaryApproach: 'IFS-Style Parts Work & Attachment-Based',
    techniques: ['Internal family systems', 'Self-compassion', 'Social skills building', 'Connection exercises'],
    sessionGoals: ['Explore internal parts', 'Build self-connection', 'Develop social confidence'],
    systemPrompt: 'Use IFS-style parts work and attachment-based approaches. Help build internal and external connections.'
  },
  grief: {
    primaryApproach: 'ACT Acceptance & Narrative Therapy',
    techniques: ['Acceptance and commitment therapy', 'Narrative therapy', 'Self-compassion', 'Meaning-making'],
    sessionGoals: ['Process grief emotions', 'Find meaning in loss', 'Build acceptance'],
    systemPrompt: 'Focus on acceptance and meaning-making. Help process grief through narrative and ACT techniques.'
  },
  fear: {
    primaryApproach: 'Exposure Therapy & Safety Building',
    techniques: ['Exposure therapy', 'Safety planning', 'Grounding techniques', 'Coping skills'],
    sessionGoals: ['Reduce fear response', 'Build safety awareness', 'Develop coping skills'],
    systemPrompt: 'Use exposure therapy principles and safety planning. Help build confidence and coping skills.'
  },
  lethargy: {
    primaryApproach: 'Behavioral Activation & Energy Management',
    techniques: ['Behavioral activation', 'Energy management', 'Goal setting', 'Motivation building'],
    sessionGoals: ['Increase energy and activity', 'Set achievable goals', 'Build motivation'],
    systemPrompt: 'Focus on behavioral activation and energy management. Help set small, achievable goals.'
  }
};

class VoiceChatService {
  private activeSessions: Map<string, any> = new Map();
  private HACKATHON_MODE = process.env.HACKATHON_MODE === 'true' || !process.env.MONGODB_URI;

  constructor() {
    console.log('🎙️ Voice Chat Service initialized (Hackathon Mode)');
  }

  /**
   * Initialize a new voice chat session and save to database
   */
  async initializeSession(
    sessionId: string, 
    clerkId: string, 
    emotion: string, 
    intensity: number
  ): Promise<any> {
    console.log(`🎙️ Initializing voice session ${sessionId} for emotion: ${emotion}`);

    // Get user history for context
    const userHistory = await this.getUserHistory(clerkId);
    
    // Determine therapeutic approach
    const therapeuticMode = THERAPEUTIC_MODES[emotion] || THERAPEUTIC_MODES['stress'];
    
    // Get recent game session if any
    const recentGame = userHistory.recentGames[0];

    // Create session data
    const sessionData = {
      clerkId,
      sessionId,
      emotion,
      intensity,
      startTime: new Date(),
      status: 'active' as const,
      conversationLog: [] as Array<{
        timestamp: Date;
        role: 'user' | 'assistant';
        content: string;
        audioData?: string;
      }>,
      therapeuticContext: {
        primaryConcern: emotion,
        recommendedTechniques: therapeuticMode.techniques,
        sessionGoals: therapeuticMode.sessionGoals,
        userHistory
      },
      metadata: {
        model: 'hackathon-simplified',
        responseModalities: ['AUDIO', 'TEXT'],
        audioFormat: 'audio/pcm;rate=16000',
        sampleRate: 16000,
        totalMessages: 0,
        userMessages: 0,
        assistantMessages: 0
      }
    };

    try {
      // Save to database
      const voiceSession = new VoiceSessionModel(sessionData);
      await voiceSession.save();
      
      console.log(`✅ Voice session ${sessionId} saved to database`);

      // Store in memory for active sessions
      this.activeSessions.set(sessionId, voiceSession);

      // Add initial system message
      await this.addMessageToSession(sessionId, {
        timestamp: new Date(),
        role: 'assistant',
        content: `Welcome to your therapeutic session. I'm here to help you with ${therapeuticMode.primaryApproach}. What would you like to discuss today?`
      });

      return voiceSession;
    } catch (error) {
      console.error('❌ Error saving voice session to database:', error);
      throw error;
    }
  }

  /**
   * Get comprehensive user history for therapeutic context
   */
  private async getUserHistory(clerkId: string) {
    if (this.HACKATHON_MODE) {
      // Return mock data for hackathon
      return {
        recentEmotions: [],
        recentGames: [],
        recentJournals: [],
        moodTrends: { trend: 'stable', averageIntensity: 5 }
      };
    }

    try {
      const [recentEmotions, recentGames, recentJournals] = await Promise.all([
        EmotionEntryModel.find({ clerkId }).sort({ createdAt: -1 }).limit(10).lean(),
        GameSessionModel.find({ clerkId }).sort({ createdAt: -1 }).limit(5).lean(),
        JournalEntryModel.find({ clerkId }).sort({ createdAt: -1 }).limit(5).lean()
      ]);

      const moodTrends = this.analyzeMoodTrends(recentEmotions);

      return {
        recentEmotions,
        recentGames,
        recentJournals,
        moodTrends
      };
    } catch (error) {
      console.error('Error getting user history:', error);
      return {
        recentEmotions: [],
        recentGames: [],
        recentJournals: [],
        moodTrends: { trend: 'stable', averageIntensity: 5 }
      };
    }
  }

  /**
   * Analyze mood trends from recent emotions
   */
  private analyzeMoodTrends(emotions: EmotionEntry[]): any {
    if (emotions.length === 0) {
      return { trend: 'stable', averageIntensity: 5 };
    }

    const intensities = emotions.map(e => e.intensity);
    const averageIntensity = intensities.reduce((a, b) => a + b, 0) / intensities.length;

    // Simple trend analysis
    const recent = emotions.slice(0, 3);
    const older = emotions.slice(3, 6);
    
    const recentAvg = recent.length > 0 ? recent.reduce((sum, e) => sum + e.intensity, 0) / recent.length : averageIntensity;
    const olderAvg = older.length > 0 ? older.reduce((sum, e) => sum + e.intensity, 0) / older.length : averageIntensity;

    let trend = 'stable';
    if (recentAvg > olderAvg + 1) trend = 'improving';
    else if (recentAvg < olderAvg - 1) trend = 'declining';

    return { trend, averageIntensity: Math.round(averageIntensity) };
  }

  /**
   * Add message to session and update database
   */
  private async addMessageToSession(sessionId: string, message: {
    timestamp: Date;
    role: 'user' | 'assistant';
    content: string;
    audioData?: string;
  }) {
    try {
      const session = await VoiceSessionModel.findOne({ sessionId });
      if (!session) {
        throw new Error('Session not found');
      }

      session.conversationLog.push(message);
      await session.save();
      
      console.log(`✅ Message added to session ${sessionId}: ${message.role} - ${message.content.substring(0, 50)}...`);
    } catch (error) {
      console.error('❌ Error adding message to session:', error);
    }
  }

  /**
   * Process user message and generate therapeutic response
   */
  async processUserMessage(sessionId: string, message: string): Promise<string> {
    try {
      const session = await VoiceSessionModel.findOne({ sessionId });
      if (!session) {
        throw new Error('Session not found');
      }

      // Add user message to database
      await this.addMessageToSession(sessionId, {
        timestamp: new Date(),
        role: 'user',
        content: message
      });

      // Generate therapeutic response
      const response = this.generateTherapeuticResponse(session, message);

      // Add assistant response to database
      await this.addMessageToSession(sessionId, {
        timestamp: new Date(),
        role: 'assistant',
        content: response
      });

      return response;
    } catch (error) {
      console.error('❌ Error processing user message:', error);
      return "I'm having trouble processing your message right now. Could you try again?";
    }
  }

  /**
   * Generate therapeutic response based on session context
   */
  private generateTherapeuticResponse(session: any, userMessage: string): string {
    const mode = THERAPEUTIC_MODES[session.emotion] || THERAPEUTIC_MODES['stress'];
    
    // Simple response generation based on therapeutic mode
    const responses = {
      anger: [
        "I hear that you're feeling angry. Let's take a moment to breathe together. Can you tell me what triggered this feeling?",
        "Anger is a natural emotion. Let's explore what's beneath it. What would you say you're really feeling?",
        "I notice your intensity level is quite high. Let's try the STOP technique: Stop, Take a step back, Observe, Proceed mindfully."
      ],
      anxiety: [
        "I can sense your anxiety. Let's ground ourselves together. Can you name 5 things you can see right now?",
        "Anxiety can feel overwhelming. Let's break this down. What's the worst that could happen, and how likely is it?",
        "Your breathing might be quickening. Let's try a 4-7-8 breath: inhale for 4, hold for 7, exhale for 8."
      ],
      sad: [
        "I'm here with you in this sadness. It's okay to feel this way. Can you tell me more about what's weighing on you?",
        "Depression can make everything feel heavy. Let's start small. What's one tiny thing that might bring you a moment of relief?",
        "I hear the pain in your voice. You don't have to go through this alone. What would be most helpful for you right now?"
      ],
      stress: [
        "Stress can be overwhelming. Let's identify what's within your control and what isn't. What's the most pressing concern?",
        "I can hear the stress in your voice. Let's take a moment to prioritize. What absolutely needs to happen today?",
        "Stress affects us physically too. How is your body feeling right now? Let's do a quick body scan together."
      ]
    };

    const emotionResponses = responses[session.emotion as keyof typeof responses] || responses.stress;
    const randomResponse = emotionResponses[Math.floor(Math.random() * emotionResponses.length)];

    return randomResponse;
  }

  /**
   * Process audio input (simplified for hackathon)
   */
  async processAudioInput(sessionId: string, audioData: string): Promise<string> {
    try {
      const session = await VoiceSessionModel.findOne({ sessionId });
      if (!session) {
        throw new Error('Session not found');
      }

      // For hackathon: simulate audio processing
      const simulatedTranscription = "I'm feeling overwhelmed and need some support.";
      
      // Add audio input to database
      await this.addMessageToSession(sessionId, {
        timestamp: new Date(),
        role: 'user',
        content: simulatedTranscription,
        audioData
      });

      // Generate response
      const response = this.generateTherapeuticResponse(session, simulatedTranscription);

      // Add assistant response to database
      await this.addMessageToSession(sessionId, {
        timestamp: new Date(),
        role: 'assistant',
        content: response
      });

      return response;
    } catch (error) {
      console.error('❌ Error processing audio input:', error);
      return "I'm having trouble processing your audio right now. Could you try typing your message instead?";
    }
  }

  /**
   * End session and save conversation to journal
   */
  async endSession(sessionId: string): Promise<string | null> {
    try {
      const session = await VoiceSessionModel.findOne({ sessionId });
      if (!session) {
        console.log(`❌ Session ${sessionId} not found for ending`);
        return null;
      }

      // Update session status
      session.status = 'ended';
      session.endTime = new Date();
      await session.save();

      console.log(`✅ Session ${sessionId} ended and saved to database`);

      // Create conversation summary
      const conversationSummary = this.summarizeConversation(session);

      // Save as journal entry
      const journalEntry = new JournalEntryModel({
        clerkId: session.clerkId,
        title: `Voice Therapy Session - ${session.emotion}`,
        content: conversationSummary,
        source: 'voice_chat',
        mood: session.intensity,
        metadata: {
          sessionId: session.sessionId,
          duration: session.duration,
          emotionIntensity: session.intensity,
          therapeuticTechniques: session.therapeuticContext.recommendedTechniques,
          conversationLog: session.conversationLog,
          sentiment: this.analyzeSentiment(session),
          keyThemes: this.extractKeyThemes(session),
          insights: this.generateInsights(session)
        }
      });

      await journalEntry.save();

      // Update session with journal entry ID
      session.metadata.journalEntryId = journalEntry.id;
      await session.save();

      // Remove from active sessions
      this.activeSessions.delete(sessionId);

      console.log(`✅ Voice session ${sessionId} saved as journal entry: ${journalEntry.id}`);

      return journalEntry.id;
    } catch (error) {
      console.error('❌ Error ending session:', error);
      return null;
    }
  }

  /**
   * Summarize conversation for journal entry
   */
  private summarizeConversation(session: any): string {
    const userMessages = session.conversationLog
      .filter((log: any) => log.role === 'user')
      .map((log: any) => log.content)
      .join(' ');

    const mode = THERAPEUTIC_MODES[session.emotion] || THERAPEUTIC_MODES['stress'];
    
    return `Voice therapy session focused on ${session.emotion} (intensity: ${session.intensity}/10). 
    
Therapeutic approach: ${mode.primaryApproach}

Key discussion points: ${userMessages}

Session duration: ${session.duration} minutes

Techniques discussed: ${mode.techniques.join(', ')}

Total messages: ${session.metadata.totalMessages} (User: ${session.metadata.userMessages}, Assistant: ${session.metadata.assistantMessages})`;
  }

  /**
   * Analyze sentiment of the conversation
   */
  private analyzeSentiment(session: any): 'positive' | 'negative' | 'neutral' {
    const userMessages = session.conversationLog
      .filter((log: any) => log.role === 'user')
      .map((log: any) => log.content.toLowerCase());

    const positiveWords = ['good', 'better', 'happy', 'relieved', 'calm', 'peaceful', 'grateful', 'hopeful'];
    const negativeWords = ['bad', 'worse', 'sad', 'angry', 'anxious', 'stressed', 'hopeless', 'overwhelmed'];

    let positiveCount = 0;
    let negativeCount = 0;

    userMessages.forEach((message: string) => {
      positiveWords.forEach(word => {
        if (message.includes(word)) positiveCount++;
      });
      negativeWords.forEach(word => {
        if (message.includes(word)) negativeCount++;
      });
    });

    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }

  /**
   * Extract key themes from conversation
   */
  private extractKeyThemes(session: any): string[] {
    const userMessages = session.conversationLog
      .filter((log: any) => log.role === 'user')
      .map((log: any) => log.content);

    const themes = new Set<string>();
    
    // Simple theme extraction based on keywords
    const themeKeywords = {
      'work': ['work', 'job', 'career', 'office', 'meeting', 'deadline'],
      'relationships': ['friend', 'family', 'partner', 'relationship', 'love', 'marriage'],
      'health': ['health', 'sick', 'pain', 'doctor', 'medical', 'physical'],
      'finances': ['money', 'financial', 'bills', 'debt', 'expenses', 'budget'],
      'future': ['future', 'planning', 'goals', 'dreams', 'aspirations']
    };

    userMessages.forEach((message: string) => {
      Object.entries(themeKeywords).forEach(([theme, keywords]) => {
        keywords.forEach(keyword => {
          if (message.toLowerCase().includes(keyword)) {
            themes.add(theme);
          }
        });
      });
    });

    return Array.from(themes);
  }

  /**
   * Generate insights from the session
   */
  private generateInsights(session: any): string[] {
    const insights = [];
    
    // Duration insight
    if (session.duration > 15) {
      insights.push('Extended session duration suggests deep engagement with therapeutic process');
    }
    
    // Message count insight
    if (session.metadata.userMessages > 5) {
      insights.push('High user engagement indicates willingness to explore emotions');
    }
    
    // Emotion intensity insight
    if (session.intensity > 7) {
      insights.push('High emotion intensity suggests significant distress requiring continued support');
    }

    return insights;
  }

  /**
   * Get session by ID from database
   */
  async getSession(sessionId: string): Promise<any> {
    try {
      return await VoiceSessionModel.findOne({ sessionId });
    } catch (error) {
      console.error('❌ Error getting session:', error);
      return null;
    }
  }

  /**
   * Check if service is available
   */
  isAvailable(): boolean {
    return true; // Always available in hackathon mode
  }

  /**
   * Get active sessions count from database
   */
  async getActiveSessionsCount(): Promise<number> {
    try {
      return await VoiceSessionModel.countDocuments({ status: 'active' });
    } catch (error) {
      console.error('❌ Error getting active sessions count:', error);
      return 0;
    }
  }

  /**
   * Get user's voice session history
   */
  async getUserVoiceSessions(clerkId: string, limit: number = 10): Promise<any[]> {
    try {
      return await VoiceSessionModel.find({ clerkId })
        .sort({ startTime: -1 })
        .limit(limit)
        .lean();
    } catch (error) {
      console.error('❌ Error getting user voice sessions:', error);
      return [];
    }
  }
}

export const voiceChatService = new VoiceChatService();
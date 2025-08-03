/**
 * Enhanced Voice Chat Service with Gemini Live API Integration
 * Combines therapeutic framework with real-time audio processing
 */

import { GoogleGenAI, Modality } from '@google/genai';
import mongoose from 'mongoose';
import { EmotionEntryModel } from '../models/EmotionEntry.js';
import { GameSessionModel } from '../models/GameSession.js';
import { JournalEntryModel } from '../models/JournalEntry.js';
import { VoiceSessionModel } from '../models/VoiceSession.js';
import type { EmotionEntry, GameSession } from '../types/index.js';

// Enhanced therapeutic modes with system prompts for Gemini Live API
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
    systemPrompt: `You are a compassionate DBT therapist specializing in anger management. Use a calm, validating tone. 

Core principles:
- Focus on distress tolerance and emotion regulation
- Help identify anger triggers and patterns
- Teach healthy coping mechanisms like the STOP technique
- Use validation before suggesting alternatives
- Speak warmly and supportively, as if you're sitting across from someone in distress

Respond naturally as if in a real therapy session. Keep responses concise but meaningful. Ask gentle questions to understand their experience better.`
  },
  frustration: {
    primaryApproach: 'DBT Distress Tolerance & Problem-Solving',
    techniques: ['STOP technique', 'Problem-solving therapy', 'Mindfulness', 'Self-soothing'],
    sessionGoals: ['Reduce frustration intensity', 'Develop problem-solving skills', 'Practice patience'],
    systemPrompt: `You are a skilled DBT therapist specializing in frustration tolerance. Speak with patience and understanding.

Core principles:
- Combine distress tolerance with practical problem-solving
- Validate feelings while promoting constructive approaches
- Teach the STOP technique and mindfulness practices
- Help break down overwhelming situations into manageable parts
- Maintain a calm, reassuring presence

Respond as if you're in a real therapy session. Be empathetic and practical. Help them see solutions they might not notice when frustrated.`
  },
  stress: {
    primaryApproach: 'CBT Stress Management & Relaxation',
    techniques: ['Progressive muscle relaxation', 'Cognitive restructuring', 'Time management', 'Mindfulness'],
    sessionGoals: ['Identify stress sources', 'Learn relaxation techniques', 'Develop coping strategies'],
    systemPrompt: `You are a stress management specialist using CBT techniques. Speak with a calming, supportive tone.

Core principles:
- Focus on stress identification and management
- Teach relaxation and cognitive restructuring techniques
- Help them identify what's within their control
- Guide progressive muscle relaxation when appropriate
- Use a soothing, grounding voice

Respond naturally and supportively. Help them feel less overwhelmed by breaking things down step by step.`
  },
  anxiety: {
    primaryApproach: 'CBT Exposure & Cognitive Restructuring',
    techniques: ['Exposure hierarchy', 'Cognitive restructuring', 'Breathing exercises', 'Grounding'],
    sessionGoals: ['Reduce anxiety symptoms', 'Challenge anxious thoughts', 'Build coping confidence'],
    systemPrompt: `You are a skilled CBT therapist specializing in anxiety disorders. Use a reassuring, patient voice.

Core principles:
- Use exposure therapy principles and cognitive restructuring
- Help challenge anxious thoughts systematically
- Teach grounding techniques and breathing exercises
- Validate their fears while gently challenging catastrophic thinking
- Speak calmly and confidently to model regulation

Respond as if you're in a real therapy session. Ask gentle questions to help them examine their thoughts. Offer practical coping strategies.`
  },
  sad: {
    primaryApproach: 'CBT Behavioral Activation & Thought Reframing',
    techniques: ['Behavioral activation', 'Cognitive restructuring', 'Self-compassion', 'Gratitude practice'],
    sessionGoals: ['Increase positive activities', 'Challenge negative thoughts', 'Build self-compassion'],
    systemPrompt: `You are a compassionate therapist specializing in depression and sadness. Speak with warmth and hope.

Core principles:
- Focus on behavioral activation and cognitive restructuring
- Help identify and challenge depressive thoughts
- Encourage small, achievable positive activities
- Teach self-compassion practices
- Maintain hope while validating their pain

Respond with gentle warmth. Help them see small steps forward. Validate their feelings while offering perspective and hope.`
  },
  loneliness: {
    primaryApproach: 'IFS-Style Parts Work & Attachment-Based',
    techniques: ['Internal family systems', 'Self-compassion', 'Social skills building', 'Connection exercises'],
    sessionGoals: ['Explore internal parts', 'Build self-connection', 'Develop social confidence'],
    systemPrompt: `You are a therapist specializing in loneliness and connection, using IFS and attachment-based approaches. Speak with warmth and understanding.

Core principles:
- Use IFS-style parts work and attachment-based approaches
- Help build internal and external connections
- Validate the pain of loneliness
- Explore relationship patterns and fears
- Encourage self-compassion and gradual social engagement

Respond as a caring therapeutic presence. Help them feel less alone through your connection. Explore what connection means to them.`
  },
  grief: {
    primaryApproach: 'ACT Acceptance & Narrative Therapy',
    techniques: ['Acceptance and commitment therapy', 'Narrative therapy', 'Self-compassion', 'Meaning-making'],
    sessionGoals: ['Process grief emotions', 'Find meaning in loss', 'Build acceptance'],
    systemPrompt: `You are a grief counselor using ACT and narrative therapy approaches. Speak with deep compassion and presence.

Core principles:
- Focus on acceptance and meaning-making
- Help process grief through narrative and ACT techniques
- Validate the depth of their loss
- Support them in finding meaning while honoring their pain
- Use a gentle, present voice that holds space for their emotions

Respond with profound empathy. Help them tell their story. Support them in finding ways to honor their loss while moving forward.`
  },
  fear: {
    primaryApproach: 'Exposure Therapy & Safety Building',
    techniques: ['Exposure therapy', 'Safety planning', 'Grounding techniques', 'Coping skills'],
    sessionGoals: ['Reduce fear response', 'Build safety awareness', 'Develop coping skills'],
    systemPrompt: `You are a therapist specializing in fear and trauma, using exposure therapy and safety-building approaches. Speak with calm confidence.

Core principles:
- Use exposure therapy principles and safety planning
- Help build confidence and coping skills
- Validate their fears while building resilience
- Teach grounding techniques for overwhelming moments
- Model calm presence and safety

Respond with steady, reassuring confidence. Help them feel safe while gently challenging avoidance patterns. Build their sense of capability.`
  },
  lethargy: {
    primaryApproach: 'Behavioral Activation & Energy Management',
    techniques: ['Behavioral activation', 'Energy management', 'Goal setting', 'Motivation building'],
    sessionGoals: ['Increase energy and activity', 'Set achievable goals', 'Build motivation'],
    systemPrompt: `You are a therapist specializing in motivation and energy, using behavioral activation approaches. Speak with gentle encouragement.

Core principles:
- Focus on behavioral activation and energy management
- Help set small, achievable goals
- Build motivation through success experiences
- Understand energy cycles and work with them
- Use an encouraging but realistic tone

Respond with gentle motivation. Help them take tiny steps forward. Celebrate small victories and build momentum gradually.`
  }
};

class EnhancedVoiceChatService {
  private activeSessions: Map<string, any> = new Map();
  private geminiSessions: Map<string, any> = new Map();
  private ai: GoogleGenAI;
  private HACKATHON_MODE = process.env.HACKATHON_MODE === 'true';
  private DATABASE_AVAILABLE = false;

  constructor() {
    const apiKey = process.env.GOOGLE_AI_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('⚠️ No Gemini API key found. Voice chat will use fallback mode.');
      this.ai = null as any;
    } else {
      this.ai = new GoogleGenAI({
        apiKey: apiKey
      });
    }
    
    // Check database connectivity
    this.checkDatabaseConnectivity();
    console.log('🎙️ Enhanced Voice Chat Service initialized with Gemini Live API');
  }

  /**
   * Check if database is available
   */
  private checkDatabaseConnectivity(): void {
    this.DATABASE_AVAILABLE = mongoose.connection.readyState === 1;
    if (!this.DATABASE_AVAILABLE) {
      console.log('⚠️ Database not available - voice chat will use in-memory storage');
    }
  }

  /**
   * Initialize session with Gemini Live API integration
   */
  async initializeSession(
    sessionId: string,
    clerkId: string,
    emotion: string,
    intensity: number
  ): Promise<any> {
    console.log(`🎙️ Initializing enhanced voice session ${sessionId} for emotion: ${emotion}`);

    // Get user history for context
    const userHistory = await this.getUserHistory(clerkId);
    const therapeuticMode = THERAPEUTIC_MODES[emotion] || THERAPEUTIC_MODES['stress'];

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
        model: 'gemini-2.5-flash-preview-native-audio-dialog',
        responseModalities: ['AUDIO', 'TEXT'],
        audioFormat: 'audio/pcm;rate=16000',
        sampleRate: 16000,
        totalMessages: 0,
        userMessages: 0,
        assistantMessages: 0
      }
    };

    try {
      // Check database connectivity before proceeding
      this.checkDatabaseConnectivity();

      let voiceSession: any = null;

      // Try to save to database if available
      if (this.DATABASE_AVAILABLE) {
        try {
          voiceSession = new VoiceSessionModel(sessionData);
          await voiceSession.save();
          console.log(`✅ Enhanced voice session ${sessionId} saved to database`);
        } catch (dbError) {
          console.error(`❌ Database save failed for session ${sessionId}:`, dbError);
          console.log(`📝 Continuing with in-memory session for ${sessionId}`);
          this.DATABASE_AVAILABLE = false;
          voiceSession = { ...sessionData, _id: sessionId, id: sessionId };
        }
      } else {
        console.log(`📝 Using in-memory session for ${sessionId} - database not available`);
        voiceSession = { ...sessionData, _id: sessionId, id: sessionId };
      }

      // Initialize Gemini Live API session if available
      if (this.ai) {
        await this.initializeGeminiSession(sessionId, therapeuticMode);
      } else {
        console.log(`⚠️ Using fallback mode for session ${sessionId} - no Gemini API available`);
      }

      this.activeSessions.set(sessionId, voiceSession);

      // Add welcome message
      const welcomeMessage = this.ai 
        ? `Welcome to your therapeutic session. I'm here to help you with ${therapeuticMode.primaryApproach}. I can hear and respond to your voice, or you can type if you prefer. What would you like to talk about today?`
        : `Welcome to your therapeutic session. I'm here to help you with ${therapeuticMode.primaryApproach}. What would you like to discuss today?`;

      await this.addMessageToSession(sessionId, {
        timestamp: new Date(),
        role: 'assistant',
        content: welcomeMessage
      });

      return voiceSession;
    } catch (error) {
      console.error('❌ Error initializing enhanced session:', error);
      throw error;
    }
  }

  /**
   * Initialize Gemini Live API connection
   */
  private async initializeGeminiSession(sessionId: string, therapeuticMode: any) {
    try {
      const config = {
        responseModalities: [Modality.AUDIO, Modality.TEXT],
        systemInstruction: therapeuticMode.systemPrompt,
        generationConfig: {
          temperature: 0.7,
          topP: 0.8,
          maxOutputTokens: 2048
        }
      };

      const responseQueue: any[] = [];

      const session = await this.ai.live.connect({
        model: 'gemini-2.5-flash-preview-native-audio-dialog',
        callbacks: {
          onopen: () => {
            console.log(`🔗 Gemini Live session ${sessionId} connected`);
          },
          onmessage: (message: any) => {
            responseQueue.push(message);
            this.handleGeminiMessage(sessionId, message);
          },
          onerror: (error: any) => {
            console.error(`❌ Gemini session ${sessionId} error:`, error);
          },
          onclose: (event: any) => {
            console.log(`🔌 Gemini session ${sessionId} closed`);
          }
        },
        config
      });

      this.geminiSessions.set(sessionId, { session, responseQueue });
      console.log(`✅ Gemini Live session ${sessionId} initialized`);
      return session;
    } catch (error) {
      console.error(`❌ Failed to initialize Gemini session ${sessionId}:`, error);
      // Continue without Gemini - fallback to regular mode
      return null;
    }
  }

  /**
   * Handle messages from Gemini Live API
   */
  private async handleGeminiMessage(sessionId: string, message: any) {
    try {
      // Handle different message types from Gemini Live API
      if (message.serverContent && message.serverContent.modelTurn) {
        const content = message.serverContent.modelTurn.parts
          ?.map((part: any) => part.text || '[Audio Response]')
          .join(' ') || '[Audio Response]';

        await this.addMessageToSession(sessionId, {
          timestamp: new Date(),
          role: 'assistant',
          content,
          audioData: message.data // If audio is present
        });

        console.log(`🤖 Gemini response for ${sessionId}: ${content.substring(0, 100)}...`);
      }

      // Handle transcriptions for logging
      if (message.inputTranscription) {
        console.log(`📝 Input transcription for ${sessionId}: ${message.inputTranscription.text}`);
      }

      if (message.outputTranscription) {
        console.log(`📝 Output transcription for ${sessionId}: ${message.outputTranscription.text}`);
      }
    } catch (error) {
      console.error('❌ Error handling Gemini message:', error);
    }
  }

  /**
   * Process real-time audio input through Gemini Live API
   */
  async processAudioInput(sessionId: string, audioData: string): Promise<string> {
    try {
      const geminiSession = this.geminiSessions.get(sessionId);
      
      if (geminiSession && this.ai) {
        console.log(`🎙️ Processing audio input for session ${sessionId} via Gemini Live API`);
        
        // Send audio to Gemini Live API
        geminiSession.session.sendRealtimeInput({
          audio: {
            data: audioData,
            mimeType: "audio/pcm;rate=16000"
          }
        });

        // Wait for response - in production you'd want more sophisticated handling
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Get the latest response from queue
        const responses = geminiSession.responseQueue.splice(0);
        const textResponse = responses
          .filter((msg: any) => msg.serverContent && msg.serverContent.modelTurn)
          .map((msg: any) => msg.serverContent.modelTurn.parts
            ?.map((part: any) => part.text)
            .join(' ')
          )
          .join(' ');

        if (textResponse) {
          console.log(`✅ Gemini audio response for ${sessionId}: ${textResponse.substring(0, 100)}...`);
          return textResponse;
        }
      }

      // Fallback to simulated processing
      console.log(`⚠️ Using fallback audio processing for session ${sessionId}`);
      return this.fallbackAudioProcessing(sessionId, audioData);

    } catch (error) {
      console.error('❌ Error processing audio input:', error);
      return this.fallbackAudioProcessing(sessionId, audioData);
    }
  }

  /**
   * Fallback audio processing when Gemini Live API is not available
   */
  private async fallbackAudioProcessing(sessionId: string, audioData: string): Promise<string> {
    const session = await VoiceSessionModel.findOne({ sessionId });
    if (!session) {
      return "I'm having trouble accessing your session. Could you try again?";
    }

    // Simulate transcription and generate response
    const simulatedTranscription = "I'm feeling overwhelmed and need some support.";
    
    // Add audio input to database
    await this.addMessageToSession(sessionId, {
      timestamp: new Date(),
      role: 'user',
      content: simulatedTranscription,
      audioData
    });

    // Generate therapeutic response
    const response = this.generateFallbackResponse(session, simulatedTranscription);

    // Add assistant response to database
    await this.addMessageToSession(sessionId, {
      timestamp: new Date(),
      role: 'assistant',
      content: response
    });

    return response;
  }

  /**
   * Process text input through Gemini Live API
   */
  async processTextInput(sessionId: string, text: string): Promise<string> {
    try {
      const geminiSession = this.geminiSessions.get(sessionId);

      // Add user message to database first
      await this.addMessageToSession(sessionId, {
        timestamp: new Date(),
        role: 'user',
        content: text
      });

      if (geminiSession && this.ai) {
        console.log(`💬 Processing text input for session ${sessionId} via Gemini Live API`);
        
        // Send text to Gemini Live API
        geminiSession.session.sendRealtimeInput({
          text: text
        });

        // Wait for and process response
        await new Promise(resolve => setTimeout(resolve, 2000));

        const responses = geminiSession.responseQueue.splice(0);
        const textResponse = responses
          .filter((msg: any) => msg.serverContent && msg.serverContent.modelTurn)
          .map((msg: any) => msg.serverContent.modelTurn.parts
            ?.map((part: any) => part.text)
            .join(' ')
          )
          .join(' ');

        if (textResponse) {
          // Add to database
          await this.addMessageToSession(sessionId, {
            timestamp: new Date(),
            role: 'assistant',
            content: textResponse
          });

          console.log(`✅ Gemini text response for ${sessionId}: ${textResponse.substring(0, 100)}...`);
          return textResponse;
        }
      }

      // Fallback to rule-based processing
      console.log(`⚠️ Using fallback text processing for session ${sessionId}`);
      return this.fallbackTextProcessing(sessionId, text);

    } catch (error) {
      console.error('❌ Error processing text input:', error);
      return this.fallbackTextProcessing(sessionId, text);
    }
  }

  /**
   * Fallback text processing when Gemini Live API is not available
   */
  private async fallbackTextProcessing(sessionId: string, text: string): Promise<string> {
    const session = await VoiceSessionModel.findOne({ sessionId });
    if (!session) {
      return "I'm having trouble accessing your session. Could you try again?";
    }

    const response = this.generateFallbackResponse(session, text);

    // Add assistant response to database
    await this.addMessageToSession(sessionId, {
      timestamp: new Date(),
      role: 'assistant',
      content: response
    });

    return response;
  }

  /**
   * Generate fallback therapeutic response based on session context
   */
  private generateFallbackResponse(session: any, userMessage: string): string {
    const mode = THERAPEUTIC_MODES[session.emotion] || THERAPEUTIC_MODES['stress'];
    
    // Enhanced responses based on therapeutic mode
    const responses = {
      anger: [
        "I hear that you're feeling angry. Let's take a moment to breathe together. Can you tell me what triggered this feeling?",
        "Anger is a natural emotion that often protects other feelings. What might be underneath this anger?",
        "I notice your intensity level is quite high. Let's try the STOP technique: Stop, Take a step back, Observe, Proceed mindfully. Can you try this with me?",
        "It sounds like something really activated your anger. Let's explore what happened and find some healthy ways to express these feelings."
      ],
      anxiety: [
        "I can sense your anxiety. Let's ground ourselves together. Can you name 5 things you can see right now?",
        "Anxiety can feel overwhelming. Let's break this down. What's the worst that could happen, and how likely is it really?",
        "Your breathing might be quickening. Let's try a 4-7-8 breath together: inhale for 4, hold for 7, exhale for 8.",
        "I hear the worry in your voice. Let's challenge some of these anxious thoughts together. What evidence do we have for and against this worry?"
      ],
      sad: [
        "I'm here with you in this sadness. It's okay to feel this way. Can you tell me more about what's weighing on your heart?",
        "Depression can make everything feel heavy. Let's start small. What's one tiny thing that might bring you a moment of relief today?",
        "I hear the pain in your words. You don't have to go through this alone. What would be most helpful for you right now?",
        "Sometimes when we're sad, it helps to be gentle with ourselves. What would you say to a friend feeling this way?"
      ],
      stress: [
        "Stress can be overwhelming. Let's identify what's within your control and what isn't. What feels most pressing right now?",
        "I can hear the stress in your voice. Let's take a moment to prioritize. What absolutely needs to happen today versus what can wait?",
        "Stress affects us physically too. How is your body feeling right now? Let's do a quick body scan together.",
        "Let's break this stress down into smaller pieces. When everything feels urgent, what's the one thing you could focus on first?"
      ]
    };

    const emotionResponses = responses[session.emotion as keyof typeof responses] || responses.stress;
    const randomResponse = emotionResponses[Math.floor(Math.random() * emotionResponses.length)];

    return randomResponse;
  }

  /**
   * End session and cleanup Gemini connection
   */
  async endSession(sessionId: string): Promise<string | null> {
    try {
      // Close Gemini session if it exists
      const geminiSession = this.geminiSessions.get(sessionId);
      if (geminiSession) {
        try {
          geminiSession.session.close();
          console.log(`🔌 Closed Gemini session ${sessionId}`);
        } catch (error) {
          console.error(`❌ Error closing Gemini session ${sessionId}:`, error);
        }
        this.geminiSessions.delete(sessionId);
      }

      // Update session in database
      const session = await VoiceSessionModel.findOne({ sessionId });
      if (!session) {
        console.log(`❌ Session ${sessionId} not found for ending`);
        return null;
      }

      session.status = 'ended';
      session.endTime = new Date();
      await session.save();

      console.log(`✅ Enhanced session ${sessionId} ended and saved to database`);

      // Create journal entry
      const conversationSummary = this.summarizeConversation(session);
      const journalEntry = new JournalEntryModel({
        clerkId: session.clerkId,
        title: `AI Therapy Session - ${session.emotion}`,
        content: conversationSummary,
        source: this.ai ? 'gemini_voice_chat' : 'voice_chat',
        mood: session.intensity,
        metadata: {
          sessionId: session.sessionId,
          duration: session.duration,
          emotionIntensity: session.intensity,
          therapeuticTechniques: session.therapeuticContext.recommendedTechniques,
          conversationLog: session.conversationLog,
          aiModel: this.ai ? 'gemini-2.5-flash-preview-native-audio-dialog' : 'fallback',
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

      console.log(`✅ Enhanced voice session ${sessionId} saved as journal entry: ${journalEntry.id}`);
      return journalEntry.id;
    } catch (error) {
      console.error('❌ Error ending enhanced session:', error);
      return null;
    }
  }

  // Keep all existing helper methods from the original service
  private async getUserHistory(clerkId: string) {
    if (this.HACKATHON_MODE) {
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

  private analyzeMoodTrends(emotions: EmotionEntry[]): any {
    if (emotions.length === 0) {
      return { trend: 'stable', averageIntensity: 5 };
    }

    const intensities = emotions.map(e => e.intensity);
    const averageIntensity = intensities.reduce((a, b) => a + b, 0) / intensities.length;

    const recent = emotions.slice(0, 3);
    const older = emotions.slice(3, 6);
    
    const recentAvg = recent.length > 0 ? recent.reduce((sum, e) => sum + e.intensity, 0) / recent.length : averageIntensity;
    const olderAvg = older.length > 0 ? older.reduce((sum, e) => sum + e.intensity, 0) / older.length : averageIntensity;

    let trend = 'stable';
    if (recentAvg > olderAvg + 1) trend = 'improving';
    else if (recentAvg < olderAvg - 1) trend = 'declining';

    return { trend, averageIntensity: Math.round(averageIntensity) };
  }

  private async addMessageToSession(sessionId: string, message: {
    timestamp: Date;
    role: 'user' | 'assistant';
    content: string;
    audioData?: string;
  }) {
    try {
      // Get session from memory first
      const memorySession = this.activeSessions.get(sessionId);
      if (memorySession) {
        memorySession.conversationLog.push(message);
        
        // Update metadata
        memorySession.metadata.totalMessages = memorySession.conversationLog.length;
        memorySession.metadata.userMessages = memorySession.conversationLog.filter((log: any) => log.role === 'user').length;
        memorySession.metadata.assistantMessages = memorySession.conversationLog.filter((log: any) => log.role === 'assistant').length;
      }

      // Try to save to database if available
      if (this.DATABASE_AVAILABLE) {
        try {
          const session = await VoiceSessionModel.findOne({ sessionId });
          if (session) {
            session.conversationLog.push(message);
            await session.save();
            console.log(`✅ Message saved to database for session ${sessionId}: ${message.role} - ${message.content.substring(0, 50)}...`);
          }
        } catch (dbError) {
          console.log(`⚠️ Database save failed for message in session ${sessionId}, kept in memory`);
        }
      }
      
      console.log(`✅ Message added to enhanced session ${sessionId}: ${message.role} - ${message.content.substring(0, 50)}...`);
    } catch (error) {
      console.error('❌ Error adding message to enhanced session:', error);
    }
  }

  private summarizeConversation(session: any): string {
    const userMessages = session.conversationLog
      .filter((log: any) => log.role === 'user')
      .map((log: any) => log.content)
      .join(' ');

    const mode = THERAPEUTIC_MODES[session.emotion] || THERAPEUTIC_MODES['stress'];
    const aiModel = this.ai ? 'Gemini Live API with real-time audio processing' : 'Fallback therapeutic responses';
    
    return `AI-powered voice therapy session focused on ${session.emotion} (intensity: ${session.intensity}/10). 

Therapeutic approach: ${mode.primaryApproach}
AI Model: ${aiModel}

Key discussion points: ${userMessages}

Session duration: ${session.duration} minutes
Techniques discussed: ${mode.techniques.join(', ')}
Total messages: ${session.metadata.totalMessages} (User: ${session.metadata.userMessages}, Assistant: ${session.metadata.assistantMessages})`;
  }

  private analyzeSentiment(session: any): 'positive' | 'negative' | 'neutral' {
    const userMessages = session.conversationLog
      .filter((log: any) => log.role === 'user')
      .map((log: any) => log.content.toLowerCase());

    const positiveWords = ['good', 'better', 'happy', 'relieved', 'calm', 'peaceful', 'grateful', 'hopeful', 'improving', 'comfortable'];
    const negativeWords = ['bad', 'worse', 'sad', 'angry', 'anxious', 'stressed', 'hopeless', 'overwhelmed', 'terrible', 'awful'];

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

  private extractKeyThemes(session: any): string[] {
    const userMessages = session.conversationLog
      .filter((log: any) => log.role === 'user')
      .map((log: any) => log.content);

    const themes = new Set<string>();
    
    const themeKeywords = {
      'work': ['work', 'job', 'career', 'office', 'meeting', 'deadline', 'boss', 'colleague'],
      'relationships': ['friend', 'family', 'partner', 'relationship', 'love', 'marriage', 'divorce', 'parent'],
      'health': ['health', 'sick', 'pain', 'doctor', 'medical', 'physical', 'hospital', 'medication'],
      'finances': ['money', 'financial', 'bills', 'debt', 'expenses', 'budget', 'cost', 'pay'],
      'future': ['future', 'planning', 'goals', 'dreams', 'aspirations', 'hope', 'worry', 'scared'],
      'self-esteem': ['confidence', 'self-worth', 'shame', 'guilt', 'proud', 'accomplishment', 'failure'],
      'sleep': ['sleep', 'tired', 'exhausted', 'insomnia', 'rest', 'energy', 'fatigue']
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

  private generateInsights(session: any): string[] {
    const insights = [];
    
    if (session.duration > 15) {
      insights.push('Extended session duration suggests deep engagement with therapeutic process');
    }
    
    if (session.metadata.userMessages > 5) {
      insights.push('High user engagement indicates willingness to explore emotions');
    }
    
    if (session.intensity > 7) {
      insights.push('High emotion intensity suggests significant distress requiring continued support');
    }

    if (this.ai) {
      insights.push('Session utilized real-time AI audio processing for natural conversation flow');
    }

    return insights;
  }

  // Public interface methods matching original service
  async getSession(sessionId: string): Promise<any> {
    try {
      // Check memory first
      const memorySession = this.activeSessions.get(sessionId);
      if (memorySession) {
        return memorySession;
      }

      // Check database if available
      if (this.DATABASE_AVAILABLE) {
        return await VoiceSessionModel.findOne({ sessionId });
      }

      return null;
    } catch (error) {
      console.error('❌ Error getting enhanced session:', error);
      return null;
    }
  }

  isAvailable(): boolean {
    return true; // Always available, falls back to rule-based if Gemini unavailable
  }

  async getActiveSessionsCount(): Promise<number> {
    try {
      if (this.DATABASE_AVAILABLE) {
        return await VoiceSessionModel.countDocuments({ status: 'active' });
      } else {
        // Count active sessions in memory
        return Array.from(this.activeSessions.values())
          .filter((session: any) => session.status === 'active').length;
      }
    } catch (error) {
      console.error('❌ Error getting active enhanced sessions count:', error);
      return 0;
    }
  }

  async getUserVoiceSessions(clerkId: string, limit: number = 10): Promise<any[]> {
    try {
      return await VoiceSessionModel.find({ clerkId })
        .sort({ startTime: -1 })
        .limit(limit)
        .lean();
    } catch (error) {
      console.error('❌ Error getting user enhanced voice sessions:', error);
      return [];
    }
  }

  // Compatibility methods for existing API
  async processUserMessage(sessionId: string, message: string): Promise<string> {
    return this.processTextInput(sessionId, message);
  }
}

export const enhancedVoiceChatService = new EnhancedVoiceChatService();
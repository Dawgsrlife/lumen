/**
 * Voice Chat Service using Gemini Live API
 * Provides real-time conversational therapy with CBT, DBT, and clinical techniques
 */

import { GoogleGenAI, Modality } from '@google/genai';
import { EmotionEntryModel } from '../models/EmotionEntry.js';
import { GameSessionModel } from '../models/GameSession.js';
import { JournalEntryModel } from '../models/JournalEntry.js';
import type { GameSession } from '../types/index.js';

// Game context mapping
const GAME_CONTEXTS = {
  'meditation': {
    description: 'Guided meditation practice focusing on mindfulness and present-moment awareness',
    therapeuticGoal: 'Stress reduction, emotional regulation, mindfulness cultivation',
    techniques: ['Mindfulness-based stress reduction (MBSR)', 'Focused attention meditation']
  },
  'breathing': {
    description: 'Breathing exercises for anxiety and stress management',
    therapeuticGoal: 'Activate parasympathetic nervous system, reduce anxiety',
    techniques: ['Progressive muscle relaxation', 'Diaphragmatic breathing', 'Box breathing']
  },
  'mindfulness': {
    description: 'Mindfulness exercises for present-moment awareness',
    therapeuticGoal: 'Increase self-awareness, reduce rumination',
    techniques: ['Body scan meditation', 'Mindful observation', 'Mindful walking']
  },
  'cognitive': {
    description: 'Cognitive exercises for thought pattern awareness',
    therapeuticGoal: 'Identify and restructure negative thought patterns',
    techniques: ['Cognitive restructuring', 'Thought challenging', 'Cognitive defusion']
  },
  'journaling': {
    description: 'Structured journaling for emotional processing',
    therapeuticGoal: 'Emotional expression and insight development',
    techniques: ['Gratitude journaling', 'Thought records', 'Emotion regulation worksheets']
  }
};

interface VoiceChatSession {
  id: string;
  clerkId: string;
  emotion: string;
  intensity: number;
  recentGame?: GameSession;
  conversationLog: Array<{
    timestamp: Date;
    role: 'user' | 'assistant';
    content: string;
    audioData?: string;
  }>;
  therapeuticContext: {
    primaryConcern: string;
    recommendedTechniques: string[];
    sessionGoals: string[];
  };
}

class VoiceChatService {
  private genAI: GoogleGenAI;
  private activeSessions: Map<string, VoiceChatSession> = new Map();

  constructor() {
    if (!process.env.GOOGLE_AI_API_KEY) {
      console.warn('GOOGLE_AI_API_KEY not found. Voice chat will not function.');
      return;
    }
    
    this.genAI = new GoogleGenAI({
      apiKey: process.env.GOOGLE_AI_API_KEY
    });
  }

  /**
   * Initialize a new voice chat session with therapeutic context
   */
  async initializeSession(
    sessionId: string, 
    clerkId: string, 
    emotion: string, 
    intensity: number
  ): Promise<VoiceChatSession> {
    
    // Get recent context from database
    await EmotionEntryModel
      .findOne({ clerkId, emotion })
      .sort({ createdAt: -1 })
      .limit(1);

    const recentGame = await GameSessionModel
      .findOne({ clerkId })
      .sort({ createdAt: -1 })
      .limit(1);

    const recentJournals = await JournalEntryModel
      .find({ clerkId })
      .sort({ createdAt: -1 })
      .limit(3);

    // Determine therapeutic context and approach
    const therapeuticContext = this.determineTherapeuticApproach(
      emotion, 
      intensity, 
      recentGame, 
      recentJournals
    );

    const session: VoiceChatSession = {
      id: sessionId,
      clerkId,
      emotion,
      intensity,
      recentGame: recentGame?.toObject(),
      conversationLog: [],
      therapeuticContext
    };

    this.activeSessions.set(sessionId, session);
    return session;
  }

  /**
   * Generate system instruction for Gemini Live API based on user context
   */
  private generateSystemInstruction(session: VoiceChatSession): string {
    const gameContext = session.recentGame ? 
      GAME_CONTEXTS[session.recentGame.gameType as keyof typeof GAME_CONTEXTS] : null;

    return `
You are Dr. Lumen, a compassionate and expert mental health therapist specializing in evidence-based interventions. You are conducting a voice therapy session.

CURRENT SESSION CONTEXT:
- User's Current Emotion: ${session.emotion} (intensity: ${session.intensity}/10)
- Primary Concern: ${session.therapeuticContext.primaryConcern}
- Session Goals: ${session.therapeuticContext.sessionGoals.join(', ')}

${gameContext ? `
RECENT ACTIVITY CONTEXT:
- Just completed: ${gameContext.description}
- Therapeutic Goal: ${gameContext.therapeuticGoal}
- Associated Techniques: ${gameContext.techniques.join(', ')}
- Duration: ${session.recentGame?.duration} minutes
- Emotion Before: ${session.recentGame?.emotionBefore}
- Emotion After: ${session.recentGame?.emotionAfter || 'In progress'}
` : ''}

THERAPEUTIC APPROACH:
Use evidence-based techniques from:

1. COGNITIVE BEHAVIORAL THERAPY (CBT):
   - Cognitive restructuring for negative thought patterns
   - Behavioral activation for depression/low mood
   - Exposure therapy for anxiety/avoidance
   - Problem-solving therapy for stress management
   
2. DIALECTICAL BEHAVIOR THERAPY (DBT):
   - Distress tolerance: TIPP, PLEASE, radical acceptance
   - Emotion regulation: Opposite action, labeling, self-soothing
   - Interpersonal effectiveness: DEAR MAN, boundaries
   - Mindfulness: Observe, describe, participate non-judgmentally

3. MINDFULNESS-BASED INTERVENTIONS:
   - MBSR techniques for stress reduction
   - MBCT for preventing rumination
   - Self-compassion practices
   - Present-moment awareness exercises

4. TRAUMA-INFORMED CARE:
   - Safety and stabilization first
   - Window of tolerance awareness
   - Grounding techniques when needed
   - Strengths-based approach

CLINICAL GUIDELINES:
- Keep responses conversational but therapeutic
- Use active listening and validation
- Ask open-ended questions to explore
- Provide specific, actionable techniques
- Monitor for crisis indicators
- Reference relevant research when helpful
- Maintain warm, empathetic tone
- Sessions should be 10-15 minutes typically

CONVERSATION STYLE:
- Speak naturally as if in person
- Use empathetic reflections
- Ask one question at a time
- Provide concrete coping strategies
- Validate emotions while promoting growth
- Use "I" statements and collaborative language

Begin by acknowledging their current emotional state and recent activity, then guide them through evidence-based exploration and skill-building.
    `.trim();
  }

  /**
   * Determine therapeutic approach based on user context
   */
  private determineTherapeuticApproach(
    emotion: string, 
    intensity: number
  ) {
    let primaryConcern = '';
    let recommendedTechniques: string[] = [];
    let sessionGoals: string[] = [];

    // Determine approach based on emotion and intensity
    switch (emotion) {
      case 'anxiety':
        primaryConcern = 'Anxiety and worry management';
        recommendedTechniques = ['Breathing exercises', 'Cognitive restructuring', 'Grounding techniques'];
        sessionGoals = ['Reduce immediate anxiety', 'Learn coping skills', 'Challenge anxious thoughts'];
        break;
      
      case 'sad':
        primaryConcern = 'Depression and low mood';
        recommendedTechniques = ['Behavioral activation', 'Mood monitoring', 'Self-compassion'];
        sessionGoals = ['Explore sadness', 'Identify positive activities', 'Build self-compassion'];
        break;
      
      case 'stress':
        primaryConcern = 'Stress management and overwhelm';
        recommendedTechniques = ['Stress reduction', 'Problem-solving', 'Relaxation techniques'];
        sessionGoals = ['Identify stressors', 'Develop coping strategies', 'Practice relaxation'];
        break;
      
      case 'anger':
      case 'frustration':
        primaryConcern = 'Anger and frustration management';
        recommendedTechniques = ['Emotion regulation', 'Distress tolerance', 'Communication skills'];
        sessionGoals = ['Understand anger triggers', 'Learn regulation skills', 'Practice healthy expression'];
        break;
      
      case 'loneliness':
        primaryConcern = 'Social connection and isolation';
        recommendedTechniques = ['Interpersonal effectiveness', 'Social skills', 'Self-compassion'];
        sessionGoals = ['Explore loneliness', 'Build connection skills', 'Address social anxiety'];
        break;
      
      default:
        primaryConcern = 'Emotional wellness and self-awareness';
        recommendedTechniques = ['Mindfulness', 'Emotional awareness', 'Coping skills'];
        sessionGoals = ['Increase self-awareness', 'Build emotional skills', 'Promote well-being'];
    }

    // Adjust based on intensity
    if (intensity >= 8) {
      recommendedTechniques.unshift('Crisis coping', 'Grounding', 'Safety planning');
      sessionGoals.unshift('Immediate stabilization');
    }

    return {
      primaryConcern,
      recommendedTechniques,
      sessionGoals
    };
  }

  /**
   * Create Gemini Live API session
   */
  async createLiveSession(sessionId: string): Promise<unknown> {
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    const systemInstruction = this.generateSystemInstruction(session);

    const config = {
      responseModalities: [Modality.AUDIO, Modality.TEXT],
      systemInstruction: {
        parts: [{ text: systemInstruction }]
      },
      generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        maxOutputTokens: 1000,
      }
    };

    // Use native audio model for best experience
    const model = "gemini-2.5-flash-preview-native-audio-dialog";

    const responseQueue: unknown[] = [];

    const liveSession = await this.genAI.live.connect({
      model,
      callbacks: {
        onopen: () => {
          console.log(`Voice chat session ${sessionId} opened`);
        },
        onmessage: (message: unknown) => {
          responseQueue.push(message);
          this.handleLiveMessage(sessionId, message);
        },
        onerror: (error: unknown) => {
          console.error(`Voice chat session ${sessionId} error:`, error);
        },
        onclose: (reason: unknown) => {
          console.log(`Voice chat session ${sessionId} closed:`, reason);
          this.endSession(sessionId);
        }
      },
      config
    });

    return liveSession;
  }

  /**
   * Handle incoming message from Gemini Live API
   */
  private handleLiveMessage(sessionId: string, message: unknown) {
    const session = this.activeSessions.get(sessionId);
    if (!session) return;

    // Log the conversation
    if (message.text) {
      session.conversationLog.push({
        timestamp: new Date(),
        role: 'assistant',
        content: message.text,
        audioData: message.audio?.data
      });
    }

    // Handle user input logging is done when audio is sent
  }

  /**
   * Send user audio to the live session
   */
  async sendUserAudio(sessionId: string, audioData: string) {
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    // Log user input (we don't have transcription here, but we can note the interaction)
    session.conversationLog.push({
      timestamp: new Date(),
      role: 'user',
      content: '[Audio input]',
      audioData
    });

    // This would be handled by the WebSocket connection in practice
    // The actual implementation depends on how you structure the WebSocket server
  }

  /**
   * End session and save conversation as journal entry
   */
  async endSession(sessionId: string): Promise<string | null> {
    const session = this.activeSessions.get(sessionId);
    if (!session) return null;

    // Create conversation summary
    const conversationSummary = this.summarizeConversation(session);

    // Save as journal entry
    const journalEntry = new JournalEntryModel({
      clerkId: session.clerkId,
      content: conversationSummary,
      mood: session.emotion,
      tags: ['voice_therapy', 'live_session', ...session.therapeuticContext.recommendedTechniques],
      isPrivate: true,
      metadata: {
        source: 'voice_chat',
        sessionId: sessionId,
        duration: this.calculateSessionDuration(session),
        emotionIntensity: session.intensity,
        therapeuticTechniques: session.therapeuticContext.recommendedTechniques,
        conversationLog: session.conversationLog
      }
    });

    await journalEntry.save();

    // Clean up session
    this.activeSessions.delete(sessionId);

    return journalEntry._id.toString();
  }

  /**
   * Create conversation summary for journal storage
   */
  private summarizeConversation(session: VoiceChatSession): string {
    const startTime = session.conversationLog[0]?.timestamp || new Date();
    const endTime = session.conversationLog[session.conversationLog.length - 1]?.timestamp || new Date();
    const duration = Math.round((endTime.getTime() - startTime.getTime()) / 60000); // minutes

    const gameContext = session.recentGame ? 
      `\n\nSession Context: Just completed ${session.recentGame.gameType} activity (${session.recentGame.duration} minutes) with emotion transition from ${session.recentGame.emotionBefore} to ${session.recentGame.emotionAfter || 'in progress'}.` : '';

    return `
Voice Therapy Session Summary
Date: ${startTime.toLocaleString()}
Duration: ${duration} minutes
Initial Emotion: ${session.emotion} (intensity: ${session.intensity}/10)
Primary Concern: ${session.therapeuticContext.primaryConcern}
Therapeutic Techniques: ${session.therapeuticContext.recommendedTechniques.join(', ')}

Session Goals:
${session.therapeuticContext.sessionGoals.map(goal => `- ${goal}`).join('\n')}
${gameContext}

Conversation Highlights:
${session.conversationLog
  .filter(log => log.role === 'assistant' && log.content !== '[Audio input]')
  .slice(0, 5) // First 5 assistant responses
  .map((log, index) => `${index + 1}. ${log.content}`)
  .join('\n')}

Total Interactions: ${session.conversationLog.length}

This voice therapy session focused on evidence-based therapeutic techniques including CBT, DBT, and mindfulness practices, tailored to the user's current emotional state and recent activities.
    `.trim();
  }

  /**
   * Calculate session duration in minutes
   */
  private calculateSessionDuration(session: VoiceChatSession): number {
    if (session.conversationLog.length < 2) return 0;
    
    const start = session.conversationLog[0].timestamp;
    const end = session.conversationLog[session.conversationLog.length - 1].timestamp;
    return Math.round((end.getTime() - start.getTime()) / 60000);
  }

  /**
   * Get active session
   */
  getSession(sessionId: string): VoiceChatSession | undefined {
    return this.activeSessions.get(sessionId);
  }

  /**
   * Check if service is available
   */
  isAvailable(): boolean {
    return !!process.env.GOOGLE_AI_API_KEY;
  }
}

export const voiceChatService = new VoiceChatService();
export { VoiceChatSession };
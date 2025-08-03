import { GoogleGenerativeAI } from '@google/generative-ai';
import { EmotionType, EmotionEntry, UserAnalytics } from '../types';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
console.log('🔑 API Key loaded:', apiKey ? 'Yes (length: ' + apiKey.length + ')' : 'No');

const genAI = new GoogleGenerativeAI(apiKey);

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  emotionContext?: {
    currentEmotion?: EmotionType;
    intensity?: number;
    recentEntries?: EmotionEntry[];
  };
}

export interface ChatContext {
  userAnalytics?: UserAnalytics;
  recentEmotions?: EmotionEntry[];
  currentMood?: {
    emotion: EmotionType;
    intensity: number;
    context?: string;
  };
  conversationHistory: ChatMessage[];
}

export class ChatbotService {
  private static instance: ChatbotService;
  private model: unknown;

  private constructor() {
    console.log('🤖 Initializing ChatbotService...');
    if (!apiKey) {
      console.error('❌ No API key found! Please check your .env file');
      throw new Error('No API key configured');
    }
    
    this.model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 1024,
      },
      systemInstruction: `You are Lumi, a compassionate AI companion integrated into the Lumen mental health app. 

Core traits:
- Warm, empathetic, and non-judgmental
- Provide supportive conversation aware of user's emotional state
- Keep responses concise but meaningful (minimalist design philosophy)
- Guide users toward therapeutic activities and app features
- Maintain professional boundaries while being caring

Safety protocols:
- For crisis situations, direct to professional help immediately
- Never provide medical advice or diagnose conditions
- Encourage professional mental health support when appropriate`
    });
    console.log('✅ ChatbotService initialized successfully');
  }

  public static getInstance(): ChatbotService {
    if (!ChatbotService.instance) {
      ChatbotService.instance = new ChatbotService();
    }
    return ChatbotService.instance;
  }

  private buildContextPrompt(context: ChatContext): string {
    const { userAnalytics, recentEmotions, currentMood } = context;
    
    return `## User's Current Emotional Context:
${currentMood ? `
**Current Mood**: ${currentMood.emotion} (intensity: ${currentMood.intensity}/10)
${currentMood.context ? `**Context**: ${currentMood.context}` : ''}
` : '**Current Mood**: Not recently tracked'}

${userAnalytics ? `
**Mental Health Journey**:
- Total emotion entries: ${userAnalytics.totalEntries}
- Current streak: ${userAnalytics.streakData.current} days
- Average mood: ${userAnalytics.averageMood.toFixed(1)}/10
- Most frequent emotion: ${userAnalytics.emotionDistribution ? Object.entries(userAnalytics.emotionDistribution).sort(([,a], [,b]) => b - a)[0]?.[0] || 'Not available' : 'Not available'}
- Games played: ${userAnalytics.gamesPlayed}
` : '**User Journey**: New user or limited data available'}

${recentEmotions && recentEmotions.length > 0 ? `
**Recent Emotional Pattern** (last ${recentEmotions.length} entries):
${recentEmotions.map(entry => 
  `- ${new Date(entry.createdAt).toLocaleDateString()}: ${entry.emotion} (${entry.intensity}/10)${entry.context ? ` - ${entry.context.substring(0, 50)}...` : ''}`
).join('\n')}
` : '**Recent Pattern**: No recent emotion entries available'}

## Available Therapeutic Activities:
Based on emotions, suggest these mini-games:
- Sadness → Color Bloom (nurture flowers)
- Anger → Smash Shift (controlled destruction with breathing)
- Loneliness → Echo Garden (plant seeds with shared messages)
- Anxiety → Breath Beacon (guide orb with breath patterns)
- Frustration → Reset Runes (puzzle solving)
- Stress → Sound Stream (ambient relaxation)
- Lethargy → Light Up (gentle movement)
- Fear → Shadow Steps (calm movement)
- Grief → Memory Lanterns (reflection and release)

## Crisis Response:
If user expresses self-harm thoughts: "I'm concerned about you and want to help. Please reach out to a mental health professional, call a crisis hotline (988 in the US), or go to your nearest emergency room. You don't have to go through this alone."`;
  }

  async generateResponse(
    userMessage: string, 
    context: ChatContext
  ): Promise<string> {
    try {
      console.log('💬 Generating response for:', userMessage.substring(0, 50) + '...');
      
      const systemPrompt = this.buildContextPrompt(context);
      
      // Build conversation history
      const conversationContext = context.conversationHistory
        .slice(-10) // Last 10 messages for context
        .map(msg => `${msg.role}: ${msg.content}`)
        .join('\n');

      const fullPrompt = `${systemPrompt}

## Recent Conversation:
${conversationContext}

## Current User Message:
user: ${userMessage}

## Your Response:
assistant:`;

      console.log('📤 Sending request to Gemini API...');
      const result = await this.model.generateContent(fullPrompt);
      const response = await result.response;
      const responseText = response.text();
      console.log('✅ Received response:', responseText.substring(0, 50) + '...');
      return responseText;
    } catch (error) {
      console.error('❌ Chatbot response generation failed:', error);
      
      // Fallback response based on current mood
      if (context.currentMood) {
        return this.getFallbackResponse(context.currentMood.emotion);
      }
      
      return "I'm here to listen and support you. How are you feeling today?";
    }
  }

  private getFallbackResponse(emotion: EmotionType): string {
    const responses = {
      happy: "It's wonderful to hear from you! I'd love to hear more about what's bringing you joy today.",
      sad: "I'm here with you. Sometimes it helps to talk about what's weighing on your heart.",
      loneliness: "You're not alone - I'm here to chat and listen. What's on your mind?",
      anxiety: "I can sense you might be feeling anxious. Take a deep breath with me. What's making you feel this way?",
      frustration: "Frustration can be really overwhelming. I'm here to listen without judgment. What's been bothering you?",
      stress: "Stress can feel so heavy. Let's take this one step at a time. What's been on your mind lately?",
      lethargy: "Sometimes our energy feels low, and that's okay. I'm here to gently support you. How has your day been?",
      fear: "Fear can feel so isolating. You're safe here with me. Would you like to share what's worrying you?",
      grief: "Grief is one of the deepest emotions we experience. I'm here to honor your feelings and listen."
    };

    return responses[emotion] || "I'm here to listen and support you. How are you feeling right now?";
  }
}

export const chatbotService = ChatbotService.getInstance();
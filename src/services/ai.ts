import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

export interface AIFeedbackRequest {
  emotion: string;
  intensity: number;
  context?: string;
  recentEmotions?: Array<{
    emotion: string;
    date: string;
    note?: string;
  }>;
  userGoals?: string[];
}

export interface AIFeedbackResponse {
  insight: string;
  advice: string[];
  activities: string[];
  mood: 'positive' | 'neutral' | 'negative';
  confidence: number;
}

export class AIService {
  private static instance: AIService;
  private model: unknown;

  private constructor() {
    this.model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  }

  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  async generateFeedback(request: AIFeedbackRequest): Promise<AIFeedbackResponse> {
    try {
      const prompt = this.buildPrompt(request);
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return this.parseAIResponse(text);
    } catch (error) {
      console.error('AI feedback generation failed:', error);
      return this.getFallbackResponse(request.emotion);
    }
  }

  private buildPrompt(request: AIFeedbackRequest): string {
    const { emotion, intensity, context, recentEmotions, userGoals } = request;
    
    const prompt = `You are a compassionate mental health AI assistant. Analyze the user's emotional state and provide supportive, actionable feedback.

Current Emotion: ${emotion}
Intensity Level: ${intensity}/10
${context ? `Context: ${context}` : ''}

${recentEmotions && recentEmotions.length > 0 ? `
Recent Emotional Pattern:
${recentEmotions.map(e => `- ${e.date}: ${e.emotion}${e.note ? ` (${e.note})` : ''}`).join('\n')}
` : ''}

${userGoals && userGoals.length > 0 ? `
User Goals: ${userGoals.join(', ')}
` : ''}

Please provide a response in the following JSON format:
{
  "insight": "A brief, empathetic insight about their emotional state",
  "advice": ["3-4 specific, actionable pieces of advice"],
  "activities": ["2-3 therapeutic activities they could try"],
  "mood": "positive|neutral|negative",
  "confidence": 0.85
}

Focus on being supportive, non-judgmental, and providing practical suggestions.`;

    return prompt;
  }

  private parseAIResponse(text: string): AIFeedbackResponse {
    try {
      // Try to extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          insight: parsed.insight || 'I understand how you\'re feeling.',
          advice: Array.isArray(parsed.advice) ? parsed.advice : ['Take a moment to breathe deeply.'],
          activities: Array.isArray(parsed.activities) ? parsed.activities : ['Try a short meditation.'],
          mood: ['positive', 'neutral', 'negative'].includes(parsed.mood) ? parsed.mood : 'neutral',
          confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0.8,
        };
      }
    } catch (error) {
      console.error('Failed to parse AI response:', error);
    }

    // Fallback parsing
    return this.getFallbackResponse('neutral');
  }

  private getFallbackResponse(emotion: string): AIFeedbackResponse {
    const fallbackResponses = {
      '😊': {
        insight: 'It\'s wonderful that you\'re feeling positive!',
        advice: ['Savor this moment', 'Share your joy with others', 'Practice gratitude'],
        activities: ['Write in a gratitude journal', 'Take a nature walk'],
        mood: 'positive' as const,
        confidence: 0.9,
      },
      '😐': {
        insight: 'It\'s okay to feel neutral - emotions ebb and flow naturally.',
        advice: ['Check in with yourself', 'Try a small positive activity', 'Be patient with yourself'],
        activities: ['Try a 5-minute meditation', 'Listen to calming music'],
        mood: 'neutral' as const,
        confidence: 0.8,
      },
      '😢': {
        insight: 'I hear you, and your feelings are valid.',
        advice: ['Be gentle with yourself', 'Reach out to someone you trust', 'Remember this will pass'],
        activities: ['Practice self-compassion', 'Try a breathing exercise'],
        mood: 'negative' as const,
        confidence: 0.7,
      },
    };

    return fallbackResponses[emotion as keyof typeof fallbackResponses] || fallbackResponses['😐'];
  }

  async generateWeeklyInsight(weeklyData: unknown): Promise<string> {
    try {
      const prompt = `Analyze this weekly emotional data and provide a brief, supportive insight:

${JSON.stringify(weeklyData, null, 2)}

Provide a 2-3 sentence insight that's encouraging and actionable.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Weekly insight generation failed:', error);
      return 'You\'ve been tracking your emotions consistently this week. Keep up the great work!';
    }
  }

  async generateMoodPrediction(historicalData: unknown): Promise<string> {
    try {
      const prompt = `Based on this emotional history, provide a gentle prediction or pattern observation:

${JSON.stringify(historicalData, null, 2)}

Keep it supportive and not deterministic.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Mood prediction failed:', error);
      return 'Your emotional patterns show resilience and growth.';
    }
  }
}

export const aiService = AIService.getInstance(); 
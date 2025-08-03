import { GoogleGenerativeAI } from '@google/generative-ai';
import type { 
  EmotionEntry, 
  JournalEntry, 
  GameSession, 
  AIInsightRequest, 
  AIInsightResponse,
  DailyEntry 
} from '../types/index.js';

const GOOGLE_AI_API_KEY = process.env.GOOGLE_AI_API_KEY || 'test-key';

// Only throw error if we're not in development mode
if (!GOOGLE_AI_API_KEY || GOOGLE_AI_API_KEY === 'test-key') {
  console.warn('⚠️  GOOGLE_AI_API_KEY not set - AI features will be disabled');
}

const genAI = GOOGLE_AI_API_KEY && GOOGLE_AI_API_KEY !== 'test-key' 
  ? new GoogleGenerativeAI(GOOGLE_AI_API_KEY) 
  : null;

export class AIService {
  private model = genAI?.getGenerativeModel({ model: 'gemini-pro' });

  /**
   * Generate insights based on user's emotion and journal data
   */
  async generateInsights(
    request: AIInsightRequest,
    emotionEntries: EmotionEntry[],
    journalEntries: JournalEntry[],
    gameSessions: GameSession[]
  ): Promise<AIInsightResponse> {
    if (!this.model) {
      console.warn('AI model not initialized, skipping insight generation.');
      return {
        summary: 'AI insights unavailable due to missing API key.',
        insights: ['Consider setting up an API key for enhanced insights.'],
        recommendations: [],
        resources: [],
        moodTrend: 'Analysis available',
        patterns: []
      };
    }

    try {
      const prompt = this.buildInsightPrompt(request, emotionEntries, journalEntries, gameSessions);
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return this.parseAIResponse(text);
    } catch (error) {
      console.error('AI insight generation error:', error);
      throw new Error('Failed to generate AI insights');
    }
  }

  /**
   * Analyze a single journal entry for sentiment and insights
   */
  async analyzeJournalEntry(entry: JournalEntry): Promise<{
    sentiment: 'positive' | 'negative' | 'neutral';
    keyThemes: string[];
    suggestions: string[];
  }> {
    if (!this.model) {
      console.warn('AI model not initialized, skipping journal analysis.');
      return {
        sentiment: 'neutral',
        keyThemes: [],
        suggestions: []
      };
    }

    try {
      const prompt = `
        Analyze this journal entry for mental health insights:
        
        Content: "${entry.content}"
        Mood: ${entry.mood}
        Tags: ${entry.tags.join(', ')}
        
        Provide a JSON response with:
        - sentiment: "positive", "negative", or "neutral"
        - keyThemes: array of main themes/topics
        - suggestions: array of helpful suggestions or coping strategies
        
        Response format:
        {
          "sentiment": "positive|negative|neutral",
          "keyThemes": ["theme1", "theme2"],
          "suggestions": ["suggestion1", "suggestion2"]
        }
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return JSON.parse(text);
    } catch (error) {
      console.error('Journal analysis error:', error);
      return {
        sentiment: 'neutral',
        keyThemes: [],
        suggestions: []
      };
    }
  }

  /**
   * Generate personalized recommendations based on user patterns
   */
  async generateRecommendations(
    emotionEntries: EmotionEntry[],
    journalEntries: JournalEntry[]
  ): Promise<string[]> {
    if (!this.model) {
      console.warn('AI model not initialized, skipping recommendation generation.');
      return [
        'Consider practicing mindfulness or meditation',
        'Maintain a regular sleep schedule',
        'Stay connected with friends and family'
      ];
    }

    try {
      const prompt = `
        Based on this user's mental health data, provide 3-5 personalized recommendations:
        
        Emotion Entries: ${JSON.stringify(emotionEntries.slice(-10))}
        Journal Entries: ${JSON.stringify(journalEntries.slice(-5))}
        
        Focus on:
        - Coping strategies for their most common emotions
        - Self-care suggestions
        - Positive reinforcement
        - Professional help recommendations if needed
        
        Return as a JSON array of strings.
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return JSON.parse(text);
    } catch (error) {
      console.error('Recommendation generation error:', error);
      return [
        'Consider practicing mindfulness or meditation',
        'Maintain a regular sleep schedule',
        'Stay connected with friends and family'
      ];
    }
  }

  private buildInsightPrompt(
    request: AIInsightRequest,
    emotionEntries: EmotionEntry[],
    journalEntries: JournalEntry[],
    gameSessions: GameSession[]
  ): string {
    const timeframe = request.timeframe;
    const focus = request.focus || 'all';
    
    return `
      Analyze this user's mental health data and provide comprehensive insights:
      
      Timeframe: ${timeframe}
      Focus: ${focus}
      
      Emotion Entries (${emotionEntries.length}):
      ${JSON.stringify(emotionEntries)}
      
      Journal Entries (${journalEntries.length}):
      ${JSON.stringify(journalEntries)}
      
      Game Sessions (${gameSessions.length}):
      ${JSON.stringify(gameSessions)}
      
      Provide a comprehensive analysis including:
      1. Overall mood trends and patterns
      2. Key insights about their emotional state
      3. Personalized recommendations
      4. Coping strategies
      5. Resources and next steps
      
      Format the response as JSON:
      {
        "summary": "Brief overview of their mental health journey",
        "insights": ["insight1", "insight2", "insight3"],
        "recommendations": ["rec1", "rec2", "rec3"],
        "resources": ["resource1", "resource2"],
        "moodTrend": "Description of mood trends",
        "patterns": ["pattern1", "pattern2"]
      }
    `;
  }

  private parseAIResponse(text: string): AIInsightResponse {
    try {
      // Try to extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // Fallback parsing
      return {
        summary: text.split('\n')[0] || 'Analysis completed',
        insights: text.split('\n').filter(line => line.startsWith('-')).map(line => line.substring(2)),
        recommendations: [],
        resources: [],
        moodTrend: 'Analysis available',
        patterns: []
      };
    } catch (error) {
      console.error('AI response parsing error:', error);
      return {
        summary: 'Analysis completed',
        insights: ['Consider tracking your mood regularly'],
        recommendations: ['Practice self-care', 'Stay connected with others'],
        resources: ['Consider speaking with a mental health professional'],
        moodTrend: 'Continue monitoring your emotional patterns',
        patterns: ['Regular mood tracking can help identify patterns']
      };
    }
  }
}

export const aiService = new AIService(); 
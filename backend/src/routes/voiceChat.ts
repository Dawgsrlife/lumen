/**
 * Voice Chat Routes and WebSocket Handler - Hackathon Version
 * Simplified implementation for hackathon demo
 */

import { Router, Request, Response } from 'express';
import { WebSocketServer, WebSocket } from 'ws';
import { v4 as uuidv4 } from 'uuid';
import { authenticateToken, requireAuth, hackathonAuth } from '../middleware/auth.js';
import { enhancedVoiceChatService } from '../services/enhancedVoiceChat.js';
import { EmotionEntryModel } from '../models/EmotionEntry.js';


const HACKATHON_MODE = process.env.HACKATHON_MODE === 'true' || !process.env.MONGODB_URI;

const router = Router();

// Store active WebSocket connections
const activeConnections = new Map<string, {
  ws: WebSocket;
  sessionId: string;
  clerkId: string;
}>();

/**
 * POST /api/voice-chat/start
 * Initialize a new voice chat session
 */
router.post('/start',
  HACKATHON_MODE ? hackathonAuth : authenticateToken,
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const clerkId = req.clerkId!;
      const { emotion, intensity } = req.body;

      if (!emotion || typeof intensity !== 'number') {
        return res.status(400).json({
          error: 'Emotion and intensity are required',
          code: 'VALIDATION_ERROR',
          details: { required: ['emotion', 'intensity'] }
        });
      }

      if (!enhancedVoiceChatService.isAvailable()) {
        return res.status(503).json({
          error: 'Voice chat service unavailable',
          code: 'SERVICE_UNAVAILABLE',
          details: {}
        });
      }

      // Generate session ID
      const sessionId = uuidv4();

      // Initialize session with therapeutic context
      const session = await enhancedVoiceChatService.initializeSession(
        sessionId,
        clerkId,
        emotion,
        intensity
      );

      res.json({
        success: true,
        data: {
          sessionId,
          therapeuticContext: session.therapeuticContext,
          wsUrl: `/ws/voice-chat/${sessionId}`,
          instructions: {
            connect: 'Connect to WebSocket endpoint to start voice session',
            audioFormat: 'Send 16-bit PCM audio at 16kHz sample rate',
            duration: 'Sessions typically last 10-15 minutes',
            techniques: session.therapeuticContext.recommendedTechniques
          }
        }
      });

    } catch (error) {
      console.error('Voice chat start error:', error);
      res.status(500).json({
        error: 'Failed to start voice chat session',
        code: 'INTERNAL_ERROR',
        details: {}
      });
    }
  }
);

/**
 * GET /api/voice-chat/session/:sessionId
 * Get session status and information
 */
router.get('/session/:sessionId',
  HACKATHON_MODE ? hackathonAuth : authenticateToken,
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const { sessionId } = req.params;
      const clerkId = req.clerkId!;

      const session = await enhancedVoiceChatService.getSession(sessionId);
      if (!session || session.clerkId !== clerkId) {
        return res.status(404).json({
          error: 'Session not found',
          code: 'NOT_FOUND',
          details: {}
        });
      }

      res.json({
        success: true,
        data: {
          sessionId: session.sessionId,
          emotion: session.emotion,
          intensity: session.intensity,
          isActive: session.status === 'active',
          startTime: session.startTime,
          therapeuticContext: session.therapeuticContext,
          conversationLog: session.conversationLog
        }
      });

    } catch (error) {
      console.error('Voice chat session error:', error);
      res.status(500).json({
        error: 'Failed to get session information',
        code: 'INTERNAL_ERROR',
        details: {}
      });
    }
  }
);

/**
 * POST /api/voice-chat/message
 * Send a text message to the voice chat session
 */
router.post('/message',
  HACKATHON_MODE ? hackathonAuth : authenticateToken,
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const clerkId = req.clerkId!;
      const { sessionId, message } = req.body;

      if (!sessionId || !message) {
        return res.status(400).json({
          error: 'Session ID and message are required',
          code: 'VALIDATION_ERROR',
          details: { required: ['sessionId', 'message'] }
        });
      }

      const session = await enhancedVoiceChatService.getSession(sessionId);
      if (!session || session.clerkId !== clerkId) {
        return res.status(404).json({
          error: 'Session not found',
          code: 'NOT_FOUND',
          details: {}
        });
      }

      // Process message and get response
      const response = await enhancedVoiceChatService.processUserMessage(sessionId, message);

      res.json({
        success: true,
        data: {
          sessionId,
          response,
          timestamp: new Date()
        }
      });

    } catch (error) {
      console.error('Voice chat message error:', error);
      res.status(500).json({
        error: 'Failed to process message',
        code: 'INTERNAL_ERROR',
        details: {}
      });
    }
  }
);

/**
 * POST /api/voice-chat/audio
 * Send audio data to the voice chat session
 */
router.post('/audio',
  HACKATHON_MODE ? hackathonAuth : authenticateToken,
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const clerkId = req.clerkId!;
      const { sessionId, audioData, mimeType } = req.body;

      if (!sessionId || !audioData) {
        return res.status(400).json({
          error: 'Session ID and audio data are required',
          code: 'VALIDATION_ERROR',
          details: { required: ['sessionId', 'audioData'] }
        });
      }

      const session = await enhancedVoiceChatService.getSession(sessionId);
      if (!session || session.clerkId !== clerkId) {
        return res.status(404).json({
          error: 'Session not found',
          code: 'NOT_FOUND',
          details: {}
        });
      }

      // Process audio and get response
      const response = await enhancedVoiceChatService.processAudioInput(sessionId, audioData);

      res.json({
        success: true,
        data: {
          sessionId,
          response,
          timestamp: new Date()
        }
      });

    } catch (error) {
      console.error('Voice chat audio error:', error);
      res.status(500).json({
        error: 'Failed to process audio',
        code: 'INTERNAL_ERROR',
        details: {}
      });
    }
  }
);

/**
 * POST /api/voice-chat/end
 * End a voice chat session
 */
router.post('/end',
  HACKATHON_MODE ? hackathonAuth : authenticateToken,
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const clerkId = req.clerkId!;
      const { sessionId } = req.body;

      if (!sessionId) {
        return res.status(400).json({
          error: 'Session ID is required',
          code: 'VALIDATION_ERROR',
          details: { required: ['sessionId'] }
        });
      }

      const session = await enhancedVoiceChatService.getSession(sessionId);
      if (!session || session.clerkId !== clerkId) {
        return res.status(404).json({
          error: 'Session not found',
          code: 'NOT_FOUND',
          details: {}
        });
      }

      // End session and save to journal
      const journalEntryId = await enhancedVoiceChatService.endSession(sessionId);

      // Close WebSocket connection if active
      const connection = activeConnections.get(sessionId);
      if (connection) {
        connection.ws.close();
        activeConnections.delete(sessionId);
      }

      res.json({
        success: true,
        data: {
          sessionId,
          journalEntryId,
          message: 'Session ended successfully'
        }
      });

    } catch (error) {
      console.error('Voice chat end error:', error);
      res.status(500).json({
        error: 'Failed to end session',
        code: 'INTERNAL_ERROR',
        details: {}
      });
    }
  }
);

/**
 * GET /api/voice-chat/status
 * Get voice chat service status
 */
router.get('/status',
  HACKATHON_MODE ? hackathonAuth : authenticateToken,
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      res.json({
        success: true,
        data: {
          available: enhancedVoiceChatService.isAvailable(),
          activeSessions: await enhancedVoiceChatService.getActiveSessionsCount(),
          supportedFormats: ['audio/pcm;rate=16000', 'text/plain'],
          features: ['real-time chat', 'audio processing', 'therapeutic responses', 'session logging']
        }
      });

    } catch (error) {
      console.error('Voice chat status error:', error);
      res.status(500).json({
        error: 'Failed to get service status',
        code: 'INTERNAL_ERROR',
        details: {}
      });
    }
  }
);

/**
 * WebSocket handler for real-time voice chat
 */
export function setupVoiceChatWebSocket(server: any) {
  const wss = new WebSocketServer({ 
    server,
    path: '/ws/voice-chat'
  });

  wss.on('connection', async (ws: WebSocket, request: any) => {
    console.log('🎙️ Voice chat WebSocket connection established');

    // Extract session ID from URL
    const url = new URL(request.url, 'http://localhost');
    const sessionId = url.pathname.split('/').pop();

    if (!sessionId) {
      ws.close(1008, 'Session ID required');
      return;
    }

    // Get session
    const session = await enhancedVoiceChatService.getSession(sessionId);
    if (!session) {
      ws.close(1008, 'Session not found');
      return;
    }

    // Store connection
    activeConnections.set(sessionId, {
      ws,
      sessionId,
      clerkId: session.clerkId
    });

    // Send welcome message
    ws.send(JSON.stringify({
      type: 'connected',
      sessionId,
      message: 'Voice therapy session connected'
    }));

    ws.on('message', async (data: Buffer) => {
      try {
        const message = JSON.parse(data.toString());

        switch (message.type) {
          case 'text':
            const response = await enhancedVoiceChatService.processUserMessage(sessionId, message.text);
            ws.send(JSON.stringify({
              type: 'response',
              text: response,
              timestamp: new Date()
            }));
            break;

          case 'audio':
            const audioResponse = await enhancedVoiceChatService.processAudioInput(sessionId, message.audioData);
            ws.send(JSON.stringify({
              type: 'response',
              text: audioResponse,
              timestamp: new Date()
            }));
            break;

          default:
            ws.send(JSON.stringify({
              type: 'error',
              message: 'Unknown message type'
            }));
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
        ws.send(JSON.stringify({
          type: 'error',
          message: 'Failed to process message'
        }));
      }
    });

    ws.on('close', () => {
      console.log(`🎙️ Voice chat WebSocket connection closed for session ${sessionId}`);
      activeConnections.delete(sessionId);
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      activeConnections.delete(sessionId);
    });
  });

  console.log('🎙️ Voice chat WebSocket server initialized');
}

export default router;
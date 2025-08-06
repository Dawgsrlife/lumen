/**
 * Voice Chat Routes and WebSocket Handler
 * Handles real-time voice therapy sessions using Gemini Live API
 */

import { Router, Request, Response } from 'express';
import { WebSocketServer } from 'ws';
import { v4 as uuidv4 } from 'uuid';
import { authenticateToken, requireAuth } from '../middleware/auth.js';
import { voiceChatService } from '../services/voiceChat.js';

const router = Router();

// Store active WebSocket connections
const activeConnections = new Map<string, {
  ws: WebSocket;
  sessionId: string;
  clerkId: string;
  liveSession?: unknown;
}>();

/**
 * POST /api/voice-chat/start
 * Initialize a new voice chat session
 */
router.post('/start',
  authenticateToken,
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const clerkId = req.clerkId!;
      const { emotion, intensity } = req.body;

      if (!emotion || typeof intensity !== 'number') {
        return res.status(400).json({
          success: false,
          message: 'Emotion and intensity are required'
        });
      }

      if (!voiceChatService.isAvailable()) {
        return res.status(503).json({
          success: false,
          message: 'Voice chat service unavailable. Please check API configuration.'
        });
      }

      // Generate session ID
      const sessionId = uuidv4();

      // Initialize session with therapeutic context
      const session = await voiceChatService.initializeSession(
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
        success: false,
        message: 'Failed to start voice chat session',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
);

/**
 * GET /api/voice-chat/session/:sessionId
 * Get session status and information
 */
router.get('/session/:sessionId',
  authenticateToken,
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const { sessionId } = req.params;
      const clerkId = req.clerkId!;

      const session = voiceChatService.getSession(sessionId);
      if (!session || session.clerkId !== clerkId) {
        return res.status(404).json({
          success: false,
          message: 'Session not found'
        });
      }

      const connection = activeConnections.get(sessionId);
      const isActive = connection && connection.ws.readyState === WebSocket.OPEN;

      res.json({
        success: true,
        data: {
          sessionId: session.id,
          status: isActive ? 'active' : 'inactive',
          emotion: session.emotion,
          intensity: session.intensity,
          therapeuticContext: session.therapeuticContext,
          conversationLength: session.conversationLog.length,
          duration: session.conversationLog.length > 0 ? 
            Math.round((new Date().getTime() - session.conversationLog[0].timestamp.getTime()) / 60000) : 0
        }
      });

    } catch (error) {
      console.error('Session status error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get session status',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
);

/**
 * POST /api/voice-chat/end/:sessionId
 * End a voice chat session and save conversation
 */
router.post('/end/:sessionId',
  authenticateToken,
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const { sessionId } = req.params;
      const clerkId = req.clerkId!;

      const session = voiceChatService.getSession(sessionId);
      if (!session || session.clerkId !== clerkId) {
        return res.status(404).json({
          success: false,
          message: 'Session not found'
        });
      }

      // Close WebSocket connection if active
      const connection = activeConnections.get(sessionId);
      if (connection) {
        if (connection.liveSession) {
          connection.liveSession.close();
        }
        if (connection.ws.readyState === WebSocket.OPEN) {
          connection.ws.close();
        }
        activeConnections.delete(sessionId);
      }

      // End session and save as journal entry
      const journalEntryId = await voiceChatService.endSession(sessionId);

      res.json({
        success: true,
        data: {
          sessionId,
          journalEntryId,
          message: 'Session ended and conversation saved',
          conversationLength: session.conversationLog.length,
          duration: Math.round((new Date().getTime() - session.conversationLog[0]?.timestamp.getTime()) / 60000)
        }
      });

    } catch (error) {
      console.error('End session error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to end session',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
);

/**
 * WebSocket handler for voice chat
 */
export function setupVoiceChatWebSocket(server: unknown) {
  const wss = new WebSocketServer({ 
    server,
    path: '/ws/voice-chat'
  });

  wss.on('connection', async (ws: WebSocket, req: unknown) => {
    try {
      // Extract session ID from URL path
      const urlParts = req.url.split('/');
      const sessionId = urlParts[urlParts.length - 1];

      if (!sessionId) {
        ws.close(1008, 'Session ID required');
        return;
      }

      const session = voiceChatService.getSession(sessionId);
      if (!session) {
        ws.close(1008, 'Session not found');
        return;
      }

      console.log(`Voice chat WebSocket connected for session ${sessionId}`);

      // Create Gemini Live API session
      const liveSession = await voiceChatService.createLiveSession(sessionId);

      // Store connection
      activeConnections.set(sessionId, {
        ws,
        sessionId,
        clerkId: session.clerkId,
        liveSession
      });

      // Send welcome message
      ws.send(JSON.stringify({
        type: 'connected',
        sessionId,
        therapeuticContext: session.therapeuticContext,
        message: 'Voice therapy session ready. Start speaking when ready.'
      }));

      // Handle incoming messages from client
      ws.on('message', async (data: Buffer) => {
        try {
          const message = JSON.parse(data.toString());

          switch (message.type) {
            case 'audio':
              // Forward audio to Gemini Live API
              if (liveSession && message.audioData) {
                liveSession.sendRealtimeInput({
                  audio: {
                    data: message.audioData,
                    mimeType: message.mimeType || "audio/pcm;rate=16000"
                  }
                });

                // Log user audio input
                await voiceChatService.sendUserAudio(sessionId, message.audioData, message.mimeType);
              }
              break;

            case 'text':
              // Handle text input if needed
              if (liveSession && message.text) {
                liveSession.sendRealtimeInput({
                  text: message.text
                });
              }
              break;

            case 'ping':
              // Respond to keepalive
              ws.send(JSON.stringify({ type: 'pong' }));
              break;

            default:
              console.warn(`Unknown message type: ${message.type}`);
          }

        } catch (error) {
          console.error('WebSocket message error:', error);
          ws.send(JSON.stringify({
            type: 'error',
            message: 'Failed to process message'
          }));
        }
      });

      // Handle Live API responses
      liveSession.callbacks.onmessage = (liveMessage: unknown) => {
        try {
          // Forward response to client
          ws.send(JSON.stringify({
            type: 'response',
            text: liveMessage.text,
            audioData: liveMessage.audio?.data,
            turnComplete: liveMessage.serverContent?.turnComplete
          }));
        } catch (error) {
          console.error('Live API response error:', error);
        }
      };

      // Handle WebSocket close
      ws.on('close', () => {
        console.log(`Voice chat WebSocket disconnected for session ${sessionId}`);
        
        // Clean up
        if (liveSession) {
          liveSession.close();
        }
        activeConnections.delete(sessionId);
      });

      // Handle WebSocket errors
      ws.on('error', (error) => {
        console.error(`Voice chat WebSocket error for session ${sessionId}:`, error);
        
        // Clean up
        if (liveSession) {
          liveSession.close();
        }
        activeConnections.delete(sessionId);
      });

    } catch (error) {
      console.error('WebSocket connection error:', error);
      ws.close(1011, 'Internal server error');
    }
  });

  console.log('Voice chat WebSocket server initialized');
}

/**
 * GET /api/voice-chat/status
 * Check if voice chat service is available
 */
router.get('/status', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      available: voiceChatService.isAvailable(),
      activeSessions: activeConnections.size,
      supportedFormats: ['audio/pcm;rate=16000', 'audio/wav'],
      features: [
        'Real-time voice therapy',
        'Evidence-based CBT/DBT techniques',
        'Contextual therapeutic responses',
        'Automatic conversation logging'
      ]
    }
  });
});

export default router;
// Unity Game Integration Service
// This service handles communication between React app and Unity games

export interface UnityGameData {
  gameId: string;
  score: number;
  duration: number;
  achievements: string[];
  emotionData?: {
    emotion: string;
    intensity: number;
    timestamp: string;
  };
}

export interface UnityReward {
  type: 'points' | 'achievement' | 'badge' | 'unlock';
  value: string | number;
  description: string;
  gameId: string;
}

export interface UnityMessage {
  type: 'gameStart' | 'gameEnd' | 'achievement' | 'emotionUpdate' | 'reward';
  data: UnityGameData | UnityReward;
}

class UnityService {
  private static instance: UnityService;
  private unityInstance: unknown = null;
  private messageHandlers: Map<string, (data: unknown) => void> = new Map();

  private constructor() {}

  public static getInstance(): UnityService {
    if (!UnityService.instance) {
      UnityService.instance = new UnityService();
    }
    return UnityService.instance;
  }

  // Initialize Unity instance
  public initializeUnity(unityInstance: unknown): void {
    this.unityInstance = unityInstance;
    console.log('Unity instance initialized');
  }

  // Send message to Unity
  public sendMessageToUnity(gameObject: string, method: string, data?: unknown): void {
    if (this.unityInstance) {
      // Unity instance has SendMessage method
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this.unityInstance as any).SendMessage(gameObject, method, data);
    } else {
      console.warn('Unity instance not initialized');
    }
  }

  // Register message handler from Unity
  public onMessageFromUnity(type: string, handler: (data: unknown) => void): void {
    this.messageHandlers.set(type, handler);
  }

  // Handle incoming message from Unity
  public handleUnityMessage(message: UnityMessage): void {
    const handler = this.messageHandlers.get(message.type);
    if (handler) {
      handler(message.data);
    } else {
      console.log('No handler for message type:', message.type);
    }
  }

  // Send user emotion data to Unity
  public sendEmotionToUnity(emotion: string, intensity: number): void {
    this.sendMessageToUnity('GameManager', 'ReceiveEmotionData', {
      emotion,
      intensity,
      timestamp: new Date().toISOString(),
    });
  }

  // Send user progress data to Unity
  public sendProgressToUnity(progress: unknown): void {
    this.sendMessageToUnity('GameManager', 'ReceiveProgressData', progress);
  }

  // Request game state from Unity
  public requestGameState(): void {
    this.sendMessageToUnity('GameManager', 'RequestGameState');
  }

  // Start a specific game
  public startGame(gameId: string, userData?: unknown): void {
    this.sendMessageToUnity('GameManager', 'StartGame', {
      gameId,
      userData,
    });
  }

  // End current game
  public endGame(): void {
    this.sendMessageToUnity('GameManager', 'EndGame');
  }

  // Get Unity instance
  public getUnityInstance(): unknown {
    return this.unityInstance;
  }

  // Check if Unity is ready
  public isUnityReady(): boolean {
    return this.unityInstance !== null;
  }

  // Global message handler for Unity WebGL
  public setupGlobalMessageHandler(): void {
    // This will be called by Unity WebGL
    (window as unknown as Record<string, unknown>).receiveMessageFromUnity = (message: UnityMessage) => {
      this.handleUnityMessage(message);
    };
  }

  // Cleanup
  public cleanup(): void {
    this.unityInstance = null;
    this.messageHandlers.clear();
  }
}

export const unityService = UnityService.getInstance();

// Global message handler for Unity WebGL
if (typeof window !== 'undefined') {
  (window as unknown as Record<string, unknown>).receiveMessageFromUnity = (message: UnityMessage) => {
    unityService.handleUnityMessage(message);
  };
} 
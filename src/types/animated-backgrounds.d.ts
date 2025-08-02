declare module 'animated-backgrounds' {
  export interface InteractionConfig {
    effect?: string;
    strength?: number;
    radius?: number;
    continuous?: boolean;
    multiTouch?: boolean;
  }

  export interface AnimatedBackgroundProps {
    animationName: string;
    interactive?: boolean;
    interactionConfig?: InteractionConfig;
    style?: React.CSSProperties;
  }

  export const AnimatedBackground: React.FC<AnimatedBackgroundProps>;
} 
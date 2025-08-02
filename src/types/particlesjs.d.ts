declare module 'particlesjs' {
  interface ParticlesOptions {
    selector: string | HTMLCanvasElement;
    maxParticles?: number;
    sizeVariations?: number;
    speed?: number;
    color?: string | string[];
    minDistance?: number;
    connectParticles?: boolean;
    responsive?: Array<{
      breakpoint: number;
      options: Partial<ParticlesOptions>;
    }>;
  }

  interface ParticlesJS {
    init(options: ParticlesOptions): void;
  }

  const Particles: ParticlesJS;
  
  export default Particles;
}
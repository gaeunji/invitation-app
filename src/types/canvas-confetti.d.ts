declare module "canvas-confetti" {
  type ConfettiOptions = {
    particleCount?: number;
    spread?: number;
    origin?: {
      x?: number;
      y?: number;
    };
    colors?: string[];
    shapes?: string[];
    gravity?: number;
  };

  export default function confetti(options?: ConfettiOptions): Promise<null>;
}

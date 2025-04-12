import { type LEDSignBaseProps, type PixelGrid } from "~/types";

export interface LEDImageSignProps extends LEDSignBaseProps {
  /** Sign width. Default is 500. Min value is 60. */
  width?: number;
  /** Images to use in sign animation. Will all use the dimensions of the first image. */
  images: PixelGrid[];
  animationOptions?: {
    delay?: number;
    direction?: PlaybackDirection;
    endDelay?: number;
    fill?: FillMode;
    iterations?: number;
  };
}

export interface ImageSignConfig extends Required<LEDImageSignProps> {
  id: string;
  frameProportion: number;
}

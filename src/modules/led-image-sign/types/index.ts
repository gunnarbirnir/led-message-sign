import { type LEDSignBaseProps, type PixelGrid } from "../../../types";

export interface LEDImageSignProps extends LEDSignBaseProps {
  /** Sign width. Default is 500. Min value is 60. */
  width?: number;
  /** Sign minimum height. */
  minHeight?: number;
  /** Images to use in sign animation. Will all use the dimensions of the first image. */
  images: PixelGrid[];
  /** How much of the available width the frame should take up. Default is 0.04. */
  frameToWidthRatio?: number;
  animationOptions?: {
    delay?: number;
    direction?: PlaybackDirection;
    fill?: FillMode;
    iterations?: number;
  };
}

export interface ImageSignConfig extends Required<LEDImageSignProps> {
  id: string;
  frameProportion: number;
}

export type ImageSignRef = {
  redrawImage: ({ newImage }: { newImage: (number | null)[][] }) => void;
};

import { LEDSignBaseProps, HSLColorValues } from "~/types";

export type ImagePixelGrid = (HSLColorValues | null)[][];

export type SignImage = {
  pixelGrid: ImagePixelGrid;
  /** How many frames should the image span. Default is 1. */
  duration?: number;
};

export interface LEDImageSignProps extends LEDSignBaseProps {
  /** Sign width. Default is 300. Min value is 60. */
  width?: number;
  /** Images to use in sign animation. Will all use the dimensions of the first image. */
  images: SignImage[];
}

export interface ImageSignConfig extends Required<LEDImageSignProps> {
  id: string;
  frameProportion: number;
}

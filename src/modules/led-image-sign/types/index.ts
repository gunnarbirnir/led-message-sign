import { LEDSignBaseProps, PixelGrid } from "~/types";

export interface LEDImageSignProps extends LEDSignBaseProps {
  /** Sign width. Default is 300. Min value is 60. */
  width?: number;
  /** Images to use in sign animation. Will all use the dimensions of the first image. */
  images: PixelGrid[];
}

export interface ImageSignConfig extends Required<LEDImageSignProps> {
  id: string;
  frameProportion: number;
}

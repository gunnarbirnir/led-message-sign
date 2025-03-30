import { CSSProperties } from "react";

export interface BaseProps {
  style?: CSSProperties;
  className?: string;
}

export interface LEDSignBaseProps {
  /** Make sign fill available space. If true width prop will be ignored. Default is false. */
  fullWidth?: boolean;
  /** Lightness value for HSL color of on bulbs. Default is 95. Value is between 70 and 100. */
  onBulbLightness?: number;
  /** Lightness value for HSL color of off bulbs. Default is 10. Value is between 0 and 30. */
  offBulbLightness?: number;
  /** Lightness value for HSL color of frame. Default is 15. Value is between 10 and 40. */
  frameLightness?: number;
  /** Lightness value for HSL color of background. Default is 0. Value is between 0 and 30. */
  backgroundLightness?: number;
  /** Hide sign frame. Default is false. */
  hideFrame?: boolean;
  /** How many animation frames pass between sign updates. Default is 6. Value is between 1 and 60. */
  animationFramesPerUpdate?: number;
}

export interface SignConfig extends Required<LEDSignBaseProps> {
  id: string; //
  frameProportion: number;
  colorHue: number;
  coloredOffLights: boolean;
  staticMode: boolean; //
}

export type PixelGrid = number[][];

export interface SignComputedValues {
  signHeight: number;
  signWidth: number;
  frameSize: number;
  displayHeight: number;
  displayWidth: number;
  pixelAreaHeight: number;
  pixelAreaWidth: number;
  displayPaddingX: number;
  displayPaddingY: number;
  pixelSize: number;
  pixelCountX: number;
  pixelCountY: number;
  pixelGrid: PixelGrid;
  pixelGridWidth: number;
}

export type Tuple = [number, number];

export interface HSLColorValues {
  hue: number;
  saturation: number;
  lightness: number;
  opacity?: number;
}

export type SignColorKey =
  | "frame"
  | "background"
  | "light"
  | "bulbOn"
  | "bulbOff"
  | "glow";

export type SignColors = Record<
  SignColorKey,
  HSLColorValues & { color: string }
>;

export type FillStyle = string | CanvasGradient | CanvasPattern;

export interface CanvasChunk {
  id: string;
  start: number;
  end: number;
}

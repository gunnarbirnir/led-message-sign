import { CSSProperties } from "react";

export interface BaseProps {
  style?: CSSProperties;
  className?: string;
}

export interface LEDMessageSignProps {
  /** Message text. Max 100 characters. */
  text: string | string[];
  /** Sign height. Default is 150. Min value is 60. */
  height?: number;
  /** Sign width. Default is 800. Min value is 100. */
  width?: number;
  /** Make sign fill available space. If true width prop will be ignored. Default is false. */
  fullWidth?: boolean;
  /** Hue value for HSL color. Default is 0. Value is between 0 and 360. */
  colorHue?: number;
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
  /** Should the off lights be colored. Default is true. */
  coloredOffLights?: boolean;
  /** How many animation frames pass between sign updates. Default is 6. Value is between 1 and 60. */
  animationFramesPerUpdate?: number;
}

export interface SignConfig extends Required<LEDMessageSignProps> {
  id: string;
  text: string;
  frameProportion: number;
}

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

export type PixelGrid = number[][];

export type Letter = number[][];

export type Alphabet = { [letter: string]: Letter };

export type FillStyle = string | CanvasGradient | CanvasPattern;

export interface CanvasChunk {
  id: string;
  start: number;
  end: number;
}

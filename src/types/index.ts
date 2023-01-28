export interface LEDMessageSignProps {
  /** Message text. Max 1000 characters. */
  text: string;
  /** Sign height. Default is 150. */
  height?: number;
  /** Sign width. Default is 800. */
  width?: number;
  /** Make sign fill available space. If true width prop will be ignored. Default is false.  */
  fullWidth?: boolean;
  /** Hue value for HSL color. Default is 0. */
  colorHue?: number;
  /** Hide sign frame. Default is false.  */
  hideFrame?: boolean;
  /** Should the off lights be colored. Default is true.  */
  coloredOffLights?: boolean;
  /** How many animation frames pass between sign updates. Default is 3. */
  animationFramesPerUpdate?: number;
}

export interface SignConfig extends Required<LEDMessageSignProps> {
  id: string;
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
  imageWidth: number;
}

export type Tuple = [number, number];

export interface HSLColorValues {
  hue: number;
  saturation: number;
  lightness: number;
  opacity?: number;
}

export type PixelGrid = number[][];

export type Letter = number[][];

export type Alphabet = { [letter: string]: Letter };

export type FillStyle = string | CanvasGradient | CanvasPattern;

export interface LEDMessageSignProps {
  /** Message text. Max 1000 characters. */
  text: string;
  /** Sign height. Default is 200. */
  height?: number;
  /** Sign width. Default is 800. */
  width?: number;
  /** Make sign fill available space. If true width prop will be ignored. Default is false.  */
  fullWidth?: boolean;
  /** Hue value for HSL color. Default is 0. */
  hueDegrees?: number;
  /** Proportion of the frame compared to the height. Maximum value is 0.5. Default is 0.2. */
  frameProportion?: number;
  /** How many animation frames pass between sign updates. Default is 3. */
  animationFramesPerUpdate?: number;
  /** Delay between animations in ms. Default is 0. */
  animationDelay?: number; // TODO: Implement. Maybe just pause every other cycle?
  /** Cycle between all available color values. If true hueDegrees prop will be ignored. Default is false.  */
  partyMode?: boolean; // TODO: Remove if doesn't work with glow animation. Find better name?
}

export interface SignConfig extends Required<LEDMessageSignProps> {
  id: string;
}

export interface SignComputedValues {
  signHeight: number;
  signWidth: number;
  frameSize: number;
  displayHeight: number;
  displayWidth: number;
  displayPaddingX: number;
  displayPaddingY: number;
  pixelSize: number;
  pixelCountX: number;
  pixelCountY: number;
  pixelGrid: number[][];
}

export type Tuple = [number, number];

export interface HSLColorValues {
  hue: number;
  saturation: number;
  lightness: number;
}

export type Letter = number[][];

export type Alphabet = { [letter: string]: Letter };

export interface LEDMessageSignProps {
  /** Message text. */
  text: string;
  /** Sign height. Default is 300. */
  height?: number;
  /** Sign width. Default is 800. */
  width?: number;
  /** Make sign fill available space. If true width prop will be ignored. Default is false.  */
  fullWidth?: boolean;
  /** Hue value for HSL color. Default is 0. */
  hueDegrees?: number;
  /** Proportion of the frame compared to the height. Maximum value is 0.5. Default is 0.2. */
  frameProportion?: number;
  /** How many animation frames pass between sign updates. Default is 1. */
  animationFramesPerUpdate?: number;
  /** Delay between animations in ms. Default is 0. */
  animationDelay?: number;
}

export type LEDMessageSignContextProps = Required<LEDMessageSignProps>;

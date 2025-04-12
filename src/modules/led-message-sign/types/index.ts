import { type LEDSignBaseProps } from "~/types";

export interface LEDMessageSignProps extends LEDSignBaseProps {
  /** Sign height. Default is 150. Min value is 60. */
  height?: number;
  /** Sign width. Default is 800. Min value is 100. */
  width?: number;
  /** Message text. Max 100 characters. */
  text: string | string[];
  /** Hue value for HSL color. Default is 0. Value is between 0 and 360. */
  colorHue?: number;
  /** Should the off lights be colored. Default is true. */
  coloredOffLights?: boolean;
  /** In static mode the text stays still. If the text overflows it will eventually move to reveal the rest. Default is false.
      Static mode does not work with a text array, so the first value will be used. */
  staticMode?: boolean;
  /** Delay in milliseconds before moving to reveal overflowing text. Default is 2000. Value is between 100ms and 60s. */
  staticModeDelay?: number;
}

export interface MessageSignConfig extends Required<LEDMessageSignProps> {
  id: string;
  text: string;
  frameProportion: number;
}

export type Letter = number[][];

export type Alphabet = { [letter: string]: Letter };

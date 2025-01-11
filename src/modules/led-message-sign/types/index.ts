import { LEDSignBaseProps } from "~/types";

export interface LEDMessageSignProps extends LEDSignBaseProps {
  /** Message text. Max 100 characters. */
  text: string | string[];
  staticMode?: boolean;
  /** Delay in milliseconds before moving to reveal overflowing text. Default is 2000. Value is between 100ms and 60s. */
  staticModeDelay?: number;
}

export interface SignConfig extends Required<LEDMessageSignProps> {
  id: string;
  text: string;
  frameProportion: number;
}

export type Letter = number[][];

export type Alphabet = { [letter: string]: Letter };

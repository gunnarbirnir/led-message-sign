import { createContext } from "react";

import { SignColors, SignComputedValues } from "~/types";

const SignContext = createContext<{
  id: string;
  shiftByPixels?: number;
  computedValues: SignComputedValues;
  colors: SignColors;
}>({
  id: "",
  computedValues: {
    signHeight: 0,
    signWidth: 0,
    frameSize: 0,
    displayHeight: 0,
    displayWidth: 0,
    pixelAreaHeight: 0,
    pixelAreaWidth: 0,
    displayPaddingX: 0,
    displayPaddingY: 0,
    pixelSize: 0,
    pixelCountX: 0,
    pixelCountY: 0,
    pixelGrid: [],
    pixelGridWidth: 0,
  },
  colors: {
    frame: {
      hue: 0,
      saturation: 0,
      lightness: 0,
      color: "",
    },
    background: {
      hue: 0,
      saturation: 0,
      lightness: 0,
      color: "",
    },
    light: {
      hue: 0,
      saturation: 0,
      lightness: 0,
      color: "",
    },
    bulbOn: {
      hue: 0,
      saturation: 0,
      lightness: 0,
      color: "",
    },
    bulbOff: {
      hue: 0,
      saturation: 0,
      lightness: 0,
      color: "",
    },
    glow: {
      hue: 0,
      saturation: 0,
      lightness: 0,
      color: "",
    },
  },
});

export default SignContext;

import { createContext } from "react";

import { SignColors, SignComputedValues } from "~/types";

import { SignConfig } from "../types";

const SignContext = createContext<{
  config: SignConfig;
  computedValues: SignComputedValues;
  colors: SignColors;
}>({
  config: {
    id: "",
    text: "",
    height: 0,
    width: 0,
    fullWidth: false,
    colorHue: 0,
    onBulbLightness: 0,
    offBulbLightness: 0,
    frameLightness: 0,
    backgroundLightness: 0,
    hideFrame: false,
    frameProportion: 0,
    coloredOffLights: false,
    animationFramesPerUpdate: 0,
    staticMode: false,
    staticModeDelay: 0,
  },
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

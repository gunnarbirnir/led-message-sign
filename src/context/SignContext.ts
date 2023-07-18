import { createContext } from "react";

import { SignConfig, SignComputedValues } from "../types";

const SignContext = createContext<{
  config: SignConfig;
  computedValues: SignComputedValues;
}>({
  config: {
    id: "",
    text: "",
    height: 0,
    width: 0,
    fullWidth: false,
    colorHue: 0,
    hideFrame: false,
    frameProportion: 0,
    coloredOffLights: false,
    animationFramesPerUpdate: 0,
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
});

export default SignContext;

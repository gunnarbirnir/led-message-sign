import { createContext } from "react";

import { SignConfig, SignComputedValues } from "../types";

const COMPUTED_VALUES_INIT = {
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
  imageWidth: 0,
};

const SignContext = createContext<{
  config: SignConfig;
  computedValues: SignComputedValues;
  computedValuesScaled: SignComputedValues;
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
  computedValues: COMPUTED_VALUES_INIT,
  computedValuesScaled: COMPUTED_VALUES_INIT,
});

export default SignContext;

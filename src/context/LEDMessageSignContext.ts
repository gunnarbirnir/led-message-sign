import { createContext } from "react";

import { LEDMessageSignContextProps } from "../types";

const LEDMessageSignContext = createContext<LEDMessageSignContextProps>({
  text: "",
  height: 0,
  width: 0,
  fullWidth: false,
  hueDegrees: 0,
  frameProportion: 0,
  animationFramesPerUpdate: 0,
  animationDelay: 0,
});

export default LEDMessageSignContext;

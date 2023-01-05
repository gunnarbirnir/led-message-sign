import { createContext } from "react";

import { SignConfig } from "../types";

const SignConfigContext = createContext<SignConfig>({
  id: "",
  text: "",
  height: 0,
  width: 0,
  fullWidth: false,
  colorHue: 0,
  multiColor: false,
  hideFrame: false,
  frameProportion: 0,
  animationFramesPerUpdate: 0,
});

export default SignConfigContext;

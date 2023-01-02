import { createContext } from "react";

import { SignConfig } from "../types";

const SignConfigContext = createContext<SignConfig>({
  id: "",
  text: "",
  height: 0,
  width: 0,
  fullWidth: false,
  hueDegrees: 0,
  frameProportion: 0,
  animationFramesPerUpdate: 0,
  animationDelay: 0,
  partyMode: false,
});

export default SignConfigContext;

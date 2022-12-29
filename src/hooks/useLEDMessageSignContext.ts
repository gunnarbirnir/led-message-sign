import { useContext } from "react";

import { LEDMessageSignContext } from "../context";

const useLEDMessageSignContext = () => {
  const contextValue = useContext(LEDMessageSignContext);

  return contextValue;
};

export default useLEDMessageSignContext;

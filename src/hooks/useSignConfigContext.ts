import { useContext } from "react";

import { SignConfigContext } from "../context";

const useSignConfigContext = () => {
  const contextValue = useContext(SignConfigContext);

  return contextValue;
};

export default useSignConfigContext;

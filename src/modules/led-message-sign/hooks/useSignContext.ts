import { useContext } from "react";

import { SignContext } from "../context";

const useSignContext = () => {
  const contextValue = useContext(SignContext);

  return contextValue;
};

export default useSignContext;

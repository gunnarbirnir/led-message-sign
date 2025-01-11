import { useContext } from "react";

import SignContext from "../context/SignContext";

const useSignContext = () => {
  const contextValue = useContext(SignContext);

  return contextValue;
};

export default useSignContext;

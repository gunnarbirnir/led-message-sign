import { useState, useEffect } from "react";

const useObjectSize = (myRef: React.RefObject<any>) => {
  const [objectSize, setObjectSize] = useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });

  useEffect(() => {
    function handleResize() {
      setObjectSize({
        width: myRef.current ? myRef.current.offsetWidth : 0,
        height: myRef.current ? myRef.current.offsetHeight : 0,
      });
    }

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, [myRef]);

  return objectSize;
};

export default useObjectSize;

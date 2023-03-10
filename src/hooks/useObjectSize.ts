import { useState, useEffect } from "react";

const useObjectSize = (
  myRef: React.RefObject<any>,
  dependencies: any[] = []
) => {
  const [objectSize, setObjectSize] = useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => {
      setObjectSize({
        width: myRef.current ? myRef.current.offsetWidth : 0,
        height: myRef.current ? myRef.current.offsetHeight : 0,
      });
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myRef, ...dependencies]);

  return objectSize;
};

export default useObjectSize;

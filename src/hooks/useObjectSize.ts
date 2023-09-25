import { useState, useEffect } from "react";

const useObjectSize = (ref: React.RefObject<any>, dependencies: any[] = []) => {
  const [objectSize, setObjectSize] = useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => {
      setObjectSize({
        width: ref.current ? ref.current.offsetWidth : 0,
        height: ref.current ? ref.current.offsetHeight : 0,
      });
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, ...dependencies]);

  return objectSize;
};

export default useObjectSize;

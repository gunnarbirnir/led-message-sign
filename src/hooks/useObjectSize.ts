import { useCallback, useEffect, useState } from "react";

const useObjectSize = (
  ref: React.RefObject<HTMLElement>,
  dependencies: unknown[] = []
) => {
  const [objectSize, setObjectSize] = useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });

  const handleResize = useCallback(() => {
    setObjectSize({
      width: ref.current ? ref.current.offsetWidth : 0,
      height: ref.current ? ref.current.offsetHeight : 0,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    handleResize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleResize, ...dependencies]);

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  return objectSize;
};

export default useObjectSize;

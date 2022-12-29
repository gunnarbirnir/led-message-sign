import { FC, memo, useRef, useMemo } from "react";

import { LEDMessageSignProps } from "../types";
import { sanitizeProps } from "../utils";
import { useObjectSize } from "../hooks";
import { LEDMessageSignContext } from "../context";
import SignFrame from "./SignFrame";
import SignDisplay from "./SignDisplay";

const LEDMessageSign: FC<LEDMessageSignProps> = (props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width: containerWidth } = useObjectSize(containerRef);

  const sanitizedProps = useMemo(() => sanitizeProps(props), [props]);
  const { fullWidth } = sanitizedProps;

  const contextValue = useMemo(
    () => ({
      ...sanitizedProps,
      width: sanitizedProps.fullWidth ? containerWidth : sanitizedProps.width,
    }),
    [sanitizedProps, containerWidth]
  );

  return (
    <LEDMessageSignContext.Provider value={contextValue}>
      <div ref={containerRef} style={fullWidth ? { width: "100%" } : undefined}>
        <SignFrame>
          <SignDisplay />
        </SignFrame>
      </div>
    </LEDMessageSignContext.Provider>
  );
};

export default memo(LEDMessageSign);

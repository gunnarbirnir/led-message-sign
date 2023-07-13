import React, { FC, memo, useRef, useMemo, useId } from "react";

import { LEDMessageSignProps } from "../types";
import { sanitizeProps } from "../utils/props";
import { calcComputedValues } from "../utils";
import { useObjectSize } from "../hooks";
import { SignContext } from "../context";
import { FRAME_PROPORTION } from "../constants";
import SignFrame from "./SignFrame";
import SignDisplay from "./SignDisplay";

const LEDMessageSign: FC<LEDMessageSignProps> = (props) => {
  const signId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const { width: containerWidth } = useObjectSize(containerRef, [
    props.fullWidth,
  ]);
  const sanitizedProps = useMemo(() => sanitizeProps(props), [props]);
  const { fullWidth } = sanitizedProps;

  const config = useMemo(
    () => ({
      ...sanitizedProps,
      id: signId,
      width: sanitizedProps.fullWidth ? containerWidth : sanitizedProps.width,
      frameProportion: sanitizedProps.hideFrame ? 0 : FRAME_PROPORTION,
    }),
    [signId, sanitizedProps, containerWidth]
  );
  const computedValues = useMemo(() => calcComputedValues(config, 1), [config]);

  return (
    <SignContext.Provider value={{ config, computedValues }}>
      <div ref={containerRef} style={fullWidth ? { width: "100%" } : undefined}>
        <SignFrame>
          <SignDisplay />
        </SignFrame>
      </div>
    </SignContext.Provider>
  );
};

export default memo(LEDMessageSign);

import React, { FC, memo, useRef, useId, Fragment } from "react";

import { BaseProps, LEDMessageSignProps } from "../types";
import { sanitizeProps } from "../utils/props";
import { calcComputedValues } from "../utils";
import { useObjectSize, useSignAnimation } from "../hooks";
import { SignContext } from "../context";
import { FRAME_TO_HEIGHT_RATIO } from "../constants";
import SignFrame from "./SignFrame";
import SignDisplay from "./SignDisplay";

const LEDMessageSign: FC<BaseProps & LEDMessageSignProps> = ({
  style = {},
  className,
  ...props
}) => {
  const signId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const { width: containerWidth } = useObjectSize(containerRef, [
    props.fullWidth,
  ]);

  const sanitizedProps = sanitizeProps(props);
  const { hideFrame, fullWidth, width } = sanitizedProps;
  const Frame = hideFrame ? Fragment : SignFrame;
  const containerStyle = {
    ...style,
    ...(fullWidth ? { width: "100%" } : {}),
  };

  const config = {
    ...sanitizedProps,
    id: signId,
    width: fullWidth ? containerWidth : width,
    frameProportion: hideFrame ? 0 : FRAME_TO_HEIGHT_RATIO,
  };
  const computedValues = calcComputedValues(config);
  useSignAnimation(config, computedValues);

  return (
    <SignContext.Provider value={{ config, computedValues }}>
      <div ref={containerRef} className={className} style={containerStyle}>
        {computedValues.signWidth !== 0 && (
          <Frame>
            <SignDisplay />
          </Frame>
        )}
      </div>
    </SignContext.Provider>
  );
};

export default memo(LEDMessageSign);

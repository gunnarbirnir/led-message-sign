import React, { type FC, Fragment, memo, useId, useRef } from "react";

import { SignDisplay, SignFrame } from "~/components";
import { SignContext } from "~/context";
import { useObjectSize } from "~/hooks";
import { calcColors } from "~/utils";

import { type BaseProps } from "../../types";
import { useSignAnimation } from "./hooks";
import { type LEDImageSignProps } from "./types";
import { calcComputedValues } from "./utils";
import { sanitizeProps } from "./utils/props";

const LEDImageSign: FC<LEDImageSignProps & BaseProps> = ({
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
  const { hideFrame, fullWidth, width, frameToWidthRatio } = sanitizedProps;
  const Frame = hideFrame ? Fragment : SignFrame;
  const containerStyle = {
    overflow: "hidden",
    ...style,
    ...(fullWidth ? { width: "100%" } : {}),
  };

  const config = {
    ...sanitizedProps,
    id: signId,
    width: fullWidth ? containerWidth : width,
    frameProportion: hideFrame ? 0 : frameToWidthRatio,
  };
  const computedValues = calcComputedValues(config);
  const colors = calcColors(config);

  useSignAnimation(config, computedValues);

  return (
    <SignContext.Provider value={{ id: signId, computedValues, colors }}>
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

export default memo(LEDImageSign);

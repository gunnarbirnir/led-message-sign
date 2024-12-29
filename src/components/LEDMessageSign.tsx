import React, {
  FC,
  memo,
  useRef,
  useId,
  Fragment,
  useState,
  useMemo,
} from "react";

import { BaseProps, LEDMessageSignProps } from "../types";
import { sanitizeProps } from "../utils/props";
import { calcComputedValues, calcColors } from "../utils";
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
  const [textIndex, setTextIndex] = useState(0);

  const currentText = Array.isArray(props.text)
    ? props.text[textIndex]
    : props.text;
  const sanitizedProps = sanitizeProps({ ...props, text: currentText });
  const { hideFrame, fullWidth, width } = sanitizedProps;
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
    frameProportion: hideFrame ? 0 : FRAME_TO_HEIGHT_RATIO,
  };
  const computedValues = calcComputedValues(config);
  const colors = calcColors(config);

  const textIsArray = Array.isArray(props.text);
  const updateTextIndex = useMemo(
    () =>
      textIsArray
        ? () =>
            setTextIndex((prevIndex) => {
              const newIndex = prevIndex + 1;
              return newIndex >= props.text.length ? 0 : newIndex;
            })
        : undefined,
    [textIsArray, props.text.length]
  );

  useSignAnimation(config, computedValues, {
    onAnimationFinished: updateTextIndex,
    updateAnimationId: `${textIndex}-${currentText}`,
  });

  return (
    <SignContext.Provider value={{ config, computedValues, colors }}>
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

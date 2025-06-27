import React, {
  type FC,
  Fragment,
  memo,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

import { SignDisplay, SignFrame } from "~/components";
import { SignContext } from "~/context";
import { useObjectSize } from "~/hooks";
import { calcColors } from "~/utils";

import { type BaseProps } from "../../types";
import { FRAME_TO_HEIGHT_RATIO } from "./constants";
import { useSignAnimation } from "./hooks";
import { type LEDMessageSignProps } from "./types";
import { calcComputedValues } from "./utils";
import { sanitizeProps } from "./utils/props";

const LEDMessageSign: FC<LEDMessageSignProps & BaseProps> = ({
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

  const multipleMessages = Array.isArray(props.text) && props.text.length > 1;
  const updateTextIndex = useMemo(
    () =>
      multipleMessages
        ? () =>
            setTextIndex((prevIndex) => {
              const newIndex = prevIndex + 1;
              return newIndex >= props.text.length ? 0 : newIndex;
            })
        : undefined,
    [multipleMessages, props.text.length]
  );
  const shiftByPixels = config.staticMode
    ? computedValues.pixelCountX
    : undefined;

  useSignAnimation(config, computedValues, {
    onAnimationFinished: updateTextIndex,
    updateAnimationId: `${textIndex}-${currentText}`,
  });

  return (
    <SignContext.Provider
      value={{ id: signId, shiftByPixels, computedValues, colors }}
    >
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

import React, { FC, memo, useRef, useMemo, useId } from "react";
import styled from "styled-components";

import { LEDMessageSignProps } from "../types";
import { sanitizeProps } from "../utils/props";
import { useObjectSize, useRenderCanvas } from "../hooks";
import { SignConfigContext } from "../context";
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
  useRenderCanvas(config);

  return (
    <SignConfigContext.Provider value={config}>
      <StyledLEDMessageSign
        ref={containerRef}
        style={fullWidth ? { width: "100%" } : undefined}
      >
        <SignFrame>
          <SignDisplay />
        </SignFrame>
      </StyledLEDMessageSign>
    </SignConfigContext.Provider>
  );
};

const StyledLEDMessageSign = styled.div`
  & > * {
    box-sizing: border-box;
  }
`;

export default memo(LEDMessageSign);

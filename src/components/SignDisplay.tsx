import React, { FC, useMemo } from "react";
import styled from "styled-components";

import { useSignConfigContext } from "../hooks";
import { COLORS } from "../constants/colors";
import {
  calcDisplayIds,
  calcFrameSize,
  calcDisplayHeight,
  calcDisplayWidth,
} from "../utils";
import Canvas from "./Canvas";

const SignDisplay: FC = () => {
  const { id, height, width, frameProportion } = useSignConfigContext();
  const { displayOnLightsId, displayOffLightsId } = useMemo(
    () => calcDisplayIds(id),
    [id]
  );
  const frameSize = useMemo(
    () => calcFrameSize(height, frameProportion),
    [height, frameProportion]
  );
  const displayHeight = useMemo(
    () => calcDisplayHeight(height, frameSize),
    [height, frameSize]
  );
  const displayWidth = useMemo(
    () => calcDisplayWidth(width, frameSize),
    [width, frameSize]
  );

  return (
    <StyledSignDisplay>
      <DisplayCanvas
        id={displayOffLightsId}
        height={displayHeight}
        width={displayWidth}
      />
      <DisplayCanvas
        id={displayOnLightsId}
        height={displayHeight}
        width={displayWidth}
      />
    </StyledSignDisplay>
  );
};

const StyledSignDisplay = styled.div`
  height: 100%;
  width: 100%;
  position: relative;
  background-color: ${COLORS.BACKGROUND};
`;

const DisplayCanvas = styled(Canvas)`
  position: absolute;
  top: 0;
  left: 0;
`;

export default SignDisplay;

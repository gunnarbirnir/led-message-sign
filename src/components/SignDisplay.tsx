import { FC, useMemo } from "react";
import styled from "styled-components";

import { useSignConfigContext } from "../hooks";
import { COLORS } from "../constants/colors";
import {
  calcDisplayId,
  calcFrameSize,
  calcDisplayHeight,
  calcDisplayWidth,
} from "../utils";
import Canvas from "./Canvas";

const SignDisplay: FC = () => {
  const { id, height, width, frameProportion } = useSignConfigContext();
  const displayId = useMemo(() => calcDisplayId(id), [id]);
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
      <Canvas id={displayId} height={displayHeight} width={displayWidth} />
    </StyledSignDisplay>
  );
};

const StyledSignDisplay = styled.div`
  height: 100%;
  width: 100%;
  position: relative;
  background-color: ${COLORS.BACKGROUND};
`;

export default SignDisplay;

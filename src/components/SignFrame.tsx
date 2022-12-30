import { FC, PropsWithChildren, useMemo } from "react";
import styled from "styled-components";

import { useSignConfigContext } from "../hooks";
import { COLORS } from "../constants/colors";
import { calcFrameId, calcFrameSize } from "../utils";

const SignFrame: FC<PropsWithChildren> = ({ children }) => {
  const { id, height, width, frameProportion } = useSignConfigContext();
  const frameId = useMemo(() => calcFrameId(id), [id]);
  const frameSize = useMemo(
    () => calcFrameSize(height, frameProportion),
    [height, frameProportion]
  );

  return (
    <StyledSignFrame style={{ height, width, padding: frameSize }}>
      <FrameCanvas id={frameId} />
      {children}
    </StyledSignFrame>
  );
};

const StyledSignFrame = styled.div`
  background-color: ${COLORS.FRAME};
  position: relative;
`;

const FrameCanvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
`;

export default SignFrame;

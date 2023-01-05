import { FC, PropsWithChildren, useMemo } from "react";
import styled from "styled-components";

import { useSignConfigContext } from "../hooks";
import { COLORS } from "../constants/colors";
import { calcFrameId, calcFrameSize } from "../utils";
import Canvas from "./Canvas";

const SignFrame: FC<PropsWithChildren> = ({ children }) => {
  const { id, height, width, frameProportion } = useSignConfigContext();
  const frameId = useMemo(() => calcFrameId(id), [id]);
  const frameSize = useMemo(
    () => calcFrameSize(height, frameProportion),
    [height, frameProportion]
  );

  return (
    <StyledSignFrame style={{ height, width, padding: frameSize }}>
      {!!frameSize && (
        <FrameCanvas id={frameId} height={height} width={width} />
      )}
      {children}
    </StyledSignFrame>
  );
};

const StyledSignFrame = styled.div`
  background-color: ${COLORS.FRAME};
  position: relative;
`;

const FrameCanvas = styled(Canvas)`
  position: absolute;
  top: 0;
  left: 0;
`;

export default SignFrame;

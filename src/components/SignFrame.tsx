import { FC, PropsWithChildren, useMemo } from "react";
import styled from "styled-components";

import { useLEDMessageSignContext } from "../hooks";
import { COLORS } from "../constants/colors";
import { calcFrameSize } from "../utils";

const SignFrame: FC<PropsWithChildren> = ({ children }) => {
  const { height, width, frameProportion } = useLEDMessageSignContext();
  const frameSize = useMemo(
    () => calcFrameSize(height, frameProportion),
    [height, frameProportion]
  );

  return (
    <StyledSignFrame style={{ height, width, padding: frameSize }}>
      {children}
    </StyledSignFrame>
  );
};

const StyledSignFrame = styled.div`
  background-color: ${COLORS.FRAME};
`;

export default SignFrame;

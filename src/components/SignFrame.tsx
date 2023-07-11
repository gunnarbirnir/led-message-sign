import React, { FC, PropsWithChildren } from "react";
import styled from "styled-components";

import { useSignContext } from "../hooks";
import { COLORS } from "../constants/colors";

const SignFrame: FC<PropsWithChildren> = ({ children }) => {
  const {
    config: { height, width },
    computedValues: { frameSize },
  } = useSignContext();
  /* const {} = useMemo(
    () => ({
      frameGlowId: `sign-frame-glow-${id}`,
      frameMaskingId: `sign-frame-masking-${id}`,
      frameShadingId: `sign-frame-shading-${id}`,
    }),
    [id]
  ); */

  if (!width) {
    return null;
  }

  return (
    <StyledSignFrame style={{ height, width }}>
      <SignContent style={{ top: frameSize, left: frameSize }}>
        {children}
      </SignContent>
    </StyledSignFrame>
  );
};

const StyledSignFrame = styled.div`
  position: relative;
  background-color: ${COLORS.FRAME};
`;

const SignContent = styled.div`
  position: absolute;
`;

export default SignFrame;

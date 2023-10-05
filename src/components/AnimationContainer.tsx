import React, { FC, PropsWithChildren } from "react";
import styled from "styled-components";

interface AnimationContainerProps {
  id: string;
  width: number;
}

const AnimationContainer: FC<PropsWithChildren<AnimationContainerProps>> = ({
  id,
  width,
  children,
}) => {
  return (
    <StyledAnimationContainer id={id} style={{ width }}>
      {children}
    </StyledAnimationContainer>
  );
};

const StyledAnimationContainer = styled.div`
  will-change: "transform";
  // transform: "translate3d(0, 0, 0)",
`;

export default AnimationContainer;

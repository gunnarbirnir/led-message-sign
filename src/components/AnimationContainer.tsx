import React, { FC, PropsWithChildren } from "react";
import styled from "styled-components";

interface AnimationContainerProps {
  id: string;
  width: number;
  initTranslateX?: number;
}

const AnimationContainer: FC<PropsWithChildren<AnimationContainerProps>> = ({
  id,
  width,
  initTranslateX = 0,
  children,
}) => {
  return (
    <StyledAnimationContainer
      id={id}
      style={{ width, transform: `translateX(-${initTranslateX}px)` }}
    >
      {children}
    </StyledAnimationContainer>
  );
};

const StyledAnimationContainer = styled.div`
  display: flex;
  flex-direction: row;
  will-change: transform;
  // transform: translate3d(0, 0, 0);
`;

export default AnimationContainer;

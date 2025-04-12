import React, { type FC, type PropsWithChildren } from "react";

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
    <div
      id={id}
      style={{
        width,
        display: "flex",
        flexDirection: "row",
        willChange: "transform",
        transform: `translateX(-${initTranslateX}px)`,
      }}
    >
      {children}
    </div>
  );
};

export default AnimationContainer;

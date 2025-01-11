import React, { FC } from "react";

import { CANVAS_SCALING } from "~/constants";
import { BaseProps } from "~/types";

interface CanvasProps extends BaseProps {
  id: string;
  height: number;
  width: number;
}

const Canvas: FC<CanvasProps> = ({
  id,
  height,
  width,
  className,
  style = {},
}) => {
  return (
    <canvas
      id={id}
      height={height * CANVAS_SCALING}
      width={width * CANVAS_SCALING}
      style={{ ...style, height, width }}
      className={className}
    />
  );
};

export default Canvas;

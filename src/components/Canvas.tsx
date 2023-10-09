import React, { FC } from "react";

import { BaseProps } from "../types";
import { CANVAS_SCALING } from "../constants";

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

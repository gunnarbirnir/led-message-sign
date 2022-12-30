import { FC } from "react";

import { CANVAS_SCALING } from "../constants";

interface CanvasProps {
  id: string;
  height: number;
  width: number;
  className?: string;
}

// TODO: Maybe not needed?
const Canvas: FC<CanvasProps> = ({ id, height, width, className }) => {
  return (
    <canvas
      id={id}
      height={height * CANVAS_SCALING}
      width={width * CANVAS_SCALING}
      style={{ height, width }}
      className={className}
    />
  );
};

export default Canvas;

import React, { FC } from "react";

import { Canvas } from "~/components";
import { CanvasChunk } from "~/types";

interface CanvasChunksProps {
  chunks: CanvasChunk[];
  height: number;
}

const CanvasChunks: FC<CanvasChunksProps> = ({ chunks, height }) => {
  return (
    <>
      {chunks.map((chunk) => (
        <Canvas
          id={chunk.id}
          key={chunk.id}
          height={height}
          width={chunk.end - chunk.start}
        />
      ))}
    </>
  );
};

export default CanvasChunks;

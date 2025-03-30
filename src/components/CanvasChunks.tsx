import React, { FC } from "react";

import { CanvasChunk } from "~/types";

import Canvas from "./Canvas";

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

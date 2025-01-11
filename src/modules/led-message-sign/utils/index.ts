import { CANVAS_SCALING } from "~/constants";
import { CanvasChunk } from "~/types";

import { ALPHABET, EMPTY_COLUMN, UNKNOWN_LETTER } from "../constants/alphabet";

export const calcPixelGrid = (text: string, pixelCountX: number) => {
  // Add back to remove trailing space
  /* const addSpaceBehindLetter = (text: string, index: number) => {
    return index !== text.length - 1 ? [EMPTY_COLUMN] : [];
  }; */

  const grid = text
    .toUpperCase()
    .split("")
    .map((letter) => [
      ...(ALPHABET[letter] || UNKNOWN_LETTER),
      ...[EMPTY_COLUMN],
    ])
    .flat();

  const frontPadding = [];
  for (let i = 0; i < pixelCountX; i++) {
    frontPadding.push(EMPTY_COLUMN);
  }

  return [...frontPadding, ...grid];
};

const CANVAS_CHUNK_SIZE = 4000 / CANVAS_SCALING;

export const getCanvasChunks = (
  chunkBaseId: string,
  itemSize: number,
  itemCount: number
) => {
  const canvasChunks: CanvasChunk[] = [];
  const itemsPerChunk = Math.floor(CANVAS_CHUNK_SIZE / itemSize);
  const chunkWidth = itemsPerChunk * itemSize;
  const totalWidth = itemCount * itemSize;
  const chunkCount = Math.ceil(totalWidth / chunkWidth);

  if (!chunkCount) {
    return [];
  }

  for (let i = 0; i < chunkCount; i++) {
    const xStart = i * itemsPerChunk;
    const xEnd = Math.min(xStart + itemsPerChunk, itemCount);
    const start = xStart * itemSize;
    const end = xEnd * itemSize;

    canvasChunks.push({ id: `${chunkBaseId}-${i}`, start, end });
  }

  return canvasChunks;
};

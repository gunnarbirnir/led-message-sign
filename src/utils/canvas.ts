import { CanvasChunk } from "../types";
import { CANVAS_SCALING } from "../constants";

export const getCanvasContext = (id: string, alpha: boolean = false) => {
  const canvas = document.getElementById(id) as HTMLCanvasElement;
  const ctx = canvas ? canvas.getContext("2d", { alpha }) : null;

  if (ctx) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(CANVAS_SCALING, CANVAS_SCALING);
  }

  return ctx;
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

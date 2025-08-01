import { type PixelGrid } from "~/types";

import { type ImageSignConfig } from "../types";

const PADDING_TO_WIDTH_RATIO = 0.02;

const flipAxis = (pixelGrid: PixelGrid) => {
  const flippedPixelGrid = pixelGrid[0].map((_, index) =>
    pixelGrid.map((row) => row[index])
  );

  return flippedPixelGrid;
};

const calcPixelGrid = (
  images: PixelGrid[],
  pixelCountX: number,
  pixelCountY: number
) => {
  const emptyRow = new Array(pixelCountX).fill(null);

  const pixelGrid: PixelGrid = images.reduce(
    (currentGrid: PixelGrid, image) => {
      const imageGrid = [];

      for (let y = 0; y < pixelCountY; y++) {
        if (image[y]) {
          const gridRow = [];
          for (let x = 0; x < pixelCountX; x++) {
            gridRow.push(image[y][x] ?? null);
          }
          imageGrid.push(gridRow);
        } else {
          imageGrid.push(emptyRow);
        }
      }

      return [...currentGrid, ...flipAxis(imageGrid)];
    },
    []
  );

  return pixelGrid;
};

export const calcComputedValues = (config: ImageSignConfig) => {
  const firstImageGrid = config.images[0];
  const pixelCountY = firstImageGrid.length;
  const pixelCountX = firstImageGrid[0].length;
  const signWidth = config.width;
  const frameSize = Math.round(signWidth * config.frameProportion);
  const displayWidth = signWidth - frameSize * 2;
  const approxPaddingX = signWidth * PADDING_TO_WIDTH_RATIO * 2;
  const pixelSize = Math.round((displayWidth - approxPaddingX) / pixelCountX);
  const pixelAreaWidth = pixelSize * pixelCountX;
  const displayPaddingX = (displayWidth - pixelAreaWidth) / 2;
  const pixelGrid = calcPixelGrid(config.images, pixelCountX, pixelCountY);
  const pixelGridWidth = pixelSize * pixelGrid.length;

  const pixelAreaHeight = pixelSize * pixelCountY;
  const approxDisplayPaddingY = displayPaddingX;
  const approxDisplayHeight = pixelAreaHeight + approxDisplayPaddingY * 2;
  const signHeight = Math.max(
    approxDisplayHeight + frameSize * 2,
    config.minHeight
  );
  const displayHeight = signHeight - frameSize * 2;
  const displayPaddingY = (displayHeight - pixelAreaHeight) / 2;

  return {
    signHeight,
    signWidth,
    frameSize,
    displayHeight,
    displayWidth,
    pixelAreaHeight,
    pixelAreaWidth,
    displayPaddingX,
    displayPaddingY,
    pixelSize,
    pixelCountX,
    pixelCountY,
    pixelGrid,
    pixelGridWidth,
  };
};

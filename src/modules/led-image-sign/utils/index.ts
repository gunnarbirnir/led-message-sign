import { type PixelGrid } from "~/types";

import { PADDING_TO_WIDTH_RATIO } from "../constants";
import { type ImageSignConfig } from "../types";

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
  const pixelAreaHeight = pixelSize * pixelCountY;
  const displayPaddingX = (displayWidth - pixelAreaWidth) / 2;
  const displayPaddingY = displayPaddingX;
  const displayHeight = pixelAreaHeight + displayPaddingY * 2;
  const signHeight = displayHeight + frameSize * 2;
  const pixelGrid = calcPixelGrid(config.images, pixelCountX, pixelCountY);
  const pixelGridWidth = pixelSize * pixelGrid.length;

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

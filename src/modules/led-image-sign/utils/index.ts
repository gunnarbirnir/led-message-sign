import { PADDING_TO_WIDTH_RATIO } from "../constants";
import { ImageSignConfig } from "../types";

export const calcComputedValues = (config: ImageSignConfig) => {
  const firstImageGrid = config.images[0].pixelGrid;
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
  // const pixelGrid = calcPixelGrid(config.text, pixelCountX);
  // const pixelGridWidth = pixelSize * pixelGrid.length;

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
    pixelGrid: [],
    pixelGridWidth: 0,
  };
};

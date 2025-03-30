import { PADDING_TO_HEIGHT_RATIO } from "~/constants";

import { ImageSignConfig } from "../types";

export const calcComputedValues = (config: ImageSignConfig) => {
  const firstImageGrid = config.images[0].pixelGrid;
  const pixelCountY = firstImageGrid.length;
  const pixelCountX = firstImageGrid[0].length;
  const signWidth = config.width;
  const signHeight = Math.round(signWidth * (pixelCountY / pixelCountX));
  const frameSize = Math.round(signHeight * config.frameProportion);
  const displayHeight = signHeight - frameSize * 2;
  const displayWidth = signWidth - frameSize * 2;
  const approxPaddingY = signHeight * PADDING_TO_HEIGHT_RATIO * 2;
  const pixelSize = Math.round((displayHeight - approxPaddingY) / pixelCountY);
  const pixelAreaHeight = pixelSize * pixelCountY;
  const displayPaddingY = (displayHeight - pixelAreaHeight) / 2;
  const pixelAreaWidth = pixelSize * pixelCountX;
  const displayPaddingX = (displayWidth - pixelAreaWidth) / 2;
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

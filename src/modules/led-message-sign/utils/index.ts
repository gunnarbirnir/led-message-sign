import { PADDING_TO_HEIGHT_RATIO, VERTICAL_PIXEL_COUNT } from "../constants";
import { ALPHABET, EMPTY_COLUMN, UNKNOWN_LETTER } from "../constants/alphabet";
import { type MessageSignConfig } from "../types";

export const calcPixelGrid = (
  text: string,
  pixelCountX: number,
  colorHue: number
) => {
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

  return [...frontPadding, ...grid].map((col) =>
    col.map((pixel) => (pixel ? colorHue : null))
  );
};

export const calcComputedValues = (config: MessageSignConfig) => {
  const signHeight = config.height;
  const signWidth = config.width;
  const frameSize = Math.round(signHeight * config.frameProportion);
  const displayHeight = signHeight - frameSize * 2;
  const displayWidth = signWidth - frameSize * 2;
  const approxPaddingY = signHeight * PADDING_TO_HEIGHT_RATIO * 2;
  const pixelSize = Math.round(
    (displayHeight - approxPaddingY) / VERTICAL_PIXEL_COUNT
  );
  const pixelAreaHeight = pixelSize * VERTICAL_PIXEL_COUNT;
  const displayPaddingY = (displayHeight - pixelAreaHeight) / 2;
  const widthWithoutPadding = displayWidth - displayPaddingY * 2;
  const pixelCountX = Math.floor(widthWithoutPadding / pixelSize);
  const pixelAreaWidth = pixelSize * pixelCountX;
  const displayPaddingX = (displayWidth - pixelAreaWidth) / 2;
  const pixelCountY = VERTICAL_PIXEL_COUNT;
  const pixelGrid = calcPixelGrid(config.text, pixelCountX, config.colorHue);
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

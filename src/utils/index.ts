import {
  VERTICAL_PIXEL_COUNT,
  PADDING_TO_HEIGHT_RATIO,
  CANVAS_SCALING,
} from "../constants";
import { ALPHABET, UNKNOWN_LETTER, EMPTY_COLUMN } from "../constants/alphabet";
import { PixelGrid, SignConfig } from "../types";

export const hslValuesToCss = (
  hue: number,
  saturation: number = 100,
  lightness: number = 50,
  opacity?: number
) => {
  if (opacity === undefined) {
    return `hsl(${hue}deg ${saturation}% ${lightness}%)`;
  }
  return `hsl(${hue}deg ${saturation}% ${lightness}% / ${opacity})`;
};

export const calcComputedValues = (
  config: SignConfig,
  canvasScaling: number = CANVAS_SCALING
) => {
  const signHeight = config.height * canvasScaling;
  const signWidth = config.width * canvasScaling;
  const frameSize = (signHeight * config.frameProportion) / 2;
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
  const pixelGrid = calcPixelGrid(config.text, pixelCountX);
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

export const calcPixelGrid = (text: string, pixelCountX: number) => {
  /* const addSpaceBehindLetter = (text: string, index: number) => {
    return index !== text.length - 1 ? [EMPTY_COLUMN] : [];
  }; */

  const grid = text
    .toUpperCase()
    .split("")
    .map((letter, index) => [
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

export const calcTotalOffset = (
  x: number,
  animationOffset: number,
  pixelGrid: PixelGrid
) => {
  return (x + animationOffset) % pixelGrid.length;
};

export const isPixelOn = (x: number, y: number, pixelGrid: PixelGrid) => {
  if (x < 0 || x >= pixelGrid.length) {
    return false;
  }
  return !!pixelGrid[x][y];
};

export const calcPixelXPos = (
  x: number,
  pixelSize: number,
  displayPaddingX: number
) => {
  return x * pixelSize + displayPaddingX;
};

export const calcPixelXCenterPos = (pixelXPos: number, pixelSize: number) => {
  return pixelXPos + pixelSize / 2;
};

export const calcPixelYPos = (
  y: number,
  pixelSize: number,
  displayPaddingY: number
) => {
  return y * pixelSize + displayPaddingY;
};

export const calcPixelYCenterPos = (pixelYPos: number, pixelSize: number) => {
  return pixelYPos + pixelSize / 2;
};

export const calcGlowPosition = (
  // x or y
  idx: number,
  signSize: number,
  pixelSize: number,
  pixelCount: number
) => {
  const pixelProportion = pixelSize / (signSize || Infinity);
  const pixelAreaProportion = pixelProportion * pixelCount;
  const frameAndPaddingProportion = (1 - pixelAreaProportion) / 2;
  const progress = idx / pixelCount;

  return (
    progress * pixelAreaProportion +
    frameAndPaddingProportion +
    pixelProportion / 2
  );
};

// To prevent glow when no light is visible
export const calcDisableGlow = (
  x: number,
  offsetX: number,
  pixelCountX: number
) => {
  // For distance = 1
  const startingPos = offsetX === x;
  // For distance = 2
  const beforeStart = offsetX === x - 1;
  const afterStart = offsetX === x + 1;

  if (startingPos) {
    return 0;
  }

  if (beforeStart && x === pixelCountX - 1) {
    return 0;
  }

  if (afterStart && x === 0) {
    return 0;
  }

  return undefined;
};

const GLOW_CURRENT_PIXEL = 1;
const GLOW_DISTANCE_1 = 0.75;
const GLOW_DISTANCE_2 = 0.5;

export const calcPixelGlow = (
  x: number,
  y: number,
  pixelGrid: PixelGrid,
  vertical: boolean = false
) => {
  if (isPixelOn(x, y, pixelGrid)) {
    return GLOW_CURRENT_PIXEL;
  }

  const calcXCoord = (x: number) => {
    return x < 0
      ? x + pixelGrid.length
      : x >= pixelGrid.length
      ? x - pixelGrid.length
      : x;
  };

  const pixelOnAtDistance = (distance: number) => {
    const prevCoords: [number, number] = vertical
      ? [x, y - distance]
      : [calcXCoord(x - distance), y];
    const nextCoords: [number, number] = vertical
      ? [x, y + distance]
      : [calcXCoord(x + distance), y];
    const prevPixelOn = isPixelOn(...prevCoords, pixelGrid);
    const nextPixelOn = isPixelOn(...nextCoords, pixelGrid);

    return prevPixelOn || nextPixelOn;
  };

  if (pixelOnAtDistance(1)) {
    return GLOW_DISTANCE_1;
  }

  if (pixelOnAtDistance(2)) {
    return GLOW_DISTANCE_2;
  }

  return 0;
};

import { VERTICAL_PIXEL_COUNT, PADDING_TO_HEIGHT_RATIO } from "../constants";
import { ALPHABET, UNKNOWN_LETTER, EMPTY_COLUMN } from "../constants/alphabet";

// TODO: Test

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

export const calcFrameId = (id: string) => {
  return `sign-frame-${id}`;
};

export const calcFrameSize = (signHeight: number, frameProportion: number) => {
  return (signHeight * frameProportion) / 2;
};

export const calcDisplayId = (id: string) => {
  return `sign-display-${id}`;
};

export const calcDisplayHeight = (signHeight: number, frameSize: number) => {
  return signHeight - frameSize * 2;
};

export const calcDisplayWidth = (signWidth: number, frameSize: number) => {
  return signWidth - frameSize * 2;
};

export const calcDisplayPaddingY = (signHeight: number) => {
  return Math.floor(signHeight * PADDING_TO_HEIGHT_RATIO);
};

export const calcPixelSize = (
  displayHeight: number,
  displayPaddingY: number
) => {
  const pixelAreaHeight = displayHeight - displayPaddingY * 2;
  return pixelAreaHeight / VERTICAL_PIXEL_COUNT;
};

export const calcPixelCountX = (
  displayWidth: number,
  displayPaddingY: number,
  pixelSize: number
) => {
  const widthWithoutPadding = displayWidth - displayPaddingY * 2;
  return Math.floor(widthWithoutPadding / pixelSize);
};

export const calcDisplayPaddingX = (
  displayWidth: number,
  pixelSize: number,
  pixelCountX: number
) => {
  const pixelAreaWidth = pixelSize * pixelCountX;
  return (displayWidth - pixelAreaWidth) / 2;
};

export const calcPixelGrid = (text: string, pixelCountX: number) => {
  const addSpaceBehindLetter = (text: string, index: number) => {
    return index !== text.length - 1 ? [EMPTY_COLUMN] : [];
  };

  const grid = text
    .toUpperCase()
    .split("")
    .map((letter, index) => [
      ...(ALPHABET[letter] || UNKNOWN_LETTER),
      ...addSpaceBehindLetter(text, index),
    ])
    .flat();

  const frontPadding = [];
  for (let i = 0; i < pixelCountX; i++) {
    frontPadding.push(EMPTY_COLUMN);
  }

  return [...frontPadding, ...grid];
};

export const calcAnimationOffset = (
  animationFrame: number,
  animationFramesPerUpdate: number
) => {
  return Math.floor(animationFrame / animationFramesPerUpdate);
};

export const calcTotalOffset = (
  x: number,
  animationOffset: number,
  pixelGrid: number[][]
) => {
  return (x + animationOffset) % pixelGrid.length;
};

export const calcMultiColorValue = (
  x: number,
  y: number,
  animationFrame: number
) => {
  return (animationFrame + x + y) % 360;
};

export const isPixelOn = (x: number, y: number, pixelGrid: number[][]) => {
  if (x >= pixelGrid.length) {
    return false;
  }
  return !!pixelGrid[x][y];
};

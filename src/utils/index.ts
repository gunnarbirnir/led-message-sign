import { LEDMessageSignProps } from "../types";
import { VERTICAL_PIXEL_COUNT, PADDING_TO_HEIGHT_RATIO } from "../constants";
import { ALPHABET, UNKNOWN_LETTER, EMPTY_COLUMN } from "../constants/alphabet";
import {
  DEFAULT_VALUE,
  MAX_CHARACTERS,
  MIN_VALUE,
  MAX_VALUE,
} from "../constants/props";

// TODO: Test

export const sanitizeProps = ({
  text,
  height = DEFAULT_VALUE.HEIGHT,
  width = DEFAULT_VALUE.WIDTH,
  fullWidth = DEFAULT_VALUE.FULL_WIDTH,
  hueDegrees = DEFAULT_VALUE.HUE_DEGREES,
  frameProportion = DEFAULT_VALUE.FRAME_PROPORTION,
  animationFramesPerUpdate = DEFAULT_VALUE.ANIMATION_FRAMES_PER_UPDATE,
  animationDelay = DEFAULT_VALUE.ANIMATION_DELAY,
}: LEDMessageSignProps) => {
  return {
    text:
      text.length > MAX_CHARACTERS ? text.substring(0, MAX_CHARACTERS) : text,
    height: sanitizeMinValue(height, MIN_VALUE.HEIGHT),
    width: sanitizeMinValue(width, MIN_VALUE.WIDTH),
    fullWidth,
    hueDegrees: sanitizeMinMaxValue(
      hueDegrees,
      MIN_VALUE.HUE_DEGREES,
      MAX_VALUE.HUE_DEGREES
    ),
    frameProportion: sanitizeMinMaxValue(
      frameProportion,
      MIN_VALUE.FRAME_PROPORTION,
      MAX_VALUE.FRAME_PROPORTION
    ),
    animationFramesPerUpdate: sanitizeMinValue(
      animationFramesPerUpdate,
      MIN_VALUE.ANIMATION_FRAMES_PER_UPDATE
    ),
    animationDelay: sanitizeMinValue(animationDelay, MIN_VALUE.ANIMATION_DELAY),
  };
};

export const sanitizeMinValue = (val: number, minVal: number) => {
  return Math.max(val, minVal);
};

export const sanitizeMinMaxValue = (
  val: number,
  minVal: number,
  maxVal: number
) => {
  return Math.max(Math.min(val, maxVal), minVal);
};

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

export const isPixelOn = (x: number, y: number, pixelGrid: number[][]) => {
  if (x >= pixelGrid.length) {
    return false;
  }
  return !!pixelGrid[x][y];
};

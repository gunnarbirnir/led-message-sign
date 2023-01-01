import { LEDMessageSignProps } from "../types";
import { VERTICAL_PIXEL_COUNT, PADDING_TO_HEIGHT_RATIO } from "../constants";
import { DEFAULT_VALUE, MIN_VALUE, MAX_VALUE } from "../constants/props";

// TODO: Test

export const sanitizeProps = ({
  text,
  height = DEFAULT_VALUE.HEIGHT,
  width = DEFAULT_VALUE.WIDTH,
  fullWidth = DEFAULT_VALUE.FULL_WIDTH,
  hueDegrees = DEFAULT_VALUE.HUE_DEGREES,
  frameProportion = DEFAULT_VALUE.FRAME_PROPORTIONS,
  animationFramesPerUpdate = DEFAULT_VALUE.ANIMATION_FRAMES_PER_UPDATE,
  animationDelay = DEFAULT_VALUE.ANIMATION_DELAY,
}: LEDMessageSignProps) => {
  return {
    text,
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
      MIN_VALUE.FRAME_PROPORTIONS,
      MAX_VALUE.FRAME_PROPORTIONS
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
  saturation: number,
  lightness: number,
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

export const calcDisplayVerticalPadding = (signHeight: number) => {
  return Math.floor(signHeight * PADDING_TO_HEIGHT_RATIO);
};

export const calcPixelSize = (
  displayHeight: number,
  verticalPadding: number
) => {
  const pixelAreaHeight = displayHeight - verticalPadding * 2;
  return pixelAreaHeight / VERTICAL_PIXEL_COUNT;
};

export const calcHorizontalPixelCount = (
  displayWidth: number,
  verticalPadding: number,
  pixelSize: number
) => {
  const widthWithoutPadding = displayWidth - verticalPadding * 2;
  return Math.floor(widthWithoutPadding / pixelSize);
};

export const calcDisplayHorizontalPadding = (
  displayWidth: number,
  pixelSize: number,
  horizontalPixelCount: number
) => {
  const pixelAreaWidth = pixelSize * horizontalPixelCount;
  return (displayWidth - pixelAreaWidth) / 2;
};

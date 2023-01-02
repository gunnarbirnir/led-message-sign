import { LEDMessageSignProps } from "../types";
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
  multiColor = DEFAULT_VALUE.MULTI_COLOR,
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
    multiColor,
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

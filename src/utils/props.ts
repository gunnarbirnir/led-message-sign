import { LEDMessageSignProps } from "../types";
import {
  DEFAULT_VALUE,
  MAX_CHARACTERS,
  MIN_VALUE,
  MAX_VALUE,
} from "../constants/props";

export const sanitizeProps = ({
  text,
  height = DEFAULT_VALUE.HEIGHT,
  width = DEFAULT_VALUE.WIDTH,
  fullWidth = DEFAULT_VALUE.FULL_WIDTH,
  colorHue = DEFAULT_VALUE.COLOR_HUE,
  hideFrame = DEFAULT_VALUE.HIDE_FRAME,
  coloredOffLights = DEFAULT_VALUE.COLORED_OFF_LIGHTS,
  updatesPerSecond = DEFAULT_VALUE.UPDATES_PER_SECOND,
}: LEDMessageSignProps) => {
  return {
    text:
      text.length > MAX_CHARACTERS ? text.substring(0, MAX_CHARACTERS) : text,
    height: sanitizeMinValue(height, MIN_VALUE.HEIGHT),
    width: sanitizeMinValue(width, MIN_VALUE.WIDTH),
    fullWidth,
    colorHue: sanitizeMinMaxValue(
      colorHue,
      MIN_VALUE.COLOR_HUE,
      MAX_VALUE.COLOR_HUE
    ),
    hideFrame,
    coloredOffLights,
    updatesPerSecond: sanitizeMinMaxValue(
      Math.round(updatesPerSecond),
      MIN_VALUE.UPDATES_PER_SECOND,
      MAX_VALUE.UPDATES_PER_SECOND
    ),
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

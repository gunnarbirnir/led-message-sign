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
  onBulbLightness = DEFAULT_VALUE.ON_BULB_LIGHTNESS,
  offBulbLightness = DEFAULT_VALUE.OFF_BULB_LIGHTNESS,
  frameLightness = DEFAULT_VALUE.FRAME_LIGHTNESS,
  backgroundLightness = DEFAULT_VALUE.BACKGROUND_LIGHTNESS,
  hideFrame = DEFAULT_VALUE.HIDE_FRAME,
  coloredOffLights = DEFAULT_VALUE.COLORED_OFF_LIGHTS,
  animationFramesPerUpdate = DEFAULT_VALUE.ANIMATION_FRAMES_PER_UPDATE,
}: Omit<LEDMessageSignProps, "text"> & { text: string }) => {
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
    onBulbLightness: sanitizeMinMaxValue(
      onBulbLightness,
      MIN_VALUE.ON_BULB_LIGHTNESS,
      MAX_VALUE.ON_BULB_LIGHTNESS
    ),
    offBulbLightness: sanitizeMinMaxValue(
      offBulbLightness,
      MIN_VALUE.OFF_BULB_LIGHTNESS,
      MAX_VALUE.OFF_BULB_LIGHTNESS
    ),
    frameLightness: sanitizeMinMaxValue(
      frameLightness,
      MIN_VALUE.FRAME_LIGHTNESS,
      MAX_VALUE.FRAME_LIGHTNESS
    ),
    backgroundLightness: sanitizeMinMaxValue(
      backgroundLightness,
      MIN_VALUE.BACKGROUND_LIGHTNESS,
      MAX_VALUE.BACKGROUND_LIGHTNESS
    ),
    hideFrame,
    coloredOffLights,
    animationFramesPerUpdate: sanitizeMinMaxValue(
      animationFramesPerUpdate,
      MIN_VALUE.ANIMATION_FRAMES_PER_UPDATE,
      MAX_VALUE.ANIMATION_FRAMES_PER_UPDATE
    ),
  };
};

export const sanitizeMinValue = (val: number, minVal: number) => {
  const roundedVal = Math.round(val);
  return Math.max(roundedVal, minVal);
};

export const sanitizeMinMaxValue = (
  val: number,
  minVal: number,
  maxVal: number
) => {
  const roundedVal = Math.round(val);
  return Math.max(Math.min(roundedVal, maxVal), minVal);
};

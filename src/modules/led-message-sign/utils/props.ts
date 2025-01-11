import {
  DEFAULT_VALUE,
  MAX_CHARACTERS,
  MAX_VALUE,
  MIN_VALUE,
} from "../constants/props";
import { LEDMessageSignProps } from "../types";

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
  staticMode = DEFAULT_VALUE.STATIC_MODE,
  staticModeDelay = DEFAULT_VALUE.STATIC_MODE_DELAY,
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
    staticMode,
    staticModeDelay: sanitizeMinMaxValue(
      staticModeDelay,
      MIN_VALUE.STATIC_MODE_DELAY,
      MAX_VALUE.STATIC_MODE_DELAY
    ),
  };
};

import { sanitizeMinMaxValue, sanitizeMinValue } from "~/utils";

import { DEFAULT_VALUE, MAX_VALUE, MIN_VALUE } from "../constants/props";
import { LEDImageSignProps } from "../types";

export const sanitizeProps = ({
  images = DEFAULT_VALUE.IMAGES,
  width = DEFAULT_VALUE.WIDTH,
  fullWidth = DEFAULT_VALUE.FULL_WIDTH,
  onBulbLightness = DEFAULT_VALUE.ON_BULB_LIGHTNESS,
  offBulbLightness = DEFAULT_VALUE.OFF_BULB_LIGHTNESS,
  frameLightness = DEFAULT_VALUE.FRAME_LIGHTNESS,
  backgroundLightness = DEFAULT_VALUE.BACKGROUND_LIGHTNESS,
  hideFrame = DEFAULT_VALUE.HIDE_FRAME,
  animationFramesPerUpdate = DEFAULT_VALUE.ANIMATION_FRAMES_PER_UPDATE,
}: LEDImageSignProps) => {
  return {
    images: images.length ? images : DEFAULT_VALUE.IMAGES,
    width: sanitizeMinValue(width, MIN_VALUE.WIDTH),
    fullWidth,
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
    animationFramesPerUpdate: sanitizeMinMaxValue(
      animationFramesPerUpdate,
      MIN_VALUE.ANIMATION_FRAMES_PER_UPDATE,
      MAX_VALUE.ANIMATION_FRAMES_PER_UPDATE
    ),
  };
};

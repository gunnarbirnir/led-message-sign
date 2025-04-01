import { COLOR_VALUES } from "~/constants/colors";

import { TESTING_G } from "./testing";

export const DEFAULT_VALUE = {
  IMAGES: TESTING_G,
  /* [
    {
      pixelGrid: Array.from({ length: 10 }, () => Array(20).fill(null)),
      duration: 1,
    },
  ], */
  WIDTH: 500,
  FULL_WIDTH: false,
  ON_BULB_LIGHTNESS: COLOR_VALUES.BULB_ON.lightness,
  OFF_BULB_LIGHTNESS: COLOR_VALUES.BULB_OFF.lightness,
  FRAME_LIGHTNESS: COLOR_VALUES.FRAME.lightness,
  BACKGROUND_LIGHTNESS: COLOR_VALUES.BACKGROUND.lightness,
  HIDE_FRAME: false,
  ANIMATION_FRAMES_PER_UPDATE: 6,
};

export const MIN_VALUE = {
  WIDTH: 60,
  ON_BULB_LIGHTNESS: 70,
  OFF_BULB_LIGHTNESS: 0,
  FRAME_LIGHTNESS: 10,
  BACKGROUND_LIGHTNESS: 0,
  ANIMATION_FRAMES_PER_UPDATE: 1,
};

export const MAX_VALUE = {
  ON_BULB_LIGHTNESS: 100,
  OFF_BULB_LIGHTNESS: 30,
  FRAME_LIGHTNESS: 40,
  BACKGROUND_LIGHTNESS: 30,
  ANIMATION_FRAMES_PER_UPDATE: 60,
};

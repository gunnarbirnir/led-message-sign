import { HSLColorValues } from "~/types";

enum COLOR {
  FRAME = "FRAME",
  BACKGROUND = "BACKGROUND",
  LIGHT = "LIGHT",
  BULB_ON = "BULB_ON",
  BULB_OFF = "BULB_OFF",
  GLOW = "GLOW",
}

export const COLOR_VALUES: Record<COLOR, HSLColorValues> = {
  FRAME: {
    hue: 0,
    saturation: 0,
    lightness: 15,
  },
  BACKGROUND: {
    hue: 0,
    saturation: 0,
    lightness: 0,
  },
  LIGHT: {
    hue: 0,
    saturation: 100,
    lightness: 50,
  },
  BULB_ON: {
    hue: 0,
    saturation: 100,
    lightness: 95,
  },
  BULB_OFF: {
    hue: 0,
    saturation: 100,
    lightness: 10,
  },
  GLOW: {
    hue: 0,
    saturation: 100,
    lightness: 50,
  },
};

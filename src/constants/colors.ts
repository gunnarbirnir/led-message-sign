import { HSLColorValues } from "../types";
import { hslValuesToCss } from "../utils";

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

export const COLORS = Object.fromEntries(
  Object.keys(COLOR_VALUES).map((key) => {
    const colorKey = key as COLOR;
    return [
      colorKey,
      hslValuesToCss(
        COLOR_VALUES[colorKey].hue,
        COLOR_VALUES[colorKey].saturation,
        COLOR_VALUES[colorKey].lightness,
        COLOR_VALUES[colorKey].opacity
      ),
    ];
  })
) as Record<COLOR, string>;

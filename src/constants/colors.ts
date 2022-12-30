import { HSLColorValues } from "../types";
import { hslValuesToCss } from "../utils";

enum COLOR {
  FRAME = "FRAME",
  BACKGROUND = "BACKGROUND",
}

export const COLOR_VALUES: Record<COLOR, HSLColorValues> = {
  FRAME: {
    hue: 0,
    saturation: 0,
    lightness: 20,
  },
  BACKGROUND: {
    hue: 0,
    saturation: 0,
    lightness: 0,
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
        COLOR_VALUES[colorKey].lightness
      ),
    ];
  })
) as Record<COLOR, string>;

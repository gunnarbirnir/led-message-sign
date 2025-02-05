import { VERTICAL_PIXEL_COUNT, PADDING_TO_HEIGHT_RATIO } from "../constants";
import { COLOR_VALUES } from "../constants/colors";
import { ALPHABET, UNKNOWN_LETTER, EMPTY_COLUMN } from "../constants/alphabet";
import {
  PixelGrid,
  SignConfig,
  HSLColorValues,
  SignColors,
  SignColorKey,
} from "../types";

export const hslValuesToCss = (
  hue: number,
  saturation: number = 100,
  lightness: number = 50,
  opacity?: number
) => {
  if (opacity === undefined) {
    return `hsl(${hue}deg ${saturation}% ${lightness}%)`;
  }
  return `hsl(${hue}deg ${saturation}% ${lightness}% / ${opacity})`;
};

export const calcComputedValues = (config: SignConfig) => {
  const signHeight = config.height;
  const signWidth = config.width;
  const frameSize = Math.round(signHeight * config.frameProportion);
  const displayHeight = signHeight - frameSize * 2;
  const displayWidth = signWidth - frameSize * 2;
  const approxPaddingY = signHeight * PADDING_TO_HEIGHT_RATIO * 2;
  const pixelSize = Math.round(
    (displayHeight - approxPaddingY) / VERTICAL_PIXEL_COUNT
  );
  const pixelAreaHeight = pixelSize * VERTICAL_PIXEL_COUNT;
  const displayPaddingY = (displayHeight - pixelAreaHeight) / 2;
  const widthWithoutPadding = displayWidth - displayPaddingY * 2;
  const pixelCountX = Math.floor(widthWithoutPadding / pixelSize);
  const pixelAreaWidth = pixelSize * pixelCountX;
  const displayPaddingX = (displayWidth - pixelAreaWidth) / 2;
  const pixelCountY = VERTICAL_PIXEL_COUNT;
  const pixelGrid = calcPixelGrid(config.text, pixelCountX);
  const pixelGridWidth = pixelSize * pixelGrid.length;

  return {
    signHeight,
    signWidth,
    frameSize,
    displayHeight,
    displayWidth,
    pixelAreaHeight,
    pixelAreaWidth,
    displayPaddingX,
    displayPaddingY,
    pixelSize,
    pixelCountX,
    pixelCountY,
    pixelGrid,
    pixelGridWidth,
  };
};

export const calcColors = ({
  frameLightness,
  backgroundLightness,
  colorHue,
  onBulbLightness,
  offBulbLightness,
  coloredOffLights,
}: SignConfig) => {
  const getColorFromValues = (values: HSLColorValues) =>
    hslValuesToCss(
      values.hue,
      values.saturation,
      values.lightness,
      values.opacity
    );

  const colorValues: Record<SignColorKey, HSLColorValues> = {
    frame: {
      ...COLOR_VALUES.FRAME,
      lightness: frameLightness,
    },
    background: {
      ...COLOR_VALUES.BACKGROUND,
      lightness: backgroundLightness,
    },
    light: { ...COLOR_VALUES.LIGHT, hue: colorHue },
    bulbOn: {
      ...COLOR_VALUES.BULB_ON,
      hue: colorHue,
      lightness: onBulbLightness,
    },
    bulbOff: {
      ...COLOR_VALUES.BULB_OFF,
      hue: colorHue,
      lightness: offBulbLightness,
      saturation: coloredOffLights ? COLOR_VALUES.BULB_OFF.saturation : 0,
    },
    glow: { ...COLOR_VALUES.GLOW, hue: colorHue },
  };

  const colors = Object.fromEntries(
    Object.keys(colorValues).map((key) => {
      const values = colorValues[key as SignColorKey];
      return [
        key as SignColorKey,
        { ...values, color: getColorFromValues(values) },
      ];
    })
  );

  return colors as SignColors;
};

export const calcPixelGrid = (text: string, pixelCountX: number) => {
  // Add back to remove trailing space
  /* const addSpaceBehindLetter = (text: string, index: number) => {
    return index !== text.length - 1 ? [EMPTY_COLUMN] : [];
  }; */

  const grid = text
    .toUpperCase()
    .split("")
    .map((letter) => [
      ...(ALPHABET[letter] || UNKNOWN_LETTER),
      ...[EMPTY_COLUMN],
    ])
    .flat();

  const frontPadding = [];
  for (let i = 0; i < pixelCountX; i++) {
    frontPadding.push(EMPTY_COLUMN);
  }

  return [...frontPadding, ...grid];
};

export const isPixelOn = (x: number, y: number, pixelGrid: PixelGrid) => {
  if (x < 0 || x >= pixelGrid.length) {
    return false;
  }
  return !!pixelGrid[x][y];
};

export const getSignIds = (signId: string) => {
  const generateId = (baseId: string) => {
    return `${baseId}-${signId}`;
  };

  return {
    displayOnLightsId: generateId("display-on-lights"),
    displayOffLightsId: generateId("display-off-lights"),
    onLightsAnimationId: generateId("on-lights-animation"),
    frameHorizontalGlowId: generateId("frame-horizontal-glow"),
    frameLeftGlowId: generateId("frame-left-glow"),
    frameRightGlowId: generateId("frame-right-glow"),
    frameMaskingId: generateId("frame-masking"),
    frameShadingId: generateId("frame-shading"),
    horizontalGlowAnimationId: generateId("horizontal-glow-animation"),
    leftGlowAnimationId: generateId("left-glow-animation"),
    rightGlowAnimationId: generateId("right-glow-animation"),
  };
};

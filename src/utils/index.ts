import { CANVAS_SCALING, PADDING_TO_HEIGHT_RATIO } from "~/constants";
import { COLOR_VALUES } from "~/constants/colors";
import { HSLColorValues, PixelGrid, SignColorKey, SignColors } from "~/types";

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

export const getCanvasContext = (id: string, alpha: boolean = false) => {
  const canvas = document.getElementById(id) as HTMLCanvasElement;
  const ctx = canvas ? canvas.getContext("2d", { alpha }) : null;

  if (ctx) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(CANVAS_SCALING, CANVAS_SCALING);
  }

  return ctx;
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

export const syncAnimations = async (
  animations: (Animation | null)[] = [],
  updateDuration: number
) => {
  const firstAnimation = animations[0];
  if (firstAnimation) {
    try {
      await firstAnimation.ready;
      const { startTime } = firstAnimation;
      // Sync to animation frame
      const roundedStartTime =
        startTime !== null
          ? Math.ceil((startTime as number) / updateDuration) * updateDuration
          : null;

      animations.forEach((animation) => {
        if (animation) {
          animation.startTime = roundedStartTime;
        }
      });
    } catch {}
  }
};

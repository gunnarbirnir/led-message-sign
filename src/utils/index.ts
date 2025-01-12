import { CANVAS_SCALING } from "~/constants";
import { PixelGrid } from "~/types";

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

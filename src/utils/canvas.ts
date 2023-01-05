import { COLORS, COLOR_VALUES } from "../constants/colors";
import {
  hslValuesToCss,
  calcAnimationOffset,
  calcTotalOffset,
  calcMultiColorHue,
  isPixelOn,
  calcGlowPosition,
  calcDisableGlow,
  calcPixelGlow,
} from "../utils";
import { SignComputedValues, Tuple, SignConfig } from "../types";

export const getCanvasContext = (id: string) => {
  const canvas = document.getElementById(id) as HTMLCanvasElement;
  const ctx = canvas ? canvas.getContext("2d") : null;

  return ctx;
};

const HORIZONTAL_SHADE_COLOR = hslValuesToCss(
  COLOR_VALUES.FRAME.hue,
  COLOR_VALUES.FRAME.saturation,
  COLOR_VALUES.FRAME.lightness + 5
);
const VERTICAL_SHADE_COLOR = hslValuesToCss(
  COLOR_VALUES.FRAME.hue,
  COLOR_VALUES.FRAME.saturation,
  COLOR_VALUES.FRAME.lightness - 10
);
const HORIZONTAL_SHADE_SIZE = 0.3;
const VERTICAL_SHADE_SIZE = 0.4;
const GLOW_OPACITY = 0.1;

export const drawFrame = (
  ctx: CanvasRenderingContext2D,
  computedValues: SignComputedValues,
  config: SignConfig,
  animationFrame: number = 0
) => {
  const {
    signHeight,
    signWidth,
    frameSize,
    pixelSize,
    pixelCountX,
    pixelCountY,
    pixelGrid,
  } = computedValues;
  const { animationFramesPerUpdate, hueDegrees, multiColor } = config;

  const animationOffset = calcAnimationOffset(
    animationFrame,
    animationFramesPerUpdate
  );

  const topLeftCorner: Tuple = [0, 0];
  const topRightCorner: Tuple = [signWidth, 0];
  const bottomRightCorner: Tuple = [signWidth, signHeight];
  const bottomLeftCorner: Tuple = [0, signHeight];

  const topLeftInner: Tuple = [frameSize, frameSize];
  const topRightInner: Tuple = [signWidth - frameSize, frameSize];
  const bottomRightInner: Tuple = [
    signWidth - frameSize,
    signHeight - frameSize,
  ];
  const bottomLeftInner: Tuple = [frameSize, signHeight - frameSize];

  ctx.clearRect(0, 0, signWidth, signHeight);

  const drawFrameTopBorder = (
    fillStyle: string | CanvasGradient | CanvasPattern
  ) => {
    ctx.moveTo(...topLeftCorner);
    ctx.beginPath();
    ctx.lineTo(...topLeftInner);
    ctx.lineTo(...topRightInner);
    ctx.lineTo(...topRightCorner);
    ctx.lineTo(...topLeftCorner);
    ctx.fillStyle = fillStyle;
    ctx.fill();
  };

  const drawFrameRightBorder = (
    fillStyle: string | CanvasGradient | CanvasPattern
  ) => {
    ctx.moveTo(...topRightCorner);
    ctx.beginPath();
    ctx.lineTo(...topRightInner);
    ctx.lineTo(...bottomRightInner);
    ctx.lineTo(...bottomRightCorner);
    ctx.lineTo(...topRightCorner);
    ctx.fillStyle = fillStyle;
    ctx.fill();
  };

  const drawFrameBottomBorder = (
    fillStyle: string | CanvasGradient | CanvasPattern
  ) => {
    ctx.moveTo(...bottomRightCorner);
    ctx.beginPath();
    ctx.lineTo(...bottomRightInner);
    ctx.lineTo(...bottomLeftInner);
    ctx.lineTo(...bottomLeftCorner);
    ctx.lineTo(...bottomRightCorner);
    ctx.fillStyle = fillStyle;
    ctx.fill();
  };

  const drawFrameLeftBorder = (
    fillStyle: string | CanvasGradient | CanvasPattern
  ) => {
    ctx.moveTo(...bottomLeftCorner);
    ctx.beginPath();
    ctx.lineTo(...bottomLeftInner);
    ctx.lineTo(...topLeftInner);
    ctx.lineTo(...topLeftCorner);
    ctx.lineTo(...bottomLeftCorner);
    ctx.fillStyle = fillStyle;
    ctx.fill();
  };

  // Frame shading
  const shadingX = ctx.createLinearGradient(0, 0, signWidth, 0);
  shadingX.addColorStop(0, HORIZONTAL_SHADE_COLOR);
  shadingX.addColorStop(HORIZONTAL_SHADE_SIZE, COLORS.FRAME);
  shadingX.addColorStop(1 - HORIZONTAL_SHADE_SIZE, COLORS.FRAME);
  shadingX.addColorStop(1, HORIZONTAL_SHADE_COLOR);

  const shadingY = ctx.createLinearGradient(0, 0, 0, signHeight);
  shadingY.addColorStop(0, VERTICAL_SHADE_COLOR);
  shadingY.addColorStop(VERTICAL_SHADE_SIZE, COLORS.FRAME);
  shadingY.addColorStop(1 - VERTICAL_SHADE_SIZE, COLORS.FRAME);
  shadingY.addColorStop(1, VERTICAL_SHADE_COLOR);

  drawFrameTopBorder(shadingX);
  drawFrameRightBorder(shadingY);
  drawFrameBottomBorder(shadingX);
  drawFrameLeftBorder(shadingY);

  // Horizontal frame glow
  const topGlow = ctx.createLinearGradient(0, 0, signWidth, 0);
  topGlow.addColorStop(0, hslValuesToCss(0, 0, 0, 0));
  topGlow.addColorStop(1, hslValuesToCss(0, 0, 0, 0));
  const bottomGlow = ctx.createLinearGradient(0, 0, signWidth, 0);
  bottomGlow.addColorStop(0, hslValuesToCss(0, 0, 0, 0));
  bottomGlow.addColorStop(1, hslValuesToCss(0, 0, 0, 0));

  for (let x = 0; x < pixelCountX; x++) {
    const offsetX = calcTotalOffset(x, animationOffset, pixelGrid);
    const position = calcGlowPosition(x, signWidth, pixelSize, pixelCountX);
    const disableGlow = calcDisableGlow(x, offsetX, pixelCountX);

    const topGlowHue = multiColor
      ? calcMultiColorHue(x, 0, animationFrame)
      : hueDegrees;
    const bottomGlowHue = multiColor
      ? calcMultiColorHue(x, pixelCountY - 1, animationFrame)
      : hueDegrees;

    const topGlowOpacity =
      disableGlow ?? calcPixelGlow(offsetX, 0, pixelGrid) * GLOW_OPACITY;
    const bottomGlowOpacity =
      disableGlow ??
      calcPixelGlow(offsetX, pixelCountY - 1, pixelGrid) * GLOW_OPACITY;

    topGlow.addColorStop(
      position,
      hslValuesToCss(
        topGlowHue,
        COLOR_VALUES.GLOW.saturation,
        COLOR_VALUES.GLOW.lightness,
        topGlowOpacity
      )
    );
    bottomGlow.addColorStop(
      position,
      hslValuesToCss(
        bottomGlowHue,
        COLOR_VALUES.GLOW.saturation,
        COLOR_VALUES.GLOW.lightness,
        bottomGlowOpacity
      )
    );
  }

  // Vertical frame glow
  const leftGlow = ctx.createLinearGradient(0, 0, 0, signHeight);
  leftGlow.addColorStop(0, hslValuesToCss(0, 0, 0, 0));
  leftGlow.addColorStop(1, hslValuesToCss(0, 0, 0, 0));
  const rightGlow = ctx.createLinearGradient(0, 0, 0, signHeight);
  rightGlow.addColorStop(0, hslValuesToCss(0, 0, 0, 0));
  rightGlow.addColorStop(1, hslValuesToCss(0, 0, 0, 0));

  for (let y = 0; y < pixelCountY; y++) {
    const leftOffsetX = calcTotalOffset(0, animationOffset, pixelGrid);
    const rightOffsetX = calcTotalOffset(
      pixelCountX - 1,
      animationOffset,
      pixelGrid
    );
    const position = calcGlowPosition(y, signHeight, pixelSize, pixelCountY);

    const leftGlowHue = multiColor
      ? calcMultiColorHue(0, y, animationFrame)
      : hueDegrees;
    const rightGlowHue = multiColor
      ? calcMultiColorHue(pixelCountX - 1, y, animationFrame)
      : hueDegrees;

    const leftGlowOpacity =
      calcPixelGlow(leftOffsetX, y, pixelGrid, true) * GLOW_OPACITY;
    const rightGlowOpacity =
      calcPixelGlow(rightOffsetX, y, pixelGrid, true) * GLOW_OPACITY;

    leftGlow.addColorStop(
      position,
      hslValuesToCss(
        leftGlowHue,
        COLOR_VALUES.GLOW.saturation,
        COLOR_VALUES.GLOW.lightness,
        leftGlowOpacity
      )
    );
    rightGlow.addColorStop(
      position,
      hslValuesToCss(
        rightGlowHue,
        COLOR_VALUES.GLOW.saturation,
        COLOR_VALUES.GLOW.lightness,
        rightGlowOpacity
      )
    );
  }

  // TODO: Make a softer glow. Calculate glow amount (combined light from current and surrounding pixels)?
  drawFrameTopBorder(topGlow);
  drawFrameRightBorder(rightGlow);
  drawFrameBottomBorder(bottomGlow);
  drawFrameLeftBorder(leftGlow);
};

const PIXEL_TO_LIGHT_INNER_RADIUS_RATIO = 5;
const PIXEL_TO_LIGHT_OUTER_RADIUS_RATIO = 1.8;
const PIXEL_TO_BULB_RADIUS_RATIO = 6;

export const drawDisplay = (
  ctx: CanvasRenderingContext2D,
  computedValues: SignComputedValues,
  config: SignConfig,
  animationFrame: number = 0
) => {
  const {
    displayHeight,
    displayWidth,
    displayPaddingX,
    displayPaddingY,
    pixelSize,
    pixelCountX,
    pixelCountY,
    pixelGrid,
  } = computedValues;
  const { hueDegrees, multiColor, animationFramesPerUpdate } = config;

  const animationOffset = calcAnimationOffset(
    animationFrame,
    animationFramesPerUpdate
  );

  ctx.clearRect(0, 0, displayWidth, displayHeight);

  for (let x = 0; x < pixelCountX; x++) {
    const offsetX = calcTotalOffset(x, animationOffset, pixelGrid);
    const pixelX = displayPaddingX + x * pixelSize;
    const pixelCenterX = pixelX + pixelSize / 2;

    for (let y = 0; y < pixelCountY; y++) {
      const pixelHue = multiColor
        ? calcMultiColorHue(x, y, animationFrame)
        : hueDegrees;
      const pixelOn = isPixelOn(offsetX, y, pixelGrid);
      const pixelY = displayPaddingY + y * pixelSize;
      const pixelCenterY = pixelY + pixelSize / 2;
      const bulbColor = pixelOn ? COLOR_VALUES.BULB_ON : COLOR_VALUES.BULB_OFF;

      // Light gradient
      if (pixelOn) {
        const grd = ctx.createRadialGradient(
          pixelCenterX,
          pixelCenterY,
          pixelSize / PIXEL_TO_LIGHT_INNER_RADIUS_RATIO,
          pixelCenterX,
          pixelCenterY,
          pixelSize / PIXEL_TO_LIGHT_OUTER_RADIUS_RATIO
        );
        grd.addColorStop(
          0,
          hslValuesToCss(
            pixelHue,
            COLOR_VALUES.LIGHT.saturation,
            COLOR_VALUES.LIGHT.lightness
          )
        );
        grd.addColorStop(1, hslValuesToCss(0, 0, 0, 0));
        ctx.fillStyle = grd;
        ctx.fillRect(pixelX, pixelY, pixelSize, pixelSize);
      }

      // Light bulb
      ctx.fillStyle = hslValuesToCss(
        pixelHue,
        bulbColor.saturation,
        bulbColor.lightness
      );
      ctx.beginPath();
      ctx.arc(
        pixelCenterX,
        pixelCenterY,
        pixelSize / PIXEL_TO_BULB_RADIUS_RATIO,
        0,
        2 * Math.PI
      );
      ctx.fill();
    }
  }
};

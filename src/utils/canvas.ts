import { COLORS, COLOR_VALUES } from "../constants/colors";
import {
  hslValuesToCss,
  calcAnimationOffset,
  calcTotalOffset,
  isPixelOn,
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
  COLOR_VALUES.FRAME.lightness + 10
);
const VERTICAL_SHADE_COLOR = hslValuesToCss(
  COLOR_VALUES.FRAME.hue,
  COLOR_VALUES.FRAME.saturation,
  COLOR_VALUES.FRAME.lightness - 10
);
const HORIZONTAL_SHADE_SIZE = 0.3;
const VERTICAL_SHADE_SIZE = 0.4;

export const drawFrame = (
  ctx: CanvasRenderingContext2D,
  computedValues: SignComputedValues,
  config: SignConfig,
  animationFrame: number = 0
) => {
  const { signHeight, signWidth, frameSize } = computedValues;

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

  const hGrd = ctx.createLinearGradient(0, 0, signWidth, 0);
  hGrd.addColorStop(0, HORIZONTAL_SHADE_COLOR);
  hGrd.addColorStop(HORIZONTAL_SHADE_SIZE, COLORS.FRAME);
  hGrd.addColorStop(1 - HORIZONTAL_SHADE_SIZE, COLORS.FRAME);
  hGrd.addColorStop(1, HORIZONTAL_SHADE_COLOR);

  const vGrd = ctx.createLinearGradient(0, 0, 0, signHeight);
  vGrd.addColorStop(0, VERTICAL_SHADE_COLOR);
  vGrd.addColorStop(VERTICAL_SHADE_SIZE, COLORS.FRAME);
  vGrd.addColorStop(1 - VERTICAL_SHADE_SIZE, COLORS.FRAME);
  vGrd.addColorStop(1, VERTICAL_SHADE_COLOR);

  // Top border
  ctx.moveTo(...topLeftCorner);
  ctx.beginPath();
  ctx.lineTo(...topLeftInner);
  ctx.lineTo(...topRightInner);
  ctx.lineTo(...topRightCorner);
  ctx.lineTo(...topLeftCorner);
  ctx.fillStyle = hGrd;
  ctx.fill();

  // Right border
  ctx.moveTo(...topRightCorner);
  ctx.beginPath();
  ctx.lineTo(...topRightInner);
  ctx.lineTo(...bottomRightInner);
  ctx.lineTo(...bottomRightCorner);
  ctx.lineTo(...topRightCorner);
  ctx.fillStyle = vGrd;
  ctx.fill();

  // Bottom border
  ctx.moveTo(...bottomRightCorner);
  ctx.beginPath();
  ctx.lineTo(...bottomRightInner);
  ctx.lineTo(...bottomLeftInner);
  ctx.lineTo(...bottomLeftCorner);
  ctx.lineTo(...bottomRightCorner);
  ctx.fillStyle = hGrd;
  ctx.fill();

  // Left border
  ctx.moveTo(...bottomLeftCorner);
  ctx.beginPath();
  ctx.lineTo(...bottomLeftInner);
  ctx.lineTo(...topLeftInner);
  ctx.lineTo(...topLeftCorner);
  ctx.lineTo(...bottomLeftCorner);
  ctx.fillStyle = vGrd;
  ctx.fill();

  // TODO: Add glow from letters
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
  const { hueDegrees, animationFramesPerUpdate, partyMode } = config;

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
      const pixelHue = partyMode ? (animationFrame + x + y) % 360 : hueDegrees;
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

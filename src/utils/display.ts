import { CanvasChunk, SignColors, SignComputedValues } from "~/types";
import {
  getCanvasContext,
  isPixelOn,
  hslValuesToCss,
  getPixelHue,
} from "~/utils";

const PIXEL_TO_BULB_RADIUS_RATIO = 6;

export const drawDisplayOffLights = (
  ctx: CanvasRenderingContext2D,
  computedValues: SignComputedValues,
  colors: SignColors
) => {
  const {
    displayWidth,
    displayHeight,
    displayPaddingX,
    displayPaddingY,
    pixelSize,
    pixelCountX,
    pixelCountY,
  } = computedValues;

  ctx.clearRect(0, 0, displayWidth, displayHeight);
  ctx.fillStyle = colors.background.color;
  ctx.fillRect(0, 0, displayWidth, displayHeight);

  for (let x = 0; x < pixelCountX; x++) {
    const pixelXPos = x * pixelSize + displayPaddingX;
    const pixelXCenterPos = pixelXPos + pixelSize / 2;

    for (let y = 0; y < pixelCountY; y++) {
      const pixelYPos = y * pixelSize + displayPaddingY;
      const pixelYCenterPos = pixelYPos + pixelSize / 2;

      ctx.fillStyle = colors.bulbOff.color;
      ctx.beginPath();
      ctx.arc(
        pixelXCenterPos,
        pixelYCenterPos,
        pixelSize / PIXEL_TO_BULB_RADIUS_RATIO,
        0,
        2 * Math.PI
      );
      ctx.fill();
    }
  }
};

const PIXEL_TO_LIGHT_INNER_RADIUS_RATIO = 5;
const PIXEL_TO_LIGHT_OUTER_RADIUS_RATIO = 2;

export const drawDisplayOnLights = (
  canvasChunks: CanvasChunk[],
  computedValues: SignComputedValues,
  colors: SignColors
) => {
  const { pixelSize, pixelCountY, pixelGrid, pixelAreaHeight } = computedValues;

  let chunkIdx = -1;
  let ctx = null;

  for (let x = 0; x < pixelGrid.length; x++) {
    const pixelXPos = x * pixelSize;

    if (!ctx || pixelXPos >= canvasChunks[chunkIdx].end) {
      ctx = getCanvasContext(canvasChunks[++chunkIdx].id, true);

      if (ctx) {
        ctx.clearRect(
          0,
          0,
          canvasChunks[chunkIdx].end - canvasChunks[chunkIdx].start,
          pixelAreaHeight
        );
      }
    }

    if (ctx) {
      const chunkPixelXPos = pixelXPos - canvasChunks[chunkIdx].start;
      const pixelXCenterPos = chunkPixelXPos + pixelSize / 2;

      for (let y = 0; y < pixelCountY; y++) {
        const pixelOn = isPixelOn(x, y, pixelGrid);
        const pixelHue = getPixelHue(x, y, pixelGrid);
        const pixelYPos = y * pixelSize;
        const pixelYCenterPos = pixelYPos + pixelSize / 2;

        if (pixelOn) {
          const grd = ctx.createRadialGradient(
            pixelXCenterPos,
            pixelYCenterPos,
            pixelSize / PIXEL_TO_LIGHT_INNER_RADIUS_RATIO,
            pixelXCenterPos,
            pixelYCenterPos,
            pixelSize / PIXEL_TO_LIGHT_OUTER_RADIUS_RATIO
          );
          grd.addColorStop(
            0,
            hslValuesToCss(
              pixelHue,
              colors.light.saturation,
              colors.light.lightness
            )
          );
          grd.addColorStop(1, colors.background.color);
          ctx.fillStyle = grd;
          ctx.fillRect(chunkPixelXPos, pixelYPos, pixelSize, pixelSize);

          ctx.fillStyle = hslValuesToCss(
            pixelHue,
            colors.bulbOn.saturation,
            colors.bulbOn.lightness
          );
          ctx.beginPath();
          ctx.arc(
            pixelXCenterPos,
            pixelYCenterPos,
            pixelSize / PIXEL_TO_BULB_RADIUS_RATIO,
            0,
            2 * Math.PI
          );
          ctx.fill();
        }
      }
    }
  }
};

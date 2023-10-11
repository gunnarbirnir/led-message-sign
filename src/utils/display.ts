import { COLORS, COLOR_VALUES } from "../constants/colors";
import { hslValuesToCss, isPixelOn } from "../utils";
import { SignComputedValues, SignConfig, CanvasChunk } from "../types";
import { getCanvasContext } from "./canvas";

const PIXEL_TO_BULB_RADIUS_RATIO = 6;

export const drawDisplayOffLights = (
  ctx: CanvasRenderingContext2D,
  computedValues: SignComputedValues,
  config: SignConfig
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
  const { colorHue, coloredOffLights } = config;

  ctx.clearRect(0, 0, displayWidth, displayHeight);
  ctx.fillStyle = COLORS.BACKGROUND;
  ctx.fillRect(0, 0, displayWidth, displayHeight);

  const bulbOffColorSaturation = coloredOffLights
    ? COLOR_VALUES.BULB_OFF.saturation
    : 0;

  for (let x = 0; x < pixelCountX; x++) {
    const pixelXPos = x * pixelSize + displayPaddingX;
    const pixelXCenterPos = pixelXPos + pixelSize / 2;

    for (let y = 0; y < pixelCountY; y++) {
      const pixelYPos = y * pixelSize + displayPaddingY;
      const pixelYCenterPos = pixelYPos + pixelSize / 2;

      ctx.fillStyle = hslValuesToCss(
        colorHue,
        bulbOffColorSaturation,
        COLOR_VALUES.BULB_OFF.lightness
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
};

const PIXEL_TO_LIGHT_INNER_RADIUS_RATIO = 5;
const PIXEL_TO_LIGHT_OUTER_RADIUS_RATIO = 2;

export const drawDisplayOnLights = (
  canvasChunks: CanvasChunk[],
  computedValues: SignComputedValues,
  config: SignConfig
) => {
  const { pixelSize, pixelCountY, pixelGrid, pixelAreaHeight } = computedValues;
  const { colorHue } = config;

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
              colorHue,
              COLOR_VALUES.LIGHT.saturation,
              COLOR_VALUES.LIGHT.lightness
            )
          );
          grd.addColorStop(1, COLORS.BACKGROUND);
          ctx.fillStyle = grd;
          ctx.fillRect(chunkPixelXPos, pixelYPos, pixelSize, pixelSize);

          ctx.fillStyle = hslValuesToCss(
            colorHue,
            COLOR_VALUES.BULB_ON.saturation,
            COLOR_VALUES.BULB_ON.lightness
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

import { COLORS, COLOR_VALUES } from "../constants/colors";
import { hslValuesToCss, isPixelOn } from "../utils";
import {
  SignComputedValues,
  Tuple,
  SignConfig,
  FillStyle,
  CanvasChunk,
} from "../types";
import { getCanvasContext } from "./canvas";

const getFrameUtils = (
  ctx: CanvasRenderingContext2D,
  computedValues: SignComputedValues
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

  const drawFrameTopBorder = (fillStyle: FillStyle) => {
    ctx.moveTo(...topLeftCorner);
    ctx.beginPath();
    ctx.lineTo(...topLeftInner);
    ctx.lineTo(...topRightInner);
    ctx.lineTo(...topRightCorner);
    ctx.lineTo(...topLeftCorner);
    ctx.fillStyle = fillStyle;
    ctx.fill();
  };

  const drawFrameRightBorder = (fillStyle: FillStyle) => {
    ctx.moveTo(...topRightCorner);
    ctx.beginPath();
    ctx.lineTo(...topRightInner);
    ctx.lineTo(...bottomRightInner);
    ctx.lineTo(...bottomRightCorner);
    ctx.lineTo(...topRightCorner);
    ctx.fillStyle = fillStyle;
    ctx.fill();
  };

  const drawFrameBottomBorder = (fillStyle: FillStyle) => {
    ctx.moveTo(...bottomRightCorner);
    ctx.beginPath();
    ctx.lineTo(...bottomRightInner);
    ctx.lineTo(...bottomLeftInner);
    ctx.lineTo(...bottomLeftCorner);
    ctx.lineTo(...bottomRightCorner);
    ctx.fillStyle = fillStyle;
    ctx.fill();
  };

  const drawFrameLeftBorder = (fillStyle: FillStyle) => {
    ctx.moveTo(...bottomLeftCorner);
    ctx.beginPath();
    ctx.lineTo(...bottomLeftInner);
    ctx.lineTo(...topLeftInner);
    ctx.lineTo(...topLeftCorner);
    ctx.lineTo(...bottomLeftCorner);
    ctx.fillStyle = fillStyle;
    ctx.fill();
  };

  return {
    drawFrameTopBorder,
    drawFrameRightBorder,
    drawFrameBottomBorder,
    drawFrameLeftBorder,
  };
};

const MASKING_GRADIENT_POSITION = 0.2;
const TRANSPARENT_FRAME_COLOR = hslValuesToCss(
  COLOR_VALUES.FRAME.hue,
  COLOR_VALUES.FRAME.saturation,
  COLOR_VALUES.FRAME.lightness,
  0
);

const addMaskingColorStops = (gradient: CanvasGradient) => {
  gradient.addColorStop(MASKING_GRADIENT_POSITION, COLORS.FRAME);
  gradient.addColorStop(1, TRANSPARENT_FRAME_COLOR);
};

const addGlowMaskingColorStops = (
  gradient: CanvasGradient,
  start: number,
  end: number
) => {
  gradient.addColorStop(start, COLORS.FRAME);
  gradient.addColorStop(end, TRANSPARENT_FRAME_COLOR);
  gradient.addColorStop(1 - end, TRANSPARENT_FRAME_COLOR);
  gradient.addColorStop(1 - start, COLORS.FRAME);
};

export const drawFrameMasking = (
  ctx: CanvasRenderingContext2D,
  computedValues: SignComputedValues
) => {
  const {
    signHeight,
    signWidth,
    frameSize,
    displayPaddingX,
    displayPaddingY,
    pixelSize,
  } = computedValues;
  const {
    drawFrameTopBorder,
    drawFrameRightBorder,
    drawFrameBottomBorder,
    drawFrameLeftBorder,
  } = getFrameUtils(ctx, computedValues);

  ctx.clearRect(0, 0, signWidth, signHeight);

  const maskingTop = ctx.createLinearGradient(0, 0, 0, frameSize);
  addMaskingColorStops(maskingTop);

  const maskingRight = ctx.createLinearGradient(
    signWidth,
    0,
    signWidth - frameSize,
    0
  );
  addMaskingColorStops(maskingRight);

  const maskingBottom = ctx.createLinearGradient(
    signWidth,
    signHeight,
    signWidth,
    signHeight - frameSize
  );
  addMaskingColorStops(maskingBottom);

  const maskingLeft = ctx.createLinearGradient(0, 0, frameSize, 0);
  addMaskingColorStops(maskingLeft);

  drawFrameTopBorder(maskingTop);
  drawFrameRightBorder(maskingRight);
  drawFrameBottomBorder(maskingBottom);
  drawFrameLeftBorder(maskingLeft);

  const glowMaskingX = ctx.createLinearGradient(0, 0, signWidth, 0);
  const glowMaskingXStart = (frameSize + displayPaddingX) / signWidth;
  const glowMaskingXEnd = glowMaskingXStart + pixelSize / signWidth;
  addGlowMaskingColorStops(glowMaskingX, glowMaskingXStart, glowMaskingXEnd);

  const glowMaskingY = ctx.createLinearGradient(0, 0, 0, signHeight);
  const glowMaskingYStart = (frameSize + displayPaddingY) / signHeight;
  const glowMaskingYEnd = glowMaskingYStart + pixelSize / signHeight;
  addGlowMaskingColorStops(glowMaskingY, glowMaskingYStart, glowMaskingYEnd);

  drawFrameTopBorder(glowMaskingX);
  drawFrameRightBorder(glowMaskingY);
  drawFrameBottomBorder(glowMaskingX);
  drawFrameLeftBorder(glowMaskingY);
};

const FRAME_SHADING_OPACITY = 0.7;
const FRAME_SHADE_COLOR = hslValuesToCss(
  COLOR_VALUES.FRAME.hue,
  COLOR_VALUES.FRAME.saturation,
  COLOR_VALUES.FRAME.lightness,
  FRAME_SHADING_OPACITY
);
const HORIZONTAL_SHADE_COLOR = hslValuesToCss(
  COLOR_VALUES.FRAME.hue,
  COLOR_VALUES.FRAME.saturation,
  COLOR_VALUES.FRAME.lightness + 5,
  FRAME_SHADING_OPACITY
);
const VERTICAL_SHADE_COLOR = hslValuesToCss(
  COLOR_VALUES.FRAME.hue,
  COLOR_VALUES.FRAME.saturation,
  COLOR_VALUES.FRAME.lightness - 10,
  FRAME_SHADING_OPACITY
);
const HORIZONTAL_SHADE_SIZE = 0.2;
const VERTICAL_SHADE_SIZE = 0.4;

const addShadingColorStops = (
  gradient: CanvasGradient,
  shadeColor: string,
  shadeSize: number
) => {
  gradient.addColorStop(0, shadeColor);
  gradient.addColorStop(shadeSize, FRAME_SHADE_COLOR);
  gradient.addColorStop(1 - shadeSize, FRAME_SHADE_COLOR);
  gradient.addColorStop(1, shadeColor);
};

export const drawFrameShading = (
  ctx: CanvasRenderingContext2D,
  computedValues: SignComputedValues
) => {
  const { signHeight, signWidth } = computedValues;
  const {
    drawFrameTopBorder,
    drawFrameRightBorder,
    drawFrameBottomBorder,
    drawFrameLeftBorder,
  } = getFrameUtils(ctx, computedValues);

  ctx.clearRect(0, 0, signWidth, signHeight);

  const shadingX = ctx.createLinearGradient(0, 0, signWidth, 0);
  addShadingColorStops(shadingX, HORIZONTAL_SHADE_COLOR, HORIZONTAL_SHADE_SIZE);

  const shadingY = ctx.createLinearGradient(0, 0, 0, signHeight);
  addShadingColorStops(shadingY, VERTICAL_SHADE_COLOR, VERTICAL_SHADE_SIZE);

  drawFrameTopBorder(shadingX);
  drawFrameRightBorder(shadingY);
  drawFrameBottomBorder(shadingX);
  drawFrameLeftBorder(shadingY);
};

export const drawFrameHorizontalGlow = (
  canvasChunks: CanvasChunk[],
  computedValues: SignComputedValues,
  config: SignConfig
) => {
  const { signHeight, pixelSize, pixelCountY, pixelGrid, frameSize } =
    computedValues;
  const { colorHue } = config;

  let chunkIdx = -1;
  let ctx = null;
  let topGlow = null;
  let bottomGlow = null;
  let prevTopGlow = null;
  let prevBottomGlow = null;

  for (let x = 0; x < pixelGrid.length; x++) {
    const pixelXPos = x * pixelSize;

    if (!ctx || pixelXPos >= canvasChunks[chunkIdx].end) {
      if (ctx && topGlow && bottomGlow) {
        topGlow.addColorStop(
          1,
          hslValuesToCss(
            colorHue,
            COLOR_VALUES.GLOW.saturation,
            COLOR_VALUES.GLOW.lightness,
            prevTopGlow ?? 0
          )
        );
        ctx.fillStyle = topGlow;
        ctx.fillRect(
          0,
          0,
          canvasChunks[chunkIdx].end - canvasChunks[chunkIdx].start,
          frameSize
        );

        bottomGlow.addColorStop(
          1,
          hslValuesToCss(
            colorHue,
            COLOR_VALUES.GLOW.saturation,
            COLOR_VALUES.GLOW.lightness,
            prevBottomGlow ?? 0
          )
        );
        ctx.fillStyle = bottomGlow;
        ctx.fillRect(
          0,
          signHeight - frameSize,
          canvasChunks[chunkIdx].end - canvasChunks[chunkIdx].start,
          frameSize
        );
      }

      ctx = getCanvasContext(canvasChunks[++chunkIdx].id, true);

      if (ctx) {
        // Clear canvas
        ctx.clearRect(
          0,
          0,
          canvasChunks[chunkIdx].end - canvasChunks[chunkIdx].start,
          signHeight
        );

        // Horizontal frame glow
        topGlow = ctx.createLinearGradient(
          0,
          0,
          canvasChunks[chunkIdx].end - canvasChunks[chunkIdx].start,
          0
        );
        topGlow.addColorStop(
          0,
          hslValuesToCss(
            colorHue,
            COLOR_VALUES.GLOW.saturation,
            COLOR_VALUES.GLOW.lightness,
            prevTopGlow ?? 0
          )
        );

        bottomGlow = ctx.createLinearGradient(
          0,
          0,
          canvasChunks[chunkIdx].end - canvasChunks[chunkIdx].start,
          0
        );
        bottomGlow.addColorStop(
          0,
          hslValuesToCss(
            colorHue,
            COLOR_VALUES.GLOW.saturation,
            COLOR_VALUES.GLOW.lightness,
            prevBottomGlow ?? 0
          )
        );
      }
    }

    if (ctx && topGlow && bottomGlow) {
      const chunkPixelXPos = pixelXPos - canvasChunks[chunkIdx].start;
      const pixelXCenterPos = chunkPixelXPos + pixelSize / 2;
      const position =
        pixelXCenterPos /
        (canvasChunks[chunkIdx].end - canvasChunks[chunkIdx].start);
      const topPixelOn = isPixelOn(x, 0, pixelGrid);
      const secondTopPixelOn = isPixelOn(x, 1, pixelGrid);
      // TODO: Create constants
      prevTopGlow = topPixelOn ? 1 : secondTopPixelOn ? 0.5 : 0;
      const bottomPixelOn = isPixelOn(x, pixelCountY - 1, pixelGrid);
      const secondBottomPixelOn = isPixelOn(x, pixelCountY - 2, pixelGrid);
      prevBottomGlow = bottomPixelOn ? 1 : secondBottomPixelOn ? 0.5 : 0;

      topGlow.addColorStop(
        position,
        hslValuesToCss(
          colorHue,
          COLOR_VALUES.GLOW.saturation,
          COLOR_VALUES.GLOW.lightness,
          prevTopGlow
        )
      );
      bottomGlow.addColorStop(
        position,
        hslValuesToCss(
          colorHue,
          COLOR_VALUES.GLOW.saturation,
          COLOR_VALUES.GLOW.lightness,
          prevBottomGlow
        )
      );
    }
  }

  // TODO: Refactor
  if (ctx && topGlow && bottomGlow) {
    topGlow.addColorStop(
      1,
      hslValuesToCss(
        colorHue,
        COLOR_VALUES.GLOW.saturation,
        COLOR_VALUES.GLOW.lightness,
        0
      )
    );
    ctx.fillStyle = topGlow;
    ctx.fillRect(
      0,
      0,
      canvasChunks[chunkIdx].end - canvasChunks[chunkIdx].start,
      frameSize
    );

    bottomGlow.addColorStop(
      1,
      hslValuesToCss(
        colorHue,
        COLOR_VALUES.GLOW.saturation,
        COLOR_VALUES.GLOW.lightness,
        0
      )
    );
    ctx.fillStyle = bottomGlow;
    ctx.fillRect(
      0,
      signHeight - frameSize,
      canvasChunks[chunkIdx].end - canvasChunks[chunkIdx].start,
      frameSize
    );
  }
};

export const drawFrameVerticalGlow = (
  canvasChunks: CanvasChunk[],
  computedValues: SignComputedValues,
  config: SignConfig,
  side: "left" | "right" = "left"
) => {
  const {
    pixelSize,
    pixelCountX,
    pixelCountY,
    pixelGrid,
    frameSize,
    pixelAreaHeight,
  } = computedValues;
  const { colorHue } = config;

  let chunkIdx = -1;
  let ctx = null;
  let glow = null;

  for (let x = 0; x < pixelGrid.length; x++) {
    const currentXPos = x * frameSize;

    if (!ctx || currentXPos >= canvasChunks[chunkIdx].end) {
      ctx = getCanvasContext(canvasChunks[++chunkIdx].id, true);

      if (ctx) {
        // Clear canvas
        ctx.clearRect(
          0,
          0,
          canvasChunks[chunkIdx].end - canvasChunks[chunkIdx].start,
          pixelAreaHeight
        );
      }
    }

    if (ctx) {
      const chunkXPos = currentXPos - canvasChunks[chunkIdx].start;

      glow = ctx.createLinearGradient(chunkXPos, 0, chunkXPos, pixelAreaHeight);
      glow.addColorStop(
        0,
        hslValuesToCss(
          colorHue,
          COLOR_VALUES.GLOW.saturation,
          COLOR_VALUES.GLOW.lightness,
          0
        )
      );

      for (let y = 0; y < pixelCountY; y++) {
        const pixelYPos = y * pixelSize;
        const pixelYCenterPos = pixelYPos + pixelSize / 2;
        const position = pixelYCenterPos / pixelAreaHeight;
        const isCurrentPixelOn =
          side === "right"
            ? // TODO: Look into edge cases
              x <= pixelGrid.length - pixelCountX &&
              isPixelOn(x + pixelCountX - 1, y, pixelGrid)
            : isPixelOn(x, y, pixelGrid);
        const isNextPixelOn =
          side === "right"
            ? x <= pixelGrid.length - pixelCountX + 1 &&
              isPixelOn(x + pixelCountX - 2, y, pixelGrid)
            : x < pixelGrid.length - 1 && isPixelOn(x + 1, y, pixelGrid);

        glow.addColorStop(
          position,
          hslValuesToCss(
            colorHue,
            COLOR_VALUES.GLOW.saturation,
            COLOR_VALUES.GLOW.lightness,
            isCurrentPixelOn ? 1 : isNextPixelOn ? 0.5 : 0
          )
        );
      }

      glow.addColorStop(
        1,
        hslValuesToCss(
          colorHue,
          COLOR_VALUES.GLOW.saturation,
          COLOR_VALUES.GLOW.lightness,
          0
        )
      );
      ctx.fillStyle = glow;
      ctx.fillRect(chunkXPos, 0, frameSize, pixelAreaHeight);
    }
  }
};

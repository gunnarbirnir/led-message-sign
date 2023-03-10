import { COLORS, COLOR_VALUES } from "../constants/colors";
import {
  hslValuesToCss,
  calcTotalOffset,
  isPixelOn,
  calcPixelXPos,
  calcPixelXCenterPos,
  calcPixelYPos,
  calcPixelYCenterPos,
  calcGlowPosition,
  calcDisableGlow,
  calcPixelGlow,
} from "../utils";
import {
  SignComputedValues,
  Tuple,
  SignConfig,
  FillStyle,
  CanvasImageChunk,
} from "../types";

export const getCanvasContext = (id: string, alpha: boolean = false) => {
  const canvas = document.getElementById(id) as HTMLCanvasElement;
  const ctx = canvas ? canvas.getContext("2d", { alpha }) : null;

  return ctx;
};

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

export const drawFrameGlow = (
  ctx: CanvasRenderingContext2D,
  computedValues: SignComputedValues,
  config: SignConfig,
  animationOffset: number = 0
) => {
  const {
    signHeight,
    signWidth,
    pixelSize,
    pixelCountX,
    pixelCountY,
    pixelGrid,
  } = computedValues;
  const { colorHue } = config;
  const {
    drawFrameTopBorder,
    drawFrameRightBorder,
    drawFrameBottomBorder,
    drawFrameLeftBorder,
  } = getFrameUtils(ctx, computedValues);

  ctx.clearRect(0, 0, signWidth, signHeight);

  // Horizontal frame glow
  const topGlow = ctx.createLinearGradient(0, 0, signWidth, 0);
  topGlow.addColorStop(0, COLORS.TRANSPARENT);
  topGlow.addColorStop(1, COLORS.TRANSPARENT);
  const bottomGlow = ctx.createLinearGradient(0, 0, signWidth, 0);
  bottomGlow.addColorStop(0, COLORS.TRANSPARENT);
  bottomGlow.addColorStop(1, COLORS.TRANSPARENT);

  for (let x = 0; x < pixelCountX; x++) {
    const offsetX = calcTotalOffset(x, animationOffset, pixelGrid);
    const position = calcGlowPosition(x, signWidth, pixelSize, pixelCountX);
    const disableGlow = calcDisableGlow(x, offsetX, pixelCountX);
    const topGlowOpacity = disableGlow ?? calcPixelGlow(offsetX, 0, pixelGrid);
    const bottomGlowOpacity =
      disableGlow ?? calcPixelGlow(offsetX, pixelCountY - 1, pixelGrid);

    topGlow.addColorStop(
      position,
      hslValuesToCss(
        colorHue,
        COLOR_VALUES.GLOW.saturation,
        COLOR_VALUES.GLOW.lightness,
        topGlowOpacity
      )
    );
    bottomGlow.addColorStop(
      position,
      hslValuesToCss(
        colorHue,
        COLOR_VALUES.GLOW.saturation,
        COLOR_VALUES.GLOW.lightness,
        bottomGlowOpacity
      )
    );
  }

  // Vertical frame glow
  const leftGlow = ctx.createLinearGradient(0, 0, 0, signHeight);
  leftGlow.addColorStop(0, COLORS.TRANSPARENT);
  leftGlow.addColorStop(1, COLORS.TRANSPARENT);
  const rightGlow = ctx.createLinearGradient(0, 0, 0, signHeight);
  rightGlow.addColorStop(0, COLORS.TRANSPARENT);
  rightGlow.addColorStop(1, COLORS.TRANSPARENT);

  for (let y = 0; y < pixelCountY; y++) {
    const leftOffsetX = calcTotalOffset(0, animationOffset, pixelGrid);
    const rightOffsetX = calcTotalOffset(
      pixelCountX - 1,
      animationOffset,
      pixelGrid
    );
    const position = calcGlowPosition(y, signHeight, pixelSize, pixelCountY);
    const leftGlowOpacity = calcPixelGlow(leftOffsetX, y, pixelGrid, true);
    const rightGlowOpacity = calcPixelGlow(rightOffsetX, y, pixelGrid, true);

    leftGlow.addColorStop(
      position,
      hslValuesToCss(
        colorHue,
        COLOR_VALUES.GLOW.saturation,
        COLOR_VALUES.GLOW.lightness,
        leftGlowOpacity
      )
    );
    rightGlow.addColorStop(
      position,
      hslValuesToCss(
        colorHue,
        COLOR_VALUES.GLOW.saturation,
        COLOR_VALUES.GLOW.lightness,
        rightGlowOpacity
      )
    );
  }

  drawFrameTopBorder(topGlow);
  drawFrameRightBorder(rightGlow);
  drawFrameBottomBorder(bottomGlow);
  drawFrameLeftBorder(leftGlow);
};

const MASKING_GRADIENT_POSITION = 0.2;

export const drawFrameMasking = (
  ctx: CanvasRenderingContext2D,
  computedValues: SignComputedValues
) => {
  const { signHeight, signWidth, frameSize } = computedValues;
  const {
    drawFrameTopBorder,
    drawFrameRightBorder,
    drawFrameBottomBorder,
    drawFrameLeftBorder,
  } = getFrameUtils(ctx, computedValues);

  ctx.clearRect(0, 0, signWidth, signHeight);

  const maskingTop = ctx.createLinearGradient(0, 0, 0, frameSize);
  maskingTop.addColorStop(MASKING_GRADIENT_POSITION, COLORS.FRAME);
  maskingTop.addColorStop(1, COLORS.TRANSPARENT);

  const maskingRight = ctx.createLinearGradient(
    signWidth,
    0,
    signWidth - frameSize,
    0
  );
  maskingRight.addColorStop(MASKING_GRADIENT_POSITION, COLORS.FRAME);
  maskingRight.addColorStop(1, COLORS.TRANSPARENT);

  const maskingBottom = ctx.createLinearGradient(
    signWidth,
    signHeight,
    signWidth,
    signHeight - frameSize
  );
  maskingBottom.addColorStop(MASKING_GRADIENT_POSITION, COLORS.FRAME);
  maskingBottom.addColorStop(1, COLORS.TRANSPARENT);

  const maskingLeft = ctx.createLinearGradient(0, 0, frameSize, 0);
  maskingLeft.addColorStop(MASKING_GRADIENT_POSITION, COLORS.FRAME);
  maskingLeft.addColorStop(1, COLORS.TRANSPARENT);

  drawFrameTopBorder(maskingTop);
  drawFrameRightBorder(maskingRight);
  drawFrameBottomBorder(maskingBottom);
  drawFrameLeftBorder(maskingLeft);
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
const HORIZONTAL_SHADE_SIZE = 0.3;
const VERTICAL_SHADE_SIZE = 0.4;

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
  shadingX.addColorStop(0, HORIZONTAL_SHADE_COLOR);
  shadingX.addColorStop(HORIZONTAL_SHADE_SIZE, FRAME_SHADE_COLOR);
  shadingX.addColorStop(1 - HORIZONTAL_SHADE_SIZE, FRAME_SHADE_COLOR);
  shadingX.addColorStop(1, HORIZONTAL_SHADE_COLOR);

  const shadingY = ctx.createLinearGradient(0, 0, 0, signHeight);
  shadingY.addColorStop(0, VERTICAL_SHADE_COLOR);
  shadingY.addColorStop(VERTICAL_SHADE_SIZE, FRAME_SHADE_COLOR);
  shadingY.addColorStop(1 - VERTICAL_SHADE_SIZE, FRAME_SHADE_COLOR);
  shadingY.addColorStop(1, VERTICAL_SHADE_COLOR);

  drawFrameTopBorder(shadingX);
  drawFrameRightBorder(shadingY);
  drawFrameBottomBorder(shadingX);
  drawFrameLeftBorder(shadingY);
};

const PIXEL_TO_LIGHT_INNER_RADIUS_RATIO = 5;
const PIXEL_TO_LIGHT_OUTER_RADIUS_RATIO = 2;
const IMAGE_CHUNK_SIZE = 4000;

export const getOnLightsImageChunks = (
  computedValues: SignComputedValues,
  config: SignConfig
) => {
  const { pixelSize, pixelCountY, pixelGrid, pixelAreaHeight, imageWidth } =
    computedValues;
  const { colorHue } = config;
  const imageChunks: CanvasImageChunk[] = [];

  const pixelsPerChunk = Math.floor(IMAGE_CHUNK_SIZE / pixelSize);
  const chunkWidth = pixelsPerChunk * pixelSize;
  const chunkCount = Math.ceil(imageWidth / chunkWidth);

  if (!chunkCount) {
    return [];
  }

  for (let i = 0; i < chunkCount; i++) {
    const xStart = i * pixelsPerChunk;
    const xEnd = Math.min(xStart + pixelsPerChunk, pixelGrid.length);
    const start = xStart * pixelSize;
    const end = xEnd * pixelSize;

    const canvas = document.createElement("canvas");
    canvas.height = pixelAreaHeight;
    canvas.width = end - start;
    imageChunks.push({ canvas, start, end });
  }

  let chunkIdx = 0;
  let ctx = imageChunks[0].canvas.getContext("2d", { alpha: true });

  for (let x = 0; x < pixelGrid.length; x++) {
    const pixelXPos = calcPixelXPos(x, pixelSize, 0);

    if (pixelXPos >= imageChunks[chunkIdx].end) {
      ctx = imageChunks[++chunkIdx].canvas.getContext("2d", { alpha: true });
    }

    if (ctx) {
      const chunkPixelXPos = pixelXPos - imageChunks[chunkIdx].start;
      const pixelXCenterPos = calcPixelXCenterPos(chunkPixelXPos, pixelSize);

      for (let y = 0; y < pixelCountY; y++) {
        const pixelOn = isPixelOn(x, y, pixelGrid);
        const pixelYPos = calcPixelYPos(y, pixelSize, 0);
        const pixelYCenterPos = calcPixelYCenterPos(pixelYPos, pixelSize);

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

  return imageChunks;
};

export const drawDisplayOnLights = (
  ctx: CanvasRenderingContext2D,
  computedValues: SignComputedValues,
  animationOffset: number = 0,
  onLightsImageChunks: CanvasImageChunk[]
) => {
  const {
    displayHeight,
    displayWidth,
    pixelSize,
    pixelAreaHeight,
    pixelAreaWidth,
    displayPaddingX,
    displayPaddingY,
    pixelGrid,
    imageWidth,
  } = computedValues;

  const imageOffset = pixelSize * (animationOffset % pixelGrid.length);
  const imageSliceWidth = Math.min(pixelAreaWidth, imageWidth - imageOffset);
  const sliceEnd = imageOffset + imageSliceWidth;

  ctx.clearRect(0, 0, displayWidth, displayHeight);

  onLightsImageChunks.forEach((chunk) => {
    const chunkSliceWidth =
      Math.min(chunk.end, sliceEnd) - Math.max(chunk.start, imageOffset);

    if (chunkSliceWidth > 0) {
      const chunkOffset = Math.max(0, imageOffset - chunk.start);
      const chunkXPos =
        displayPaddingX + Math.max(0, chunk.start - imageOffset);

      ctx.drawImage(
        chunk.canvas,
        chunkOffset,
        0,
        chunkSliceWidth,
        pixelAreaHeight,
        chunkXPos,
        displayPaddingY,
        chunkSliceWidth,
        pixelAreaHeight
      );
    }
  });
};

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
    const pixelXPos = calcPixelXPos(x, pixelSize, displayPaddingX);
    const pixelXCenterPos = calcPixelXCenterPos(pixelXPos, pixelSize);

    for (let y = 0; y < pixelCountY; y++) {
      const pixelYPos = calcPixelYPos(y, pixelSize, displayPaddingY);
      const pixelYCenterPos = calcPixelYCenterPos(pixelYPos, pixelSize);

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

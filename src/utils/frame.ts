import {
  type CanvasChunk,
  type FillStyle,
  type SignColors,
  type SignComputedValues,
  type Tuple,
} from "~/types";
import {
  getCanvasContext,
  getPixelHue,
  hslValuesToCss,
  isPixelOn,
} from "~/utils";

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
const TRANSPARENT_FRAME_COLOR = hslValuesToCss(0, 0, 0, 0);

const addMaskingColorStops = (gradient: CanvasGradient, frameColor: string) => {
  gradient.addColorStop(MASKING_GRADIENT_POSITION, frameColor);
  gradient.addColorStop(1, TRANSPARENT_FRAME_COLOR);
};

const addGlowMaskingColorStops = (
  gradient: CanvasGradient,
  start: number,
  end: number,
  frameColor: string
) => {
  gradient.addColorStop(start, frameColor);
  gradient.addColorStop(end, TRANSPARENT_FRAME_COLOR);
  gradient.addColorStop(1 - end, TRANSPARENT_FRAME_COLOR);
  gradient.addColorStop(1 - start, frameColor);
};

export const drawFrameMasking = (
  ctx: CanvasRenderingContext2D,
  computedValues: SignComputedValues,
  colors: SignColors
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
  addMaskingColorStops(maskingTop, colors.frame.color);

  const maskingRight = ctx.createLinearGradient(
    signWidth,
    0,
    signWidth - frameSize,
    0
  );
  addMaskingColorStops(maskingRight, colors.frame.color);

  const maskingBottom = ctx.createLinearGradient(
    signWidth,
    signHeight,
    signWidth,
    signHeight - frameSize
  );
  addMaskingColorStops(maskingBottom, colors.frame.color);

  const maskingLeft = ctx.createLinearGradient(0, 0, frameSize, 0);
  addMaskingColorStops(maskingLeft, colors.frame.color);

  drawFrameTopBorder(maskingTop);
  drawFrameRightBorder(maskingRight);
  drawFrameBottomBorder(maskingBottom);
  drawFrameLeftBorder(maskingLeft);

  const glowMaskingX = ctx.createLinearGradient(0, 0, signWidth, 0);
  const glowMaskingXStart = (frameSize + displayPaddingX) / signWidth;
  const glowMaskingXEnd = glowMaskingXStart + pixelSize / signWidth;
  addGlowMaskingColorStops(
    glowMaskingX,
    glowMaskingXStart,
    glowMaskingXEnd,
    colors.frame.color
  );

  const glowMaskingY = ctx.createLinearGradient(0, 0, 0, signHeight);
  const glowMaskingYStart = (frameSize + displayPaddingY) / signHeight;
  const glowMaskingYEnd = glowMaskingYStart + pixelSize / signHeight;
  addGlowMaskingColorStops(
    glowMaskingY,
    glowMaskingYStart,
    glowMaskingYEnd,
    colors.frame.color
  );

  drawFrameTopBorder(glowMaskingX);
  drawFrameRightBorder(glowMaskingY);
  drawFrameBottomBorder(glowMaskingX);
  drawFrameLeftBorder(glowMaskingY);
};

const FRAME_SHADING_OPACITY = 0.7;
const HORIZONTAL_SHADE_SIZE = 0.2;
const VERTICAL_SHADE_SIZE = 0.4;

const addShadingColorStops = (
  gradient: CanvasGradient,
  shadeColor: string,
  shadeSize: number,
  colors: SignColors
) => {
  const FRAME_SHADE_COLOR = hslValuesToCss(
    colors.frame.hue,
    colors.frame.saturation,
    colors.frame.lightness,
    FRAME_SHADING_OPACITY
  );

  gradient.addColorStop(0, shadeColor);
  gradient.addColorStop(shadeSize, FRAME_SHADE_COLOR);
  gradient.addColorStop(1 - shadeSize, FRAME_SHADE_COLOR);
  gradient.addColorStop(1, shadeColor);
};

export const drawFrameShading = (
  ctx: CanvasRenderingContext2D,
  computedValues: SignComputedValues,
  colors: SignColors
) => {
  const { signHeight, signWidth } = computedValues;
  const {
    drawFrameTopBorder,
    drawFrameRightBorder,
    drawFrameBottomBorder,
    drawFrameLeftBorder,
  } = getFrameUtils(ctx, computedValues);

  const HORIZONTAL_SHADE_COLOR = hslValuesToCss(
    colors.frame.hue,
    colors.frame.saturation,
    colors.frame.lightness + 5,
    FRAME_SHADING_OPACITY
  );
  const VERTICAL_SHADE_COLOR = hslValuesToCss(
    colors.frame.hue,
    colors.frame.saturation,
    colors.frame.lightness - 10,
    FRAME_SHADING_OPACITY
  );

  ctx.clearRect(0, 0, signWidth, signHeight);

  const shadingX = ctx.createLinearGradient(0, 0, signWidth, 0);
  addShadingColorStops(
    shadingX,
    HORIZONTAL_SHADE_COLOR,
    HORIZONTAL_SHADE_SIZE,
    colors
  );

  const shadingY = ctx.createLinearGradient(0, 0, 0, signHeight);
  addShadingColorStops(
    shadingY,
    VERTICAL_SHADE_COLOR,
    VERTICAL_SHADE_SIZE,
    colors
  );

  drawFrameTopBorder(shadingX);
  drawFrameRightBorder(shadingY);
  drawFrameBottomBorder(shadingX);
  drawFrameLeftBorder(shadingY);
};

const FULL_GLOW_OPACITY = 1;
const PART_GLOW_OPACITY = 0.5;

export const drawFrameHorizontalGlow = (
  canvasChunks: CanvasChunk[],
  computedValues: SignComputedValues,
  colors: SignColors,
  isImageSign: boolean
) => {
  const { signHeight, pixelSize, pixelCountY, pixelGrid, frameSize } =
    computedValues;

  let chunkIdx = -1;
  let ctx = null;
  let topGlow = null;
  let bottomGlow = null;
  let topOpacity = 0;
  let bottomOpacity = 0;
  let topPixelHue = 0;
  let bottomPixelHue = 0;
  let chunkWidth = 0;

  const addGlowColorStop = ({
    gradient,
    position,
    opacity,
    pixelHue = 0,
  }: {
    gradient: CanvasGradient;
    position: number;
    opacity: number;
    pixelHue?: number;
  }) => {
    gradient.addColorStop(
      position,
      hslValuesToCss(
        pixelHue,
        opacity === 0 ? colors.frame.saturation : colors.glow.saturation,
        opacity === 0 ? colors.frame.lightness : colors.glow.lightness,
        opacity
      )
    );
  };

  for (let x = 0; x < pixelGrid.length; x++) {
    const pixelXPos = x * pixelSize;

    if (!ctx || pixelXPos >= canvasChunks[chunkIdx].end) {
      // Add last color stop and draw chunk
      if (ctx && topGlow && bottomGlow) {
        addGlowColorStop({
          gradient: topGlow,
          position: 1,
          // Image sign is chunked to frames
          opacity: isImageSign ? 0 : topOpacity,
          pixelHue: topPixelHue,
        });
        ctx.fillStyle = topGlow;
        ctx.fillRect(0, 0, chunkWidth, frameSize);

        addGlowColorStop({
          gradient: bottomGlow,
          position: 1,
          opacity: isImageSign ? 0 : bottomOpacity,
          pixelHue: bottomPixelHue,
        });
        ctx.fillStyle = bottomGlow;
        ctx.fillRect(0, signHeight - frameSize, chunkWidth, frameSize);
      }

      ctx = getCanvasContext(canvasChunks[++chunkIdx].id, true);
      chunkWidth = canvasChunks[chunkIdx].end - canvasChunks[chunkIdx].start;

      // Create chunk gradients
      if (ctx) {
        ctx.clearRect(0, 0, chunkWidth, signHeight);

        topGlow = ctx.createLinearGradient(0, 0, chunkWidth, 0);
        addGlowColorStop({
          gradient: topGlow,
          position: 0,
          opacity: isImageSign ? 0 : topOpacity,
          pixelHue: topPixelHue,
        });

        bottomGlow = ctx.createLinearGradient(0, 0, chunkWidth, 0);
        addGlowColorStop({
          gradient: bottomGlow,
          position: 0,
          opacity: isImageSign ? 0 : bottomOpacity,
          pixelHue: bottomPixelHue,
        });
      }
    }

    // Add color stops for x value
    if (ctx && topGlow && bottomGlow) {
      const chunkPixelXPos = pixelXPos - canvasChunks[chunkIdx].start;
      const pixelXCenterPos = chunkPixelXPos + pixelSize / 2;
      const position = pixelXCenterPos / chunkWidth;

      const topPixelOn = isPixelOn(x, 0, pixelGrid);
      const secondTopPixelOn = isPixelOn(x, 1, pixelGrid);
      topOpacity = topPixelOn
        ? FULL_GLOW_OPACITY
        : secondTopPixelOn
        ? PART_GLOW_OPACITY
        : 0;

      const bottomPixelOn = isPixelOn(x, pixelCountY - 1, pixelGrid);
      const secondBottomPixelOn = isPixelOn(x, pixelCountY - 2, pixelGrid);
      bottomOpacity = bottomPixelOn
        ? FULL_GLOW_OPACITY
        : secondBottomPixelOn
        ? PART_GLOW_OPACITY
        : 0;

      const firstTopPixelHue = getPixelHue(x, 0, pixelGrid);
      const secondTopPixelHue = getPixelHue(x, 1, pixelGrid);
      topPixelHue = topPixelOn ? firstTopPixelHue : secondTopPixelHue;

      const firstBottomPixelHue = getPixelHue(x, pixelCountY - 1, pixelGrid);
      const secondBottomPixelHue = getPixelHue(x, pixelCountY - 2, pixelGrid);
      bottomPixelHue = bottomPixelOn
        ? firstBottomPixelHue
        : secondBottomPixelHue;

      addGlowColorStop({
        gradient: topGlow,
        position,
        opacity: topOpacity,
        pixelHue: topPixelHue,
      });
      addGlowColorStop({
        gradient: bottomGlow,
        position,
        opacity: bottomOpacity,
        pixelHue: bottomPixelHue,
      });
    }
  }

  // Draw last chunk
  if (ctx && topGlow && bottomGlow) {
    addGlowColorStop({ gradient: topGlow, position: 1, opacity: 0 });
    ctx.fillStyle = topGlow;
    ctx.fillRect(0, 0, chunkWidth, frameSize);

    addGlowColorStop({ gradient: bottomGlow, position: 1, opacity: 0 });
    ctx.fillStyle = bottomGlow;
    ctx.fillRect(0, signHeight - frameSize, chunkWidth, frameSize);
  }
};

export const drawFrameVerticalGlow = (
  canvasChunks: CanvasChunk[],
  computedValues: SignComputedValues,
  colors: SignColors,
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

  let chunkIdx = -1;
  let ctx = null;
  let glow = null;
  let chunkWidth = 0;

  const addGlowColorStop = ({
    gradient,
    position,
    opacity,
    pixelHue = 0,
  }: {
    gradient: CanvasGradient;
    position: number;
    opacity: number;
    pixelHue?: number;
  }) => {
    gradient.addColorStop(
      position,
      hslValuesToCss(
        pixelHue,
        opacity === 0 ? colors.frame.saturation : colors.glow.saturation,
        opacity === 0 ? colors.frame.lightness : colors.glow.lightness,
        opacity
      )
    );
  };

  for (let x = 0; x < pixelGrid.length; x++) {
    const currentXPos = x * frameSize;

    // New chunk
    if (!ctx || currentXPos >= canvasChunks[chunkIdx].end) {
      ctx = getCanvasContext(canvasChunks[++chunkIdx].id, true);
      chunkWidth = canvasChunks[chunkIdx].end - canvasChunks[chunkIdx].start;

      if (ctx) {
        ctx.clearRect(0, 0, chunkWidth, pixelAreaHeight);
      }
    }

    if (ctx) {
      const chunkXPos = currentXPos - canvasChunks[chunkIdx].start;

      // Create gradient for x value
      glow = ctx.createLinearGradient(chunkXPos, 0, chunkXPos, pixelAreaHeight);
      addGlowColorStop({ gradient: glow, position: 0, opacity: 0 });

      // Add color stops for y values
      for (let y = 0; y < pixelCountY; y++) {
        const pixelYPos = y * pixelSize;
        const pixelYCenterPos = pixelYPos + pixelSize / 2;
        const position = pixelYCenterPos / pixelAreaHeight;

        const currentPixelHue =
          side === "right"
            ? getPixelHue(x + pixelCountX - 1, y, pixelGrid)
            : getPixelHue(x, y, pixelGrid);
        const nextPixelHue =
          side === "right"
            ? getPixelHue(x + pixelCountX - 2, y, pixelGrid)
            : getPixelHue(x + 1, y, pixelGrid);

        const isCurrentPixelOn =
          side === "right"
            ? isPixelOn(x + pixelCountX - 1, y, pixelGrid)
            : isPixelOn(x, y, pixelGrid);
        const isNextPixelOn =
          side === "right"
            ? isPixelOn(x + pixelCountX - 2, y, pixelGrid)
            : isPixelOn(x + 1, y, pixelGrid);

        const glowOpacity = isCurrentPixelOn
          ? FULL_GLOW_OPACITY
          : isNextPixelOn
          ? PART_GLOW_OPACITY
          : 0;
        const pixelHue = isCurrentPixelOn ? currentPixelHue : nextPixelHue;

        addGlowColorStop({
          gradient: glow,
          position,
          opacity: glowOpacity,
          pixelHue,
        });
      }

      // Add last color stop and draw gradient
      addGlowColorStop({ gradient: glow, position: 1, opacity: 0 });
      ctx.fillStyle = glow;
      ctx.fillRect(chunkXPos, 0, frameSize, pixelAreaHeight);
    }
  }
};

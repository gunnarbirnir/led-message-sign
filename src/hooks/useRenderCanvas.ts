import { useEffect } from "react";

import { SignConfig } from "../types";
import {
  calcFrameId,
  calcDisplayId,
  calcFrameSize,
  calcDisplayHeight,
  calcDisplayWidth,
  calcDisplayVerticalPadding,
  calcPixelAreaHeight,
  calcPixelSize,
  calcHorizontalPixelCount,
  calcPixelAreaWidth,
  calcDisplayHorizontalPadding,
} from "../utils";
import { getCanvasContext, drawFrame, drawDisplay } from "../utils/canvas";
import { CANVAS_SCALING, VERTICAL_PIXEL_COUNT } from "../constants";

const getComputedValues = (config: SignConfig) => {
  const signHeight = config.height * CANVAS_SCALING;
  const signWidth = config.width * CANVAS_SCALING;
  const frameSize = calcFrameSize(signHeight, config.frameProportion);
  const displayHeight = calcDisplayHeight(signHeight, frameSize);
  const displayWidth = calcDisplayWidth(signWidth, frameSize);
  const displayPaddingY = calcDisplayVerticalPadding(signHeight);
  const pixelAreaHeight = calcPixelAreaHeight(displayHeight, displayPaddingY);
  const pixelSize = calcPixelSize(pixelAreaHeight);
  const pixelCountX = calcHorizontalPixelCount(
    displayWidth,
    displayPaddingY,
    pixelSize
  );
  const pixelAreaWidth = calcPixelAreaWidth(pixelSize, pixelCountX);
  const displayPaddingX = calcDisplayHorizontalPadding(
    displayWidth,
    pixelAreaWidth
  );
  const pixelCountY = VERTICAL_PIXEL_COUNT;

  return {
    signHeight,
    signWidth,
    frameSize,
    displayHeight,
    displayWidth,
    displayPaddingY,
    displayPaddingX,
    pixelAreaHeight,
    pixelAreaWidth,
    pixelSize,
    pixelCountX,
    pixelCountY,
  };
};

const useRenderCanvas = (config: SignConfig) => {
  useEffect(() => {
    let animationFrame = 0;
    const frameId = calcFrameId(config.id);
    const frameCtx = getCanvasContext(frameId);
    const displayId = calcDisplayId(config.id);
    const displayCtx = getCanvasContext(displayId);
    const computedValues = getComputedValues(config);

    const renderCanvas = () => {
      if (frameCtx) {
        drawFrame(frameCtx, computedValues, animationFrame);
      }
      if (displayCtx) {
        drawDisplay(displayCtx, computedValues, animationFrame);
      }
      animationFrame = requestAnimationFrame(renderCanvas);
    };
    renderCanvas();

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [config]);
};

export default useRenderCanvas;

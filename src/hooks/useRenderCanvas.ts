import { useEffect } from "react";

import { SignConfig } from "../types";
import {
  calcFrameId,
  calcDisplayId,
  calcFrameSize,
  calcDisplayHeight,
  calcDisplayWidth,
  calcDisplayPaddingY,
  calcPixelSize,
  calcPixelCountX,
  calcDisplayPaddingX,
  calcPixelGrid,
} from "../utils";
import { getCanvasContext, drawFrame, drawDisplay } from "../utils/canvas";
import { CANVAS_SCALING, VERTICAL_PIXEL_COUNT } from "../constants";

const getComputedValues = (config: SignConfig) => {
  const signHeight = config.height * CANVAS_SCALING;
  const signWidth = config.width * CANVAS_SCALING;
  const frameSize = calcFrameSize(signHeight, config.frameProportion);
  const displayHeight = calcDisplayHeight(signHeight, frameSize);
  const displayWidth = calcDisplayWidth(signWidth, frameSize);
  const displayPaddingY = calcDisplayPaddingY(signHeight);
  const pixelSize = calcPixelSize(displayHeight, displayPaddingY);
  const pixelCountX = calcPixelCountX(displayWidth, displayPaddingY, pixelSize);
  const displayPaddingX = calcDisplayPaddingX(
    displayWidth,
    pixelSize,
    pixelCountX
  );
  const pixelCountY = VERTICAL_PIXEL_COUNT;
  const pixelGrid = calcPixelGrid(config.text, pixelCountX);

  return {
    signHeight,
    signWidth,
    frameSize,
    displayHeight,
    displayWidth,
    displayPaddingY,
    displayPaddingX,
    pixelSize,
    pixelCountX,
    pixelCountY,
    pixelGrid,
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
        drawFrame(frameCtx, computedValues, config, animationFrame);
      }
      if (displayCtx) {
        drawDisplay(displayCtx, computedValues, config, animationFrame);
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

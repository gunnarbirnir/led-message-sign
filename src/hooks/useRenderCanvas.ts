import { useEffect } from "react";

import { SignConfig } from "../types";
import {
  calcFrameIds,
  calcDisplayIds,
  calcFrameSize,
  calcDisplayHeight,
  calcDisplayWidth,
  calcDisplayPaddingY,
  calcPixelSize,
  calcPixelCountX,
  calcDisplayPaddingX,
  calcPixelGrid,
  calcAnimationOffset,
  isWholeNumber,
} from "../utils";
import {
  getCanvasContext,
  drawDisplayOnLights,
  drawDisplayOffLights,
  drawFrameGlow,
  drawFrameMasking,
  drawFrameShading,
} from "../utils/canvas";
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
    const prevPixelState: Record<string, boolean> = {};
    const { frameGlowId, frameMaskingId, frameShadingId } = calcFrameIds(
      config.id
    );
    const computedValues = getComputedValues(config);

    const frameGlowCtx = getCanvasContext(frameGlowId);
    const frameMaskingCtx = getCanvasContext(frameMaskingId, true);
    const frameShadingCtx = getCanvasContext(frameShadingId, true);

    const { displayOnLightsId, displayOffLightsId } = calcDisplayIds(config.id);
    const displayOnLightsCtx = getCanvasContext(displayOnLightsId, true);
    const displayOffLightsCtx = getCanvasContext(displayOffLightsId);

    const animateCanvas = () => {
      const animationOffset = calcAnimationOffset(
        animationFrame,
        config.animationFramesPerUpdate
      );

      if (isWholeNumber(animationOffset)) {
        if (frameGlowCtx) {
          drawFrameGlow(frameGlowCtx, computedValues, config, animationOffset);
        }
        if (displayOnLightsCtx) {
          drawDisplayOnLights(
            displayOnLightsCtx,
            computedValues,
            config,
            animationOffset,
            prevPixelState
          );
        }
      }

      animationFrame = requestAnimationFrame(animateCanvas);
    };
    animateCanvas();

    if (frameMaskingCtx) {
      drawFrameMasking(frameMaskingCtx, computedValues);
    }
    if (frameShadingCtx) {
      drawFrameShading(frameShadingCtx, computedValues);
    }
    if (displayOffLightsCtx) {
      drawDisplayOffLights(displayOffLightsCtx, computedValues, config);
    }

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [config]);
};

export default useRenderCanvas;

import { useEffect, useRef } from "react";

import { SignConfig } from "../types";
import {
  calcFrameIds,
  calcDisplayIds,
  calcFrameSize,
  calcDisplayHeight,
  calcDisplayWidth,
  calcPixelAreaHeight,
  calcPixelAreaWidth,
  calcDisplayPaddingY,
  calcPixelSize,
  calcPixelCountX,
  calcDisplayPaddingX,
  calcPixelGrid,
  calcImageWidth,
  calcAnimationOffset,
} from "../utils";
import {
  getCanvasContext,
  getOnLightsImageChunks,
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
  const pixelAreaHeight = calcPixelAreaHeight(displayHeight, displayPaddingY);
  const pixelSize = calcPixelSize(pixelAreaHeight);
  const pixelCountX = calcPixelCountX(displayWidth, displayPaddingY, pixelSize);
  const pixelAreaWidth = calcPixelAreaWidth(pixelSize, pixelCountX);
  const displayPaddingX = calcDisplayPaddingX(displayWidth, pixelAreaWidth);
  const pixelCountY = VERTICAL_PIXEL_COUNT;
  const pixelGrid = calcPixelGrid(config.text, pixelCountX);
  const imageWidth = calcImageWidth(pixelSize, pixelGrid);

  return {
    signHeight,
    signWidth,
    frameSize,
    displayHeight,
    displayWidth,
    pixelAreaHeight,
    pixelAreaWidth,
    displayPaddingY,
    displayPaddingX,
    pixelSize,
    pixelCountX,
    pixelCountY,
    pixelGrid,
    imageWidth,
  };
};

const useRenderCanvas = (config: SignConfig) => {
  // So animation starts again when props change
  const startAnimationFrame = useRef(0);

  useEffect(() => {
    let animationFrame = 0;
    let lastUpdate = 0;

    const { frameGlowId, frameMaskingId, frameShadingId } = calcFrameIds(
      config.id
    );
    const computedValues = getComputedValues(config);
    const onLightsImageChunks = getOnLightsImageChunks(computedValues, config);

    const frameGlowCtx = getCanvasContext(frameGlowId);
    const frameMaskingCtx = getCanvasContext(frameMaskingId, true);
    const frameShadingCtx = getCanvasContext(frameShadingId, true);

    const { displayOnLightsId, displayOffLightsId } = calcDisplayIds(config.id);
    const displayOnLightsCtx = getCanvasContext(displayOnLightsId, true);
    const displayOffLightsCtx = getCanvasContext(displayOffLightsId);

    const animateCanvas = () => {
      const animationOffset = calcAnimationOffset(
        animationFrame - startAnimationFrame.current,
        config.animationFramesPerUpdate
      );

      if (animationOffset > lastUpdate) {
        if (frameGlowCtx) {
          drawFrameGlow(frameGlowCtx, computedValues, config, animationOffset);
        }
        if (displayOnLightsCtx) {
          drawDisplayOnLights(
            displayOnLightsCtx,
            computedValues,
            animationOffset,
            onLightsImageChunks
          );
        }
        lastUpdate = animationOffset;
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
      startAnimationFrame.current = animationFrame;
      cancelAnimationFrame(animationFrame);
    };
  }, [config]);
};

export default useRenderCanvas;

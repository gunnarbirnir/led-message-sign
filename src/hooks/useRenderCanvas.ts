import { useEffect } from "react";

import { SignConfig } from "../types";
import { calcFrameIds, calcDisplayIds, calcComputedValues } from "../utils";
import {
  getCanvasContext,
  getOnLightsImageChunks,
  drawDisplayOnLights,
  drawDisplayOffLights,
  drawFrameGlow,
  drawFrameMasking,
  drawFrameShading,
} from "../utils/canvas";

const useRenderCanvas = (config: SignConfig) => {
  useEffect(() => {
    let animationFrame = 0;
    let lastUpdate = 0;
    let animationOffset = 0;
    const updatesPerSecond = 60 / config.animationFramesPerUpdate;
    const updateInterval = Math.floor(1000 / updatesPerSecond);

    const { frameGlowId, frameMaskingId, frameShadingId } = calcFrameIds(
      config.id
    );
    const computedValues = calcComputedValues(config);
    const onLightsImageChunks = getOnLightsImageChunks(computedValues, config);

    const frameGlowCtx = getCanvasContext(frameGlowId);
    const frameMaskingCtx = getCanvasContext(frameMaskingId, true);
    const frameShadingCtx = getCanvasContext(frameShadingId, true);

    const { displayOnLightsId, displayOffLightsId } = calcDisplayIds(config.id);
    const displayOnLightsCtx = getCanvasContext(displayOnLightsId, true);
    const displayOffLightsCtx = getCanvasContext(displayOffLightsId);

    const animateCanvas = (now: number) => {
      const elapsed = now - lastUpdate;

      if (elapsed >= updateInterval) {
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

        animationOffset =
          (animationOffset + 1) % computedValues.pixelGrid.length;
        lastUpdate = now;
      }

      animationFrame = requestAnimationFrame(animateCanvas);
    };
    animateCanvas(0);

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

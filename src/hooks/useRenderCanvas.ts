import { useEffect } from "react";

import { SignConfig } from "../types";
import { calcFrameId, calcDisplayId } from "../utils";
import { getCanvasContext, drawFrame, drawDisplay } from "../utils/canvas";
import { CANVAS_SCALING } from "../constants";

const useRenderCanvas = (config: SignConfig) => {
  useEffect(() => {
    let animationFrame = 0;
    const frameId = calcFrameId(config.id);
    const frameCtx = getCanvasContext(frameId);
    const displayId = calcDisplayId(config.id);
    const displayCtx = getCanvasContext(displayId);
    const adjustedConfig = {
      ...config,
      height: config.height * CANVAS_SCALING,
      width: config.width * CANVAS_SCALING,
    };

    const renderCanvas = () => {
      if (frameCtx) {
        drawFrame(frameCtx, adjustedConfig, animationFrame);
      }
      if (displayCtx) {
        drawDisplay(displayCtx, adjustedConfig, animationFrame);
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

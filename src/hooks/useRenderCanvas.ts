import { useEffect } from "react";

import { SignConfig } from "../types";
import { calcFrameId } from "../utils";
import { getCanvasContext, drawFrame } from "../utils/canvas";

const useRenderCanvas = (config: SignConfig) => {
  useEffect(() => {
    const frameId = calcFrameId(config.id);
    const frameCtx = getCanvasContext(frameId);

    let animationFrame = 0;
    const renderCanvas = () => {
      drawFrame(frameCtx, config, animationFrame);
      // drawMessage(config, animationFrame);

      animationFrame = requestAnimationFrame(renderCanvas);
    };
    renderCanvas();

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [config]);
};

export default useRenderCanvas;

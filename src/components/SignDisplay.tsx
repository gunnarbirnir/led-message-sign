import React, { FC, useMemo, useEffect } from "react";

import { useSignContext } from "../hooks";
import { getSignIds } from "../utils";
import { getCanvasContext, getCanvasChunks } from "../utils/canvas";
import { drawDisplayOffLights, drawDisplayOnLights } from "../utils/display";
import Canvas from "./Canvas";
import AnimationContainer from "./AnimationContainer";
import CanvasChunks from "./CanvasChunks";

const SignDisplay: FC = () => {
  const { config, computedValues, colors } = useSignContext();
  const { id, staticMode } = config;
  const {
    pixelSize,
    displayWidth,
    displayHeight,
    pixelAreaHeight,
    pixelAreaWidth,
    displayPaddingX,
    displayPaddingY,
    pixelGrid,
    pixelGridWidth,
    pixelCountX,
  } = computedValues;

  const { displayOnLightsId, displayOffLightsId, onLightsAnimationId } =
    getSignIds(id);
  const onLightsCanvasChunks = useMemo(
    () => getCanvasChunks(displayOnLightsId, pixelSize, pixelGrid.length),
    [displayOnLightsId, pixelSize, pixelGrid.length]
  );
  const initPixelTransform = staticMode ? pixelSize * pixelCountX : undefined;

  useEffect(() => {
    const displayOffLightsCtx = getCanvasContext(displayOffLightsId);

    if (displayOffLightsCtx) {
      drawDisplayOffLights(displayOffLightsCtx, computedValues, colors);
    }
  }, [displayOffLightsId, computedValues, colors]);

  useEffect(() => {
    drawDisplayOnLights(onLightsCanvasChunks, computedValues, colors);
  }, [onLightsCanvasChunks, computedValues, colors]);

  return (
    <div
      style={{
        position: "relative",
        width: displayWidth,
        height: displayHeight,
        backgroundColor: colors.background.color,
      }}
    >
      <Canvas
        id={displayOffLightsId}
        height={displayHeight}
        width={displayWidth}
        style={{ position: "absolute", top: 0, left: 0 }}
      />
      <div
        style={{
          position: "absolute",
          overflow: "hidden",
          top: displayPaddingY,
          left: displayPaddingX,
          height: pixelAreaHeight,
          width: pixelAreaWidth,
        }}
      >
        <AnimationContainer
          id={onLightsAnimationId}
          width={pixelGridWidth}
          initTranslateX={initPixelTransform}
        >
          <CanvasChunks
            chunks={onLightsCanvasChunks}
            height={pixelAreaHeight}
          />
        </AnimationContainer>
      </div>
    </div>
  );
};

export default SignDisplay;

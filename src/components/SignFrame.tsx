import React, { FC, PropsWithChildren, useMemo, useEffect } from "react";

import { useSignContext } from "../hooks";
import { getSignIds } from "../utils";
import { getCanvasChunks, getCanvasContext } from "../utils/canvas";
import {
  drawFrameMasking,
  drawFrameShading,
  drawFrameHorizontalGlow,
  drawFrameVerticalGlow,
} from "../utils/frame";
import Canvas from "./Canvas";
import AnimationContainer from "./AnimationContainer";
import CanvasChunks from "./CanvasChunks";

const SignFrame: FC<PropsWithChildren> = ({ children }) => {
  const { config, computedValues, colors } = useSignContext();
  const { id, staticMode } = config;
  const {
    signHeight,
    signWidth,
    pixelSize,
    frameSize,
    pixelGridWidth,
    displayPaddingX,
    displayPaddingY,
    pixelGrid,
    pixelAreaWidth,
    pixelAreaHeight,
    pixelCountX,
  } = computedValues;

  const {
    frameHorizontalGlowId,
    frameLeftGlowId,
    frameRightGlowId,
    frameMaskingId,
    frameShadingId,
    horizontalGlowAnimationId,
    leftGlowAnimationId,
    rightGlowAnimationId,
  } = getSignIds(id);

  const horizontalGlowCanvasChunks = useMemo(
    () => getCanvasChunks(frameHorizontalGlowId, pixelSize, pixelGrid.length),
    [frameHorizontalGlowId, pixelSize, pixelGrid.length]
  );
  const leftGlowCanvasChunks = useMemo(
    () => getCanvasChunks(frameLeftGlowId, frameSize, pixelGrid.length),
    [frameLeftGlowId, frameSize, pixelGrid.length]
  );
  const rightGlowCanvasChunks = useMemo(
    () => getCanvasChunks(frameRightGlowId, frameSize, pixelGrid.length),
    [frameRightGlowId, frameSize, pixelGrid.length]
  );

  const verticalGlowStyle = {
    top: frameSize + displayPaddingY,
    width: frameSize,
    height: pixelAreaHeight,
  };
  const initFrameTransform = staticMode ? frameSize * pixelCountX : undefined;
  const initPixelTransform = staticMode ? pixelSize * pixelCountX : undefined;

  useEffect(() => {
    const frameMaskingCtx = getCanvasContext(frameMaskingId, true);
    const frameShadingCtx = getCanvasContext(frameShadingId, true);

    if (frameMaskingCtx) {
      drawFrameMasking(frameMaskingCtx, computedValues, colors);
    }
    if (frameShadingCtx) {
      drawFrameShading(frameShadingCtx, computedValues, colors);
    }
  }, [frameMaskingId, frameShadingId, computedValues, colors]);

  useEffect(() => {
    drawFrameHorizontalGlow(horizontalGlowCanvasChunks, computedValues, colors);
    drawFrameVerticalGlow(leftGlowCanvasChunks, computedValues, colors);
    drawFrameVerticalGlow(
      rightGlowCanvasChunks,
      computedValues,
      colors,
      "right"
    );
  }, [
    computedValues,
    colors,
    horizontalGlowCanvasChunks,
    leftGlowCanvasChunks,
    rightGlowCanvasChunks,
  ]);

  return (
    <div
      style={{
        position: "relative",
        height: signHeight,
        width: signWidth,
        backgroundColor: colors.frame.color,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          overflow: "hidden",
          height: signHeight,
          width: pixelAreaWidth,
          left: frameSize + displayPaddingX,
        }}
      >
        <AnimationContainer
          id={horizontalGlowAnimationId}
          width={pixelGridWidth}
          initTranslateX={initPixelTransform}
        >
          <CanvasChunks
            chunks={horizontalGlowCanvasChunks}
            height={signHeight}
          />
        </AnimationContainer>
      </div>

      <div
        style={{
          ...verticalGlowStyle,
          left: 0,
          position: "absolute",
          overflow: "hidden",
        }}
      >
        <AnimationContainer
          id={leftGlowAnimationId}
          width={pixelGrid.length * frameSize}
          initTranslateX={initFrameTransform}
        >
          <CanvasChunks
            chunks={leftGlowCanvasChunks}
            height={pixelAreaHeight}
          />
        </AnimationContainer>
      </div>

      <div
        style={{
          ...verticalGlowStyle,
          left: signWidth - frameSize,
          position: "absolute",
          overflow: "hidden",
        }}
      >
        <AnimationContainer
          id={rightGlowAnimationId}
          width={pixelGrid.length * frameSize}
          initTranslateX={initFrameTransform}
        >
          <CanvasChunks
            chunks={rightGlowCanvasChunks}
            height={pixelAreaHeight}
          />
        </AnimationContainer>
      </div>

      <Canvas
        id={frameMaskingId}
        height={signHeight}
        width={signWidth}
        style={{ position: "absolute", top: 0, left: 0 }}
      />
      <Canvas
        id={frameShadingId}
        height={signHeight}
        width={signWidth}
        style={{ position: "absolute", top: 0, left: 0 }}
      />
      <div style={{ position: "absolute", top: frameSize, left: frameSize }}>
        {children}
      </div>
    </div>
  );
};

export default SignFrame;

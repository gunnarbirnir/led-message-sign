import React, {
  type FC,
  type PropsWithChildren,
  useEffect,
  useMemo,
} from "react";

import { useSignContext } from "~/hooks";
import { getCanvasChunks, getCanvasContext, getSignIds } from "~/utils";
import {
  drawFrameHorizontalGlow,
  drawFrameMasking,
  drawFrameShading,
  drawFrameVerticalGlow,
} from "~/utils/frame";

import AnimationContainer from "./AnimationContainer";
import Canvas from "./Canvas";
import CanvasChunks from "./CanvasChunks";

// To prevent overflow
const OFFSET_PADDING = 1;

const SignFrame: FC<PropsWithChildren & { isImageSign?: boolean }> = ({
  children,
  isImageSign = false,
}) => {
  const { id, shiftByPixels, computedValues, colors } = useSignContext();
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

  const pixelsPerChunk = isImageSign ? pixelCountX : null;
  const horizontalGlowCanvasChunks = useMemo(
    () =>
      getCanvasChunks(
        frameHorizontalGlowId,
        pixelSize,
        pixelGrid.length,
        pixelsPerChunk
      ),
    [frameHorizontalGlowId, pixelSize, pixelGrid.length, pixelsPerChunk]
  );
  const leftGlowCanvasChunks = useMemo(
    () =>
      getCanvasChunks(
        frameLeftGlowId,
        frameSize,
        pixelGrid.length,
        pixelsPerChunk
      ),
    [frameLeftGlowId, frameSize, pixelGrid.length, pixelsPerChunk]
  );
  const rightGlowCanvasChunks = useMemo(
    () =>
      getCanvasChunks(
        frameRightGlowId,
        frameSize,
        pixelGrid.length,
        pixelsPerChunk
      ),
    [frameRightGlowId, frameSize, pixelGrid.length, pixelsPerChunk]
  );

  const horizontalGlowHeight = signHeight - 2 * OFFSET_PADDING;
  const verticalGlowStyle = {
    top: frameSize + displayPaddingY,
    width: frameSize - OFFSET_PADDING,
    height: pixelAreaHeight,
  };
  const initFrameTransform = shiftByPixels
    ? frameSize * shiftByPixels
    : undefined;
  const initPixelTransform = shiftByPixels
    ? pixelSize * shiftByPixels
    : undefined;

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
    drawFrameHorizontalGlow(
      horizontalGlowCanvasChunks,
      { ...computedValues, signHeight: horizontalGlowHeight },
      colors,
      isImageSign
    );
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
    isImageSign,
    horizontalGlowHeight,
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
          top: OFFSET_PADDING,
          overflow: "hidden",
          height: horizontalGlowHeight,
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
            height={horizontalGlowHeight}
          />
        </AnimationContainer>
      </div>

      <div
        style={{
          ...verticalGlowStyle,
          left: OFFSET_PADDING,
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

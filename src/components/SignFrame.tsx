import React, { FC, PropsWithChildren, useMemo, useEffect } from "react";
import styled from "styled-components";

import { useSignContext } from "../hooks";
import { COLORS } from "../constants/colors";
import { getSignIds } from "../utils";
import {
  getCanvasChunks,
  getCanvasContext,
  drawFrameMasking,
  drawFrameShading,
  drawFrameGlow,
  drawFrameVerticalGlow,
} from "../utils/canvas";
import Canvas from "./Canvas";
import AnimationContainer from "./AnimationContainer";

const SignFrame: FC<PropsWithChildren> = ({ children }) => {
  const { config, computedValues } = useSignContext();
  const { id, height, width } = config;
  const {
    pixelSize,
    frameSize,
    pixelGridWidth,
    displayPaddingX,
    displayPaddingY,
    pixelGrid,
    pixelAreaWidth,
    pixelAreaHeight,
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
  } = useMemo(() => getSignIds(id), [id]);

  const horizontalGlowCanvasChunks = useMemo(
    () => getCanvasChunks(frameHorizontalGlowId, pixelSize, pixelGrid.length),
    [frameHorizontalGlowId, pixelGrid.length, pixelSize]
  );
  const leftGlowCanvasChunks = useMemo(
    () => getCanvasChunks(frameLeftGlowId, frameSize, pixelGrid.length),
    [frameLeftGlowId, frameSize, pixelGrid.length]
  );
  const rightGlowCanvasChunks = useMemo(
    () => getCanvasChunks(frameRightGlowId, frameSize, pixelGrid.length),
    [frameRightGlowId, frameSize, pixelGrid.length]
  );

  useEffect(() => {
    const frameMaskingCtx = getCanvasContext(frameMaskingId, true);
    const frameShadingCtx = getCanvasContext(frameShadingId, true);

    if (frameMaskingCtx) {
      drawFrameMasking(frameMaskingCtx, computedValues);
    }
    if (frameShadingCtx) {
      drawFrameShading(frameShadingCtx, computedValues);
    }
  }, [frameMaskingId, frameShadingId, computedValues]);

  useEffect(() => {
    drawFrameGlow(horizontalGlowCanvasChunks, computedValues, config);
    drawFrameVerticalGlow(leftGlowCanvasChunks, computedValues, config);
    drawFrameVerticalGlow(
      rightGlowCanvasChunks,
      computedValues,
      config,
      "right"
    );
  }, [
    computedValues,
    config,
    horizontalGlowCanvasChunks,
    leftGlowCanvasChunks,
    rightGlowCanvasChunks,
  ]);

  if (!width) {
    return null;
  }

  return (
    <StyledSignFrame style={{ height, width }}>
      <FrameGlow
        style={{
          height,
          width: pixelAreaWidth,
          left: frameSize + displayPaddingX,
        }}
      >
        <AnimationContainer
          id={horizontalGlowAnimationId}
          width={pixelGridWidth}
        >
          {horizontalGlowCanvasChunks.map((chunk) => (
            <Canvas
              id={chunk.id}
              key={chunk.id}
              height={height}
              width={chunk.end - chunk.start}
            />
          ))}
        </AnimationContainer>
      </FrameGlow>
      <FrameVerticalGlow
        style={{
          top: frameSize + displayPaddingY,
          left: 0,
          width: frameSize,
          height: pixelAreaHeight,
        }}
      >
        <AnimationContainer
          id={leftGlowAnimationId}
          width={pixelGrid.length * frameSize}
        >
          {leftGlowCanvasChunks.map((chunk) => (
            <Canvas
              id={chunk.id}
              key={chunk.id}
              height={pixelAreaHeight}
              width={chunk.end - chunk.start}
            />
          ))}
        </AnimationContainer>
      </FrameVerticalGlow>
      <FrameVerticalGlow
        style={{
          top: frameSize + displayPaddingY,
          left: width - frameSize,
          width: frameSize,
          height: pixelAreaHeight,
        }}
      >
        <AnimationContainer
          id={rightGlowAnimationId}
          width={pixelGrid.length * frameSize}
        >
          {rightGlowCanvasChunks.map((chunk) => (
            <Canvas
              id={chunk.id}
              key={chunk.id}
              height={pixelAreaHeight}
              width={chunk.end - chunk.start}
            />
          ))}
        </AnimationContainer>
      </FrameVerticalGlow>
      <FrameLayer id={frameMaskingId} height={height} width={width} />
      <FrameLayer id={frameShadingId} height={height} width={width} />
      <SignContent style={{ top: frameSize, left: frameSize }}>
        {children}
      </SignContent>
    </StyledSignFrame>
  );
};

const StyledSignFrame = styled.div`
  position: relative;
  background-color: ${COLORS.FRAME};
`;

const FrameLayer = styled(Canvas)`
  position: absolute;
  top: 0;
  left: 0;
`;

const FrameGlow = styled.div`
  position: absolute;
  top: 0;
  overflow: hidden;

  & > div {
    display: flex;
    flex-direction: row;
  }
`;

const FrameVerticalGlow = styled.div`
  position: absolute;
  overflow: hidden;

  & > div {
    display: flex;
    flex-direction: row;
  }
`;

const SignContent = styled.div`
  position: absolute;
`;

export default SignFrame;

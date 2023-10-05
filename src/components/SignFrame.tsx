import React, { FC, PropsWithChildren, useMemo, useEffect } from "react";
import styled from "styled-components";

import { useSignContext } from "../hooks";
import { COLORS } from "../constants/colors";
import { getSignIds } from "../utils";
import {
  getCanvasChunks,
  getVerticalGlowCanvasChunks,
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
    frameSize,
    pixelGridWidth,
    displayPaddingX,
    displayPaddingY,
    pixelGrid,
    pixelAreaWidth,
    pixelAreaHeight,
  } = computedValues;

  const {
    frameGlowHorizontalId,
    frameGlowVerticalLeftId,
    frameGlowVerticalRightId,
    frameMaskingId,
    frameShadingId,
    horizontalGlowAnimationId,
    leftGlowAnimationId,
    rightGlowAnimationId,
  } = useMemo(() => getSignIds(id), [id]);

  const frameGlowCanvasChunks = getCanvasChunks(
    frameGlowHorizontalId,
    computedValues
  );
  const frameVerticalLeftGlowCanvasChunks = getVerticalGlowCanvasChunks(
    frameGlowVerticalLeftId,
    computedValues
  );
  const frameVerticalRightGlowCanvasChunks = getVerticalGlowCanvasChunks(
    frameGlowVerticalRightId,
    computedValues
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
    drawFrameGlow(frameGlowCanvasChunks, computedValues, config);
    drawFrameVerticalGlow(
      frameVerticalLeftGlowCanvasChunks,
      computedValues,
      config
    );
    drawFrameVerticalGlow(
      frameVerticalRightGlowCanvasChunks,
      computedValues,
      config,
      "right"
    );
  }, [
    frameGlowCanvasChunks,
    frameVerticalLeftGlowCanvasChunks,
    frameVerticalRightGlowCanvasChunks,
    computedValues,
    config,
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
          {frameGlowCanvasChunks.map((chunk) => (
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
          {frameVerticalLeftGlowCanvasChunks.map((chunk) => (
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
          {frameVerticalRightGlowCanvasChunks.map((chunk) => (
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
